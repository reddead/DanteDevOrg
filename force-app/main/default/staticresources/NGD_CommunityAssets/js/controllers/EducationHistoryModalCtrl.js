angularApp.controller('EducationHistoryModalCtrl', function($scope,$uibModalInstance, $q,vfr, parentScope, collegeEH) {
    $scope.collegeEH = angular.copy(collegeEH);
	if(collegeEH.Id)
	this.collegeTypeAhead={};//init collegeTypeAhead if existing record
	//else
	//this.collegeTypeAhead;//do not init collegeTypeAhead if new record , preventing from displaying as [object Object]

	if(collegeEH){//if existing college record
		//collegeTypeAhead init
		if($scope.collegeEH.School__c){
			this.collegeTypeAhead.Name=$scope.collegeEH.School__r.Name+', '+$scope.collegeEH.School__r.High_School_City__c+', '+$scope.collegeEH.School__r.High_School_State__c;
			this.collegeTypeAhead.Id=$scope.collegeEH.School__c;
			this.collegeTypeAhead.City=$scope.collegeEH.School__r.High_School_City__c;
			this.collegeTypeAhead.State=$scope.collegeEH.School__r.High_School_State__c;
		}
		else if($scope.collegeEH.School_Name_Not_Found__c)
		this.collegeTypeAhead=$scope.collegeEH.School_Name_Not_Found__c;
	}

	//populate college location if found
	$scope.$watch('ehmc.collegeTypeAhead', function () {
		if($scope.ehmc.collegeTypeAhead){
			if($scope.ehmc.collegeTypeAhead.Id){
				$scope.collegeEH.School__c=$scope.ehmc.collegeTypeAhead.Id;
				$scope.collegeEH.School_Name_Not_Found__c=null;
				$scope.collegeEH.Country__c='UNITED STATES OF AMERICA';
				if($scope.ehmc.collegeTypeAhead.City)
				$scope.collegeEH.City__c=$scope.ehmc.collegeTypeAhead.City;
				else
				$scope.collegeEH.City__c=null;
				if($scope.ehmc.collegeTypeAhead.State)
				$scope.collegeEH.State__c=$scope.ehmc.collegeTypeAhead.State;
				else
				$scope.collegeEH.State__c==null;
			}
			else{
				$scope.collegeEH.School_Name_Not_Found__c=$scope.ehmc.collegeTypeAhead;
				$scope.collegeEH.School__c=null;
			}
			if(!$scope.collegeEH.Application__c)
			$scope.collegeEH.Application__c=parentScope.application.Id;
			if(!$scope.collegeEH.RecordTypeId)
			$scope.collegeEH.RecordTypeId=collegeEHRTId;
		}
		else{
			$scope.collegeEH.School__c=null;
			$scope.collegeEH.School_Name_Not_Found__c=null;
			$scope.collegeEH.Country__c='';
			$scope.collegeEH.City__c=null;
			$scope.collegeEH.State__c='';
		}
	});


	//select options
	this.Country__cOptions=parentScope.con.Country__cOptions;
	this.State__cOptions=parentScope.con.State__cOptions;
	this.Degree__cOptions=parentScope.con.Degree__cOptions;

	$scope.cancel = function() {
        $uibModalInstance.dismiss('cancel');
    };

	//date picker
	$scope.openGraduation_Date_mm_dd_yyyy__cPicker = function($event) {
        $scope.datePickerStatus.openedGraduation_Date_mm_dd_yyyy__c = true;
    };
    $scope.datePickerStatus = {
        openedGraduation_Date_mm_dd_yyyy__c: false
    };


	////////////////scope function
	//typeahead highschool
	$scope.searchCollege=function(val){
	    var deferred = $q.defer();
		//var condition='RecordTypeId =\''+collegeRTId+'\' and Name like \'%' + val + '%\' Order By Name limit 10';
		var condition;
		var strSearch = val.trim().split(" ");
		if(strSearch.length==2)
		condition='RecordTypeId =\''+collegeRTId+'\' and Name like \'%' + strSearch[0] + '%' + strSearch[1] + '%\' Order By Name limit 10';
		else if(strSearch.length==3)
		condition='RecordTypeId =\''+collegeRTId+'\' and Name like \'%' + strSearch[0] + '%' + strSearch[1] + '%' + strSearch[2] + '%\'Order By Name limit 10';
		else
		condition='RecordTypeId =\''+collegeRTId+'\' and Name like \'%' + val + '%\' Order By Name limit 10';

		vfr.query('School__c','','',condition)
			.then(function(result) {
				var options=[];
				for(var i=0;i<result.records.length;i++){
					var ele={};
					ele.Name=result.records[i].Name+', '+result.records[i].School_City__c+', '+result.records[i].School_State__c;
					ele.Id=result.records[i].Id;
					ele.City=result.records[i].School_City__c;
					ele.State=result.records[i].School_State__c;
					options.push(ele);
					if(i==7)
					break;
				}
				deferred.resolve(options);

			})
			.catch(function(event) {
				logError(event.message);
			});
			return deferred.promise;
	};

	//save Education History
	$scope.save = function() {
		$uibModalInstance.dismiss('cancel');
		toggleBackdrop();
		NGD_DataController.upsertData('Education_History__c', angular.toJson($scope.collegeEH),
            function(result, event) {
				if(event.status){
					vfr.query('Education_History__c', '', 'RecordType.Id,RecordType.Name,School__r.Id,School__r.Name,School__r.High_School_City__c,School__r.High_School_State__c', 'Application__c=\'' + parentScope.application.Id + '\' and RecordTypeId=\'' + collegeEHRTId + '\' Order By Name')
						.then(function(result) {
							parentScope.con.collegesEH=result.records;
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
