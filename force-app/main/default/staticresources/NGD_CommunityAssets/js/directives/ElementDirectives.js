angularApp.directive('dzChecklist', function($compile, $timeout) {
			return {
					restrict: 'E',
					templateUrl: NGD_CommunityAssets + '/html/element-directive-template/dz-checklist.html',
					controller: function($scope, $element) {},
					link: function(scope, element, attrs) {
							if (attrs.title)
									element.find(".dz-checklist-title").html(attrs.title);
							else
									element.find(".dz-checklist-title").remove();
							$timeout(resizeWidgetHeight, 0);
					}
			};
	});
