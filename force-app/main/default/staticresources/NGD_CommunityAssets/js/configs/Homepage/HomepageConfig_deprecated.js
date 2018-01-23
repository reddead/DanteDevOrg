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
        .state('Homepage', {
            url: urlValue,
            templateUrl: NGD_CommunityAssets + '/html/Homepage.html',
            controller: 'HomepageCtrl',
            resolve: {
                hwlDescribe: function(HomepageService) {
                    return HomepageService.getHomepageLayout();
                },
                hwDescribes: function(HomepageService, hwlDescribe, $q) {
                    if (hwlDescribe) {
                        var deferred = $q.defer();
                        HomepageService.getHomepageWidgetDescribes(hwlDescribe).then(function(hwDescribes) {
                            deferred.resolve(hwDescribes);
                        });
                        return deferred.promise;
                    } else
                        return null;
                },
                checklist: function(HomepageService, hwDescribes, $q) {
                    if (hwDescribes && hwDescribes.hasChecklist && !hwDescribes.criteriaError) {
                        var deferred = $q.defer();
                        HomepageService.getChecklist(hwDescribes).then(function(checklist) {
                            deferred.resolve(checklist);
                        });
                        return deferred.promise;
                    } else
                        return null;
                },
                contact: function(HomepageService, hwDescribes, $q) {
                    if (hwDescribes && !hwDescribes.criteriaError) {
                        var deferred = $q.defer();
                        HomepageService.getContact(hwDescribes).then(function(contact) {
                            deferred.resolve(contact);
                        });
                        return deferred.promise;
                    } else
                        return null;
                },
                application: function(HomepageService, hwDescribes, $q) {
                    if (hwDescribes && !hwDescribes.criteriaError) {
                        var deferred = $q.defer();
                        HomepageService.getApplication(hwDescribes).then(function(application) {
                            deferred.resolve(application);
                        });
                        return deferred.promise;
                    } else
                        return null;
                }
            }
        });
});
