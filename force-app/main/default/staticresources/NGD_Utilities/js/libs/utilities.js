function setConfig(dataJson, entryTemplateUrl, entryTemplateCtrl) {
	var data = null;
	if (dataJson) {
		data = JSON.parse(dataJson);
		if (data) {
			namespacePrefix = data.namespacePrefix;
			namespacePrefixClass = data.namespacePrefixClass;

			if (namespacePrefix) {
				NGD_Constant.APPLICATION = namespacePrefix + 'Application__c';
				NGD_Constant.HOMEPAGE_TEMPLATE = namespacePrefix + 'Homepage_Template__c';
				NGD_Constant.HOMEPAGE_LAYOUT = namespacePrefix + 'Homepage_Widget_Layout__c';
				NGD_Constant.HOMEPAGE_WIDGET = namespacePrefix + 'Homepage_Widget__c';
			}
		}
		if (entryTemplateUrl)
			dz_BodyTemplateUrl = entryTemplateUrl;
		if (entryTemplateCtrl)
			dz_BodyTemplateCtrl = entryTemplateCtrl;
	}
}

function toggleSpin(spin) {
	if (spin)
		$('.fa-refresh').toggleClass('fa-spin');
	else if ($('.fa-refresh').hasClass('fa-spin')) {
		setTimeout(function() {
			$('.fa-refresh').toggleClass('fa-spin');
		}, 500);
	}
}

/******************resizeWidgetHeight START******************/
function resizeWidgetHeight() {
	//alert(window.onload);
	var elements = $('.grid-stack-item');

	for (var i = 0; i < elements.length; i++) {

		if ($(elements[i]).find('.widget-content')[0]) {
			//widget-content children
			var children = $(elements[i]).find('.widget-content')[0].children;
			//set first child margin-top
			var marginTop = 0;
			if (children.length !== 0)
				marginTop = parseInt($(children[0]).css('margin-top').replace(/[^-\d\.]/g, ''), 10);
			////set last child margin-bottom and padding-bottom
			// $(children[children.length - 1]).css({
			//     'margin-bottom': '0',
			//     'padding-bottom': '0'
			// });

			//var outerHeight = $(elements[i]).find('.grid-stack-item-content')[0].scrollHeight;
			var innerHeight = $(elements[i]).find('.widget-content')[0].clientHeight;
			var newHeight = innerHeight + marginTop;
			//var gap = outerHeight - innerHeight - marginTop;
			//var newHeight = innerHeight + marginTop + gap;

			if (innerHeight > 0) {
				$('.grid-stack').data('gridstack').resize(
					elements[i],
					$(elements[i]).attr('data-gs-width'),
					Math.ceil((newHeight + $('.grid-stack').data('gridstack').opts.verticalMargin) /
						($('.grid-stack').data('gridstack').cellHeight() + $('.grid-stack').data('gridstack').opts.verticalMargin))
				);
			} else {
				var flotaElementHeight = 0;
				if ($(elements[i]).find('.widget-content')[0].children.length > 0)
					flotaElementHeight = $(elements[i]).find('.widget-content')[0].children[0].clientHeight;
				if (flotaElementHeight > 0) {
					var grandChildren = $(elements[i]).find('.widget-content')[0].children[0].children;
					var marginBottom = parseInt($(grandChildren[grandChildren.length - 1]).css('margin-bottom').replace(/[^-\d\.]/g, ''), 10);
					flotaElementHeight -= marginBottom;

					$('.grid-stack').data('gridstack').resize(
						elements[i],
						$(elements[i]).attr('data-gs-width'),
						Math.ceil((flotaElementHeight + $('.grid-stack').data('gridstack').opts.verticalMargin) / ($('.grid-stack').data('gridstack').cellHeight() + $('.grid-stack').data('gridstack').opts.verticalMargin))
					);
				}
			}
		}

		//$(elements[i]).attr('data-gs-y'),
	}
}
/******************resizeWidgetHeight END******************/

/******************debugValidation START******************/
function debugValidation() {
	var elementArray = [];
	angular.forEach($('[required="required"]'), function(item, i) {
		elementArray.push(item.name);
	});
	console.log("Required Elements START");
	for (var i = 0; i < elementArray.length; i++) {
		console.log(i + " = " + elementArray[i]);
	}
	console.log("Required Elements END");
}
/******************debugValidation only END******************/

/******************toggle spinning image START******************/
function toggleSpinningImageDouble(delay) {
	$('.loading-image').toggleClass('loading-image-open');
	setTimeout(function() {
		$('.loading-image').toggleClass('loading-image-open');
	}, 500);
}

function toggleSpinningImage() {
	$('.loading-image').toggleClass('loading-image-open');
}
/******************toggle spinning image END******************/

/******************toggleBackdrop START******************/
function toggleBackdrop(numberOfTimes, delay) {
	numberOfTimes = (typeof numberOfTimes !== 'undefined') ? numberOfTimes : null;
	delay = (typeof delay !== 'undefined') ? delay : null;
	var backdrop = $('.slds-backdrop.loading-image');
	if (numberOfTimes == 1)
		backdrop.toggleClass('slds-backdrop--open');
	else if (numberOfTimes == 2) {
		backdrop.toggleClass('slds-backdrop--open');
		setTimeout(function() {
			backdrop.toggleClass('slds-backdrop--open');
		}, delay);
	}
	else
		backdrop.toggleClass('slds-backdrop--open');
}
/******************toggleBackdrop END******************/

