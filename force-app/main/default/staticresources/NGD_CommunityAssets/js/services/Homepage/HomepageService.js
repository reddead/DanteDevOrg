angularApp.service('HomepageService', function() {
	this.getHomepageLayout = function(hlJson) {
		if (hlJson && hlJson != 'null')
			return angular.fromJson(hlJson);
	};

	this.getHomepageTemplate = function(htJson) {
		if (htJson && htJson != 'null')
			return angular.fromJson(htJson);
	};

	this.getMapWidgetNumber_WidgetContent = function(data) {
		var WidgetNumber_WidgetContent = {};
		angular.forEach(data.widgetNumbers.split(','), function(widgetNumber) {
			WidgetNumber_WidgetContent[widgetNumber] = data[widgetNumber];
		});
		return WidgetNumber_WidgetContent;
	}


	// this.getChecklist = function(hwDescribes) {
	// 	var deferred = $q.defer();
	//
	// 	//process Application Checklist
	// 	if (hwDescribes.hasChecklist) {
	// 		Visualforce.remoting.Manager.invokeAction(namespacePrefixClass + 'NGD_DataController.processChecklistCotents', applicationId,
	// 			function(result, event) {
	// 				if (event.status) {
	// 					var checkList = [];
	//
	// 					angular.forEach(Object.keys(result).sort(), function(item) {
	// 						checkList.push(result[item]);
	// 					});
	// 					deferred.resolve(checkList);
	//
	// 				} else
	// 					logError(event.message);
	// 			}
	// 		); //processChecklistCotents End
	// 	}
	// 	return deferred.promise;
	// };
});
