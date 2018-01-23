angularApp.service('ERxFormService', function($q, $timeout, vfr) {
    //var forcetkClient = forcetkClient();

    //picklist
    this.getPicklistValues = function(sobjectDescribe, fieldName) {
        var options = [];
        for (var i = 0; i < sobjectDescribe.fields.length; i++) {
            var field = sobjectDescribe.fields[i];
            if (field.name.toLowerCase() == fieldName.toLowerCase()) {
                var initOption = {};
                initOption.label = '--None--';
                initOption.value = '';
                initOption.default = false;
                initOption.validFor = null;
                options.push(initOption);
                for (var j = 0; j < field.picklistValues.length; j++) {
                    var pv = {};
                    pv.label = field.picklistValues[j].label;
                    pv.value = field.picklistValues[j].value;
                    pv.default = field.picklistValues[j].defaultValue;
                    if (field.picklistValues[j].hasOwnProperty('validFor')) {
                        pv.validFor = field.picklistValues[j].validFor;
                    }
                    options.push(pv);
                }
                break;
            }
        }
        return options;
    };

    //for dependent list use
    this.getPicklistValues1 = function(sobjectDescribe, fieldName) {
        var options = [];
        for (var i = 0; i < sobjectDescribe.fields.length; i++) {
            var field = sobjectDescribe.fields[i];
            if (field.name.toLowerCase() == fieldName.toLowerCase()) {
                for (var j = 0; j < field.picklistValues.length; j++) {
                    var pv = {};
                    pv.label = field.picklistValues[j].label;
                    pv.value = field.picklistValues[j].value;
                    pv.default = field.picklistValues[j].defaultValue;
                    if (field.picklistValues[j].hasOwnProperty('validFor')) {
                        pv.validFor = field.picklistValues[j].validFor;
                    }
                    options.push(pv);
                }
                break;
            }
        }
        return options;
    };

    //for multipicklist use
    this.getPicklistValues2 = function(sobjectDescribe, fieldName) {
        var options = [];
        for (var i = 0; i < sobjectDescribe.fields.length; i++) {
            var field = sobjectDescribe.fields[i];
            if (field.name.toLowerCase() == fieldName.toLowerCase()) {
                for (var j = 0; j < field.picklistValues.length; j++) {
                    options.push(field.picklistValues[j].value);
                }
                break;
            }
        }
        return options;
    };

    //for multipicklist use
    this.getPicklistValues3 = function(fieldDescribe) {
        var options = [];
        for (var j = 0; j < fieldDescribe.picklistValues.length; j++) {
            options.push(fieldDescribe.picklistValues[j].value);
        }
        return options;
    };


    this.getDependentValues = function(sobjectDescribe, fieldName, value) {
        var dependencyCode = [];
        var picklistValues = this.getPicklistValues1(sobjectDescribe, fieldName);
        var controllerName = getControllerName(sobjectDescribe, fieldName);
        var options = [];

        var controllerPicklistValues = this.getPicklistValues1(sobjectDescribe, controllerName);

        for (var item = 0; item < controllerPicklistValues.length; item++) {
            if (controllerPicklistValues[item].value.toLowerCase() == value.toLowerCase()) {
                for (var i = 0; i < picklistValues.length; i++) {
                    if (isDependentValue(item, picklistValues[i].validFor)) {
                        //var pv = new Object();
                        //pv.label = picklistValues[i].label;
                        //pv.value = picklistValues[i].value;
                        //pv.default = picklistValues[i].defaultValue;
                        //pv.validFor = picklistValues[i].validFor;
                        //pv.validForName = controllerPicklistValues[item].value;
                        options.push(picklistValues[i].value);
                    }
                }
            }
        }
        return options;
    };

    //function to do the validFor test
    function isDependentValue(index, validFor) {
        var base64 = new sforce.Base64Binary("");
        var decoded = base64.decode(validFor);
        var bits = decoded.charCodeAt(index >> 3);
        return ((bits & (0x80 >> (index % 8))) !== 0);
    }

    // get the controller field name
    function getControllerName(sobjectDescribe, fieldName) {
        var controllerName;
        for (var i = 0; i < sobjectDescribe.fields.length; i++) {
            var field = sobjectDescribe.fields[i];
            if (field.name.toLowerCase() == fieldName.toLowerCase()) {
                if (field.controllerName !== undefined) {
                    controllerName = field.controllerName;
                }
                break;
            }
        }
        return controllerName;
    }


    function forcetkClient() {
        var elements = location.hostname.split(".");
        var instance = (elements.length == 3) ? elements[0] : elements[1];
        var baseURL = siteBaseUrl || null;
        var proxy = '/services/proxy';
        var instanceURL = baseURL || ('https://' + instance + '.salesforce.com');
        var proxyURL = baseURL ? (baseURL + proxy) : proxy;
        var client = new forcetk.Client();
        client.setSessionToken(apiSessionID, 'v35.0', instanceURL);
        client.proxyUrl = proxyURL;
        return client;
    }

}); //erxformDataService end
