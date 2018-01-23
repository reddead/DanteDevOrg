angularApp.controller("HomepageCtrl", function($scope, $compile, $sce, ngForceConfig, DataService, HomepageService) {
	var data = DataService.getData(dataJson);
	if (data) {
		//static resource
		$scope.res = {};
		$scope.res.NGD_SLDS = NGD_SLDS;
		$scope.res.NGD_Utilities = NGD_Utilities;

		$scope.contact = DataService.getContact(data.contactJson);
		$scope.application = DataService.getContact(data.applicationJson);
		//$scope.checklist = checklist;

		/////
		if (data.errorMessage) {
			swal({
				title: data.errorMessage,
				type: 'error',
				html: true,
				showConfirmButton: false
			});
		} else {
			var hl = HomepageService.getHomepageLayout(data.hlJson);
			$scope.ht = HomepageService.getHomepageLayout(data.htJson);
			$scope.ht[namespacePrefix + 'Header__c'] = $sce.trustAsHtml($scope.ht[namespacePrefix + 'Header__c']);
			$scope.ht[namespacePrefix + 'Footer__c'] = $sce.trustAsHtml($scope.ht[namespacePrefix + 'Footer__c']);
			var WidgetNumber_WidgetContent = HomepageService.getMapWidgetNumber_WidgetContent(data);
			initGridStack(hl, WidgetNumber_WidgetContent);
		}
	}

	function initGridStack(hl, WidgetNumber_WidgetContent) {
		var options = {
			cellHeight: 1,
			width: 24,
			float: false,
			verticalMargin: 10,
			staticGrid: true
		};
		$('.grid-stack').gridstack(options);
		var grid = $('.grid-stack').data('gridstack');

		angular.forEach(angular.fromJson(hl[namespacePrefix + 'Grid_Data__c']), function(item) {
			grid.addWidget($(WidgetNumber_WidgetContent[item.number]), item.x, item.y, item.width, item.height);
		});

		processGridContent($(".grid-stack-item-content"));
		setContentBorder();
		setGridWidth();
		allCssLoaded();
	}

	function allCssLoaded() {
		$("body").css("visibility", "hidden");
		toggleBackdrop(1);
		var lastCssNum = document.styleSheets.length;
		var counter = 0;
		var ti = setInterval(function() {
			if (document.styleSheets.length == lastCssNum) {
				counter++;
				if (counter >= 5) {
					toggleBackdrop(1);
					resizeWidgetHeight();
					$("body").css("visibility", "visible");
					clearInterval(ti);
				}
			}
			lastCssNum = document.styleSheets.length;
		}, 10);
	}

	//(item.innerHTML.indexOf("ng-")!=-1)||
	function processGridContent(contentList) {
		var linkFn;
		var str;
		//var re = /\/resource\//g;
		var re = /(["']\s*)\/resource\//g;
		angular.forEach(contentList, function(item) {
			//locate resource
			str = item.innerHTML;
			item.innerHTML = str.replace(re, "$1" + ngForceConfig.sitePrefix + "/resource/");

			//compile dom element
			if ((item.innerHTML.indexOf("{{") != -1 && item.innerHTML.indexOf("}}") != -1) || (item.innerHTML.indexOf("dz-") != -1) ||
				(item.innerHTML.indexOf("<erx") != -1 && item.innerHTML.indexOf("</erx") != -1)) {
				// Step 1: compile each DOM element
				linkFn = $compile(item);
				// Step 2: link the compiled DOM with the scope.
				linkFn($scope);
			}
		});
	}

	function setGridWidth() {
		$("#dz-container").css("max-width", hl[namespacePrefix + 'Grid_Width__c']);
		//$("#dz-content").css("max-width", hl[namespacePrefix + 'Grid_Width__c']);
	}

	function setContentBorder() {
		$(".grid-stack-item-content").css({
			"border": "none"
		});
	}

	// function hideLoadingImgage() {
	// 	$("#homepage_loading_image").css("display", "none");
	// }

	// function displayCriteriaError(criteriaError) {
	// 	var ele = document.createElement('div');
	// 	ele.innerHTML = criteriaError;
	// 	document.getElementById('dz-content').appendChild(ele);
	// }


});
