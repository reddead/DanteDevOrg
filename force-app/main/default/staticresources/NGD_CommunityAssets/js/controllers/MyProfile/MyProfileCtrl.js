angularApp.controller("MyProfileCtrl", function($scope, ViewService) {
    //set and get views
    var views = [];
    views.push('PersonalData');
    views.push('ContactInformation');
    ViewService.setViews(views);
    $scope.views = ViewService.getViews();

    //get defaultView
    ViewService.setDefaultView('PersonalData');
    var defaultView=ViewService.getDefaultView();

    //get selectedView
    $scope.selectedView = ViewService.getParameterByName('view');

    //display selectedView
    var viewMap = ViewService.getViewMap();
    if (!$scope.selectedView || !viewMap[$scope.selectedView])
        $scope.selectedView = defaultView;
});
