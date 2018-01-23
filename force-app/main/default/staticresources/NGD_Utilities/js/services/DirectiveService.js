angularApp.service('DirectiveService', function($compile, $log) {
    this.generalInit = function(scope, element, attrs, compileTag) {
        compileTag = (typeof compileTag !== 'undefined') ?  compileTag : null;
        //static resource
        scope.NGD_SLDS = NGD_SLDS;
        scope.NGD_Utilities = NGD_Utilities;

        var mergeFieldName = attrs.ngModel;
        //mergeFieldName not null
        if (mergeFieldName) {
            //get objectName and fieldName
            var dotIndex = mergeFieldName.indexOf('.');
            var objectName = mergeFieldName.substring(0, dotIndex);
            var fieldName = mergeFieldName.substring(dotIndex + 1);

            //set ng-required attribute
            if (attrs.ngRequired == "true") {
                var elementLabels = element.find('.slds-form-element__label[ng-show]');
                if (elementLabels.length > 0)
                    $(elementLabels[0]).prepend('<abbr class="slds-required" title="required">*</abbr>');
                if (elementLabels.length > 1)
                    $(elementLabels[1]).prepend('<abbr class="slds-required" title="required">*</abbr>');
            }

            //set name atttibute
            element.find(compileTag).attr('name', mergeFieldName);

            //set form column
            // var column = element.parents('form').attr('dz-column');
            // if (!column || column == "1")
            //     element.addClass('slds-form-element slds-max-medium-size--1-of-1 slds-size--4-of-7');
            // else if (column == "2" && attrs.dzLineBreak != 'true')
            //     element.addClass('slds-form-element slds-max-medium-size--1-of-1 slds-size--3-of-7');

            //element.children(':first').addClass('slds-size--1-of-2');

            //compile tag
            $compile(element.find(compileTag))(scope);

            //get currentForm and currentField
            scope.currentForm = scope.$parent[element.parents('form').attr('name')];
            scope.currentField = scope.currentForm[mergeFieldName];
            scope.setFieldDirty = function(field) {
                field.$dirty = true;
            };

            //directive specific operation starts below
            var picklistOptionsMap;
            if (element[0].tagName.toLowerCase() == 'dz-select' || attrs.dzSelect !== undefined) {
                picklistOptionsMap = scope.$parent.ObjectName_PicklistOptionsMap[objectName];
                if (picklistOptionsMap) {
                    scope.picklistOptions = picklistOptionsMap[fieldName];
                    //scope.hasDefaultOption = scope.picklistOptions[0].default;
                }
            }

            if (element[0].tagName.toLowerCase() == 'dz-multiselect' || attrs.dzMultiselect !== undefined) {
                //setSingleColumn(element);

                picklistOptionsMap = scope.$parent.ObjectName_PicklistOptionsMap[objectName];
                if (picklistOptionsMap) {
                    scope.picklistOptions = picklistOptionsMap[fieldName];
                    scope.list = {
                        left: [],
                        right: [],
                        selectedOption: null
                    };
                    if (scope.ngModel) {
                        var chosen = scope.ngModel.trim().split(";");
                        for (var i = 0; i < chosen.length; i++) {
                            var index = scope.picklistOptions.indexOf(chosen[i]);
                            if (index != -1)
                                scope.picklistOptions.splice(index, 1);
                            scope.list.right.push({
                                value: chosen[i]
                            });
                        }
                        for (i = 0; i < scope.picklistOptions.length; i++) {
                            scope.list.left.push({
                                value: scope.picklistOptions[i]
                            });
                        }
                    } else {
                        for (var j = 0; j < scope.picklistOptions.length; j++) {
                            scope.list.left.push({
                                value: scope.picklistOptions[j]
                            });
                        }
                    }

                    scope.select = function(list, from) {
                        from = (typeof from !== 'undefined') ? from : null;
                        var index;
                        if (from == 'left') {
                            index = list.left.indexOf(list.selectedOption);
                            if (index !== -1) {
                                list.left.splice(index, 1);
                                list.right.push(list.selectedOption);
                            }
                        } else if (from == 'right') {
                            index = list.right.indexOf(list.selectedOption);
                            if (index !== -1) {
                                list.right.splice(index, 1);
                                list.left.push(list.selectedOption);
                            }
                        }
                        list.selectedOption = null;
                        scope.ngModel = '';
                        for (var i = 0; i < list.right.length; i++)
                            scope.ngModel += list.right[i].value + ';';
                        scope.ngModel = scope.ngModel.substr(0, scope.ngModel.length - 1);
                    };
                }
            }


            if (element[0].tagName.toLowerCase() == 'dz-select-radio' || attrs.dzSelectRadio !== undefined) {
                //setSingleColumn(element);

                picklistOptionsMap = scope.$parent.ObjectName_PicklistOptionsMap[objectName];
                if (picklistOptionsMap)
                    scope.picklistOptions = picklistOptionsMap[fieldName];

            }

            if (element[0].tagName.toLowerCase() == 'dz-date-picker' || attrs.dzDatePicker !== undefined) {
                element.addClass('dz-date-picker');
                scope.status = false;
                scope.openDatePicker = function($event) {
                    scope.status = true;
                };
                scope.clear = function($event) {
                    scope.ngModel = null;
                    scope.setFieldDirty(scope.currentField);
                };
            }

            if (element[0].tagName.toLowerCase() == 'dz-checkbox' || attrs.dzCheckbox !== undefined) {
                //setSingleColumn(element);
            }

        } //mergeFieldName not null End
        else if(compileTag){
            $log.error(element[0].tagName.toLowerCase() + ' ngModel missing');
        }
    };


    // function setSingleColumn(element) {
    //     element.removeClass('slds-size--3-of-7');
    //     element.removeClass('slds-size--4-of-7');
    //     element.addClass('slds-size--1-of-1');
    // }
});
