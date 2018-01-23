angularApp.directive('clearHidden', function($parse) {
		return {
				restrict: 'A',
				require: '?ngModel',
				link: function(scope, elem, attrs, ngModel) {
						var mergeFieldName = attrs.name;
						if (mergeFieldName) {
								var dotIndex = mergeFieldName.indexOf('.');
								var objectName = mergeFieldName.substring(0, dotIndex);
								var fieldName = mergeFieldName.substring(dotIndex + 1);

								scope.$on("$destroy", function() {
										var sobject = scope.$parent[objectName];
										if (sobject) {
												if (sobject[fieldName])
														sobject[fieldName] = null;
										}
								});
						}
				}
		};
});

angularApp.directive('checkRequired', function() {
		return {
				require: 'ngModel',
				restrict: 'A',
				link: function(scope, element, attrs, ngModel) {
						ngModel.$validators.checkRequired = function(modelValue, viewValue) {
								return modelValue === true;
								//var match = scope.$eval(attrs.ngTrueValue) || true;
								//return value && match === value;
						};
				}
		};
});

angularApp.directive('erxChecklist', function($compile, $timeout) {
		return {
				restrict: 'E',
				templateUrl: NGD_Utilities + '/template/Checklist.html',
				controller: function($scope, $element) {},
				link: function(scope, element, attrs) {
						if (attrs.title)
								element.find(".checklist-title").html(attrs.title);
						else
								element.find(".checklist-title").remove();

						$timeout(resizeWidgetHeight, 0);
				}
		};
});

angularApp.directive('erxResizeWidgetHeight', function($compile, $timeout) {
		return {
				restrict: 'A',
				link: function(scope, elem, attrs) {
						$timeout(resizeWidgetHeight, 0);
						$(window).off('resize', resizeWidgetHeight);
						$(window).on('resize', resizeWidgetHeight);
				}
		};
});

angularApp.directive('erxResponsiveHeight', function($compile, $timeout) {
		return {
				restrict: 'A',
				link: function(scope, elem, attrs) {
						//$timeout(resizeWidgetHeight, 0);
						resizeWidgetHeight();
						$(window).on('resize', resizeWidgetHeight);
				}
		};
});

angularApp.directive('erxShow', function($compile) {
		return {
				restrict: 'A',
				link: function(scope, elem, attrs) {
						var result = scope.$eval(attrs.erxShow);
						if (!result)
								$(elem).addClass('ng-hide');
				}
		};
});

angularApp.directive('erxHide', function($compile) {
		return {
				restrict: 'A',
				link: function(scope, elem, attrs) {
						var result = scope.$eval(attrs.erxHide);
						if (result)
								$(elem).addClass('ng-hide');
				}
		};
});

// angularApp.directive('formatPhoneNumber', ['$filter', '$parse', function($filter, $parse) {
//     var directive = {
//         restrict: 'A',
//         require: 'ngModel',
//         link: link
//     };
//     return directive;
//
//     function link(scope, element, attrs, ngModel) {
//
//         ngModel.$parsers.push(function(viewValue) {
//             viewValue = String(viewValue);
//             var number = viewValue.replace(/[^0-9]+/g, '');
//             viewValue = $filter('phonenumber')(number);
//             ngModel.$setViewValue(viewValue); //set view value
//             ngModel.$render();
//             return viewValue; //set modelvalue
//         });
//
//
//         ngModel.$formatters.push(function(modelValue) {
//             modelValue = String(modelValue);
//             var number = modelValue.replace(/[^0-9]+/g, '');
//             modelValue = $filter('phonenumber')(number);
//             $parse(attrs.ngModel).assign(scope, modelValue); //set model value
//             return modelValue; //set view value
//         });
//     }
// }]);

// angularApp.directive('dzSsn', ['$filter', '$parse', function($filter, $parse) {
//     var directive = {
//         restrict: 'A',
//         require: 'ngModel',
//         link: link
//     };
//     return directive;
//
//     function link(scope, element, attrs, ngModel) {
//         var mask = (scope.dzSsn === true);
//         if (mask) {
//             ngModel.$parsers.push(function(viewValue) {
//                 if (viewValue.substr(0, 3) === "***") {
//                     if (viewValue.length < 11) {
//                         ngModel.$setViewValue(""); //set view value
//                         ngModel.$render();
//                         return "";
//                     } else {
//                         ngModel.$setViewValue(viewValue.substr(0, 11)); //set view value
//                         ngModel.$render();
//                         return ngModel.$modelValue;
//                     }
//                 } else {
//                     var rawSSN = viewValue.replace(/[^0-9]+/g, '');
//                     viewValue = String(viewValue);
//                     viewValue = $filter('ssnFilter')(viewValue, mask);
//                     ngModel.$setViewValue(viewValue); //set view value
//                     ngModel.$render();
//
//                     return rawSSN; //set modelvalue
//                 }
//             });
//
//             ngModel.$formatters.push(function(modelValue) {
//                 modelValue = String(modelValue);
//                 modelValue = $filter('ssnFilter')(modelValue, mask);
//                 //$parse(attrs.ngModel).assign(scope, modelValue); //set model value
//                 return modelValue; //set view value
//             });
//         }
//     }
// }]);


angularApp.directive('typeaheadFocus', function() {
		return {
				require: 'ngModel',
				link: function(scope, element, attr, ngModel) {

						//trigger the popup on 'click' because 'focus'
						//is also triggered after the item selection
						element.bind('click', function() {
								if (ngModel.$viewValue == ' ') {
										ngModel.$setViewValue(null);
								}
								//force trigger the popup
								if (!ngModel.$viewValue)
										ngModel.$setViewValue(' ');
						});
				}
		};
});
