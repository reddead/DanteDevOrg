var applicationSubmitted = false;
$(window).load(function() {
    if (applicationSubmitted) {
        setTimeout(function() {
            $(':input').attr('disabled', 'disabled');
        }, 500);
    }
});

angularApp.controller("MyProfileCtrl1", function($scope, $state, $parse, ngForceConfig, vfr, DataService, DataService) {
    if (window.location.search) {
        var equalIndex = window.location.search.indexOf('section=') + 7;
        var sectionName = window.location.search.substring(equalIndex + 1);
        $scope[sectionName] = true;
    } else
        $scope.PersonalData = true;

    //static resource
    $scope.con = {};
    $scope.con.NGD_SLDS = NGD_SLDS;
    $scope.con.NGD_Utilities = NGD_Utilities;

    //sobjects
    if (contactJSON && contactJSON != 'null')
        $scope.contact = angular.fromJson(contactJSON);
    if (applicationJSON && applicationJSON != 'null')
        $scope.application = angular.fromJson(applicationJSON);

    //sobjectsDescribe
    var contactDescribe = DataService.getDescribe(contactDescribeJSON);

    var contactFieldMap = DataService.getFieldMap(contactDescribe, 'picklist');
    $scope.contactPicklistOptionsMap = DataService.getPicklistOptionsMap(contactFieldMap, true, '--None--', '');
    $scope.contactPicklistOptionsMap.Ethnicity__c = DataService.getPicklistOptions(contactFieldMap, 'Ethnicity__c', false, null, null);

    $scope.ObjectName_PicklistOptionsMap = {};
    $scope.ObjectName_PicklistOptionsMap.contact = $scope.contactPicklistOptionsMap;

    //form  message
    $scope.con.message = '';


    //******************************Datepicker Start******************************//
    $scope.openDate_of_Birth__cPicker = function($event) {
        $scope.datePickerStatus.openedDate_of_Birth__c = true;
    };

    $scope.openPassport_Expiration_Date__cPicker = function($event) {
        $scope.datePickerStatus.openedPassport_Expiration_Date__c = true;
    };

    $scope.datePickerStatus = {
        openedDate_of_Birth__c: false,
        openedPassport_Expiration_Date__c: false
    };

    //******************************Datepicker End******************************//

    /***************Lock  App  START**************/

    //lock app if Application_Submitted__c=true
    if ($scope.application.Application_Submitted__c) {
        applicationSubmitted = true;
    }

    /***************Lock  App  START***************/

    /****************************multiselect START**************************/
    $scope.initiateMultiSelect = function initiateMultiSelect(model, selectOptions) {
        if (!model.fieldValue) {
            for (var j = 0; j < selectOptions.length; j++) {
                model.lists.A.push({
                    value: selectOptions[j]
                });
            }
        } else {
            var choseResult = model.fieldValue.trim().split(";");
            for (var i = 0; i < choseResult.length; i++) {
                var index = selectOptions.indexOf(choseResult[i]);
                if (index != -1)
                    selectOptions.splice(index, 1);

                model.lists.B.push({
                    value: choseResult[i]
                });
            }
            for (i = 0; i < selectOptions.length; i++) {
                model.lists.A.push({
                    value: selectOptions[i]
                });
            }
        }
    };

    $scope.multiselect = function multiselect(side, model) {
        var index;
        if (side == 'toRight') {
            index = model.lists.A.indexOf(model.selected);
            if (index !== -1) {
                model.lists.A.splice(index, 1);
                model.lists.B.push(model.selected);
            }
        } else {
            index = model.lists.B.indexOf(model.selected);
            if (index !== -1) {
                model.lists.B.splice(index, 1);
                model.lists.A.push(model.selected);
            }
        }
        model.isDirty = true;
        model.selected = null;
        model.fieldValue = '';
        for (var i = 0; i < model.lists.B.length; i++)
            model.fieldValue += model.lists.B[i].value + ';';
        model.fieldValue = model.fieldValue.substr(0, model.fieldValue.length - 1);

        var stringToEval = model.fieldName + '=\'' + model.fieldValue + '\'';
        $parse(stringToEval)($scope);
    };

    /****************************multiselect END**************************/

    /**************Scope Function Start***************/
    $scope.phoneMinLength = function(isInternational, phoneNumber) {
        if (isInternational)
            return 0;
        else {
            if (phoneNumber.indexOf('1') === 0)
                return 16;
            else
                return 14;
        }
    };

    $scope.submit = function(isSubmit) {
        toggleBackdrop();
        //reset form message to empty
        $scope.con.message = '';

        if (isSubmit) {
            if (this.userForm.$invalid) {
                toggleBackdropDouble(500);
                scrollTop(500);
                $scope.con.message = 'Please review the validation errors';
                toggleBackdrop();
                return false;
            }
        }

        ////upsert contact
        $scope.contact.OtherStreet = $scope.contact.OtherStreetLine1__c + '\r\n' + $scope.contact.OtherStreetLine2__c;
        if ($scope.contact.Mailing_Same_as_Perm__c) {
            $scope.contact.OtherStreet = $scope.contact.MailingStreet;
            $scope.contact.OtherStreetLine1__c = $scope.contact.MailingStreetLine1__c;
            $scope.contact.OtherStreetLine2__c = $scope.contact.MailingStreetLine2__c;
            $scope.contact.OtherStreetLine3__c = $scope.contact.MailingStreetLine3__c;
            $scope.contact.Perm_Country__c = $scope.contact.Mailing_Country__c;
            $scope.contact.Perm_City__c = $scope.contact.Mailing_City__c;
            $scope.contact.Perm_State__c = $scope.contact.Mailing_State__c;
            $scope.contact.Perm_State_Province__c = $scope.contact.Mailing_State_Province__c;
            $scope.contact.Perm_Zip_Code__c = $scope.contact.Mailing_Zip_Code__c;
            $scope.contact.Perm_Postal_Code__c = $scope.contact.Mailing_Postal_Code__c;
        }

        var errorMessage = '';

        DataService.updateContact($scope.contact).then(function(contactDescribe) {
            if (contactDescribe.errorMessage)
                errorMessage += contactDescribe.errorMessage + '<br/>';
            else
                $scope.contact = contactDescribe.contact;

            DataService.updateApplication($scope.application).then(function(applicationDescribe) {
                if (applicationDescribe.errorMessage)
                    errorMessage += applicationDescribe.errorMessage;
                if (errorMessage) {
                    toggleBackdrop();
                    logError(errorMessage, true);
                } else if (isSubmit) {
                    window.location.href = ngForceConfig.sitePrefix + '/MyProfile?section=ContactInformation';
                    //window.location.href = ngForceConfig.sitePrefix+'/MyApplication';
                } else {
                    toggleBackdrop();
                    swal({
                        title: 'You have successfully saved your information.',
                        type: 'success',
                        html: true,
                        timer: 1000,
                        showConfirmButton: false
                    });
                }
            });

        });
    };
}); //main con END

angularApp.controller("Ethnicity__cCtrl", function($scope) {
    $scope.model = {
        fieldName: 'contact.Ethnicity__c',
        fieldValue: $scope.contact.Ethnicity__c,
        lists: {
            "A": [],
            "B": []
        },
        selected: null,
        isDirty: false
    };
    $scope.initiateMultiSelect($scope.model, $scope.con.Ethnicity__cOptions);
});
