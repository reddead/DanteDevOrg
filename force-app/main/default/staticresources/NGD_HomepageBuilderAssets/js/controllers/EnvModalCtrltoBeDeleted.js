angularApp.controller('EnvModalCtrl', function($scope,$uibModalInstance, $q,vfr, parentScope,envList) {
	this.envGroup=[];
	var envOptions=angular.copy(envList);

	angular.forEach(envOptions, function(item, i) {
		if(item.Env_Status__c=='Test')
		item.selection={'background' : '#4bca81'};
		else if(item.Env_Status__c=='Live')
		item.selection={'background' : '#005fb2'};
		else if(item.Env_Status__c=='Idle')
		item.selection={'background' : '#5C2FDA'};
	});

	var arrayLength=parseInt(envOptions.length%3==0?envOptions.length/3:envOptions.length/3+1);

	for(var i=0;i<arrayLength;i++){
		if(envOptions.length>2){
			this.envGroup.push({envs:[envOptions[0], envOptions[1],envOptions[2]]});
			envOptions.splice(0, 3);
		}
		else if(envOptions.length==2)
		this.envGroup.push({envs:[envOptions[0], envOptions[1]]});
		else if(envOptions.length==1)
		this.envGroup.push({envs:[envOptions[0]]});
		
	}

	$scope.setEnv= function(env) {
		parentScope.env=env;
		
		if(env.Env_Status__c=='Test'){
			parentScope.envBadgeStyle={'background' : '#4bca81', 'color' : '#fff'};
		}
		else if(env.Env_Status__c=='Live'){
			parentScope.envBadgeStyle={'background' : '#005fb2', 'color' : '#fff'};
		}
		else if(env.Env_Status__c=='Idle'){
			parentScope.envBadgeStyle={'background' : '#5C2FDA', 'color' : '#fff'};
		}

		parentScope.loadTableData('Env__c=\'' + env.Id + '\'');

		$uibModalInstance.dismiss('cancel');
	}

	$scope.cancel = function() {
        $uibModalInstance.dismiss('cancel');
    }

});