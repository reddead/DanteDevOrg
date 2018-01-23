angularApp.controller("ManageCtrl", function($scope, $sce, $uibModal, $compile, $timeout, $window, HomepageBuilderService, vfr) {
	//static resource
	$scope.res = {};
	$scope.res.NGD_SLDS = NGD_SLDS;
	$scope.res.NGD_Utilities = NGD_Utilities;
	$scope.res.NGD_HomepageBuilderAssets = NGD_HomepageBuilderAssets;

	//namespacePrefix for package
	$scope.namespacePrefix = namespacePrefix;

	////
	$scope.hl = HomepageBuilderService.getHomepageLayout();

	$scope.ht = HomepageBuilderService.getHomepageTemplate();
	if ($scope.ht) {
		$scope.ht[namespacePrefix + 'Header__c'] = $sce.trustAsHtml($scope.ht[namespacePrefix + 'Header__c']);
		$scope.ht[namespacePrefix + 'Footer__c'] = $sce.trustAsHtml($scope.ht[namespacePrefix + 'Footer__c']);
	} else
		$scope.ht = {};


	//get all hw id for grid content init
	var hwIdMap = HomepageBuilderService.getMapHWIdMap();

	//reset field Previvew__c, Previvew__c for each hw needs to be rer-calculated when widget modal open
	//resetPreview();

	$window.onbeforeunload = confirmExit;

	////init grid stack
	var options = {
		cellHeight: 1,
		float: false,
		width: 24,
		verticalMargin: 10,
		alwaysShowResizeHandle: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
		resizable: {
			handles: 'e, se, s, sw, w'
		}
	};
	$('.grid-stack').gridstack(options);
	var grid = $('.grid-stack').data('gridstack');
	HomepageBuilderService.initGridStack($scope, grid, $scope.hl, hwIdMap);

	////
	$scope.openTemplateModal = function openTemplateModal() {
		var modalInstance = $uibModal.open({
			templateUrl: NGD_HomepageBuilderAssets + '/html/HomepageBuilder_Manage/TemplateModal.html',
			controller: 'TemplateModalCtrl',
			resolve: {
				parentScope: function() {
					return $scope;
				}
			}
		});
	};

	////
	$scope.widgetModal = function widgetModal(number) {
		$scope.hwcList = [];
		var modalInstance = $uibModal.open({
			templateUrl: NGD_HomepageBuilderAssets + '/html/HomepageBuilder_Manage/WidgetModal.html',
			controller: 'WidgetModalCtrl',
			resolve: {
				parentScope: function() {
					return $scope;
				},
				number: function() {
					return number;
				}
			}
		});
	};

	$scope.addWidget = function() {
		var widgetNumberMap = {}; // gather all existing widget number
		angular.forEach(grid.container.context.childNodes, function(item) {
			widgetNumberMap[item.childNodes[0].childNodes[1].textContent] = true;
		});

		var numberList = [];
		for (var i = 1; i <= 16; i++) {
			numberList.push('W' + i.toString());
		}

		var isLimitReached = true;
		numberList.every(function(number) {
			if (!widgetNumberMap[number]) {
				grid.addWidget($(getContent(number)), 0, 0, 6, 20, true);

				isLimitReached = false;
				return false;
			} else
				return true;
		});
		if (isLimitReached) {
			swal({
				title: 'You have reached the maximum number of  homepage widgets  allowed : 16',
				type: 'error',
				html: true,
				showConfirmButton: true
			});
		}

		HomepageBuilderService.processGridContent($scope, $(".grid-stack-item"));
	};

	$scope.deleteWidget = function(event) {
		grid.removeWidget($(event.currentTarget).parents('.grid-stack-item'));
	};

	$scope.removeBorder = function() {
		$('.grid-stack-item-content').toggleClass('grid-stack-item-content-border');
	};

	$scope.saveGrid = function() {
		$scope.hl[namespacePrefix + 'Grid_Data__c'] = JSON.stringify(HomepageBuilderService.getGridData());
		$scope.hl[namespacePrefix + 'Grid_Width__c'] = document.getElementById('dz-container').style.maxWidth;

		vfr.upsertData(NGD_Constant.HOMEPAGE_LAYOUT, angular.toJson($scope.hl),
			function(result, event) {
				if (event.status)
					swal({
						title: 'Layout has been saved.',
						type: 'success',
						html: true
					});
				else
					logError(event.message);
			}
		);
	};

	$scope.restoreGrid = function() {
		swal({
				title: 'Are you sure?<br/>Unsaved change will be lost if restore layout',
				text: '',
				imageUrl: NGD_SLDS + "/assets/icons/utility/info_120.png",
				imageSize: "60x60",
				showCancelButton: true,
				confirmButtonText: 'Confirm',
				cancelButtonText: 'Cancel',
				closeOnConfirm: false,
				closeOnCancel: true,
				html: true
			},
			function(isConfirm) {
				var confirmed;
				if (isConfirm) {
					grid.removeAll();

					HomepageBuilderService.initGridStack($scope, grid, $scope.hl, hwIdMap);

					// //reset field Previvew__c, Previvew__c for each hw needs to be rer-calculated when widget modal open
					// //resetPreview();

					swal({
						title: 'Layout has been restored.',
						type: 'success',
						html: true
					});
				}
			});
	};

	$scope.generateGrid = function() {
			grid.removeAll();

			if(positionGlobal===0)
			generateMatrix(grid,[{"x":0,"y":0,"width":24,"height":76,"number":"W1"}]);

			else if(positionGlobal==1)
			generateMatrix(grid,[{"x":0,"y":0,"width":12,"height":76,"number":"W1"},{"x":12,"y":0,"width":12,"height":76,"number":"W2"}]);

			else if(positionGlobal==2)
			generateMatrix(grid,[{"x":0,"y":0,"width":8,"height":76,"number":"W1"},{"x":8,"y":0,"width":8,"height":76,"number":"W2"},{"x":16,"y":0,"width":8,"height":76,"number":"W3"}]);

			else if(positionGlobal==3)
			generateMatrix(grid,[{"x":0,"y":0,"width":6,"height":76,"number":"W1"},{"x":6,"y":0,"width":6,"height":76,"number":"W2"},{"x":12,"y":0,"width":6,"height":76,"number":"W3"},{"x":18,"y":0,"width":6,"height":76,"number":"W4"}]);

			else if(positionGlobal==4)
			generateMatrix(grid,[{"x":0,"y":0,"width":24,"height":38,"number":"W1"},{"x":0,"y":38,"width":24,"height":38,"number":"W2"}]);

			else if(positionGlobal==5)
			generateMatrix(grid,[{"x":0,"y":0,"width":12,"height":38,"number":"W1"},{"x":12,"y":0,"width":12,"height":38,"number":"W2"},{"x":0,"y":38,"width":12,"height":38,"number":"W3"},{"x":12,"y":38,"width":12,"height":38,"number":"W4"}]);

		    else if(positionGlobal==6)
			generateMatrix(grid,[{"x":0,"y":0,"width":8,"height":38,"number":"W1"},{"x":8,"y":0,"width":8,"height":38,"number":"W2"},{"x":16,"y":0,"width":8,"height":38,"number":"W3"},{"x":0,"y":38,"width":8,"height":38,"number":"W4"},{"x":8,"y":38,"width":8,"height":38,"number":"W5"},{"x":16,"y":38,"width":8,"height":38,"number":"W6"}]);

		    else if(positionGlobal==7)
			generateMatrix(grid,[{"x":0,"y":0,"width":6,"height":38,"number":"W1"},{"x":6,"y":0,"width":6,"height":38,"number":"W2"},{"x":12,"y":0,"width":6,"height":38,"number":"W3"},{"x":18,"y":0,"width":6,"height":38,"number":"W4"},{"x":0,"y":38,"width":6,"height":38,"number":"W5"},{"x":6,"y":38,"width":6,"height":38,"number":"W6"},{"x":12,"y":38,"width":6,"height":38,"number":"W7"},{"x":18,"y":38,"width":6,"height":38,"number":"W8"}]);

			else if(positionGlobal==8)
			generateMatrix(grid,[{"x":0,"y":0,"width":24,"height":26,"number":"W1"},{"x":0,"y":26,"width":24,"height":26,"number":"W2"},{"x":0,"y":52,"width":24,"height":26,"number":"W3"}]);

			else if(positionGlobal==9)
			generateMatrix(grid,[{"x":0,"y":0,"width":12,"height":26,"number":"W1"},{"x":12,"y":0,"width":12,"height":26,"number":"W2"},{"x":0,"y":26,"width":12,"height":26,"number":"W3"},{"x":12,"y":26,"width":12,"height":26,"number":"W4"},{"x":0,"y":52,"width":12,"height":26,"number":"W5"},{"x":12,"y":52,"width":12,"height":26,"number":"W6"}]);

		    else if(positionGlobal==10)
			generateMatrix(grid,[{"x":0,"y":0,"width":8,"height":26,"number":"W1"},{"x":8,"y":0,"width":8,"height":26,"number":"W2"},{"x":16,"y":0,"width":8,"height":26,"number":"W3"},{"x":0,"y":26,"width":8,"height":26,"number":"W4"},{"x":8,"y":26,"width":8,"height":26,"number":"W5"},{"x":16,"y":26,"width":8,"height":26,"number":"W6"},{"x":0,"y":52,"width":8,"height":26,"number":"W7"},{"x":8,"y":52,"width":8,"height":26,"number":"W8"},{"x":16,"y":52,"width":8,"height":26,"number":"W9"}]);

			else if(positionGlobal==11)
			generateMatrix(grid,[{"x":0,"y":0,"width":6,"height":26,"number":"W1"},{"x":6,"y":0,"width":6,"height":26,"number":"W2"},{"x":12,"y":0,"width":6,"height":26,"number":"W3"},{"x":18,"y":0,"width":6,"height":26,"number":"W4"},{"x":0,"y":26,"width":6,"height":26,"number":"W5"},{"x":6,"y":26,"width":6,"height":26,"number":"W6"},{"x":12,"y":26,"width":6,"height":26,"number":"W7"},{"x":18,"y":26,"width":6,"height":26,"number":"W8"},{"x":0,"y":52,"width":6,"height":26,"number":"W9"},{"x":6,"y":52,"width":6,"height":26,"number":"W10"},{"x":12,"y":52,"width":6,"height":26,"number":"W11"},{"x":18,"y":52,"width":6,"height":26,"number":"W12"}]);

			else if(positionGlobal==12)
			generateMatrix(grid,[{"x":0,"y":0,"width":24,"height":20,"number":"W1"},{"x":0,"y":20,"width":24,"height":20,"number":"W2"},{"x":0,"y":40,"width":24,"height":20,"number":"W3"},{"x":0,"y":60,"width":24,"height":20,"number":"W4"}]);

		    else if(positionGlobal==13)
			generateMatrix(grid,[{"x":0,"y":0,"width":12,"height":20,"number":"W1"},{"x":12,"y":0,"width":12,"height":20,"number":"W2"},{"x":0,"y":20,"width":12,"height":20,"number":"W3"},{"x":12,"y":20,"width":12,"height":20,"number":"W4"},{"x":0,"y":40,"width":12,"height":20,"number":"W5"},{"x":12,"y":40,"width":12,"height":20,"number":"W6"},{"x":0,"y":60,"width":12,"height":20,"number":"W7"},{"x":12,"y":60,"width":12,"height":20,"number":"W8"}]);

			else if(positionGlobal==14)
			generateMatrix(grid,[{"x":0,"y":0,"width":8,"height":20,"number":"W1"},{"x":8,"y":0,"width":8,"height":20,"number":"W2"},{"x":16,"y":0,"width":8,"height":20,"number":"W3"},{"x":0,"y":20,"width":8,"height":20,"number":"W4"},{"x":8,"y":20,"width":8,"height":20,"number":"W5"},{"x":16,"y":20,"width":8,"height":20,"number":"W6"},{"x":0,"y":40,"width":8,"height":20,"number":"W7"},{"x":8,"y":40,"width":8,"height":20,"number":"W8"},{"x":16,"y":40,"width":8,"height":20,"number":"W9"},{"x":0,"y":60,"width":8,"height":20,"number":"W10"},{"x":8,"y":60,"width":8,"height":20,"number":"W11"},{"x":16,"y":60,"width":8,"height":20,"number":"W12"}]);

			else if(positionGlobal==15)
			generateMatrix(grid,[{"x":0,"y":0,"width":6,"height":20,"number":"W1"},{"x":6,"y":0,"width":6,"height":20,"number":"W2"},{"x":12,"y":0,"width":6,"height":20,"number":"W3"},{"x":18,"y":0,"width":6,"height":20,"number":"W4"},{"x":0,"y":20,"width":6,"height":20,"number":"W5"},{"x":6,"y":20,"width":6,"height":20,"number":"W6"},{"x":12,"y":20,"width":6,"height":20,"number":"W7"},{"x":18,"y":20,"width":6,"height":20,"number":"W8"},{"x":0,"y":40,"width":6,"height":20,"number":"W9"},{"x":6,"y":40,"width":6,"height":20,"number":"W10"},{"x":12,"y":40,"width":6,"height":20,"number":"W11"},{"x":18,"y":40,"width":6,"height":20,"number":"W12"},{"x":0,"y":60,"width":6,"height":20,"number":"W13"},{"x":6,"y":60,"width":6,"height":20,"number":"W14"},{"x":12,"y":60,"width":6,"height":20,"number":"W15"},{"x":18,"y":60,"width":6,"height":20,"number":"W16"}]);


			HomepageBuilderService.processGridContent($scope,$(".grid-stack-item"));
	};

	function generateMatrix(grid, serialization) {
		angular.forEach(serialization, function(widget) {
			grid.addWidget($(getContent(widget.number)), widget.x, widget.y, widget.width, widget.height, true);
		});
	}

	function getContent(number) {
		var content = '<div class="grid-stack-item" ng-click="widgetModal(\'' + number + '\')"><div class="grid-stack-item-content"><div class="widget-delete"><a ng-click="deleteWidget($event)">x</a></div><div class="widget-number">' + number + '</div></div></div>';
		return content;
	}

	function confirmExit() {
		var currentGridData = JSON.stringify(HomepageBuilderService.getGridData());
		if (currentGridData != $scope.hl[namespacePrefix + 'Grid_Data__c'])
			return "Are you sure?<br/>Unsaved layout change will be lost";
	}

	function resetPreview() {
		vfr.query(namespacePrefix + 'Homepage_Widget__c', '', '', namespacePrefix + 'Preview__c = true')
			.then(function(result) {
				angular.forEach(result.records, function(hw) {
					hw[namespacePrefix + 'Preview__c'] = false;
				});

				Visualforce.remoting.Manager.invokeAction(namespacePrefixClass + 'ngForceController.upsertDataBulk', namespacePrefix + 'Homepage_Widget__c', angular.toJson(result.records),
					function(result, event) {
						if (!event.status)
							logError(event.message);
					}
				); //Visualforce.remoting END

			})
			.catch(function(event) {
				logError(event.message);
			});
	}
});
