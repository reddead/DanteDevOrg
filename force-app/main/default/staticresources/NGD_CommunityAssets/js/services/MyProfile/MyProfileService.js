angularApp.service('MyProfileService', function($q, $timeout, vfr) {

    this.setSecondaryAddress = function(contact) {
        contact.OtherStreet = contact.OtherStreetLine1__c + '\r\n' + contact.OtherStreetLine2__c;
        if (contact.Mailing_Same_as_Perm__c) {
            contact.OtherStreet = contact.MailingStreet;
            contact.OtherStreetLine1__c = contact.MailingStreetLine1__c;
            contact.OtherStreetLine2__c = contact.MailingStreetLine2__c;
            contact.OtherStreetLine3__c = contact.MailingStreetLine3__c;
            contact.Perm_Country__c = contact.Mailing_Country__c;
            contact.Perm_City__c = contact.Mailing_City__c;
            contact.Perm_State__c = contact.Mailing_State__c;
            contact.Perm_State_Province__c = contact.Mailing_State_Province__c;
            contact.Perm_Zip_Code__c = contact.Mailing_Zip_Code__c;
            contact.Perm_Postal_Code__c = contact.Mailing_Postal_Code__c;
        }
    };

    this.updateContact = function(contact) {
        var deferred = $q.defer();
        var contactDescribe = {};

        NGD_DataController.upsertData('Contact', angular.toJson(contact),
            function(result, event) {
                if (!event.status) {
                    contactDescribe.errorMessage = event.message;
                    deferred.resolve(contactDescribe);
                } else {
                    contactDescribe.status = 'success';
                    contactDescribe.contact = result;
                    deferred.resolve(contactDescribe);
                }
            }
        );
        return deferred.promise;
    };

    this.updateApplication = function(application) {
        var deferred = $q.defer();
        var applicationDescribe = {};

        NGD_DataController.upsertData('Application__c', angular.toJson(application),
            function(result, event) {
                if (!event.status) {
                    applicationDescribe.errorMessage = event.message;
                    deferred.resolve(applicationDescribe);
                } else {
                    applicationDescribe.status = 'success';
                    deferred.resolve(applicationDescribe);
                }
            }
        );
        return deferred.promise;
    };

    this.updateApplicationWithTerm = function(application) {
        var deferred = $q.defer();
        var applicationDescribe = {};

        var condition = 'Semester__c=\'' + application.Term_Semester__c + '\' and Year__c=\'' + application.Term_Year__c + '\' limit 1';
        vfr.query('Term__c', 'Id', '', condition)
            .then(function(result) {
                if (result.records[0])
                    application.Term__c = result.records[0].Id;
                else
                    application.Term__c = null;
                NGD_DataController.upsertData('Application__c', angular.toJson(application),
                    function(result, event) {
                        if (!event.status) {
                            applicationDescribe.errorMessage = event.message;
                            deferred.resolve(applicationDescribe);
                        } else {
                            applicationDescribe.status = 'success';
                            deferred.resolve(applicationDescribe);
                        }
                    }
                );
            });
        return deferred.promise;
    };

    this.upsertEducationHistory = function(highSchoolEH) {
        var deferred = $q.defer();
        var educationHistoryDescribe = {};

        NGD_DataController.upsertData('Education_History__c', angular.toJson(highSchoolEH),
            function(result, event) {
                if (!event.status) {
                    educationHistoryDescribe.errorMessage = event.message;
                    deferred.resolve(educationHistoryDescribe);
                } else {
                    educationHistoryDescribe.status = 'success';
                    educationHistoryDescribe.highSchoolEH = result; //assign created reocord back
                    deferred.resolve(educationHistoryDescribe);
                }
            }
        );
        return deferred.promise;
    };

});
