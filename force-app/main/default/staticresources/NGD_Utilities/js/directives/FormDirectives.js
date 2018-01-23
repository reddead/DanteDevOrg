angularApp.directive('dzResponsiveHeight', function($compile, $timeout) {
  return {
    restrict: 'A',
    link: function(scope, elem, attrs) {
      // $timeout(resizeWidgetHeight, 0);
      // $timeout(resizeWidgetHeight, 2000);
      // $timeout(resizeWidgetHeight, 5000);
      // $timeout(resizeWidgetHeight, 10000);
      $(window).on('resize', resizeWidgetHeight);
    }
  };
});

angularApp.directive('dzSsnMask', ['$filter', '$parse', function($filter, $parse) {
  var directive = {
    restrict: 'A',
    require: 'ngModel',
    link: link
  };
  return directive;

  function link(scope, element, attrs, ngModel) {
    if (scope.ssnMask !== undefined) {
      ngModel.$parsers.push(function(viewValue) {
        if (scope.ssnMask === true) {
          if (viewValue.substr(0, 3) === "***") {
            if (viewValue.length < 11) {
              ngModel.$setViewValue(""); //set view value
              ngModel.$render();
              return "";
            } else {
              ngModel.$setViewValue(viewValue.substr(0, 11)); //set view value
              ngModel.$render();
              return ngModel.$modelValue;
            }
          } else {
            viewValue = String(viewValue);
            var rawSSN = viewValue.replace(/[^0-9]+/g, '');
            viewValue = $filter('ssnFilter')(viewValue, true);
            ngModel.$setViewValue(viewValue); //set view value
            ngModel.$render();
            return rawSSN; //set modelvalue
          }
        } else {
          viewValue = String(viewValue);
          viewValue = viewValue.replace(/[^0-9]+/g, '');
          ngModel.$setViewValue(viewValue); //set view value
          ngModel.$render();
          return viewValue; //set modelvalue
        }
      });

      ngModel.$formatters.push(function(modelValue) {
        if (scope.ssnMask === true) {
          modelValue = String(modelValue);
          modelValue = $filter('ssnFilter')(modelValue, true);
          //$parse(attrs.ngModel).assign(scope, modelValue); //set model value
          return modelValue; //set view value
        } else {
          modelValue = String(modelValue);
          modelValue = modelValue.replace(/[^0-9]+/g, '');
          return modelValue; //set view value
        }
      });
    }
  }
}]);

angularApp.directive('datepickerLocaldate', ['$parse', function($parse) {
  var directive = {
    restrict: 'A',
    require: ['ngModel'],
    link: link
  };
  return directive;

  function link(scope, element, attr, ctrls) {
    var ngModelController = ctrls[0];

    //remove date format validation since it's not necessary and will cause SF save error
    delete ngModelController.$validators.date;

    // called with a JavaScript Date object when picked from the datepicker
    ngModelController.$parsers.push(function(viewValue) {
      // undo the timezone adjustment we did during the formatting
      if (!viewValue)
      return null;

      viewValue.setMinutes(viewValue.getMinutes() - viewValue.getTimezoneOffset());

      //var parts = viewValue.toISOString().substring(0, 10).trim().split("-");
      //var newViewValue=parts[1]+'-'+parts[2]+'-'+parts[0];
      //ngModelController.$setViewValue(newViewValue);//set view value
      //ngModelController.$render();

      // we just want a local date in ISO format
      return viewValue.toISOString().substring(0, 10);
      //return viewValue;
    });

    // called with a 'yyyy-mm-dd' string to format
    ngModelController.$formatters.push(function(modelValue) {
      if (!modelValue) {
        return undefined;
      }
      // date constructor will apply timezone deviations from UTC (i.e. if locale is behind UTC 'dt' will be one day behind)
      var dt = new Date(modelValue);
      // 'undo' the timezone offset again (so we end up on the original date again)
      dt.setMinutes(dt.getMinutes() + dt.getTimezoneOffset());
      return dt;
      //var parts = dt.toISOString().substring(0, 10).trim().split("-");
      //modelValue=parts[1]+'-'+parts[2]+'-'+parts[0];
      //return modelValue;
    });
  }
}]);


angularApp.directive('dzFormatPhoneNumber', ['$filter', '$parse', function($filter, $parse) {
  var directive = {
    restrict: 'A',
    require: 'ngModel',
    link: link
  };
  return directive;

  function link(scope, element, attrs, ngModel) {
    if (scope.formatPhoneNumber !== undefined) {
      ngModel.$parsers.push(function(viewValue) {
        if (scope.formatPhoneNumber === true) {
          viewValue = String(viewValue);
          var number = viewValue.replace(/[^0-9]+/g, '');
          viewValue = $filter('phonenumber')(number);
          ngModel.$setViewValue(viewValue); //set view value
          ngModel.$render();
          return viewValue; //set modelvalue
        } else {
          viewValue = String(viewValue);
          viewValue = viewValue.replace(/[^0-9]+/g, '');
          ngModel.$setViewValue(viewValue); //set view value
          ngModel.$render();
          return viewValue;
        }
      });

      ngModel.$formatters.push(function(modelValue) {
        if (scope.formatPhoneNumber === true) {
          modelValue = String(modelValue);
          var number = modelValue.replace(/[^0-9]+/g, '');
          modelValue = $filter('phonenumber')(number);
          $parse(attrs.ngModel).assign(scope, modelValue); //set model value
          return modelValue; //set view value
        } else {
          modelValue = String(modelValue);
          modelValue = modelValue.replace(/[^0-9]+/g, '');
          return modelValue; //set view value
        }
      });
    }
  }
}]);


