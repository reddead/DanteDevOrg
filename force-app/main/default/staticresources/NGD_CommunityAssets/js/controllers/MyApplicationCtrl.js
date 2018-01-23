var applicationSubmitted = false;
$(window).load(function() {
    if (applicationSubmitted) {
        setTimeout(function() {
            $(':input').attr('disabled', 'disabled');
        }, 500);
    }
});

angularApp.controller("MyApplicationCtrl", function($scope, $q, $parse, $uibModal, $timeout, ngForceConfig, vfr, ERxFormService, DataService) {
    //static resource
    $scope.con.NGD_SLDS = NGD_SLDS;
    $scope.con.NGD_CommunityAssets = NGD_CommunityAssets;
    $scope.con.NGD_Utilities = NGD_Utilities;

    //selected appId
    $scope.con.appId = appId;

    //sobjects
    if (contactJSON && contactJSON != 'null')
        $scope.contact = angular.fromJson(contactJSON); //for create new application, contact Id needed
    //$scope.application;// for create new application, view will init this automatically
    if (applicationsJSON && applicationsJSON != '[]')
        $scope.con.applications = angular.fromJson(applicationsJSON);

    //sobjectsDescribe
    if (applicationDescribeJSON && applicationDescribeJSON != 'null')
        var applicationDescribe = angular.fromJson(applicationDescribeJSON);

    //form  message
    $scope.con.message = '';
    if (!$scope.contact.Personal_Data_Section__c || !$scope.contact.Contact_Info_Section__c)
        $scope.con.message = 'Please complete My Profile first';

    //SELECT YOUR APPLICATION START
    $scope.applicationRedirection = function(app, changeAppType) {
            if (!app.App_Type__c || changeAppType) {
                var modalInstance = $uibModal.open({
                    controller: 'ApplicationTypeModalCtrl as atmc',
                    templateUrl: NGD_CommunityAssets + '/html/ApplicationTypeModal.html',
                    resolve: {
                        parentScope: function() {
                            return $scope;
                        },
                        app: function() {
                            return app;
                        },
                        App_Type__cOptions: function() {
                            return ERxFormService.getPicklistValues(applicationDescribe, 'App_Type__c');
                        },
                        changeAppType: function() {
                            return changeAppType;
                        }
                    }
                });
            } else
                window.location.href = ngForceConfig.sitePrefix + '/NGD_CommunityMyApplication?id=' + app.Id;
        }
        //SELECT YOUR APPLICATION END

    $scope.displayApplicationDetail = function() {
        //if app selected or create new app
        if (appId || $scope.application) {

            //sobjects
            if (applicationJSON && applicationJSON != 'null')
                $scope.application = angular.fromJson(applicationJSON);
            $scope.highSchoolEH = {}; //must init this for highschool typeahead watcher
            if (highSchoolEHJSON && highSchoolEHJSON != 'null')
                $scope.highSchoolEH = angular.fromJson(highSchoolEHJSON);
            $scope.con.collegesEH;
            if (collegesEHJSON && collegesEHJSON != '[]')
                $scope.con.collegesEH = angular.fromJson(collegesEHJSON);
            if (familiesJSON && familiesJSON != '[]')
                $scope.con.families = angular.fromJson(familiesJSON);

            //sobjectsDescribe
            if (contactDescribeJSON && contactDescribeJSON != 'null')
                var contactDescribe = angular.fromJson(contactDescribeJSON);
            if (termDescribeJSON && termDescribeJSON != 'null')
                var termDescribe = angular.fromJson(termDescribeJSON);
            if (educationHistoryDescribeJSON && educationHistoryDescribeJSON != 'null')
                var educationHistoryDescribe = angular.fromJson(educationHistoryDescribeJSON);
            if (familyDescribeJSON && familyDescribeJSON != 'null')
                var familyDescribe = angular.fromJson(familyDescribeJSON);

            //highSchoolTypeAhead
            //$scope.con.highSchoolTypeAhead; //no init if no existing record found, view will init this automatically
            if ($scope.highSchoolEH) {
                if ($scope.highSchoolEH.School__c) {
                    $scope.con.highSchoolTypeAhead = {};
                    $scope.con.highSchoolTypeAhead.Name = $scope.highSchoolEH.School__r.Name + ', ' + $scope.highSchoolEH.School__r.School_City__c + ', ' + $scope.highSchoolEH.School__r.School_State__c;
                    $scope.con.highSchoolTypeAhead.Id = $scope.highSchoolEH.School__c;
                    $scope.con.highSchoolTypeAhead.City = $scope.highSchoolEH.School__r.School_City__c;
                    $scope.con.highSchoolTypeAhead.State = $scope.highSchoolEH.School__r.School_State__c;
                } else if ($scope.highSchoolEH.School_Name_Not_Found__c) {
                    $scope.con.highSchoolTypeAhead = $scope.highSchoolEH.School_Name_Not_Found__c;
                }
            }

            //auto-populate highschool location if found
            $scope.$watch('con.highSchoolTypeAhead', function() {
                if ($scope.con.highSchoolTypeAhead) {
                    if ($scope.con.highSchoolTypeAhead.Id) {
                        $scope.highSchoolEH.School__c = $scope.con.highSchoolTypeAhead.Id;
                        $scope.highSchoolEH.School_Name_Not_Found__c = null;
                        $scope.highSchoolEH.Country__c = 'UNITED STATES OF AMERICA';
                        if ($scope.con.highSchoolTypeAhead.City)
                            $scope.highSchoolEH.City__c = $scope.con.highSchoolTypeAhead.City;
                        else
                            $scope.highSchoolEH.City__c = null;
                        if ($scope.con.highSchoolTypeAhead.State)
                            $scope.highSchoolEH.State__c = $scope.con.highSchoolTypeAhead.State;
                        else
                            $scope.highSchoolEH.State__c = null;
                    } else {
                        $scope.highSchoolEH.School_Name_Not_Found__c = $scope.con.highSchoolTypeAhead;
                        $scope.highSchoolEH.School__c = null;
                    }
                    if (!$scope.highSchoolEH.Application__c)
                        $scope.highSchoolEH.Application__c = $scope.application.Id;
                } else {
                    $scope.highSchoolEH.School__c = null;
                    $scope.highSchoolEH.School_Name_Not_Found__c = null;
                    $scope.highSchoolEH.Country__c = '';
                    $scope.highSchoolEH.City__c = null;
                    $scope.highSchoolEH.State__c = '';
                }
            });
            //highSchoolTypeAhead END

            /*---------------------------------------Select  Options START---------------------------------------*/
            /*---------------------------------------application  START---------------------------------------*/

            $scope.con.Do_You_Plan_to_Apply_For_Financial_Aid__cOptions = ERxFormService.getPicklistValues(applicationDescribe, 'Do_You_Plan_to_Apply_For_Financial_Aid__c');
            $scope.con.Military_Status__cOptions = ERxFormService.getPicklistValues(applicationDescribe, 'Military_Status__c');
            $scope.con.Veterans_Educational_Benefits__cOptions = ERxFormService.getPicklistValues(applicationDescribe, 'Veterans_Educational_Benefits__c');
            $scope.con.Active_Duty__cOptions = ERxFormService.getPicklistValues(applicationDescribe, 'Active_Duty__c');
            $scope.con.Honorably_Discharged__cOptions = ERxFormService.getPicklistValues(applicationDescribe, 'Honorably_Discharged__c');
            $scope.con.AF_Reserves_of_National_Guard__cOptions = ERxFormService.getPicklistValues(applicationDescribe, 'AF_Reserves_of_National_Guard__c');
            $scope.con.Employer_Transfer__cOptions = ERxFormService.getPicklistValues(applicationDescribe, 'Employer_Transfer__c');
            $scope.con.Teacher_s_Contract__cOptions = ERxFormService.getPicklistValues(applicationDescribe, 'Teacher_s_Contract__c');
            $scope.con.Tribe_Member__cOptions = ERxFormService.getPicklistValues(applicationDescribe, 'Tribe_Member__c');
            $scope.con.Temp_Housing__cOptions = ERxFormService.getPicklistValues(applicationDescribe, 'Temp_Housing__c');
            $scope.con.Lived_in_Arizona__cOptions = ERxFormService.getPicklistValues(applicationDescribe, 'Lived_in_Arizona__c');
            $scope.con.Info_about_ADR__cOptions = ERxFormService.getPicklistValues(applicationDescribe, 'Info_about_ADR__c');
            $scope.con.Marital_Status__cOptions = ERxFormService.getPicklistValues(applicationDescribe, 'Marital_Status__c');
            $scope.con.Single_Parent__cOptions = ERxFormService.getPicklistValues(applicationDescribe, 'Single_Parent__c');
            $scope.con.Parent_Bachelor_s_or_Higher__cOptions = ERxFormService.getPicklistValues(applicationDescribe, 'Parent_Bachelor_s_or_Higher__c');
            $scope.con.Primary_Language__cOptions = ERxFormService.getPicklistValues(applicationDescribe, 'Primary_Language__c');
            $scope.con.Work_During_First_Year__cOptions = ERxFormService.getPicklistValues(applicationDescribe, 'Work_During_First_Year__c');
            $scope.con.Current_Employment_Status__cOptions = ERxFormService.getPicklistValues(applicationDescribe, 'Current_Employment_Status__c');
            $scope.con.Home_Computer_Access__cOptions = ERxFormService.getPicklistValues(applicationDescribe, 'Home_Computer_Access__c');
            $scope.con.Parent_1_Country__cOptions = ERxFormService.getPicklistValues(applicationDescribe, 'Parent_1_Country__c');
            $scope.con.Parent_2_Country__cOptions = ERxFormService.getPicklistValues(applicationDescribe, 'Parent_2_Country__c');
            $scope.con.Refugee_Status_in_AZ__cOptions = ERxFormService.getPicklistValues(applicationDescribe, 'Refugee_Status_in_AZ__c');
            $scope.con.Indicate_Provided_License_ID__cOptions = ERxFormService.getPicklistValues(applicationDescribe, 'Indicate_Provided_License_ID__c');
            $scope.con.Indicate_Provided_140_Tax_Form__cOptions = ERxFormService.getPicklistValues(applicationDescribe, 'Indicate_Provided_140_Tax_Form__c');
            $scope.con.Indicate_Provided_Vehicle_Registration__cOptions = ERxFormService.getPicklistValues(applicationDescribe, 'Indicate_Provided_Vehicle_Registration__c');
            $scope.con.Indicate_Provided_Voter_Registration__cOptions = ERxFormService.getPicklistValues(applicationDescribe, 'Indicate_Provided_Voter_Registration__c');

            $scope.con.Accompanying_Family_to_U_S__cOptions = ERxFormService.getPicklistValues(applicationDescribe, 'Accompanying_Family_to_U_S__c');
            $scope.con.Third_Party_Sponsor__cOptions = ERxFormService.getPicklistValues(applicationDescribe, 'Third_Party_Sponsor__c');
            $scope.con.International_Agent_Aided_Application__cOptions = ERxFormService.getPicklistValues(applicationDescribe, 'International_Agent_Aided_Application__c');
            $scope.con.I_20_Form_Release_Method__cOptions = ERxFormService.getPicklistValues(applicationDescribe, 'I_20_Form_Release_Method__c');
            $scope.con.Length_of_Study_at_PIMA__cOptions = ERxFormService.getPicklistValues(applicationDescribe, 'Length_of_Study_at_PIMA__c');
            $scope.con.Doc_Show_Arizona_Perm__cOptions = ERxFormService.getPicklistValues(applicationDescribe, 'Doc_Show_Arizona_Perm__c');
            $scope.con.Arizona_Tax_Filer__cOptions = ERxFormService.getPicklistValues(applicationDescribe, 'Arizona_Tax_Filer__c');

            //checklist
            $scope.Legal_Ties_w_Arizona__cChecklist = {
                fieldName: 'application.Legal_Ties_w_Arizona__c',
                fieldValue: $scope.application.Legal_Ties_w_Arizona__c,
                available: ERxFormService.getPicklistValues2(applicationDescribe, 'Legal_Ties_w_Arizona__c'),
                chosen: $scope.application.Legal_Ties_w_Arizona__c ? $scope.application.Legal_Ties_w_Arizona__c.trim().split(";") : [],
                isDirty: false
            };
            //checklist

            //dependent list
            var Area_of_Study__cOptions = ERxFormService.getPicklistValues1(applicationDescribe, 'Area_of_Study__c'); //dependent picklist
            $scope.con.Area_of_Study__c;
            $scope.con.Area_of_Study__cDependentList = {}; //must init for constructing dependent list map
            angular.forEach(Area_of_Study__cOptions, function(item, i) {
                var ele = ERxFormService.getDependentValues(applicationDescribe, 'Area_of_Major__c', item.value);
                $scope.con.Area_of_Study__cDependentList[item.value] = ele; //construct dependent list map
                //for front end binding, init Area_of_Study__c
                if ($scope.application.Area_of_Study__c == item.value)
                    $scope.con.Area_of_Study__c = ele;
            });


            var Area_of_Study_Alternate__cOptions = ERxFormService.getPicklistValues1(applicationDescribe, 'Area_of_Study_Alternate__c'); //dependent picklist
            $scope.con.Area_of_Study_Alternate__c;
            $scope.con.Area_of_Study_Alternate__cDependentList = {}; //must init for constructing dependent list map
            angular.forEach(Area_of_Study_Alternate__cOptions, function(item, i) {
                var ele = ERxFormService.getDependentValues(applicationDescribe, 'Area_of_Major_Alternate__c', item.value);
                $scope.con.Area_of_Study_Alternate__cDependentList[item.value] = ele; //construct dependent list map
                //for front end binding, init Area_of_Study_Alternate__c
                if ($scope.application.Area_of_Study_Alternate__c == item.value)
                    $scope.con.Area_of_Study_Alternate__c = ele;
            });

            //dependent picklist

            /*---------------------------------------application  END---------------------------------------*/

            /*---------------------------------------Term  START---------------------------------------*/
            $scope.con.Semester__cOptions = ERxFormService.getPicklistValues(termDescribe, 'Semester__c');
            //$scope.Term_INTLSemester__cOptions = ERxFormService.getPicklistValues(termDescribe,'INTLSemester__c');
            $scope.con.Year__cOptions = ERxFormService.getPicklistValues(termDescribe, 'Year__c');

            /*---------------------------------------Term  END---------------------------------------*/

            /*---------------------------------------Contact  START---------------------------------------*/
            $scope.con.Diploma_or_GED__cOptions = ERxFormService.getPicklistValues(contactDescribe, 'Diploma_or_GED__c');
            $scope.con.Attended_College_or_University__cOptions = ERxFormService.getPicklistValues(contactDescribe, 'Attended_College_or_University__c');
            $scope.con.Are_you_in_HIgh_School_Now__cOptions = ERxFormService.getPicklistValues(contactDescribe, 'Are_you_in_HIgh_School_Now__c');
            $scope.con.What_grade_did_you_finish__cOptions = ERxFormService.getPicklistValues(contactDescribe, 'What_grade_did_you_finish__c');

            /*---------------------------------------Contact  END---------------------------------------*/

            /*---------------------------------------educationHistory  START---------------------------------------*/

            $scope.con.Country__cOptions = ERxFormService.getPicklistValues(educationHistoryDescribe, 'Country__c');
            $scope.con.State__cOptions = ERxFormService.getPicklistValues(educationHistoryDescribe, 'State__c');
            $scope.con.Degree__cOptions = ERxFormService.getPicklistValues(educationHistoryDescribe, 'Degree__c');
            /*---------------------------------------educationHistory  END---------------------------------------*/

            /*****************Select Options END*****************/

            /*---------------------------------------Lookup  Options START---------------------------------------*/
            //prgoram offered
            $scope.con.programOfferdOptions;
            var condition = 'Area_of_Study__c=\'' + $scope.application.Area_of_Study__c + '\' and Area_of_Major__c=\'' + $scope.application.Area_of_Major__c + '\' Order By Grouping_Number__c, Program_Offered_Name__c';
            vfr.query('Program_Offered__c', 'Id,Program_Offered_Name__c,Selective_Admissions__c', '', condition)
                .then(function(result) {
                    $scope.con.programOfferdOptions = result.records;
                });

            $scope.con.programOfferdOptionsAlternate;
            var condition = 'Area_of_Study__c=\'' + $scope.application.Area_of_Study_Alternate__c + '\' and Area_of_Major__c=\'' + $scope.application.Area_of_Major_Alternate__c + '\' and Selective_Admissions__c=\'No\' Order By Program_Offered_Name__c';
            vfr.query('Program_Offered__c', 'Id,Program_Offered_Name__c,Selective_Admissions__c', '', condition)
                .then(function(result) {
                    $scope.con.programOfferdOptionsAlternate = result.records;
                });
            //prgoram offered

            //Concentration__c
            $scope.con.Concentration__cOptions;
            var condition = 'Program_Offered__c=\'' + $scope.application.Program_Offered__c + '\'';
            vfr.query('Concentration__c', 'Id,Name', '', condition)
                .then(function(result) {
                    $scope.con.Concentration__cOptions = result.records;
                });

            $scope.con.Concentration__cOptionsAlternate;
            var condition = 'Program_Offered__c=\'' + $scope.application.Program_Offered_Alternate__c + '\'';
            vfr.query('Concentration__c', 'Id,Name', '', condition)
                .then(function(result) {
                    $scope.con.Concentration__cOptionsAlternate = result.records;
                });
            //Concentration__c

            /*---------------------------------------Lookup Options END---------------------------------------*/


            //******************************Datepicker Start******************************//
            $scope.openGraduation_Date_mm_dd_yyyy__cPicker = function($event) {
                $scope.datePickerStatus.openedGraduation_Date_mm_dd_yyyy__c = true;
            };
            $scope.openExpected_HS_Graduation_Date__cPicker = function($event) {
                $scope.datePickerStatus.openedExpected_HS_Graduation_Date__c = true;
            };
            $scope.openDriver_License_State_ID_Issue_Date_Self__cPicker = function($event) {
                $scope.datePickerStatus.openedDriver_License_State_ID_Issue_Date_Self__c = true;
            };
            $scope.openVoter_Registration_Issue_Date_Self__cPicker = function($event) {
                $scope.datePickerStatus.openedVoter_Registration_Issue_Date_Self__c = true;
            };
            $scope.openVehicle_Registration_Issue_Date_Self__cPicker = function($event) {
                $scope.datePickerStatus.openedVehicle_Registration_Issue_Date_Self__c = true;
            };

            $scope.openDriver_License_State_ID_Issue_Date_P_G__cPicker = function($event) {
                $scope.datePickerStatus.openedDriver_License_State_ID_Issue_Date_P_G__c = true;
            };

            $scope.openVoter_Registration_Issue_Date_P_G__cPicker = function($event) {
                $scope.datePickerStatus.openedVoter_Registration_Issue_Date_P_G__c = true;
            };

            $scope.openVehicle_Registration_Issue_Date_P_G__cPicker = function($event) {
                $scope.datePickerStatus.openedVehicle_Registration_Issue_Date_P_G__c = true;
            };

            $scope.datePickerStatus = {
                openedGraduation_Date_mm_dd_yyyy__c: false,
                openedExpected_HS_Graduation_Date__c: false,
                openedDriver_License_State_ID_Issue_Date_Self__c: false,
                openedVoter_Registration_Issue_Date_Self__c: false,
                openedVehicle_Registration_Issue_Date_Self__c: false,
                openedDriver_License_State_ID_Issue_Date_P_G__c: false,
                openedVoter_Registration_Issue_Date_P_G__c: false,
                openedVehicle_Registration_Issue_Date_P_G__c: false
            };
            //******************************Datepicker End******************************//

            /***************Lock  App  START**************/

            //lock app if Application_Submitted__c=true
            if ($scope.application.Application_Submitted__c) {
                applicationSubmitted = true;
            }

            /***************Lock  App  START**************/

            /***************scope function START**************/
            ////popover message
            $scope.isSelectiveAdmission = function(programOfferedId) {
                    if ($scope.con.programOfferdOptions) {
                        var isSelectiveAdmission = false;
                        $scope.con.programOfferdOptions.every(function(item) {
                            if (item.Id == programOfferedId) {
                                if (item.Selective_Admissions__c == 'Yes')
                                    isSelectiveAdmission = true;
                                return false; //break the loop
                            }
                        });
                        return isSelectiveAdmission;
                    }
                }
                ////popover message END


            //new family
            $scope.newFamily = function newFamily() {
                var family = {};
                var modalInstance = $uibModal.open({
                    templateUrl: NGD_CommunityAssets + '/html/FamilyModal.html',
                    controller: 'FamilyModalCtrl as fmc',
                    resolve: {
                        parentScope: function() {
                            return $scope;
                        },
                        familyDescribe: function() {
                            return familyDescribe;
                        },
                        family: function() {
                            return family;
                        }
                    }
                });
            };

            //edit family
            $scope.editFamily = function editFamily(item) {
                var modalInstance = $uibModal.open({
                    templateUrl: NGD_CommunityAssets + '/html/FamilyModal.html',
                    controller: 'FamilyModalCtrl as fmc',
                    resolve: {
                        parentScope: function() {
                            return $scope;
                        },
                        familyDescribe: function() {
                            return familyDescribe;
                        },
                        family: function() {
                            return item;
                        }
                    }
                });
            }

            //remvoe family
            $scope.removeFamily = function removeFamily(item) {
                var familyMemberName = item.First_Name__c + ' ' + item.Last_Name__c;
                swal({
                        title: 'Are you sure?<br/>Delete Family Member: ' + familyMemberName,
                        type: 'error',
                        showCancelButton: true,
                        confirmButtonText: 'Confirm',
                        cancelButtonText: 'Cancel',
                        closeOnConfirm: true,
                        closeOnCancel: true,
                        html: true
                    },
                    function(isConfirm) {
                        if (isConfirm) {
                            toggleBackdrop();
                            var index = $scope.con.families.indexOf(item);
                            if (index !== -1) {
                                vfr.del('Family__c', item.Id,
                                    function(result, event) {
                                        if (event.status) {
                                            swal({
                                                title: 'Deleted!<br />Family Member has been deleted.',
                                                type: 'success',
                                                html: true
                                            });
                                            vfr.query('Family__c', 'Relationship__c,First_Name__c,Last_Name__c,Passport_Country_of_Issue__c,Passport_Number__c,Passport_Expiration_Date__c', '', 'Application__c=\'' + appId + '\'')
                                                .then(function(result) {
                                                    $scope.con.families = result.records;
                                                    toggleBackdrop();
                                                })
                                                .catch(function(event) {
                                                    logError(event.message);
                                                });
                                        } else
                                            logError(event.message);
                                    }
                                );
                            }
                        }
                    }
                );
            }

            //new Education History
            $scope.newRow = function newRow() {
                var collegeEH = {};
                var modalInstance = $uibModal.open({
                    templateUrl: NGD_CommunityAssets + '/html/EducationHistoryModal.html',
                    controller: 'EducationHistoryModalCtrl as ehmc',
                    resolve: {
                        parentScope: function() {
                            return $scope;
                        },
                        collegeEH: function() {
                            return collegeEH;
                        }
                    }
                });
            };

            //edit Education History
            $scope.editRow = function editRow(item) {
                var modalInstance = $uibModal.open({
                    templateUrl: NGD_CommunityAssets + '/html/EducationHistoryModal.html',
                    controller: 'EducationHistoryModalCtrl as ehmc',
                    resolve: {
                        parentScope: function() {
                            return $scope;
                        },
                        collegeEH: function() {
                            return item;
                        }
                    }
                });
            }

            //remvoe Education History
            $scope.removeRow = function removeRow(item) {
                var schoolName = item.School__c ? item.School__r.Name : item.School_Name_Not_Found__c;
                swal({
                        title: 'Are you sure?<br/>Delete College: ' + schoolName,
                        type: 'error',
                        showCancelButton: true,
                        confirmButtonText: 'Confirm',
                        cancelButtonText: 'Cancel',
                        closeOnConfirm: true,
                        closeOnCancel: true,
                        html: true
                    },
                    function(isConfirm) {
                        if (isConfirm) {
                            toggleBackdrop();
                            var index = $scope.con.collegesEH.indexOf(item);
                            if (index !== -1) {
                                vfr.del('Education_History__c', item.Id,
                                    function(result, event) {
                                        if (event.status) {
                                            swal({
                                                title: 'Deleted!<br />College has been deleted.',
                                                type: 'success',
                                                html: true
                                            });
                                            vfr.query('Education_History__c', '', 'RecordType.Id,RecordType.Name,School__r.Id,School__r.Name,School__r.School_City__c,School__r.School_State__c', 'Application__c=\'' + appId + '\' and RecordTypeId=\'' + collegeEHRTId + '\' Order By Name')
                                                .then(function(result) {
                                                    $scope.con.collegesEH = result.records;
                                                    toggleBackdrop();
                                                })
                                                .catch(function(event) {
                                                    logError(event.message);
                                                });
                                        } else
                                            logError(event.message);
                                    }
                                );
                            }
                        }
                    }
                );
            }

            //typeahead highschool
            $scope.searchHighSchool = function(val) {
                var deferred = $q.defer();
                //var condition='RecordTypeId =\''+highSchoolRTId+'\' and Name like \'%' + val + '%\' Order By Name limit 10';
                var condition;
                var strSearch = val.trim().split(" ");
                if (strSearch.length == 2)
                    condition = 'RecordTypeId =\'' + highSchoolRTId + '\' and Name like \'%' + strSearch[0] + '%' + strSearch[1] + '%\' Order By Name limit 10';
                else if (strSearch.length == 3)
                    condition = 'RecordTypeId =\'' + highSchoolRTId + '\' and Name like \'%' + strSearch[0] + '%' + strSearch[1] + '%' + strSearch[2] + '%\'Order By Name limit 10';
                else
                    condition = 'RecordTypeId =\'' + highSchoolRTId + '\' and Name like \'%' + val + '%\' Order By Name limit 10';

                vfr.query('School__c', '', '', condition)
                    .then(function(result) {
                        var options = [];
                        for (var i = 0; i < result.records.length; i++) {
                            var ele = {};
                            ele.Name = result.records[i].Name + ', ' + result.records[i].School_City__c + ', ' + result.records[i].School_State__c;
                            ele.Id = result.records[i].Id;
                            ele.City = result.records[i].School_City__c;
                            ele.State = result.records[i].School_State__c;
                            options.push(ele);
                            if (i == 7) //limited to display 8 records
                                break;
                        }
                        deferred.resolve(options);
                    })
                    .catch(function(event) {
                        logError(event.message);
                    });
                return deferred.promise;
            }

            //set setDependentListModel application.Area_of_Study__c
            $scope.setDependentListModel = function(filedName, selector) {
                var stringToEval;
                var fieldValue = $("select[ng-model*='" + selector + "']")[0].selectedOptions[0].label;
                if (fieldValue == '--None--') {
                    stringToEval = filedName + '=\'\'';
                    if (this.userForm.Area_of_Major__c)
                        this.userForm.Area_of_Major__c.$setPristine(); //dependent field $setPristine() if controller field blank and dependent field value does not change
                } else
                    stringToEval = filedName + '=\'' + fieldValue + '\'';

                stringToEval = stringToEval.replace(/'s/g, "\\'s");
                $parse(stringToEval)($scope);

                toggleBackdropDouble(400);
            }

            $scope.filterProgramOffered = function() {
                if ($scope.con.Area_of_Study__c && $scope.application.Area_of_Major__c) {
                    toggleBackdrop();
                    var condition = 'Area_of_Study__c=\'' + $scope.application.Area_of_Study__c + '\' and Area_of_Major__c=\'' + $scope.application.Area_of_Major__c + '\' Order By Grouping_Number__c,Program_Offered_Name__c';
                    vfr.query('Program_Offered__c', 'Id,Program_Offered_Name__c,Selective_Admissions__c', '', condition)
                        .then(function(result) {
                            $scope.con.programOfferdOptions = result.records;
                            $scope.application.Program_Offered__c = "";
                            $scope.con.Concentration__cOptions = [];
                            toggleBackdrop();
                        })
                        .catch(function(event) {
                            logError(event.message);
                        });
                } else {
                    if (!$('.slds-backdrop').hasClass('slds-backdrop--open')) // prevent repeated toggle
                        toggleBackdropDouble(400);

                    $scope.application.Program_Offered__c = "";
                    $scope.con.programOfferdOptions = [];

                    //dependent field $setPristine() if controller field blank and dependent field value changes
                    if (!$scope.con.Area_of_Study__c && this.userForm.Area_of_Major__c)
                        this.userForm.Area_of_Major__c.$setPristine();

                    //dependent field $setPristine() if controller field blank
                    if (!$scope.con.Area_of_Major__c && this.userForm.Program_Offered__c)
                        this.userForm.Program_Offered__c.$setPristine();
                }
            }

            $scope.filterProgramOfferedAlternate = function() {
                if ($scope.con.Area_of_Study_Alternate__c && $scope.application.Area_of_Major_Alternate__c) {
                    toggleBackdrop();
                    var condition = 'Area_of_Study__c=\'' + $scope.application.Area_of_Study_Alternate__c + '\' and Area_of_Major__c=\'' + $scope.application.Area_of_Major_Alternate__c + '\' and Selective_Admissions__c=\'No\' Order By Grouping_Number__c,Program_Offered_Name__c';
                    vfr.query('Program_Offered__c', 'Id,Program_Offered_Name__c,Selective_Admissions__c', '', condition)
                        .then(function(result) {
                            $scope.con.programOfferdOptionsAlternate = result.records;
                            $scope.application.Program_Offered_Alternate__c = "";
                            $scope.con.Concentration__cOptionsAlternate = [];
                            toggleBackdrop();
                        })
                        .catch(function(event) {
                            logError(event.message);
                        });
                } else {
                    if (!$('.slds-backdrop').hasClass('slds-backdrop--open')) // prevent repeated toggle
                        toggleBackdropDouble(400);

                    $scope.application.Program_Offered_Alternate__c = "";
                    $scope.con.programOfferdOptionsAlternate = [];

                    //dependent field $setPristine() if controller field blank and dependent field value changes
                    if (!$scope.con.Area_of_Study_Alternate__c && this.userForm.Area_of_Major_Alternate__c)
                        this.userForm.Area_of_Major_Alternate__c.$setPristine();

                    //dependent field $setPristine() if controller field blank
                    if (!$scope.con.Area_of_Major_Alternate__c && this.userForm.Program_Offered_Alternate__c)
                        this.userForm.Program_Offered_Alternate__c.$setPristine();
                }
            }

            $scope.filterConcentration = function() {
                if ($scope.application.Program_Offered__c) {
                    toggleBackdrop();
                    var condition = 'Program_Offered__c=\'' + $scope.application.Program_Offered__c + '\'';
                    vfr.query('Concentration__c', 'Id,Name', '', condition)
                        .then(function(result) {
                            $scope.con.Concentration__cOptions = result.records;
                            toggleBackdrop();
                        })
                        .catch(function(event) {
                            logError(event.message);
                        });
                } else {
                    $scope.application.Concentration__c = "";
                    $scope.con.Concentration__cOptions = [];
                }
            }

            $scope.filterConcentrationAlternate = function() {
                if ($scope.application.Program_Offered_Alternate__c) {
                    toggleBackdrop();
                    var condition = 'Program_Offered__c=\'' + $scope.application.Program_Offered_Alternate__c + '\'';
                    vfr.query('Concentration__c', 'Id,Name', '', condition)
                        .then(function(result) {
                            $scope.con.Concentration__cOptionsAlternate = result.records;
                            toggleBackdrop();
                        })
                        .catch(function(event) {
                            logError(event.message);
                        });
                } else {
                    $scope.application.Concentration_Alternate__c = "";
                    $scope.con.Concentration__cOptionsAlternate = [];
                }
            }

            ///checklist
            $scope.checklist = function(model) {
                $timeout(function() {
                    model.isDirty = true;
                    model.fieldValue = '';

                    if (model.chosen.indexOf('None of the above') != -1) {
                        model.fieldValue = 'None of the above';
                        model.chosen = ['None of the above'];
                    } else {
                        for (var i = 0; i < model.chosen.length; i++)
                            model.fieldValue += model.chosen[i] + ';';
                        model.fieldValue = model.fieldValue.substr(0, model.fieldValue.length - 1);
                    }

                    var stringToEval = model.fieldName + '=\'' + model.fieldValue + '\'';
                    stringToEval = stringToEval.replace(/'s/g, "\\'s");
                    $parse(stringToEval)($scope);
                });
            }

            $scope.clearChecklist = function(model) {
                    model.chosen = [];
                }
                //checklist END

            //form submit
            $scope.submit = function(isSubmit) {
                toggleBackdrop();
                //reset form message to empty
                $scope.con.message = '';

                //if isSubmit true, do all validations
                if (isSubmit) {
                    //required fields validation
                    if (this.userForm.$invalid) {
                        toggleBackdropDouble(500);
                        scrollTop(500);
                        $scope.con.message = 'Please review the validation errors';
                        toggleBackdrop();
                        return false;
                    }

                    //if hit here means all validations passed, then set admission status to Submitted App
                    $scope.application.Admissions_Status__c = 'Submitted App';
                    $scope.application.Application_Submitted__c = true;
                }

                var errorMessage = '';
                DataService.updateContact($scope.contact).then(function(contactDescribe) {
                    if (contactDescribe.errorMessage)
                        errorMessage += contactDescribe.errorMessage + '<br/>';

                    DataService.updateApplicationWithTerm($scope.application).then(function(applicationDescribe) {
                        if (applicationDescribe.errorMessage)
                            errorMessage += applicationDescribe.errorMessage;

                        if (!$scope.highSchoolEH.Application__c) {
                            if (errorMessage) {
                                toggleBackdrop();
                                logError(errorMessage, true);
                            } else if (isSubmit) {
                                swal({
                                    title: 'Thank you for submitting an Application!',
                                    type: 'success',
                                    html: true,
                                    showConfirmButton: false
                                });
                                setTimeout(function() {
                                    window.location.href = ngForceConfig.sitePrefix + '/';
                                }, 1000);
                            } else {
                                toggleBackdrop();
                                swal({
                                    title: 'You have successfully saved your information.<br/> If you would like to submit your application, please complete the required fields and click the Submit button.',
                                    type: 'success',
                                    html: true,
                                    showConfirmButton: true
                                });
                            }
                        } else {
                            DataService.upsertEducationHistory($scope.highSchoolEH).then(function(educationHistoryDescribe) {
                                if (educationHistoryDescribe.errorMessage)
                                    errorMessage += applicationDescribe.errorMessage;
                                else
                                    $scope.highSchoolEH.Id = educationHistoryDescribe.highSchoolEH.Id;

                                if (errorMessage) {
                                    toggleBackdrop();
                                    logError(errorMessage, true);
                                } else if (isSubmit) {
                                    swal({
                                        title: 'Thank you for submitting an Application!',
                                        type: 'success',
                                        html: true,
                                        showConfirmButton: false
                                    });
                                    setTimeout(function() {
                                        window.location.href = ngForceConfig.sitePrefix + '/';
                                    }, 1000);
                                } else {
                                    toggleBackdrop();
                                    swal({
                                        title: 'You have successfully saved your information.<br/> If you would like to submit your application, please complete the required fields and click the Submit button.',
                                        type: 'success',
                                        html: true,
                                        showConfirmButton: true
                                    });
                                }
                            }); //DataService.upsertEducationHistory End
                        }
                    }); //DataService.updateApplicationWithTerm End

                }); //DataService.updateContact End

            }; //SAVE END
            /***************scope function END**************/
        } //if(appId) END
    }; //displayApplicationDetail END

    $scope.displayApplicationDetail();

    $scope.createNewApplication = function() {
        $scope.application = {};
        $scope.application.Applicant__c = $scope.contact.Id;
        $scope.application.Admissions_Status__c = 'Started Application';

        NGD_DataController.upsertData('Enrollment_Opportunity__c', angular.toJson($scope.application),
            function(result, event) {
                if (event.status)
                    $scope.application.Id = result.Id //assign created reocord Id back
                else
                    logError(event.message);
            }
        );
        $scope.displayApplicationDetail();
    }
});
