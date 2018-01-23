angularApp.service('HomepageBuilderService', function($q, $timeout, $compile, $window, vfr, DataService) {
	var data;

	var hlListJson = '';
	var criteriaObjectList = '';
	var describesJson = '';
	var describes = null;

	var hlJson = '';
	var htJson = '';
	var hwIdMapJson = '';

	if (dataJson)
		data = DataService.getData(dataJson);

	if (data) {
		if (data.hlListJson)
			hlListJson = data.hlListJson;
		if (data.criteriaObjectList)
			criteriaObjectList = data.criteriaObjectList;
		if (data.describesJson) {
			describesJson = data.describesJson;
			describes = DataService.getDescribes(describesJson);
		}

		if (data.hlJson)
			hlJson = data.hlJson;
		if (data.htJson)
			htJson = data.htJson;
		if (data.hwIdMapJson)
			hwIdMapJson = data.hwIdMapJson;
	}

	this.getDescribe = function(objectName) {
		return describes[objectName];
	};

	this.getHomepageLayout = function() {
		var data = {};
		var hl = angular.fromJson(hlJson);
		data.hl = hl;

		return data.hl;
	};

	this.getHomepageLayouts = function() {
		var data = {};
		var hlList = angular.fromJson(hlListJson);
		data.hlList = hlList;

		return data.hlList;
	};

	this.getHomepageTemplate = function() {
		var data = {};
		if (htJson) {
			var ht = angular.fromJson(htJson);
			data.ht = ht;
			return data.ht;
		} else
			return null;
	};

	this.getHomepageTemplates = function() {
		var defer = $q.defer();
		vfr.query(NGD_Constant.HOMEPAGE_TEMPLATE, '', '', '')
			.then(function(result) {
				defer.resolve(result.records);
			}).catch(function(event) {
				logError(event.message);
			});
		return defer.promise;
	};

	this.getMapHWIdMap = function() {
		if(hwIdMapJson)
			return angular.fromJson(hwIdMapJson);
		else
			return null;
	};

	this.getHomepageWidgets = function(number) {
		var defer = $q.defer();
		var _this = this;
		var condition = namespacePrefix + 'Number__c=\'' + number + '\' Order By Name';
		vfr.query(NGD_Constant.HOMEPAGE_WIDGET, '', '', condition)
			.then(function(result) {
				var hwList = result.records;

				//set Preview__c for widget
				var gridData = _this.getGridData();
				var WidgetNumber_WidgetId = {}; // widgetNumber to widgetId

				angular.forEach(gridData, function(widget) {
					WidgetNumber_WidgetId[widget.number] = widget.preview;
				});

				angular.forEach(hwList, function(hw) {
					if (hw.Id == WidgetNumber_WidgetId[hw[namespacePrefix + 'Number__c']])
						hw[namespacePrefix + 'Preview__c'] = true;
					else
						hw[namespacePrefix + 'Preview__c'] = false;
				});

				defer.resolve(hwList);
			})
			.catch(function(event) {
				logError(event.message);
			});
		return defer.promise;
	};

	this.getObjectOptions = function() {
		var objectList = criteriaObjectList.split(',');
		objectList.sort();

		var objectOptions = [];
		var deFaultOption = {};
		deFaultOption.label = '--None--';
		deFaultOption.value = '';
		deFaultOption.default = true;
		deFaultOption.validFor = null;
		objectOptions.push(deFaultOption);
		for (i = 0; i < objectList.length; i++) {
			var pv = {};
			pv.label = objectList[i];
			pv.value = objectList[i];
			pv.default = false;
			pv.validFor = null;
			objectOptions.push(pv);
		}
		return objectOptions;
	};

	this.getOperatorOptions = function() {
		var operatorOptions = [];
		var optionString = ['--None--', 'Equals', 'Does not equal', 'Starts with', 'Ends with', 'Contains', 'Does not contain'];
		for (var i = 0; i < optionString.length; i++) {
			var option = {};
			option.label = optionString[i];
			if (optionString[i].indexOf('--None--') != -1) {
				option.value = '';
				option.default = true;
			} else {
				option.value = optionString[i];
				option.default = false;
			}
			option.validFor = null;
			operatorOptions.push(option);
		}
		return operatorOptions;
	};

	this.getHomepageCriteria = function(hcJson) {
		var hcList = [];
		if (hcJson) {
			hcList = angular.fromJson(hcJson);

			var sObjectDescribe;
			var sObjectFieldMap;
			var sObjectPicklistOptionsMap;
			for (var i = 0; i < hcList.length; i++) {
				if (hcList[i].fieldType == 'picklist') {
					sObjectDescribe = this.getDescribe(hcList[i].objectSelected);
					sObjectFieldMap = DataService.getFieldMap(sObjectDescribe, 'picklist, multipicklist');
					sObjectPicklistOptionsMap = DataService.getPicklistOptionsMap(sObjectFieldMap, true, '--None--', '');

					hcList[i].fieldOption = sObjectPicklistOptionsMap[hcList[i].fieldSelected];
				} else if (hcList[i].fieldType == 'multipicklist') {
					hcList[i].fieldOption = [];

					sObjectDescribe = this.getDescribe(hcList[i].objectSelected);
					sObjectFieldMap = DataService.getFieldMap(sObjectDescribe, 'picklist, multipicklist');
					sObjectPicklistOptionsMap = DataService.getPicklistOptionsMap(sObjectFieldMap, false);
					var tmpFieldOption = sObjectPicklistOptionsMap[hcList[i].fieldSelected];

					if (hcList[i].fieldValue) {
						var tmpMap = {};
						var valueList = hcList[i].fieldValue.split(';');
						for (var ii = 0; ii < valueList.length; ii++)
							tmpMap[valueList[ii]] = true;

						for (ii = 0; ii < tmpFieldOption.length; ii++) {
							if (tmpMap[tmpFieldOption[ii].value]) {
								hcList[i].fieldOption.push({
									label: tmpFieldOption[ii].label,
									value: tmpFieldOption[ii].value,
									ticked: true
								});
							} else {
								hcList[i].fieldOption.push({
									label: tmpFieldOption[ii].label,
									value: tmpFieldOption[ii].value,
									ticked: false
								});
							}
						}
					} else {
						for (var j = 0; j < tmpFieldOption.length; j++) {
							hcList[i].fieldOption.push({
								label: tmpFieldOption[j].label,
								value: tmpFieldOption[j].value,
								ticked: false
							});
						}
					}
				}
			}
			hcList.push(this.newHomepageCriteria(hcList.length + 1));
			return hcList;
		} else {
			hcList.push(this.newHomepageCriteria(hcList.length + 1));
			return hcList;
		}
	};

	this.newHomepageCriteria = function(order) {
		var hc = {};
		hc.order = order;
		hc.objectName = '';
		hc.fieldName = '';
		hc.fieldType = '';
		hc.fieldValue = '';
		hc.fieldValueType = '';
		hc.fieldOption = [];
		hc.operator = '';
		hc.objectSelected = '';
		hc.fieldSelected = '';
		return hc;
	};

	this.getTypeOptions = function() {
		var typeOptions = [];
		var optionString = ['--None--', 'String'];
		for (var i = 0; i < optionString.length; i++) {
			var option = {};
			option.label = optionString[i];
			if (optionString[i].indexOf('--None--') != -1) {
				option.value = '';
				option.default = true;
			} else {
				option.value = optionString[i];
				option.default = false;
			}
			option.validFor = null;
			typeOptions.push(option);
		}
		return typeOptions;
	};

	this.getFieldOptions = function(objectName, excludeFieldType) {
		excludeFieldType = (typeof excludeFieldType !== 'undefined') ? excludeFieldType : null;

		var fieldOptions = [];
		var pv = {};
		angular.forEach(describes[objectName].fields, function(field) {
			if (excludeFieldType) {
				if (excludeFieldType.indexOf(field.type) == -1) {
					pv = {};
					pv.label = '[' + objectName + '].' + field.name + ' - ' + field.type; //+ ' (' + field.label + ')';
					if (field.referenceTo)
						pv.label += ' >';
					pv.fieldType = field.type;
					pv.objectName = objectName;
					pv.fieldName = field.name;
					pv.relationshipName = field.relationshipName;
					pv.isCustom = field.isCustom;
					pv.referenceTo = field.referenceTo;
					if (field.type === 'reference') {
						//check if referenceOject exists
						if (describes[field.referenceTo])
							fieldOptions.push(pv);
					} else
						fieldOptions.push(pv);
				}
			} else {
				pv = {};
				pv.label = '[' + objectName + '].' + field.name + ' - ' + field.type; //+ ' (' + field.label + ')';
				if (field.referenceTo)
					pv.label += ' >';
				pv.fieldType = field.type;
				pv.objectName = objectName;
				pv.fieldName = field.name;
				pv.relationshipName = field.relationshipName;
				pv.isCustom = field.isCustom;
				pv.referenceTo = field.referenceTo;
				if (field.type === 'reference') {
					//check if referenceOject exists
					if (describes[field.referenceTo])
						fieldOptions.push(pv);
				} else
					fieldOptions.push(pv);
			}

		});
		// fieldOptions.sort(function(a, b) {
		//     var fieldA = a.label.toLowerCase();
		//     var fieldB = b.label.toLowerCase();
		//     if (fieldA < fieldB) //sort string ascending
		//         return -1;
		//     if (fieldA > fieldB)
		//         return 1;
		//     return 0; //default return value (no sorting)
		// });
		return fieldOptions;
	};

	this.initGridStack = function(scope, grid, hl, hwIdMap) {
		var gridData = angular.fromJson(hl[namespacePrefix + 'Grid_Data__c']);
		$("#dz-container").css("max-width", hl[namespacePrefix + 'Grid_Width__c']);

		angular.forEach(gridData, function(widget) {
			grid.addWidget($('<div class="grid-stack-item" ng-click="widgetModal(\'' + widget.number + '\')"><div class="grid-stack-item-content"><div class="widget-delete"><a ng-click="deleteWidget($event)">x</a></div><div class="widget-number">' + widget.number + '</div></div></div>'), widget.x, widget.y, widget.width, widget.height);
		});

		//re-complie element to make angular work
		this.processGridContent(scope, $(".grid-stack-item"));

		//add content after angular re-compile to avoid item content compiling, no re-compile for content needed e.g. {{XXX}} stays as {{XXX}}
		var _this = this;
		angular.forEach(gridData, function(widget) {
			//must be existing hw Id in current org
			if (hwIdMap && widget.preview) {
				if (!hwIdMap[widget.preview] && widget.content)
					delete widget.content;
			} else
				delete widget.content;

			if (widget.content)
				_this.initGridStackItemContent(widget.number, widget.preview, widget.content);
		});

		this.allCssLoaded();
	};


	this.processGridContent = function(scope, contentList) {
		var linkFn;
		angular.forEach(contentList, function(content) {
			//compile dom element
			// Step 1: compile each DOM element
			linkFn = $compile(content);
			// Step 2: link the compiled DOM with the scope.
			linkFn(scope);
		});
		//$scope.$apply();
	};

	this.initGridStackItemContent = function(number, preview, content) {
		var gridStackItemContent;

		$('.widget-number:contains("' + number + '")').each(function() {
			if ($(this).text() == number) {
				gridStackItemContent = $(this).parent();
			}
		});

		//init content
		if (preview) {
			gridStackItemContent.append('<div class="widget-preview" style="display:none">' + preview + '</div><div class="widget-content">' + content + '</div>');
			gridStackItemContent.css({
				"background": "inherit",
				"border": "none"
			});
			gridStackItemContent.find('.widget-number').css({
				"opacity": ".2"
			});
		} else {
			//gridStackItemContent.append('<div class="widget-content">'+content+'</div>');
		}
	};

	this.getGridData = function() {
		var serialized_data = _.map($('.grid-stack > .grid-stack-item:visible'), function(el) {
			el = $(el);
			var node = el.data('_gridstack_node');
			var content = node.el.find('.widget-content').html(); //widget content
			var number;
			if (content) {
				var preview = node.el.find('.widget-preview').text();
				number = node.el.find('.widget-number').text();
				return {
					x: node.x,
					y: node.y,
					width: node.width,
					height: node.height,
					number: number,
					preview: preview,
					content: content
				};
			} else {
				number = node.el.find('.widget-number').text();
				return {
					x: node.x,
					y: node.y,
					width: node.width,
					height: node.height,
					number: number
				};
			}
		}, this);
		return serialized_data;
	};

	this.setGridStackItemContent = function(widgetNumber, hw) {
		var gridStackItemContent;

		$('.widget-number:contains("' + widgetNumber + '")').each(function() {
			if ($(this).text() == widgetNumber) {
				gridStackItemContent = $(this).parent();
			}
		});

		if (!hw) {
			//remove old content
			gridStackItemContent.find('.widget-preview').remove();
			gridStackItemContent.find('.widget-content').remove();
			gridStackItemContent.css({
				"background": "#EEF1F6",
				"box-shadow": "5px 5px 10px",
				// "border": "1px solid #cfd7e6",
				"border-radius": "5px"
			});
			gridStackItemContent.find('.widget-number').css({
				"opacity": ".8"
			});
		} else if (hw[namespacePrefix + 'Content__c']) {
			gridStackItemContent.css({
				"background": "inherit",
				"border": "none"
			});
			gridStackItemContent.find('.widget-number').css({
				"opacity": ".2"
			});
			//remove old content
			gridStackItemContent.find('.widget-preview').remove();
			gridStackItemContent.find('.widget-content').remove();
			//add new content
			gridStackItemContent.append('<div class="widget-preview" style="display:none">' + hw.Id + '</div><div class="widget-content">' + hw[namespacePrefix + 'Content__c'] + '</div>');

			//display dz-checklist html as text for preview
			var erxChecklist = gridStackItemContent.find('dz-checklist');
			if (erxChecklist.length > 0) {
				for (var i = 0; i < erxChecklist.length; i++) {
					var content = document.createTextNode(erxChecklist[i].outerHTML);
					$(erxChecklist[i]).append(content);
				}
			}
			resizeWidgetHeight();
		}
	};

	this.allCssLoaded = function() {
		// $("body").css("visibility", "hidden");
		toggleBackdrop(1);
		var lastCssNum = document.styleSheets.length;
		var counter = 0;
		var ti = setInterval(function() {
			if (document.styleSheets.length == lastCssNum) {
				counter++;
				if (counter >= 5) {
					toggleBackdrop(1);
					resizeWidgetHeight();
					$("body").css("visibility", "visible");
					clearInterval(ti);
				}
			}
			lastCssNum = document.styleSheets.length;
		}, 10);
	}

});