// angularApp.directive('dzLineBreak', function() {
//     return {
//         restrict: 'A',
//         link: function(scope, element, attrs) {
//             var column = element.parents('form').attr('dz-column');
//             if (column == "2" && attrs.dzLineBreak == 'true') {
//                 element.removeClass('slds-size--3-of-7');
//                 element.addClass('slds-size--1-of-1');
//                 element.children(":first").addClass('slds-max-medium-size--1-of-1 slds-size--3-of-7');
//             }
//         }
//     };
// });

angularApp.directive('dzFormReadOnly', function($timeout) {
  return {
    restrict: 'A',
    scope: {
      dzFormReadOnly: '='
    },
    link: function(scope, element, attrs) {
      if (scope.dzFormReadOnly === true) {
        $timeout(function() {
          element.find(':input').attr('disabled', 'disabled');
        }, 0);
        $timeout(function() {
          element.find(':input').attr('disabled', 'disabled');
        }, 500);
        $timeout(function() {
          element.find(':input').attr('disabled', 'disabled');
        }, 1000);
        $timeout(function() {
          element.find(':input').attr('disabled', 'disabled');
        }, 2000);
      }
    }
  };
});

angularApp.directive('dzReadOnly', function() {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      element.attr('readonly', true);
    }
  };
});

angularApp.directive('dzPageMessage', function(DirectiveService) {
  return {
    restrict: 'AE',
    transclude: true,
    scope: {
      message: '@'
    },
    templateUrl: NGD_CommunityAssets + '/html/form-directive-template/dz-page-message.html',
    controller: function($scope, $element) {},
    link: function(scope, element, attrs) {
      DirectiveService.generalInit(scope, element, attrs);
    }
  };
});

angularApp.directive('dzInput', function(DirectiveService) {
  return {
    restrict: 'AE',
    transclude: true,
    scope: {
      ngModel: '=',
      ngInit: '&',
      ngClick: '&',
      ngChange: '&',
      ngRequired: '=',
      label: '@',
      placeholder: '@',
      ssnMask: '=',
      formatPhoneNumber: '='
    },
    templateUrl: NGD_CommunityAssets + '/html/form-directive-template/dz-input.html',
    controller: function($scope, $element) {},
    link: function(scope, element, attrs) {
      DirectiveService.generalInit(scope, element, attrs, 'input');
    }
  };
});

angularApp.directive('dzTextarea', function(DirectiveService) {
  return {
    restrict: 'AE',
    transclude: true,
    scope: {
      ngModel: '=',
      ngInit: '&',
      ngClick: '&',
      ngChange: '&',
      ngRequired: '=',
      label: '@',
      placeholder: '@',
      rows: '@'
    },
    templateUrl: NGD_CommunityAssets + '/html/form-directive-template/dz-textarea.html',
    controller: function($scope, $element) {},
    link: function(scope, element, attrs) {
      DirectiveService.generalInit(scope, element, attrs, 'textarea');
    }
  };
});

angularApp.directive('dzSelect', function(DirectiveService) {
  return {
    restrict: 'AE',
    transclude: true,
    scope: {
      ngModel: '=',
      ngInit: '&',
      ngClick: '&',
      ngChange: '&',
      ngRequired: '=',
      label: '@'
    },
    templateUrl: NGD_CommunityAssets + '/html/form-directive-template/dz-select.html',
    controller: function($scope, $element) {},
    link: function(scope, element, attrs) {
      DirectiveService.generalInit(scope, element, attrs, 'select');
    }
  };
});

angularApp.directive('dzMultiselect', function(DirectiveService) {
  return {
    restrict: 'AE',
    transclude: true,
    scope: {
      ngModel: '=',
      ngInit: '&',
      ngClick: '&',
      ngChange: '&',
      ngRequired: '=',
      label: '@'
    },
    templateUrl: NGD_CommunityAssets + '/html/form-directive-template/dz-multiselect.html',
    controller: function($scope, $element) {},
    link: function(scope, element, attrs) {
      DirectiveService.generalInit(scope, element, attrs, 'input');
    }
  };
});


angularApp.directive('dzSelectRadio', function(DirectiveService) {
  return {
    restrict: 'AE',
    transclude: true,
    scope: {
      ngModel: '=',
      ngInit: '&',
      ngClick: '&',
      ngChange: '&',
      ngRequired: '=',
      label: '@'
    },
    templateUrl: NGD_CommunityAssets + '/html/form-directive-template/dz-select-radio.html',
    controller: function($scope, $element) {},
    link: function(scope, element, attrs) {
      DirectiveService.generalInit(scope, element, attrs, 'input');
    }
  };
});

angularApp.directive('dzDatePicker', function(DirectiveService) {
  return {
    restrict: 'AE',
    transclude: true,
    // require: 'ngModel',
    scope: {
      ngModel: '=',
      ngInit: '&',
      ngClick: '&',
      ngChange: '&',
      ngRequired: '=',
      label: '@'
    },
    templateUrl: NGD_CommunityAssets + '/html/form-directive-template/dz-date-picker.html',
    controller: function($scope, $element) {},
    link: function(scope, element, attrs) {
      DirectiveService.generalInit(scope, element, attrs, 'input');
    }
  };
});

angularApp.directive('dzCheckbox', function(DirectiveService) {
  return {
    restrict: 'AE',
    transclude: true,
    require: 'ngModel',
    scope: {
      ngModel: '=',
      ngInit: '&',
      ngClick: '&',
      ngChange: '&',
      ngRequired: '=',
      ngDisabled: '=',
      label: '@'
    },
    templateUrl: NGD_CommunityAssets + '/html/form-directive-template/dz-checkbox.html',
    controller: function($scope, $element) {},
    link: function(scope, element, attrs) {
      DirectiveService.generalInit(scope, element, attrs, 'input');
    }
  };
});
