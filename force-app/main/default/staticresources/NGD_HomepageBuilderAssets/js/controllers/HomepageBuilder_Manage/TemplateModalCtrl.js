angularApp.controller('TemplateModalCtrl', function($scope, $sce, $uibModal, $uibModalInstance, $compile, $timeout, $parse, $q, vfr, HomepageBuilderService,parentScope) {
	//static resource
	$scope.res = {};
	$scope.res.NGD_SLDS = NGD_SLDS;
	$scope.res.NGD_Utilities = NGD_Utilities;
	$scope.res.NGD_HomepageBuilderAssets = NGD_HomepageBuilderAssets;

	//namespacePrefix for package
	$scope.namespacePrefix = namespacePrefix;

	HomepageBuilderService.getHomepageTemplates().then(function(htList) {
		$scope.htListSafe = htList;
		//copy the references (you could clone ie angular.copy but then have to go through a dirty checking for the matches)
		$scope.htList = [].concat($scope.htListSafe);
	});

	$scope.objectOptions = HomepageBuilderService.getObjectOptions();
	$scope.operatorOptions = HomepageBuilderService.getOperatorOptions();
	$scope.typeOptions = HomepageBuilderService.getTypeOptions();

	$scope.tooltip = $sce.trustAsHtml('Info');

	$scope.homepageTemplatePreview=parentScope.hl[namespacePrefix+'Homepage_Template_Preview__c'];

	$scope.refresh = function() {
		toggleSpin(true);
		vfr.query(NGD_Constant.HOMEPAGE_TEMPLATE, '', '', '')
			.then(function(result) {
				$scope.htListSafe = result.records;
				$scope.htList = [].concat($scope.htListSafe);
				toggleSpin(false);
			});
	};

	$scope.setActive = function(ht) {
		if (ht.isSelected !== undefined)
			delete ht.isSelected;
		vfr.upsertData(NGD_Constant.HOMEPAGE_TEMPLATE, angular.toJson(ht),
			function(result, event) {
				if (event.status) {
					vfr.query(NGD_Constant.HOMEPAGE_TEMPLATE, '', '', '')
						.then(function(result) {
							$scope.htListSafe = result.records;
							$scope.htList = [].concat($scope.htListSafe);
							toggleSpin(false);
						});
				} else
					logError(event.message);
			}
		);
	};

	$scope.setDefaultActive = function(selectedTemplate) {
		$timeout(function() {
			if (selectedTemplate[namespacePrefix + 'Default__c'])
				selectedTemplate[namespacePrefix + 'Is_Active__c'] = true;
		});
	};

	$scope.new = function() {
		$scope.form.$submitted = false;

		$scope.selectedTemplate = {};
		$scope.selectedTemplate.Name = '';
		$scope.selectedTemplate[namespacePrefix + 'Criteria__c'] = '';
		$scope.selectedTemplate[namespacePrefix + 'Criteria_Filter_Logic__c'] = '';
		$scope.selectedTemplate[namespacePrefix + 'Header__c'] = '';
		$scope.selectedTemplate[namespacePrefix + 'Footer__c'] = '';
		$scope.selectedTemplate[namespacePrefix + 'Default__c'] = false;
		$scope.selectedTemplate[namespacePrefix + 'Is_Active__c'] = false;

		$scope.htcListSafe = HomepageBuilderService.getHomepageCriteria($scope.selectedTemplate[namespacePrefix + 'Criteria__c']);
		$scope.htcList = [].concat($scope.htcListSafe);

		// $(".slds-modal__content .col-lg-4").css("border-right", "none");
		// $(".slds-modal__content .col-lg-8").css("border-left", "1px solid rgb(216, 221, 230)");
	};

	$scope.edit = function(ht) {
		//since criteriaLogicErrorMessage is shared  among all homepage widget, must reset when editWidget clicked;
		//$scope.con.criteriaLogicErrorMessage = '';

		$scope.selectedTemplate = angular.copy(ht);
		//$scope.selectedTemplate = ht;
		$scope.htcListSafe = HomepageBuilderService.getHomepageCriteria($scope.selectedTemplate[namespacePrefix + 'Criteria__c']);
		$scope.htcList = [].concat($scope.htcListSafe);

		if ($scope.selectedTemplate[namespacePrefix + 'Criteria__c']) {

		} else {

		}
		// $(".slds-modal__content .col-lg-4").css("border-right", "none");
		// $(".slds-modal__content .col-lg-8").css("border-left", "1px solid rgb(216, 221, 230)");
	};

	$scope.preview = function(selectedTemplate) {
		parentScope.ht[namespacePrefix + 'Header__c']=$sce.trustAsHtml(selectedTemplate[namespacePrefix + 'Header__c']);
		parentScope.ht[namespacePrefix + 'Footer__c']=$sce.trustAsHtml(selectedTemplate[namespacePrefix + 'Footer__c']);

		parentScope.hl[namespacePrefix + 'Homepage_Template_Preview__c']=selectedTemplate.Id;
		$scope.homepageTemplatePreview=selectedTemplate.Id;

		vfr.upsertData(NGD_Constant.HOMEPAGE_LAYOUT, angular.toJson(parentScope.hl),
			function(result, event) {
				if (event.status) {
					$uibModalInstance.dismiss('cancel');
				} else
					logError(event.message);
			}
		);

	};

	$scope.copy = function(ht) {
		toggleBackdrop(2, 500);
		vfr.clone(ht.Id, function(result, event) {
			if (event.status) {
					HomepageBuilderService.getHomepageTemplates().then(function(htList) {
						$scope.htListSafe = htList;
						//copy the references (you could clone ie angular.copy but then have to go through a dirty checking for the matches)
						$scope.htList = [].concat($scope.htListSafe);
					});
			} else
				logError(event.message);
		});
	};

	$scope.delete = function(ht) {
		swal({
			title: 'Are you sure?<br/>Delete Template: ' + ht.Name,
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
				var index = $scope.htList.indexOf(ht);
				if (index !== -1) {
					vfr.del(NGD_Constant.HOMEPAGE_TEMPLATE, ht.Id, function(result, event) {
						if (event.status) {
							swal({
								title: 'Deleted!<br />Template has been deleted.',
								type: 'success',
								html: true
							});
							if ($scope.selectedTemplate) {
								if (ht.Id == $scope.selectedTemplate.Id)
									$scope.selectedTemplate = undefined;
							}
							HomepageBuilderService.getHomepageTemplates().then(function(htList) {
								$scope.htListSafe = htList;
								//copy the references (you could clone ie angular.copy but then have to go through a dirty checking for the matches)
								$scope.htList = [].concat($scope.htListSafe);
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

	$scope.save = function() {
		if ($scope.form.$invalid || !$scope.validateCriteriaLogic($scope.selectedTemplate[namespacePrefix + 'Criteria_Filter_Logic__c'], $scope.htcList)) {
			toggleBackdrop(2, 500);
			return;
		}

		/********Set Homepage Template Criteria__c field START********/
		if (!$scope.selectedTemplate.Default__c) {
			var htcList = angular.copy($scope.htcList); //reset list
			htcList.splice(htcList.length - 1, 1); // delete the last empty one


			angular.forEach(htcList, function(htc) {
				if (htc.isSelected !== undefined)
					delete htc.isSelected;
				if (htc.fieldOption !== undefined)
					delete htc.fieldOption;

				//If multipicklist, set multipicklist value
				if (htc.fieldType == 'multipicklist') {
					var tmpValue = '';
					angular.forEach(htc.fieldValue, function(option) {
						tmpValue += option.value + ';';
					});
					htc.fieldValue = tmpValue.substring(0, tmpValue.length - 1);
				}
			});

			$scope.selectedTemplate[namespacePrefix + 'Criteria__c'] = angular.toJson(htcList);
		}
		/********Set Homepage Layout Criteria__c field END********/


		//***************make sure only one default widget START  - Set Default checkbox***************
		var defaultTemplate;
		if ($scope.selectedTemplate[namespacePrefix + 'Default__c']) {
			//uncheck the other default ht if any
			$scope.htList.every(function(ht) {
				if (ht[namespacePrefix + 'Default__c'] && ht.Id != $scope.selectedTemplate.Id) {
					defaultTemplate = ht;
					ht[namespacePrefix + 'Default__c'] = false;
					return false; //default ht found, exit loop
				} else
					return true;
			});
		}
		//*************** make sure only one default widget END***************


		var toUpadteHTList = [];
		toUpadteHTList.push($scope.selectedTemplate);
		if (defaultTemplate)
			toUpadteHTList.push(defaultTemplate);

		//set evn and delete unwanted fields
		angular.forEach(toUpadteHTList, function(ht) {
			if (ht.isSelected !== undefined)
				delete ht.isSelected;
		});

		vfr.upsertDataBulk(NGD_Constant.HOMEPAGE_TEMPLATE, angular.toJson(toUpadteHTList), function(result, event) {
			if (event.status) {
				if (result.length > 1 && !$scope.selectedTemplate.Id) {
					result.every(function(ht) {
						if (ht[namespacePrefix + 'Default__c']) {
							$scope.selectedTemplate.Id = ht.Id; //assign created reocord Id back
							return false; //break loop
						} else
							return true;
					});
				} else if (result.length == 1 && !$scope.selectedTemplate.Id)
					$scope.selectedTemplate.Id = result[0].Id;

					HomepageBuilderService.getHomepageTemplates().then(function(htList) {
						$scope.htListSafe = htList;
						//copy the references (you could clone ie angular.copy but then have to go through a dirty checking for the matches)
						$scope.htList = [].concat($scope.htListSafe);
					});

				toggleBackdrop(2,500);
			} else
				logError(event.message);
		}); //Visualforce.remoting upsertDataBulk END

	}; //$scope.save END

	$scope.spliceCriteria = function(index, oldObjectValue, newObjectValue, htc) {
		//get rid of all validation error message
		if ($scope.htcList.length == 1 && newObjectValue) {
			$scope.form.$submitted = false;
		}

		if (newObjectValue && !oldObjectValue)
			$scope.htcList.splice($scope.htcList.length, 0, HomepageBuilderService.newHomepageCriteria($scope.htcList.length + 1));
		if (!newObjectValue && $scope.htcList.length > 1)
			$scope.htcList.splice(index, 1);
		if (newObjectValue && oldObjectValue) {
			if (newObjectValue != oldObjectValue) {
				htc.fieldName = '';
				htc.fieldType = '';
				htc.fieldValue = '';
				htc.fieldValueType = '';
				htc.fieldOption = [];
				htc.operator = '';
				htc.objectSelected = '';
				htc.fieldSelected = '';
			}
		}

		//re-construct order
		angular.forEach($scope.htcList, function(htc, index) {
			htc.order = index + 1;
		});

		$scope.htcListSafe = [].concat($scope.htcList);
	};

	$scope.openSelectFieldModal = function(htc) {
		var modalInstance = $uibModal.open({
			templateUrl: NGD_HomepageBuilderAssets + '/html/HomepageBuilder/SelectFieldModal.html',
			controller: 'SelectFieldModalCtrl',
			resolve: {
				hc: function() {
					return htc;
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
