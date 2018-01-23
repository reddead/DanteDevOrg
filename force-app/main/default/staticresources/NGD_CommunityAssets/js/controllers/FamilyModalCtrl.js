angularApp.controller('FamilyModalCtrl', function($scope,$uibModalInstance, $q,vfr, ERxFormService,parentScope, familyDescribe,family) {
    $scope.family = angular.copy(family);

	//select options
	this.Relationship__cOptions=ERxFormService.getPicklistValues(familyDescribe,'Relationship__c');
	this.Passport_Country_of_Issue__cOptions=ERxFormService.getPicklistValues(familyDescribe,'Passport_Country_of_Issue__c');

	$scope.cancel = function() {
        $uibModalInstance.dismiss('cancel');
    };

	//date picker
	$scope.openPassport_Expiration_Date__cPicker = function($event) {
        $scope.datePickerStatus.openedPassport_Expiration_Date__c = true;
    };
    $scope.datePickerStatus = {
        openedPassport_Expiration_Date__c: false
    };

	//save
	$scope.save = function() {
		$uibModalInstance.dismiss('cancel');
		toggleBackdrop();
		if(!$scope.family.Application__c)
		$scope.family.Application__c=parentScope.application.Id;
		NGD_DataController.upsertData('Family__c', angular.toJson($scope.family),
            function(result, event) {
				if(event.status){
					vfr.query('Family__c', 'Relationship__c,First_Name__c,Last_Name__c,Passport_Country_of_Issue__c,Passport_Number__c,Passport_Expiration_Date__c', '', 'Application__c=\'' + parentScope.application.Id + '\'')
						.then(function(result) {
							parentScope.con.families=result.records;
							toggleBackdrop();
						})
						.catch(function(event) {
							logError(event.message);
						});
				}
				else
				logError(event.message);
			}
        );
	}


});