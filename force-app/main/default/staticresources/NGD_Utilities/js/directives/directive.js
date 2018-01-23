angularApp.directive('dzBody', function () {
    return {
        restrict: 'AE',
        templateUrl:dz_BodyTemplateUrl,
        controller:dz_BodyTemplateCtrl
    };
});

angularApp.directive('dzFieldValue', function($compile) {
    return {
        restrict: 'AE',
        scope: {
            ngModel: '=',
            ngInit: '&',
            ngClick: '&',
            ngChange: '&',
            ngRequired: '@',
            ngDisabled: '=',
            label: '@',
            fieldType: '=',
            fieldOption: '='
        },
        template: '',
        controller: function($scope, $element) {},
        link: function(scope, element, attrs) {
            scope.$watch('fieldType', function(newValue, oldValue) {
                var field = null;
                if (newValue == 'picklist') {
                    element.empty();
                    field = angular.element('<div class="slds-select_container"><select class="slds-select" ng-model="ngModel" ng-disabled="ngDisabled"><option ng-repeat="item in fieldOption" value="{{item.value}}">{{item.label}}</option></select></div>');
                    element.append($compile(field)(scope));
                } else if (newValue == 'multipicklist') {
                    element.empty();
                    scope.localTranslation = {
                        selectAll: 'Select All',
                        selectNone: 'Select None',
                        search:'Search...',
                        nothingSelected: '--None--'
                    };
                    field = angular.element('<div isteven-multi-select input-model="fieldOption" output-model="ngModel" button-label="label" item-label="label" tick-property="ticked" orientation="vertical" max-labels="3" helper-elements="all none filter" translation="localTranslation"></div>');
                    element.append($compile(field)(scope));
                } else {
                    element.empty();
                    field = angular.element('<input class="slds-input" ng-model="ngModel" type="text" ng-disabled="ngDisabled"/>');
                    element.append($compile(field)(scope));
                }
            });
        }
    };
});

angularApp.directive('dzTypeAheadDisplayFieldName', function($parse) {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, elem, attrs, ngModelCtrl) {
            ngModelCtrl.$formatters.push(function(modelValue) {
                if (modelValue) {
                    return modelValue.fieldName;
                } else {
                    return '';
                }
            });
        }
    };
});


angularApp.directive('dzSelectFieldTypeAhead', function($compile, $parse, HomepageBuilderService) {
    return {
        restrict: 'AE',
        scope: {
            //ngModel: '=',
            ngInit: '&',
            ngClick: '&',
            ngChange: '&',
            ngRequired: '@',
            hc: '='
        },
        templateUrl: NGD_Utilities + '/html/directive-template/dz-select-Field-type-ahead.html',
        controller: function($scope, $element) {},
        link: function(scope, element, attrs) {
            //static resource
            scope.res = {};
            scope.res.NGD_SLDS = NGD_SLDS;

            scope.typeAhead = {};
            scope.typeAhead.relationshipLevel = $('div[dz-select-field-type-ahead]').length;

            if (scope.hc.referenceToTemp) {
                if (scope.typeAhead.relationshipLevel < 6)
                    scope.typeAhead.option = HomepageBuilderService.getFieldOptions(scope.hc.referenceToTemp);
                else
                    scope.typeAhead.option = HomepageBuilderService.getFieldOptions(scope.hc.referenceToTemp, 'reference');
            } else
                scope.typeAhead.option = HomepageBuilderService.getFieldOptions(scope.hc.objectName);

            scope.setField = function(selectedField) {
                if (selectedField.fieldType == 'reference') {
                    this.hc.referenceToTemp = selectedField.referenceTo;

                } else {
                    this.hc.objectSelected = selectedField.objectName;
                    this.hc.fieldSelected = selectedField.fieldName;
                    this.hc.fieldType = selectedField.fieldType;
                    this.hc.isfieldSelectedTemp = 'true';
                }

                if (selectedField.referenceTo && this.typeAhead.relationshipLevel < 6)
                    generateTypeAhead();
            };

            scope.clear = function($event, partialClear) {
                partialClear = (typeof partialClear !== 'undefined') ? partialClear : null;
                if (!partialClear)
                    this.typeAhead.model = '';
                this.hc.objectSelected = '';
                this.hc.fieldSelected = '';
                $(event.currentTarget).closest('div[dz-select-field-type-ahead]').nextAll().remove();
            };

            function generateTypeAhead() {
                var newElement = angular.element('<div dz-select-field-type-ahead hc="hc" class="slds-size--1-of-5"></div>');
                element.after($compile(newElement)(scope));
            }
        }
    };
});
