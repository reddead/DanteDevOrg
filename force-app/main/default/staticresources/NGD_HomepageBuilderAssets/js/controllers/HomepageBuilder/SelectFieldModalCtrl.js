angularApp.controller('SelectFieldModalCtrl', function($scope, $timeout, $uibModalInstance, DataService, HomepageBuilderService, hc) {
    //static resource
    $scope.res = {};
    $scope.res.NGD_SLDS = NGD_SLDS;
    $scope.res.NGD_Utilities = NGD_Utilities;
    $scope.res.namespacePrefix = namespacePrefix;

    //namespacePrefix for package
    $scope.namespacePrefix = namespacePrefix;

    $scope.hc = angular.copy(hc);
    $scope.hc.fieldName = '';
    $scope.hc.fieldType='';
    $scope.hc.fieldValue='';
    $scope.hc.objectSelected='';
    $scope.hc.fieldSelected='';
    $scope.hc.fieldOption=[];


    //scope function START

    $scope.save = function() {
        var typeAheads=$('div[dz-select-field-type-ahead] input[type=hidden]');

        angular.forEach(typeAheads, function(item) {
            $scope.hc.fieldName +=item.value+'.';
        });
        hc.fieldName=$scope.hc.fieldName.substring(0,$scope.hc.fieldName.length-1);
        hc.fieldType = $scope.hc.fieldType;
        //fix when switch from multipicklist to picklist, hc.fieldValue wrongly set to []
        $timeout(function(){hc.fieldValue=$scope.hc.fieldValue;});
        hc.objectSelected=$scope.hc.objectSelected;
        hc.fieldSelected=$scope.hc.fieldSelected;

        var sObjectDescribe;
        var sObjectFieldMap;
        var sObjectPicklistOptionsMap;
        if($scope.hc.fieldType=='picklist'){
            sObjectDescribe = HomepageBuilderService.getDescribe($scope.hc.objectSelected);
            sObjectFieldMap = DataService.getFieldMap(sObjectDescribe, 'picklist, multipicklist');
            sObjectPicklistOptionsMap = DataService.getPicklistOptionsMap(sObjectFieldMap, true, '--None--', '');
            hc.fieldOption = sObjectPicklistOptionsMap[$scope.hc.fieldSelected];
        }
        else if ($scope.hc.fieldType=='multipicklist') {
          sObjectDescribe = HomepageBuilderService.getDescribe($scope.hc.objectSelected);
          sObjectFieldMap = DataService.getFieldMap(sObjectDescribe, 'picklist, multipicklist');
          sObjectPicklistOptionsMap = DataService.getPicklistOptionsMap(sObjectFieldMap, false);
          hc.fieldOption = sObjectPicklistOptionsMap[$scope.hc.fieldSelected];
        }

        $uibModalInstance.dismiss('cancel');
    };

    $scope.cancel = function() {
        $uibModalInstance.dismiss('cancel');
    };
});
