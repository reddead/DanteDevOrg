angularApp.controller('ApplicationTypeModalCtrl', function($scope,$uibModalInstance, $q,vfr, parentScope, app,App_Type__cOptions,changeAppType) {
	this.appType=[];
	var appTypeOptions=angular.copy(App_Type__cOptions);
	appTypeOptions.splice(0,1);
	var arrayLength=parseInt(appTypeOptions.length%3==0?appTypeOptions.length/3:appTypeOptions.length/3+1);

	for(var i=0;i<arrayLength;i++){
		if(appTypeOptions.length>2){
			this.appType.push({options:[appTypeOptions[0].value, appTypeOptions[1].value,appTypeOptions[2].value]});
			appTypeOptions.splice(0, 3);
		}
		else if(appTypeOptions.length==2)
		this.appType.push({options:[appTypeOptions[0].value, appTypeOptions[1].value]});
		else if(appTypeOptions.length==1)
		this.appType.push({options:[appTypeOptions[0].value]});
		
	}

	$scope.setAppType= function(val) {
		app.App_Type__c=val;
		NGD_DataController.upsertData('EnrollmentrxRx__Enrollment_Opportunity__c', angular.toJson(app),
			function(result, event) {
				if(event.status){
					if(!changeAppType)
					window.location.href='/MyApplication_ng?id='+app.Id;
					else
					$uibModalInstance.dismiss('cancel');
				}
				else
				logError(event.message);
			}
		);
		
	}

	$scope.cancel = function() {
        $uibModalInstance.dismiss('cancel');
    };
});