angularApp.controller('LayoutModalCtrl', function($scope, $sce, $uibModal, $uibModalInstance, $timeout, $parse, $q, vfr, HomepageBuilderService, parentScope, hlList, hl) {
	//static resource
	$scope.res = {};
	$scope.res.NGD_SLDS = NGD_SLDS;
	$scope.res.NGD_Utilities = NGD_Utilities;
	$scope.res.NGD_HomepageBuilderAssets = NGD_HomepageBuilderAssets;

	//namespacePrefix for package
	$scope.namespacePrefix = namespacePrefix;

	////
	$scope.hl = angular.copy(hl);

	$scope.hlcListSafe = HomepageBuilderService.getHomepageCriteria(hl[namespacePrefix + 'Criteria__c']);
	$scope.hlcList = [].concat($scope.hlcListSafe);

	$scope.objectOptions = HomepageBuilderService.getObjectOptions();
	$scope.operatorOptions = HomepageBuilderService.getOperatorOptions();
	$scope.typeOptions = HomepageBuilderService.getTypeOptions();

	$scope.HomepageLayoutTooltip = $sce.trustAsHtml('<ul>Instructions:<li>Checkbox type field criteria accepts text "True"" or "False" as values.</li><li>Values used in criteria are case sensitive ("App Started"" is different than "app started")</li></ul>');


	$scope.setDefaultActive = function(hl,isDefault){
		$timeout(function(){
			if(hl[namespacePrefix+'Default__c'])
				hl[namespacePrefix+'Is_Active__c']=true;
		});
	};

	$scope.spliceCriteria = function(index, oldObjectValue, newObjectValue,hlc) {
		//get rid of all validation error message
		if ($scope.hlcList.length == 1 && newObjectValue) {
			$scope.form.$submitted = false;
		}

		if (newObjectValue && !oldObjectValue)
			$scope.hlcList.splice($scope.hlcList.length, 0, HomepageBuilderService.newHomepageCriteria($scope.hlcList.length + 1));
		if (!newObjectValue && $scope.hlcList.length > 1)
			$scope.hlcList.splice(index, 1);
		if (newObjectValue && oldObjectValue){
			if(newObjectValue!=oldObjectValue){
				hlc.fieldName = '';
        hlc.fieldType = '';
        hlc.fieldValue = '';
        hlc.fieldValueType = '';
        hlc.fieldOption = [];
        hlc.operator = '';
        hlc.objectSelected = '';
        hlc.fieldSelected = '';
			}
		}

		//re-construct order
		angular.forEach($scope.hlcList, function(hlc, index) {
			hlc.order = index + 1;
		});

		$scope.hlcListSafe = [].concat($scope.hlcList);
	};

	$scope.openSelectFieldModal = function(hlc) {
		var modalInstance = $uibModal.open({
			templateUrl: NGD_HomepageBuilderAssets + '/html/HomepageBuilder/SelectFieldModal.html',
			controller: 'SelectFieldModalCtrl',
			resolve: {
				hc: function() {
					return hlc;
				}
			}
		});
	};

	$scope.save = function() {
		if ($scope.form.$invalid || !$scope.validateCriteriaLogic($scope.hl[namespacePrefix + 'Criteria_Filter_Logic__c'],$scope.hlcList)) {
			toggleBackdrop(2, 500);
			return;
		}

		if ($scope.hl.isSelected !== undefined)
			delete $scope.hl.isSelected;

		/********Set Homepage Layout Grid_Data__c field START********/
		if (!$scope.hl.Id) {
			$scope.hl[namespacePrefix + 'Grid_Data__c'] = '[{"x":0,"y":0,"width":6,"height":20,"number":"W1"},{"x":6,"y":0,"width":6,"height":20,"number":"W2"},{"x":12,"y":0,"width":6,"height":20,"number":"W3"},{"x":18,"y":0,"width":6,"height":20,"number":"W4"},{"x":0,"y":20,"width":6,"height":20,"number":"W5"},{"x":6,"y":20,"width":6,"height":20,"number":"W6"},{"x":12,"y":20,"width":6,"height":20,"number":"W7"},{"x":18,"y":20,"width":6,"height":20,"number":"W8"},{"x":0,"y":40,"width":6,"height":20,"number":"W9"},{"x":6,"y":40,"width":6,"height":20,"number":"W10"},{"x":12,"y":40,"width":6,"height":20,"number":"W11"},{"x":18,"y":40,"width":6,"height":20,"number":"W12"},{"x":0,"y":60,"width":6,"height":20,"number":"W13"},{"x":6,"y":60,"width":6,"height":20,"number":"W14"},{"x":12,"y":60,"width":6,"height":20,"number":"W15"},{"x":18,"y":60,"width":6,"height":20,"number":"W16"}]';
      $scope.hl[namespacePrefix + 'Grid_Width__c'] = 'inherit';
		}
		/********Set Homepage Layout Grid_Data__c field START********/


		/********Set Homepage Layout Criteria__c field START********/
		if (!$scope.hl.Default__c) {
			var hlcList = angular.copy($scope.hlcList); //reset list
			hlcList.splice(hlcList.length - 1, 1); // delete the last empty one


			angular.forEach(hlcList, function(hlc) {
				if (hlc.isSelected !== undefined)
					delete hlc.isSelected;
				if (hlc.fieldOption !== undefined)
					delete hlc.fieldOption;

				//If multipicklist, set multipicklist value
				if (hlc.fieldType == 'multipicklist') {
					var tmpValue = '';
					angular.forEach(hlc.fieldValue, function(option) {
						tmpValue += option.value + ';';
					});
					hlc.fieldValue = tmpValue.substring(0, tmpValue.length - 1);
				}
			});

			$scope.hl[namespacePrefix + 'Criteria__c'] = angular.toJson(hlcList);
		}
		/********Set Homepage Layout Criteria__c field END********/

		/********make sure only one default layout START********/
		var defaultLayout;
		if ($scope.hl[namespacePrefix + 'Default__c']) {
			hlList.every(function(hl) {
				if (hl[namespacePrefix + 'Default__c'] && hl.Id != $scope.hl.Id) {
					defaultLayout = hl;
					hl[namespacePrefix + 'Default__c'] = false;
					if (defaultLayout.isSelected !== undefined)
						delete defaultLayout.isSelected;
					return false; //default hl found, exit loop
				} else
					return true;
			});
		}
		var toUpdateList = [];
		toUpdateList.push($scope.hl);
		if (defaultLayout)
			toUpdateList.push(defaultLayout);
		/********make sure only one default layout END********/

		vfr.upsertDataBulk(NGD_Constant.HOMEPAGE_LAYOUT, angular.toJson(toUpdateList),
			function(result, event) {
				if (event.status) {
					vfr.query(NGD_Constant.HOMEPAGE_LAYOUT, '', '', '')
						.then(function(result) {
							parentScope.hlListSafe = result.records;
							parentScope.hlList = [].concat($scope.hlListSafe);
						});
				} else
					logError(event.message);
			}
		);

		$uibModalInstance.dismiss('cancel');
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

	$scope.cancel = function() {
		$uibModalInstance.dismiss('cancel');
	};
});
