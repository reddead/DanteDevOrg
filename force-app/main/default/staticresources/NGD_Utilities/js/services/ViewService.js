angularApp.service('ViewService', function() {
    var views;
    var DefaultView;

    this.setDefaultView = function(view) {
        this.DefaultView = view;
    };

    this.getDefaultView = function() {
        return this.DefaultView;
    };


    this.setViews = function(views) {
        this.views = views;
    };

    this.getViews = function() {
        return this.views;
    };

    this.getViewMap = function() {
        var viewMap = {};
        angular.forEach(this.views, function(view) {
            viewMap[view] = true;
        });
        return viewMap;
    };

    this.getParameterByName = function(name) {
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
        var results = regex.exec(location.search);
        return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    };

});
