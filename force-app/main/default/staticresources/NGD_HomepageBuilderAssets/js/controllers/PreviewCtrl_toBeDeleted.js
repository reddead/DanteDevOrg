angularApp.controller("PreviewCtrl", function($scope, $uibModal, $compile, ngForceConfig) {
	//static resouce url
    $scope.con.NGD_SLDS = NGD_SLDS;

	//sobjects
	if (hwlJSON && hwlJSON != 'null')
    var hwl = angular.fromJson(hwlJSON);

	//backup grid data
	var restoreGridData = angular.fromJson(hwl[namespacePrefix+'Grid_Data__c']).slice();
	var restoreGridWidth = hwl[namespacePrefix+'Grid_Width__c'];

	/******************init grid START******************/
	var options={
			cellHeight:1,
			float:true,
			width: 24,
			verticalMargin: 10,
			alwaysShowResizeHandle: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
			resizable: {
				handles: 'e, se, s, sw, w'
			}
		};
	$('.grid-stack').gridstack(options);
	var grid = $('.grid-stack').data('gridstack'); 
	
	$("#dz-content").css("max-width", hwl[namespacePrefix+'Grid_Width__c']);
	angular.forEach(angular.fromJson(hwl[namespacePrefix+'Grid_Data__c']), function(item) {
		grid.addWidget($('<div class="grid-stack-item"><div class="grid-stack-item-content">'+item.content+'</div></div>'), item.x, item.y, item.width, item.height);
	});
	/******************init grid END******************/
	
	////scope function START
	$scope.saveGrid = function(isSaveOnly) {
        var serialized_data = _.map($('.grid-stack > .grid-stack-item:visible'), function(el) {
            el = $(el);
            var node = el.data('_gridstack_node');
			var strHtml=node.el[0].childNodes[0].innerHTML;
			strHtml = strHtml.replace(/(\r\n|\n|\r)/gm,"");
			strHtml = strHtml.replace(/<dz-checklist>(.*?)<\/dz-checklist>/g, '<dz-checklist></dz-checklist>');
            return {
                x: node.x,
                y: node.y,
                width: node.width,
                height: node.height,
                content: strHtml
            };
        }, this);

        hwl[namespacePrefix+'Grid_Data__c'] = JSON.stringify(serialized_data);
        hwl[namespacePrefix+'Grid_Width__c']= document.getElementById('dz-content').style.maxWidth;

        if (isSaveOnly) {
            restoreGridData = hwl[namespacePrefix+'Grid_Data__c'];
            restoreGridWidth = hwl[namespacePrefix+'Grid_Width__c'];
        }

		Visualforce.remoting.Manager.invokeAction(namespacePrefixClass+'ngForceController.upsertData',namespacePrefix+'Homepage_Widget_Layout__c',angular.toJson(hwl),
			function(result, event) {
				if(event.status)
                savePostProcess(isSaveOnly, hwl.Id, true);
				else
				logError(event.message);
            }
		);
    }

	$scope.restoreGrid = function() {
		swal({title:'Are you sure?<br/>Unsaved change will be lost if restore layout',
			text: '',
			imageUrl: "/resource/SLDS/assets/icons/utility/info_120.png",
			imageSize:"60x60",
			showCancelButton: true,
			confirmButtonText:'Confirm',
			cancelButtonText:'Cancel',
			closeOnConfirm:false,
			closeOnCancel:true,
			html:true},
			function(isConfirm){
				var confirmed;
				if (isConfirm) {
					var grid = $('.grid-stack').data('gridstack'); 
					grid.removeAll();

					$("#dz-content").css("max-width",restoreGridWidth);
					angular.forEach(restoreGridData, function(item) {
						grid.addWidget($('<div class="grid-stack-item"><div class="grid-stack-item-content">'+item.content+'</div></div>'), item.x, item.y, item.width, item.height);
					});
					$scope.processGridContent($(".grid-stack-item-content"));
					swal({title:'Layout has been restored.', type:'success',html:true});
				}
		});
	}

	$scope.processGridContent=function(contentList){
		var linkFn;
		var str ;
		var re =/\/resource\//g;
		angular.forEach(contentList, function(item) {
			//locate resource
			str = item.innerHTML;
			item.innerHTML=str.replace(re, ngForceConfig.sitePrefix+"/resource/");

		//(item.innerHTML.indexOf("{{")!=-1&&item.innerHTML.indexOf("}}")!=-1)||
			if((item.innerHTML.indexOf("<erx")!=-1&&item.innerHTML.indexOf("</erx")!=-1)){
				// Step 1: compile each DOM element
				linkFn = $compile(item);
				// Step 2: link the compiled DOM with the scope.
				linkFn($scope);
			}
		});
		$scope.$apply();
		//show page after processGridContent done
		//$("body").css("display", "block");
	}

 });