angularApp.controller('WidgetModalCtrl', function($scope, $sce, $uibModal, $uibModalInstance, $compile, $timeout, $parse, $q, vfr, HomepageBuilderService, parentScope, number) {
	//static resource
	$scope.res = {};
	$scope.res.NGD_SLDS = NGD_SLDS;
	$scope.res.NGD_Utilities = NGD_Utilities;
	$scope.res.NGD_HomepageBuilderAssets = NGD_HomepageBuilderAssets;

	//namespacePrefix for package
	$scope.namespacePrefix = namespacePrefix;

	$scope.number = number; // widget number

	HomepageBuilderService.getHomepageWidgets(number).then(function(hwList) {
		$scope.hwListSafe = hwList;
		//copy the references (you could clone ie angular.copy but then have to go through a dirty checking for the matches)
		$scope.hwList = [].concat($scope.hwListSafe);
	});

	$scope.objectOptions = HomepageBuilderService.getObjectOptions();
	$scope.operatorOptions = HomepageBuilderService.getOperatorOptions();
	$scope.typeOptions = HomepageBuilderService.getTypeOptions();

	$scope.HomepageWidgetTooltip = $sce.trustAsHtml('Info');

	$scope.refresh = function() {
		toggleSpin(true);
		HomepageBuilderService.getHomepageWidgets(number).then(function(hwList) {
			$scope.hwListSafe = hwList;
			//copy the references (you could clone ie angular.copy but then have to go through a dirty checking for the matches)
			$scope.hwList = [].concat($scope.hwListSafe);
			toggleSpin(false);
		});
	};

	$scope.setActive = function(hw) {
		if (hw.isSelected !== undefined)
			delete hw.isSelected;
		vfr.upsertData(NGD_Constant.HOMEPAGE_WIDGET, angular.toJson(hw),
			function(result, event) {
				if (event.status) {
					HomepageBuilderService.getHomepageWidgets(number).then(function(hwList) {
						$scope.hwListSafe = hwList;
						//copy the references (you could clone ie angular.copy but then have to go through a dirty checking for the matches)
						$scope.hwList = [].concat($scope.hwListSafe);
					});
				} else
					logError(event.message);
			}
		);
	};

	$scope.setDefaultActive = function(selectedWidget){
		$timeout(function(){
			if(selectedWidget[namespacePrefix+'Default__c'])
				selectedWidget[namespacePrefix+'Is_Active__c']=true;
		});
	};

	$scope.new = function() {
		$scope.form.$submitted = false;

		$scope.selectedWidget = {};
		$scope.selectedWidget.Name = '';
		$scope.selectedWidget[namespacePrefix + 'Number__c'] = $scope.number;
		$scope.selectedWidget[namespacePrefix + 'Criteria__c'] = '';
		$scope.selectedWidget[namespacePrefix + 'Criteria_Filter_Logic__c'] = '';
		$scope.selectedWidget[namespacePrefix + 'Content__c'] = '';
		$scope.selectedWidget[namespacePrefix + 'Lookup_Fields__c'] = '';
		$scope.selectedWidget[namespacePrefix + 'Default__c'] = false;
		$scope.selectedWidget[namespacePrefix + 'Is_Active__c'] = false;

		$scope.hwcListSafe = HomepageBuilderService.getHomepageCriteria($scope.selectedWidget[namespacePrefix + 'Criteria__c']);
		$scope.hwcList = [].concat($scope.hwcListSafe);

		// $(".slds-modal__content .col-lg-4").css("border-right", "none");
		// $(".slds-modal__content .col-lg-8").css("border-left", "1px solid rgb(216, 221, 230)");
	};

	$scope.edit = function(hw) {
		//since criteriaLogicErrorMessage is shared  among all homepage widget, must reset when editWidget clicked;
		//$scope.con.criteriaLogicErrorMessage = '';

		$scope.selectedWidget = angular.copy(hw);
		//$scope.selectedWidget = hw;
		$scope.hwcListSafe = HomepageBuilderService.getHomepageCriteria($scope.selectedWidget[namespacePrefix + 'Criteria__c']);
		$scope.hwcList = [].concat($scope.hwcListSafe);

		if ($scope.selectedWidget[namespacePrefix + 'Criteria__c']) {

		} else {

		}
		// $(".slds-modal__content .col-lg-4").css("border-right", "none");
		// $(".slds-modal__content .col-lg-8").css("border-left", "1px solid rgb(216, 221, 230)");
	};

	$scope.preview = function(selectedWidget) {
		//***************make sure only one preview widget START  - Set Preview checkbox***************
		var previewWidget;
		selectedWidget[namespacePrefix + 'Preview__c'] = true;

		//if content not empty/null
		if (selectedWidget[namespacePrefix + 'Content__c']) {
			//setGridStackItemContent
			HomepageBuilderService.setGridStackItemContent($scope.number, selectedWidget);

			//uncheck the other preview hw if any
			$scope.hwList.every(function(hw) {
				if (hw[namespacePrefix + 'Preview__c'] && hw.Id != selectedWidget.Id) {
					hw[namespacePrefix + 'Preview__c'] = false;
					previewWidget = hw;
					return false; //preview hw found, exit loop
				} else
					return true;
			});

			var toUpadteHWList = [];
			toUpadteHWList.push(selectedWidget);
			if (previewWidget)
				toUpadteHWList.push(previewWidget);
			///***************make sure only one preview widget END  - Set Preview checkbox***************

			//delete unwanted fields
			angular.forEach(toUpadteHWList, function(hw) {
				if (hw.isSelected !== undefined)
					delete hw.isSelected;
			});

			vfr.upsertDataBulk(NGD_Constant.HOMEPAGE_WIDGET, angular.toJson(toUpadteHWList),
				function(result, event) {
					if (event.status) {
						$uibModalInstance.dismiss('cancel');
					} else
						logError(event.message);
				}
			);
		}
		//if content  empty/null
		else {
			selectedWidget[namespacePrefix + 'Preview__c'] = false;
			swal({
				title: 'Please define widget content first before set preview',
				text: '',
				imageUrl: NGD_SLDS + "/assets/icons/utility/info_120.png",
				imageSize: "60x60",
				html: true
			});
		}
	};

	$scope.copy = function(hw) {
		toggleBackdrop(2, 500);
		vfr.clone(hw.Id, function(result, event) {
			if (event.status) {
				HomepageBuilderService.getHomepageWidgets(number).then(function(hwList) {
					$scope.hwListSafe = hwList;
					//copy the references (you could clone ie angular.copy but then have to go through a dirty checking for the matches)
					$scope.hwList = [].concat($scope.hwListSafe);
				});
			} else
				logError(event.message);
		});
	};

	$scope.delete = function(hw) {
		swal({
			title: 'Are you sure?<br/>Delete Widget: ' + hw.Name,
			type: 'error',
			showCancelButton: true,
			confirmButtonText: 'Confirm',
			cancelButtonText: 'Cancel',
			closeOnConfirm: true,
			closeOnCancel: true,
			html: true
		}, function(isConfirm) {
			if (isConfirm) {
				toggleBackdrop();
				var index = $scope.hwList.indexOf(hw);
				if (index !== -1) {
					vfr.del(NGD_Constant.HOMEPAGE_WIDGET, hw.Id, function(result, event) {
						if (event.status) {
							swal({
								title: 'Deleted!<br />Widget has been deleted.',
								type: 'success',
								html: true
							});
							if ($scope.selectedWidget) {
								if (hw.Id == $scope.selectedWidget.Id)
									$scope.selectedWidget = undefined;
							}
							HomepageBuilderService.getHomepageWidgets(number).then(function(hwList) {
								$scope.hwListSafe = hwList;
								//copy the references (you could clone ie angular.copy but then have to go through a dirty checking for the matches)
								$scope.hwList = [].concat($scope.hwListSafe);
								toggleBackdrop();
							});
						} else
							logError(event.message);
					});
				}
			}
		});
	};

	$scope.cancel = function() {
		$uibModalInstance.dismiss('cancel');
	};

	$scope.addChecklist = function(selectedWidget) {
		swal({
			title: "Add Checklist",
			text: "Please specify checklist tilte, if not needed leave it blank",
			type: "input",
			showCancelButton: true,
			closeOnConfirm: false,
			confirmButtonText: 'Add',
			inputPlaceholder: "",
			html: true
		}, function(inputValue) {
			if (inputValue) {
				if (!selectedWidget[namespacePrefix + 'Content__c'])
					selectedWidget[namespacePrefix + 'Content__c'] = '';
				selectedWidget[namespacePrefix + 'Content__c'] += '<dz-checklist title="' + inputValue + '"></dz-checklist>';
				swal({
					title: '',
					text: '',
					timer: 0
				}); //just for closing modal
				$scope.$apply();
			} else if (inputValue !== false) {
				selectedWidget[namespacePrefix + 'Content__c'] += '<dz-checklist></dz-checklist>';
				swal({
					title: '',
					text: '',
					timer: 0
				}); //just for closing modal
				$scope.$apply();
			}
		});
	};

	$scope.save = function() {
		if ($scope.form.$invalid || !$scope.validateCriteriaLogic($scope.selectedWidget[namespacePrefix + 'Criteria_Filter_Logic__c'], $scope.hwcList)) {
			toggleBackdrop(2, 500);
			return;
		}

		/********Set Homepage Layout Criteria__c field START********/
		if (!$scope.selectedWidget.Default__c) {
			var hwcList = angular.copy($scope.hwcList); //reset list
			hwcList.splice(hwcList.length - 1, 1); // delete the last empty one


			angular.forEach(hwcList, function(hwc) {
				if (hwc.isSelected !== undefined)
					delete hwc.isSelected;
				if (hwc.fieldOption !== undefined)
					delete hwc.fieldOption;

				//If multipicklist, set multipicklist value
				if (hwc.fieldType == 'multipicklist') {
					var tmpValue = '';
					angular.forEach(hwc.fieldValue, function(option) {
						tmpValue += option.value + ';';
					});
					hwc.fieldValue = tmpValue.substring(0, tmpValue.length - 1);
				}
			});

			$scope.selectedWidget[namespacePrefix + 'Criteria__c'] = angular.toJson(hwcList);
		}
		/********Set Homepage Layout Criteria__c field END********/


		/***************field references***************/
		//gather all dynamic field references, format as {{xxx}}
		//var re = /{{([^}}==?:]*?)}}/g;
		//var re = /{{([^{]+?__r\.[^}]+?)}}/g;
		var re = /{{([^{}\.]+?\.[^{}\.]+?\.[^{}]+?)}}/g;
		var m;
		$scope.selectedWidget[namespacePrefix + 'Lookup_Fields__c'] = '';
		while ((m = re.exec($scope.selectedWidget[namespacePrefix + 'Content__c'])) !== null) {
			$scope.selectedWidget[namespacePrefix + 'Lookup_Fields__c'] += m[1] + ';';
			if (m.index === re.lastIndex) {
				re.lastIndex++;
			}
		}

		//dynamic field references in condition expression
		re = /[!"'&|(]([^!"'&|({]+?__r\.[^!=><?")}]+?)[!=><?")]/g;
		if ((m = re.exec($scope.selectedWidget[namespacePrefix + 'Content__c'])) !== null) {
			$scope.selectedWidget[namespacePrefix + 'Lookup_Fields__c'] += m[1] + ';';
			if (m.index === re.lastIndex) {
				re.lastIndex++;
			}
		}
		//get rid of field reference duplicates
		var fieldReference = $scope.selectedWidget[namespacePrefix + 'Lookup_Fields__c'].split(';');
		var fieldSet = new Set();
		angular.forEach(fieldReference, function(item) {
			if (item)
				fieldSet.add(item);
		});
		$scope.selectedWidget[namespacePrefix + 'Lookup_Fields__c'] = '';
		angular.forEach(fieldSet, function(item) {
			$scope.selectedWidget[namespacePrefix + 'Lookup_Fields__c'] += item + ';';
		});
		/***************field references***************/

		//***************make sure only one default widget START  - Set Default checkbox***************
		var defaultWidget;
		if ($scope.selectedWidget[namespacePrefix + 'Default__c']) {
			//uncheck the other default hw if any
			$scope.hwList.every(function(hw) {
				if (hw[namespacePrefix + 'Default__c'] && hw.Id != $scope.selectedWidget.Id) {
					defaultWidget = hw;
					hw[namespacePrefix + 'Default__c'] = false;
					return false; //default hw found, exit loop
				} else
					return true;
			});
		}
		//*************** make sure only one default widget END***************

		//***************make sure only one preview widget START  - Set Preview checkbox***************
		var previewWidget;

		if ($scope.selectedWidget[namespacePrefix + 'Preview__c']) {
			//setGridStackItemContent
			if ($scope.selectedWidget.Id)
				HomepageBuilderService.setGridStackItemContent($scope.number, $scope.selectedWidget);

			//uncheck the other preview hw if any
			$scope.hwList.every(function(hw) {
				if (hw[namespacePrefix + 'Preview__c'] && hw.Id != $scope.selectedWidget.Id) {
					if (defaultWidget && defaultWidget.Id == hw.Id) {
						defaultWidget[namespacePrefix + 'Preview__c'] = false;
						return false; //preview hw found, exit loop
					} else {
						hw[namespacePrefix + 'Preview__c'] = false;
						previewWidget = hw;
						return false; //preview hw found, exit loop
					}
				} else
					return true;
			});
		} else { //set content to number if no preview widget
			var hasPreview = false;
			$scope.hwList.every(function(hw) {
				if (hw[namespacePrefix + 'Preview__c'] && hw.Id != $scope.selectedWidget.Id) {
					hasPreview = true;
					return false;
				} else
					return true;
			});
			if (!hasPreview)
				HomepageBuilderService.setGridStackItemContent($scope.number, null); //setGridStackItemContent
		}

		var toUpadteHWList = [];
		toUpadteHWList.push($scope.selectedWidget);
		if (defaultWidget)
			toUpadteHWList.push(defaultWidget);
		if (previewWidget)
			toUpadteHWList.push(previewWidget);
		///***************make sure only one preview widget END  - Set Preview checkbox***************

		//set evn and delete unwanted fields
		angular.forEach(toUpadteHWList, function(hw) {
			if (hw.isSelected !== undefined)
				delete hw.isSelected;
		});

		vfr.upsertDataBulk(NGD_Constant.HOMEPAGE_WIDGET, angular.toJson(toUpadteHWList), function(result, event) {
			if (event.status) {
				if (result.length > 1 && !$scope.selectedWidget.Id) {
					result.every(function(hw) {
						if (hw[namespacePrefix + 'Default__c']) {
							$scope.selectedWidget.Id = hw.Id; //assign created reocord Id back
							return false; //break loop
						} else
							return true;
					});
				} else if (result.length == 1 && !$scope.selectedWidget.Id)
					$scope.selectedWidget.Id = result[0].Id;

				//setGridStackItemContent when Id available
				if ($scope.selectedWidget[namespacePrefix + 'Preview__c'])
					HomepageBuilderService.setGridStackItemContent($scope.number, $scope.selectedWidget);

				HomepageBuilderService.getHomepageWidgets(number).then(function(hwList) {
					$scope.hwListSafe = hwList;
					//copy the references (you could clone ie angular.copy but then have to go through a dirty checking for the matches)
					$scope.hwList = [].concat($scope.hwListSafe);
				});

				toggleBackdrop(2,500);
			} else
				logError(event.message);
		}); //Visualforce.remoting upsertDataBulk END

	}; //$scope.save END



	$scope.spliceCriteria = function(index, oldObjectValue, newObjectValue, hwc) {
		//get rid of all validation error message
		if ($scope.hwcList.length == 1 && newObjectValue) {
			$scope.form.$submitted = false;
		}

		if (newObjectValue && !oldObjectValue)
			$scope.hwcList.splice($scope.hwcList.length, 0, HomepageBuilderService.newHomepageCriteria($scope.hwcList.length + 1));
		if (!newObjectValue && $scope.hwcList.length > 1)
			$scope.hwcList.splice(index, 1);
		if (newObjectValue && oldObjectValue) {
			if (newObjectValue != oldObjectValue) {
				hwc.fieldName = '';
				hwc.fieldType = '';
				hwc.fieldValue = '';
				hwc.fieldValueType = '';
				hwc.fieldOption = [];
				hwc.operator = '';
				hwc.objectSelected = '';
				hwc.fieldSelected = '';
			}
		}

		//re-construct order
		angular.forEach($scope.hwcList, function(hwc, index) {
			hwc.order = index + 1;
		});

		$scope.hwcListSafe = [].concat($scope.hwcList);
	};

	$scope.openSelectFieldModal = function(hwc) {
		var modalInstance = $uibModal.open({
			templateUrl: NGD_HomepageBuilderAssets + '/html/HomepageBuilder/SelectFieldModal.html',
			controller: 'SelectFieldModalCtrl',
			resolve: {
				hc: function() {
					return hwc;
				}
			}
		});
	};

	$scope.validateCriteriaLogic = function(criteriaLogic, criteriaList) {
		//if Criteria_Filter_Logic__c not empty
		if (criteriaLogic) {
			$scope.criteriaLogicErrorMessage = '';

			var re = /(\d+)/g;
			var m;
			var strCriteriaLogic = criteriaLogic;
			strCriteriaLogic = strCriteriaLogic.toLowerCase();
			var orderList = [];
			while ((m = re.exec(strCriteriaLogic)) !== null) {
				orderList.push(m[1]);
				if (m.index === re.lastIndex) {
					re.lastIndex++;
				}
			}

			var orderMap = {};
			var _criteriaList = angular.copy(criteriaList);
			_criteriaList.splice(_criteriaList.length - 1, 1); // delete the last empty one
			angular.forEach(_criteriaList, function(hlc) {
				//save existing order number into map
				orderMap[hlc.order] = true;
			});

			//Step 1 - check whether all order numbers in criteria logic field are valid
			var invalidOrderNumbers = '';
			angular.forEach(orderList, function(order) {
				if (!orderMap[order]) {
					invalidOrderNumbers += order + ', ';
					//$scope.con.criteriaLogicValidated=false;
					$scope.form.$invalid = true;
				}
			});
			//if Step 1 not pass
			if (invalidOrderNumbers) {
				invalidOrderNumbers = invalidOrderNumbers.substring(0, invalidOrderNumbers.length - 2);
				$scope.form.Criteria_Filter_Logic__c.$invalid = true;
				$scope.criteriaLogicErrorMessage = 'The filter logic references undefined filter order number(s): ' + invalidOrderNumbers;
			}
			//else continue Step 2 - valiate syntax
			else {
				angular.forEach(orderList, function(order) {
					strCriteriaLogic = strCriteriaLogic.replace(order, ' true ');
				});
				strCriteriaLogic = strCriteriaLogic.replace(/or/g, '||');
				strCriteriaLogic = strCriteriaLogic.replace(/and/g, '&&');
				// strCriteriaLogic = strCriteriaLogic.replace(/not/g, '!');
				// strCriteriaLogic = strCriteriaLogic.replace(/!/g, '');

				if (!strCriteriaLogic) { //if strCriteriaLogic empty
					$scope.form.$valid = false;
					$scope.form.$invalid = true;
					$scope.criteriaLogicErrorMessage = 'Syntax error, your filter is imprecise or incorrect';
				} else {
					try {
						if ($scope.$eval(strCriteriaLogic) === undefined) {
							$scope.form.$valid = false;
							$scope.form.$invalid = true;
							$scope.criteriaLogicErrorMessage = 'Syntax error, your filter is imprecise or incorrect';
						}
					} catch (err) {
						$scope.form.$valid = false;
						$scope.form.$invalid = true;
						$scope.criteriaLogicErrorMessage = 'Syntax error, your filter is imprecise or incorrect';
					}
				}
			} //else continue Step 2 END


			//invalid
			if ($scope.criteriaLogicErrorMessage)
				return false;
			//valid
			else {
				$scope.criteriaLogicErrorMessage = '';
				return true;
			}
		}
		//else  Criteria_Filter_Logic__c empty
		else {
			//valid
			$scope.criteriaLogicErrorMessage = '';
			return true;
		}

	};
});
