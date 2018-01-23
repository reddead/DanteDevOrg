// angularApp.directive("typeahead", function($timeout) {
//     return {
//         require: "ngModel",
//         link: function(scope, element, attr, controller) {
//             scope.$watch('hlc.field', function(newValue, oldValue) {
//                 if (newValue !== oldValue) {
//                     if (newValue.endsWith('.') || !newValue) {
//                         element.focus();
//                         controller.$setViewValue('');
//                     }
//                 } else {
//                     $timeout(function() {
//                         element.focus();
//                         if (controller.$viewValue)
//                             controller.$setViewValue(controller.$viewValue);
//                         else
//                             controller.$setViewValue('');
//                     });
//                 }
//             });
//         }
//     };
// });

angularApp.controller('SetFieldModalCtrl', function($scope, $timeout, $uibModalInstance, DataService, HomepageBuilderService, hlc) {
    //static resource
    $scope.res = {};
    $scope.res.NGD_SLDS = NGD_SLDS;
    $scope.res.NGD_Utilities = NGD_Utilities;
    $scope.res.namespacePrefix = namespacePrefix;

    //namespacePrefix for package
    $scope.namespacePrefix = namespacePrefix;

    $scope.hlc = angular.copy(hlc);

    $scope.fieldOptions = HomepageBuilderService.getFieldOptions(true, hlc);

    $scope.pageMessage = {};

    //scope function START

    $scope.save = function() {
        var sObjectDescribe = HomepageBuilderService.getDescribe($scope.hlc.currentSelectedObject);
        var sObjectFieldMap = DataService.getFieldMap(sObjectDescribe, 'picklist, multipicklist');
        var sObjectPicklistOptionsMap = DataService.getPicklistOptionsMap(sObjectFieldMap, true, '--None--', '');


        hlc.field = $scope.hlc.field;
        hlc.fieldType = $scope.hlc.currentSelectedFieldType;
        hlc.fieldOptions = sObjectPicklistOptionsMap[$scope.hlc.currentSelectedField];
        hlc.currentSelectedField = $scope.hlc.currentSelectedField;
        hlc.currentSelectedFieldType = $scope.hlc.currentSelectedFieldType;
        hlc.currentSelectedObject = $scope.hlc.currentSelectedObject;
        hlc.currentReferenceTo = $scope.hlc.currentReferenceTo;
        hlc.previousSelectedField = $scope.hlc.previousSelectedField;
        hlc.previousSelectedFieldType = $scope.hlc.previousSelectedFieldType;
        hlc.typeAhead = $scope.hlc.typeAhead;
        hlc.fieldMergeDisplay = $scope.hlc.fieldMergeDisplay;
        $uibModalInstance.dismiss('cancel');
    };

    $scope.cancel = function() {
        $uibModalInstance.dismiss('cancel');
    };

    $scope.setField = function(selectedField) {
        //set hlc.field
        $scope.hlc.currentSelectedField = selectedField.value;
        $scope.hlc.currentSelectedFieldType = selectedField.type;
        $scope.hlc.currentSelectedObject = selectedField.object;
        if (selectedField.referenceTo)
            $scope.hlc.currentReferenceTo = selectedField.referenceTo;
        if ($scope.hlc.previousSelectedFieldType == 'reference') {
            if (selectedField.type == 'reference') {
                $scope.hlc.field += selectedField.relationshipName;
                $scope.hlc.field += '.';
            } else {
                $scope.hlc.field += selectedField.value;
            }
        } else {
            if ($scope.hlc.field) {
                var lastDotIndex = $scope.hlc.field.lastIndexOf('.');
                if (lastDotIndex != -1)
                    $scope.hlc.field = $scope.hlc.field.substring(0, lastDotIndex + 1);
                else
                    $scope.hlc.field = '';
            }
            if (selectedField.type == 'reference') {
                $scope.hlc.field += selectedField.relationshipName;
                $scope.hlc.field += '.';
            } else {
                $scope.hlc.field += selectedField.value;
            }
        }

        //set previous attributes
        $scope.hlc.previousSelectedField = selectedField.value;
        $scope.hlc.previousSelectedFieldType = selectedField.type;

        //set $scope.hlc.fieldMergeDisplay
        setFieldMergeDisplay();

        //set fieldOption and reset typeAhead if it is refrence field
        if (selectedField.referenceTo) {
            $scope.fieldOptions = HomepageBuilderService.getFieldOptions(false, selectedField);
            $scope.hlc.typeAhead = '';
        }

        if (($scope.hlc.field.match(/\./g) || []).length > 5) {
            $scope.pageMessage.error = 'Relationships no more than 5 levels away from the root SObject';
        } else
            $scope.pageMessage.error = '';
    };

    $scope.clearField = function() {
        $scope.hlc.field = '';
        $scope.hlc.fieldMergeDisplay = '';
        $scope.hlc.typeAhead = '';
        $scope.hlc.currentSelectedField = '';
        $scope.hlc.currentSelectedFieldType = '';
        $scope.hlc.currentSelectedObject = '';
        $scope.hlc.currentReferenceTo = '';
        $scope.hlc.previousSelectedField = '';
        $scope.hlc.previousSelectedFieldType = '';
        $scope.fieldOptions = HomepageBuilderService.getFieldOptions(true, $scope.hlc);

        $scope.pageMessage.error = '';
    };

    $scope.clearTypeAhead = function() {
        if ($scope.hlc.previousSelectedFieldType != 'reference') {
            if ($scope.hlc.typeAhead == $scope.hlc.previousSelectedField) {
                if ($scope.hlc.field) {
                    var lastDotIndex = $scope.hlc.field.lastIndexOf('.');
                    if (lastDotIndex != -1)
                        $scope.hlc.field = $scope.hlc.field.substring(0, lastDotIndex + 1);
                    else
                        $scope.hlc.field = '';
                    setFieldMergeDisplay();
                }
            }
        }
        $scope.hlc.typeAhead = '';
        $scope.hlc.currentSelectedField = '';
        $scope.hlc.currentSelectedFieldType = '';
    };

    function setFieldMergeDisplay() {
        //set $scope.hlc.fieldMergeDisplay
        if ($scope.hlc.field)
            $scope.hlc.fieldMergeDisplay = $scope.hlc.field.replace(/\./g, ' > ');
        else
            $scope.hlc.fieldMergeDisplay = '';
    }
});
