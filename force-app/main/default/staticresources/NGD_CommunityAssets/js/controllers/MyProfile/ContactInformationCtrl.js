angularApp.controller('ContactInformationCtrl', function($scope, ngForceConfig, DataService, MyProfileService) {
  var dataResults = DataService.getData(dataResultsJSON);
  if (dataResults) {
    //static resource
    $scope.res = {};
    $scope.res.NGD_SLDS = NGD_SLDS;
    $scope.res.NGD_Utilities = NGD_Utilities;

    //contact
    $scope.contact = DataService.getContact(dataResults.contactJSON);
    //active application
    $scope.application = DataService.getApplication(dataResults.applicationJSON);
    //contactDescribe
    var contactDescribe = DataService.getDescribe(dataResults.contactDescribeJSON);
    //contactFieldMap
    var contactFieldMap = DataService.getFieldMap(contactDescribe, 'picklist, multipicklist');
    //contactPicklistOptionsMap
    $scope.contactPicklistOptionsMap = DataService.getPicklistOptionsMap(contactFieldMap, true, '--None--', '');
    $scope.contactPicklistOptionsMap.Ethnicity__c = DataService.getPicklistOptions(contactFieldMap, 'Ethnicity__c', false);
    $scope.contactPicklistOptionsMap.Multi_Ethnicity__c = DataService.getMultipicklistOptions(contactFieldMap, 'Multi_Ethnicity__c', false);

    //sobjectsPicklistOptionsMap - FormDirectives use it to get corresponding PicklistOptions
    $scope.ObjectName_PicklistOptionsMap = {};
    $scope.ObjectName_PicklistOptionsMap.contact = $scope.contactPicklistOptionsMap;

    $scope.previous = function() {
      window.location.href = ngForceConfig.sitePrefix + '/NGD_CommunityMyProfile';
    };

    $scope.next = function(isNext) {
      //validate only when next button clicked
      if (isNext) {
        if (this.form.$invalid) {
          toggleBackdrop(2, 500);
          scrollTop(500);
          return false;
        }
      }

      toggleBackdrop(1);
      MyProfileService.updateContact($scope.contact).then(function(contactDescribe) {
        var errorMessage = '';
        if (contactDescribe.errorMessage)
          errorMessage += contactDescribe.errorMessage + '<br/>';

        if (errorMessage) {
          toggleBackdrop(1);
          logError(errorMessage, true);
        } else if (isNext) {
          window.location.href = ngForceConfig.sitePrefix + '/NGD_CommunityMyProfile?view=ContactInformation';
        } else {
          toggleBackdrop(1);
          swal({
            title: 'You have successfully saved your information.',
            type: 'success',
            html: true,
            timer: 1000,
            showConfirmButton: false
          });
        }
      });
    };
  }
});
