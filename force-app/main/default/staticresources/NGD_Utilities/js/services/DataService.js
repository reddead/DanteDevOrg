angularApp.service('DataService', function() {
    this.getData = function(dataJson) {
        if (dataJson && dataJson != 'null')
            return angular.fromJson(dataJson);
        else
            return null;
    };

    this.getContact = function(contactJSON) {
        if (contactJSON && contactJSON != 'null')
            return angular.fromJson(contactJSON);
        else
            return null;
    };

    this.getApplication = function(applicationJSON) {
        if (applicationJSON && applicationJSON != 'null')
            return angular.fromJson(applicationJSON);
        else
            return null;
    };

    this.getDescribe = function(describeJSON) {
        if (describeJSON && describeJSON != 'null')
            return angular.fromJson(describeJSON);
        else
            return null;
    };

    this.getDescribes= function(describesJson) {
        if (describesJson && describesJson != 'null')
            return angular.fromJson(describesJson);
        else
            return null;
    };

    this.getFieldMap = function(sobjectDescribe, fieldType) {
        fieldType = (typeof fieldType !== 'undefined') ? fieldType : null;

        if (sobjectDescribe) {
            var FieldName_Field = {};
            for (var i = 0; i < sobjectDescribe.fields.length; i++) {
                var field = sobjectDescribe.fields[i];
                if (!fieldType || fieldType == 'all')
                    FieldName_Field[field.name] = field;
                else if (fieldType.indexOf(field.type) >= 0)
                    FieldName_Field[field.name] = field;
            }
            return FieldName_Field;
        } else
            return null;
    };

    this.getPicklistOptionsMap = function(picklistFieldMap, setDeFaultOption, defaultLabel, defaultValue) {
        defaultLabel = (typeof defaultLabel !== 'undefined') ? defaultLabel : null;
        defaultValue = (typeof defaultValue !== 'undefined') ? defaultValue : null;

        if (picklistFieldMap) {
            var PicklistFieldName_PicklistOptions = {};
            angular.forEach(Object.keys(picklistFieldMap), function(picklistFieldName) {
                var field = picklistFieldMap[picklistFieldName];
                var options = [];

                if (setDeFaultOption) {
                    var deFaultOption = {};
                    deFaultOption.label = defaultLabel;
                    deFaultOption.value = defaultValue;
                    deFaultOption.default = true;
                    deFaultOption.validFor = null;
                    options.push(deFaultOption);
                }
                for (var j = 0; j < field.picklistValues.length; j++) {
                    var option = {};
                    option.label = field.picklistValues[j].label;
                    option.value = field.picklistValues[j].value;
                    option.default = field.picklistValues[j].defaultValue;
                    if (field.picklistValues[j].hasOwnProperty('validFor')) {
                        option.validFor = field.picklistValues[j].validFor;
                    }
                    options.push(option);
                }
                PicklistFieldName_PicklistOptions[picklistFieldName] = options;
            });
            return PicklistFieldName_PicklistOptions;
        } else
            return null;
    };

    this.getPicklistOptions = function(picklistOptionsMap, fieldName, setDeFaultOption, defaultLabel, defaultValue) {
        defaultLabel = (typeof defaultLabel !== 'undefined') ? defaultLabel : null;
        defaultValue = (typeof defaultValue !== 'undefined') ? defaultValue : null;

        var options = [];
        if (picklistOptionsMap) {
            if (setDeFaultOption) {
                var deFaultOption = {};
                deFaultOption.label = defaultLabel;
                deFaultOption.value = defaultValue;
                deFaultOption.default = true;
                deFaultOption.validFor = null;
                options.push(deFaultOption);
            }
            for (var j = 0; j < picklistOptionsMap[fieldName].length; j++) {
                var option = picklistOptionsMap[fieldName][j];
                if (!option.default)
                    options.push(option);
            }
        }
        return options;
    };

    this.getMultipicklistOptions = function(picklistOptionsMap, fieldName, setDeFaultOption, defaultValue) {
        defaultValue = (typeof defaultValue !== 'undefined') ? defaultValue : null;

        var options = [];
        if (picklistOptionsMap) {
            if (setDeFaultOption)
                options.push(defaultValue);

            for (var j = 0; j < picklistOptionsMap[fieldName].length; j++) {
                var option = picklistOptionsMap[fieldName][j];
                if (!option.default)
                    options.push(option.value);
            }
        }
        return options;
    };

    this.getDependentOptions = function(sobjectDescribe, fieldName, value) {
        var fieldMap = this.getFieldMap(sobjectDescribe, 'picklist');
        var picklistOptionsMap = this.getPicklistOptionsMap(fieldMap, false, null, null);

        var dependencyCode = [];
        var picklistOptions = this.getPicklistOptions(picklistOptionsMap, fieldName, false, null, null);
        var controllerName = getControllerName(sobjectDescribe, fieldName);
        var options = [];

        var controllerPicklistOptions = this.getPicklistOptions(picklistOptionsMap, controllerName, false, null, null);

        for (var item = 0; item < controllerPicklistOptions.length; item++) {
            if (controllerPicklistOptions[item].value.toLowerCase() == value.toLowerCase()) {
                for (var i = 0; i < picklistOptions.length; i++) {
                    if (isDependentValue(item, picklistOptions[i].validFor))
                        options.push(picklistOptions[i].value);
                }
            }
        }
        return options;
    };

    this.forcetkClient = function() {
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
});