/******************ERxPopoverMessge START******************/
function showERxPopoverMessge(sender) {
	var element = $(sender).closest(".slds-dropdown-trigger").find(".dz-form-popover-message");
	if (!element.hasClass("dz-form-popover-message-open"))
		element.toggleClass("dz-form-popover-message-open");
}

function hideERxPopoverMessge(sender) {
	var element = $(sender).closest(".slds-dropdown-trigger").find(".dz-form-popover-message");
	if (element.hasClass("dz-form-popover-message-open"))
		element.toggleClass("dz-form-popover-message-open");
}
/******************ERxPopoverMessge only END******************/

/******************get url parameter START******************/
function getParameterByName(name) {
	name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
	var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
		results = regex.exec(location.search);
	return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}
/******************get url parameter END******************/

/******************scrollTop START******************/
function scrollTop(delay) {
	setTimeout(function() {
			$('html, body').animate({
				scrollTop: $('body').offset().top
			}, 'slow');
		},
		delay);
}
/******************scrollTop END******************/

/******************sessionTimeout START******************/
function sessionTimeout(pageName, href) {
	//if (typeof apiSessionID == 'undefined')
	if (href)
		window.location.href = href;
	else
		window.location.href = '/' + pageName;
}
/******************sessionTimeout END******************/

/******************logError START******************/
function logError(message) {
	swal({
		title: message + '<br/>Please try refresh',
		type: 'error',
		html: true,
		showConfirmButton: false
	});
}

function logError(message, showConfirmButton) {
	swal({
		title: message,
		type: 'error',
		html: true,
		showConfirmButton: showConfirmButton
	});
}

/******************logErrort END******************/

/******************decodeHtml START******************/
function decodeHtml(html) {
	var txt = document.createElement("textarea");
	txt.innerHTML = html;
	return txt.value;
}
/******************decodeHtml END******************/

/******************PopupCenterDual START******************/
function PopupCenterDual(url, title, w, h) {
	// Fixes dual-screen position Most browsers Firefox
	var dualScreenLeft = window.screenLeft !== undefined ? window.screenLeft : screen.left;
	var dualScreenTop = window.screenTop !== undefined ? window.screenTop : screen.top;

	width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
	height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;

	var left = ((width / 2) - (w / 2)) + dualScreenLeft;
	var top = ((height / 2) - (h / 2)) + dualScreenTop;
	var newWindow = window.open(url, title, 'scrollbars=yes, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left);

	// Puts focus on the newWindow
	if (window.focus) {
		newWindow.focus();
	}
}
/******************PopupCenterDual END******************/

/******************dynamic css/js START******************/
function removejscssfile(filename, filetype) {
	var targetelement = (filetype == "js") ? "script" : (filetype == "css") ? "link" : "none"; //determine element type to create nodelist from
	var targetattr = (filetype == "js") ? "src" : (filetype == "css") ? "href" : "none"; //determine corresponding attribute to test for
	var allsuspects = document.getElementsByTagName(targetelement);
	for (var i = allsuspects.length; i >= 0; i--) { //search backwards within nodelist for matching elements to remove
		if (allsuspects[i] && allsuspects[i].getAttribute(targetattr) !== null && allsuspects[i].getAttribute(targetattr).indexOf(filename) != -1)
			allsuspects[i].parentNode.removeChild(allsuspects[i]); //remove element by calling parentNode.removeChild()
	}
}

function createjscssfile(filename, filetype) {
	var fileref;
	if (filetype == "js") { //if filename is a external JavaScript file
		fileref = document.createElement('script');
		fileref.setAttribute("type", "text/javascript");
		fileref.setAttribute("src", filename);
	} else if (filetype == "css") { //if filename is an external CSS file
		fileref = document.createElement("link");
		fileref.setAttribute("rel", "stylesheet");
		fileref.setAttribute("type", "text/css");
		fileref.setAttribute("href", filename);
	}
	return fileref;
}

function replacejscssfile(oldfilename, newfilename, filetype) {
	var targetelement = (filetype == "js") ? "script" : (filetype == "css") ? "link" : "none"; //determine element type to create nodelist using
	var targetattr = (filetype == "js") ? "src" : (filetype == "css") ? "href" : "none"; //determine corresponding attribute to test for
	var allsuspects = document.getElementsByTagName(targetelement);
	for (var i = allsuspects.length; i >= 0; i--) { //search backwards within nodelist for matching elements to remove
		if (allsuspects[i] && allsuspects[i].getAttribute(targetattr) !== null && allsuspects[i].getAttribute(targetattr).indexOf(oldfilename) != -1) {
			var newelement = createjscssfile(newfilename, filetype);
			allsuspects[i].parentNode.replaceChild(newelement, allsuspects[i]);
		}
	}
}
/******************ynamic css/js START******************/
