angularApp.controller("HomepageBuilderCtrl", function($scope, $uibModal, $q, vfr, HomepageBuilderService) {
	//static resource
	$scope.res = {};
	$scope.res.NGD_SLDS = NGD_SLDS;
	$scope.res.NGD_Utilities = NGD_Utilities;

	//namespacePrefix for package
	$scope.namespacePrefix = namespacePrefix;

	$scope.hlListSafe = HomepageBuilderService.getHomepageLayouts();
	//copy the references (you could clone ie angular.copy but then have to go through a dirty checking for the matches)
	$scope.hlList = [].concat($scope.hlListSafe);

	/**********************scope function START**********************/



	$scope.back = function() {

		swal({
				title: 'Are you sure?<br/>Back to setup',
				type: 'info',
				showCancelButton: true,
				confirmButtonText: 'Confirm',
				cancelButtonText: 'Cancel',
				closeOnConfirm: true,
				closeOnCancel: true,
				html: true
			},
			function(isConfirm) {
				if (isConfirm)
					window.parent.location.href = '/setup/forcecomHomepage.apexp';
			});
	};

	$scope.refresh = function() {
		toggleSpin(true);
		vfr.query(NGD_Constant.HOMEPAGE_LAYOUT, '', '', '')
			.then(function(result) {
				$scope.hlListSafe = result.records;
				$scope.hlList = [].concat($scope.hlListSafe);
				toggleSpin(false);
			});
	};

	$scope.setActive = function(hl) {
		if (hl.isSelected !== undefined)
			delete hl.isSelected;
		vfr.upsertData(NGD_Constant.HOMEPAGE_LAYOUT, angular.toJson(hl),
			function(result, event) {
				if (event.status) {
					vfr.query(NGD_Constant.HOMEPAGE_LAYOUT, '', '', '')
						.then(function(result) {
							$scope.hlListSafe = result.records;
							$scope.hlList = [].concat($scope.hlListSafe);
						});
				} else
					logError(event.message);
			}
		);
	};

	$scope.new = function() {
		var modalInstance = $uibModal.open({
			templateUrl: NGD_HomepageBuilderAssets + '/html/HomepageBuilder/LayoutModal.html',
			controller: 'LayoutModalCtrl',
			resolve: {
				parentScope: function() {
					return $scope;
				},
				hlList: function() {
					return $scope.hlList;
				},
				hl: function() {
					var hl = {};
					return hl;
				}
			}
		});
	};

	$scope.edit = function editRow(hl) {
		var modalInstance = $uibModal.open({
			templateUrl: NGD_HomepageBuilderAssets + '/html/HomepageBuilder/LayoutModal.html',
			controller: 'LayoutModalCtrl',
			resolve: {
				parentScope: function() {
					return $scope;
				},
				hlList: function() {
					return $scope.hlList;
				},
				hl: function() {
					return hl;
				}
			}
		});
	};

	$scope.manage = function manage(hl) {
		window.open('/apex/NGD_HomepageBuilder_Manage?id=' + hl.Id);
	};

	$scope.copy = function copy(hl) {
		toggleBackdrop(2, 400);
		vfr.clone(hl.Id,
			function(result, event) {
				if (event.status) {
					vfr.query(NGD_Constant.HOMEPAGE_LAYOUT, '', '', '')
						.then(function(result) {
							$scope.hlListSafe = result.records;
							$scope.hlList = [].concat($scope.hlListSafe);
						});
				} else
					logError(event.message);
			}
		);
	};

	$scope.delete = function removeRow(hl) {
		swal({
				title: 'Are you sure?<br/>Delete layout: ' + hl.Name,
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
					var index = $scope.hlList.indexOf(hl);
					if (index !== -1) {
						vfr.del(NGD_Constant.HOMEPAGE_LAYOUT, hl.Id,
							function(result, event) {
								if (event.status) {
									swal({
										title: 'Deleted!<br />Layout has been deleted.',
										type: 'success',
										html: true
									});
									vfr.query(NGD_Constant.HOMEPAGE_LAYOUT, '', '', '')
										.then(function(result) {
											$scope.hlListSafe = result.records;
											$scope.hlList = [].concat($scope.hlListSafe);
										});
									toggleBackdrop();
								} else
									logError(event.message);
							}
						);
					}
				}
			});
	};
	/**********************scope function END**********************/

});
