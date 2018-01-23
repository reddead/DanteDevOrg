angularApp.config(function($stateProvider, $urlRouterProvider, $locationProvider) {
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });

    var urlValue = '';
    if (window.location.pathname == '/' || !window.location.pathname)
        urlValue = '/';
    else
        urlValue = window.location.pathname;

    $urlRouterProvider.otherwise(urlValue);

    $stateProvider
        .state('HomepageBuilder', {
            url: urlValue,
            templateUrl: NGD_HomepageBuilderAssets + '/html/HomepageBuilder/HomepageBuilder.html',
            controller: 'HomepageBuilderCtrl'
        });
});
