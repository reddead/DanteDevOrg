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
        .state('MyProfile', {
            url: urlValue,
            views: {
                // the main template will be placed here (relatively named)
                '': {
                    templateUrl: NGD_CommunityAssets + '/html/MyProfile/MyProfile.html',
                    controller: 'MyProfileCtrl'
                },

                // the child views will be defined here (absolutely named)
                'PersonalData@MyProfile': {
                    templateUrl: NGD_CommunityAssets + '/html/MyProfile/PersonalData.html',
                    controller: 'PersonalDataCtrl',
                    resolve: {
                        test: function() {
                            return 'test123';
                        }
                    }
                },
                'ContactInformation@MyProfile': {
                    templateUrl: NGD_CommunityAssets + '/html/MyProfile/ContactInformation.html',
                    controller: 'ContactInformationCtrl',
                    resolve: {
                        test: function() {
                            return 'test123';
                        }
                    }
                }
            }
        });
});
