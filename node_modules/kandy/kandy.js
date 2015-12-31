// Kandy.js
// Site: http://kandy.io
// Version: 2.4.2
// Copyright 2015 Genband
// ----------------------
// UMD module definition as described by https://github.com/umdjs/umd
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register a named module.
        define('fcs', factory);
    } else {
        // Browser globals
        root.fcs = factory();
    }
 }(this, function () {

// DO NOT UPDATE THIS DEFINITION
// IT IS ONLY USED FOR REMOVING TEST
// SPECIFIC REFERENCES FROM API.
var __testonly__;
var GlobalBroadcaster = function() {
    var MAX_PRIORITY = 10, MIN_PRIORITY = 1, topics = {}, subUid = -1;

    function unsubscribeFromTopic(token) {
        var m, i, j;
        for (m in topics) {
            if (topics[m] && topics.hasOwnProperty(m)) {
                for (i = 0, j = topics[m].length; i < j; i++) {
                    if (topics[m][i].token === token) {
                        topics[m].splice(i, 1);
                        return token;
                    }
                }
            }
        }
        return false;
    }

    function subscribeToTopic(topic, func, priority, temporary) {
        var token, prio = MAX_PRIORITY, temp = false;

        if (typeof topic !== 'string') {
            throw new Error("First parameter must be a string topic name.");
        }

        if (typeof func !== 'function') {
            throw new Error("Second parameter must be a function.");
        }

        if (typeof priority !== 'undefined') {
            if (typeof priority !== 'number') {
                throw new Error("Priority must be a number.");
            }
            else {
                if (priority > MAX_PRIORITY ||
                        priority < MIN_PRIORITY) {
                    throw new Error("Priority must be between 1-10.");
                }
                else {
                    prio = priority;
                }
            }
        }

        if (temporary === true) {
            temp = temporary;
        }

        if (!topics[topic]) {
            topics[topic] = [];
        }

        token = (++subUid).toString();
        topics[topic].push({
            token: token,
            prio: prio,
            func: func,
            temp: temp
        });

        topics[topic].sort(function(a, b) {
            return parseFloat(b.prio) - parseFloat(a.prio);
        });

        return token;
    }

    function publishTopic(topic, args) {
        var subscribers, len, _args, _topic;

        if (arguments.length === 0) {
            throw new Error("First parameter must be a string topic name.");
        }

        _args = Array.prototype.slice.call(arguments);
        _topic = _args.shift();

        subscribers = topics[_topic];
        len = subscribers ? subscribers.length : 0;
        while (len--) {
            subscribers[len].func.apply(null, _args);
            if (subscribers[len].temp) {
                unsubscribeFromTopic(subscribers[len].token);
            }
        }
    }

    /*
     * 
     * Publish events of interest
     * with a specific topic name and arguments
     * such as the data to pass along
     * 
     * @param {string} topic - Topic name.
     * @param {...*} [args] - arguments.
     * 
     * @returns {undefined}
     */
    this.publish = publishTopic;

    /*
     * 
     * Subscribe to events of interest
     * with a specific topic name and a
     * callback function, to be executed
     * when the topic/event is observed.
     * Default priority 10.
     * Priority must be between 1-10.
     * Functions with lower priority 
     * will be executed first. 
     * 
     * @param {string} topic - Topic name.
     * @param {type} func - function to be executed when the topic/event is observed
     * @param {number} [priority] - function with higher priority will be executed first
     * @param {boolean} [temporary] - if set to true, subscriber will unsubcribe automatically after first execution.
     * 
     * @returns {string} token - reference to subscription
     */
    this.subscribe = subscribeToTopic;

    /*
     * 
     * Unsubscribe from a specific
     * topic, based on a tokenized reference
     * to the subscription
     * 
     * @param {string} token - reference to subscription
     * 
     * @returns {false|string} - returns token if successfull,
     * otherwise returns false. 
     */
    this.unsubscribe = unsubscribeFromTopic;
};

var globalBroadcaster = new GlobalBroadcaster();
if (__testonly__) { __testonly__.GlobalBroadcaster = GlobalBroadcaster; }
var CONSTANTS = {
    "WEBRTC": {
        "PLUGIN_ID": "fcsPlugin",
        "MEDIA_STATE": {
            NOT_FOUND: "notfound",
            SEND_RECEIVE: "sendrecv",
            SEND_ONLY: "sendonly",
            RECEIVE_ONLY: "recvonly",
            INACTIVE: "inactive"
        },
        "PLUGIN_MODE": {
            WEBRTC: "webrtc", // 2.1 Enabler Plugin
            LEGACY: "legacy", // 1.2 Disabler Plugin
            LEGACYH264: "legacyh264", // 1.3 Disabler Plugin with H264
            AUTO: "auto"          // Native For Chrome Browser and 2.1 Enabler Plugin for other Browsers
        },
        "RTC_SIGNALING_STATE": {
            STABLE: "stable",
            HAVE_LOCAL_OFFER: "have-local-offer",
            HAVE_REMOTE_OFFER: "have-remote-offer",
            HAVE_LOCAL_PRANSWER: "have-local-pranswer",
            HAVE_REMOTE_PRANSWER: "have-remote-pranswer",
            CLOSED: "closed"
        },
        "RTC_SDP_TYPE": {
            "OFFER": "offer",
            "ANSWER": "answer",
            "PRANSWER": "pranswer"
        }
    },
    "STRING": {
        "NEW_LINE": "\n",
        "CARRIAGE_RETURN": "\r",
        "VIDEO" : "video",
        "AUDIO" : "audio"
    },
    "SDP" : {
        "A_LINE" : "a=",
        "M_LINE" : "m=",
        "CRYPTO" : "crypto",
        "FINGERPRINT" : "fingerprint",
        "ICE_UFRAG": "ice-ufrag:",
        "ICE_PWD": "ice-pwd:",
        "NACK": "nack",
        "NACKPLI": "nack pli",
        "SETUP_ACTIVE": "a=setup:active",
        "SETUP_PASSIVE": "a=setup:passive",
        "SETUP_ACTPASS": "a=setup:actpass"
    },
    "HTTP_METHOD" : {
        "GET" : "GET",
        "POST" : "POST",
        "PUT" : "PUT",
        "DELETE" : "DELETE",
        "OPTIONS" : "OPTIONS"
    },
    "WEBSOCKET": {
        "PROTOCOL": {
            "SECURE": "wss",
            "NONSECURE": "ws"
        },
        "DEFAULT_PORT": "8581",
        "STATUS": {
            "OPENED": 1,
            "ALREADY_OPENED": 2,
            "CREATE_ERROR": 3,
            "CONNECTION_ERROR": 4,
            "NOT_FOUND": 5,
            "CONNECTION_CLOSED": 6
        }
    },
    "EVENT": {
        "XHR_REQUEST_NOT_INITIALIZED" : "XHR_REQUEST_NOT_INITIALIZED",
        "DEVICE_SUBSCRIPTION_STARTED": "DEVICE_SUBSCRIPTION_STARTED",
        "DEVICE_SUBSCRIPTION_ENDED": "DEVICE_SUBSCRIPTION_ENDED",
        "CONNECTION_REESTABLISHED": "CONNECTION_REESTABLISHED",
        "CONNECTION_LOST": "CONNECTION_LOST",
        "TOKEN_AUTH_STARTED": "TOKEN_AUTH_STARTED",
        "BASIC_AUTH_STARTED": "BASIC_AUTH_STARTED",
        "TOKEN_NOT_FOUND": "TOKEN_NOT_FOUND",
        "SESSION_EXPIRED": "SESSION_EXPIRED",
        "TURN_CREDENTIALS_ESTABLISHED": "TURN_CREDENTIALS_ESTABLISHED",
        "NOTIFICATION_CHANNEL_LOST": "NOTIFICATION_CHANNEL_LOST"
    }
};
if (__testonly__) { __testonly__.CONSTANTS = CONSTANTS; }
var JQrestfulImpl = function(_window, _globalBroadcaster, _logManager) {

    var ajaxSetuped = false,
        DEFAULT_LONGPOLLING_TOLERANCE = 30000,
        DEFAULT_AJAX_TIMEOUT = 40000,
        XHR_READY_STATE = {
            REQUEST_NOT_INITIALIZED: 0,
            REQUEST_DONE: 4
        };

    function getLogger() {
        return logManager.getLogger("jQrestful");
    }

    function composeAjaxRequestResponseLog(context, xhr, errorThrown, data) {
        var responseLog = context;
        if (data) {
            responseLog.data = data;
        }
        if (errorThrown) {
            responseLog.errorThrown = errorThrown;
        }
        if (xhr) {
            responseLog.status = xhr.status;
            responseLog.statusText = xhr.statusText;
            responseLog.responseText = xhr.responseText;
            responseLog.readyState = xhr.readyState;
        }
        return responseLog;
    }

    function parseError(x, e) {
        var returnResult, statusCode;
        getLogger().error("parseError:'" + e + "' Status:'" + x.status + "' ResponseText:'" + x.responseText + "'");

        if (x.responseText && x.responseText.search("statusCode") !== -1) {
            if (JSON.parse(x.responseText).subscribeResponse !== undefined) {
                statusCode = JSON.parse(x.responseText).subscribeResponse.statusCode;
            } else if (JSON.parse(x.responseText).authorizationResponse !== undefined) {
                statusCode = JSON.parse(x.responseText).authorizationResponse.statusCode;
            }
        }

        statusCode = statusCode ? statusCode : x.status;

        switch (statusCode) {
            case 401:
                returnResult = fcs.Errors.AUTH;
                break;
            case 403:
                returnResult = fcs.Errors.INCORRECT_LOGIN_PASS;
                break;
            case 19:
                returnResult = fcs.Errors.LOGIN_LIMIT_CLIENT;
                break;
            case 20:
                returnResult = fcs.Errors.LOGIN_LIMIT_TABLET;
                break;
            case 44:
                returnResult = fcs.Errors.FORCE_LOGOUT_ERROR;
                break;
            case 46:
                returnResult = fcs.Errors.TOKEN_NOT_FOUND;
                break;
            case 47:
                returnResult = fcs.Errors.SESSION_EXPIRED;
                break;
            default:
                returnResult = fcs.Errors.NETWORK;
        }
        return returnResult;
    }

    // TODO tolga: remove parseError when all of the responseTypes are added
    function parseErrorStatusCode(x, e, responseType) {
        getLogger().error("parseErrorStatusCode:'" + e + "' Status:'" + x.status + "' ResponseText:'" + x.responseText + "'");

        if (x.responseText && x.responseText.search("statusCode") !== -1 && JSON.parse(x.responseText)[responseType] !== undefined) {

            return JSON.parse(x.responseText)[responseType].statusCode;
        }

        return (x.status === 401 || x.status === 403) ? x.status : 400;
    }


    /**
     * @ignore
     */
    this.call = function(method, callParams, successHandler, errorHandler, successParser, errorParser, responseType, headers) {
        var data,
            timeout = DEFAULT_AJAX_TIMEOUT,
            url = callParams.url,
            resourceString,
            logger = getLogger(),
            xhr,
            queryString,
            finalHeaders,
            headerKey,
            responseLogContext,
            callback,
            handleSuccess,
            handleError,
            isSuccess,
            val;

        if (callParams && callParams.data) {
            data = callParams.data;
        }

        if (fcsConfig.polling) {
            timeout = fcsConfig.polling * 1000;
            if (fcsConfig.longpollingTolerans) {
                timeout = timeout + fcsConfig.longpollingTolerans;
            } else {
                timeout = timeout + DEFAULT_LONGPOLLING_TOLERANCE;
            }
        }

        if (url.split("/rest/version/")[1]) {
            // extracting rest resource from url.
            // ".../rest/version/<ver>/<user/anonymous>/<userName>/restResource/..."
            resourceString = url.split("/rest/version/")[1].split("/")[3];
            if (!resourceString) {
                // rest resource string not found, get last string in the url
                resourceString = url.substring(url.lastIndexOf("/") + 1, url.length);
            }
            // remove "?" if exists
            resourceString = resourceString.split("?")[0];

            if (data) {
                logger.info("Send ajax request: " + resourceString, data);
            } else {
                logger.info("Send ajax request: " + resourceString);
            }
        }

        if (method === 'GET') {
            // Take the data parameters and append them to the URL.
            queryString = utils.param(data);

            if (queryString.length > 0) {
                if (url.indexOf('?') === -1) {
                    url += '?' + queryString;
                } else {
                    url += '&' + queryString;
                }
            }

            // Remove data so that we don't add it to the body.
            data = null;
        }

        xhr = new XMLHttpRequest();
        xhr.open(method, url, fcs.isAsync());
        xhr.withCredentials = fcsConfig.cors ? true : false;
        xhr.timeout = timeout;

        finalHeaders = {
            // Old implementation used jQuery without changing content type. Doing the same here for
            // backwards compatibility.
            'Content-Type': 'application/x-www-form-urlencoded',

            // JQuery always adds this header by default. Adding here for backwards compatibility.
            'X-Requested-With': 'XMLHttpRequest'
        };

        finalHeaders = utils.extend(finalHeaders, headers);

        // Set the headers.
        for (headerKey in finalHeaders) {
            xhr.setRequestHeader(headerKey, finalHeaders[headerKey]);
        }

        if (typeof data !==  "string") {
            data = JSON.stringify(data);
        }

        xhr.send(data);

        // Used for logging information,
        responseLogContext = {
            type: method,
            url: url,
            dataType: "json",
            async: fcs.isAsync(),
            jsonp: false,
            crossDomain: fcsConfig.cors ? true : false,
            timeout: timeout
        };

        handleSuccess = function(val) {
            if (successParser && typeof successParser === 'function') {
                val = successParser(val);
            }
            if (successHandler && typeof successHandler === 'function') {
                successHandler(val);
            }
        };

        handleError = function (){
            if (errorHandler && typeof errorHandler === 'function') {
                //TODO after unit tests moved to addressbook class, responseType parameter should be removed
                if (responseType === "addressBookResponse") {
                    errorHandler(parseErrorStatusCode(xhr, xhr.statusText, responseType));
                } else {
                    if (errorParser && typeof errorParser === 'function') {
                        errorHandler(errorParser(xhr, xhr.statusText));
                    } else {
                        errorHandler(parseError(xhr, xhr.statusText));
                    }
                }
            } else {
                logger.trace("Error handler is not defined or not a function");
            }
        };

        callback = function() {

            // TODO: Handle abort
            if (xhr.readyState === XHR_READY_STATE.REQUEST_DONE) {

                isSuccess = (xhr.status >= 200 && xhr.status < 300) || xhr.status === 304;

                if (isSuccess) {
                    var val = {};

                    try {
                        // Make sure that the response isn't empty before parsing. Empty is considered
                        // an empty object.
                        if (typeof xhr.responseText === 'string' && xhr.responseText.length) {
                            val = JSON.parse(xhr.responseText);
                        }

                        logger.info("ajax success: " + xhr.status + " " + xhr.statusText,
                            composeAjaxRequestResponseLog(responseLogContext, xhr, undefined, val));

                        handleSuccess(val);
                    } catch(e) {
                        if (e instanceof SyntaxError) {
                            logger.error("Failed to parse json ajax response into object:" + xhr.responseText,
                                composeAjaxRequestResponseLog(responseLogContext, xhr, undefined, val));
                        } else {
                            logger.error("Unknown error:" + xhr.status + " " + xhr.statusText,
                                composeAjaxRequestResponseLog(responseLogContext, xhr, undefined, val));
                        }

                        handleError();
                    }

                } else {

                    // TODO: Error Thrown
                    logger.error("ajax error: " + xhr.status + " " + xhr.statusText,
                        composeAjaxRequestResponseLog(responseLogContext, xhr, xhr.statusText));

                    if (xhr.status === 410) {
                        logger.error("410 Gone received");
                        utils.callFunctionIfExist(fcs.notification.onGoneReceived);
                        return;
                    }

                    if (xhr.status === 0 && xhr.statusText === "abort") {
                        logger.trace("Ajax request aborted internally. not calling failure callback");
                        return;
                    }

                    handleError();
                }
            } else if (xhr.readyState === XHR_READY_STATE.REQUEST_NOT_INITIALIZED) {

                logger.error("ajax error: " + xhr.status + " " + xhr.statusText,
                    composeAjaxRequestResponseLog(responseLogContext, xhr, null));

                if (xhr.status === 0 && xhr.statusText === "abort") {
                    logger.trace("Ajax request aborted internally. not calling failure callback");
                    return;
                }

                globalBroadcaster.publish(CONSTANTS.EVENT.XHR_REQUEST_NOT_INITIALIZED);
                logger.debug("Ajax request cannot be sent, this is a connection problem.");

                handleError();
            }
        };

        // This code is similar to jQuery. It is done like this because the documentations says not
        // to use onreadystatechange if in synchronous mode.
        if (!fcs.isAsync()) {
            // In sync mode, just call the callback
            callback();
        } else if (xhr.readyState === 4) {
            // If the request already completed, just fire the callback asynchronously
            setTimeout(callback);
        } else {
            // Attach the call back
            xhr.onreadystatechange = callback;
        }

        return xhr;
    };
};

var JQrestful = function(_window, _globalBroadcaster) {
    return new JQrestfulImpl(_window || window,
                               _globalBroadcaster || globalBroadcaster);
};

var jQueryAdapter = new JQrestful();

var JqrestfullManagerImpl = function(_jQueryAdapter, _globalBroadcaster) {

    var REQUEST_TYPE_PUT = "PUT",
            REQUEST_TYPE_POST = "POST",
            REQUEST_TYPE_GET = "GET",
            REQUEST_TYPE_DELETE = "DELETE",username, password, session;

    function onSubscriptionStarted(data) {
        session = data.session;
    }

    // In order to delete previous session
    function onSubscriptionEnded() {
        session = null;
    }

    function onTokenAuth(data) {
        username = data.username;
    }

    function onBasicAuth(data) {
        username = data.username;
        password = data.password;
    }

    function manipulateHeader(header) {
        if (!header) {
            header = {};
        }
        if (!header.Accept) {
            header.Accept = "application/json";
        }
        if (!header['Content-Type']) {
            header['Content-Type'] = "application/json";
        }

        if (!getKandyUAT()) {
            //Check whether auth or basic auth
            if (session) {
                header['x-session'] = session;
                delete header.Authorization;
            } else {
                if (username && password) {
                    header.Authorization = "basic " + window.btoa(username + ":" + password);
                }
                delete header['x-session'];
            }
        }
        return header;
    }

    //TODO: requestTimeout, synchronous parameters should be refactored.
    //TODO: Header parameter should be  the first one. This would be corrected in refactor
    function sendRequest(method, callParams, successHandler, errorHandler, successParser, errorParser, responseType, header) {
        var failureHandler = function(statusCode) {
            if (statusCode === fcs.Errors.TOKEN_NOT_FOUND) {
                _globalBroadcaster.publish(CONSTANTS.EVENT.TOKEN_NOT_FOUND);
                session = null;
            } else if (statusCode === fcs.Errors.SESSION_EXPIRED){
                _globalBroadcaster.publish(CONSTANTS.EVENT.SESSION_EXPIRED);
                session = null;
            }

            if (errorHandler && typeof errorHandler === 'function') {
                errorHandler(statusCode);
            }
        }, kandyUAT = getKandyUAT();

        if (kandyUAT) {
            if (callParams.url.indexOf('?') === -1) {
                callParams.url += '?key=' + kandyUAT;
            } else {
                callParams.url += '&key=' + kandyUAT;
            }
        }

        return _jQueryAdapter.call(method, callParams, successHandler, failureHandler, successParser, errorParser, responseType, header);
    }

    function sendPostRequestTokenAuth(callParams, successHandler, errorHandler, successParser, errorParser, responseType, header, token) {
        if (!header) {
            header = {};
        }
        if (!header.Accept) {
            header.Accept = "application/json";
        }
        if (!header['Content-Type']) {
            header['Content-Type'] = "application/json";
        }
        //Check whether auth or basic auth
        if (header['x-session']) {
            delete header['x-session'];
        }
        if (header.Authorization) {
            delete header.Authorization;
        }
        if (!header['x-token']) {
            header['x-token'] = token;
        }
        return sendRequest(REQUEST_TYPE_POST, callParams, successHandler, errorHandler, successParser, errorParser, responseType, header);
    }

    this.call = function(method, callParams, successHandler, errorHandler, successParser, errorParser, responseType, header) {
        header = manipulateHeader(header);

        if (callParams && callParams.data) {
            callParams.data = JSON.stringify(callParams.data);
        }

        return sendRequest(method, callParams, successHandler, errorHandler, successParser, errorParser, responseType, header);
    };

    this.sendPostRequest = function(callParams, successHandler, errorHandler, successParser, errorParser, responseType, header, token) {

        if (callParams && callParams.data) {
            callParams.data = JSON.stringify(callParams.data);
        }

        if (token) {
            return sendPostRequestTokenAuth(callParams, successHandler, errorHandler, successParser, errorParser, responseType, header, token);
        } else {
            header = manipulateHeader(header);
            return sendRequest(REQUEST_TYPE_POST, callParams, successHandler, errorHandler, successParser, errorParser, responseType, header);
        }
    };

    this.sendGetRequest = function(callParams, successHandler, errorHandler, successParser, errorParser, responseType, header) {
        header = manipulateHeader(header);
        return sendRequest(REQUEST_TYPE_GET, callParams, successHandler, errorHandler, successParser, errorParser, responseType, header);
    };

    this.sendDeleteRequest = function(callParams, successHandler, errorHandler, successParser, errorParser, responseType, header) {
        header = manipulateHeader(header);

        if (callParams && callParams.data) {
            callParams.data = JSON.stringify(callParams.data);
        }

        return sendRequest(REQUEST_TYPE_DELETE, callParams, successHandler, errorHandler, successParser, errorParser, responseType, header);
    };

    this.sendPutRequest = function(callParams, successHandler, errorHandler, successParser, errorParser, responseType, header) {
        header = manipulateHeader(header);

        if (callParams && callParams.data) {
            callParams.data = JSON.stringify(callParams.data);
        }

        return sendRequest(REQUEST_TYPE_PUT, callParams, successHandler, errorHandler, successParser, errorParser, responseType, header);
    };

    _globalBroadcaster.subscribe(CONSTANTS.EVENT.TOKEN_AUTH_STARTED, onTokenAuth, 9);
    _globalBroadcaster.subscribe(CONSTANTS.EVENT.BASIC_AUTH_STARTED, onBasicAuth, 10);
    _globalBroadcaster.subscribe(CONSTANTS.EVENT.DEVICE_SUBSCRIPTION_STARTED, onSubscriptionStarted);
    _globalBroadcaster.subscribe(CONSTANTS.EVENT.DEVICE_SUBSCRIPTION_ENDED, onSubscriptionEnded);

    if (__testonly__) { this.manipulateHeader = manipulateHeader; }
    if (__testonly__) { this.setSession = function(value) { session = value; }; }
    if (__testonly__) { this.setUsernamePassword = function(user, pass) { username = user; password = pass; }; }
};

var JqrestfullManager = function(_jQueryAdapter, _globalBroadcaster) {
    return new JqrestfullManagerImpl(_jQueryAdapter || jQueryAdapter,
                               _globalBroadcaster || globalBroadcaster);
};

var server = new JqrestfullManager();

var fcsConfig = {
    polling: 30,
    iceCandidateCollectionTimeoutInterval: 3000,
    codecsToReplace: [{name : 'opus', value : '109'}]
};


var un = null, pw = null, connected = true, tkn = null, tokenRealm = null, kandyUAT = null;

var fcs;

function getDomain() {
    return un.split('@')[1];
}

function getUser() {
    return un;
}

function getUserPassword() {
    return pw;
}

function getUserToken() {
    return tkn;
}

function getRealm() {
    return tokenRealm;
}

function getKandyUAT(){
    return kandyUAT;
}

function getVersion() {
    return "3.0.5.1";
}

function isConnected() {
    return connected;
}

function setConnected(connectionStatus) {
    connected = connectionStatus === true ? true : false;
}

/**
* @name fcs
* @namespace
*/
var CoreImpl = function(_server, _globalBroadcaster, _window) {

    var dev = null, pluginVer = null, services = {}, async = true;

    /**
     * This function returns value of async paramater of $.ajax requests
     * 
     * @name fcs.isAsync
     * @function
     * @returns {Boolean} true/false
     * @since 3.0.0
     *
     * @example
     * fcs.isAsync();
     */
    this.isAsync = function() {
        return async;
    };

    /**
     * This function sets async option of $.ajax() requests.
     * If It is set to false, ajax requests will be sent synchronously
     * otherwise ajax requests will be sent asynchronously.
     * 
     * @name fcs.setAsync
     * @function
     * @param {Boolean} value
     * @return {Boolean} true/false
     * @since 3.0.0
     *
     * @example
     * fcs.setAsync(false);
     */
    this.setAsync = function(value) {
        async = value;
    };

    /**
     * This function returns username of authenticated user in user@domain format.
     *
     * @name fcs.getUser
     * @function
     * @returns {string} Username of current user
     * @since 3.0.0
     *
     * @example
     * fcs.getUser();
     */
    this.getUser = getUser;
    
     /**
     * This function returns password of authenticated user
     *
     * @name fcs.getUserPassword
     * @function
     * @returns {string} Password of current user
     * @since 3.0.0
     *
     * @example
     * fcs.getUserPassword();
     */
    this.getUserPassword = getUserPassword;

    /**
     * This function returns current domain name of authenticated user
     *
     * @name fcs.getDomain
     * @function
     * @returns {string} Current domain name
     * @since 3.0.0
     *
     * @example
     * fcs.getDomain();
     */
    this.getDomain = getDomain;
    
    /**
     * This function returns the version of the JSL-API
     * 
     * @name fcs.getVersion
     * @function
     * @returns {string} Version of the JSL-API
     * @since 3.0.0
     * 
     * @example 
     * fcs.getVersion(); 
     */
    this.getVersion = getVersion;
    
    /**
     * This fucntion returns current device.
     *
     * @name fcs.getDevice
     * @function
     * @returns {string} Device specified for communicating with the server
     * @since 3.0.0
     *
     * @example
     * fcs.getDevice();
     */
    this.getDevice = function() {
        return dev;
    };

    /**
     * This function sets the user as authentication mode and cancels device authentication (if such exists),
     * as user and device modes are mutually exclusive.
     *
     * @name fcs.setUserAuth
     * @function
     * @param {string} The user to be used for communicating with the server
     * @param {string} The password to be used for communicating with the server
     * 
     * @since 3.0.0
     *
     * @example
     * fcs.setUserAuth("Username", "Password");
     */
    this.setUserAuth = function(user, password) {
        un = user;
        pw = password;
        dev = null;
        _globalBroadcaster.publish(CONSTANTS.EVENT.BASIC_AUTH_STARTED, {'username' : user, 'password': password});
    };
    
    /**
     * This function sets the user as token mode authentication and cancels user authentication or/and device authentication (if such exists),
     * token authentication has priority over other authentications
     *
     * @name fcs.setTokenAuth
     * @function
     * @param {string} The user to be used for communicating with the server
     * @param {string} The token to be used for communicating with the server
     * 
     * @since 3.0.0
     *
     * @example
     * fcs.setTokenAuth("Username", "Token");
     */
    this.setTokenAuth = function(user, token){
        un = user;
        tkn = token;
        _globalBroadcaster.publish(CONSTANTS.EVENT.TOKEN_AUTH_STARTED, {'username' : user, 'token': token});
    };

    /**
     * This function sets the device as authentication mode and cancels user authentication (if such exists),
     * as user and device modes are mutually exclusive.
     *
     * @name fcs.setDeviceAuth
     * @function
     * @since 3.0.0
     * @param {string} deviceID The device to be used for communicating with the server
     *
     * @example
     * fcs.setDeviceAuth("DeviceID");
     */
    this.setDeviceAuth = function(deviceID) {
        dev = deviceID;
        un = null;
    };

    /**
     * This function sets the authentication realm for time limited token authentication.
     *
     * @name fcs.setRealm
     * @function
     * @since 3.0.4
     * @param {string} realm The realm for the time limited token auth
     *
     * @example
     * fcs.setRealm("realmname");
     */
    this.setRealm = function(realm) {
        tokenRealm = realm;
    };

    /**
     * This function sets the authentication UAT for kandy Authentication.
     *
     * @name fcs.setKandyUAT
     * @function
     * @since 3.0.4
     * @param {string} uat The User Access Token
     *
     * @example
     * fcs.setKandyUAT("uat");
     */
    this.setKandyUAT = function(uat) {
        kandyUAT = uat;
    };

    
    /**
     * List of Authentication Types.
     * @see setDeviceAuth
     * @see setUserAuth
     * @name AuthenticationType
     * @property {number} USER User authentication
     * @property {number} DEVICE Device authentication
     * @readonly
     * @memberOf fcs
     */
    this.AuthenticationType = {
        USER: 1,
        DEVICE: 2
    };

    /**
     * List of Error Types
     *
     * @name fcs.Errors
     * @property {number} NETWORK Network failures
     * @property {number} AUTH Authentication / Authorization failures
     * @property {number} STATE Invalid state
     * @property {number} PRIV Privilege failures
     * @property {number} UNKNOWN Unknown failures
     * @property {number} LOGIN_LIMIT Login limit exceeded
     * @property {number} INCORRECT_LOGIN_PASS Incorrect identifier
     * @property {number} INVALID_LOGIN Invalid username
     * @property {number} TOKEN_NOT_FOUND Token provided is not valid
     * @property {number} SESSION_EXPIRED Session generated from token is expired
     * @property {number} VIDEO_SESSION_NOT_AVAILABLE Video Session is not available
     * @property {number} PENDING_REQUEST There is a pending request.
     * @readonly
     * @memberOf fcs
     * @example 
     * if (e === fcs.Errors.AUTH) 
     * {
     *     console.log("Authentication error occured")
     * }
     */
    this.Errors = {
        NETWORK: 1,
        AUTH: 2,
        STATE: 3,
        PRIV: 4,
        UNKNOWN: 9,
        LOGIN_LIMIT_CLIENT: 10,
        INCORRECT_LOGIN_PASS: 11,
        INVALID_LOGIN: 12,
        FORCE_LOGOUT_ERROR : 13, // smartoffice2.0 specific
        LOGIN_LIMIT_TABLET: 14, // smartoffice2.0 specific
        TOKEN_NOT_FOUND: 15,
        SESSION_EXPIRED: 16,
        VIDEO_SESSION_NOT_AVAILABLE: 17,
        PENDING_REQUEST: 18
    };

    /**
     * This function is used to set up JSL library
     *
     * @name fcs.setup
     * @function
     * @param {object} configParams Object containing parameters to be configured
     * @param {fcs.notification.NotificationTypes} [configParams.notificationType] The notification type to be used. Defauts to: LONGPOLLING
     * @param {string} [configParams.restUrl] The URL of REST server http://ip:port. Defaults to an absolute url : /rest
     * @param {string} [configParams.restPort] The port of REST server http://ip:port. 
     * @param {string} [configParams.polling] Polling time value in seconds. Default is 30.
     * @param {string} [configParams.expires] Expire time value in miliseconds. Default is 3600.
     * @param {string} [configParams.websocketProtocol] Determines if the websocketProtocol is secure or non-secure. Default is non-secure, which is "ws".
     * @param {string} [configParams.websocketIP] Holds the websocket connection's IP adress.
     * @param {string} [configParams.websocketPort] Holds the websocket connection's port value. By defult, it is 8581.
     * @param {string} [configParams.codecsToRemove] Audio codesc to be removed.
     * @param {string} [configParams.callAuditTimer] Audit time value for calls.
     * @param {string} [configParams.cors] True if Cross-Origin Request Sharing supported.
     * @param {string} [configParams.services] Defines the enabled services for client. Ex: CallControl, IM, call 
     * @param {string} [configParams.protocol] HTTP protocol to be used. Ex: Http, Https
     * @param {string} [configParams.clientIp] The client IP address for SNMP triggers
     * @param {string} [configParams.serverProvidedTurnCredentials] Provide TURN server credentials from server or not.
     * @param {number} [configParams.iceCandidateCollectionTimeoutInterval] When provided (in milliseconds), ice candidate collection assumed to be completed if at least one candidate is received within the interval. Default is 3000.
      * @param {object} [configParams.pluginMode] Configures plugin mode (as 'webrtc' or 'auto') and h264 status as browser-specific with version restriction (for Chrome and Firefox) or as general default values.
     * @param {string} [configParams.pluginMode.mode="auto"] General plugin mode. 'webrtc' for default webrtc plugin, 'auto' for the usage of native chrome and firefox or the usage of default webrtc plugin for the others.
     * @param {boolean} [configParams.pluginMode.h264=false] General H264 codec status.
     * @param {object} [configParams.pluginMode.chrome] Chrome-specific configurations
     * @param {string} [configParams.pluginMode.chrome.mode] Chrome-specific plugin mode. Overrides the general one.
     * @param {boolean} [configParams.pluginMode.chrome.h264] Chrome-specific H264 codec status. Overrides the general one.
     * @param {string} [configParams.pluginMode.chrome.version] Version lowerbound for Chrome configurations. Ex: "40+". Includes all the versions if not given.
     * @param {object} [configParams.pluginMode.firefox] Firefox-specific configurations
     * @param {string} [configParams.pluginMode.firefox.mode] Firefox-specific plugin mode. Overrides the general one.
     * @param {boolean} [configParams.pluginMode.firefox.h264] Firefox-specific H264 codec status. Overrides the general one.
     * @param {string} [configParams.pluginMode.firefox.version] Version lowerbound for Firefox configurations. Ex: "40+". Includes all the versions if not given.
     * @since 3.0.0
     * @example
     *
     * fcs.setup(
     *   {
     *       notificationType: fcs.notification.NotificationTypes.WEBSOCKET,
     *       websocketProtocol : 'wss', 
     *       websocketIP: '1.1.1.1', 
     *       websocketPort : '8581', 
     *       clientIp: 'IP Address',
     *       restUrl: 'http://ip:port', 
     *       restPort": '443', 
     *       callAuditTimer: 30000, 
     *       clientControlled : true, 
     *       pluginMode: {
     *          mode: 'webrtc',
     *          h264: false,
     *          chrome: {
     *              mode: 'auto'
     *          },
     *          firefox: {
     *              version: '38+',
     *              mode: 'auto'
     *          }
     *       }
     *   }
     * );
     */
    this.setup = function(configParams) {
        var param;
        for (param in configParams) {
            if (configParams.hasOwnProperty(param)) {
                fcsConfig[param] = configParams[param];
            }
        }
    };

    /**
     * This function sets version of plugin
     *
     * @name fcs.setPluginVersion
     * @function
     * @param {string} version
     * @since 3.0.0
     * @example
     * 
     * fcs.setPluginVersion(version);
     */
    this.setPluginVersion = function(version) {
        pluginVer = version;
    };

    /**
     * This function returns version of plugin
     *
     * @name fcs.getPluginVersion
     * @function
     * @returns {String} Version of Current Plugin
     * @since 3.0.0
     * @example
     * 
     * fcs.getPluginVersion();
     */
    this.getPluginVersion = function() {
        return pluginVer;
    };

    /**
     * This function returns assigned services of authenticated user.
     *
     * @name fcs.getServices
     * @function
     * @returns {object} The assigned services of authenticated user
     * @since 3.0.0
     * @example
     * 
     * fcs.getServices();
     */
    this.getServices = function() {
        return services;
    };

    /**
     * This function assigns determined services to current user
     *
     * @name fcs.setServices
     * @function
     * @param {array} serviceParam The list of assigned services for the user
     * @since 3.0.0
     * @example
     * fcs.setServices(["CallControl", "RestfulClient"]);
     */
    this.setServices = function(serviceParam) {
        var i;
        // for each element in serviceParam array, we create the service with value "true" in "services" object
        if (serviceParam) {
            for (i = 0; i < serviceParam.length; i++) {
                switch (serviceParam[i]) {
                    case "CallDisplay":
                        services.callDisplay = true;
                        break;
                    case "CallDisposition":
                        services.callDisposition = true;
                        break;
                    case "RestfulClient":
                        services.restfulClient = true;
                        break;
                    case "call":
                    case "CallControl":
                        services.callControl = true;
                        break;
                    case "CallMe":
                        services.callMe = true;
                        break;
                    case "Directory":
                        services.directory = true;
                        break;
                    case "ClickToCall":
                        services.clickToCall = true;
                        break;
                    case "Presence":
                        services.presence = true;
                        break;
                    case "AddressBook":
                        services.contacts = true;
                        break;
                    case "CallLog":
                        services.history = true;
                        break;
                    case "Custom":
                        services.custom = true;
                        break;
                    case "IM":
                        services.IM = true;
                        break;
                    case "Route":
                        services.routes = true;
                        break;
                    default:
                        break;
                }
            }
        }
    };
    
    /**
     * This function deletes subscription of authenticated user and clear other  user related resources
     * 
     * @deprecated use fcs.notification.stop
     * @name fcs.clearResources
     * @function
     * @param {type} done Function to be executed when process done
     * @param {type} clearUserCredentials True if remove the user credentials from local storage
     * @param {type} synchronous
     * @since 3.0.0
     * @example
     * fcs.clearResources();
     *
     */
    this.clearResources = function(done, clearUserCredentials, synchronous) {

        if (synchronous) {
          fcs.setAsync(false);
        }
        fcs.notification.stop(function() {
            //onsuccess
            _window.localStorage.removeItem("SubscriptionStamp");
        }, function() {
            //onfailure, can be used in the future
        }, true);
        if (clearUserCredentials) {
            _window.localStorage.removeItem("USERNAME");
            _window.localStorage.removeItem("PASSWORD");
        }
        if (typeof done === 'function') {
            done();
        }
    };
    
    this.getUserLocale = function(onSuccess, onFailure) {
        _server.sendGetRequest({
                "url":getWAMUrl(1, "/localization", false)
            },
            function (data) {
                utils.callFunctionIfExist(onSuccess, data);
            },
            onFailure
        );        
    };
    
    
    /**
     * Returns network connectivity status.
     * 
     * @name fcs.isConnected
     * @function
     * 
     * @returns {Boolean}, true if connection is up otherwise false.
     */
    this.isConnected = isConnected;

}, fcs;

var Core = function(_server, _globalBroadcaster, _window) {
    return new CoreImpl(_server || server,
                       _globalBroadcaster || globalBroadcaster,
                       _window || window);
};

fcs = new Core();
fcs.fcsConfig = fcsConfig;

if (__testonly__) { __testonly__.Core = Core; }

/**
 * 
 * LogManager provides javascript logging framework.<br />
 * 
 * <br />The logging level strategy is as follows:<br />
 * 
 * <br />DEBUG: Used for development and detailed debugging logs<br />
 * INFO: Messages that provide information about the high level flow<br />
 * through. Contain basic information about the actions being performed<br />
 * by the user and/or the system<br />
 * WARN: Things that shouldn't happen but don't have any immediate effect, and should be flagged<br />
 * ERROR: Errors and Exceptions<br />
 * FATAL: Anything that causes the system to enter into an unstable and unusable state<br />
 * 
 * 
 * @name logManager
 * @namespace
 * @memberOf fcs
 * 
 * @version 3.0.5.1
 * @since 3.0.0
 * 
 */
var LogManagerImpl = function(_notificationManager) {
    var loggers = {},
            enabled = false,
            Level = {
        OFF: "OFF",
        FATAL: "FATAL",
        ERROR: "ERROR",
        WARN: "WARN",
        INFO: "INFO",
        DEBUG: "DEBUG",
        TRACE: "TRACE",
        ALL: "ALL"
    }, _logHandler = null;

    function getNotificationId() {
        return notificationManager ? notificationManager.getNotificationId() : null;
    }

    /**
     * 
     * Log object.
     * 
     * @typedef {Object} logObject
     * @readonly
     * @since 3.0.0
     * 
     * @property {String}  user - the user registered to fcs library.
     * @property {String}  timestamp - the time stamp of the log.
     * @property {String}  logger - the name of the logger.
     * @property {String}  level - the level of message.
     * @property {?String} notificationId - the notification channnel id used by fcs library.
     * @property {String}  message -  the message string.
     * @property {Object}  args - the arguments.
     * 
     */

    /**
     * 
     * Log handler function.
     *
     * @typedef {function} logHandler
     * @param {string} loggerName Name of the logger
     * @param {string} level Level of message
     * @param {logObject} logObject Log object
     * @since 3.0.0
     */

    /**
     * 
     * Initializes logging using user-provided log handler.
     * @name initLogging
     * @since 3.0.0
     * @function
     * @memberOf fcs.logManager
     * 
     * @param {logHandler} logHandler, Function that will receive log entries
     * @param {boolean} enableDebug, Flag defining whether debugging should be enabled or not
     * @returns {undefined}
     * 
     * @example
     * 
     * function jslLogHandler(loggerName, level, logObject) {
     *     var LOG_LEVEL = fcs.logManager.Level,
     *         msg = logObject.timestamp + " - " + loggerName + " - " + level + " - " + logObject.message;
     *     
     *     switch(level) {
     *         case LOG_LEVEL.DEBUG:
     *             window.console.debug(msg, logObject.args);
     *             break;
     *         case LOG_LEVEL.INFO:
     *             window.console.info(msg, logObject.args);
     *             break;
     *         case LOG_LEVEL.ERROR:
     *             window.console.error(msg, logObject.args);
     *             break;
     *             default:
     *             window.console.log(msg, logObject.args);
     *     }
     * }
     * 
     * fcs.logManager.initLogging(jslLogHandler, true);
     */
    this.initLogging = function(logHandler, enableDebug) {
        if (!logHandler || typeof logHandler !== 'function') {
            return false;
        }
        _logHandler = logHandler;
        enabled = enableDebug === true ? true : false;
        return true;
    };

    /**
     * 
     * Enumerates all possible log levels.
     * @name Level
     * @enum {string}
     * @since 3.0.0
     * @readonly
     * @memberOf fcs.logManager
     * @property {string} [OFF=OFF] string representation of the Off level.
     * @property {string} [FATAL=FATAL]  string representation of the Fatal level.
     * @property {string} [ERROR=ERROR] string representation of the Error level.
     * @property {string} [WARN=WARN] string representation of the Warn level.
     * @property {string} [INFO=INFO] string representation of the Info level.
     * @property {string} [DEBUG=DEBUG] string representation of the Debug level.
     * @property {string} [TRACE=TRACE] string representation of the Trace level.
     * @property {string} [ALL=ALL] string representation of the All level.
     */
    this.Level = Level;

    /**
     * Returns true or false depending on whether logging is enabled.
     * 
     * @name isEnabled
     * @function
     * @memberOf fcs.logManager
     * 
     * @returns {Boolean} 
     * @since 3.0.0
     * 
     * @example
     * 
     * fcs.logManager.isEnabled();
     * 
     */
    this.isEnabled = function() {
        return enabled;
    };

    function Logger(loggerName) {
        var name = loggerName;

        this.getName = function() {
            return name;
        };

        function log(level, message, argument) {
            if (enabled) {
                var logObject = {};

                logObject.user = getUser();
                logObject.timestamp = new Date().getTime();
                logObject.logger = name;
                logObject.level = level;
                logObject.notificationId = getNotificationId();
                logObject.message = message;
                logObject.args = argument;


                if (_logHandler) {
                    try {
                        _logHandler(logObject.logger, logObject.level, logObject);
                    }
                    catch (e) {
                        return undefined;
                    }
                }
            }
            return false;
        }

        this.trace = function trace(msg, argument) {
            return log(Level.TRACE, msg, argument);
        };

        this.debug = function debug(msg, argument) {
            return log(Level.DEBUG, msg, argument);
        };

        this.info = function info(msg, argument) {
            return log(Level.INFO, msg, argument);
        };

        this.warn = function warn(msg, argument) {
            return log(Level.WARN, msg, argument);
        };

        this.error = function error(msg, argument) {
            return log(Level.ERROR, msg, argument);
        };

        this.fatal = function fatal(msg, argument) {
            return log(Level.FATAL, msg, argument);
        };
    }

    this.getLogger = function(loggerName) {
        var logger, _loggerName;
        _loggerName = loggerName ? loggerName.trim().length !== 0 ? loggerName : "Default" : "Default";
        if (loggers[_loggerName]) {
            logger = loggers[_loggerName];
        }
        else {
            logger = new Logger(_loggerName);
            loggers[logger.getName()] = logger;
        }

        return logger;
    };
};

var LogManager = function() {
    return new LogManagerImpl();
};

if (__testonly__) { __testonly__.LogManager = LogManager; }
var logManager = new LogManager();
fcs.logManager = logManager;
var spidr, JslFacade = function() {
    var logger = logManager.getLogger("jslFacade");

    this.configurationData = {
        notificationType: null,
        restUrl: null,
        restPort: null,
        websocketIP: null,
        websocketPort: null,
        disableNotifications: null,
        protocol: null       
        //iceserver: null,
        //webrtcdtls: null,
        //pluginMode: null
    };
    this.notificationHandler = {
        onLoginSuccess: null,
        onLoginFailure: null,
        onCallNotification: null,
        onImNotification: null,
        onPresenceNotification: null
    };
    
    this.environmentVariables = {
        iceserver: null,
        webrtcdtls: null,
        pluginMode: null,
        pluginLogLevel: null,        
        ice: null,
        videoContainer: ""
    };

    this.incomingCall = null; //may remove
    this.outgoingCall = null; //may remove
    this.onCallNotification = null;
    this.onImNotification = null;
    this.onPresenceNotification = null;
    this.mediaInitiated = false;
    this.callStates = null;
    this.onIncomingCallStateChange = null;
    this.onOutgoingCallStateChange = null;
    this.onIncomingCallStreamAdded = null;
    this.onOutgoingCallStreamAdded = null;
    this.rejectSuccess = null;
    this.rejectFailure = null;
    this.downloadPlugin = null;

    /**
     * Setup environment
     *
     * @name spidr.setup()
     * @function
     * @param {Object} rest_ip
     * @param {Object} websocket_ip
     * @param {Object} rest_port
     * @param {Object} websocket_port
     * @param {Object} notification_type - "longpolling", "snmp", "websocket"
     * @param {boolean} disable_notifications - "true", "false"
     * @param {Object} protocol
     */
    //Not needed. This is for config.json
    this.makeConnection = function(configData) {
        /*fcs.setup({
         notificationType: notification_type,
         restIP: rest_ip,
         restPort: rest_port,
         websocketIP: websocket_ip,
         websocketPort: websocket_port,
         disableNotifications : disable_notifications,
         protocol: "http"
         });*/
        fcs.setup(configData);
    };

    /**
     * Authenticate as a user
     *
     * @name spidr.authenticate()
     * @function
     * @param {Object} username
     * @param {Object} password
     */

    this.authenticate = function(username, password) {
        fcs.setUserAuth(username, password);
    };

    /**
     * Subscribe to services
     *
     * @name spidr.subscribe()
     * @param onLoginSuccess
     * @param onLoginFailure
     * @param onCallNotification
     * @param onIMNotification
     * @param onPresenceNotification
     * @param isAnonymous
     */

    this.subscribe = function(onLoginSuccess, onLoginFailure,
            onCallNotification,
            onIMNotification,
            onPresenceNotification,
            isAnonymous) {
        fcs.notification.start(function() {
            //onSuccess
            if (utils.callFunctionIfExist(onLoginSuccess) === -1) {
                logger.error("onLoginSuccess is not defined");
            }

            spidr.callStates = fcs.call.States;
            
            fcs.call.initMedia(function() {
                logger.info("Media Initiated");
                spidr.mediaInitiated = true;
                },
                function() {
                    logger.error("Problem occured while initiating media");
                    utils.callFunctionIfExist(spidr.downloadPlugin);
                },
                {
                    "pluginLogLevel": spidr.environmentVariables.pluginLogLevel,//2,
                    "ice": spidr.environmentVariables.ice, //"STUN " + "stun:206.165.51.23:3478",
                    "videoContainer": spidr.environmentVariables.videoContainer, //"",
                    "pluginMode": spidr.environmentVariables.pluginMode, //"auto",
                    "iceserver": spidr.environmentVariables.iceserver, //"stun:206.165.51.23:3478"
                    "webrtcdtls" : spidr.environmentVariables.webrtcdtls
                }
            );

            if (!isAnonymous) {
                fcs.call.onReceived = function(call) {
                    logger.info("incoming call");
                    spidr.incomingCall = call;
                    
                    spidr.incomingCall.onStateChange = function(state) {
                        if (utils.callFunctionIfExist(spidr.onIncomingCallStateChange, call, state) === -1) {
                            logger.error("Assign a function to spidr.onIncomingCallStateChange");
                        }                       
                    };
                    
                    spidr.incomingCall.onStreamAdded = function(streamURL) {
                        if (utils.callFunctionIfExist(spidr.onIncomingCallStreamAdded, call, streamURL) === -1) {
                            logger.error("Assign a function to spidr.onIncomingCallStreamAdded");
                        }
                    };
                    
                    if (utils.callFunctionIfExist(onCallNotification, call) === -1) {
                        logger.error("onCallNotification is not defined");
                    }
                };

                fcs.im.onReceived = function(msg) {
                    //showNotification();
                    //window.alert("im received");
                    //window.alert("FROM= " + msg.primaryContact + " MSG= " + msg.msgText);
                    if (utils.callFunctionIfExist(onIMNotification, msg) === -1) {
                        logger.error("onIMNotification is not defined");
                    }

                };

                fcs.presence.onReceived = function(presence) {
                    //showNotification();
                    //window.alert("Presence info received");
                    //window.alert("Presence info received from= " + presence.name + " Status= " + presence.activity);
                    if (utils.callFunctionIfExist(onPresenceNotification, presence) === -1) {
                        logger.error("onIMNotification is not defined");
                    }

                };
            }
        },
                onLoginFailure,
                // window.alert("Something Wrong Here!!!");
                isAnonymous
                );
    };

    /**
     * Login.
     *
     * @name spidr.login()
     * @function
     * @param {Object} username
     * @param {Object} password
     * @param nh
     * @param isAnonymous
     */

    function login(username, password, nh, isAnonymous) {
        spidr.authenticate(username, password);
        spidr.subscribe(nh.onLoginSuccess, nh.onLoginFailure, nh.onCallNotification,
                nh.onImNotification, nh.onPresenceNotification, isAnonymous);
    }

    /**
     * LoginNamed
     *
     * @name spidr.loginNamed()
     * @function
     * @param {Object} username
     * @param {Object} password
     * @param nh
     */
    //function name may be loginIdentified
    this.loginNamed = function(username, password, nh) {
        login(username, password, nh, false);
    };

    /**
     * LoginAnonymous
     *
     * @name spidr.loginAnonymous()
     * @function
     * @param nh
     * @param callTo
     */
    this.loginAnonymous = function(callTo) {
        var nh = spidr.notificationHandler;
        nh.onLoginSuccess = function() {
            logger.info("Anonymous login is successful");
        };
        nh.onLoginFailure = function() {
            logger.error("Anonymous login is failed");
        };
        login(callTo, "abcd1234", nh, true);
        /*spidr.authenticate(callTo, "abcd1234");
         spidr.subscribe(nh.onLoginSuccess, nh.onLoginFailure, nh.onCallNotification,
         nh.onImNotification, nh.onPresenceNotification, true); */
    };

    /**
     * Logout
     *
     * @name spidr.logout()
     * @function
     * @param onSuccess
     * @param onFailure
     */

    this.logout = function(onSuccess, onFailure) {
        fcs.clearResources(function() {
            // if anything needs to be cleared specificly.
            // // clear it here.
            //  $(window).unbind('beforeunload');
            //  $(window).unbind('unload');
            //  window.location.href = ".";
        },
                true,
                true);
        //  fcs.notification.stop(function() {
        //onsuccess
        //    onSuccess();
        //  }, function() {
        //onfailure, can be used in the future
        //      onFailure();
        //  }, true /*synchronous*/); 

    };

    function makeCall(contact, to, onStartCall, onFailure, isVideoEnabled, sendInitialVideo) {
        //needs to be worked on onSuccess, onFailure?
        fcs.call.startCall(fcs.getUser(), contact, to,
                //onSuccess
                        function(outgoingCall) {                           
                            outgoingCall.onStateChange = function(state, statusCode) {                                
                                outgoingCall.statusCode = statusCode;
                                if (utils.callFunctionIfExist(spidr.onOutgoingCallStateChange, outgoingCall, state) === -1) {
                                    logger.error("Assign a function to spidr.onOutgoingCallStateChange");
                                }
                            };
                            outgoingCall.onStreamAdded = function(streamURL) {
                                if (utils.callFunctionIfExist(spidr.onOutgoingCallStreamAdded, outgoingCall, streamURL) === -1) {
                                    logger.error("Assign a function to spidr.onOutgoingCallStreamAdded");
                                }
                            };
                            spidr.outgoingCall = outgoingCall;
                            utils.callFunctionIfExist(onStartCall, outgoingCall);
                        },
                        //onFailure	
                                function() {
                                    logger.error("CALL FAILED!!!");
                                    utils.callFunctionIfExist(onFailure);
                                },
                                isVideoEnabled /*isVideoEnabled*/, sendInitialVideo /*sendInitialVideo*/);
                    }

            /**
             * Make a video call
             *
             * @name spidr.makeVideoCall()
             * @param onStartCall
             * @param onFailure
             * @param {Object} contact - caller's info contact.firstName, contact.lastNAme
             * @param {Object} to
             */

            this.makeVideoCall = function(contact, to, onStartCall, onFailure) {
                makeCall(contact, to, onStartCall, onFailure, false, true);
            };

            /**
             * Make a voice call
             *
             * @name spidr.makeVoiceCall()
             * @param onStartCall
             * @param onFailure
             * @param {Object} contact - caller's info contact.firstName, contact.lastNAme
             * @param {Object} to
             */

            this.makeVoiceCall = function(contact, to, onStartCall, onFailure) {
                makeCall(contact, to, onStartCall, onFailure, false, false);
            };

            /**
             * Receive a voice call
             *
             * @name spidr.receiveVoiceCall()
             * @function
             */

            this.receiveVoiceCall = function() {
                //
            };

            /**
             * Make a three-way call
             *
             * @name spidr.makeThreeWayCall()
             * @function
             */

            this.makeThreeWayCall = function() {
                //I am not sure yet if this is a separate method
            };

            /**
             * Make a voice to video call
             *
             * @name spidr.makeVoiceToVideoCall()
             * @function
             */

            this.makeVoiceToVideoCall = function() {
                //start call with required configuration for voice/video options
            };

            /**
             * Send an instant message
             *
             * @name spidr.sendIm()
             * @function
             * @param {Object} to
             * @param {Object} type
             * @param {Object} msgText
             * @param {Object} charset
             * @param {Object} onSuccess
             * @param {Object} onError
             */

            this.sendIm = function(to, type, msgText, charset, onSuccess, onError) {
                //construct an im object with values of to, type, msgText, charset then call fcs.im
                var im = new fcs.im.Message();
                im.primaryContact = to;
                im.type = type;
                im.msgText = msgText;
                im.charset = charset;

                fcs.im.send(im, onSuccess, onError);
            };

            /**
             * Receive an instant message
             *
             * @name spidr.receiveIm()
             * @function
             * @param {Object}
             */

            this.receiveIm = function() {

            };

            /**
             * Receive infos of contacts
             *
             * @name spidr.retrieveContacts()
             * @function
             * @param {Object} onSuccess
             * @param {Object} onError
             */

            this.retrieveContacts = function(onSuccess, onError) {

                fcs.addressbook.retrieve(onSuccess, onError);
            };

            /**
             * Watch presence info of contacts
             *
             * @name spidr.watchPresence()
             * @function
             * @param {Object} userlist
             * @param {Object} onSuccess
             * @param {Object} onError
             */

            this.watchPresence = function(userlist, onSuccess, onError) {

                fcs.presence.watch(userlist, onSuccess, onError);
            };

            /**
             * Stop watching presence info of contacts
             *
             * @name spidr.unWatchPresence()
             * @function
             * @param {Object} userlist
             * @param {Object} onSuccess
             * @param {Object} onError
             */

            this.unWatchPresence = function(userlist, onSuccess, onError) {

                fcs.presence.stopwatch(userlist, onSuccess, onError);
            };

            /**
             * Receive presence info of contacts
             *
             * @name spidr.receivePresence()
             * @function
             * @param {Object} userlist
             * @param {Object} onSuccess
             * @param {Object} onError
             */

            this.receivePresence = function(userlist, onSuccess, onError) {

                fcs.presence.retrieve(userlist, onSuccess, onError);
            };

            /**
             * Update presence
             *
             * @name spidr.updatePresence()
             * @function
             * @param {Object} state
             */

            this.updatePresence = function(state) {

                if (fcs.getServices().presence === true) {
                    //Setting ONLINE after login succeded
                    //Publish message needs to be send when subscription is successful

                    fcs.presence.update(state,
                            function() {
                                logger.info("Presence update success");
                            },
                            function() {
                                logger.error("Presence update failed");
                            });

                    //For testing
                    switch (state) {
                        case 0:
                            logger.info("CONNECTED");
                            break;
                        case 1:
                            logger.info("UNAVAILABLE");
                            break;
                        case 2:
                            logger.info("AWAY");
                            break;
                        case 3:
                            logger.info("OUT_TO_LUNCH");
                            break;
                        case 4:
                            logger.info("BUSY");
                            break;
                        case 5:
                            logger.info("ON_VACATION");
                            break;
                        case 6:
                            logger.info("BE_RIGHT_BACK");
                            break;
                        case 7:
                            logger.info("ON_THE_PHONE");
                            break;
                        case 8:
                            logger.info("ACTIVE");
                            break;
                        case 9:
                            logger.info("INACTIVE");
                            break;
                        case 10:
                            logger.info("PENDING");
                            break;
                        case 11:
                            logger.info("OFFLINE");
                            break;
                        case 12:
                            logger.info("CONNECTEDNOTE");
                            break;
                        case 13:
                            logger.info("UNAVAILABLENOTE");
                            break;
                        default:
                            logger.info("WRONG STATE");
                    }
                }
                else
                {
                    logger.fatal("PRESENCE SERVICE NOT ASSIGNED FOR THIS USER");
                }
            };

            /**
             * Look up an address in the address book
             *
             * @name spidr.searchAddress()
             * @function
             * @param {Object} criteria
             * @param {Object} searchType
             */

            this.searchAddress = function(criteria, searchType) {
                //Specific search
                //fcs.addressbook.searchDirectory(criteria, searchType, onSuccess, onFailure);
                //Retreive adressbook
                //fcs.addressbook.retrieve(onSuccess, onFailure);		
            };

            /**
             * Incoming Call Answer
             *
             * @name spidr.callAnswer()
             * @function
             * @param call
             * @param onAnswer
             * @param onFailure 
             * @param isVideoAnswer
             */

            function callAnswer(call, onAnswer, onFailure, isVideoAnswer) {
                call.answer(onAnswer,
                        onFailure,
                        isVideoAnswer
                        );
            }

            /**
             * Incoming Call Answer with voice
             *
             * @name spidr.answerVoiceCall()
             * @function
             * @param call
             * @param onAnswer
             * @param onFailure 
             */

            this.answerVoiceCall = function(call, onAnswer, onFailure) {
                callAnswer(call, onAnswer, onFailure, false);
            };

            /**
             * Incoming Call Answer with voice
             *
             * @name spidr.answerVideoCall()
             * @function
             * @param call
             * @param onAnswer
             * @param onFailure 
             */

            this.answerVideoCall = function(call, onAnswer, onFailure) {
                callAnswer(call, onAnswer, onFailure, true);
            };

            /**
             * Call End
             *
             * @name spidr.endCall()
             * @function
             * @param call
             * @param {Object} onEnd
             * @param {Object} onFailure
             */

            this.endCall = function(call, onEnd, onFailure) {
                //var call = spidr.incomingCall || spidr.outgoingCall;
                call.end(
                        onEnd,
                        onFailure
                        );
                logger.info("Call is ended.");
            };

            /**
             * Incoming Call Reject
             *
             * @name spidr.rejectCall()
             * @function
             * @param call
             * @param {Object} rejectSuccess
             * @param {Object} rejectFailure
             */

            this.rejectCall = function(call, rejectSuccess, rejectFailure) {
                //spidr.incomingCall.
                call.reject(
                        rejectSuccess,
                        rejectFailure
                        );
                logger.info("Incoming call is rejected.");
            };

            /**
             * Start video
             * 
             * @name spidr.startVideo
             * @function
             * @param call
             * @param {Object} startSuccess
             * @param {Object} startFailure
             */
            //add call parameter
            this.startVideo = function(call, startSuccess, startFailure) {
                //var call = spidr.incomingCall || spidr.outgoingCall;
                logger.info("Start video");
                call.videoStart(startSuccess, startFailure);
            };

            /**
             * Stop video 
             * 
             * @name spidr.stopVideo
             * @function
             * @param call
             * @param {Object} stopSuccess
             * @param {Object} stopFailure
             */
            //add call parameter
            this.stopVideo = function(call, stopSuccess, stopFailure) {
                //var call = spidr.incomingCall || spidr.outgoingCall;
                logger.info("Stop video");
                call.videoStop(stopSuccess, stopFailure);
            };

            /*
             * callMute
             * Use this method to mute
             */
            this.mute = function(call) {
                //var call = spidr.incomingCall || spidr.outgoingCall;
                call.mute();
                logger.info("Mute");
            };

            /*
             * callUnMute
             * Use this method to mute
             */
            this.unMute = function(call) {
                //var call = spidr.incomingCall || spidr.outgoingCall;
                call.unmute();
                logger.info("Unmute");
            };

            /*
             * hold
             * Use this method to hold call
             * 
             * @name spidr.hold
             * @function
             * @param call
             * @param {Object} holdSuccess
             * @param {Object} holdFailure
             */
            this.hold = function(call, holdSuccess, holdFailure) {
                //var call = spidr.incomingCall || spidr.outgoingCall;
                call.hold(holdSuccess, holdFailure);
                logger.info("Hold");
            };

            /*
             * unHold
             * Use this method to unhold call
             * 
             * @name spidr.unHold
             * @function
             * @param {Object} unHoldSuccess
             * @param {Object} unHoldFailure
             */
            this.unHold = function(call, unHoldSuccess, unHoldFailure) {
                //var call = spidr.incomingCall || spidr.outgoingCall;
                call.unhold(unHoldSuccess, unHoldFailure);
                logger.info("Unhold");
            };

            /*
             * sendDTMF
             * Use this method to sendDTMF
             */
            this.sendDTMF = function(tone) {
                var call = spidr.incomingCall || spidr.outgoingCall;
                call.sendDTMF(tone);
            };

            /*
             * getServices
             * Use this method to get services
             */

            this.getServices = function() {
                var services;
                services = fcs.getServices();
                return services;
            };

            /*
             * getUser
             * Use this method to get user
             */

            this.getUser = function() {
                var user;
                user = fcs.getUser();
                return user;
            };

        };
spidr = new JslFacade();
window.spidr = spidr;

function getUrl(){
        var url = "";

        if(!fcsConfig.protocol || !fcsConfig.restUrl || !fcsConfig.restPort) {
            return url;
        }
        return url + fcsConfig.protocol + "://" + fcsConfig.restUrl + ":" + fcsConfig.restPort;
    }

    function getWAMUrl(version, url, authNeeded){
        if (authNeeded === false) {
            // Authentcation is not needed.
            return getUrl() + "/rest/version/" + (version?version:"latest") + url;
        } else {
            // Authentcation is needed for the rest request
            if(fcs.notification){
                return getUrl() + "/rest/version/" + (version?version:"latest") + (fcs.notification.isAnonymous() ? "/anonymous/" : "/user/" ) + fcs.getUser() + url;
            }
            else{
                return getUrl() + "/rest/version/" + (version?version:"latest") + "/user/" + fcs.getUser() + url;
            }
        }
    }


    function getSipwareUrl(){
        var url;
        if(fcsConfig.sipware){
            return fcsConfig.sipware + "/WebBroker/connections/";
        }
        return url;
    }

    function getAbsolutePath() {
        var loc = window.location, pathName = loc.pathname.substring(0, loc.pathname.lastIndexOf('/') + 1);
        return loc.href.substring(0, loc.href.length - ((loc.pathname + loc.search + loc.hash).length - pathName.length));
    }

var CookieStorage = function() {
    // Get an object that holds all cookies
    var cookies = (function() {
        var cookies = {},
            all = document.cookie,
            list,
            i = 0,
            cookie, firstEq, name, value;
        if (all === "") {
            return cookies;
        }            
        
        list = all.split("; "); // Split into individual name=value pairs
        
        for(; i < list.length; i += 1) {
            cookie = list[i];
            firstEq = cookie.indexOf("="); // Find the first = sign
            name = cookie.substring(0, firstEq); // Get cookie name
            value = cookie.substring(firstEq+1); // Get cookie value
            value = decodeURIComponent(value); // Decode the value
            
            cookies[name] = value;
        }
        return cookies;
    }()),
    
    // Collect the cookie names in an array
    keys = [],
    key;
    for(key in cookies) {
        if(cookies.hasOwnProperty(key)){
            keys.push(key);
        }
       
    }
    // Public API
    this.length = keys.length;

    
    // Return the name of the nth cookie, or null if n is out of range
    this.key = function(n) {
        if (n < 0 || n >= keys.length) {
            return null;
        }            
        
        return keys[n];
    };

    // Return the value of the named cookie, or null.
    this.getItem = function(name) {
        if (arguments.length !== 1) {
            throw new Error("Provide one argument");
        }
        
        return cookies[name] || null;
    };

    this.setItem = function(key, value) {
        if (arguments.length !== 2) {
           throw new Error("Provide two arguments");
        }
        
        if (cookies[key] === undefined) { // If no existing cookie with this name
            keys.push(key);
            this.length++;
        }
        
        cookies[key] = value;
        
        var cookie = key + "=" + encodeURIComponent(value),
        today = new Date(),
        expiry = new Date(today.getTime() + 30 * 24 * 3600 * 1000);    
        // Add cookie attributes to that string
        
        cookie += "; max-age=" + expiry;
        
        
        cookie += "; path=/";
                    
        // Set the cookie through the document.cookie property
        document.cookie = cookie;
    };
    
    // Remove the specified cookie
    this.removeItem = function(key) {
        if (arguments.length !== 1) {
            throw new Error("Provide one argument");
        }
        
        var i = 0, max;
        if (cookies[key] === undefined) { // If it doesn't exist, do nothing
            return;
        }
            
        // Delete the cookie from our internal set of cookies
        delete cookies[key];
        
        // And remove the key from the array of names, too.        
        for(max = keys.length; i < max; i += 1) {
            if (keys[i] === key) { // When we find the one we want
                keys.splice(i,1); // Remove it from the array.
                break;
            }
        }
        this.length--; // Decrement cookie length
        
        // Actually delete the cookie
        document.cookie = key + "=; max-age=0";
    };
    
    // Remove all cookies
    this.clear = function() {
        var i = 0;
        for(; i < keys.length; i++) {
            document.cookie = keys[i] + "=; max-age=0";
        }
        
        // Reset our internal state
        cookies = {};
        keys = [];
        this.length = 0;
    };
};

if (__testonly__) { __testonly__.CookieStorage = CookieStorage; }
var cache = (typeof window.localStorage !== 'undefined') ? window.localStorage : new CookieStorage();
window.cache = cache;
var Utils = function() {
    var logger = logManager.getLogger("utils");

    this.getProperty = function(obj, property) {
        return ((typeof obj[property]) === 'undefined') ? null : obj[property];
    };

    this.callFunctionIfExist = function() {
        var args = Array.prototype.slice.call(arguments), func;
        func = args.shift();
        if (typeof (func) === 'function') {
            try {
                func.apply(null, args);
                return true;
            }
            catch (e) {
                logger.error("Exception occured:\n" + e.stack);
                return undefined;
            }
        }
        else {
            logger.info("Not a function:" + func);
            return -1;
        }
    };

    this.s4 = function() {
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    };

    this.extend = function(target, object) {
        var prop;
        for (prop in object) {
            if (object.hasOwnProperty(prop)) {
                target[prop] = object[prop];
            }
        }
        return target;
    };

    this.compose = function(base, extendme) {
        var prop;
        for (prop in base) {
            if (typeof base[prop] === 'function' && !extendme[prop]) {
                extendme[prop] = base[prop].bind(base);
            }
        }
    };

    /**
     * Similar to jQuery.param
     */
    this.param = function(object) {
        var encodedString = '',
            prop;
        for (prop in object) {
            if (object.hasOwnProperty(prop)) {
                if (encodedString.length > 0) {
                    encodedString += '&';
                }
                encodedString += encodeURI(prop + '=' + object[prop]);
            }
        }
        return encodedString;
    };

    this.getTimestamp = function() {
        return new Date().getTime();
    };

    function getPropertyValueIfExistsInObject(object, key) {
        var objId, retVal;
        if (object) {
            for (objId in object) {
                if (object.hasOwnProperty(objId)) {
                    if (objId === key) {
                        retVal = object[objId];
                    }
                    else if (typeof object[objId] === "object") {
                        retVal = getPropertyValueIfExistsInObject(object[objId], key);
                    }
                    if (retVal) {
                        break;
                    }
                }
            }
            return retVal;
        }
    }

    this.getPropertyValueIfExistsInObject = getPropertyValueIfExistsInObject;

    this.Queue = function() {

        var items;

        this.enqueue = function(item) {
            if (typeof(items) === 'undefined') {
                items = [];
            }
            items.push(item);
        };

        this.dequeue = function() {
            return items.shift();
        };

        this.peek = function() {
            return items[0];
        };

        this.size = function() {
            return typeof(items)==='undefined' ? 0 : items.length;
        };
    };

    this.getQueue = function(){
        return new this.Queue();
    };

    this.Map = function() {
        var items = {}, length = 0;

        this.size = function() {
            return length;
        };

        this.add = function(key, value) {
            length++;
            items[key] = value;
            return this;
        };

        this.get = function(key) {
            return items[key];
        };

        this.remove = function(key) {
            length--;
            return delete items[key];
        };

        this.clear = function() {
            var variableKey;
            for (variableKey in items) {
                if (items.hasOwnProperty(variableKey)) {
                    if (delete items[variableKey]){
                        length--;
                    }
                }
            }
        };
        
        this.entries = function() {
            return items;
        };
    };
};
var utils = new Utils();

/*
 * Function.prototype.bind function not supported in phantom.js (used for unit test specs),
 * this fix, provides support for this function.
 * 
 * TODO: This function should be checked in new release of phantom.js and 
 * should be removed if not necessary anymore
 */
if (!Function.prototype.bind) {
  Function.prototype.bind = function(oThis) {
    if (typeof this !== 'function') {
      // closest thing possible to the ECMAScript 5
      // internal IsCallable function
      throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
    }

    var aArgs   = Array.prototype.slice.call(arguments, 1),
        fToBind = this,
        FNOP    = function() {},
        FBound  = function() {
          return fToBind.apply(this instanceof FNOP && oThis
                 ? this
                 : oThis,
                 aArgs.concat(Array.prototype.slice.call(arguments)));
        };

    FNOP.prototype = this.prototype;
    FBound.prototype = new FNOP();

    return FBound;
  };
}

if (__testonly__) { __testonly__.UtilsQueue = utils.Queue;} 

var SDPParserImpl = function(_logManager) {
    var logger = _logManager.getLogger("sdpParser"),
            self, mediaDescriptions, sessionDescription,
            nl = "\n", lf = "\r";

    this.init = function(sdpData) {
        self = this;
        self.sessionDescription = {};
        self.mediaDescriptions = [];
        self.sdp = sdpData;
        self.parseSDP();
        self.setSessionDescriptionAttributes();
        self.setMediaDescriptionsAttributes();
    };


    this.parseSDP = function() { 
        var descriptions = [], index = 1, mediaDescription;
        descriptions = self.sdp.split(/^(?=m=)/m);
        self.sessionDescription.data = descriptions[0];
        for (index; index < descriptions.length; index++) {
            mediaDescription = {};
            mediaDescription.data = descriptions[index];
            self.mediaDescriptions.push(mediaDescription);
        }
    };

    this.setSessionDescriptionAttributes = function() {
        var line = 0, sessionDescriptions = self.sessionDescription.data.split(/\r\n|\r|\n/), connectionData;

        for (line; line < sessionDescriptions.length; line++) {
            if ((sessionDescriptions[line].match("^e="))) {
                self.sessionDescription.email = sessionDescriptions[line].split('=')[1];
            }
            else if ((sessionDescriptions[line].match("^c="))) {
                connectionData = sessionDescriptions[line].split('=')[1];
                self.sessionDescription.connection = connectionData;
                self.sessionDescription.ip = connectionData.split(' ')[2];
            }
        }
    };

    this.setMediaDescriptionsAttributes = function() {
        var line = 0, mediaDescriptionIndex, mediaDescriptionAttributes, mediaData, connectionData;

        for (mediaDescriptionIndex in self.mediaDescriptions) {
            if (self.mediaDescriptions.hasOwnProperty(mediaDescriptionIndex)) {
                mediaDescriptionAttributes = self.mediaDescriptions[mediaDescriptionIndex].data.split(/\r\n|\r|\n/);
                this.mediaDescriptions[mediaDescriptionIndex].direction = "sendrecv";
                for (line in mediaDescriptionAttributes) {
                    if (mediaDescriptionAttributes.hasOwnProperty(line)) {
                        //direction default sendrcv setle
                        if ((mediaDescriptionAttributes[line].match("^m="))) {
                            mediaData = mediaDescriptionAttributes[line].split('=')[1];
                            self.mediaDescriptions[mediaDescriptionIndex].media = mediaData;
                            self.mediaDescriptions[mediaDescriptionIndex].port = mediaData.split(' ')[1];
                        }
                        else if ((mediaDescriptionAttributes[line].match("^a=sendrecv")) || (mediaDescriptionAttributes[line].match("^a=sendonly")) || (mediaDescriptionAttributes[line].match("^a=recvonly")) || (mediaDescriptionAttributes[line].match("^a=inactive"))) {
                            self.mediaDescriptions[mediaDescriptionIndex].direction = mediaDescriptionAttributes[line].split('=')[1];
                        }
                        else if ((mediaDescriptionAttributes[line].match("^c="))) {
                            connectionData = mediaDescriptionAttributes[line].split('=')[1];
                            self.mediaDescriptions[mediaDescriptionIndex].connection = connectionData;
                            self.mediaDescriptions[mediaDescriptionIndex].ip = connectionData.split(' ')[2];
                        }
                    }
                }
            }
        }

    };

    this.isHold = function(isRemote) {
        var isHold = false, ip, media_index = 0, mediaDesc, direction;
        for (media_index in self.mediaDescriptions) {
            if (self.mediaDescriptions.hasOwnProperty(media_index)) {
                mediaDesc = this.mediaDescriptions[media_index];
                if (mediaDesc.ip) {
                    ip = mediaDesc.ip;
                }
                else {
                    if (self.sessionDescription.ip) {
                        ip = self.sessionDescription.ip;
                    }
                }

                if (mediaDesc.port !== 0) {
                    if ((mediaDesc.direction === "inactive") || 
                        ( (mediaDesc.direction === "sendonly") && isRemote) || 
                        ( (mediaDesc.direction === "recvonly") && !isRemote) || 
                        (ip === "0.0.0.0") ) {
                        isHold = true;
                    }
                    else {
                        isHold = false;
                        break;
                    }
                }
            }
        }
        return isHold;
    };

    this.isRemoteHold = function() {
        return this.isHold(true);
    };
    
    this.isLocalHold = function() {
        return this.isHold(false);
    };
    
    this.getSessionDescription = function() {
        return self.sessionDescription;
    };

    this.getMediaDescriptions = function() {
        return self.mediaDescriptions;
    };

    this.isSdpHas = function(pSdp, type) {
        var result = false;

        if (!pSdp) {
            return result;
        }

        if (pSdp.indexOf(CONSTANTS.SDP.M_LINE + type) !== -1) {
            result = true;
            return result;
        }

        return result;
    };

    this.isSdpHasAudio = function(pSdp) {
        return this.isSdpHas(pSdp, CONSTANTS.STRING.AUDIO);
    };

    this.isSdpHasVideo = function(pSdp) {
        return this.isSdpHas(pSdp, CONSTANTS.STRING.VIDEO);
    };
    
    this.isSdpHasUfrag = function(pSdp) {
        var result = false;

        if (!pSdp) {
            return result;
        }

        if (pSdp.indexOf(CONSTANTS.SDP.A_LINE + CONSTANTS.SDP.ICE_UFRAG) !== -1) {
            result = true;
            return result;
        }

        return result;
    };

    this.isSdpHasMediaWithExpectedPort = function(pSdp, type, port) {
        return pSdp.indexOf(CONSTANTS.SDP.M_LINE + type + " " + port) !== -1;
    };

    this.isSdpHasAudioWithZeroPort = function(pSdp) {
        return this.isSdpHasMediaWithExpectedPort(pSdp, CONSTANTS.STRING.AUDIO, 0);
    };

    this.isSdpHasVideoWithZeroPort = function(pSdp) {
        return this.isSdpHasMediaWithExpectedPort(pSdp, CONSTANTS.STRING.VIDEO, 0);
    };

    this.isSdpHasAudioWithOnePort = function(pSdp) {
        return this.isSdpHasMediaWithExpectedPort(pSdp, CONSTANTS.STRING.AUDIO, 1);
    };

    this.isSdpHasVideoWithOnePort = function(pSdp) {
        return this.isSdpHasMediaWithExpectedPort(pSdp, CONSTANTS.STRING.VIDEO, 1);
    };

    this.isSdpHasAudioWithNinePort = function(pSdp) {
        return this.isSdpHasMediaWithExpectedPort(pSdp, CONSTANTS.STRING.AUDIO, 9);
    };

    this.isSdpHasVideoWithNinePort = function(pSdp) {
        return this.isSdpHasMediaWithExpectedPort(pSdp, CONSTANTS.STRING.VIDEO, 9);
    };

    this.replaceZeroVideoPortWithOne = function(pSdp) {
        if (this.isSdpHasVideoWithZeroPort(pSdp)) {
            pSdp = pSdp.replace(CONSTANTS.SDP.M_LINE + CONSTANTS.STRING.VIDEO + " 0 ", CONSTANTS.SDP.M_LINE + CONSTANTS.STRING.VIDEO + " 1 ");
        }
        return pSdp;
    };

    this.getSdpDirection = function(pSdp, type) {
        var substr = "", descriptions = [], index,
                direction = CONSTANTS.WEBRTC.MEDIA_STATE.INACTIVE, logmsg;

        logmsg = function(state) {
            logger.info("getSdpDirection: type= " + type + " state= " + state);
        };

        if (!this.isSdpHas(pSdp, type)) {
            logmsg(direction);
            return direction;
        }

        if (this.isSdpHasMediaWithExpectedPort(pSdp, type, 0)) {
            // return if media port is 0
            logmsg(direction);
            return direction;
        }

        descriptions = pSdp.split(/^(?=m=)/m);
        for (index = 0; index < descriptions.length; index++) {
            substr = descriptions[index];
            if (substr.indexOf(CONSTANTS.SDP.M_LINE + type) !== -1) {
                if (substr.indexOf(CONSTANTS.SDP.A_LINE + CONSTANTS.WEBRTC.MEDIA_STATE.SEND_RECEIVE) !== -1) {
                    direction = CONSTANTS.WEBRTC.MEDIA_STATE.SEND_RECEIVE;
                    logmsg(direction);
                    return direction;
                } else if (substr.indexOf(CONSTANTS.SDP.A_LINE + CONSTANTS.WEBRTC.MEDIA_STATE.SEND_ONLY) !== -1) {
                    direction = CONSTANTS.WEBRTC.MEDIA_STATE.SEND_ONLY;
                    logmsg(direction);
                    return direction;
                } else if (substr.indexOf(CONSTANTS.SDP.A_LINE + CONSTANTS.WEBRTC.MEDIA_STATE.RECEIVE_ONLY) !== -1) {
                    direction = CONSTANTS.WEBRTC.MEDIA_STATE.RECEIVE_ONLY;
                    logmsg(direction);
                    return direction;
                } else if (substr.indexOf(CONSTANTS.SDP.A_LINE + CONSTANTS.WEBRTC.MEDIA_STATE.INACTIVE) !== -1) {
                    logmsg(direction);
                    return direction;
                }
                direction = CONSTANTS.WEBRTC.MEDIA_STATE.SEND_RECEIVE;
                return direction;
            }
        }
        direction = CONSTANTS.WEBRTC.MEDIA_STATE.NOT_FOUND;
        logmsg(direction);
        return direction;
    };

    this.getAudioSdpDirection = function(pSdp) {
        return this.getSdpDirection(pSdp, CONSTANTS.STRING.AUDIO);
    };

    this.getVideoSdpDirection = function(pSdp) {
        return this.getSdpDirection(pSdp, CONSTANTS.STRING.VIDEO);
    };

    this.isAudioSdpDirectionInactive = function(pSdp) {
        return this.getAudioSdpDirection(pSdp) === CONSTANTS.WEBRTC.MEDIA_STATE.INACTIVE;
    };

    this.isAudioSdpDirectionSendrecv = function(pSdp) {
        return this.getAudioSdpDirection(pSdp) === CONSTANTS.WEBRTC.MEDIA_STATE.SEND_RECEIVE;
    };

    this.isAudioSdpDirectionSendonly = function(pSdp) {
        return this.getAudioSdpDirection(pSdp) === CONSTANTS.WEBRTC.MEDIA_STATE.SEND_ONLY;
    };

    this.isAudioSdpDirectionRecvonly = function(pSdp) {
        return this.getAudioSdpDirection(pSdp) === CONSTANTS.WEBRTC.MEDIA_STATE.RECEIVE_ONLY;
    };

    this.isSdpContainsAudioDirection = function(pSdp) {
        return this.getAudioSdpDirection(pSdp) !== CONSTANTS.WEBRTC.MEDIA_STATE.NOT_FOUND;
    };

    this.isVideoSdpDirectionInactive = function(pSdp) {
        return this.getVideoSdpDirection(pSdp) === CONSTANTS.WEBRTC.MEDIA_STATE.INACTIVE;
    };

    this.isVideoSdpDirectionSendrecv = function(pSdp) {
        return this.getVideoSdpDirection(pSdp) === CONSTANTS.WEBRTC.MEDIA_STATE.SEND_RECEIVE;
    };

    this.isVideoSdpDirectionSendonly = function(pSdp) {
        return this.getVideoSdpDirection(pSdp) === CONSTANTS.WEBRTC.MEDIA_STATE.SEND_ONLY;
    };

    this.isVideoSdpDirectionRecvonly = function(pSdp) {
        return this.getVideoSdpDirection(pSdp) === CONSTANTS.WEBRTC.MEDIA_STATE.RECEIVE_ONLY;
    };

    this.isSdpContainsVideoDirection = function(pSdp) {
        return this.getVideoSdpDirection(pSdp) !== CONSTANTS.WEBRTC.MEDIA_STATE.NOT_FOUND;
    };

    this.changeDirection = function(pSdp, directionBefore, directionAfter, type) {
        var sdp = "", substr, descriptions = [], index,
                msg = "changeDirection: before= " + directionBefore + " after= " + directionAfter;

        if (directionBefore === directionAfter) {
            //no need to change direction
            return pSdp;
        }

        if (type === undefined || type === null) {
            logger.info(msg + " for all media types");
        } else if (directionBefore !== this.getSdpDirection(pSdp, type)) {
            //Ignore changing the direction if the "directionBefore" and existing directions do not match
            return pSdp;
        } else {
            logger.info(msg + " type= " + type);
        }

        descriptions = pSdp.split(/^(?=m=)/m);
        for (index = 0; index < descriptions.length; index++) {
            substr = descriptions[index];
            if (type === undefined || type === null || substr.indexOf(CONSTANTS.SDP.M_LINE + type) !== -1) {
                substr = substr.replace(CONSTANTS.SDP.A_LINE + directionBefore, CONSTANTS.SDP.A_LINE + directionAfter);
            }
            sdp = sdp + substr;
        }

        return sdp;
    };

    this.updateSdpDirection = function(pSdp, type, direction) {
        logger.info("updateSdpDirection: type= " + type + " direction= " + direction);
        var beforeDirection = this.getSdpDirection(pSdp, type);
        return this.changeDirection(pSdp, beforeDirection, direction, type);
    };

    this.updateAudioSdpDirection = function(pSdp, direction) {
        logger.info("updateSdpDirection: type= " + CONSTANTS.STRING.AUDIO + " direction= " + direction);
        var beforeDirection = this.getSdpDirection(pSdp, CONSTANTS.STRING.AUDIO);
        return this.changeDirection(pSdp, beforeDirection, direction, CONSTANTS.STRING.AUDIO);
    };

    this.updateVideoSdpDirection = function(pSdp, direction) {
        logger.info("updateSdpDirection: type= " + CONSTANTS.STRING.VIDEO + " direction= " + direction);
        var beforeDirection = this.getSdpDirection(pSdp, CONSTANTS.STRING.VIDEO);
        return this.changeDirection(pSdp, beforeDirection, direction, CONSTANTS.STRING.VIDEO);
    };

    this.updateAudioSdpDirectionToInactive = function(pSdp) {
        return this.updateAudioSdpDirection(pSdp, CONSTANTS.WEBRTC.MEDIA_STATE.INACTIVE);
    };

    this.updateVideoSdpDirectionToInactive = function(pSdp) {
        return this.updateVideoSdpDirection(pSdp, CONSTANTS.WEBRTC.MEDIA_STATE.INACTIVE);
    };

    this.isSdpHasDirection = function(pSdp) {
        var sr_indx, so_indx, ro_indx, in_indx;
        sr_indx = pSdp.indexOf(CONSTANTS.SDP.A_LINE + CONSTANTS.WEBRTC.MEDIA_STATE.SEND_RECEIVE, 0);
        so_indx = pSdp.indexOf(CONSTANTS.SDP.A_LINE + CONSTANTS.WEBRTC.MEDIA_STATE.SEND_ONLY, 0);
        ro_indx = pSdp.indexOf(CONSTANTS.SDP.A_LINE + CONSTANTS.WEBRTC.MEDIA_STATE.RECEIVE_ONLY, 0);
        in_indx = pSdp.indexOf(CONSTANTS.SDP.A_LINE + CONSTANTS.WEBRTC.MEDIA_STATE.INACTIVE, 0);
        return (sr_indx + 1) + (so_indx + 1) + (ro_indx + 1) + (in_indx + 1) === 0 ? false : true;
    };

    this.isSdpEnabled = function(pSdp, type) {
        var direction, msg = "isSdpEnabled for type " + type + ": ", result = false;

        if (this.isSdpHasMediaWithExpectedPort(pSdp, type, 0)) {
            // return if media port is 0
            logger.info(msg + result);
            return result;
        }
        if (type === CONSTANTS.STRING.VIDEO) {
            direction = this.getVideoSdpDirection(pSdp);
            if (direction === CONSTANTS.WEBRTC.MEDIA_STATE.RECEIVE_ONLY || direction === CONSTANTS.WEBRTC.MEDIA_STATE.INACTIVE) {
                logger.info(msg + result);
                return result;
            }
        }
        if (this.isSdpHas(pSdp, type)) {
            result = true;
        }
        logger.info(msg + result);
        return result;
    };

    this.isAudioSdpEnabled = function(pSdp) {
        return this.isSdpEnabled(pSdp, CONSTANTS.STRING.AUDIO);
    };

    this.isVideoSdpEnabled = function(pSdp) {
        return this.isSdpEnabled(pSdp, CONSTANTS.STRING.VIDEO);
    };

    this.isSdpVideoReceiveEnabled = function(pSdp) {
        var direction, msg = "isSdpVideoReceiveEnabled: ", result = false;

        if (pSdp.indexOf(CONSTANTS.SDP.M_LINE + CONSTANTS.STRING.VIDEO + " 0") !== -1) {
            logger.info(msg + result);
            return result;
        }

        direction = this.getVideoSdpDirection(pSdp);
        if (direction === CONSTANTS.WEBRTC.MEDIA_STATE.SEND_ONLY || direction === CONSTANTS.WEBRTC.MEDIA_STATE.INACTIVE) {
            logger.info(msg + result);
            return result;
        }

        if (pSdp.indexOf(CONSTANTS.SDP.M_LINE + CONSTANTS.STRING.VIDEO) !== -1) {
            result = true;
            logger.info(msg + result);
            return result;
        }

        logger.info(msg + result);
        return result;
    };

    this.updateH264Level = function(pSdp) {
        var sdp = "", substr = "", descriptions = [], index, reg = /\r\n|\r|\n/m, video_arr, i, new_substr = "", elm, elm_array;

        descriptions = pSdp.split(/^(?=m=)/m);
        for (index = 0; index < descriptions.length; index++) {
            substr = descriptions[index];
            if (substr.indexOf(CONSTANTS.SDP.M_LINE + CONSTANTS.STRING.VIDEO) !== -1) {
                video_arr = substr.split(reg);
                for (i = 0; i < video_arr.length; i++) {
                    elm = video_arr[i];
                    if (elm && elm.indexOf("a=rtpmap:") !== -1 && elm.indexOf("H264") !== -1) {
                        elm_array = elm.split(/\:| /m);
                        elm = elm + CONSTANTS.STRING.CARRIAGE_RETURN + CONSTANTS.STRING.NEW_LINE;
                        elm = elm + "a=fmtp:" + elm_array[1] + " profile-level-id=428014;";
                        elm = elm + CONSTANTS.STRING.CARRIAGE_RETURN + CONSTANTS.STRING.NEW_LINE;
                        // Workaround for issue 1603.
                    } else if (elm && elm !== "") {
                        elm = elm + CONSTANTS.STRING.CARRIAGE_RETURN + CONSTANTS.STRING.NEW_LINE;
                    }
                    new_substr = new_substr + elm;
                }
                substr = new_substr;
            }
            sdp = sdp + substr;
        }
        return sdp;
    };
    /*
     * Firefox only accepts 42E0xx and above profile-id-level. 
     * In order not to get setRemoteDescription failure we fix the H264 level
     * This snippet changes all H264 levels with 4280xx to 42E0xx
     */
    this.updateH264LevelTo42E01F = function(pSdp, isH264Enabled) {
        if (isH264Enabled) {
            logger.debug('Updating the H264 profile-level-id to 42e01f');
            pSdp = pSdp.replace(/profile-level-id=4280/g, 'profile-level-id=42e0');
        }
        return pSdp;
    };

    this.isSdpVideoCandidateEnabled = function(pSdp) {
        var msg = "isSdpVideoCandidateEnabled: ", result = false;

        if (this.isSdpHasVideoWithZeroPort(pSdp)) {
            logger.info(msg + result);
            return result;
        } else if (this.isVideoSdpDirectionInactive(pSdp)) {
            logger.info(msg + result);
            return result;
        } else if (!this.isSdpHasVideo(pSdp)) {
            result = true;
            logger.info(msg + result);
            return true;
        }

        logger.info(msg + result);
        return result;
    };

    this.deleteFingerprintFromSdp = function(sdp, isDtlsEnabled) {
        if (isDtlsEnabled) {
            return sdp;
        }
        while (sdp.indexOf("a=fingerprint:") !== -1) {
            sdp = sdp.replace(/(a=fingerprint:[\w\W]*?(:\r|\n))/, "");
        }
        while (sdp.indexOf("a=setup:") !== -1) {
            sdp = sdp.replace(/(a=setup:[\w\W]*?(:\r|\n))/, "");
        }
        return sdp;
    };

    this.deleteCryptoFromSdp = function(sdp, isDtlsEnabled) {
        if (!isDtlsEnabled) {
            return sdp;
        }
        while (sdp.indexOf("a=crypto:") !== -1) {
            sdp = sdp.replace(/(a=crypto:[\w\W]*?(:\r|\n))/, "");
        }
        return sdp;
    };

    this.deleteCryptoZeroFromSdp = function(sdp) {
        while (sdp.indexOf("a=crypto:0") !== -1) {
            sdp = sdp.replace(/(a=crypto:0[\w\W]*?(:\r|\n))/, "");
        }
        return sdp;
    };

    /*
     * updateAudioCodec: removes codecs listed in config file from codec list. Required for DTMF until the bug is fixed.
     * @param {type} pSdp
     */
    this.updateAudioCodec = function(pSdp) {
        var sdp = "", substr = "", descriptions = [], index, reg = /\r\n|\r|\n/m, audio_arr, i, new_substr = "", elm,
                remcodec, regExpCodec, codecsToRemove = [], j, remrtpmap;

        remrtpmap = "";
        descriptions = pSdp.split(/^(?=m=)/m);
        for (index = 0; index < descriptions.length; index++) {
            substr = descriptions[index];
            if (this.isSdpHasAudio(substr)) {
                audio_arr = substr.split(reg);
                for (i = 0; i < audio_arr.length; i++) {
                    elm = audio_arr[i];
                    if (elm && this.isSdpHasAudio(elm)) {
                        // remove audio codecs given in config file from m=audio line
                        codecsToRemove = fcsConfig.codecsToRemove;
                        if (codecsToRemove !== undefined) {
                            for (j = 0; j < codecsToRemove.length; j++) {
                                remcodec = codecsToRemove[j];
                                regExpCodec = new RegExp(" " + remcodec, "g");
                                elm = elm.replace(regExpCodec, "");

                                if (j !== 0) {
                                    remrtpmap = remrtpmap + "|";
                                }
                                remrtpmap = remrtpmap + remcodec;
                            }
                        }
                        elm = elm + lf + nl;
                        // Workaround for issue 1603.
                    } else if (elm && elm.indexOf("a=fmtp") !== -1) {
                        elm = elm.replace(/a=fmtp[\w\W]*/, "");
                    } else if (elm && elm !== "") {
                        elm = elm + lf + nl;
                    }
                    new_substr = new_substr + elm;
                }
                substr = new_substr;
            }
            sdp = sdp + substr;
        }
        // remove rtpmap of removed codecs
        if (remrtpmap !== "") {
            regExpCodec = new RegExp("a=rtpmap:(?:" + remrtpmap + ").*\r\n", "g");
            sdp = sdp.replace(regExpCodec, "");
        }
        return sdp;
    };
    
    /*
     * removeAudioCodec: removes given codec type from sdp.
     * @param {type} pSdp
     * @param {type} codecToRemove
     */
    this.removeAudioCodec = function(pSdp, codecToRemove) {
        var sdp = "", substr = "", descriptions = [], index, reg = /\r\n|\r|\n/m, audio_arr, i, 
            new_substr = "", elm, elm2, regExpCodec;

        descriptions = pSdp.split(/^(?=m=)/m);
        for (index = 0; index < descriptions.length; index++) {
            substr = descriptions[index];
            if (this.isSdpHasAudio(substr)) {
                audio_arr = substr.split(reg);
                for (i = 0; i < audio_arr.length; i++) {
                    elm = audio_arr[i];
                    if (elm && this.isSdpHasAudio(elm)) {
                        // remove given audio codec from m=audio line
                        regExpCodec = new RegExp(" " + codecToRemove + "($| )", "m");
                        elm2 = audio_arr[i].split(/RTP[\w\W]*/);
                        elm = elm.replace(/(\m=audio+)\s(\w+)/, "");
                        elm = elm.trim();
                        elm = elm.replace(regExpCodec, " ");
                        elm = elm2[0] +elm + lf + nl;
                        // Workaround for issue 1603.
                    } else if (elm && elm.indexOf("a=fmtp:" + codecToRemove) !== -1) {
                        elm = elm.replace(/a=fmtp[\w\W]*/, "");
                    } else if (elm && elm.indexOf("a=rtpmap:" + codecToRemove) !== -1) {
                        elm = elm.replace(/a=rtpmap[\w\W]*/, "");
                    } else if (elm && elm.indexOf("a=rtcp-fb:" + codecToRemove) !== -1) {
                        elm = elm.replace(/a=rtcp-fb[\w\W]*/, "");
                    } else if (elm && elm !== "") {
                        elm = elm + lf + nl;
                    }
                    new_substr = new_substr + elm;
                }
                substr = new_substr;
            }
            sdp = sdp + substr;
        }
        return sdp;
    };
    
    /*
     * removeRTXCodec: this function will remove rtx video codec
     */
    this.removeRTXCodec = function(pSdp) {
        var rtxPayloadType,vp8SSRC, rtxSSRC;

        vp8SSRC = this.getVp8Ssrc(pSdp);
        logger.debug("vp8SSRC = " + vp8SSRC);

        rtxSSRC = this.getRtxSsrc(pSdp);
        logger.debug("rtxSSRC = " + rtxSSRC);

        pSdp = this.removeSsrcId(pSdp,rtxSSRC);

        pSdp = pSdp.replace(/(a=ssrc-group:FID[\w\W]*?(:\r|\n))/g, "");

        if(pSdp.indexOf("rtx/90000") === -1) {
            return pSdp;
        }

        rtxPayloadType = this.getRTXPayloadType(pSdp);
        
        logger.debug("removeRTXCodec : Removing rtx video codec " + rtxPayloadType);
        pSdp = this.removeVideoCodec(pSdp, rtxPayloadType);

        return pSdp;
    };

    this.getVp8Ssrc = function(pSdp) {
        var splitArray, ssrcGroupArray, ssrcArray, i, reg = /\r\n|\r|\n/m;

        if (pSdp.indexOf("a=ssrc-group:FID ") === -1) {
            return -1;
        }

        splitArray = pSdp.split("a=ssrc-group:FID ");
        ssrcGroupArray = splitArray[1].split(reg);
        ssrcArray = ssrcGroupArray[0].split(" ");

        for (i = 0; i < ssrcArray.length; i++) {
            logger.debug("ssrcArray[" + i + "] : " + ssrcArray[i]);
        }

        return ssrcArray[0];
    };

    this.getRtxSsrc = function(pSdp) {
        var splitArray, ssrcGroupArray, ssrcArray, i, reg = /\r\n|\r|\n/m;

        if (pSdp.indexOf("a=ssrc-group:FID ") === -1) {
            return -1;
        }

        splitArray = pSdp.split("a=ssrc-group:FID ");
        ssrcGroupArray = splitArray[1].split(reg);
        ssrcArray = ssrcGroupArray[0].split(" ");

        for (i = 0; i < ssrcArray.length; i++) {
            logger.debug("ssrcArray[" + i + "] : " + ssrcArray[i]);
        }

        return ssrcArray[1];
    };

    /*
     * removeSsrcId: removes given SSRC ID from sdp.
     */
    this.removeSsrcId = function(pSdp, ssrcId) {
        var sdp = "", reg = /\r\n|\r|\n/m, ssrc_arr, i, new_substr = "", elm;

        ssrc_arr = pSdp.split(reg);
        for (i = 0; i < ssrc_arr.length; i++) {
            elm = ssrc_arr[i];
            if (elm && elm.indexOf("a=ssrc:" + ssrcId) !== -1) {
                elm = elm.replace(/a=ssrc:[\w\W]*/, "");
            } else if (elm && elm !== "") {
                elm = elm + lf + nl;
            }
            new_substr = new_substr + elm;
        }
        sdp = new_substr;

        return sdp;
    };

    /*
     * removeG722Codec: this function will remove G722 audio codec
     * @param {type} pSdp
     */
    this.removeG722Codec = function(pSdp) {
        /* 
        *   this function is added because of chrome-v39 bug.
        *   need to be checked with chrome-v40.
        *   should be deleted if not needed.
        */
       /* var g722PayloadType;

        if ((pSdp.indexOf("G722/8000") === -1) && (pSdp.indexOf("G722/16000") === -1)) {
            return pSdp;
        }

        g722PayloadType = this.getG7228000PayloadType(pSdp);

        if (g722PayloadType !== -1) {
            logger.debug("removeG722Codec : Removing G722/8000 video codec " + g722PayloadType);
            pSdp = this.removeAudioCodec(pSdp, g722PayloadType);
        }
        g722PayloadType = this.getG72216000PayloadType(pSdp);
        if (g722PayloadType !== -1) {
            logger.debug("removeG722Codec : Removing G722/16000 video codec " + g722PayloadType);
            pSdp = this.removeAudioCodec(pSdp, g722PayloadType);
        }
        */
        return pSdp;
    };
    

    this.fixLocalTelephoneEventPayloadType = function(call, pSdp) {
        var newSdp;

        call.localTelephoneEvent8000PayloadType = this.getTelephoneEventCode(pSdp, "8000", call.localTelephoneEvent8000PayloadType);
        call.localTelephoneEvent16000PayloadType = this.getTelephoneEventCode(pSdp, "16000", call.localTelephoneEvent16000PayloadType);

        newSdp = this.fixTelephoneEventPayloadType(pSdp, "8000", call.localTelephoneEvent8000PayloadType);
        newSdp = this.fixTelephoneEventPayloadType(newSdp, "16000", call.localTelephoneEvent16000PayloadType);

        return newSdp;
    };

    this.fixRemoteTelephoneEventPayloadType = function(call, pSdp) {
        var newSdp;

        call.remoteTelephoneEvent8000PayloadType = this.getTelephoneEventCode(pSdp, "8000", call.remoteTelephoneEvent8000PayloadType);
        call.remoteTelephoneEvent16000PayloadType = this.getTelephoneEventCode(pSdp, "16000", call.remoteTelephoneEvent16000PayloadType);

        newSdp = this.fixTelephoneEventPayloadType(pSdp, "8000", call.remoteTelephoneEvent8000PayloadType);
        newSdp = this.fixTelephoneEventPayloadType(newSdp, "16000", call.remoteTelephoneEvent16000PayloadType);

        return newSdp;
    };

    this.getTelephoneEventCode = function(pSdp, rate, oldCode) {
        var telephoneEventPayloadType;
            
        if(this.isSdpHasTelephoneEventWithRate(pSdp, rate)) {
            telephoneEventPayloadType = this.getTelephoneEventPayloadType(pSdp,rate);
            if (!oldCode) {
                return telephoneEventPayloadType;
            } else {
                return oldCode;
            }
        }
        
        return null;
    };
    
    /*
     * Replaces telephone event code in pSdp with the oldCode 
     * This is needed for WebRTC engine compatibility
     * Ex: Negotitation is firstly done with 126, but then the call server sends an offer with 96
     * @param {type} pSdp
     * @param {type} rate
     * @param {type} oldCode
     */
    this.fixTelephoneEventPayloadType = function(pSdp, rate, oldCode) {
        var telephoneEventPayloadType, newSdp;
            
        if(this.isSdpHasTelephoneEventWithRate(pSdp, rate)) {
            telephoneEventPayloadType = this.getTelephoneEventPayloadType(pSdp,rate);
            if (!oldCode) {
                oldCode = telephoneEventPayloadType;
            } else if (oldCode !== telephoneEventPayloadType) {
                newSdp = this.replaceTelephoneEventPayloadType(pSdp, oldCode, telephoneEventPayloadType);
                return newSdp;
            }
        }
        
        return pSdp;
    };

    this.getTelephoneEventPayloadType = function(pSdp,rate) {
        return this.getPayloadTypeOf("telephone-event/" + rate,pSdp);
    };
    
    this.getPayloadTypeOf = function(codecString,pSdp) {
        var rtpMapNumber, rtpMapArray, payloadTypeArray = [], index;
        
        if(pSdp.indexOf(codecString) === -1) {
            return -1;            
        }
        rtpMapArray = pSdp.match(/(a=rtpmap[\w\W]*?(:\r|\n))/g);
        for (index = 0; index < rtpMapArray.length; index++) {
            if (rtpMapArray[index].search(new RegExp(codecString, 'i')) !== -1) {
                /*jslint regexp: false*/
                rtpMapNumber = rtpMapArray[index].match(/^[^\d]*(\d+)/g);
                rtpMapNumber = rtpMapNumber[0].split(':');
                payloadTypeArray.push(rtpMapNumber[1]);
                /*jslint regexp: true*/
            }
        }
        
        logger.debug("getPayloadTypeOf(" + codecString + ") = " + payloadTypeArray[0]);
        
        if (payloadTypeArray.length < 2) {
            // if codec has just one match, then returns it as String for compatibility of old methods
            return payloadTypeArray[0];
        } else {
            return payloadTypeArray;
        }
    };
    
    /*
     * Replaces new telephone event code in pSdp with the oldCode 
     * This is needed for WebRTC engine compatibility
     * If an offer has a different telephone event code than what is already negotiated in that session, webrtc engine gives error
     * Ex: Negotitation is firstly done with 126, but then the call server sends an offer with 96
     * @param {type} pSdp
     * @param {type} oldCode
     * @param {type} newCode
     */
    this.replaceTelephoneEventPayloadType = function(pSdp, oldCode, newCode) {
        var finalsdp, regex, matches, tempAudioLine, descriptions, index, substr, partialsdp = "", number = "";        

        if (!pSdp || (pSdp.indexOf("telephone-event") === -1)) {
            return pSdp;
        }

        regex = /^\.*(a=rtpmap:)(\d*)( telephone-event[ \w+ ]*[ \/+ ]*[ \w+ ]*)\r\n?/m;
        
        /* example: matches= ["a=rtpmap:96 telephone-event/8000\r\n", "a=rtpmap:", "96", " telephone-event/8000"] */
        
        if (oldCode === newCode) { // telephone event has not changed
            // nothing has changed, return without any changes
            return pSdp;
        }
        
        // telephone event has changed
        finalsdp = pSdp;
        
        // replace rtpmap
        regex = new RegExp("^\\.*a=rtpmap:" + newCode + " telephone-event[ \\/+ ]*([ \\w+ ]*)\\r\n", "m");
        matches = finalsdp.match(regex);
        if (matches !== null && matches.length >= 2 && matches[1] !== "") {
            number = matches[1];
        } else {
            number = 8000;
        }
        finalsdp = finalsdp.replace(regex,'a=rtpmap:' + oldCode + ' telephone-event/' + number + '\r\n');
        
        // replace audio line
        regex = new RegExp("^\\.*(m=audio )[ \\w+ ]*[ \\/+ ]*[ \\w+ ]*( " + newCode + ")", "mg");
        matches = finalsdp.match(regex);
        
        if (matches !== null && matches.length >= 1 && matches[0] !== "") {
            tempAudioLine = matches[0];
            tempAudioLine = tempAudioLine.replace(newCode, oldCode);
            finalsdp = finalsdp.replace(regex, tempAudioLine);
        }
           
        // replace fmtp
        // only audio section needs to be considered, do not change video section
        descriptions = finalsdp.split(/^(?=m=)/m);
        for (index = 0; index < descriptions.length; index++) {
            substr = descriptions[index];
            if (this.isSdpHasAudio(substr)) {
                regex = new RegExp("^\\.*a=fmtp:" + newCode, "mg");
                substr = substr.replace(regex, 'a=fmtp:' + oldCode);
            }
            partialsdp = partialsdp + substr;
        }
        if (partialsdp !== "") {
            finalsdp = partialsdp;  
        }
        logger.debug("replaceTelephoneEventPayloadType: newcode " + newCode + " is replaced with oldcode " + oldCode);
        return finalsdp;    
    };

    /*
     * Replaces opus codec in pSdp with the default codec number 109
     * (TODO: get the codec from config.json)
     * This is needed for trancoder enabled peer-to-peer scenarios
     * transcoder only accepts opus codec that it offers
     * @param {type} pSdp
     */
    this.replaceOpusCodec = function (pSdp) {
        var regex, matches, tempAudioLine, oldCodecNumber = "",
            defaultCodecNumber = 109, descriptions, index, substr, partialsdp = "";

        if (!pSdp || (pSdp.indexOf("opus") === -1)) {
            return pSdp;
        }

        regex = /^\.*(a=rtpmap:)(\d*)( opus)/m;
        /* example: matches= ["a=rtpmap:109 opus/48000/2\r\n", "a=rtpmap:", "111", " opus/48000/2"] */

        matches = pSdp.match(regex);
        if (matches !== null && matches.length >= 3 && matches[2] !== "") {
            oldCodecNumber = matches[2];
        }
        else {
            logger.warn("sdp has opus without codec number");
        }
        // replace rtpmap
        pSdp = pSdp.replace(regex, 'a=rtpmap:' + defaultCodecNumber + ' opus');

        // replace audio line
        regex = new RegExp("^\\.*(m=audio )[ \\w+ ]*[ \\/+ ]*[ \\w+ ]*( " + oldCodecNumber + ")", "mg");
        matches = pSdp.match(regex);

        if (matches !== null && matches.length >= 1 && matches[0] !== "") {
            tempAudioLine = matches[0];
            tempAudioLine = tempAudioLine.replace(oldCodecNumber, defaultCodecNumber);
            pSdp = pSdp.replace(regex, tempAudioLine);
        }

        // replace fmtp
        // only audio section needs to be considered, do not change video section
        descriptions = pSdp.split(/^(?=m=)/m);
        for (index = 0; index < descriptions.length; index++) {
            substr = descriptions[index];
            if (this.isSdpHasAudio(substr)) {
                regex = new RegExp("^\\.*a=fmtp:" + oldCodecNumber, "mg");
                substr = substr.replace(regex, 'a=fmtp:' + defaultCodecNumber);
            }
            partialsdp = partialsdp + substr;
        }
        if (partialsdp !== "") {
            pSdp = partialsdp;
        }
        logger.debug("replaceOpusCodec: new codec= " + defaultCodecNumber);
        return pSdp;
    };

    this.getG7228000PayloadType = function(pSdp) {
        return this.getPayloadTypeOf("G722/8000",pSdp);
    };
    
    this.getVP8PayloadType = function(pSdp) {
        return this.getPayloadTypeOf("VP8/90000",pSdp);
    };
    
    this.getG72216000PayloadType = function(pSdp) {
        return this.getPayloadTypeOf("G722/16000",pSdp);
    };

    this.getRTXPayloadType = function(pSdp) {
        return this.getPayloadTypeOf("rtx/90000", pSdp);
    };
    
    this.getH264PayloadType = function(pSdp) {
        return this.getPayloadTypeOf("H264/90000",pSdp);
    };

    this.isSdpHasTelephoneEventWithRate = function(pSdp, rate){
        return pSdp.indexOf("telephone-event/" + rate) !== -1;
    };
    
    this.isSdpHasTelephoneEvent = function(pSdp){
        return pSdp.indexOf("telephone-event/") !== -1;
    };
    
    this.isSdpHasVP8Codec = function(pSdp){
        return pSdp.indexOf("VP8/90000") !== -1;
    };

    this.isSdpHasH264Codec = function(pSdp){
        return pSdp.indexOf("H264/90000") !== -1;
    };

    /*
     * checkSupportedVideoCodecs 
     * 
     * checks video codec support status and remove video m-line if no supported video codec is available
     * @param {type} pSdp
     * @param {type} localOfferSdp
     */
    this.checkSupportedVideoCodecs = function(pSdp, localOfferSdp, isH264Enabled) {
        var newSdp;
        if (this.isVideoCodecsSupported(pSdp, isH264Enabled)) {
            return pSdp;
        } else {
            if (localOfferSdp) {
                newSdp = this.removeAllVideoCodecs(pSdp);
                newSdp = this.addVP8Codec(newSdp, localOfferSdp);
                newSdp = this.updateSdpVideoPort(newSdp, false);
                newSdp = this.performVideoPortZeroWorkaround(newSdp);
            } else {
                //******************************************************
                //Changing video port to 0 when there is no supported  
                //video codecs is not working in webrtc library
                //******************************************************
                if (!this.isSdpHasVP8Codec(pSdp)) {
                    if (pSdp.indexOf(CONSTANTS.SDP.M_LINE + CONSTANTS.STRING.VIDEO + " 0 ", 0) !== -1) {
                        newSdp = this.addVP8Codec(pSdp, newSdp);
                    } else {
                        //this is required for PCC and meetme with video
                        newSdp = this.updateSdpVideoPort(pSdp, false);
                        newSdp = this.addVP8Codec(newSdp, newSdp);
                    }
                } else {
                    newSdp = this.removeVideoDescription(pSdp);      //this is required for PCC and meetme with video
                }
            }

            return newSdp;
        }
    };

    /*
     * isVideoCodecsSupported: this function checks supported video codecs are listed in m=video line
     * Supported video codecs are :
     *      VP8     default supported codec
     *      H264    if h264 is enabled with plugin
     *      @param {type} pSdp
     */
    this.isVideoCodecsSupported = function(pSdp, isH264Enabled) {

        if (this.isSdpHasVP8Codec(pSdp)) {
            return true;
        }
        if (isH264Enabled) {
            if (this.isSdpHasH264Codec(pSdp)) {
                return true;
            }
        }

        return false;
    };

    this.removeAllVideoCodecs = function(pSdp) {
        var regex, matches, codecs, newSdp, index;
        
        regex = new RegExp("^\\.*(m=video )(\\d*)( RTP/SAVPF )([ \\w+ ]*[ \\/+ ]*[ \\w+ ])\\r\n", "m");

        newSdp = pSdp;
        matches = newSdp.match(regex);
        
        if (matches !== null && matches.length >= 5 && matches[0] !== "") {
            codecs = matches[4].split(" ");
            for (index = 0; index < codecs.length; index++) {
                logger.debug("codec[" + index + "] : " + codecs[index]);
                newSdp = this.removeVideoCodec(newSdp, codecs[index]);
            }
        }
        
        return newSdp;
    };
    
    /*
     * removeVideoCodec: removes given codec type from sdp.
     * @param {type} pSdp
     * @param {type} codecToRemove
     */
    this.removeVideoCodec = function(pSdp, codecToRemove) {
        var sdp = "", substr = "", descriptions = [], index, reg = /\r\n|\r|\n/m, video_arr, i, 
            new_substr = "", elm, regExpCodec;

        descriptions = pSdp.split(/^(?=m=)/m);
        for (index = 0; index < descriptions.length; index++) {
            substr = descriptions[index];
            if (this.isSdpHasVideo(substr)) {
                video_arr = substr.split(reg);
                for (i = 0; i < video_arr.length; i++) {
                    elm = video_arr[i];
                    if (elm && this.isSdpHasVideo(elm)) {
                        // remove given video codec from m=video line
                        regExpCodec = new RegExp(" " + codecToRemove, "g");
                        elm = elm.replace(regExpCodec, "");
                        elm = elm + lf + nl;
                        // Workaround for issue 1603.
                    } else if (elm && elm.indexOf("a=fmtp:" + codecToRemove) !== -1) {
                        elm = elm.replace(/a=fmtp[\w\W]*/, "");
                    } else if (elm && elm.indexOf("a=rtpmap:" + codecToRemove) !== -1) {
                        elm = elm.replace(/a=rtpmap[\w\W]*/, "");
                    } else if (elm && elm.indexOf("a=rtcp-fb:" + codecToRemove) !== -1) {
                        elm = elm.replace(/a=rtcp-fb[\w\W]*/, "");
                    } else if (elm && elm !== "") {
                        elm = elm + lf + nl;
                    }
                    new_substr = new_substr + elm;
                }
                substr = new_substr;
            }
            sdp = sdp + substr;
        }
        return sdp;
    };
    
    /*
     * addVP8Codec: adds missing VP8 Codec 
     * @param {type} pSdp
     * @param {type} offerSdp
     */
    this.addVP8Codec = function(pSdp, offerSdp) {
        var sdp = "", substr="",descriptions=[],index, 
            reg = /\r\n|\r|\n/m, video_arr, i, new_substr = "", 
            vp8PayloadType, codecType, elm,
            videoUFRAGParam, videoPWDParam, ice_ufrag, ice_pwd;

        if(this.isSdpHasVP8Codec(pSdp)) {
            return pSdp;            
        }
        
        descriptions= pSdp.split(/^(?=m=)/m);
        for(index=0;index<descriptions.length;index++){
            substr = descriptions[index];
            if(this.isSdpHasVideo(substr)){
                if (offerSdp && 
                    this.isSdpHasVideo(offerSdp) &&
                    this.isSdpHasVP8Codec(offerSdp)) {
                        vp8PayloadType = this.getVP8PayloadType(offerSdp);
                        if (substr.indexOf("a=rtpmap:" + vp8PayloadType) !== -1) {
                            this.removeSdpLineContainingText(substr,"a=rtpmap:" + vp8PayloadType);
                        }
                } else {
                    codecType = 100;
                    while (substr.indexOf("a=rtpmap:" + codecType) !== -1) {
                        codecType = codecType + 1;
                    }
                    vp8PayloadType = codecType;
                }
                video_arr = substr.split(reg);
                for(i=0;i<video_arr.length;i++){
                    elm = video_arr[i];
                    if (elm && this.isSdpHasVideo(elm)) {
                        if (elm.indexOf(vp8PayloadType) === -1) {
                            elm = elm + " " + vp8PayloadType;
                        }
                        elm = elm  + lf + nl + "a=rtpmap:" + vp8PayloadType + " VP8/90000" + lf + nl;
                    } else if (elm && elm !== "") {
                        elm = elm + lf + nl;
                    }
                    new_substr = new_substr + elm;
                }
                substr = new_substr;
            }
            sdp = sdp + substr;
        }

        videoUFRAGParam = this.checkICEParams(sdp, "video", CONSTANTS.SDP.ICE_UFRAG);
	if(videoUFRAGParam < 2){
            ice_ufrag = this.getICEParams(sdp, CONSTANTS.SDP.ICE_UFRAG, false);
            if (ice_ufrag) {
                sdp = this.restoreICEParams(sdp, "video", CONSTANTS.SDP.ICE_UFRAG, ice_ufrag);
            }
	}
	videoPWDParam = this.checkICEParams(sdp, "video", CONSTANTS.SDP.ICE_PWD);
	if(videoPWDParam < 2){
            ice_pwd = this.getICEParams(sdp, CONSTANTS.SDP.ICE_PWD, false);
            if (ice_pwd) {
                sdp = this.restoreICEParams(sdp, "video", CONSTANTS.SDP.ICE_PWD, ice_pwd);
            }
	} 

        return sdp;
    };

    this.removeSdpLineContainingText = function(pSdp, containing_text) {
        var i,
            splitArray = pSdp.split(nl);

        pSdp = splitArray[0] + nl;
        for (i = 1; i < splitArray.length - 1; i++) {
            if (splitArray[i].indexOf(containing_text) !== -1) {
                logger.debug("removed line which contains " + containing_text);
            }
            else {
                pSdp += splitArray[i] + nl;
            }
        }
        return pSdp;
    };
    
    this.removeVideoDescription = function(pSdp) {
        var sdp = "", substr="", descriptions=[], index;

        descriptions= pSdp.split(/^(?=m=)/m);
        for(index=0;index<descriptions.length;index++){
            substr = descriptions[index];
            if(!this.isSdpHasVideo(substr)){
                sdp = sdp + substr;
            } else {
                logger.debug("removeVideoDescription : m=video description removed");
            }
        }
        return sdp;
    };
    
    /*
     * updateSdpVideoPort
     * @param {type} pSdp
     * @param {type} status
     */
    this.updateSdpVideoPort = function(pSdp, status) {
        var r_sdp, port_text;

        logger.debug("updateSdpVideoPort: status= " + status);
        
        r_sdp = pSdp;

        if (status) {
            port_text = CONSTANTS.SDP.M_LINE + CONSTANTS.STRING.VIDEO + " 1";
        }
        else {
            port_text = CONSTANTS.SDP.M_LINE + CONSTANTS.STRING.VIDEO + " 0";
            r_sdp = this.updateSdpDirection(r_sdp, CONSTANTS.STRING.VIDEO, CONSTANTS.WEBRTC.MEDIA_STATE.INACTIVE);
        }
        
        if (this.isSdpHasVideo(r_sdp)) {
            r_sdp = r_sdp.replace(/m=video [0-9]+/, port_text);
        }

        return r_sdp;
    };

    /*
     * performVideoPortZeroWorkaround - apply this when term side sends an answer with video port 0
     * @param {type} pSdp
     */
    this.performVideoPortZeroWorkaround = function(pSdp) {

        if (!this.isSdpHasVideoWithZeroPort(pSdp)) {
            return pSdp;
        }
        pSdp = this.addSdpMissingCryptoLine (pSdp);
        pSdp = this.replaceZeroVideoPortWithOne(pSdp);

        //chrome38 fix
        pSdp = this.updateVideoSdpDirectionToInactive(pSdp);

        return pSdp;
    };
    
    // Issue      : Meetme conference failed due to a webrtc bug
    //              When video is sent in SDP with 0 without a=crypto line(SDES) in SDP,
    //              hold scenario for meetme failed.
    // Workaround : Add dummy a=crypto or a=fingerprint line to solve the issue with a workaround
    // Note       : fingerprint(DTLS enabled) may still fails on meetme. This is known issue as below:
    //              https://code.google.com/p/webrtc/issues/detail?id=2316
    //              Check with Chrome 37
    this.addSdpMissingCryptoLine = function(sdp) {
        var mediaSplit, audioLines, cryptLine = null, reg = /\r\n|\r|\n/m, i;

        // If there is no "m=video 0" line, sdp should not be modified
        if (sdp.indexOf(CONSTANTS.SDP.M_LINE + CONSTANTS.STRING.VIDEO + " 0 ", 0) === -1) {
            return sdp;
        }
        
        mediaSplit = sdp.split(CONSTANTS.SDP.M_LINE + CONSTANTS.STRING.VIDEO);

        audioLines = mediaSplit[0].split(reg);
        for (i = 0; i < audioLines.length; i++) {
            if ((audioLines[i].indexOf(CONSTANTS.SDP.A_LINE + CONSTANTS.SDP.CRYPTO) !== -1) || (audioLines[i].indexOf(CONSTANTS.SDP.A_LINE + CONSTANTS.SDP.FINGERPRINT) !== -1)) {
                cryptLine = audioLines[i];
                break;
            }
        }

        if (cryptLine === null) {
            return sdp;
        }

        if (mediaSplit[0].indexOf(CONSTANTS.SDP.A_LINE + CONSTANTS.SDP.CRYPTO) !== -1) {
            if (mediaSplit[1].indexOf(CONSTANTS.SDP.A_LINE + CONSTANTS.SDP.CRYPTO, 0) === -1) {
                mediaSplit[1] += cryptLine + "\n";
                logger.debug("addSdpMissingCryptoLine : crypto line is added : " + cryptLine);
            }
        } else if (mediaSplit[0].indexOf(CONSTANTS.SDP.A_LINE + CONSTANTS.SDP.FINGERPRINT, 0) !== -1) {
            if (mediaSplit[1].indexOf(CONSTANTS.SDP.A_LINE + CONSTANTS.SDP.FINGERPRINT, 0) === -1) {
                //DTLS is enabled, even adding fingerprint line in SDP,
                //meetme scenario fails. This is known issue and followed
                //by webrtc for DTLS enabled scenarios :
                //https://code.google.com/p/webrtc/issues/detail?id=2316
                mediaSplit[1] += cryptLine + "\na=setup:passive\n";
                logger.debug("addSdpMissingCryptoLine : dtls lines are added : " + cryptLine + "and a=setup:passive");
                logger.debug("dtls enabled: known issue by webrtc may be fixed! Check it");
            }
        }
        sdp = mediaSplit.join(CONSTANTS.SDP.M_LINE + CONSTANTS.STRING.VIDEO);
        return sdp;
    };
    
    this.checkICEParams = function(pSdp, mediaType, type) {
	var parse1, parse2;
 
	parse1 = pSdp.split('m=video');
	if(parse1.length < 2){
		return 0;
	}

        switch (type) {
            case CONSTANTS.SDP.ICE_UFRAG:
                if(mediaType === "audio"){
			parse2 = parse1[0].split('a=ice-ufrag:');
		}else{
			parse2 = parse1[1].split('a=ice-ufrag:');
		}
                break; 
            case CONSTANTS.SDP.ICE_PWD:            
		if(mediaType === "audio"){
			parse2 = parse1[0].split('a=ice-pwd:');
		}else{
			parse2 = parse1[1].split('a=ice-pwd:');
		}
                break;			 
            default:
                return 0;
	}	
	
        return parse2.length;   
    };
    
    this.getICEParams = function(pSdp, type, isVideo) {
        var parse1, parse2, parse3, param;
 
        switch (type) {
            case CONSTANTS.SDP.ICE_UFRAG:
                parse1 = pSdp.split('a=ice-ufrag:');
                break; 
            case CONSTANTS.SDP.ICE_PWD:
                parse1 = pSdp.split('a=ice-pwd:');
                break;   
            default:
                return undefined;
        }

        if(isVideo){
            if(parse1[2] !== undefined) { /*"....a=ice-....a=ice-...."*/
                parse2 = parse1[2];
                parse3 = parse2.split('a=');
                param = parse3[0];
                return param; /*return video ice params*/    
            } else {
                return undefined;
            }   
        } else {
            if(parse1[1] !== undefined) { /*"....a=ice-....a=ice-...."*/
                parse2 = parse1[1];
                parse3 = parse2.split('a=');
                param = parse3[0];
                return param;     
            } else {
                return undefined;
            }              
        }
    };
    
    this.restoreICEParams = function(pSdp, mediaType, type, new_value) {
        var sdp = "", substr, index, parse1;
 
        parse1 = pSdp.split('m=video');
	if(parse1.length < 2){
            return pSdp;
	}
                
        for (index = 0; index < parse1.length; index++) 
        {
            substr = parse1[index];
            if(index === 0) 
            {                                                
                if(mediaType === "audio"){
			substr = substr + 'a=' + type + new_value;
		}
		sdp = sdp + substr;
            } 
            if(index === 1) 
            {                                                
                if(mediaType === "video"){
			substr = substr + 'a=' + type + new_value;
		}
		sdp = sdp + 'm=video' + substr;
            }			
        }		
        return sdp;
    };

    this.updateICEParams = function (pSdp, type, new_value) {
        var sdp = "", subsdp = "", substr, index, num,
                parse1, parse2, parse3, param=null;
 
        switch(type)
        {
            case CONSTANTS.SDP.ICE_UFRAG:
                parse1 = pSdp.split('a=ice-ufrag:');
                break; 
            case CONSTANTS.SDP.ICE_PWD:
                parse1 = pSdp.split('a=ice-pwd:');
                break;   
            default: 
                return pSdp;
        }
                
        for (index = 0; index < parse1.length; index++) 
        {
            substr = parse1[index];
            if (index === 2) 
            {               
                parse2 = substr.split('a=');
                
                for (num = 0; num < parse2.length; num++) 
                {
                    parse3 = parse2[num];
                    if(num===0)
                    {    
                        parse2[num]= new_value;
                        subsdp = subsdp + parse2[num];
                    }else
                    {    
                        subsdp = subsdp + 'a=' + parse2[num];
                    }
                }               
                substr = subsdp;
                sdp = sdp + substr;
            }else
            {    
                sdp = sdp + substr + 'a=' + type;
            }
        }              
        return sdp;
    };

    this.checkIceParamsLengths = function(newSdp, oldSdp) {
        var ice_ufrag, ice_pwd;
        ice_ufrag = this.getICEParams(newSdp, CONSTANTS.SDP.ICE_UFRAG, true);
        ice_pwd = this.getICEParams(newSdp, CONSTANTS.SDP.ICE_PWD, true);

        if (ice_ufrag && ice_ufrag.length < 4) { /*RFC 5245 the ice-ufrag attribute can be 4 to 256 bytes long*/
            ice_ufrag = this.getICEParams(oldSdp, CONSTANTS.SDP.ICE_UFRAG, true);
            if (ice_ufrag) {
                newSdp = this.updateICEParams(newSdp, CONSTANTS.SDP.ICE_UFRAG, ice_ufrag);
            }
        }

        if (ice_pwd && ice_pwd.length < 22) { /*RFC 5245 the ice-pwd attribute can be 22 to 256 bytes long*/
            ice_pwd = this.getICEParams(oldSdp, CONSTANTS.SDP.ICE_PWD, true);
            if (ice_pwd) {
                newSdp = this.updateICEParams(newSdp, CONSTANTS.SDP.ICE_PWD, ice_pwd);
            }
        }
        return newSdp;
    };
    
    /*
     * isSdpVideoSendEnabled
     * @param {type} pSdp
     */
    this.isSdpVideoSendEnabled = function(pSdp) {
        var direction, 
            msg = "isSdpVideoSendEnabled: ", 
            result = false;

        if (!this.isSdpEnabled(pSdp, CONSTANTS.STRING.VIDEO)) {
            logger.debug(msg + result);
            return result;
        }

        direction = this.getSdpDirectionLogging(pSdp, CONSTANTS.STRING.VIDEO, false);
        if (direction === CONSTANTS.WEBRTC.MEDIA_STATE.SEND_RECEIVE ||
            direction === CONSTANTS.WEBRTC.MEDIA_STATE.SEND_ONLY) {
            result = true;
            logger.debug(msg + result);
            return result;
        }

        logger.debug(msg + result);
        return result;
    };
    
    this.getSdpDirectionLogging = function(pSdp, type, logging) {
        var substr = "", descriptions = [], index,
            direction = CONSTANTS.WEBRTC.MEDIA_STATE.INACTIVE, logmsg;

        logmsg = function(state) {
            if (logging) {
                logger.debug("getSdpDirection: type= " + type + " state= " + state);
            }
        };

        if (pSdp.indexOf(CONSTANTS.SDP.M_LINE + type) === -1) {
            logmsg(direction);
            return direction;
        }

        if (pSdp.indexOf(CONSTANTS.SDP.M_LINE + type + " 0") !== -1) {
            logmsg(direction);
            return direction;
        }

        descriptions = pSdp.split(/^(?=m=)/m);
        for (index = 0; index < descriptions.length; index++) {
            substr = descriptions[index];
            if (substr.indexOf(CONSTANTS.SDP.M_LINE + type) !== -1) {
                if (substr.indexOf(CONSTANTS.SDP.A_LINE + CONSTANTS.WEBRTC.MEDIA_STATE.SEND_RECEIVE) !== -1) {
                    direction = CONSTANTS.WEBRTC.MEDIA_STATE.SEND_RECEIVE;
                    logmsg(direction);
                    return direction;
                } else if (substr.indexOf(CONSTANTS.SDP.A_LINE + CONSTANTS.WEBRTC.MEDIA_STATE.SEND_ONLY) !== -1) {
                    direction = CONSTANTS.WEBRTC.MEDIA_STATE.SEND_ONLY;
                    logmsg(direction);
                    return direction;
                } else if (substr.indexOf(CONSTANTS.SDP.A_LINE + CONSTANTS.WEBRTC.MEDIA_STATE.RECEIVE_ONLY) !== -1) {
                    direction = CONSTANTS.WEBRTC.MEDIA_STATE.RECEIVE_ONLY;
                    logmsg(direction);
                    return direction;
                } else if (substr.indexOf(CONSTANTS.SDP.A_LINE + CONSTANTS.WEBRTC.MEDIA_STATE.INACTIVE) !== -1) {
                    logmsg(direction);
                    return direction;
                }
                direction = CONSTANTS.WEBRTC.MEDIA_STATE.SEND_RECEIVE;
                return direction;
            }
        }
        direction = CONSTANTS.WEBRTC.MEDIA_STATE.NOT_FOUND;
        logmsg(direction);
        return direction;
    };
    
    /*
     * remove only video ssrc from the sdp
     * this is a workaround to hear audio in a peer-to-peer call
     * @param {type} pSdp
     */
    this.deleteInactiveVideoSsrc = function(pSdp) {
        var videoSdp = [];

        if (this.isSdpHas(pSdp, CONSTANTS.STRING.VIDEO)) {
            videoSdp = pSdp.split(CONSTANTS.SDP.M_LINE + CONSTANTS.STRING.VIDEO);
            if (videoSdp[1] !== null) {
                videoSdp[1] = this.deleteSsrcFromSdp(videoSdp[1]);
            }
        } else {
            return pSdp;
        }
        return videoSdp[0] + CONSTANTS.SDP.M_LINE + CONSTANTS.STRING.VIDEO + videoSdp[1];
    };
    
    /*
     * deleteSsrcFromSdp - delete ssrc from the sdp, use it when there is video continuity issue
     * @param {type} sdp
     */
    this.deleteSsrcFromSdp = function(sdp) {
        while (sdp.indexOf("a=ssrc") !== -1) {
            sdp = sdp.replace(/(a=ssrc[\w\W]*?(:\r|\n))/, "");
        }
        return sdp;
    };
    
    this.getTcpSetupAttribute = function(sdp) {
        var setupAttribute;
        if (sdp.indexOf(CONSTANTS.SDP.SETUP_ACTIVE) !== -1) {
            setupAttribute = CONSTANTS.SDP.SETUP_ACTIVE;
        } else if (sdp.indexOf(CONSTANTS.SDP.SETUP_PASSIVE) !== -1) {
            setupAttribute = CONSTANTS.SDP.SETUP_PASSIVE;
        } else if (sdp.indexOf(CONSTANTS.SDP.SETUP_ACTPASS) !== -1) {
            setupAttribute = CONSTANTS.SDP.SETUP_ACTPASS;
        }

        return setupAttribute;
    };

    this.setTcpSetupAttributeTo = function(sdp, newSetupAttribute, isDtlsEnabled) {
        if (!isDtlsEnabled) {
            return sdp;
        }

        if (newSetupAttribute !== CONSTANTS.SDP.SETUP_ACTIVE) {
            while (sdp.indexOf(CONSTANTS.SDP.SETUP_ACTIVE) !== -1) {
                logger.debug("a=setup:active to " + newSetupAttribute);
                sdp = sdp.replace(CONSTANTS.SDP.SETUP_ACTIVE, newSetupAttribute);
        }
        }

        if (newSetupAttribute !== CONSTANTS.SDP.SETUP_PASSIVE) {
            while (sdp.indexOf(CONSTANTS.SDP.SETUP_PASSIVE) !== -1) {
                logger.debug("a=setup:passive to " + newSetupAttribute);
                sdp = sdp.replace(CONSTANTS.SDP.SETUP_PASSIVE, newSetupAttribute);
            }
        }

        if (newSetupAttribute !== CONSTANTS.SDP.SETUP_ACTPASS) {
            while (sdp.indexOf(CONSTANTS.SDP.SETUP_ACTPASS) !== -1) {
                logger.debug("a=setup:passive to " + newSetupAttribute);
                sdp = sdp.replace(CONSTANTS.SDP.SETUP_ACTPASS, newSetupAttribute);
            }
        }
        return sdp;
    };

    this.setTcpSetupAttributeToActpass = function(sdp, isDtlsEnabled) {
        return this.setTcpSetupAttributeTo(sdp, CONSTANTS.SDP.SETUP_ACTPASS, isDtlsEnabled);
    };
    
    /*
     * 
     * @param {type} pSdp
     * @param {type} oSdp
     * @returns pSdp
     */
    this.checkAndRestoreICEParams = function(pSdp, oSdp) {
        var audioUFRAGParam, audioPWDParam, videoUFRAGParam, videoPWDParam, ice_ufrag, ice_pwd;

        audioUFRAGParam = this.checkICEParams(pSdp, CONSTANTS.STRING.AUDIO, CONSTANTS.SDP.ICE_UFRAG);
        if (audioUFRAGParam < 2) {
            ice_ufrag = this.getICEParams(oSdp, CONSTANTS.SDP.ICE_UFRAG, false);
            if (ice_ufrag) {
                pSdp = this.restoreICEParams(pSdp, CONSTANTS.STRING.AUDIO, CONSTANTS.SDP.ICE_UFRAG, ice_ufrag);
            }
        }
        audioPWDParam = this.checkICEParams(pSdp, CONSTANTS.STRING.AUDIO, CONSTANTS.SDP.ICE_PWD);
        if (audioPWDParam < 2) {
            ice_pwd = this.getICEParams(oSdp, CONSTANTS.SDP.ICE_PWD, false);
            if (ice_pwd) {
                pSdp = this.restoreICEParams(pSdp, CONSTANTS.STRING.AUDIO, CONSTANTS.SDP.ICE_PWD, ice_pwd);
            }
        }
        videoUFRAGParam = this.checkICEParams(pSdp, CONSTANTS.STRING.VIDEO, CONSTANTS.SDP.ICE_UFRAG);
        if (videoUFRAGParam < 2) {
            ice_ufrag = this.getICEParams(oSdp, CONSTANTS.SDP.ICE_UFRAG, false);
            if (ice_ufrag) {
                pSdp = this.restoreICEParams(pSdp, CONSTANTS.STRING.VIDEO, CONSTANTS.SDP.ICE_UFRAG, ice_ufrag);
            }
        }
        videoPWDParam = this.checkICEParams(pSdp, CONSTANTS.STRING.VIDEO, CONSTANTS.SDP.ICE_PWD);
        if (videoPWDParam < 2) {
            ice_pwd = this.getICEParams(oSdp, CONSTANTS.SDP.ICE_PWD, false);
            if (ice_pwd) {
                pSdp = this.restoreICEParams(pSdp, CONSTANTS.STRING.VIDEO, CONSTANTS.SDP.ICE_PWD, ice_pwd);
            }
        }
        return pSdp;
    };
    
    this.incrementVersion = function(pSdp) {
        var oLineAsArray = [], newoLine ="", index, version, actualoLine;
        logger.debug("incrementVersion");

        if (!pSdp) {
            return pSdp;
        }

        // o=- 937770930552268055 2 IN IP4 127.0.0.1
        // o=mozilla...THIS_IS_SDPARTA-37.0.1 4294967295 0 IN IP4 0.0.0.0
        actualoLine = pSdp.match(/(o=[\w\W]*?(:\r|\n))/); // get o line 

        if (!actualoLine) {
            return pSdp;
        }

        oLineAsArray = actualoLine[0].split(" "); // get o line

        version = +oLineAsArray[2]; //getting version and convering it to int
        version = version + 1; //incrementing the version

        for (index = 0; index < oLineAsArray.length; index++) {
            if (index !== 0) {
                // prevents adding unnecessary space before the o line
                newoLine = newoLine + " ";
            }
            if (index === 2) {
                // 2nd index is version index
                newoLine = newoLine + version;
            } else {
                newoLine = newoLine + oLineAsArray[index];
            }
        }
        
        pSdp = pSdp.replace(actualoLine[0], newoLine);

        return pSdp;
    };
    
    /*
     * escalateSdpDirection for type:audio or video
     * @param {type} pSdp
     * @param {type} type
     */
    this.escalateSdpDirection = function(pSdp, type) {
        var direction = this.getSdpDirectionLogging(pSdp, type, false);
        logger.debug("escalateSdpDirection: type= " + type + " direction= " + direction);
        if (direction === CONSTANTS.WEBRTC.MEDIA_STATE.RECEIVE_ONLY) {
            return this.changeDirection(pSdp, direction, CONSTANTS.WEBRTC.MEDIA_STATE.SEND_RECEIVE, type);
        } else if (direction === CONSTANTS.WEBRTC.MEDIA_STATE.INACTIVE) {
            return this.changeDirection(pSdp, direction, CONSTANTS.WEBRTC.MEDIA_STATE.SEND_ONLY, type);
        }
        return pSdp;
    };
    
    /*
     * deescalateSdpDirection for type:audio or video
     * @param {type} pSdp
     * @param {type} type
     */
    this.deescalateSdpDirection = function(pSdp, type) {
        var direction = this.getSdpDirectionLogging(pSdp, type, false);
        logger.debug("deescalateSdpDirection: type= " + type + " direction= " + direction);
        if (direction === CONSTANTS.WEBRTC.MEDIA_STATE.SEND_RECEIVE) {
            return this.changeDirection(pSdp, direction, CONSTANTS.WEBRTC.MEDIA_STATE.RECEIVE_ONLY, type);
        } else if (direction === CONSTANTS.WEBRTC.MEDIA_STATE.SEND_ONLY) {
            return this.changeDirection(pSdp, direction, CONSTANTS.WEBRTC.MEDIA_STATE.INACTIVE, type);
        }
        return pSdp;
    };

    this.isIceLite = function(pSdp) {
        if (pSdp && pSdp.indexOf("a=ice-lite") !== -1) {
            return true;
        }
        return false;
    };

    /*
     * Updates the version in tosdp with the one retrieved from fromsdp with incrementing
     */
    this.updateVersion = function(fromSdp, toSdp) {
        var fromOline = [], toOline = [], newoLine = "", index, version, actualtoOline = '';

        if (!fromSdp) {
            return toSdp;
        }

        logger.debug(" updateVersion called...");

        // o=- 937770930552268055 2 IN IP4 127.0.0.1
        fromOline = fromSdp.match(/(o=[\w\W]*?(:\r|\n))/); // get o line

        if (!fromOline) {
            return toSdp;
        }

        fromOline = fromOline[0].split(" ");
        
        actualtoOline = toSdp.match(/(o=[\w\W]*?(:\r|\n))/); // get o line 
        toOline = actualtoOline[0].split(" ");

        if (fromOline) {
            version = fromOline[2];
        } else {
            logger.warn("updateVersion called with wrong fromSdp!!");
            return toSdp;
        }

        version = (+version) + 1; // convert to int and increment

        logger.debug(" updateVersion fromVersion incremented: " + version);
        
        for (index = 0; index < toOline.length; index++) {
            if (index !== 0) {
                // prevents adding unnecessary space before the o line
                newoLine = newoLine + " ";
            }
            if (index === 2) {
                // 2nd index is version index
                newoLine = newoLine + version;
            } else {
                newoLine = newoLine + toOline[index];
            }
        }
        toSdp = toSdp.replace(actualtoOline[0], newoLine);

        return toSdp;
    };

    // TODO: Method below assumes to receive only one video m-line, need to correct this logic.
    this.copyCandidatesToTheNewLocalSdp = function(oldSdp, newSdp) {
        var oldSplitSdp = [], newSplitSdp = [], oldVideoSdp, newVideoSdp,
                oldAudioSdp, newAudioSdp;

        oldSplitSdp = oldSdp.split(CONSTANTS.SDP.M_LINE + CONSTANTS.STRING.VIDEO);
        newSplitSdp = newSdp.split(CONSTANTS.SDP.M_LINE + CONSTANTS.STRING.VIDEO);

        oldAudioSdp = oldSplitSdp[0];
        oldVideoSdp = oldSplitSdp[1] !== undefined ? CONSTANTS.SDP.M_LINE + CONSTANTS.STRING.VIDEO + oldSplitSdp[1] : undefined;
        newAudioSdp = newSplitSdp[0];
        newVideoSdp = newSplitSdp[1] !== undefined ? CONSTANTS.SDP.M_LINE + CONSTANTS.STRING.VIDEO + newSplitSdp[1] : undefined;

        newAudioSdp = this.copyCandidates(oldAudioSdp, newAudioSdp);

        if (oldVideoSdp !== undefined && newVideoSdp !== undefined) {
            newVideoSdp = this.copyCandidates(oldVideoSdp, newVideoSdp);
        }

        if (newVideoSdp !== undefined) {
            return newAudioSdp + newVideoSdp;
        }
        else {
            return newAudioSdp;
        }
    };

    this.copyCandidates = function(oldSdp, newSdp) {
        var mediaLines, reg = /\r\n|\r|\n/m, i, port;

        mediaLines = oldSdp.split(reg);

        for (i = 0; i < mediaLines.length; i++) {
            if (mediaLines[i].indexOf("a=candidate") !== -1 && newSdp.indexOf(("a=candidate") === -1)) {
                newSdp += mediaLines[i] + "\r\n";
            } else if (mediaLines[i].indexOf("c=IN") !== -1 && newSdp.indexOf(("c=IN IP4 0.0.0.0") !== -1)) {
                newSdp = newSdp.replace(/(c=[\w\W]*?(:\r|\n))/, mediaLines[i] + "\r\n");
            } else if ((mediaLines[i].indexOf("m=audio") !== -1) &&
                       (newSdp.indexOf(CONSTANTS.SDP.M_LINE + CONSTANTS.STRING.AUDIO + " 1 ") !== -1 ||
                        newSdp.indexOf(CONSTANTS.SDP.M_LINE + CONSTANTS.STRING.AUDIO + " 9 ") !== -1)) {
                port = mediaLines[i].split(" ")[1];

                newSdp = newSdp.replace(/m=audio \d/, CONSTANTS.SDP.M_LINE + CONSTANTS.STRING.AUDIO + " " + port);
            } else if ((mediaLines[i].indexOf("m=video") !== -1) &&
                       (newSdp.indexOf(CONSTANTS.SDP.M_LINE + CONSTANTS.STRING.VIDEO + " 1 ") !== -1 ||
                        newSdp.indexOf(CONSTANTS.SDP.M_LINE + CONSTANTS.STRING.VIDEO + " 9 ") !== -1)) {
                port = mediaLines[i].split(" ")[1];

                newSdp = newSdp.replace(/m=video \d/, CONSTANTS.SDP.M_LINE + CONSTANTS.STRING.VIDEO + " " + port);
            }
        }
        return newSdp;
    };
    
    /*
     * getSdpFromObject
     * There is a webrtc bug in Plugin. 
     * sendrecv direction changed to recvonly for offer type sdps
     * This function is the workaround solution to get the correct sdp from the object
     * until webrtc bug in plugin is fixed.
     */
    this.getSdpFromObject = function(oSdp) {
        var sdp;
        sdp = oSdp.sdp;
        
        return sdp;
    };
    
    /*
     * deleteGoogleIceFromSdp - delete google-ice option from the sdp
     */
    this.deleteGoogleIceFromSdp = function(sdp) {
        sdp = sdp.replace(/(a=ice-options:google-ice[\w\W]*?(:\r|\n))/g, "");
        return sdp;
    };

    this.respondToRemoteSdpDirections = function(localSdp, remoteSdp) {
        localSdp = this.respondToRemoteMediaSdpDirection(localSdp, remoteSdp, CONSTANTS.STRING.AUDIO);
        localSdp = this.respondToRemoteMediaSdpDirection(localSdp, remoteSdp, CONSTANTS.STRING.VIDEO);

        return localSdp;
    };

    this.respondToRemoteMediaSdpDirection = function(localSdp, remoteSdp, type) {
        var remoteDirection;

        if (this.isSdpHas(remoteSdp, type)) {
            remoteDirection = this.getSdpDirection(remoteSdp, type);

            if (remoteDirection === CONSTANTS.WEBRTC.MEDIA_STATE.SEND_ONLY) {
                logger.debug(type + " sendonly -> recvonly");
                localSdp = this.updateSdpDirection(localSdp, type, CONSTANTS.WEBRTC.MEDIA_STATE.RECEIVE_ONLY);
            }
            else if (remoteDirection === CONSTANTS.WEBRTC.MEDIA_STATE.RECEIVE_ONLY) {
                logger.debug(type + " recvonly -> sendonly");
                localSdp = this.updateSdpDirection(localSdp, type, CONSTANTS.WEBRTC.MEDIA_STATE.SEND_ONLY);
            }
            else if (remoteDirection === CONSTANTS.WEBRTC.MEDIA_STATE.SEND_RECEIVE) {
                logger.debug(type + " sendrecv -> sendrecv");
                localSdp = this.updateSdpDirection(localSdp, type, CONSTANTS.WEBRTC.MEDIA_STATE.SEND_RECEIVE);
            }
            else if (remoteDirection === CONSTANTS.WEBRTC.MEDIA_STATE.INACTIVE) {
                logger.debug(type + " inactive -> inactive");
                localSdp = this.updateSdpDirection(localSdp, type, CONSTANTS.WEBRTC.MEDIA_STATE.INACTIVE);
            }
        }
        return localSdp;
    };

    this.hasCandidates = function(sdp, relayCandidateCycle, relayCandidateConfigCycle) {
        var audioArray, videoArray, candidateParser;     
        candidateParser = this.getCandidateType(relayCandidateCycle, relayCandidateConfigCycle);              
        if (this.isSdpHasAudio(sdp)){          
            audioArray = sdp.split("m=audio");
            if (audioArray[1].indexOf(candidateParser) === -1) {
                return false;
            } else if (this.isSdpHasVideo(sdp) && !this.isVideoSdpDirectionInactive(sdp) && !this.isVideoSdpDirectionRecvonly(sdp)) {
                videoArray = sdp.split("m=video");
                if (videoArray[1].indexOf(candidateParser) === -1) {
                    return false;
                } else {
                    return true;
                }
            } else {
                return true;
            }
        }
        return false;
    };
    
    this.getCandidateType = function(relayCandidateCycle, relayCandidateConfigCycle) {        
        var candidateParser;                
        if (relayCandidateCycle) {                
            if(relayCandidateCycle <= relayCandidateConfigCycle) {
                candidateParser = "relay";
            }
            else {
                candidateParser = "a=candidate";  
            }
        }
        else {
            candidateParser = "a=candidate"; 
        }        
        return candidateParser;
    };

    // spidr sends both fingerprint and crypto at incoming call to the term side
    // delete the unnecessary one before setting remote description
    this.deleteFingerprintOrCrypto = function(sdp, isDtlsEnabled) {
        if (!sdp) {
            return sdp;
        }
        if (sdp.indexOf("a=crypto:") === -1 || sdp.indexOf("a=fingerprint:") === -1) {
            return sdp;
        }
        sdp = this.deleteCryptoFromSdp(sdp, isDtlsEnabled);
        sdp = this.deleteFingerprintFromSdp(sdp, isDtlsEnabled);

        return sdp;
    };

    function addRtpmapForCodec(sdp, payload, rtpmapString) {
        var audioCodecList;
        if (!sdp) {
            return;
        }
        
        audioCodecList = sdp.match(/m=audio [\w\W]*?(\r|\n)/);
        if (!audioCodecList) {
            return sdp;
        }
        
        audioCodecList = audioCodecList[0].split(" ");
        audioCodecList.shift(); // shift "m=audio" out
        audioCodecList.shift(); // shift audio port out
        audioCodecList.shift(); // shift RTP/SAVPF out

        if (audioCodecList.indexOf(payload) === -1) {
            return sdp;
        }

        if (sdp.indexOf(rtpmapString) !== -1) {
            return sdp;
        }

        sdp = sdp.split(CONSTANTS.SDP.M_LINE + CONSTANTS.STRING.VIDEO);

        sdp[0] = sdp[0] + rtpmapString + lf + nl;
        
        if (sdp[1]) {
            sdp = sdp[0] + CONSTANTS.SDP.M_LINE + CONSTANTS.STRING.VIDEO + sdp[1];
        }
        else {
            sdp = sdp[0];
        }

        return sdp;
    }

    /*
     *  This is only required for Firefox Native webrtc.
     *  If PCMU exists in codec list but its rtpmap is missing in sdp,
     *  firefox native webrtc does not collect ice canditates.
     *  Scenario: C2C when FF is originating client 
     *            (Broker without Transcoder config)
     */
    this.addRtpmapForPCMU = function(sdp) {
        return addRtpmapForCodec(sdp, "0", "a=rtpmap:0 PCMU/8000");
    };

    /*
     *  This is only required for Firefox Native webrtc.
     *  If PCMA exists in codec list but its rtpmap is missing in sdp,
     *  firefox native webrtc does not collect ice canditates.
     *  Scenario: C2C when FF is originating client 
     *            (Broker without Transcoder config)
     */
    this.addRtpmapForPCMA = function(sdp) {
         return addRtpmapForCodec(sdp, "8", "a=rtpmap:8 PCMA/8000");
    };
    
    /*
     * This is only required for Firefox Native webRTC.
     * Firefox native adds curly brackets to msid and cname properties(maybe more)
     * This leads to problem in multi - peer to peer configurated lab.
     * TODO : Unit test cases should be written
     */
    this.deleteCurlyBracketsSDP = function(sdp) {
        logger.debug('Deleting curly brackets from sdp');
        sdp = sdp.replace(/(\{|\})/g, "");
        return sdp;
    };
    
    /*
     * If inactive video m-line has bandwith attribute in SDP(occurs in Chrome to PCC call), 
     * Chrome's webRTC Engine rejects it
     * This workaround removes the b:AS line
     * TODO : Unit test cases should be written
     */
    this.deleteBandwidthLineFromSdp = function(sdp) {
        if (this.isVideoSdpDirectionInactive(sdp)) {
            logger.debug('Deleting b:AS line from SDP');
            sdp = sdp.replace(/(b=AS:[\w\W]*?(:\r|\n))/g, '');
        }
        return sdp;
    };
    /*
     * Firefox 38.0.1 does not accept uppercase opus codec and cause basic call problem with GCFIOS.
     * The following is a workaround for this problem.
     * Feel free to remove it when Firefox 38.0.1 is updated to 38.0.5.
     */
    this.setOpusCodecToLowerCase = function(sdp) {
        logger.debug('Setting OPUS codec to lower case');
        return sdp.replace('OPUS','opus');
    };
    
    /*
     * Replaces audio m line of codec
     * @sdp Sdp to be processed
     * @prevValue previous telephony event value
     * @newValue new telephony event value
     * @returns processed SDP
     */
    this.replaceAudioMlineOfCodec = function(sdp, prevValue, newValue) {
        if (this.isSdpHasAudio(sdp)) {
            sdp = this.replaceMlineOfCodec(sdp, CONSTANTS.STRING.AUDIO, prevValue, newValue);
        }
        return sdp;
    };
    
    /*
     * Replaces video m line of codec
     * @sdp Sdp to be processed
     * @prevValue previous telephony event value
     * @newValue new telephony event value
     * @returns processed SDP
     */
    this.replaceVideoMlineOfCodec = function(sdp, prevValue, newValue) {
        if (this.isSdpHasVideo(sdp)) {
            sdp = this.replaceMlineOfCodec(sdp, CONSTANTS.STRING.VIDEO, prevValue, newValue);
        }
        return sdp;
    };

    /*
     * Replaces m line of codec
     * @sdp Sdp to be processed
     * @option m line to be processed
     * @prevValue previous telephony event value
     * @newValue new telephony event value
     * @returns processed SDP
     */
    this.replaceMlineOfCodec = function(sdp, option, prevValue, newValue) {
        var prevMline, newMline = '', mLineRegex, index;
        mLineRegex = new RegExp('m=' + option + ' [\\w\\W]*?(\\r|\\n)', 'g');
        prevMline = sdp.match(mLineRegex);
        prevMline = prevMline[0].split(' ');
        for (index = 0; index < prevMline.length; index++) {
            // index[1] is actual port and we should not change it.
            if ((index !== 1) && prevMline[index] && (prevMline[index].indexOf(prevValue) !== -1)) {
                prevMline[index] = prevMline[index].replace(prevValue, newValue);
            }
            // This if check is necessary in order not to put an space at the end of m line
            if (index === (prevMline.length - 1)) {
                newMline += prevMline[index];                
            } else {
                newMline += prevMline[index] + ' ';
            }
        }
        return sdp.replace(mLineRegex, newMline);
    };
    
    /*
     * Replaces RTPMap of codec
     * @sdp Sdp to be processed
     * @prevValue previous telephony event value
     * @newValue new telephony event value
     * @returns processed SDP
     */
    this.replaceRTPMapOfCodec = function(sdp, prevValue, newValue) {
        var regex = new RegExp('a=rtpmap:' + prevValue, 'g');
        return sdp.replace(regex, 'a=rtpmap:' + newValue);
    };
    
    /*
     * Replaces RTCP of codec
     * @sdp Sdp to be processed
     * @prevValue previous telephony event value
     * @newValue new telephony event value
     * @returns processed SDP
     */
    this.replaceRTCPOfCodec = function(sdp, prevValue, newValue) {
        var regex = new RegExp('a=rtcp-fb:' + prevValue, 'g');
        return sdp.replace(regex, 'a=rtcp-fb:' + newValue);
    };
    
    /*
     * Replaces FMTP of codec
     * @sdp Sdp to be processed
     * @prevValue previous telephony event value
     * @newValue new telephony event value
     * @returns processed SDP
     */
    this.replaceFMTPOfCodec = function(sdp, prevValue, newValue) {
        var regex = new RegExp('a=fmtp:' + prevValue, 'g');
        return sdp.replace(regex, 'a=fmtp:' + newValue);
    };
    
    /*
     * Replaces the codec with new value
     * @sdp Sdp to be processed
     * @codec Codec to be replaced
     * @newValue new value of codec
     */
    this.replaceCodecValue = function(sdp, codec, newValue) {
        var payloadType, prevValue;
        payloadType = this.getPayloadTypeOf(codec, sdp);
        if (payloadType) {
            // If multiple payload types returned, change first of them
            if (typeof payloadType === 'array') {
                prevValue = payloadType[0];
            } else {
                prevValue = payloadType;
            }
            // Since we don't know which m-line contains this codec, we apply in both m-lines
            // If an m line does not have this codec, then it will simply return the sdp itself
            sdp = this.replaceAudioMlineOfCodec(sdp, prevValue, newValue);
            sdp = this.replaceVideoMlineOfCodec(sdp, prevValue, newValue);
            sdp = this.replaceRTPMapOfCodec(sdp, prevValue, newValue);
            sdp = this.replaceRTCPOfCodec(sdp, prevValue, newValue);
            sdp = this.replaceFMTPOfCodec(sdp, prevValue, newValue);
        }
        return sdp;
    };
    
    /*
     * Replaces codecs
     * @sdp Sdp to be used
     * @codecMap codecMap to be replaced
     * @returns processed SDP
     */
    this.replaceCodecs = function(sdp, codecMap){
        var index;
        if (codecMap && codecMap.length) {
            for (index = 0; index < codecMap.length; index++) {
                sdp = this.replaceCodecValue(sdp, codecMap[index].name, codecMap[index].value);
            }
        }
        return sdp;
    };
    
    /*
     * Removes H264 codec from SDP
     * @sdp Sdp to be used
     * @returns processed SDP
     */
    this.removeH264Codec = function(pSdp) {
        logger.debug("Removing H264 codec from SDP");
        var h264PayloadType, index;

        if (pSdp.indexOf("H264/90000") === -1) {
            return pSdp;
        }

        h264PayloadType = this.getH264PayloadType(pSdp);

        if (h264PayloadType !== -1) {
            for (index = 0; index < h264PayloadType.length; index++) {
                logger.debug("removeH264Codec : Removing H264/90000 video codec " + h264PayloadType[index]);
                pSdp = this.removeVideoCodec(pSdp, h264PayloadType[index]);
            }
        }
        return pSdp;
    };
};

var SDPParser = function(_logManager) {
    return new SDPParserImpl(_logManager || logManager);
};

var sdpParser = new SDPParser();

if (__testonly__) { __testonly__.SDPParser = SDPParser; }
var ConnectivityServiceImpl = function(_server) {

    var CONNECTION_URL = "/rest/version/latest/isAlive";

    this.checkConnectivity = function(onSuccess, onFailure) {
        _server.sendGetRequest({
                    url: getUrl() + CONNECTION_URL + "?" + utils.getTimestamp()
                }, onSuccess,
                onFailure);
    };

};
var ConnectivityService = function (_server) {
    return new ConnectivityServiceImpl(_server || server);
};
var connectivityService = new ConnectivityService();

var ConnectivityManagerImpl = function(_service, _logManager, _globalBroadcaster) {
    var logger = _logManager.getLogger("connectivityManager"),
            PRIORITY = 1,
            DEFAULT_INTERVAL_VALUE = 10000,
            isConnected = true, connectivityTimer,
            connectivityHandler = null;

    function stopCheckConnectivityTimer() {
        logger.info("check connectivity timer is stopped.");
        clearInterval(connectivityTimer);
    }

    function onCheckConnectivitySuccess() {
        if (!isConnected) {
            isConnected = true;
            setConnected(isConnected);
            logger.trace("Connectivity re-established...");
            _globalBroadcaster.publish(CONSTANTS.EVENT.CONNECTION_REESTABLISHED);
        }
    }

    function onCheckConnectivityFailure() {
        if (isConnected) {
            isConnected = false;
            setConnected(isConnected);
            logger.trace("Connectivity is lost...");
            _globalBroadcaster.publish(CONSTANTS.EVENT.CONNECTION_LOST);
        }
    }

    function checkConnectivity() {
        try {
            connectivityHandler();
        }
        catch (e) {
            logger.trace("Exception occured while executing connecitivy handler: ", e);
        }
        _service.checkConnectivity(onCheckConnectivitySuccess, onCheckConnectivityFailure);
    }


    function initConnectivityCheck(message) {
        var intervalValue = DEFAULT_INTERVAL_VALUE,
                handler = message.connectivity ? message.connectivity.handler : null,
                interval = message.connectivity ? message.connectivity.interval : null;
        if (handler && typeof handler === 'function') {
            connectivityHandler = handler;
        }

        if (interval) {
            intervalValue = interval;
        }

        stopCheckConnectivityTimer();
        connectivityTimer = setInterval(checkConnectivity, intervalValue);
    }

    _globalBroadcaster.subscribe(CONSTANTS.EVENT.DEVICE_SUBSCRIPTION_STARTED, initConnectivityCheck, PRIORITY);
    _globalBroadcaster.subscribe(CONSTANTS.EVENT.DEVICE_SUBSCRIPTION_ENDED, stopCheckConnectivityTimer, PRIORITY);
    _globalBroadcaster.subscribe(CONSTANTS.EVENT.XHR_REQUEST_NOT_INITIALIZED, onCheckConnectivityFailure, PRIORITY);

};

var ConnectivityManager = function(_service, _logManager, _globalBroadcaster) {
    return new ConnectivityManagerImpl(_service || connectivityService,
                               _logManager || logManager,
                               _globalBroadcaster || globalBroadcaster);
};

var connectivityManager = new ConnectivityManager();

var WebRtcAdaptorModel = function() {
    var self = this, dtlsEnabled = false, iceServerUrl = "",
            containers = {video: null,
                localVideo: null,
                remoteVideo: null,
                defaultVideo: null},
            mediaConstraints = {
                audio: false,
                video: false
            },
            mediaSources = {
                video: {
                    available: false,
                    width: "320",
                    height: "240"
                },
                audio: {
                    available: false
                },
                screen: {
                  available: false,
                  width: "1024",
                  height: "768",
                  rate: 15
                }
            },
            initialized = false,
            rtcLibrary = {},
            language,
            logLevel = 4,
            peerCount = 0,
            pluginEnabled = false,
            h264Enabled = false,
            audioContext,
            mediaStreamDestination,
            userMediaStream,
            screenStream,
            localStreamMap = new utils.Map();

    self.getLocalStreamMap = function() {
        return localStreamMap;
    };

    self.getUserMediaStream = function (){
        return userMediaStream;
    };

    self.setUserMediaStream = function (userMedia){
        userMediaStream = userMedia;
    };

    self.getScreenStream = function() {
        return screenStream;
    };

    self.setScreenStream = function(stream) {
      screenStream = stream;
    };

    self.isH264Enabled = function (){
        return h264Enabled;
    };

    self.setH264Enabled = function (enabled){
        h264Enabled = enabled === true ? true : false;
    };

    self.getIceServerUrl = function() {
        return iceServerUrl;
    };

    self.setIceServerUrl = function(url) {
        iceServerUrl = url;
    };

    self.isDtlsEnabled = function() {
        return dtlsEnabled;
    };

    self.setDtlsEnabled = function(enabled) {
        dtlsEnabled = enabled;
    };

    self.getVideoContainer = function() {
        return containers.video;
    };

    self.setVideoContainer = function(container) {
        containers.video = container;
    };

    self.getLocalVideoContainer = function() {
        return containers.localVideo;
    };

    self.setLocalVideoContainer = function(container) {
        containers.localVideo = container;
    };

    self.getRemoteVideoContainer = function() {
        return containers.remoteVideo;
    };

    self.setRemoteVideoContainer = function(container) {
        containers.remoteVideo = container;
    };

    self.getDefaultVideoContainer = function() {
        return containers.defaultVideo;
    };

    self.setDefaultVideoContainer = function(container) {
        containers.defaultVideo = container;
    };

    self.isInitialized = function() {
        return initialized;
    };

    self.setInitialized = function(value) {
        initialized = value === true ? true : false;
    };

    self.getRtcLibrary = function() {
        return rtcLibrary;
    };

    self.setRtcLibrary = function(library) {
        rtcLibrary = library;
    };

    self.getLogLevel = function() {
        return logLevel;
    };

    self.setLogLevel = function(level) {
        logLevel = level;
    };

    self.getLanguage = function() {
        return language;
    };

    self.setLanguage = function(lang) {
        language = lang;
    };

    self.getMediaAudio = function() {
        return mediaConstraints.audio;
    };

    self.setMediaAudio = function(_audio) {
        mediaConstraints.audio = _audio;
    };

    self.getMediaVideo = function() {
        return mediaConstraints.video;
    };

    self.setMediaVideo = function(_video) {
        mediaConstraints.video = _video;
    };

    self.getVideoWidth = function() {
        return mediaSources.video.width;
    };

    self.setVideoWidth = function(_videoWidth) {
        mediaSources.video.width = _videoWidth;
    };

    self.getVideoHeight = function() {
        return mediaSources.video.height;
    };

    self.setVideoHeight = function(_videoHeight) {
        mediaSources.video.height = _videoHeight;
    };

    self.getVideoSourceAvailable = function() {
        return mediaSources.video.available;
    };

    self.setVideoSourceAvailable = function(_videoSourceAvailable) {
        mediaSources.video.available = _videoSourceAvailable;
    };

    self.getAudioSourceAvailable = function() {
        return mediaSources.audio.available;
    };

    self.setAudioSourceAvailable = function(_audioSourceAvailable) {
        mediaSources.audio.available = _audioSourceAvailable;
    };

    self.getScreenSourceAvailable = function() {
        return mediaSources.screen.available;
    };

    self.setScreenSourceAvailable = function(_videoSourceAvailable) {
        mediaSources.screen.available = _videoSourceAvailable;
    };

    self.getScreenWidth = function() {
        return mediaSources.screen.width;
    };

    self.setScreenWidth = function(_screenWidth) {
        mediaSources.screen.width = _screenWidth;
    };

    self.getScreenHeight = function() {
        return mediaSources.screen.height;
    };

    self.setScreenHeight = function(_screenHeight) {
        mediaSources.screen.height = _screenHeight;
    };

    self.getScreenFrameRate = function() {
        return mediaSources.screen.rate;
    };

    self.setScreenFrameRate = function(_screenRate) {
        mediaSources.screen.rate = _screenRate;
    };

    self.getPeerCount = function() {
        return peerCount;
    };

    self.setPeerCount = function(_peerCount) {
        peerCount = _peerCount;
    };

    self.isPluginEnabled = function() {
        return pluginEnabled;
    };

    self.setPluginEnabled = function(_isPluginEnabled) {
        pluginEnabled = _isPluginEnabled;
    };

    self.initAudioContext = function(){
        window.AudioContext = window.AudioContext || window.webkitAudioContext ||
        window.mozAudioContext || window.oAudioContext || window.msAudioContext;
        audioContext = new window.AudioContext();
    };

    self.getAudioContext = function(){
        return audioContext;
    };

    self.initMediaStreamDestination = function(){
        mediaStreamDestination = self.getAudioContext().createMediaStreamDestination();
    };

    self.getMediaStreamDestination = function(){
        return mediaStreamDestination;
    };

};
if (__testonly__) { __testonly__.WebRtcAdaptorModel = WebRtcAdaptorModel; }

var WebRtcChromeAdaptorModel = function() {
    var self = this;
};
WebRtcChromeAdaptorModel.prototype = new WebRtcAdaptorModel();
if (__testonly__) { __testonly__.WebRtcChromeAdaptorModel = WebRtcChromeAdaptorModel; }

var WebRtcFirefoxAdaptorModel = function() {
    var self = this, 
        // Since Firefox supports H264 by default, this attribute set as true
        h264Enabled = true;
    
    self.isH264Enabled = function (){
        return h264Enabled;
    };
    
    self.setH264Enabled = function (enabled){
        h264Enabled = enabled === true ? true : false;
    };
};
WebRtcFirefoxAdaptorModel.prototype = new WebRtcAdaptorModel();
if (__testonly__) { __testonly__.WebRtcFirefoxAdaptorModel = WebRtcFirefoxAdaptorModel; }

var WebRtcPluginAdaptorModel = function() {
    var self = this,
        //this variable will be always set by a plugin adaptor.
        pluginVersion={
            major:               0,
            minor:               0,

            min_revision:        0,
            min_build:           0,

            current_revision:    0,
            current_build:       0
        };
    
    self.getPluginVersion = function() {
        return pluginVersion;
    };

    self.setPluginVersion = function(version) {
        pluginVersion = version;
    };
};
WebRtcPluginAdaptorModel.prototype = new WebRtcAdaptorModel();
if (__testonly__) { __testonly__.WebRtcPluginAdaptorModel = WebRtcPluginAdaptorModel; }
var webRtcLibraryDecoratorImpl = function(target, _super) {
    var libraryObjWrapper = {};

    libraryObjWrapper.getUserMedia = target.getUserMedia;
    libraryObjWrapper.showSettingsWindow = target.showSettingsWindow;
    libraryObjWrapper.getURLFromStream = target.getURLFromStream;
    libraryObjWrapper.enableH264 = target.enableH264;

    libraryObjWrapper.createRTCSessionDescription = function(type, sdp) {
        return target.createSessionDescription(type, sdp);
    };

    libraryObjWrapper.createRTCIceCandidate = function(candidate, type, number) {
        return target.createIceCandidate(candidate, type, number);
    };

    libraryObjWrapper.createRTCPeerConnection = function(stunturn, constraints) {
        return target.createPeerConnection(stunturn, constraints);
    };

    libraryObjWrapper.setLang = function(lang) {
        target.setLanguage(lang || "en");
    };

    libraryObjWrapper.checkMediaSourceAvailability = function(callback) {
        utils.callFunctionIfExist(callback, {videoSourceAvailable: (target.getVideoDeviceNames().length > 0) ? true : false,
            audioSourceAvailable: (target.getAudioOutDeviceNames().length > 0) ? true : false,
            screenSourceAvailable: false });
    };

    libraryObjWrapper.get_audioInDeviceCount = function() {
        return target.getAudioInDeviceNames().length;
    };

    libraryObjWrapper.get_audioOutDeviceCount = function() {
        return target.getAudioOutDeviceNames().length;
    };

    libraryObjWrapper.get_videoDeviceCount = function() {
        return target.getVideoDeviceNames().length;
    };

    libraryObjWrapper.set_logSeverityLevel = function(level) {
        target.logSeverityLevel = level;
        return true;
    };

    libraryObjWrapper.get_logSeverityLevel = function() {
        return target.logSeverityLevel;
    };

    libraryObjWrapper.enable_logCallback = function(handler) {
        target.logCallback = handler;
        return true;
    };

    libraryObjWrapper.disable_logCallback = function(){
        target.logCallback = null;
    };

    libraryObjWrapper.setType = function(applicationType) {
        target.type = applicationType;
    };

    libraryObjWrapper.getType = function() {
        return target.type;
    };

    libraryObjWrapper.getVersion = function() {
        return target.version;
    };

    libraryObjWrapper.setH264CodecStateChangeHandler = function(handler) {
        target.onh264codecstatechange = handler;
    };

    libraryObjWrapper.getCurrentPluginVersionObject = function() {
        var splittedPluginVersion = target.version.split("."),
                currentPluginVersion;

        currentPluginVersion = {
            major: parseInt(splittedPluginVersion[0], 10),
            minor: parseInt(splittedPluginVersion[1], 10),
            revision: parseInt(splittedPluginVersion[2], 10),
            build: parseInt(splittedPluginVersion[3], 10)
        };
        return currentPluginVersion;
    };

    return libraryObjWrapper;
};

var webRtcLibraryDecorator = function(target, _super) {
    return webRtcLibraryDecoratorImpl(target || {}, _super);
};

if (__testonly__) { __testonly__.webRtcLibraryDecorator = webRtcLibraryDecorator; }

var webRtcLibraryFirefoxDecoratorImpl = function(target, _super, _window, _navigator) {
    _super(target);

    target.getUserMedia = function(constraints, successCallback, failureCallback) {
        _navigator.mozGetUserMedia(constraints, successCallback, failureCallback);
    };

    target.getScreenMedia = function(constraints, onSuccess, onFailure) {
        utils.callFunctionIfExist(onFailure, fcs.call.MediaErrors.NO_SCREENSHARING_WARNING);
    };

    target.initScreenSharing = function(onSuccess, onFailure) {
        utils.callFunctionIfExist(onFailure, fcs.call.MediaErrors.NO_SCREENSHARING_WARNING);
    };

    target.showSettingsWindow = function() {
        return;
    };

    target.createRTCSessionDescription = function(type, sdp) {
        return new _window.mozRTCSessionDescription({"type": type, "sdp": sdp});
    };

    target.createRTCIceCandidate = function(candidate) {
        return  new _window.mozRTCIceCandidate(candidate);
    };

    target.getURLFromStream = function(stream) {
        return _window.URL.createObjectURL(stream);
    };

    target.createRTCPeerConnection = function(stunturn, constraints) {
        return new _window.mozRTCPeerConnection(stunturn, constraints);
    };

    target.checkMediaSourceAvailability = function(callback) {
        // Since _window.MediaStreamTrack.getSources or an equal method is not defined in Firefox Native,
        // sources set as true by default. This should be changed if method or workaround about getting sources provided.
        var videoSourceAvailable = true, audioSourceAvailable = true;
        utils.callFunctionIfExist(callback, {videoSourceAvailable: videoSourceAvailable,
            audioSourceAvailable: audioSourceAvailable,
            screenSourceAvailable: false });
    };

    target.get_audioInDeviceCount = function() {
        return 1;   // Use right method for Firefox Native
    };

    target.get_audioOutDeviceCount = function() {
        return 1;   // Use right method for Firefox Native
    };

    target.get_videoDeviceCount = function() {
        return 1;   // Use right method for Firefox Native
    };

    target.set_logSeverityLevel = function() {
        return false; // Not Applicable for Firefox Native
    };

    target.get_logSeverityLevel = function() {
        return; // Not Applicable for Firefox Native
    };

    target.enable_logCallback = function() {
        return; // Not Applicable for Firefox Native
    };

    target.disable_logCallback = function(){
        return; // Not Applicable for Firefox Native
    };
};

var webRtcLibraryFirefoxDecorator = function(target, _super, _window, _navigator) {
    webRtcLibraryFirefoxDecoratorImpl(target || {},
            _super || webRtcLibraryDecorator,
            _window || window,
            _navigator || navigator);
};

if (__testonly__) { __testonly__.webRtcLibraryFirefoxDecorator = webRtcLibraryFirefoxDecorator; }

var webRtcLibraryChromeDecoratorImpl = function(target, _super, _window, _navigator) {
    var screenShareExtensionLoaded = false, screenShareExtensionId;

    _super(target);

    target.getUserMedia = function(constraints, successCallback, failureCallback) {
        _navigator.webkitGetUserMedia(constraints, successCallback, failureCallback);
    };

    target.getScreenMedia = function(constraints, onSuccess, onFailure) {
        var extSuccessCallback = function(response) {
            if (response && response.mediaSourceId) {
                constraints.audio = false;
                constraints.video.mandatory.chromeMediaSource = 'desktop';
                constraints.video.mandatory.chromeMediaSourceId = response.mediaSourceId;

                target.getUserMedia(constraints, onSuccess, onFailure);
            } else {
                utils.callFunctionIfExist(onFailure);
            }
        };

        if (screenShareExtensionLoaded) {
            window.chrome.runtime.sendMessage(screenShareExtensionId, {
                message: "chooseDesktopMedia"
            }, extSuccessCallback);
        }
    };

    target.initScreenSharing = function(onSuccess, onFailure, options) {
        var screenSharingOpts = options.screenSharing;

        if (screenSharingOpts && screenSharingOpts.chromeExtensionId) {
            screenShareExtensionId = screenSharingOpts.chromeExtensionId;
            try {

                window.chrome.runtime.sendMessage(screenShareExtensionId, { message: "version" }, function(response) {
                    if (response && response.version) {
                        screenShareExtensionLoaded = true;
                        utils.callFunctionIfExist(onSuccess);
                    } else {
                        utils.callFunctionIfExist(onFailure, fcs.call.MediaErrors.NO_SCREENSHARING_WARNING);
                    }
                });
            } catch (error) {
                utils.callFunctionIfExist(onFailure, fcs.call.MediaErrors.NO_SCREENSHARING_WARNING);
            }
        } else {
            utils.callFunctionIfExist(onSuccess);
        }
    };


    target.showSettingsWindow = function() {
        return;
    };

    target.createRTCSessionDescription = function(type, sdp) {
        return new _window.RTCSessionDescription({"type": type, "sdp": sdp});
    };

    target.createRTCIceCandidate = function(candidate) {
        return  new _window.RTCIceCandidate(candidate);
    };

    target.getURLFromStream = function(stream){
        return _window.URL.createObjectURL(stream);
    };

    target.createRTCPeerConnection = function(stunturn, constraints) {
        return new _window.webkitRTCPeerConnection(stunturn, constraints);
    };

    target.checkMediaSourceAvailability = function(callback) {
        var i, listOfNativeMediaStream, videoSourceAvailable, audioSourceAvailable;
        listOfNativeMediaStream = _window.MediaStreamTrack;
        if (typeof listOfNativeMediaStream !== 'undefined') {
            listOfNativeMediaStream.getSources(function(mediaSources) {
                for (i = 0; i < mediaSources.length; i++) {
                    if (mediaSources[i].kind === "video") {
                        // Video source is available such as webcam
                        videoSourceAvailable = true;
                    } else if (mediaSources[i].kind === "audio") {
                        // audio source is available such as mic
                        audioSourceAvailable = true;
                    }
                }
                utils.callFunctionIfExist(callback, {videoSourceAvailable: videoSourceAvailable,
                    audioSourceAvailable: audioSourceAvailable,
                    screenSourceAvailable: screenShareExtensionLoaded});
            });
        }
    };

    target.get_audioInDeviceCount = function() {
        return 1;   // Use right method for Chrome Native
    };

    target.get_audioOutDeviceCount = function() {
        return 1;   // Use right method for Chrome Native
    };

    target.get_videoDeviceCount = function() {
        return 1;   // Use right method for Chrome Native
    };

    target.set_logSeverityLevel = function() {
        return false; // Not Applicable for Chrome Native
    };

    target.get_logSeverityLevel = function() {
        return; // Not Applicable for Chrome Native
    };

    target.enable_logCallback = function() {
        return; // Not Applicable for Chrome Native
    };

    target.disable_logCallback = function(){
        return; // Not Applicable for Chrome Native
    };
};

var webRtcLibraryChromeDecorator = function(target, _super, _window, _navigator) {
    webRtcLibraryChromeDecoratorImpl(target || {},
            _super || webRtcLibraryDecorator,
            _window || window,
            _navigator || navigator);
};

if (__testonly__) { __testonly__.webRtcLibraryChromeDecorator = webRtcLibraryChromeDecorator; }

var WebRtcAdaptorImpl = function(_super, _decorator, _model, _logManager) {
    /*
     * ABE-832: On MAC OS, Safari browser version 6.1 doesn't recognize array
     * indices of integer type. Therefore, all [0] calls are changed to ["0"].
     * All other browser types function correctly with both integer and string
     * indices.
     *
     * Right now, this only affects arrays coming from the plugin.
     *
     * That's why we use zero = "0". Using "0" directly didn't work because
     * minification replaces it with 0.
     */
    var self = this, logger = _logManager.getLogger("WebRtcAdaptorImpl"), zero = "0";

    logger.debug('WebRtcAdaptor initializing');

    utils.compose(_model, self);

    function stopMediaStream(stream) {
        if (stream && stream.getTracks) {
            stream.getTracks().forEach(function(track) {
                track.stop();
            });
        } else if (stream && stream.stop) {
            stream.stop();
        }
    }

    self.storeStableRemoteAndLocalSdpInCall = function(call) {
        if (call && call.peer) {
            if (call.peer.signalingState === CONSTANTS.WEBRTC.RTC_SIGNALING_STATE.STABLE)
            {
                call.stableRemoteSdp = call.peer.remoteDescription.sdp;
                call.stableLocalSdp = call.peer.localDescription.sdp;
            }
        }
    };

    /*
     * Sdp workarounds performed before createOffer
     * TODO all workarounds should be detected and filled in here
     */
    self.performSdpWorkaroundsAfterCreateOffer = function(call, oSdp) {
        oSdp.sdp = sdpParser.replaceCodecs(oSdp.sdp, call.codecsToReplace ? call.codecsToReplace : fcsConfig.codecsToReplace);
        return oSdp;
    };

    /*
     * Overrides configured codec values with originators value, in this case, webRtc is terminator side
     */
    self.overrideConfiguredCodecValues = function(call, sdp) {
        var index, newValue;
        call.codecsToReplace = call.codecsToReplace ? call.codecsToReplace :JSON.parse(JSON.stringify(fcsConfig.codecsToReplace));
        if (call.codecsToReplace) {
            for (index = 0; index < call.codecsToReplace.length; index++) {
                newValue = sdpParser.getPayloadTypeOf(call.codecsToReplace[index].name, sdp);
                if (newValue && (newValue !== -1)) {
                    // getPayloadTypeOf method could return
                    // either array or string
                    // In such case, arrays first element will be used
                    if (typeof newValue === 'array') {
                        newValue = newValue[0];
                    }
                    call.codecsToReplace[index].value = newValue;
                }
            }
        }
    };

    //This function is called internally when we make a new call or hold/unhold scenario
    // Native implementation lies on webRtcAdaptor.js
    self.addLocalStream = function(internalCall) {
        var streamUrl, fireEvent = false,
                isSendingLocalVideo = self.canOriginatorSendLocalVideo(internalCall);

        if (internalCall.localMedia.stream) {
            if (isSendingLocalVideo) {
                streamUrl = self.getRtcLibrary().getURLFromStream(internalCall.localMedia.stream);

                if (streamUrl) {
                    if (self.getDefaultVideoContainer()) {
                        fireEvent = self.useDefaultRenderer(streamUrl, true, true);
                    } else if (self.getLocalVideoContainer()) {
                        fireEvent = self.createStreamRenderer(streamUrl, self.getLocalVideoContainer(), {
                            muted: true});
                    } else {
                        internalCall.call.localStreamURL = streamUrl;
                        fireEvent = true;
                    }
                }
            } else {
                if (self.getDefaultVideoContainer()) {
                    if (self.getDefaultVideoContainer().lastElementChild) {
                        self.disposeStreamRenderer(self.getDefaultVideoContainer().lastElementChild);
                    }
                } else if (self.getLocalVideoContainer()) {
                    self.disposeStreamRenderer(self.getLocalVideoContainer());
                }
            }

            logger.debug("onLocalStreamAdded: " + streamUrl);
            if (fireEvent) {
                self.fireOnLocalStreamAddedEvent(internalCall, streamUrl);
            }
        }
    };

    // Native implementation lies on webRtcAdaptor.js

    self.fireOnLocalStreamAddedEvent = function(call, streamUrl) {
        if (call && call.call && call.call.onLocalStreamAdded) {
            utils.callFunctionIfExist(call.call.onLocalStreamAdded, streamUrl);
        }
    };

    self.storeLocalStreamToCall = function(call, localStreamId) {
        logger.debug("assigning local stream [" + localStreamId + "] to call: " + call.id);
        call.localMedia = self.getLocalStreamMap().get(localStreamId);
    };

    self.performSdpWorkaroundsBeforeProcessingIncomingSdp = function(call) {
        call.sdp = sdpParser.deleteBandwidthLineFromSdp(call.sdp);
        call.sdp = sdpParser.removeG722Codec(call.sdp);
        call.sdp = sdpParser.fixRemoteTelephoneEventPayloadType(call, call.sdp);
    };

    /*
     * createNativeReOffer
     */
    self.createReOffer = function(call, onSuccess, onFailure, usePreviousAudioDirection) {
        var peer = call.peer, localDescObj, localAudioDirection,
                localVideoDirection, prevLocalSdp = call.peer.localDescription.sdp;

        logger.debug("createReOffer:" + call.id);

        if (self.createNewPeerForCall(call))
        {
            peer = call.peer;
        }

        peer.createOffer(
                function prwCreateOfferSuccessCallback(oSdp) {
                    localVideoDirection = sdpParser.getVideoSdpDirection(prevLocalSdp);
                    oSdp.sdp = sdpParser.updateVideoSdpDirection(oSdp.sdp, localVideoDirection);

                    if (usePreviousAudioDirection) {
                        localAudioDirection = sdpParser.getAudioSdpDirection(prevLocalSdp);
                    oSdp.sdp = sdpParser.updateAudioSdpDirection(oSdp.sdp, localAudioDirection);
                    }

                    oSdp.sdp = sdpParser.deleteCryptoZeroFromSdp(oSdp.sdp);
                    oSdp.sdp = sdpParser.updateAudioCodec(oSdp.sdp);
                    oSdp.sdp = sdpParser.removeG722Codec(oSdp.sdp);
                    oSdp.sdp = sdpParser.deleteCryptoFromSdp(oSdp.sdp, self.isDtlsEnabled());
                    oSdp.sdp = sdpParser.setTcpSetupAttributeToActpass(oSdp.sdp, self.isDtlsEnabled());
                    oSdp.sdp = sdpParser.fixLocalTelephoneEventPayloadType(call, oSdp.sdp);
                    oSdp.sdp = sdpParser.updateVersion(prevLocalSdp, oSdp.sdp);
                    oSdp = self.performSdpWorkaroundsAfterCreateOffer(call, oSdp);


                    localDescObj = self.getRtcLibrary().createRTCSessionDescription(CONSTANTS.WEBRTC.RTC_SDP_TYPE.OFFER, oSdp.sdp);
                    peer.setLocalDescription(
                            localDescObj,
                            function prwSetLocalDescriptionSuccessCallback() {
                                logger.debug("createReOffer: setLocalDescription success" + call.id);
                            },
                            function prwSetLocalDescriptionFailureCallback(e) {
                                logger.debug("createReOffer: setLocalDescription failed!!" + e + call.id);
                                utils.callFunctionIfExist(onFailure);
                            });
                },
                function prwCreateOfferFailureCallback(e) {
                    logger.error("createReOffer: createOffer failed!! " + e);
                    utils.callFunctionIfExist(onFailure);
                },
                {
                    'mandatory': {
                        'OfferToReceiveAudio': self.getMediaAudio(),
                        'OfferToReceiveVideo': self.getMediaVideo()
                    }
                });
    };

    // Native implementation lies on webRtcAdaptor.js
    self.getLocalAudioTrack = function(peer) {
        logger.debug("getLocalAudioTrack");
        var audioTracks;



        if(peer.localStreams && peer.localStreams[zero].audioTracks) {
            if (peer.localStreams[zero].audioTracks.length > 0) {
                return peer.localStreams[zero].audioTracks[zero];
            }
        }
        else if (peer.getLocalStreams) {
            audioTracks = peer.getLocalStreams()[zero].getAudioTracks();
            if(audioTracks && audioTracks.length > 0) {
                return audioTracks[zero];
            }
        }

        return null;
    };

    // Native implementation lies on webRtcAdaptor.js
    self.getLocalVideoTrack = function(peer) {
        logger.debug("getLocalVideoTrack");
        var streams;

        if(peer.localStreams && peer.localStreams[zero].videoTracks) {
            if (peer.localStreams[zero].videoTracks.length > 0) {
                return peer.localStreams[zero].videoTracks[zero];
            }
        }
        else if (peer.getLocalStreams) {
            streams = peer.getLocalStreams();
            if(streams && streams[zero].getVideoTracks() && streams[zero].getVideoTracks().length > 0) {
                return streams[zero].getVideoTracks()[zero];
            }
        }

        return null;
    };

    self.muteAudioTrack = function(call, mute) {
        var localAudioTrack;

        if (!self.isInitialized()) {
            logger.warn("muteAudioTrack: Plugin is not installed");
            return;
        }

        if (!call.peer) {
            return;
        }

        localAudioTrack = self.getLocalAudioTrack(call.peer);
        if (localAudioTrack) {
            logger.info("mute Audio Track [" + localAudioTrack.id + "], call [" + call.id + "] mute=" + mute);
            localAudioTrack.enabled = !mute;
            call.audioMuted = mute;
        }
    };

    self.muteVideoTrack = function(call, mute) {
        var localVideoTrack;

        if (!self.isInitialized()) {
            logger.warn("muteVideoTrack: Plugin is not installed");
            return;
        }

        if (!call.peer) {
            return;
        }

        localVideoTrack = self.getLocalVideoTrack(call.peer);
        if (localVideoTrack) {
            logger.info("mute Video Track [" + localVideoTrack.id + "], call [" + call.id + "] mute=" + mute);
            localVideoTrack.enabled = !mute;
            call.videoMuted = mute;
        }
    };

    /*
     * Native implementation lies on webRtcAdaptor.js
     * Mutes audio and video tracks (to be used during Hold)
     *
     * @ignore
     * @name rtc.mute
     * @function
     * @param {Object} call internalCall
     * @param {boolean} mute true to mute, false to unmute
     */
    self.muteOnHold = function(call, mute) {
        self.muteAudioTrack(call, mute);
        self.muteVideoTrack(call, mute);
    };

    // Native implementation lies on webRtcAdaptor.js
    self.setMediaSources = function(mediaSourceInfo) {
        if (mediaSourceInfo) {
            self.setVideoSourceAvailable(mediaSourceInfo.videoSourceAvailable);
            self.setAudioSourceAvailable(mediaSourceInfo.audioSourceAvailable);
            self.setScreenSourceAvailable(mediaSourceInfo.screenSourceAvailable);
        }
    };
    // Native implementation lies on webRtcAdaptor.js
    // initNativeMedia
    self.initMedia = function(onSuccess, onFailure, options) {
        self.setInitialized(true);
        _decorator(self.getRtcLibrary());

        if(options) {
            if (options.localVideoContainer) {
                self.setLocalVideoContainer(options.localVideoContainer);
            }

            if (options.remoteVideoContainer) {
                self.setRemoteVideoContainer(options.remoteVideoContainer);
            }

            if (options.videoContainer) {
                self.setDefaultVideoContainer(options.videoContainer);
            }
        }

        function setMediaSources() {
            self.getRtcLibrary().checkMediaSourceAvailability(function mediaSourceCallback(mediaSourceInfo) {
                self.setMediaSources(mediaSourceInfo);
            });
        }

        self.getRtcLibrary().initScreenSharing(function() {
            // Regardless of success or error, set the media sources.
            setMediaSources();

            utils.callFunctionIfExist(onSuccess);
        }, function(error) {
            // Regardless of success or error, set the media sources.
            setMediaSources();

            utils.callFunctionIfExist(onFailure, error);
        }, options);
    };

    /*
     * Native implementation lies on webRtcAdaptor.js
     * performNativeVideoStartWorkaround - term side cannot see orig's video
     */
    self.performVideoStartWorkaround = function(call, onSuccess, onFail) {
        var peer = call.peer, remoteAudioState, remoteVideoState, callSdpWithNoSsrc;

        logger.debug("Workaround to play video");

        call.sdp = sdpParser.addSdpMissingCryptoLine(call.sdp);

        remoteAudioState = sdpParser.getAudioSdpDirection(call.sdp);
        remoteVideoState = sdpParser.getVideoSdpDirection(call.sdp);

        call.sdp = sdpParser.updateAudioSdpDirectionToInactive(call.sdp);
        call.sdp = sdpParser.updateVideoSdpDirectionToInactive(call.sdp);

        call.sdp = sdpParser.setTcpSetupAttributeToActpass(call.sdp, self.isDtlsEnabled());

        // In Peer-Peer call, in order to remove remote stream properly,
        // ssrc lines should be deleted so that workaround below will
        // first remove the remote stream and then re-add it according to
        // actuall call sdp.
        // In Non Peer-Peer call, ther is no ssrc line in sdp so it is safe
        // to keep method below.
        callSdpWithNoSsrc = sdpParser.deleteSsrcFromSdp(call.sdp);

        peer.setRemoteDescription(
                self.getRtcLibrary().createRTCSessionDescription(CONSTANTS.WEBRTC.RTC_SDP_TYPE.OFFER, callSdpWithNoSsrc),
                function pvswFirstSetRemoteDescriptionSuccessCallback() {
                    logger.debug("performVideoStartWorkaround: first setRemoteDescription success");

                    // restore original values
                    call.sdp = sdpParser.updateAudioSdpDirection(call.sdp, remoteAudioState);
                    call.sdp = sdpParser.updateVideoSdpDirection(call.sdp, remoteVideoState);

                    peer.setRemoteDescription(
                            self.getRtcLibrary().createRTCSessionDescription(CONSTANTS.WEBRTC.RTC_SDP_TYPE.OFFER, call.sdp),
                            function pvswSecondSetRemoteDescriptionSuccessCallback() {
                                logger.debug("performVideoStartWorkaround: second setRemoteDescription success");
                                peer.createAnswer(
                                        function pvswCreateAnswerSuccessCallback(obj) {
                                            if (remoteAudioState === CONSTANTS.WEBRTC.MEDIA_STATE.INACTIVE) {
                                                obj.sdp = sdpParser.updateAudioSdpDirectionToInactive(obj.sdp);
                                            }

                                            if (remoteVideoState === CONSTANTS.WEBRTC.MEDIA_STATE.INACTIVE) {
                                                obj.sdp = sdpParser.updateVideoSdpDirectionToInactive(obj.sdp);
                                            } else if (self.canOriginatorSendLocalVideo(call)) {
                                                obj.sdp = sdpParser.updateVideoSdpDirection(obj.sdp, CONSTANTS.WEBRTC.MEDIA_STATE.SEND_RECEIVE);
                                            } else {
                                                obj.sdp = sdpParser.updateVideoSdpDirection(obj.sdp, CONSTANTS.WEBRTC.MEDIA_STATE.RECEIVE_ONLY);
                                            }

                                            obj.sdp = sdpParser.checkAndRestoreICEParams(obj.sdp, call.sdp);

                                            obj.sdp = sdpParser.setTcpSetupAttributeTo(obj.sdp, call.localTcpSetupAttribute, self.isDtlsEnabled());

                                            obj.sdp = sdpParser.fixLocalTelephoneEventPayloadType(call, obj.sdp);

                                            peer.setLocalDescription(
                                                    self.getRtcLibrary().createRTCSessionDescription(CONSTANTS.WEBRTC.RTC_SDP_TYPE.ANSWER, obj.sdp),
                                                    function pvswSetLocalDescriptionSuccessCallback() {
                                                        logger.debug("performVideoStartWorkaround: setlocalDescription success");
                                                        utils.callFunctionIfExist(onSuccess);
                                                    },
                                                    function pvswSetLocalDescriptionFailureCallback(e) {
                                                        logger.debug("performVideoStartWorkaround: setlocalDescription failed!!" + e);
                                                        utils.callFunctionIfExist(onFail, "performVideoStartWorkaround: setlocalDescription failed!!");
                                                    });
                                        },
                                        function pvswCreateAnswerFailureCallback(e) {
                                            logger.debug("performVideoStartWorkaround: createAnswer failed!! " + e);
                                            utils.callFunctionIfExist(onFail, "Session cannot be created");
                                        },
                                        {
                                            'mandatory': {
                                                'OfferToReceiveAudio': self.getMediaAudio(),
                                                'OfferToReceiveVideo': self.getMediaVideo()
                                            }
                                        });
                            },
                            function pvswSecondSetRemoteDescriptionFailureCallback(e) {
                                logger.debug("performVideoStartWorkaround: second setRemoteDescription failed!!" + e);
                                utils.callFunctionIfExist(onFail, "performVideoStartWorkaround: second setRemoteDescription failed!!");
                            });
                },
                function pvswFirstSetRemoteDescriptionFailureCallback(e) {
                    logger.debug("performVideoStartWorkaround: first setRemoteDescription failed!!" + e);
                    utils.callFunctionIfExist(onFail, "performVideoStartWorkaround: first setRemoteDescription failed!!");
                });
    };

    /*
     * Native implementation lies on webRtcAdaptor.js
     */
    self.getUserMedia = function(onSuccess, onFailure) {
        self.getRtcLibrary().checkMediaSourceAvailability(function mediaSourceCallback(mediaSourceInfo) {
            var video_constraints;
            self.setMediaSources(mediaSourceInfo);
            if (self.getMediaVideo() && self.getVideoSourceAvailable()) {
                video_constraints = {
                    mandatory: {
                        //"minFrameRate": "30",
                        "maxWidth": self.getVideoWidth(),
                        "maxHeight": self.getVideoHeight(),
                        "minWidth": self.getVideoWidth(),
                        "minHeight": self.getVideoHeight()}
                };
            } else {
                video_constraints = false;
            }

            self.getRtcLibrary().getUserMedia({
                audio: self.getMediaAudio(),
                video: video_constraints
            }, function getUserMediaSuccessCallback(stream) {
                var mediaInfo, mediaStreamSource, localMedia ={};

                self.initAudioContext();
                mediaStreamSource = self.getAudioContext().createMediaStreamSource(stream);
                self.initMediaStreamDestination();
                mediaStreamSource.connect(self.getMediaStreamDestination());

                if (stream.getVideoTracks() && stream.getVideoTracks()[zero]) {
                    self.getMediaStreamDestination().stream.addTrack(stream.getVideoTracks()[zero]);
                }

                self.setUserMediaStream(stream);

                localMedia.audioContext = self.getAudioContext();
                localMedia.mediaStreamDestination = self.getMediaStreamDestination();
                localMedia.stream = self.getMediaStreamDestination().stream;

                self.getLocalStreamMap().add(localMedia.stream.id, localMedia);

                self.setInitialized(true);
                mediaInfo = {
                    "audio": self.getMediaAudio(),
                    "video": self.getMediaVideo(),
                    "id": localMedia.stream.id
                };

                logger.debug("user hcreateOfferas granted access to local media: ", localMedia);
                utils.callFunctionIfExist(onSuccess, mediaInfo);
            }, function getUserMediaFailureCallback(error) {
                logger.debug("Failed to get access to local media. Error code was " + error.code);
                utils.callFunctionIfExist(onFailure, fcs.call.MediaErrors.NOT_ALLOWED);
            });
        });
    };

    self.replaceVideoStream = function(newStream) {
        var mediaStreamDestination = self.getMediaStreamDestination(),
            mediaStream,
            mediaStreamId,
            videoTracks,
            i = 0;

        if (mediaStreamDestination) {
            mediaStream = mediaStreamDestination.stream;
            if (mediaStream) {
                mediaStreamId = mediaStream.id;
                videoTracks = mediaStream.getVideoTracks();
                for(; i < videoTracks.length; ++i) {
                    mediaStream.removeTrack(videoTracks[i]);
                }

                if (newStream && newStream.getVideoTracks() && newStream.getVideoTracks()[zero]) {
                    mediaStream.addTrack(newStream.getVideoTracks()[zero]);
                }
            }
        }

        return {
            audio: self.getMediaAudio(),
            video: self.getMediaVideo(),
            id: mediaStreamId
        };
    };

    /*
     * Native implementation lies on webRtcAdaptor.js
     */
    self.startScreenMedia = function(onSuccess, onFailure, onEnded) {
        self.getRtcLibrary().checkMediaSourceAvailability(function mediaSourceCallback(mediaSourceInfo) {
            var video_constraints;
            self.setMediaSources(mediaSourceInfo);
            if (self.getScreenSourceAvailable()) {
                video_constraints = {
                    mandatory: {
                        "maxFrameRate": self.getScreenFrameRate(),
                        "maxWidth": self.getScreenWidth(),
                        "maxHeight": self.getScreenHeight()
                    }
                };

                self.getRtcLibrary().getScreenMedia({
                    video: video_constraints
                }, function(stream) {
                    var mediaInfo = self.replaceVideoStream(stream),
                        oldStream = self.getScreenStream();

                    // If there is an old screen stream, just stop it but prevent the stop from happening
                    if(oldStream) {
                        oldStream.onended = null;
                        stopMediaStream(oldStream);
                    }

                    stream.onended = onEnded;
                    self.setScreenStream(stream);

                    logger.debug("user granted access to local media.");
                    utils.callFunctionIfExist(onSuccess, mediaInfo);

                }, function() {
                    logger.debug("Failed to get access to screen media.");
                    utils.callFunctionIfExist(onFailure, fcs.call.MediaErrors.NOT_ALLOWED);
                }, onEnded);
            } else {
                utils.callFunctionIfExist(onFailure, fcs.call.MediaErrors.NOT_FOUND);
            }
        });
    };



    self.stopScreenMedia = function() {
        var screenStream = self.getScreenStream();

        self.replaceVideoStream(self.getUserMediaStream());

        if (screenStream) {
            stopMediaStream(screenStream);
            self.setScreenStream(null);
        }
    };

    // createNativeOffer, Native implementation lies on webRtcAdaptor.js
    self.createOffer = function (call, successCallback, failureCallback, sendInitialVideo) {
        logger.debug("createOffer: sendInitialVideo= " + sendInitialVideo + " state= " + call.peer.signalingState);
        var peer = call.peer;

        call.peer.addStream(call.localMedia.stream);

        self.addCallIdInPluginContainer(call);

        peer.createOffer(
                function createOfferSuccessCallback(oSdp) {
                    sendInitialVideo = sendInitialVideo && self.getVideoSourceAvailable();
                    if (sendInitialVideo) {
                        oSdp.sdp = sdpParser.updateVideoSdpDirection(oSdp.sdp, CONSTANTS.WEBRTC.MEDIA_STATE.SEND_RECEIVE);
                    } else {
                        oSdp.sdp = sdpParser.updateVideoSdpDirection(oSdp.sdp, CONSTANTS.WEBRTC.MEDIA_STATE.RECEIVE_ONLY);
                    }

                    oSdp.sdp = sdpParser.deleteCryptoZeroFromSdp(oSdp.sdp);

                    oSdp.sdp = sdpParser.updateAudioCodec(oSdp.sdp);
                    oSdp.sdp = sdpParser.removeG722Codec(oSdp.sdp);

                    oSdp.sdp = sdpParser.deleteCryptoFromSdp(oSdp.sdp, self.isDtlsEnabled());
                    oSdp.sdp = sdpParser.setTcpSetupAttributeToActpass(oSdp.sdp, self.isDtlsEnabled());

                    oSdp.sdp = sdpParser.fixLocalTelephoneEventPayloadType(call, oSdp.sdp);
                    oSdp = self.performSdpWorkaroundsAfterCreateOffer(call, oSdp);

                    peer.setLocalDescription(
                            self.getRtcLibrary().createRTCSessionDescription(CONSTANTS.WEBRTC.RTC_SDP_TYPE.OFFER, oSdp.sdp),
                            function createOfferSetLocalDescriptionSuccessCallback() {
                                //Due to stun requests, successCallback will be called by onNativeIceCandidate()
                            }
                    , function createOfferSetLocalDescriptionFailureCallback(error) {
                        logger.error("createOffer: setLocalDescription failed : " + error);
                        utils.callFunctionIfExist(failureCallback, "createOffer: setLocalDescription failed");
                    });
                }, function createOfferFailureCallback(e) {
            logger.error("createOffer: createOffer failed!! " + e);
            utils.callFunctionIfExist(failureCallback);
        },
                {
                    'mandatory': {
                        'OfferToReceiveAudio': self.getMediaAudio(),
                        'OfferToReceiveVideo': self.getMediaVideo()
                    }
                });
    };

    /*
     *  Native implementation lies on webRtcAdaptor.js
     *  createNativeAnswer to be used when native webrtc is enabled.
     *  @param {type} call
     *  @param {type} successCallback
     *  @param {type} failureCallback
     *  @param {type} isVideoEnabled
     */
    self.createAnswer = function(call, successCallback, failureCallback, isVideoEnabled) {
        logger.debug("createAnswer: isVideoEnabled= " + isVideoEnabled + " state= " + call.peer.signalingState);
        var peer = call.peer;

        call.peer.addStream(call.localMedia.stream);
        call.sdp = sdpParser.checkSupportedVideoCodecs(call.sdp, null, self.isH264Enabled());
        call.sdp = sdpParser.changeDirection(call.sdp, CONSTANTS.WEBRTC.MEDIA_STATE.INACTIVE, CONSTANTS.WEBRTC.MEDIA_STATE.SEND_RECEIVE, CONSTANTS.STRING.AUDIO);
        call.sdp = sdpParser.deleteFingerprintOrCrypto(call.sdp, self.isDtlsEnabled());

        self.addCallIdInPluginContainer(call);

        if (!sdpParser.isSdpVideoSendEnabled(call.sdp)) {
            // delete ssrc only from video, keep audio ssrc to hear audio
            call.sdp = sdpParser.deleteInactiveVideoSsrc(call.sdp);
        }
        peer.setRemoteDescription(
                self.getRtcLibrary().createRTCSessionDescription(CONSTANTS.WEBRTC.RTC_SDP_TYPE.OFFER, call.sdp),
            function createAnswerSetRemoteDescriptionSuccessCallback(){
                    call.remoteVideoState = sdpParser.getSdpDirection(call.sdp, CONSTANTS.STRING.VIDEO);

                    peer.createAnswer(
                            function(oSdp) {
                                isVideoEnabled = isVideoEnabled && self.getVideoSourceAvailable() && sdpParser.isSdpHasVideo(call.sdp);

                                if (isVideoEnabled) {
                                    if (sdpParser.isSdpVideoSendEnabled(call.sdp)) {
                                        oSdp.sdp = sdpParser.updateSdpDirection(oSdp.sdp, CONSTANTS.STRING.VIDEO, CONSTANTS.WEBRTC.MEDIA_STATE.SEND_RECEIVE);
                                    } else {
                                        if (sdpParser.getVideoSdpDirection(call.sdp) !== CONSTANTS.WEBRTC.MEDIA_STATE.INACTIVE) {
                                        oSdp.sdp = sdpParser.updateSdpDirection(oSdp.sdp, CONSTANTS.STRING.VIDEO, CONSTANTS.WEBRTC.MEDIA_STATE.SEND_ONLY);
                                        }
                                        else {
                                            oSdp.sdp = sdpParser.updateSdpDirection(oSdp.sdp, CONSTANTS.STRING.VIDEO, CONSTANTS.WEBRTC.MEDIA_STATE.INACTIVE);
                                    }
                                    }
                                } else {
                                    if (sdpParser.isSdpVideoSendEnabled(call.sdp)) {
                                        oSdp.sdp = sdpParser.updateSdpDirection(oSdp.sdp, CONSTANTS.STRING.VIDEO, CONSTANTS.WEBRTC.MEDIA_STATE.RECEIVE_ONLY);
                                    } else {
                                        oSdp.sdp = sdpParser.updateSdpDirection(oSdp.sdp, CONSTANTS.STRING.VIDEO, CONSTANTS.WEBRTC.MEDIA_STATE.INACTIVE);
                                    }
                                }

                                self.muteOnHold(call, false);

                                oSdp.sdp = sdpParser.fixLocalTelephoneEventPayloadType(call, oSdp.sdp);

                                // createAnswer generates an sdp without ice params
                                // copy ice params to the local sdp
                                // scenario: incoming video call from pcc in brokeronly config
                                oSdp.sdp = sdpParser.checkAndRestoreICEParams(oSdp.sdp, call.sdp);

                                peer.setLocalDescription(
                                        self.getRtcLibrary().createRTCSessionDescription(CONSTANTS.WEBRTC.RTC_SDP_TYPE.ANSWER, oSdp.sdp),
                                        function createAnswerSetLocalDescriptionSuccessCallback(){
                                            //Due to stun requests, successCallback will be called by onNativeIceCandidate()
                                            call.videoOfferSent = sdpParser.isSdpHasVideo(oSdp.sdp);
                                            self.setTcpSetupAttiributesOnCreateAnswer(call, oSdp.sdp);
                                        },
                                        function createAnswerSetLocalDescriptionFailureCallback(e) {
                                            logger.error("createAnswer: setLocalDescription failed : " + e);
                                            utils.callFunctionIfExist(failureCallback, "createNativeAnswer setLocalDescription failed");
                                        });
                            },
                            function createAnswerFailureCallback(e){
                                logger.error("createAnswer: failed!! Error: " + e);
                                utils.callFunctionIfExist(failureCallback, "Session cannot be created");
                            },
                            {
                                'mandatory': {
                                    'OfferToReceiveAudio': self.getMediaAudio(),
                                    'OfferToReceiveVideo': self.getMediaVideo()
                                }
                            });
                },
                function createAnswerSetRemoteDescriptionFailureCallback(e){
                    logger.error("createAnswer: setremotedescription failed!! Error: " + e);
                });
    };

    /*
     * Native implementation lies on webRtcAdaptor.js
     * createNativeUpdate to be used when the video start or stop
     */
    self.createUpdate = function(call, successCallback, failureCallback, isVideoStart) {
        logger.debug("createUpdate: isVideoStart= " + isVideoStart + " state= " + call.peer.signalingState);
        var peer = call.peer,
            localSdp, localDesc;

        localSdp = call.peer.localDescription.sdp;
        localSdp = sdpParser.fixLocalTelephoneEventPayloadType(call, localSdp);
        localSdp = sdpParser.incrementVersion(localSdp);

        logger.debug("create new offer to start the video");

        if (self.createNewPeerForCall(call)) {
            peer = call.peer;
        }

        self.setMediaVideo(true);
        peer.createOffer(
            function createUpdateCreateOfferSuccessCallback(obj) {
                isVideoStart = isVideoStart && self.getVideoSourceAvailable();
                if (isVideoStart) {
                    obj.sdp = sdpParser.updateVideoSdpDirection(obj.sdp, CONSTANTS.WEBRTC.MEDIA_STATE.SEND_RECEIVE);
                } else {
                    if (sdpParser.isVideoSdpDirectionInactive(call.stableRemoteSdp)) {
                        obj.sdp = sdpParser.updateVideoSdpDirectionToInactive(obj.sdp);
                    } else {
                        obj.sdp = sdpParser.updateVideoSdpDirection(obj.sdp, CONSTANTS.WEBRTC.MEDIA_STATE.RECEIVE_ONLY);
                    }
                }

                obj.sdp = sdpParser.setTcpSetupAttributeToActpass(obj.sdp, self.isDtlsEnabled());
                obj.sdp = sdpParser.fixLocalTelephoneEventPayloadType(call, obj.sdp);
                obj.sdp = sdpParser.deleteCryptoZeroFromSdp(obj.sdp);
                obj.sdp = sdpParser.updateAudioCodec(obj.sdp);
                obj.sdp = sdpParser.removeG722Codec(obj.sdp);
                obj.sdp = sdpParser.deleteCryptoFromSdp(obj.sdp, self.isDtlsEnabled());
                obj = self.performSdpWorkaroundsAfterCreateOffer(call, obj);

                localDesc = self.getRtcLibrary().createRTCSessionDescription(CONSTANTS.WEBRTC.RTC_SDP_TYPE.OFFER, obj.sdp);

                peer.setLocalDescription(localDesc,
                    function createUpdateCreateOfferSetLocalDescriptionSuccessCallback() {
                        //since the candidates have changed we will call the successCallback at onNativeIceCandidate
                        //utils.callFunctionIfExist(successCallback);
                        logger.debug("createUpdate: createOffer setLocalDescription success ");
                    },
                    function crateUpdateCreateOfferSetLocalDescriptionFailureCallback(e) {
                        logger.debug("createUpdate: createOffer setLocalDescription failed: " + e);
                        utils.callFunctionIfExist(failureCallback);
                    });
            },
            function createUpdateCrateOfferFailureCallback(e) {
                logger.debug("createUpdate: createOffer failed!!: " + e);
                failureCallback();
            }, {
                'mandatory': {
                    'OfferToReceiveAudio': self.getMediaAudio(),
                    'OfferToReceiveVideo': self.getMediaVideo()
                }
            }
        );
    };

    /*
     * Reverts RTC engine's state
     */
    self.revertRtcState = function(call, successCallback, failureCallback) {
        var peer = call.peer, obj, localSdp = call.stableLocalSdp,
                remoteSdp = call.stableRemoteSdp,
                rtcState = peer.signalingState;
        remoteSdp = sdpParser.deleteGoogleIceFromSdp(remoteSdp);
        switch (rtcState) {
            case CONSTANTS.WEBRTC.RTC_SIGNALING_STATE.STABLE:
            case CONSTANTS.WEBRTC.RTC_SIGNALING_STATE.HAVE_LOCAL_OFFER:
                localSdp = sdpParser.setTcpSetupAttributeToActpass(localSdp, self.isDtlsEnabled());
                obj = self.getRtcLibrary().createRTCSessionDescription(CONSTANTS.WEBRTC.RTC_SDP_TYPE.OFFER, localSdp);
                peer.setLocalDescription(obj,
                        function revertRtcStateLocalDescriptionSuccessCallback() {
                            logger.debug("revertRtcState[stable|local_offer]: setLocalDescription success");
                            remoteSdp = sdpParser.setTcpSetupAttributeTo(remoteSdp, call.remoteTcpSetupAttribute, self.isDtlsEnabled());
                            obj = self.getRtcLibrary().createRTCSessionDescription(CONSTANTS.WEBRTC.RTC_SDP_TYPE.ANSWER, remoteSdp);
                            peer.setRemoteDescription(obj,
                                    function revertRtcStateRemoteDescriptionSuccessCallback() {
                                        logger.debug("revertRtcState[stable|local_offer]: setRemoteDescription success");
                                        utils.callFunctionIfExist(successCallback, call);
                                    }, function revertRtcStateRemoteDescriptionFailureCallback(error) {
                                        logger.error("revertRtcState[stable|local_offer]: setRemoteDescription failed: " + error);
                                        utils.callFunctionIfExist(failureCallback, call);
                            });
                        },
                        function revertRtcStateLocalDescriptionFailureCallback(error) {
                            logger.error("revertRtcState[stable|local_offer]: setLocalDescription failed: " + error);
                            utils.callFunctionIfExist(failureCallback, call);
                        });
                break;
            case CONSTANTS.WEBRTC.RTC_SIGNALING_STATE.HAVE_REMOTE_OFFER:
                remoteSdp = sdpParser.setTcpSetupAttributeToActpass(remoteSdp, self.isDtlsEnabled());
                obj = self.getRtcLibrary().createRTCSessionDescription(CONSTANTS.WEBRTC.RTC_SDP_TYPE.OFFER, remoteSdp);
                peer.setRemoteDescription(obj,
                        function revertRtcStateRemoteDescriptionSuccessCallback() {
                            logger.debug("revertRtcState[remote_offer]: setLocalDescription success");
                            localSdp = sdpParser.setTcpSetupAttributeTo(localSdp, call.localTcpSetupAttribute, self.isDtlsEnabled());
                            obj = self.getRtcLibrary().createRTCSessionDescription(CONSTANTS.WEBRTC.RTC_SDP_TYPE.ANSWER, localSdp);
                            peer.setLocalDescription(obj,
                                    function revertRtcStateLocalDescriptionSuccessCallback() {
                                        logger.debug("revertRtcState[remote_offer]: setRemoteDescription success");
                                        utils.callFunctionIfExist(successCallback, call);
                                    }, function revertRtcStateLocalDescriptionFailureCallback(error) {
                                logger.error("revertRtcState[remote_offer]: setRemoteDescription failed: " + error);
                                utils.callFunctionIfExist(failureCallback, call);
                            });
                        },
                        function revertRtcStateRemoteDescriptionFailureCallback(error) {
                            logger.error("revertRtcState[remote_offer]: setLocalDescription failed: " + error);
                            utils.callFunctionIfExist(failureCallback, call);
                        });
                break;
            default:
                logger.debug("revertRtcState: not applicible for state: " + rtcState);
        }
    };

    /*
     * Native implementation lies on webRtcAdaptor.js
     * createNativeHoldUpdate to be used when native webrtc is enabled
     */
    self.createHoldUpdate = function(call, hold, remote_hold_status, successCallback, failureCallback) {
        logger.debug("createHoldUpdate: local hold= " + hold + " remote hold= " + remote_hold_status + " state= " + call.peer.signalingState);
        var peer = call.peer,
                audioDirection,
                videoDirection,
                muteCall,
                localDescObj;

        audioDirection = sdpParser.getAudioSdpDirection(peer.localDescription.sdp);
        videoDirection = sdpParser.getVideoSdpDirection(peer.localDescription.sdp);

        if (self.createNewPeerForCall(call))
        {
            peer = call.peer;
        }

        peer.createOffer(function createHoldUpdateCreateOfferSuccessCallback(obj) {

            obj.sdp = sdpParser.incrementVersion(obj.sdp);
            obj.sdp = sdpParser.deleteCryptoZeroFromSdp(obj.sdp);
            obj.sdp = sdpParser.setTcpSetupAttributeToActpass(obj.sdp, self.isDtlsEnabled());
            obj = self.performSdpWorkaroundsAfterCreateOffer(call, obj);

        //two sdp-s are created here
        //one is to be used by rest-request (externalSdp)
        //one is to set the audio-video direction of the local call (localSdp)
        //this is needed in order to adapt to the rfc (needs sendrecv to sendonly transition)
        //and to the plugin (needs inactive to mute audio and video connection)

            if (hold || remote_hold_status) {
            if (audioDirection === CONSTANTS.WEBRTC.MEDIA_STATE.SEND_RECEIVE) {
                    obj.sdp = sdpParser.updateAudioSdpDirection(obj.sdp, CONSTANTS.WEBRTC.MEDIA_STATE.SEND_ONLY);
            } else {
                if (!hold && remote_hold_status) {
                        obj.sdp = sdpParser.updateAudioSdpDirection(obj.sdp, CONSTANTS.WEBRTC.MEDIA_STATE.SEND_RECEIVE);
                } else {
                        obj.sdp = sdpParser.updateAudioSdpDirectionToInactive(obj.sdp);
                }
            }
            if (videoDirection === CONSTANTS.WEBRTC.MEDIA_STATE.SEND_RECEIVE) {
                    obj.sdp = sdpParser.updateVideoSdpDirection(obj.sdp, CONSTANTS.WEBRTC.MEDIA_STATE.SEND_ONLY);
            } else {
                if (!hold && remote_hold_status) {
                        obj.sdp = sdpParser.updateVideoSdpDirection(obj.sdp, CONSTANTS.WEBRTC.MEDIA_STATE.SEND_RECEIVE);
                } else {
                        obj.sdp = sdpParser.updateVideoSdpDirectionToInactive(obj.sdp);
                }
            }
            muteCall = true;
        } else {
                obj.sdp = sdpParser.updateAudioSdpDirection(obj.sdp, CONSTANTS.WEBRTC.MEDIA_STATE.SEND_RECEIVE);
                if (self.canOriginatorSendLocalVideo(call)) {
                    obj.sdp = sdpParser.updateVideoSdpDirection(obj.sdp, CONSTANTS.WEBRTC.MEDIA_STATE.SEND_RECEIVE);
            } else {
                    obj.sdp = sdpParser.updateVideoSdpDirection(obj.sdp, CONSTANTS.WEBRTC.MEDIA_STATE.RECEIVE_ONLY);
            }
            muteCall = false;
        }

            obj.sdp = sdpParser.fixLocalTelephoneEventPayloadType(call, obj.sdp);

            localDescObj = self.getRtcLibrary().createRTCSessionDescription(CONSTANTS.WEBRTC.RTC_SDP_TYPE.OFFER, obj.sdp);

            peer.setLocalDescription(localDescObj,
                function createHoldUpdateSetLocalDescriptionSuccessCallback() {
                    logger.debug("createHoldUpdate: setLocalDescription success");
                    self.muteOnHold(call, muteCall);
                },
                    function createHoldUpdateSetLocalDescriptionFailureCallback(error) {
                        logger.error("createHoldUpdate: setLocalDescription failed: " + error.message);
                    utils.callFunctionIfExist(failureCallback);
                });
        }, function createHoldUpdateCreateOfferFailureCallback(error) {
            logger.error("createHoldUpdate: createOffer failed: " + error.message);
                    utils.callFunctionIfExist(failureCallback);
        }, {
                    'mandatory': {
                        'OfferToReceiveAudio': self.getMediaAudio(),
                'OfferToReceiveVideo': self.getMediaVideo()
                    }
                });
    };

    // Native implementation lies on webRtcAdaptor.js
    // processNativeHold
    self.processHold = function(call, hold, local_hold_status, successCallback, failureCallback) {
        logger.debug("processHold: local hold= " + local_hold_status + " remote hold= " + hold + " state= " + call.peer.signalingState);
        var peer = call.peer, updateSdp, audioDirection, videoDirection,
                peerRemoteSdp, peerLocalSdp, inactiveRemoteSdp;

        if (!local_hold_status && !hold) {
            self.muteOnHold(call, false);
        }

        call.sdp = sdpParser.checkSupportedVideoCodecs(call.sdp, null, self.isH264Enabled());
        call.sdp = sdpParser.performVideoPortZeroWorkaround(call.sdp);
        call.sdp = sdpParser.checkAndRestoreICEParams(call.sdp, call.peer.localDescription.sdp);

        audioDirection = sdpParser.getAudioSdpDirection(call.sdp);
        videoDirection = sdpParser.getVideoSdpDirection(call.sdp);

        peerRemoteSdp = call.prevRemoteSdp;
        peerLocalSdp = peer.localDescription.sdp;
        updateSdp = self.getRtcLibrary().createRTCSessionDescription(CONSTANTS.WEBRTC.RTC_SDP_TYPE.OFFER, call.sdp);
        inactiveRemoteSdp = self.getRtcLibrary().createRTCSessionDescription(CONSTANTS.WEBRTC.RTC_SDP_TYPE.OFFER, updateSdp.sdp);

        inactiveRemoteSdp.sdp = sdpParser.updateAudioSdpDirectionToInactive(inactiveRemoteSdp.sdp); // chrome38 fix
        inactiveRemoteSdp.sdp = sdpParser.updateVideoSdpDirectionToInactive(inactiveRemoteSdp.sdp); // chrome38 fix

        //call.sdp is given because of plugin crash
        if (self.createNewPeerForCall(call))
        {
            peer = call.peer;
        }
        inactiveRemoteSdp.sdp = sdpParser.deleteSsrcFromSdp(inactiveRemoteSdp.sdp);

        // 1st setRemoteDescription to make webrtc remove the audio and/or video streams
        // 2nd setRemote will add the audio stream back so that services like MOH can work
        // This code will also run in UnHold scenario, and it will remove & add video stream
        peer.setRemoteDescription(
                inactiveRemoteSdp,
                function processHoldSetFirstRemoteDescriptionSuccessCallback() {
                    updateSdp.sdp = sdpParser.updateAudioSdpDirection(updateSdp.sdp, CONSTANTS.WEBRTC.MEDIA_STATE.SEND_RECEIVE);
                    //updateSdp.sdp = updateSdpDirection(updateSdp.sdp, video, videoDirection);

                    if (sdpParser.getVideoSdpDirection(updateSdp.sdp) === CONSTANTS.WEBRTC.MEDIA_STATE.INACTIVE ||
                            sdpParser.getVideoSdpDirection(updateSdp.sdp) === CONSTANTS.WEBRTC.MEDIA_STATE.RECEIVE_ONLY)
                    {
                        updateSdp.sdp = sdpParser.deleteInactiveVideoSsrc(updateSdp.sdp);
                    }
                    peer.setRemoteDescription(
                            updateSdp,
                            function processHoldSetSecondRemoteDescriptionSuccessCallback() {
                                if (!hold && !local_hold_status && (videoDirection === CONSTANTS.WEBRTC.MEDIA_STATE.INACTIVE)) {
                                    call.remoteVideoState = CONSTANTS.WEBRTC.MEDIA_STATE.RECEIVE_ONLY;
                                } else{
                                    call.remoteVideoState = sdpParser.getVideoSdpDirection(updateSdp.sdp);
                                }
                                peer.createAnswer(
                                    function processHoldCreateAnswerSuccessCallback(obj){
                                            logger.debug("processHold: isSdpEnabled audio= " + sdpParser.isAudioSdpEnabled(obj.sdp));
                                            logger.debug("processHold: isSdpEnabled video= " + sdpParser.isVideoSdpEnabled(obj.sdp));

                                            if (hold) {
                                                logger.debug("processHold: Remote HOLD");
                                                obj.sdp = sdpParser.respondToRemoteSdpDirections(obj.sdp, call.sdp);
                                            } else if (!local_hold_status) {
                                                logger.debug("processHold: Remote UNHOLD: direction left as it is");

                                                if (sdpParser.isSdpVideoSendEnabled(call.sdp)) {
                                                    if (self.canOriginatorSendLocalVideo(call)) {
                                                        obj.sdp = sdpParser.updateVideoSdpDirection(obj.sdp, CONSTANTS.WEBRTC.MEDIA_STATE.SEND_RECEIVE);
                                                    } else {
                                                        obj.sdp = sdpParser.updateVideoSdpDirection(obj.sdp, CONSTANTS.WEBRTC.MEDIA_STATE.RECEIVE_ONLY);
                                                        }
                                                } else {
                                                    if (self.canOriginatorSendLocalVideo(call) && !sdpParser.isVideoSdpDirectionInactive(call.sdp)) {
                                                            obj.sdp = sdpParser.updateVideoSdpDirection(obj.sdp, CONSTANTS.WEBRTC.MEDIA_STATE.SEND_ONLY);
                                                } else {
                                                        obj.sdp = sdpParser.updateVideoSdpDirection(obj.sdp, CONSTANTS.WEBRTC.MEDIA_STATE.INACTIVE);
                                                    }
                                                }
                                                //change audio's direction to sendrecv for ssl attendees in a 3wc
                                                obj.sdp = sdpParser.changeDirection(obj.sdp, CONSTANTS.WEBRTC.MEDIA_STATE.RECEIVE_ONLY, CONSTANTS.WEBRTC.MEDIA_STATE.SEND_RECEIVE, CONSTANTS.STRING.AUDIO);
                                            } else if (local_hold_status && !hold) {
                                                logger.debug("processHold: Remote UNHOLD on local hold");

                                                if (audioDirection === CONSTANTS.WEBRTC.MEDIA_STATE.INACTIVE) {
                                                    obj.sdp = sdpParser.updateAudioSdpDirectionToInactive(obj.sdp);
                                                } else {
                                                    obj.sdp = sdpParser.updateAudioSdpDirection(obj.sdp, CONSTANTS.WEBRTC.MEDIA_STATE.SEND_ONLY);
                                                }

                                                if (self.canOriginatorSendLocalVideo(call)) {
                                                    obj.sdp = sdpParser.updateVideoSdpDirection(obj.sdp, CONSTANTS.WEBRTC.MEDIA_STATE.SEND_ONLY);
                                                } else {
                                                    obj.sdp = sdpParser.updateVideoSdpDirectionToInactive(obj.sdp);
                                                }
                                            }

                                            obj.sdp = sdpParser.updateVersion(peerLocalSdp, obj.sdp);
                                            obj.sdp = sdpParser.checkIceParamsLengths(obj.sdp, updateSdp.sdp);
                                            obj.sdp = sdpParser.fixLocalTelephoneEventPayloadType(call, obj.sdp);

                                            obj.sdp = sdpParser.setTcpSetupAttributeTo(obj.sdp, call.localTcpSetupAttribute, self.isDtlsEnabled());

                                            peer.setLocalDescription(
                                                    obj,
                                                    function processHoldSetLocalDescriptionSuccessCallback() {
                                                        logger.debug("processHold: setLocalDescription success!! ");
                                                    },
                                                    function processHoldSetLocalDescriptionFailureCallback(e) {
                                                        logger.error("processHold: setLocalDescription failed!! " + e);
                                                        utils.callFunctionIfExist(failureCallback, "Session cannot be created");
                                                    });
                                        },
                                        function processHoldCreateAnswerFailureCallback(e){
                                            logger.error("processHold: createAnswer failed!!: " + e);
                                            utils.callFunctionIfExist(failureCallback, "Session cannot be created");
                                        },
                                        {
                                            'mandatory': {
                                                'OfferToReceiveAudio': self.getMediaAudio(),
                                                'OfferToReceiveVideo': self.getMediaVideo()
                                            }
                                        });
                            },
                            function processHoldSetSecondRemoteDescriptionFailureCallback(e) {
                                logger.error("processHold: second setRemoteDescription failed!! " + e);
                                utils.callFunctionIfExist(failureCallback, "Session cannot be created");
                            });
                },
                function processHoldSetFirstRemoteDescriptionFailureCallback(e) {
                    logger.debug("processHold: first setRemoteDescription failed!! " + e);
                    utils.callFunctionIfExist(failureCallback, "Session cannot be created");
                });
    };

    // Native implementation lies on webRtcAdaptor.js
    // processNativeUpdate
    self.processUpdate = function(call, successCallback, failureCallback, local_hold_status) {
        logger.debug("processUpdate: state= " + call.peer.signalingState);
        var peer = call.peer, remoteAudioState, remoteVideoState, remoteVideoDirection, localVideoDirection, callSdpWithNoSsrc,
                remoteDescObj, localDescObj, peerRemoteSdp, peerLocalSdp;

        call.sdp = sdpParser.addSdpMissingCryptoLine(call.sdp); // Meetme workaround
        call.sdp = sdpParser.checkAndRestoreICEParams(call.sdp, call.peer.localDescription.sdp);

        remoteVideoDirection = sdpParser.getVideoSdpDirection(call.sdp);
        localVideoDirection = sdpParser.getVideoSdpDirection(peer.localDescription.sdp);

        self.setMediaVideo(sdpParser.isSdpHasVideo(call.sdp));
        if (remoteVideoDirection === CONSTANTS.WEBRTC.MEDIA_STATE.INACTIVE &&
                call.currentState === "COMPLETED")
        {
            switch(call.remoteVideoState){
                case CONSTANTS.WEBRTC.MEDIA_STATE.INACTIVE:
                    call.sdp = sdpParser.updateVideoSdpDirection(call.sdp, CONSTANTS.WEBRTC.MEDIA_STATE.SEND_RECEIVE);
                    break;
                case CONSTANTS.WEBRTC.MEDIA_STATE.RECEIVE_ONLY:
                    call.sdp = sdpParser.updateVideoSdpDirection(call.sdp, CONSTANTS.WEBRTC.MEDIA_STATE.SEND_RECEIVE);
                    break;
                case CONSTANTS.WEBRTC.MEDIA_STATE.SEND_RECEIVE:
                    call.sdp = sdpParser.updateVideoSdpDirection(call.sdp, CONSTANTS.WEBRTC.MEDIA_STATE.RECEIVE_ONLY);
                    break;
            }
        }

        call.sdp = sdpParser.changeDirection(call.sdp, CONSTANTS.WEBRTC.MEDIA_STATE.SEND_ONLY, CONSTANTS.WEBRTC.MEDIA_STATE.SEND_RECEIVE, CONSTANTS.STRING.VIDEO);

        call.sdp = sdpParser.checkSupportedVideoCodecs(call.sdp, null, self.isH264Enabled());
        //this part is a work-around for webrtc bug
        //set remote description with inactive media lines first.
        //then set remote description with original media lines.

        //keep original values of remote audio and video states
        remoteAudioState = sdpParser.getAudioSdpDirection(call.sdp);
        remoteVideoState = sdpParser.getVideoSdpDirection(call.sdp);

        //This is highly required for meetme on DTLS
        call.sdp = sdpParser.setTcpSetupAttributeToActpass(call.sdp, self.isDtlsEnabled());

        // delete all ssrc lines from the sdp before setting first remote description
        // set second remote description with all ssrc lines included
        if (remoteVideoState === CONSTANTS.WEBRTC.MEDIA_STATE.INACTIVE ||
            remoteVideoState === CONSTANTS.WEBRTC.MEDIA_STATE.RECEIVE_ONLY)
        {
            call.sdp = sdpParser.deleteInactiveVideoSsrc(call.sdp);
        }

        peerRemoteSdp = self.getRtcLibrary().createRTCSessionDescription(CONSTANTS.WEBRTC.RTC_SDP_TYPE.OFFER, call.prevRemoteSdp);
        peerLocalSdp = peer.localDescription.sdp;

        if (self.createNewPeerForCall(call)) {
            peer = call.peer;
        }

        if (sdpParser.isSdpHas(call.prevRemoteSdp, CONSTANTS.STRING.VIDEO) || sdpParser.isIceLite(call.sdp) || local_hold_status)
        {
            //set media lines with inactive state for workaround
            call.sdp = sdpParser.updateAudioSdpDirectionToInactive(call.sdp);
            call.sdp = sdpParser.updateVideoSdpDirectionToInactive(call.sdp);

            callSdpWithNoSsrc = sdpParser.deleteSsrcFromSdp(call.sdp);
            remoteDescObj = self.getRtcLibrary().createRTCSessionDescription(CONSTANTS.WEBRTC.RTC_SDP_TYPE.OFFER, callSdpWithNoSsrc);

            peer.setRemoteDescription(
                remoteDescObj,
                function processUpdateWorkaroundSetRemoteDescriptionSuccessCallback() {
                    logger.debug("processUpdate: workaround setRemoteDescription success");

                    //restore original values
                    call.sdp = sdpParser.updateAudioSdpDirection(call.sdp, remoteAudioState);
                    call.sdp = sdpParser.updateVideoSdpDirection(call.sdp, remoteVideoState);

                    remoteDescObj = self.getRtcLibrary().createRTCSessionDescription(CONSTANTS.WEBRTC.RTC_SDP_TYPE.OFFER, call.sdp);
                    peer.setRemoteDescription(
                        remoteDescObj,
                        function processUpdateSetRemoteDescriptionSuccessCallback() {
                            logger.debug("processUpdate: setRemoteDescription success");
                            call.remoteVideoState = sdpParser.getVideoSdpDirection(call.sdp);

                            peer.createAnswer(
                                function processUpdateCreateAnswerSuccessCallback(obj) {
                                    logger.debug("processUpdate: isSdpEnabled audio= " + sdpParser.isAudioSdpEnabled(obj.sdp));
                                    logger.debug("processUpdate: isSdpEnabled video= " + sdpParser.isVideoSdpEnabled(obj.sdp));

                                    if (sdpParser.isSdpVideoSendEnabled(call.sdp)) {
                                        if (self.canOriginatorSendLocalVideo(call)) {
                                            obj.sdp = sdpParser.updateVideoSdpDirection(obj.sdp, CONSTANTS.WEBRTC.MEDIA_STATE.SEND_RECEIVE);
                                        } else {
                                            obj.sdp = sdpParser.updateVideoSdpDirection(obj.sdp, CONSTANTS.WEBRTC.MEDIA_STATE.RECEIVE_ONLY);
                                        }
                                    } else {
                                        if (self.canOriginatorSendLocalVideo(call) && !sdpParser.isVideoSdpDirectionInactive(call.sdp)) {
                                            obj.sdp = sdpParser.updateVideoSdpDirection(obj.sdp, CONSTANTS.WEBRTC.MEDIA_STATE.SEND_ONLY);
                                        } else {
                                            obj.sdp = sdpParser.updateVideoSdpDirection(obj.sdp, CONSTANTS.WEBRTC.MEDIA_STATE.INACTIVE);
                                        }
                                    }
                                    obj.sdp = sdpParser.updateVersion(peerLocalSdp, obj.sdp);
                                    obj.sdp = sdpParser.fixLocalTelephoneEventPayloadType(call, obj.sdp);
                                    obj.sdp = sdpParser.checkIceParamsLengths(obj.sdp, remoteDescObj.sdp);
                                    obj.sdp = sdpParser.setTcpSetupAttributeTo(obj.sdp, call.localTcpSetupAttribute, self.isDtlsEnabled());

                                    localDescObj = self.getRtcLibrary().createRTCSessionDescription(CONSTANTS.WEBRTC.RTC_SDP_TYPE.ANSWER, obj.sdp);
                                    peer.setLocalDescription(
                                        localDescObj,
                                        function processUpdateSetLocalDescriptionSuccessCallback() {
                                        logger.debug("processUpdate: setlocalDescription success");
                                        },
                                        function processUpdateSetLocalDescriptionSuccessCallback(e) {
                                            logger.debug("processUpdate: setlocalDescription failed!!" + e);
                                            utils.callFunctionIfExist(failureCallback, "processUpdate: setlocalDescription failed!!");
                                        }
                                    );
                                },
                                function processUpdateCreateAnswerFailureCallback(e) {
                                    logger.debug("processUpdate: createAnswer failed!! " + e);
                                    utils.callFunctionIfExist(failureCallback, "Session cannot be created");
                                },
                                {
                                    'mandatory': {
                                        'OfferToReceiveAudio': self.getMediaAudio(),
                                        'OfferToReceiveVideo': self.getMediaVideo()
                                    }
                                }
                            );
                        },
                        function processUpdateSetRemoteDescriptionSuccessCallback(e) {
                            logger.debug("processUpdate: setRemoteDescription failed!!" + e);
                            utils.callFunctionIfExist(failureCallback, "processUpdate: setRemoteDescription failed!!");
                        }
                    );
                },
                function processUpdateWorkaroundSetRemoteDescriptionSuccessCallback(e) {
                    logger.debug("processUpdate: workaround setRemoteDescription failed!!" + e);
                    utils.callFunctionIfExist(failureCallback, "processUpdate: workaround setRemoteDescription failed!!");
                }
            );
        }
        else {
            remoteDescObj = self.getRtcLibrary().createRTCSessionDescription(CONSTANTS.WEBRTC.RTC_SDP_TYPE.OFFER, call.sdp);
            peer.setRemoteDescription(
                remoteDescObj,
                function processUpdateSetRemoteDescriptionSuccessCallback() {
                    logger.debug("processUpdate: setRemoteDescription success");
                    call.remoteVideoState = sdpParser.getVideoSdpDirection(call.sdp);

                    peer.createAnswer(
                        function processUpdateCreateAnswerSuccessCallback(obj) {
                            logger.debug("processUpdate: isSdpEnabled audio= " + sdpParser.isAudioSdpEnabled(obj.sdp));
                            logger.debug("processUpdate: isSdpEnabled video= " + sdpParser.isVideoSdpEnabled(obj.sdp));

                            if (sdpParser.isSdpVideoSendEnabled(call.sdp)) {
                                if (self.canOriginatorSendLocalVideo(call)) {
                                    obj.sdp = sdpParser.updateVideoSdpDirection(obj.sdp, CONSTANTS.WEBRTC.MEDIA_STATE.SEND_RECEIVE);
                                } else {
                                    obj.sdp = sdpParser.updateVideoSdpDirection(obj.sdp, CONSTANTS.WEBRTC.MEDIA_STATE.RECEIVE_ONLY);
                                }
                            } else {
                                if (self.canOriginatorSendLocalVideo(call) && !sdpParser.isVideoSdpDirectionInactive(call.sdp)) {
                                    obj.sdp = sdpParser.updateVideoSdpDirection(obj.sdp, CONSTANTS.WEBRTC.MEDIA_STATE.SEND_ONLY);
                                } else {
                                    obj.sdp = sdpParser.updateVideoSdpDirection(obj.sdp, CONSTANTS.WEBRTC.MEDIA_STATE.INACTIVE);
                                }
                            }
                            obj.sdp = sdpParser.updateVersion(peerLocalSdp, obj.sdp);
                            obj.sdp = sdpParser.fixLocalTelephoneEventPayloadType(call, obj.sdp);
                            obj.sdp = sdpParser.checkIceParamsLengths(obj.sdp, remoteDescObj.sdp);
                            obj.sdp = sdpParser.setTcpSetupAttributeTo(obj.sdp, call.localTcpSetupAttribute, self.isDtlsEnabled());

                            localDescObj = self.getRtcLibrary().createRTCSessionDescription(CONSTANTS.WEBRTC.RTC_SDP_TYPE.ANSWER, obj.sdp);
                            peer.setLocalDescription(
                                localDescObj,
                                function processUpdateSetLocalDescriptionSuccessCallback() {
                                    logger.debug("processUpdate: setlocalDescription success");
                                },
                                function processUpdateSetLocalDescriptionSuccessCallback(e) {
                                    logger.debug("processUpdate: setlocalDescription failed!!" + e);
                                    utils.callFunctionIfExist(failureCallback, "processUpdate: setlocalDescription failed!!");
                                });
                        },
                        function processUpdateCreateAnswerFailureCallback(e) {
                            logger.debug("processUpdate: createAnswer failed!! " + e);
                            utils.callFunctionIfExist(failureCallback, "Session cannot be created");
                        },
                        {
                            'mandatory': {
                                'OfferToReceiveAudio': self.getMediaAudio(),
                                'OfferToReceiveVideo': self.getMediaVideo()
                            }
                        }
                    );
                },
                function processUpdateSetRemoteDescriptionSuccessCallback(e) {
                    logger.debug("processUpdate: setRemoteDescription failed!!" + e);
                    utils.callFunctionIfExist(failureCallback, "processUpdate: setRemoteDescription failed!!");
                }
            );
        }
    };

    // Native implementation lies on webRtcAdaptor.js
    // processNativeAnswer
    self.processAnswer = function(call, onSuccess, onFail) {
        logger.debug("processAnswer: state= " + call.peer.signalingState);
        var onSuccessAfterWorkarounds, setRemoteDescription,
                remoteVideoDirection, localVideoDirection,
                peer = call.peer;

        onSuccessAfterWorkarounds = function() {
            call.remoteVideoState = sdpParser.getVideoSdpDirection(call.sdp);
            call.videoOfferSent = sdpParser.isSdpHasVideo(call.sdp);
            utils.callFunctionIfExist(onSuccess);
        };

        setRemoteDescription = function(call, onSuccess, onFailure) {
            call.peer.setRemoteDescription(
                    self.getRtcLibrary().createRTCSessionDescription(CONSTANTS.WEBRTC.RTC_SDP_TYPE.ANSWER, call.sdp),
                    function() {
                        logger.debug("processAnswer: setRemoteDescription success");
                        onSuccess();
                    },
                    function(e) {
                        logger.debug("processAnswer: setRemoteDescription failed: " + e);
                        onFailure();
                    });
        };

        self.setTcpSetupAttiributesOnProcessAnswer(call, call.sdp);
        call.sdp = sdpParser.checkSupportedVideoCodecs(call.sdp, peer.localDescription.sdp, self.isH264Enabled());
        call.sdp = sdpParser.performVideoPortZeroWorkaround(call.sdp);

        remoteVideoDirection = sdpParser.getVideoSdpDirection(call.sdp);
        localVideoDirection = sdpParser.getVideoSdpDirection(call.peer.localDescription.sdp);

        // this is needed for buggy webrtc api. when term answers with video to audio only call
        // this scenario does not work without converting to sendrecv
        logger.debug("processAnswer: ice-lite: do remote video escalation");
        call.sdp = sdpParser.changeDirection(call.sdp, CONSTANTS.WEBRTC.MEDIA_STATE.SEND_ONLY, CONSTANTS.WEBRTC.MEDIA_STATE.SEND_RECEIVE);

        if (localVideoDirection === CONSTANTS.WEBRTC.MEDIA_STATE.RECEIVE_ONLY &&
                (remoteVideoDirection === CONSTANTS.WEBRTC.MEDIA_STATE.INACTIVE || remoteVideoDirection === CONSTANTS.WEBRTC.MEDIA_STATE.RECEIVE_ONLY)) {

            // delete ssrc only from video, keep audio ssrc to hear audio
            call.sdp = sdpParser.deleteInactiveVideoSsrc(call.sdp);

            // Audio <--> Audio : apply workaround step 1

            setRemoteDescription(call, onSuccessAfterWorkarounds, onFail);

        } else if (localVideoDirection === CONSTANTS.WEBRTC.MEDIA_STATE.SEND_RECEIVE &&
                (remoteVideoDirection === CONSTANTS.WEBRTC.MEDIA_STATE.RECEIVE_ONLY || remoteVideoDirection === CONSTANTS.WEBRTC.MEDIA_STATE.INACTIVE)) {

            // delete ssrc only from video, keep audio ssrc to hear audio
            call.sdp = sdpParser.deleteInactiveVideoSsrc(call.sdp);

            // Audio-Video <--> Audio : apply workaround step 1 & 2

            setRemoteDescription(call, onSuccessAfterWorkarounds, onFail);

        } else if (localVideoDirection === CONSTANTS.WEBRTC.MEDIA_STATE.RECEIVE_ONLY &&
                (remoteVideoDirection === CONSTANTS.WEBRTC.MEDIA_STATE.SEND_ONLY || remoteVideoDirection === CONSTANTS.WEBRTC.MEDIA_STATE.SEND_RECEIVE)) {

            // Audio  <--> Audio-Video

            setRemoteDescription(call, function() {
                self.performVideoStartWorkaround(call, onSuccessAfterWorkarounds, onFail);
            }, onFail);

        } else {

            // Audio-Video <--> Audio-Video
            // there is remote video, no need for orig side workaround

            setRemoteDescription(call, onSuccessAfterWorkarounds, onFail);
        }

    };

    // Native implementation lies on webRtcAdaptor.js
    // processNativePreAnswer
    self.processPreAnswer = function(call) {
        logger.debug("processPreAnswer: state= " + call.peer.signalingState);
        var peer = call.peer, remoteDesc;

        call.sdp = sdpParser.checkSupportedVideoCodecs(call.sdp, call.peer.localDescription.sdp, self.isH264Enabled());
        call.sdp = sdpParser.removeG722Codec(call.sdp);
        call.sdp = sdpParser.fixRemoteTelephoneEventPayloadType(call, call.sdp);

        remoteDesc = self.getRtcLibrary().createRTCSessionDescription(CONSTANTS.WEBRTC.RTC_SDP_TYPE.ANSWER, call.sdp);
        peer.setRemoteDescription(
                remoteDesc,
                function processPreAnswerSetRemoteDescriptionSuccessCallback() {
                    self.setOriginatorReceiveRemoteVideo(call);
                    call.remoteVideoState = sdpParser.getVideoSdpDirection(call.sdp);
                    logger.debug("processPreAnswer: setRemoteDescription success");
                },
                function processPreAnswerSetRemoteDescriptionFailureCallback(e) {
                    logger.debug("processPreAnswer: setRemoteDescription failed: " + e );
                });
    };

    // Native implementation lies on webRtcAdaptor.js
    // processNativeRespond
    self.processRespond = function(call, onSuccess, onFail, isJoin) {
        var remoteVideoDirection, callSdpWithNoSsrc, remoteDescObj,
                peer = call.peer;
        logger.debug("processRespond: state= " + call.peer.signalingState);

        call.sdp = sdpParser.checkSupportedVideoCodecs(call.sdp, peer.localDescription.sdp, self.isH264Enabled());

        remoteVideoDirection = sdpParser.getVideoSdpDirection(call.sdp);

        if ((remoteVideoDirection === CONSTANTS.WEBRTC.MEDIA_STATE.INACTIVE) && (call.currentState === "COMPLETED"))
        {
            switch(call.remoteVideoState){
                case CONSTANTS.WEBRTC.MEDIA_STATE.INACTIVE:
                    call.sdp = sdpParser.updateVideoSdpDirection(call.sdp, CONSTANTS.WEBRTC.MEDIA_STATE.RECEIVE_ONLY);
                    break;
                case CONSTANTS.WEBRTC.MEDIA_STATE.RECEIVE_ONLY:
                    call.sdp = sdpParser.updateVideoSdpDirection(call.sdp, CONSTANTS.WEBRTC.MEDIA_STATE.RECEIVE_ONLY);
                    break;
            }
        }
        call.sdp = sdpParser.changeDirection(call.sdp, CONSTANTS.WEBRTC.MEDIA_STATE.SEND_ONLY, CONSTANTS.WEBRTC.MEDIA_STATE.SEND_RECEIVE, CONSTANTS.STRING.VIDEO);

        if (isJoin) {
            call.sdp = sdpParser.changeDirection(call.sdp, CONSTANTS.WEBRTC.MEDIA_STATE.RECEIVE_ONLY, CONSTANTS.WEBRTC.MEDIA_STATE.SEND_RECEIVE, CONSTANTS.STRING.AUDIO);
            self.muteOnHold(call, false);
        }

        if (call.peer.signalingState === CONSTANTS.WEBRTC.RTC_SIGNALING_STATE.STABLE) {
            //if we are in stable state we should not change remotedescription
            utils.callFunctionIfExist(onSuccess);
            return;
        }

        // delete all ssrc lines from the sdp before setting first remote description
        // set second remote description with all ssrc lines included

        if (sdpParser.getVideoSdpDirection(call.sdp) === CONSTANTS.WEBRTC.MEDIA_STATE.INACTIVE ||
                sdpParser.getVideoSdpDirection(call.sdp) === CONSTANTS.WEBRTC.MEDIA_STATE.RECEIVE_ONLY)
        {
            call.sdp = sdpParser.deleteInactiveVideoSsrc(call.sdp);
        }
        callSdpWithNoSsrc = sdpParser.deleteSsrcFromSdp(call.sdp);
        remoteDescObj = self.getRtcLibrary().createRTCSessionDescription(CONSTANTS.WEBRTC.RTC_SDP_TYPE.ANSWER, callSdpWithNoSsrc);

        peer.setRemoteDescription(
                remoteDescObj,
                function processRespondSetRemoteDescriptionSuccessCallback() {
                    logger.debug("processRespond: setRemoteDescription success");
                    var onSuccessAfterWorkarounds = function() {
                        call.remoteVideoState = sdpParser.getVideoSdpDirection(call.sdp);
                        call.videoOfferSent = true;
                        utils.callFunctionIfExist(onSuccess);
                    };
                    self.performVideoStartWorkaround(call, onSuccessAfterWorkarounds, onFail);
                },
                function processRespondSetRemoteDescriptionSuccessCallback(e) {
                    logger.debug("processRespond: setRemoteDescription failed: " + e);
                    utils.callFunctionIfExist(onFail);
                });
    };

    /*
     * Native implementation lies on webRtcAdaptor.js
     * processNativeHoldRespond
     */
    self.processHoldRespond = function(call, onSuccess, onFailure, isJoin) {
        var remoteAudioDirection,
            remoteVideoDirection,
            localVideoDirection,
            onSuccessAfterWorkaround,
            localHoldFlag = false,
            remoteHoldFlag = false,
            obj;

        onSuccessAfterWorkaround = function() {
            //call.remoteVideoState = getSdpDirection(call.sdp, video);
            utils.callFunctionIfExist(onSuccess);
        };

        logger.debug("processHoldRespond: state= " + call.peer.signalingState + " call.currentState= " + call.currentState);

        call.sdp = sdpParser.checkSupportedVideoCodecs(call.sdp, call.peer.localDescription.sdp, self.isH264Enabled());

        sdpParser.init(call.sdp);
        remoteHoldFlag = sdpParser.isRemoteHold();

        localHoldFlag = (call.currentState === "LOCAL_HOLD");

        if(!localHoldFlag){
            self.addCallIdInPluginContainer(call);
        }

        remoteAudioDirection = sdpParser.getAudioSdpDirection(call.sdp);
        remoteVideoDirection = sdpParser.getVideoSdpDirection(call.sdp);

        call.remoteVideoState = remoteVideoDirection;

        localVideoDirection = sdpParser.getVideoSdpDirection(call.peer.localDescription.sdp);

        logger.debug("processHoldRespond: localHold= " + localHoldFlag + " remoteHold= " + remoteHoldFlag);

        /* Required for MOH - start */
        if (remoteHoldFlag === false) {
            if ((remoteAudioDirection === CONSTANTS.WEBRTC.MEDIA_STATE.SEND_RECEIVE) && (call.currentState === "REMOTE_HOLD")) {
                logger.debug("set current web state to COMPLETED");
                call.previousState = call.currentState;
                call.currentState = "COMPLETED";
            }
        } else {
            if (call.currentState === "COMPLETED") {
                logger.debug("set current web state to REMOTE_HOLD");
                call.previousState = call.currentState;
                call.currentState = "REMOTE_HOLD";
            }
        }

        if (localHoldFlag || remoteHoldFlag) {
            logger.debug("processHoldRespond: " + call.currentState + " : video -> inactive");
            call.sdp = sdpParser.updateVideoSdpDirection(call.sdp, CONSTANTS.WEBRTC.MEDIA_STATE.INACTIVE);
        }

        if ((remoteVideoDirection === CONSTANTS.WEBRTC.MEDIA_STATE.INACTIVE) && (call.currentState === "COMPLETED")) {
            logger.debug("processHoldRespond: video inactive -> recvonly");
            call.sdp = sdpParser.updateVideoSdpDirection(call.sdp, CONSTANTS.WEBRTC.MEDIA_STATE.RECEIVE_ONLY);
        }
        /* Required for MOH - end */

        if (isJoin) {
            self.muteOnHold(call, false);
        }

        if (call.peer.signalingState === CONSTANTS.WEBRTC.RTC_SIGNALING_STATE.STABLE) {
            //if we are in stable state we should not change remotedescription
            utils.callFunctionIfExist(onSuccess);
            return;
        }

        // this is required for displaying remote video when direction is send only
        call.sdp = sdpParser.changeDirection(call.sdp, CONSTANTS.WEBRTC.MEDIA_STATE.SEND_ONLY, CONSTANTS.WEBRTC.MEDIA_STATE.SEND_RECEIVE);
        if (sdpParser.getVideoSdpDirection(call.sdp) === CONSTANTS.WEBRTC.MEDIA_STATE.INACTIVE ||
                sdpParser.getVideoSdpDirection(call.sdp) === CONSTANTS.WEBRTC.MEDIA_STATE.RECEIVE_ONLY)
        {
            call.sdp = sdpParser.deleteInactiveVideoSsrc(call.sdp);
        }

        obj = self.getRtcLibrary().createRTCSessionDescription(CONSTANTS.WEBRTC.RTC_SDP_TYPE.ANSWER, call.sdp);

        call.peer.setRemoteDescription(obj,
                function processHoldRespondSetRemoteDescriptionSuccessCallback() {
                    logger.debug("processHoldRespond: setRemoteDescription typeAns success");
                    if (remoteAudioDirection === CONSTANTS.WEBRTC.MEDIA_STATE.INACTIVE ||
                        remoteAudioDirection === CONSTANTS.WEBRTC.MEDIA_STATE.RECEIVE_ONLY) {
                        onSuccessAfterWorkaround();
                    } else {
                        self.performVideoStartWorkaround(call, onSuccessAfterWorkaround, onFailure);
                    }
                },
                function processHoldRespondSetRemoteDescriptionFailureCallback(e) {
                    logger.debug("processHoldRespond: setRemoteDescription typeAns failed: " + e);
                    utils.callFunctionIfExist(onFailure);
                });
    };

    // Native implementation lies on webRtcAdaptor.js
    self.processRemoteOfferOnLocalHold = function(call, successCallback, failureCallback) {
        logger.info("processRemoteOfferOnLocalHold");
        if (call.peer) {
            utils.callFunctionIfExist(successCallback, call.peer.localDescription.sdp);
        }
        else {
            utils.callFunctionIfExist(failureCallback, "we dont have a peer object somehow");
        }
    };

    self.removeJslIdFromContainer = function () {
        if (self.getDefaultVideoContainer()) {
            self.getDefaultVideoContainer().removeAttribute('jsl-id');
            self.disposeStreamRenderer(self.getDefaultVideoContainer().lastElementChild);
        } else if (self.getLocalVideoContainer()) {
            self.getLocalVideoContainer().removeAttribute('jsl-id');
            self.disposeStreamRenderer(self.getLocalVideoContainer());
        }
    };

    function endLocalMedia(localMedia) {
        if (localMedia.stream) {
            logger.info("stopping local media " + localMedia.stream.id);
            self.getLocalStreamMap().remove(localMedia.stream.id);
            localMedia.audioContext.close();
            localMedia.mediaStreamDestination.disconnect();
            stopMediaStream(localMedia.stream);
            localMedia.stream = null;
            localMedia.audioContext = null;
            localMedia.mediaStreamDestination = null;
        }
    }



    /*
     * Native implementation lies on webRtcAdaptor.js
     * process the end call that was received
     *
     * @ignore
     * @name rtc.processEnd.stop
     */
    self.processEnd = function(call) {
        var id, screenStream, userMediaStream, localStreamEntries;
        self.clearIceCandidateCollectionTimer(call);
        self.clearWebrtcLogCollectionInterval(call);
        if (call.peer) {
            logger.info("close peer connection " + call.id);

            call.peer.close();

            endLocalMedia(call.localMedia);

            // TODO: Streams should be stored in call and stopped in endLocalMedia.
            // Storing streams this way limits things to one call.
            screenStream = self.getScreenStream();
            if (screenStream) {
                stopMediaStream(screenStream);
                self.setScreenStream(null);
            }

            userMediaStream = self.getUserMediaStream();
            if (userMediaStream) {
                stopMediaStream(userMediaStream);
                self.setUserMediaStream(null);
            }

            self.setPeerCount(self.getPeerCount() - 1);
            if(self.getPeerCount() <= 0) {
                self.removeJslIdFromContainer();
                localStreamEntries = self.getLocalStreamMap().entries();
                for (id in localStreamEntries) {
                    if (localStreamEntries.hasOwnProperty(id)) {
                        endLocalMedia(self.getLocalStreamMap().get(id));
                    }
                }
            }
        }
    };

    // Native implementation lies on webRtcAdaptor.js
    self.onSessionConnecting = function(call, message) {
        logger.debug("onSessionConnecting");
    };

    // Native implementation lies on webRtcAdaptor.js
    self.onSessionOpened = function(call, message) {
        logger.debug("onSessionOpened");
    };

    // Native implementation lies on webRtcAdaptor.js
    self.onSignalingStateChange = function(call, event) {
        //TODO may need to move the state changes for webrtc here
        logger.debug("Signalling state changed: state= " + call.peer.signalingState);
    };

    // Native implementation lies on webRtcAdaptor.js
    self.useDefaultRenderer = function(streamUrl, local, isVideoTrackAvailable) {
        var videoContainer;

        if (self.getDefaultVideoContainer() && self.getDefaultVideoContainer().children.length === 0) {
            // Create divs for the remote and local
            self.getDefaultVideoContainer().innerHTML = "<div style='height:100%;width:100%'></div><div style='position:absolute;bottom:10px;right:10px;height:30%; width:30%;'></div>";
        }

        if (local) {
                videoContainer = self.getDefaultVideoContainer().lastElementChild;
        } else {
                videoContainer = self.getDefaultVideoContainer().firstElementChild;

            if (!isVideoTrackAvailable) {
                videoContainer.style.width = "0%";
            } else {
                videoContainer.style.width = "100%";
            }
        }
        return self.createStreamRenderer(streamUrl, videoContainer, {
            muted: local
        });
    };

    // Native implementation lies on webRtcAdaptor.js
    self.createStreamRenderer = function(streamUrl, container, options){
        var renderer;

        if(!streamUrl || !container){
            return;
        }

        container.innerHTML = "";
        renderer = document.createElement('video');
        renderer.src = streamUrl;

        renderer.style.width = "100%";
        renderer.style.height = "100%";

        renderer.autoplay = "true";

        if (options) {
            if (options.muted) {
                renderer.muted = "true";
            }
        }

        container.appendChild(renderer);
        return renderer;
    };

    // Native implementation lies on webRtcAdaptor.js
    self.addCallIdInPluginContainer = function(call){
        logger.info("addCallIdInPluginContainer Call ID= " + call.id);
        if (self.getDefaultVideoContainer()) {
            self.getDefaultVideoContainer().setAttribute('jsl-id', call.id);
        } else if (self.getRemoteVideoContainer()) {
            self.getRemoteVideoContainer().setAttribute('jsl-id', call.id);
        }
    };

    // Native implementation lies on webRtcAdaptor.js
    self.isActiveCallInVideoContainer = function(container, call){
        logger.info("isActiveCallInVideoContainer Call ID= " + call.id);
        if(container.getAttribute('jsl-id') !== 'undefined'){
            logger.info("isActiveCallInVideoContainer Jsl Id= " + container.getAttribute('jsl-id'));
            if (call.id !== container.getAttribute('jsl-id')) {
                return false;
            }
        }
        return true;
    };

    // nativeOnRemoteStreamAdded
    self.onRemoteStreamAdded = function(call, event) {
        var streamUrl, fireEvent,
                remoteVideoTracks = [],
                isVideoTrackAvailable = false;

        if (self.getDefaultVideoContainer()) {
            if(!self.isActiveCallInVideoContainer(self.getDefaultVideoContainer(), call)){
                logger.debug("onRemoteStreamAdded: It is not active call. Call Id: " + call.id);
                return;
            }
        } else if (self.getRemoteVideoContainer()) {
            if(!self.isActiveCallInVideoContainer(self.getRemoteVideoContainer(), call)){
                logger.debug("onRemoteStreamAdded: It is not active call. Call Id: " + call.id);
                return;
            }
        }

        if (event.stream) {
            streamUrl = self.getRtcLibrary().getURLFromStream(event.stream);
            if (streamUrl) {

                remoteVideoTracks = event.stream.getVideoTracks();
                if (remoteVideoTracks) {
                    if (remoteVideoTracks.length > 0) {
                        isVideoTrackAvailable = true;
                    }
            }

                if (self.getDefaultVideoContainer()) {
                    fireEvent = self.useDefaultRenderer(streamUrl, false, isVideoTrackAvailable);
                } else if (self.getRemoteVideoContainer()) {
                    fireEvent = self.createStreamRenderer(streamUrl, self.getRemoteVideoContainer());
                } else {
                    fireEvent = true;
                }
            }

            logger.debug("onRemoteStreamAdded: " + streamUrl);
            if (fireEvent) {
                    self.fireOnStreamAddedEvent(call, streamUrl);
                }
            }
    };

    // Native implementation lies on webRtcAdaptor.js
    self.fireOnStreamAddedEvent = function(call, streamUrl) {
        if (call && call.call && call.call.onStreamAdded) {
            self.setOriginatorReceiveRemoteVideo(call);
            utils.callFunctionIfExist(call.call.onStreamAdded, streamUrl);
        }
    };

    // Native implementation lies on webRtcAdaptor.js
    self.onRemoteStreamRemoved = function(call, event) {
        logger.debug("onRemoteStreamRemoved");

        //Ersan - Multiple Call Plugin Issue Tries
        //
        //event.stream.stop();
        //if (defaultVideoContainer) {
        //    if(defaultVideoContainer.firstElementChild) {
        //        disposeStreamRenderer(defaultVideoContainer.firstElementChild);
        //    }
        //} else if (remoteVideoContainer) {
        //    disposeStreamRenderer(remoteVideoContainer);
        //}
    };

    // Native implementation lies on webRtcAdaptor.js
    self.clearIceCandidateCollectionTimer = function(call) {
        //This method wasn't implemented in webrtc.js
        clearTimeout(call.iceCandidateCollectionTimer);
        call.iceCandidateCollectionTimer = null;
    };

    // Native implementation lies on webRtcAdaptor.js
    self.onIceCandidate = function(call, event) {
        var sdp;
        if(event.candidate === null) {
            logger.debug("Null candidate received.");
            if(call.successCallback) {
                sdp = call.peer.localDescription.sdp;

                if (sdpParser.hasCandidates(sdp, call.relayCandidateCycle, fcsConfig.relayCandidateCollectionTimeoutCycle)) {
                    self.clearIceCandidateCollectionTimer(call);
                    logger.debug("Candidates received, invoking successCallback.");

                call.successCallback(sdp);
                }
                else {
                    logger.trace("Sdp does not have candidates.");
                }
            }
        } else {
            logger.debug("ICE candidate received: sdpMLineIndex = " + event.candidate.sdpMLineIndex
                    + ", candidate = " + event.candidate.candidate + " for call : " + call.id);
        }
    };

    // Native implementation lies on webRtcAdaptor.js
    self.onIceComplete = function(call) {
        var  sdp;
        logger.debug("All ICE candidates received for call : " + call.id);
        self.clearIceCandidateCollectionTimer(call);

        if(call.successCallback) {
            sdp = call.peer.localDescription.sdp;

            logger.debug("onIceComplete sdp : " + sdp);

            call.successCallback(sdp);
        }
    };

    // Native implementation lies on webRtcAdaptor.js
    self.iceCandidateCollectionTimeoutHandler = function(call) {
        var sdp = call.peer.localDescription.sdp;
        self.clearIceCandidateCollectionTimer(call);
        if(fcsConfig.relayCandidateCollectionTimeoutCycle) {
            call.relayCandidateCycle ++;
        }
        // set timeout if there is no ice candidate available or
        // when audio, video port assignment isn't complete
        if (!sdpParser.hasCandidates(sdp, call.relayCandidateCycle, fcsConfig.relayCandidateCollectionTimeoutCycle)) {
            logger.debug("Re-setting ice candidate collection timeout: " + fcsConfig.iceCandidateCollectionTimeoutInterval);
            call.iceCandidateCollectionTimer = setTimeout(function() {
                self.iceCandidateCollectionTimeoutHandler(call);
            }, fcsConfig.iceCandidateCollectionTimeoutInterval);
            return;
        }

        if (call.successCallback) {
            logger.debug("Ice candidate collection interrupted after given timeout, invoking successCallback.");
            call.successCallback(sdp);
        }
    };

    // Native implementation lies on webRtcAdaptor.js
    self.setupIceCandidateCollectionTimer = function(call) {
        if (fcsConfig.iceCandidateCollectionTimeoutInterval) {
            if (!call.iceCandidateCollectionTimer) {
                logger.debug("Setting ice candidate collection timeout: " + fcsConfig.iceCandidateCollectionTimeoutInterval);
                if(fcsConfig.relayCandidateCollectionTimeoutCycle) {
                    call.relayCandidateCycle = 1;
                }
                call.iceCandidateCollectionTimer = setTimeout(function() {
                    self.iceCandidateCollectionTimeoutHandler(call);
                }, fcsConfig.iceCandidateCollectionTimeoutInterval);
            } else {
                logger.trace("Ice candidate collection timer exists.");
            }
        }
    };

    self.clearWebrtcLogCollectionInterval = function(call) {
        //This method wasn't implemented in webrtc.js
        clearInterval(call.webrtcLogCollectionInterval);
        call.webrtcLogCollectionInterval = null;
    };

    self.webrtcLogCollectionTimeoutHandler = function(call) {
        if (call && call.peer && call.peer.signalingState !== "closed") {
            call.peer.getStats(function(stats) {
                var results = stats.result(), i, j, res, names, statObj,
                        resultLength, namesLength;
                resultLength = results.length;
                for (i = 0; i < resultLength; ++i) {
                    res = results[i];
                    if (!res.local || res.local === res) {
                        statObj = {};
                        statObj.timestamp = res.timestamp;
                        if (res.id) {
                            statObj.id = res.id;
                        }
                        if (res.type) {
                            statObj.type = res.type;
                        }

                        if (res.names) {
                            names = res.names();
                            namesLength = names.length;
                            for (j = 0; j < namesLength; ++j) {
                                statObj[names[j]] = res.stat(names[j]);
                            }
                        } else {
                            if (res.stat('audioOutputLevel')) {
                                statObj.audioOutputLevel = res.stat('audioOutputLevel');
            }
        }
                        logger.trace("Peer connection stats, report[" + i + "]: ", statObj);
                    }
                }
            });
        }
        else {
            self.clearWebrtcLogCollectionInterval(call);
        }
    };

    self.setupWebrtcLogCollectionTimer = function(call) {
        if (fcsConfig.webrtcLogCollectionInterval) {
            self.clearWebrtcLogCollectionInterval(call);
            var logCollectionInterval = fcsConfig.webrtcLogCollectionInterval * 1000;
            logger.debug("Setting webrtc log collection interval: " + logCollectionInterval);
            call.webrtcLogCollectionInterval = setInterval(function() {
                self.webrtcLogCollectionTimeoutHandler(call);
            }, logCollectionInterval);
        }
    };

    self.oniceconnectionstatechange = function(call, event) {
        logger.debug("ICE connection state change : " + call.peer.iceConnectionState);
    };

    // Native implementation lies on webRtcAdaptor.js
    self.createPeer = function(call, onSuccess, onFailure) {
        try {
            var pc, constraints, i, servers = [], iceServerUrl = self.getIceServerUrl(), stunturn;
            if (iceServerUrl instanceof Array) {
                for(i = 0; i<iceServerUrl.length; i++) {
                    servers[i] = iceServerUrl[i];
                }
            } else if (iceServerUrl === null ||  iceServerUrl === ""){
                servers = [];
            } else {
                servers[0] = iceServerUrl;
            }
            stunturn = {iceServers:servers};

            constraints = {"optional": [{"DtlsSrtpKeyAgreement": self.isDtlsEnabled()}]};
            pc = self.getRtcLibrary().createRTCPeerConnection(stunturn, constraints);

            self.setPeerCount(self.getPeerCount() + 1);
            call.peer = pc;

            pc.onconnecting = function(event){
                self.onSessionConnecting(call, event);
            };
            pc.onopen = function(event){
                self.onSessionOpened(call, event);
            };
            pc.onsignalingstatechange = function(event){
                self.onSignalingStateChange(call, event);
            };
            pc.onaddstream = function(event){
                self.onRemoteStreamAdded(call, event);
            };
            pc.onremovestream = function(event){
                self.onRemoteStreamRemoved(call, event);
            };
            pc.onicecandidate = function(event) {
                if (event.currentTarget.iceGatheringState === "complete") {
                    logger.debug("Ice gathering complete");
                    self.onIceComplete(call);
                } else {
                    self.setupIceCandidateCollectionTimer(call);
                    self.onIceCandidate(call, event);
                }
            };
            pc.onicecomplete = function(){
                self.onIceComplete(call);
            };
            pc.oniceconnectionstatechange = function (event) {
                self.oniceconnectionstatechange(call, event);
            };
            logger.info("create PeerConnection successfully.");

            self.setupWebrtcLogCollectionTimer(call);

            onSuccess(call);
        } catch(err) {
            logger.error("Failed to create PeerConnection, exception: " + err.message);
            onFailure();
        }
    };

    self.createNewPeerForCall = function(call) {
        var isNewPeerCreated = false, peerCount = self.getPeerCount();
        if (call.peer) {
            call.peer.close();
            self.setPeerCount(peerCount - 1);
        }

        logger.trace("Creating new peer for call: " + call.id);
        self.createPeer(call, function createPeerSuccessCallback() {
            logger.trace("New peer has created for call: " + call.id);
            call.peer.addStream(call.localMedia.stream);
            isNewPeerCreated = true;
        }, function createPeerFailureCallback() {
            logger.error("New peer creation has failed!: " + call.id);
        });
        return isNewPeerCreated;
    };

    // Native implementation lies on webRtcAdaptor.js
    self.createNewPeerForCallIfIceChangedInRemoteSdp = function(call, newSdp, oldSdp) {
        var hasNewSdpContainsIceLite = sdpParser.isIceLite(newSdp),
                hasOldSdpContainsIceLite = sdpParser.isIceLite(oldSdp),
                isNewPeerCreated = false;

        // In Peer-Peer call, ice-iceLite change indicates
        // a new peer connection with different ip.
        // As for now, webrtc cannot handle ip change
        // without creating a peer.
        // For ex: Peer-Peer call and MoH.
        //
        // In Non Peer-Peer call, ice-iceLite change does
        // not occur so existing peer object will be used.

        if (hasNewSdpContainsIceLite !== hasOldSdpContainsIceLite) {
            logger.trace("Ice - Ice-Lite change detected in call: " + call.id);
            return self.createNewPeerForCall(call);
        }

        return isNewPeerCreated;
    };

    /*
     * Gets remote video resolutions with the order below
     * remoteVideoHeight-remoteVideoWidth
     *
     * Native implementation lies on webRtcAdaptor.js
     */
    self.getRemoteVideoResolutions = function() {
        var remoteResolution = [],
            remoteVideoHeight,
            remoteVideoWidth;

        if (self.getRemoteVideoContainer()) {
            if (!self.getRemoteVideoContainer().firstChild) {
                return remoteResolution;
            }

            remoteVideoHeight = self.getRemoteVideoContainer().firstChild.videoHeight;
            remoteVideoWidth = self.getRemoteVideoContainer().firstChild.videoWidth;

        } else {
            if (!self.getDefaultVideoContainer().firstElementChild.firstChild) {
                return remoteResolution;
            }

            remoteVideoHeight = self.getDefaultVideoContainer().firstElementChild.firstChild.videoHeight;
            remoteVideoWidth = self.getDefaultVideoContainer().firstElementChild.firstChild.videoWidth;
        }

        logger.debug("remote video resolutions of plugin webrtc...");
        logger.debug("remoteVideoWidth  : " + remoteVideoWidth);
        logger.debug("remoteVideoHeight : " + remoteVideoHeight);

        remoteResolution.push(remoteVideoHeight);
        remoteResolution.push(remoteVideoWidth);

        self.getLocalVideoResolutions();

        return remoteResolution;
    };

    /*
     * Gets local video resolutions with the order below
     * localVideoHeight-localVideoWidth
     *
     * Native implementation lies on webRtcAdaptor.js
     */
    self.getLocalVideoResolutions = function() {
        var localResolution = [],
            localVideoHeight,
            localVideoWidth;

        if (self.getLocalVideoContainer()) {
            if (!self.getLocalVideoContainer().firstChild) {
                return localResolution;
            }

            localVideoHeight = self.getLocalVideoContainer().firstChild.videoHeight;
            localVideoWidth = self.getLocalVideoContainer().firstChild.videoWidth;

        } else {
            if (!self.getDefaultVideoContainer().lastElementChild.firstChild) {
                return localResolution;
            }

            localVideoHeight = self.getDefaultVideoContainer().lastElementChild.firstChild.videoHeight;
            localVideoWidth = self.getDefaultVideoContainer().lastElementChild.firstChild.videoWidth;
        }

        logger.debug("local video resolutions of plugin webrtc...");
        logger.debug("localVideoWidth  : " + localVideoWidth);
        logger.debug("localVideoHeight : " + localVideoHeight);

        localResolution.push(localVideoHeight);
        localResolution.push(localVideoWidth);

        return localResolution;
    };

    // Native implementation lies on webRtcAdaptor.js
    self.refreshVideoRenderer = function() {
        return;
    };

    // Native implementation lies on webRtcAdaptor.js
    self.sendIntraFrame = function() {
        return;
    };

    // Native implementation lies on webRtcAdaptor.js
    self.sendBlackFrame = function() {
        return;
    };

    // Native implementation lies on webRtcAdaptor.js
    self.disposeStreamRenderer = function(container){
        if(container){
            container.innerHTML = "";
        }
    };

    /**
     * Send DTMF tone
     * Native implementation lies on webRtcAdaptor.js
     *
     * @ignore
     * @name rtc.sendDTMF
     * @function
     * @param {Object} call internalCall
     * @param {String} tone DTMF tone
     */
    self.sendDTMF = function (call, tone) {
        var oscillator1, oscillator2, freq1, freq2, gainNode, localAudioTrack,
                audioContext, mediaStreamDestination;

        if(!sdpParser.isSdpHasTelephoneEvent(call.peer.remoteDescription.sdp)){
            logger.info("sending inband DTMF tone: " + tone);
            if(tone === "1"){ freq1 = "697"; freq2 = "1209";}
            if(tone === "2"){ freq1 = "697"; freq2 = "1336";}
            if(tone === "3"){ freq1 = "697"; freq2 = "1477";}
            if(tone === "4"){ freq1 = "770"; freq2 = "1209";}
            if(tone === "5"){ freq1 = "770"; freq2 = "1336";}
            if(tone === "6"){ freq1 = "770"; freq2 = "1477";}
            if(tone === "7"){ freq1 = "852"; freq2 = "1209";}
            if(tone === "8"){ freq1 = "852"; freq2 = "1336";}
            if(tone === "9"){ freq1 = "852"; freq2 = "1477";}
            if(tone === "*"){ freq1 = "941"; freq2 = "1209";}
            if(tone === "0"){ freq1 = "941"; freq2 = "1336";}
            if(tone === "#"){ freq1 = "941"; freq2 = "1477";}

            audioContext = call.localMedia.audioContext;
            mediaStreamDestination = call.localMedia.mediaStreamDestination;

            oscillator1 = audioContext.createOscillator();
            oscillator1.type = 'sine';
            oscillator1.frequency.value = freq1;
            gainNode = audioContext.createGain ? audioContext.createGain() : audioContext.createGainNode();
            oscillator1.connect(gainNode,0,0);
            gainNode.connect(mediaStreamDestination);
            gainNode.gain.value = 0.1;
            oscillator1.start();

            oscillator2 = audioContext.createOscillator();
            oscillator2.type = 'sine';
            oscillator2.frequency.value = freq2;
            gainNode = audioContext.createGain ? audioContext.createGain() : audioContext.createGainNode();
            oscillator2.connect(gainNode);
            gainNode.connect(mediaStreamDestination);
            gainNode.gain.value = 0.1;
            oscillator2.start();

            setTimeout(function(){
                oscillator1.disconnect();
                oscillator2.disconnect();
            }, 100);

        } else {
            logger.info("sending outband DTMF tone: " + tone);
        if(!call.dtmfSender) {
                localAudioTrack = self.getLocalAudioTrack(call.peer);
            if(!localAudioTrack) {
                return;
            }
            call.dtmfSender = call.peer.createDTMFSender(localAudioTrack);
            if(!call.dtmfSender) {
                return;
            }
        }

        if (call.dtmfSender.canInsertDTMF === true) {
            call.dtmfSender.insertDTMF(tone, 400);
        }
        else {
            logger.error("Failed to execute 'insertDTMF' on 'RTCDTMFSender': The 'canInsertDTMF' attribute is false: this sender cannot send DTMF");
        }
        }
    };

    self.showSettingsWindow = function(){
        self.getRtcLibrary().showSettingsWindow();
    };

    self.set_logSeverityLevel = function(level){
        self.getRtcLibrary().set_logSeverityLevel(level);
    };

    self.enable_logCallback = function() {
        var pluginLogger = _logManager.getLogger("rtcPlugin");
        self.getRtcLibrary().enable_logCallback(pluginLogger);
    };

    self.disable_logCallback = function(){
        self.getRtcLibrary().disable_logCallback();
    };

    self.get_audioInDeviceCount = function(){
        self.getRtcLibrary().get_audioInDeviceCount();
    };

    self.get_audioOutDeviceCount = function(){
        self.getRtcLibrary().get_audioOutDeviceCount();
    };

    self.get_videoDeviceCount = function(){
        self.getRtcLibrary().get_videoDeviceCount();
    };

    // set local client's video send status
    self.setOriginatorSendLocalVideo = function(call, status) {
        var videoSendEnabled = sdpParser.isVideoSdpEnabled(call.peer.localDescription.sdp);
        call.canOrigSendVideo = status && videoSendEnabled;
    };

    // check if local client sends video
    self.canOriginatorSendLocalVideo = function(call) {
        return call.canOrigSendVideo;
    };

    // set local client's video receive status
    self.setOriginatorReceiveRemoteVideo = function(call) {
        call.canOrigReceiveVideo = sdpParser.isVideoSdpEnabled(call.sdp);
    };

    // check if local client receives video
    self.canOriginatorReceiveRemoteVideo = function(call) {
        return call.canOrigReceiveVideo;
    };

    self.setTcpSetupAttiributesOnProcessAnswer = function(call, sdp) {
        call.remoteTcpSetupAttribute = sdpParser.getTcpSetupAttribute(sdp);
        if (call.remoteTcpSetupAttribute === CONSTANTS.SDP.SETUP_ACTIVE) {
            call.localTcpSetupAttribute = CONSTANTS.SDP.SETUP_PASSIVE;
        }
        else if (call.remoteTcpSetupAttribute === CONSTANTS.SDP.SETUP_PASSIVE) {
            call.localTcpSetupAttribute = CONSTANTS.SDP.SETUP_ACTIVE;
        }
        else {
            logger.debug("Not handling remote TCP setup attribute: " + call.remoteTcpSetupAttribute);
        }
    };

    self.setTcpSetupAttiributesOnCreateAnswer = function(call, sdp) {
        call.localTcpSetupAttribute = sdpParser.getTcpSetupAttribute(sdp);
        if (call.localTcpSetupAttribute === CONSTANTS.SDP.SETUP_ACTIVE) {
            call.remoteTcpSetupAttribute = CONSTANTS.SDP.SETUP_PASSIVE;
        }
        else if (call.localTcpSetupAttribute === CONSTANTS.SDP.SETUP_PASSIVE) {
            call.remoteTcpSetupAttribute = CONSTANTS.SDP.SETUP_ACTIVE;
        }
        else {
            logger.debug("Not handling remote TCP setup attribute: " + call.remoteTcpSetupAttribute);
        }
    };

    logger.debug('WebRtcAdaptor initialized');
};

var WebRtcAdaptor = function(_super, _decorator, _model) {
    return new WebRtcAdaptorImpl(_super, _decorator, _model, logManager);
};

if (__testonly__) { __testonly__.WebRtcAdaptor = WebRtcAdaptor; }

var WebRtcPluginAdaptorImpl = function(_super, _decorator, _model, _logManager) {
    var self = this,
            logger = _logManager.getLogger("WebRtcPluginAdaptorImpl");

    logger.debug('WebRtcPluginAdaptor initializing');

    utils.compose(_super, self);
    utils.compose(_model, self);

    self.setPluginEnabled(true);
    
    /*
     * Sdp workarounds performed before createOffer
     * TODO all workarounds should be detected and filled in here
     */
    self.performSdpWorkaroundsAfterCreateOffer = function(call, oSdp) {
        oSdp = sdpParser.replaceCodecs(oSdp, call.codecsToReplace ? call.codecsToReplace : fcsConfig.codecsToReplace);
        return oSdp;
    };

    //This function is called internally when we make a new call or hold/unhold scenario
    // Enabler implementation lies on webRtcPluginAdaptor.js
    self.addLocalStream = function(internalCall) {
        var streamUrl, fireEvent = false,
                isSendingLocalVideo = self.canOriginatorSendLocalVideo(internalCall);

        if (internalCall.localMedia.stream) {
            if (isSendingLocalVideo) {
                streamUrl = self.getRtcLibrary().getURLFromStream(internalCall.localMedia.stream);

                if (streamUrl) {
                    if (self.getDefaultVideoContainer()) {
                        fireEvent = self.useDefaultRenderer(streamUrl, true);
                    } else if (self.getLocalVideoContainer()) {
                        fireEvent = self.createStreamRenderer(streamUrl, self.getLocalVideoContainer(), {
                            muted: true});
                    } else {
                        internalCall.call.localStreamURL = streamUrl;
                        fireEvent = true;
                    }
                }
            } else {
                if (self.getDefaultVideoContainer()) {
                    if (self.getDefaultVideoContainer().lastElementChild) {
                        self.disposeStreamRenderer(self.getDefaultVideoContainer().lastElementChild);
                    }
                } else if (self.getLocalVideoContainer()) {
                    self.disposeStreamRenderer(self.getLocalVideoContainer());
                }
            }

            logger.debug("onLocalStreamAdded: " + streamUrl);
            if (fireEvent) {
                self.fireOnLocalStreamAddedEvent(internalCall, streamUrl);
            }
        }
    };

    self.performSdpWorkaroundsBeforeProcessingIncomingSdp = function(call) {
        call.sdp = sdpParser.deleteBandwidthLineFromSdp(call.sdp);
        call.sdp = sdpParser.removeRTXCodec(call.sdp);
        call.sdp = sdpParser.removeG722Codec(call.sdp);
        call.sdp = sdpParser.fixRemoteTelephoneEventPayloadType(call, call.sdp);
    };

    // Enabler implementation lies on webRtcPluginAdaptor.js
    // initEnablerMedia
    self.initMedia = function(onSuccess, onFailure, options) {
        var mainContainer = document.body,
                rtcPlugin = {},
                verifyPlugin = true,
                mediaErrors = fcs.call.MediaErrors,
                onloadParam,
                size = "1px",
                pluginid = "fcsPlugin",
                applicationType = "application/x-gcfwenabler",
                configuredPluginVersion = self.getPluginVersion(),
                currentPluginVersion,
                currentPluginVersionString;

        logger.debug("Configured plugin version: " + configuredPluginVersion.major + "." + configuredPluginVersion.minor + "." + configuredPluginVersion.current_revision);

        if(options) {
            if (options.pluginLogLevel) {
                self.setLogLevel(options.pluginLogLevel);
            }

            if (options.language) {
                self.setLanguage(options.language);
            }
        }
        //Callback for when the plugin is loaded
        self.onFCSPLoaded = function() {

            self.setRtcLibrary(_decorator(rtcPlugin));
            if(self.isH264Enabled()){
                self.getRtcLibrary().enableH264();
            }
            self.getRtcLibrary().checkMediaSourceAvailability(function mediaSourceCallback(mediaSourceInfo) {
                self.setMediaSources(mediaSourceInfo);
            });
            self.getRtcLibrary().setH264CodecStateChangeHandler(function onH264CodecStateChangeHandler(event) {
                self.setH264Enabled(event.state);
            });

            currentPluginVersion = self.getRtcLibrary().getCurrentPluginVersionObject();
            currentPluginVersionString = self.getRtcLibrary().getVersion();
            // prevent multiple init calls
            if (self.isInitialized() || !verifyPlugin) {
                return;
            }
            verifyPlugin = false;
            logger.debug("Plugin callback");

            fcs.setPluginVersion(currentPluginVersionString);
            logger.debug("Installed plugin version: " + currentPluginVersionString);

            if ((currentPluginVersionString.length < 1) ||
                    (currentPluginVersion.major !== configuredPluginVersion.major ||
                            currentPluginVersion.minor !== configuredPluginVersion.minor) ||
                    (currentPluginVersion.revision < configuredPluginVersion.min_revision) ||
                    (currentPluginVersion.revision === configuredPluginVersion.min_revision &&
                 currentPluginVersion.build < configuredPluginVersion.min_build) ) {

                logger.debug("Plugin version not supported");
                utils.callFunctionIfExist(onFailure, mediaErrors.WRONG_VERSION);
            } else {
                self.setInitialized(true);
                if ((currentPluginVersion.revision < configuredPluginVersion.current_revision) ||
                        (currentPluginVersion.revision === configuredPluginVersion.current_revision &&
                     currentPluginVersion.build < configuredPluginVersion.current_build) ) {

                    logger.debug("New plugin version warning");
                    utils.callFunctionIfExist(onFailure, mediaErrors.NEW_VERSION_WARNING);
                } else {
                    utils.callFunctionIfExist(onSuccess,
                                               { "pluginVersion": rtcPlugin.version } );
                }

                self.getRtcLibrary().setLang(self.getLanguage());
            }

            self.setUserMediaStream(null);
            self.getRtcLibrary().checkMediaSourceAvailability();
        };

        // only check if the function exists, not its type, because in IE it is "object" (host object)
        if (typeof mainContainer.appendChild === 'undefined') {
            logger.debug("Could not inject plugin in container");
            utils.callFunctionIfExist(onFailure, mediaErrors.OPTIONS);
            return;
        }

        rtcPlugin = document.createElement('object');
        onloadParam = document.createElement('param');
        onloadParam.setAttribute("name", "onload");
        onloadParam.setAttribute("value", "onFCSPLoaded");
        rtcPlugin.appendChild(onloadParam);

        rtcPlugin.id = pluginid;
        rtcPlugin.width = rtcPlugin.height = size;

        // Order matters for the following:
        // For IE you need to append first so the dom is available when IE loads the plugin, which happens when the type is set.
        // For FF you need to set the type and then append or the plugin won't load.
        // Chrome seems happy either way.
        try {
            if (navigator.appName === 'Microsoft Internet Explorer') {
                mainContainer.appendChild(rtcPlugin);
                rtcPlugin.type = applicationType;
            } else {
                rtcPlugin.type = applicationType;
                mainContainer.appendChild(rtcPlugin);
            }
        } catch (e) {
            verifyPlugin = false;
            utils.callFunctionIfExist(onFailure, mediaErrors.NOT_FOUND);
        }

        if (verifyPlugin) {
            if (typeof document.getElementById(pluginid).createPeerConnection !== 'undefined') {
                self.onFCSPLoaded();
            } else {
                //if the plugin is not initialized within 7 sec fail
                setTimeout(function() {
                    // for createPeerConnection, only check if it exists. It is "function" in FireFox and "object" in Chrome and IE
                    if (!self.isInitialized()) {
                        if (typeof document.getElementById(pluginid).createPeerConnection === 'undefined') {
                            utils.callFunctionIfExist(onFailure, mediaErrors.NOT_FOUND);
                        } else {
                            self.onFCSPLoaded();
                        }
                    }
                }, 7000);
            }
        }
    };

    // Enabler implementation lies on webRtcPluginAdaptor.js
    self.getUserMedia = function(onSuccess, onFailure) {
        self.getRtcLibrary().checkMediaSourceAvailability(function getUserMediaCallback(mediaSourceInfo) {
            var video_constraints, mediaInfo;
            logger.debug("Plugin version:" + self.getRtcLibrary().version);
            if (mediaSourceInfo) {
                self.setVideoSourceAvailable(mediaSourceInfo.videoSourceAvailable);
                self.setAudioSourceAvailable(mediaSourceInfo.audioSourceAvailable);
            }
            if (self.getMediaVideo() && self.getVideoSourceAvailable()) {
                video_constraints = {
                    mandatory: {
                        "maxWidth": self.getVideoWidth(),
                        "maxHeight": self.getVideoHeight()
                    }
                };
            } else {
                video_constraints = false;
            }

            self.getRtcLibrary().getUserMedia({
                audio: self.getMediaAudio(),
                video: video_constraints
            }, function getUserMediaSuccessCallback(stream) {
                var localMedia = {};
                self.setUserMediaStream(stream);

                localMedia.audioContext = {close: function(){}};
                localMedia.mediaStreamDestination = {disconnect: function(){}};
                localMedia.stream = stream;

                self.getLocalStreamMap().add(localMedia.stream.id, localMedia);

                self.setInitialized(true);
                mediaInfo = {
                    "audio": self.getMediaAudio(),
                    "video": self.getMediaVideo() && self.getVideoSourceAvailable(),
                    "id": localMedia.stream.id
                };

                logger.debug("user has granted access to local media: ", localMedia);
                utils.callFunctionIfExist(onSuccess, mediaInfo);
            }, function getUserMediaFailureCallback(error) {
                logger.debug("Failed to get access to local media. Error code was " + error.code);
                utils.callFunctionIfExist(onFailure, fcs.call.MediaErrors.NOT_ALLOWED);
            });
        });
    };

    /*
     * Enabler implementation lies on webRtcPluginAdaptor.js
     * createEnablerOffer to be used when the enabler plugin is enabled.
     */
    self.createOffer = function(call, successCallback, failureCallback, sendInitialVideo) {
        logger.debug("createOffer: sendInitialVideo= " + sendInitialVideo + " state= " + call.peer.signalingState);
        var peer = call.peer, newSdp;

        call.peer.addStream(call.localMedia.stream);

        self.addCallIdInPluginContainer(call);

        peer.createOffer(function createOfferSuccessCallback(oSdp) {
            sendInitialVideo = sendInitialVideo && self.getVideoSourceAvailable();
            newSdp = sdpParser.getSdpFromObject(oSdp);
            oSdp = null;
            if(sendInitialVideo){
                newSdp = sdpParser.updateVideoSdpDirection(newSdp, CONSTANTS.WEBRTC.MEDIA_STATE.SEND_RECEIVE);
            } else {
                newSdp = sdpParser.updateVideoSdpDirection(newSdp, CONSTANTS.WEBRTC.MEDIA_STATE.RECEIVE_ONLY);
            }

            newSdp = sdpParser.deleteCryptoZeroFromSdp(newSdp);
            newSdp = sdpParser.updateAudioCodec(newSdp);
            newSdp = sdpParser.removeG722Codec(newSdp);

            newSdp = sdpParser.deleteCryptoFromSdp(newSdp, self.isDtlsEnabled());
            newSdp = sdpParser.setTcpSetupAttributeToActpass(newSdp, self.isDtlsEnabled());

            newSdp = sdpParser.fixLocalTelephoneEventPayloadType(call, newSdp);
            newSdp = self.performSdpWorkaroundsAfterCreateOffer(call, newSdp);

            self.muteOnHold(call,false);
            peer.setLocalDescription(
                    self.getRtcLibrary().createRTCSessionDescription(CONSTANTS.WEBRTC.RTC_SDP_TYPE.OFFER, newSdp),
                function createOfferSetLocalDescriptionSuccessCallback(){
                        //Due to stun requests, successCallback will be called by onNativeIceCandidate()
                    },
                    function createOfferSetLocalDescriptionFailureCallback(error) {
                        logger.error("createOffer: setLocalDescription failed : " + error);
                        utils.callFunctionIfExist(failureCallback, "createOffer: setLocalDescription failed");
                    }
            );

        },function createOfferFailureCallback(error){
            logger.error("createOffer: createOffer failed!! " + error);
            utils.callFunctionIfExist(failureCallback);
        },
                {
                    'mandatory': {
                'OfferToReceiveAudio':self.getMediaAudio(),
                'OfferToReceiveVideo':self.getMediaVideo()
                    }
                });
    };

    /*
     * createEnablerAnswer to be used when the enabler plugin is enabled
     * Enabler implementation lies on webRtcPluginAdaptor.js
     */
    self.createAnswer = function(call, successCallback, failureCallback, isVideoEnabled) {
        logger.debug("createAnswer: isVideoEnabled= " + isVideoEnabled + " state= " + call.peer.signalingState);
        var peer = call.peer, newSdp;

        call.sdp = sdpParser.checkSupportedVideoCodecs(call.sdp, null, self.isH264Enabled());
        call.sdp = sdpParser.changeDirection(call.sdp, CONSTANTS.WEBRTC.MEDIA_STATE.INACTIVE, CONSTANTS.WEBRTC.MEDIA_STATE.SEND_RECEIVE, CONSTANTS.STRING.AUDIO);
        call.sdp = sdpParser.deleteFingerprintOrCrypto(call.sdp, self.isDtlsEnabled());

        if (!sdpParser.isSdpVideoSendEnabled(call.sdp)) {
            // delete ssrc only from video, keep audio ssrc to hear audio
            call.sdp = sdpParser.deleteInactiveVideoSsrc(call.sdp);
        }

        self.addCallIdInPluginContainer(call);

        peer.setRemoteDescription(
                self.getRtcLibrary().createRTCSessionDescription(CONSTANTS.WEBRTC.RTC_SDP_TYPE.OFFER, call.sdp),
                function createAnswerSetRemoteDescriptionSuccessCallback(){
                    call.peer.addStream(call.localMedia.stream);
                    call.remoteVideoState = sdpParser.getVideoSdpDirection(call.sdp);

                    // set answer SDP to localDescriptor for the offer
                    peer.createAnswer(peer.remoteDescription,
                            function createAnswerSuccessCallback(oSdp) {
                                newSdp = sdpParser.getSdpFromObject(oSdp);
                                oSdp = null;
                                isVideoEnabled = isVideoEnabled && self.getVideoSourceAvailable() && sdpParser.isSdpHasVideo(call.sdp);

                                if (isVideoEnabled) {
                                    if (sdpParser.isSdpVideoSendEnabled(call.sdp)) {
                                        newSdp = sdpParser.updateVideoSdpDirection(newSdp, CONSTANTS.WEBRTC.MEDIA_STATE.SEND_RECEIVE);
                                    } else {
                                        if (sdpParser.getVideoSdpDirection(call.sdp) !== CONSTANTS.WEBRTC.MEDIA_STATE.INACTIVE) {
                                            newSdp = sdpParser.updateVideoSdpDirection(newSdp, CONSTANTS.WEBRTC.MEDIA_STATE.SEND_ONLY);
                                        }
                                        else {
                                            newSdp = sdpParser.updateVideoSdpDirection(newSdp, CONSTANTS.WEBRTC.MEDIA_STATE.INACTIVE);
                                        }
                                    }
                                } else {
                                    if (sdpParser.isSdpVideoSendEnabled(call.sdp)) {
                                        newSdp = sdpParser.updateVideoSdpDirection(newSdp, CONSTANTS.WEBRTC.MEDIA_STATE.RECEIVE_ONLY);
                                    } else {
                                        newSdp = sdpParser.updateVideoSdpDirection(newSdp, CONSTANTS.WEBRTC.MEDIA_STATE.INACTIVE);
                                    }
                                }

                                logger.debug("doAnswer(plugin) - isSdpEnabled audio : " + sdpParser.isAudioSdpEnabled(newSdp));
                                logger.debug("doAnswer(plugin) - isSdpEnabled video : " + sdpParser.isVideoSdpEnabled(newSdp));

                                if (sdpParser.isSdpHasAudio(newSdp) || sdpParser.isSdpHasVideo(newSdp)) {
                                    newSdp = sdpParser.fixLocalTelephoneEventPayloadType(call, newSdp);

                                    // createAnswer generates an sdp without ice params
                                    // copy ice params to the local sdp
                                    // scenario: incoming video call from pcc in brokeronly config
                                    newSdp = sdpParser.checkAndRestoreICEParams(newSdp, call.sdp);

                                    self.muteOnHold(call, false);
                                    peer.setLocalDescription(
                                            self.getRtcLibrary().createRTCSessionDescription(CONSTANTS.WEBRTC.RTC_SDP_TYPE.ANSWER, newSdp),
                                            function createAnswerSetLocalDescriptionSuccessCallback() {
                                                //Due to stun requests, successCallback will be called by onNativeIceCandidate()
                                                call.videoOfferSent = sdpParser.isSdpHasVideo(newSdp);
                                                self.setTcpSetupAttiributesOnCreateAnswer(call, newSdp);
                                            },
                                            function createAnswerSetLocalDescriptionFailureCallback(e) {
                                                logger.error("createAnswer: setLocalDescription failed : " + e);
                                                utils.callFunctionIfExist(failureCallback, "createAnswer setLocalDescription failed");
                                            });
                                } else {
                                    logger.error("createrAnswer: createAnswer failed!!");
                                    utils.callFunctionIfExist(failureCallback, "No codec negotiation");
                                }
                            }, function createAnswerFailureCallback(e) {
                        logger.error("createAnswer: failed!!" + e);
                        utils.callFunctionIfExist(failureCallback, "Session cannot be created ");
                    },
                            {
                                'mandatory': {
                                    'OfferToReceiveAudio': self.getMediaAudio(),
                                    'OfferToReceiveVideo': self.getMediaVideo()
                                }
                            });
                }
            , function createAnswerSetRemoteDescriptionFailureCallback(e){
                logger.error("createAnswer setRemoteDescription failed : " + e);
            });
    };

    /*
     * Enabler implementation lies on webRtcPluginAdaptor.js
     * createEnablerUpdate to be used when the video start or stop
     */
    self.createUpdate = function(call, successCallback, failureCallback, isVideoStart) {
        logger.debug("createEnablerUpdate: isVideoStart= " + isVideoStart + " state= " + call.peer.signalingState);
        var localSdp, newSdp, peer = call.peer;

        localSdp = sdpParser.getSdpFromObject(call.peer.localDescription);
        localSdp = sdpParser.incrementVersion(localSdp);
        localSdp = sdpParser.deleteCryptoFromSdp(localSdp, self.isDtlsEnabled());
        localSdp = sdpParser.fixLocalTelephoneEventPayloadType(call, localSdp);

        logger.debug("create new offer to start the video");

        if (self.createNewPeerForCall(call))
        {
            peer = call.peer;
        }

        self.setMediaVideo(true);
        peer.createOffer(
                function createUpdateCreateOfferSuccessCallback(obj) {
                    isVideoStart = isVideoStart && self.getVideoSourceAvailable();
                    if (isVideoStart) {
                        obj.sdp = sdpParser.updateVideoSdpDirection(obj.sdp, CONSTANTS.WEBRTC.MEDIA_STATE.SEND_RECEIVE);
                    } else {
                        if (sdpParser.isVideoSdpDirectionInactive(call.stableRemoteSdp)) {
                            obj.sdp = sdpParser.updateVideoSdpDirectionToInactive(obj.sdp);
                        } else {
                            obj.sdp = sdpParser.updateVideoSdpDirection(obj.sdp, CONSTANTS.WEBRTC.MEDIA_STATE.RECEIVE_ONLY);
                        }
                    }

                    newSdp = obj.sdp;
                    obj = null;
                    newSdp = sdpParser.updateH264Level(newSdp);
                    newSdp = sdpParser.deleteCryptoZeroFromSdp(newSdp);
                    newSdp = sdpParser.updateAudioCodec(newSdp);
                    newSdp = sdpParser.removeG722Codec(newSdp);
                    newSdp = sdpParser.deleteCryptoFromSdp(newSdp, self.isDtlsEnabled());
                    newSdp = sdpParser.setTcpSetupAttributeToActpass(newSdp, self.isDtlsEnabled());
                    newSdp = sdpParser.fixLocalTelephoneEventPayloadType(call, newSdp);
                    newSdp = self.performSdpWorkaroundsAfterCreateOffer(call, newSdp);

                    peer.setLocalDescription(
                            self.getRtcLibrary().createRTCSessionDescription(CONSTANTS.WEBRTC.RTC_SDP_TYPE.OFFER, newSdp),
                            function createUpdateCreateOfferSetLocalDescriptionSuccessCallback() {
                                //since the candidates have changed we will call the successCallback at onEnablerIceCandidate
                                //utils.callFunctionIfExist(successCallback);
                                logger.debug("createUpdate: createOffer setLocalDescription success ");
                            },
                            function crateUpdateCreateOfferSetLocalDescriptionFailureCallback(e) {
                                logger.debug("createUpdate: createOffer setLocalDescription failed: " + e);
                                utils.callFunctionIfExist(failureCallback);
                            });
                },
                function createUpdateCrateOfferFailureCallback(e) {
                    logger.debug("createUpdate: createOffer failed!!: " + e);
                    failureCallback();
                },
                {
                    'mandatory': {
                        'OfferToReceiveAudio': self.getMediaAudio(),
                        'OfferToReceiveVideo': self.getMediaVideo()
                    }
                }
        );
    };

    /*
     * Enabler implementation lies on webRtcPluginAdaptor.js
     * createEnablerHoldUpdate to be used when the enabler plugin is enabled
     */
    self.createHoldUpdate = function(call, hold, remote_hold_status, successCallback, failureCallback) {
        logger.debug("createHoldUpdate: local hold= " + hold + " remote hold= " + remote_hold_status + " state= " + call.peer.signalingState);
        var peer = call.peer,
                audioDirection,
                videoDirection,
                muteCall,
                localDescObj;

        audioDirection = sdpParser.getAudioSdpDirection(peer.localDescription.sdp);
        videoDirection = sdpParser.getVideoSdpDirection(peer.localDescription.sdp);

        if (self.createNewPeerForCall(call))
        {
            peer = call.peer;
        }

        peer.createOffer(function createHoldUpdateCreateOfferSuccessCallback(obj) {

            obj.sdp = sdpParser.incrementVersion(obj.sdp);
            obj.sdp = sdpParser.setTcpSetupAttributeToActpass(obj.sdp, self.isDtlsEnabled());
            obj.sdp = self.performSdpWorkaroundsAfterCreateOffer(call, obj.sdp);

            //two sdp-s are created here
            //one is to be used by rest-request (externalSdp)
            //one is to set the audio-video direction of the local call (localSdp)
            //this is needed in order to adapt to the rfc (needs sendrecv to sendonly transition) 
            //and to the plugin (needs inactive to mute audio and video connection)

            if (hold || remote_hold_status) {
                if (audioDirection === CONSTANTS.WEBRTC.MEDIA_STATE.SEND_RECEIVE) {
                    obj.sdp = sdpParser.updateAudioSdpDirection(obj.sdp, CONSTANTS.WEBRTC.MEDIA_STATE.SEND_ONLY);
                } else {
                    if (!hold && remote_hold_status) {
                        obj.sdp = sdpParser.updateAudioSdpDirection(obj.sdp, CONSTANTS.WEBRTC.MEDIA_STATE.SEND_RECEIVE);
                    } else {
                        obj.sdp = sdpParser.updateAudioSdpDirectionToInactive(obj.sdp);
                    }
                }
                if (videoDirection === CONSTANTS.WEBRTC.MEDIA_STATE.SEND_RECEIVE) {
                    obj.sdp = sdpParser.updateVideoSdpDirection(obj.sdp, CONSTANTS.WEBRTC.MEDIA_STATE.SEND_ONLY);
                } else {
                    if (!hold && remote_hold_status) {
                        obj.sdp = sdpParser.updateVideoSdpDirection(obj.sdp, CONSTANTS.WEBRTC.MEDIA_STATE.SEND_RECEIVE);
                    } else {
                        obj.sdp = sdpParser.updateVideoSdpDirectionToInactive(obj.sdp);
                    }
                }
                muteCall = true;
            } else {
                obj.sdp = sdpParser.updateAudioSdpDirection(obj.sdp, CONSTANTS.WEBRTC.MEDIA_STATE.SEND_RECEIVE);
                if (self.canOriginatorSendLocalVideo(call)) {
                    obj.sdp = sdpParser.updateVideoSdpDirection(obj.sdp, CONSTANTS.WEBRTC.MEDIA_STATE.SEND_RECEIVE);
                } else {
                    obj.sdp = sdpParser.updateVideoSdpDirection(obj.sdp, CONSTANTS.WEBRTC.MEDIA_STATE.RECEIVE_ONLY);
                }
                muteCall = false;
            }

            obj.sdp = sdpParser.fixLocalTelephoneEventPayloadType(call, obj.sdp);

            localDescObj = self.getRtcLibrary().createRTCSessionDescription(CONSTANTS.WEBRTC.RTC_SDP_TYPE.OFFER, obj.sdp);

            peer.setLocalDescription(localDescObj,
                    function createHoldUpdateSetLocalDescriptionSuccessCallback() {
                        logger.debug("createHoldUpdate: setLocalDescription success");
                        self.muteOnHold(call, muteCall);
                    },
                    function createHoldUpdateSetLocalDescriptionFailureCallback(error) {
                        logger.error("createHoldUpdate: setLocalDescription failed: " + error.message);
                        utils.callFunctionIfExist(failureCallback);
                    });
        }, function createHoldUpdateCreateOfferFailureCallback(error) {
            logger.error("createHoldUpdate: createOffer failed: " + error.message);
            utils.callFunctionIfExist(failureCallback);
        }, {
            'mandatory': {
                'OfferToReceiveAudio': self.getMediaAudio(),
                'OfferToReceiveVideo': self.getMediaVideo()
            }
        });
    };

    /*
     * Enabler implementation lies on webRtcPluginAdaptor.js
     * processEnabler30Update to be used when the enabler plugin is enabled. (based on processEnabler30Update)
     */
    self.processUpdate = function(call, successCallback, failureCallback, local_hold_status) {
        logger.debug("processUpdate: state= " + call.peer.signalingState);
        var peer = call.peer, localSdp, remoteAudioState, remoteVideoState, peerRemoteSdp,
                remoteDescObj, peerLocalSdp, remoteVideoDirection, callSdpWithNoSsrc;

        // Meetme workaround. This workaround is added into native function
        call.sdp = sdpParser.addSdpMissingCryptoLine(call.sdp);
        call.sdp = sdpParser.checkAndRestoreICEParams(call.sdp, call.peer.localDescription.sdp);

        remoteVideoDirection = sdpParser.getVideoSdpDirection(call.sdp);

        self.setMediaVideo(sdpParser.isSdpHasVideo(call.sdp));
        if ((remoteVideoDirection === CONSTANTS.WEBRTC.MEDIA_STATE.INACTIVE) &&
                (call.currentState === "COMPLETED"))
        {
            switch (call.remoteVideoState) {
                case CONSTANTS.WEBRTC.MEDIA_STATE.INACTIVE:
                    call.sdp = sdpParser.updateVideoSdpDirection(call.sdp, CONSTANTS.WEBRTC.MEDIA_STATE.SEND_RECEIVE);
                    break;
                case CONSTANTS.WEBRTC.MEDIA_STATE.RECEIVE_ONLY:
                    call.sdp = sdpParser.updateVideoSdpDirection(call.sdp, CONSTANTS.WEBRTC.MEDIA_STATE.SEND_RECEIVE);
                    break;
                case CONSTANTS.WEBRTC.MEDIA_STATE.SEND_RECEIVE:
                    call.sdp = sdpParser.updateVideoSdpDirection(call.sdp, CONSTANTS.WEBRTC.MEDIA_STATE.RECEIVE_ONLY);
                    break;
            }
        }
        
        call.sdp = sdpParser.changeDirection(call.sdp, CONSTANTS.WEBRTC.MEDIA_STATE.SEND_ONLY, CONSTANTS.WEBRTC.MEDIA_STATE.SEND_RECEIVE, CONSTANTS.STRING.VIDEO);

        call.sdp = sdpParser.checkSupportedVideoCodecs(call.sdp, null, self.isH264Enabled());
        //this part is a work-around for webrtc bug
        //set remote description with inactive media lines first.
        //then set remote description with original media lines.

        //keep original values of remote audio and video states
        remoteAudioState = sdpParser.getAudioSdpDirection(call.sdp);
        remoteVideoState = sdpParser.getVideoSdpDirection(call.sdp);

        if (sdpParser.getVideoSdpDirection(call.sdp) === CONSTANTS.WEBRTC.MEDIA_STATE.INACTIVE ||
                sdpParser.getVideoSdpDirection(call.sdp) === CONSTANTS.WEBRTC.MEDIA_STATE.RECEIVE_ONLY)
        {
            call.sdp = sdpParser.deleteInactiveVideoSsrc(call.sdp);
        }
        
        call.sdp = sdpParser.setTcpSetupAttributeToActpass(call.sdp, self.isDtlsEnabled());
        // delete all ssrc lines from the sdp before setting first remote description
        // set second remote description with all ssrc lines included
        peerRemoteSdp = self.getRtcLibrary().createRTCSessionDescription(CONSTANTS.WEBRTC.RTC_SDP_TYPE.OFFER, call.prevRemoteSdp);
        peerLocalSdp = peer.localDescription.sdp;

        if (self.createNewPeerForCall(call)) {
            peer = call.peer;
        }
        
        if (sdpParser.isSdpHas(call.prevRemoteSdp, CONSTANTS.STRING.VIDEO) || sdpParser.isIceLite(call.sdp) || local_hold_status) {          
            //set media lines with sendonly state for work-around
            call.sdp = sdpParser.updateAudioSdpDirectionToInactive(call.sdp);
            call.sdp = sdpParser.updateVideoSdpDirectionToInactive(call.sdp);        
        
            callSdpWithNoSsrc = sdpParser.deleteSsrcFromSdp(call.sdp);

            remoteDescObj = self.getRtcLibrary().createRTCSessionDescription(CONSTANTS.WEBRTC.RTC_SDP_TYPE.OFFER, callSdpWithNoSsrc);
            peer.setRemoteDescription(remoteDescObj,
                    function processUpdateWorkaroundSetRemoteDescriptionSuccessCallback() {
                        logger.debug("processUpdate: workaround setRemoteDescription success");

                        //restore original values
                        call.sdp = sdpParser.updateAudioSdpDirection(call.sdp, remoteAudioState);
                        call.sdp = sdpParser.updateVideoSdpDirection(call.sdp, remoteVideoState);

                        remoteDescObj = self.getRtcLibrary().createRTCSessionDescription(CONSTANTS.WEBRTC.RTC_SDP_TYPE.OFFER, call.sdp);

                        peer.setRemoteDescription(remoteDescObj,
                                function processUpdateSetRemoteDescriptionSuccessCallback() {
                                    logger.debug("processUpdate: setRemoteDescription success");
                                    call.remoteVideoState = sdpParser.getVideoSdpDirection(call.sdp);

                                    peer.createAnswer(peer.remoteDescription,
                                            function processUpdateCreateAnswerSuccessCallback(obj) {
                                                logger.debug("processUpdate: isSdpEnabled audio= " + sdpParser.isAudioSdpEnabled(obj.sdp));
                                                logger.debug("processUpdate: isSdpEnabled video= " + sdpParser.isVideoSdpEnabled(obj.sdp));

                                                if (sdpParser.isAudioSdpEnabled(obj.sdp) || sdpParser.isVideoSdpEnabled(obj.sdp)) {
                                                    if (sdpParser.isSdpVideoSendEnabled(call.sdp)) {
                                                        if (self.canOriginatorSendLocalVideo(call)) {
                                                            obj.sdp = sdpParser.updateVideoSdpDirection(obj.sdp, CONSTANTS.WEBRTC.MEDIA_STATE.SEND_RECEIVE);
                                                        } else {
                                                            obj.sdp = sdpParser.updateVideoSdpDirection(obj.sdp, CONSTANTS.WEBRTC.MEDIA_STATE.RECEIVE_ONLY);
                                                        }
                                                    } else {
                                                        if (self.canOriginatorSendLocalVideo(call) && !sdpParser.isVideoSdpDirectionInactive(call.sdp)) {
                                                            obj.sdp = sdpParser.updateVideoSdpDirection(obj.sdp, CONSTANTS.WEBRTC.MEDIA_STATE.SEND_ONLY);
                                                        } else {
                                                            obj.sdp = sdpParser.updateVideoSdpDirection(obj.sdp, CONSTANTS.WEBRTC.MEDIA_STATE.INACTIVE);
                                                        }
                                                    }

                                                    //TODO: Since there is no setter method for obj.sdp from the plugin side,
                                                    //      we create a temporary local variable and pass obj.sdp's value into it.
                                                    //      Rewrite the below part of code when the setter method is applied to the plugin side
                                                    localSdp = sdpParser.getSdpFromObject(obj);
                                                    obj = null;
                                                    localSdp = sdpParser.updateVersion(peerLocalSdp, localSdp);

                                                    localSdp = sdpParser.checkIceParamsLengths(localSdp, call.sdp);
                                                    localSdp = sdpParser.setTcpSetupAttributeTo(localSdp, call.localTcpSetupAttribute, self.isDtlsEnabled());

                                                    localSdp = sdpParser.fixLocalTelephoneEventPayloadType(call, localSdp);

                                                    peer.setLocalDescription(
                                                            self.getRtcLibrary().createRTCSessionDescription(CONSTANTS.WEBRTC.RTC_SDP_TYPE.ANSWER, localSdp),
                                                            function processUpdateSetLocalDescriptionSuccessCallback() {
                                                                logger.debug("processUpdate: setLocalDescription success");
                                                            },
                                                            function processUpdateSetLocalDescriptionFailureCallback(e) {
                                                                logger.debug("processUpdate: setLocalDescription failed: " + e);
                                                                utils.callFunctionIfExist(failureCallback, "processUpdate: setlocalDescription failed!!");
                                                            });
                                                } else {
                                                    logger.debug("processUpdate: createAnswer failed!!");
                                                    utils.callFunctionIfExist(failureCallback, "No codec negotiation");

                                                }
                                            },
                                            function processUpdateCreateAnswerFailureCallback(e) {
                                                logger.debug("processUpdate: createAnswer failed!! " + e);
                                                utils.callFunctionIfExist(failureCallback, "Session cannot be created");
                                            },
                                            {
                                                'mandatory': {
                                                    'OfferToReceiveAudio': self.getMediaAudio(),
                                                    'OfferToReceiveVideo': self.getMediaVideo()
                                                }
                                            }
                                    );
                                },
                                function processUpdateSetRemoteDescriptionSuccessCallback(e) {
                                    logger.debug("processUpdate: setRemoteDescription failed: " + e);
                                    utils.callFunctionIfExist(failureCallback, "processUpdate: setRemoteDescription failed!!");
                                });
                    },
                    function processUpdateWorkaroundSetRemoteDescriptionFailureCallback(e) {
                        logger.debug("processUpdate: workaround setRemoteDescription failed!!" + e);
                        utils.callFunctionIfExist(failureCallback, "processUpdate: workaround setRemoteDescription failed!!");
                    }
            );
        }
        else {
            remoteDescObj = self.getRtcLibrary().createRTCSessionDescription(CONSTANTS.WEBRTC.RTC_SDP_TYPE.OFFER, callSdpWithNoSsrc);
            peer.setRemoteDescription(remoteDescObj,
                    function processUpdateWorkaroundSetRemoteDescriptionSuccessCallback() {
                        logger.debug("processUpdate: workaround setRemoteDescription success");

                        //restore original values
                        call.sdp = sdpParser.updateAudioSdpDirection(call.sdp, remoteAudioState);
                        call.sdp = sdpParser.updateVideoSdpDirection(call.sdp, remoteVideoState);

                        remoteDescObj = self.getRtcLibrary().createRTCSessionDescription(CONSTANTS.WEBRTC.RTC_SDP_TYPE.OFFER, call.sdp);

                        peer.setRemoteDescription(remoteDescObj,
                                function processUpdateSetRemoteDescriptionSuccessCallback() {
                                    logger.debug("processUpdate: setRemoteDescription success");
                                    call.remoteVideoState = sdpParser.getVideoSdpDirection(call.sdp);

                                    peer.createAnswer(peer.remoteDescription,
                                            function processUpdateCreateAnswerSuccessCallback(obj) {
                                                logger.debug("processUpdate: isSdpEnabled audio= " + sdpParser.isAudioSdpEnabled(obj.sdp));
                                                logger.debug("processUpdate: isSdpEnabled video= " + sdpParser.isVideoSdpEnabled(obj.sdp));

                                                if (sdpParser.isAudioSdpEnabled(obj.sdp) || sdpParser.isVideoSdpEnabled(obj.sdp)) {
                                                    if (sdpParser.isSdpVideoSendEnabled(call.sdp)) {
                                                        if (self.canOriginatorSendLocalVideo(call)) {
                                                            obj.sdp = sdpParser.updateVideoSdpDirection(obj.sdp, CONSTANTS.WEBRTC.MEDIA_STATE.SEND_RECEIVE);
                                                        } else {
                                                            obj.sdp = sdpParser.updateVideoSdpDirection(obj.sdp, CONSTANTS.WEBRTC.MEDIA_STATE.RECEIVE_ONLY);
                                                        }
                                                    } else {
                                                        if (self.canOriginatorSendLocalVideo(call) && !sdpParser.isVideoSdpDirectionInactive(call.sdp)) {
                                                            obj.sdp = sdpParser.updateVideoSdpDirection(obj.sdp, CONSTANTS.WEBRTC.MEDIA_STATE.SEND_ONLY);
                                                        } else {
                                                            obj.sdp = sdpParser.updateVideoSdpDirection(obj.sdp, CONSTANTS.WEBRTC.MEDIA_STATE.INACTIVE);
                                                        }
                                                    }

                                                    //TODO: Since there is no setter method for obj.sdp from the plugin side,
                                                    //      we create a temporary local variable and pass obj.sdp's value into it.
                                                    //      Rewrite the below part of code when the setter method is applied to the plugin side
                                                    localSdp = sdpParser.getSdpFromObject(obj);
                                                    obj = null;
                                                    localSdp = sdpParser.updateVersion(peerLocalSdp, localSdp);

                                                    localSdp = sdpParser.checkIceParamsLengths(localSdp, call.sdp);
                                                    localSdp = sdpParser.setTcpSetupAttributeTo(localSdp, call.localTcpSetupAttribute, self.isDtlsEnabled());

                                                    localSdp = sdpParser.fixLocalTelephoneEventPayloadType(call, localSdp);

                                                    peer.setLocalDescription(
                                                            self.getRtcLibrary().createRTCSessionDescription(CONSTANTS.WEBRTC.RTC_SDP_TYPE.ANSWER, localSdp),
                                                            function processUpdateSetLocalDescriptionSuccessCallback() {
                                                                logger.debug("processUpdate: setLocalDescription success");
                                                            },
                                                            function processUpdateSetLocalDescriptionFailureCallback(e) {
                                                                logger.debug("processUpdate: setLocalDescription failed: " + e);
                                                                utils.callFunctionIfExist(failureCallback, "processUpdate: setlocalDescription failed!!");
                                                            });
                                                } else {
                                                    logger.debug("processUpdate: createAnswer failed!!");
                                                    utils.callFunctionIfExist(failureCallback, "No codec negotiation");

                                                }
                                            },
                                            function processUpdateCreateAnswerFailureCallback(e) {
                                                logger.debug("processUpdate: createAnswer failed!! " + e);
                                                utils.callFunctionIfExist(failureCallback, "Session cannot be created");
                                            },
                                            {
                                                'mandatory': {
                                                    'OfferToReceiveAudio': self.getMediaAudio(),
                                                    'OfferToReceiveVideo': self.getMediaVideo()
                                                }
                                            }
                                    );
                                },
                                function processUpdateSetRemoteDescriptionSuccessCallback(e) {
                                    logger.debug("processUpdate: setRemoteDescription failed: " + e);
                                    utils.callFunctionIfExist(failureCallback, "processUpdate: setRemoteDescription failed!!");
                                });
                    },
                    function processUpdateWorkaroundSetRemoteDescriptionFailureCallback(e) {
                        logger.debug("processUpdate: workaround setRemoteDescription failed!!" + e);
                        utils.callFunctionIfExist(failureCallback, "processUpdate: workaround setRemoteDescription failed!!");
                    }
            );       
        }
    };

    /*
     * Enabler implementation lies on webRtcPluginAdaptor.js
     * processEnabler30Answer to be used when the enabler plugin is enabled
     */
    self.processAnswer = function(call, onSuccess, onFail) {
        logger.debug("processAnswer: state= " + call.peer.signalingState);

        var onSuccessAfterWorkarounds, setRemoteDescription,
                remoteVideoDirection, localVideoDirection;

        onSuccessAfterWorkarounds = function() {
            call.remoteVideoState = sdpParser.getVideoSdpDirection(call.sdp);
            call.videoOfferSent = sdpParser.isSdpHasVideo(call.sdp);
            utils.callFunctionIfExist(onSuccess);
        };

        setRemoteDescription = function(call, onSuccess, onFailure) {
            call.peer.setRemoteDescription(
                    self.getRtcLibrary().createRTCSessionDescription(CONSTANTS.WEBRTC.RTC_SDP_TYPE.ANSWER, call.sdp),
                    function() {
                        logger.debug("processAnswer: setRemoteDescription success");
                        onSuccess();
                    },
                    function(e) {
                        logger.debug("processAnswer: setRemoteDescription failed: " + e);
                        onFailure();
                    });
        };

        self.setTcpSetupAttiributesOnProcessAnswer(call, call.sdp);
        call.sdp = sdpParser.checkSupportedVideoCodecs(call.sdp, sdpParser.getSdpFromObject(call.peer.localDescription), self.isH264Enabled());
        call.sdp = sdpParser.performVideoPortZeroWorkaround(call.sdp);

        remoteVideoDirection = sdpParser.getVideoSdpDirection(call.sdp);
        localVideoDirection = sdpParser.getVideoSdpDirection(sdpParser.getSdpFromObject(call.peer.localDescription));

        // this is needed for buggy webrtc api. when term answers with video to audio only call
        // this scenario does not work without converting to sendrecv
        logger.debug("processAnswer: ice-lite: do remote video escalation");
        call.sdp = sdpParser.changeDirection(call.sdp, CONSTANTS.WEBRTC.MEDIA_STATE.SEND_ONLY, CONSTANTS.WEBRTC.MEDIA_STATE.SEND_RECEIVE);

        if (localVideoDirection === CONSTANTS.WEBRTC.MEDIA_STATE.RECEIVE_ONLY &&
                (remoteVideoDirection === CONSTANTS.WEBRTC.MEDIA_STATE.INACTIVE || remoteVideoDirection === CONSTANTS.WEBRTC.MEDIA_STATE.RECEIVE_ONLY)) {

            // Audio <--> Audio : apply workaround step 1

            // delete ssrc only from video, keep audio ssrc to hear audio
            call.sdp = sdpParser.deleteInactiveVideoSsrc(call.sdp);

            setRemoteDescription(call, onSuccessAfterWorkarounds, onFail);

        } else if (localVideoDirection === CONSTANTS.WEBRTC.MEDIA_STATE.SEND_RECEIVE &&
                (remoteVideoDirection === CONSTANTS.WEBRTC.MEDIA_STATE.RECEIVE_ONLY || remoteVideoDirection === CONSTANTS.WEBRTC.MEDIA_STATE.INACTIVE)) {

            // delete ssrc only from video, keep audio ssrc to hear audio
            call.sdp = sdpParser.deleteInactiveVideoSsrc(call.sdp);
            // Audio-Video <--> Audio : apply workaround step 1 & 2

            setRemoteDescription(call, onSuccessAfterWorkarounds, onFail);

        } else if (localVideoDirection === CONSTANTS.WEBRTC.MEDIA_STATE.RECEIVE_ONLY &&
                (remoteVideoDirection === CONSTANTS.WEBRTC.MEDIA_STATE.SEND_ONLY || remoteVideoDirection === CONSTANTS.WEBRTC.MEDIA_STATE.SEND_RECEIVE)) {

            // Audio  <--> Audio-Video

            setRemoteDescription(call, function() {
                self.performVideoStartWorkaround(call, onSuccessAfterWorkarounds, onFail);
            }, onFail);

        } else {

            // Audio-Video <--> Audio-Video
            // there is remote video, no need for orig side workaround

            setRemoteDescription(call, onSuccessAfterWorkarounds, onFail);
        }
    };

    /*
     * Enabler implementation lies on webRtcPluginAdaptor.js
     * performEnablerVideoStartWorkaround - term side cannot see orig's video
     */
    self.performVideoStartWorkaround = function(call, onSuccess, onFail) {
        var peer = call.peer, remoteAudioState, remoteVideoState,
                callSdpWithNoSsrc;

        logger.debug("Workaround to play video");

        call.sdp = sdpParser.addSdpMissingCryptoLine(call.sdp);

        remoteAudioState = sdpParser.getSdpDirectionLogging(call.sdp, CONSTANTS.STRING.AUDIO, false);
        remoteVideoState = sdpParser.getSdpDirectionLogging(call.sdp, CONSTANTS.STRING.VIDEO, false);

        call.sdp = sdpParser.updateSdpDirection(call.sdp, CONSTANTS.STRING.AUDIO, CONSTANTS.WEBRTC.MEDIA_STATE.INACTIVE);
        call.sdp = sdpParser.updateSdpDirection(call.sdp, CONSTANTS.STRING.VIDEO, CONSTANTS.WEBRTC.MEDIA_STATE.INACTIVE);

        call.sdp = sdpParser.setTcpSetupAttributeToActpass(call.sdp, self.isDtlsEnabled());

        callSdpWithNoSsrc = sdpParser.deleteSsrcFromSdp(call.sdp);

        peer.setRemoteDescription(
                self.getRtcLibrary().createRTCSessionDescription(CONSTANTS.WEBRTC.RTC_SDP_TYPE.OFFER, callSdpWithNoSsrc), function() {
            logger.debug("performVideoStartWorkaround: first setRemoteDescription success");

            // restore original values
            call.sdp = sdpParser.updateSdpDirection(call.sdp, CONSTANTS.STRING.AUDIO, remoteAudioState);
            call.sdp = sdpParser.updateSdpDirection(call.sdp, CONSTANTS.STRING.VIDEO, remoteVideoState);

            peer.setRemoteDescription(
                    self.getRtcLibrary().createRTCSessionDescription(CONSTANTS.WEBRTC.RTC_SDP_TYPE.OFFER, call.sdp), function() {
                logger.debug("performVideoStartWorkaround: second setRemoteDescription success");
                peer.createAnswer(peer.remoteDescription, function(obj) {
                    var localSdp = sdpParser.getSdpFromObject(obj);

                    if (sdpParser.getSdpDirectionLogging(call.sdp, CONSTANTS.STRING.AUDIO, false) === CONSTANTS.WEBRTC.MEDIA_STATE.INACTIVE) {
                        localSdp = sdpParser.updateSdpDirection(localSdp, CONSTANTS.STRING.AUDIO, CONSTANTS.WEBRTC.MEDIA_STATE.INACTIVE);
                    }

                    if (call.remoteVideoState === CONSTANTS.WEBRTC.MEDIA_STATE.INACTIVE) {
                        localSdp = sdpParser.updateSdpDirection(localSdp, CONSTANTS.STRING.VIDEO, CONSTANTS.WEBRTC.MEDIA_STATE.INACTIVE);
                    } else if (self.canOriginatorSendLocalVideo(call)) {
                        localSdp = sdpParser.updateSdpDirection(localSdp, CONSTANTS.STRING.VIDEO, CONSTANTS.WEBRTC.MEDIA_STATE.SEND_RECEIVE);
                    } else {
                        localSdp = sdpParser.updateSdpDirection(localSdp, CONSTANTS.STRING.VIDEO, CONSTANTS.WEBRTC.MEDIA_STATE.RECEIVE_ONLY);
                    }

                    localSdp = sdpParser.checkAndRestoreICEParams(localSdp, call.sdp);

                    localSdp = sdpParser.setTcpSetupAttributeTo(localSdp, call.localTcpSetupAttribute, self.isDtlsEnabled());

                    localSdp = sdpParser.fixLocalTelephoneEventPayloadType(call, localSdp);

                    peer.setLocalDescription(
                            self.getRtcLibrary().createRTCSessionDescription(CONSTANTS.WEBRTC.RTC_SDP_TYPE.ANSWER, localSdp), function() {
                        logger.debug("performVideoStartWorkaround: setlocalDescription success");
                        utils.callFunctionIfExist(onSuccess);
                    }, function(e) {
                        logger.debug("performVideoStartWorkaround: setlocalDescription failed!!" + e);
                        utils.callFunctionIfExist(onFail, "performVideoStartWorkaround: setlocalDescription failed!!");
                    });
                }, function(e) {
                    logger.debug("performVideoStartWorkaround: createAnswer failed!! " + e);
                    utils.callFunctionIfExist(onFail, "Session cannot be created");
                }, {
                    'mandatory': {
                        'OfferToReceiveAudio': self.getMediaAudio(),
                        'OfferToReceiveVideo': self.getMediaVideo()
                    }
                });
            }, function(e) {
                logger.debug("performVideoStartWorkaround: second setRemoteDescription failed!!" + e);
                utils.callFunctionIfExist(onFail, "performVideoStartWorkaround: second setRemoteDescription failed!!");
            });
        }, function(e) {
            logger.debug("performVideoStartWorkaround: first setRemoteDescription failed!!" + e);
            utils.callFunctionIfExist(onFail, "performVideoStartWorkaround: first setRemoteDescription failed!!");
        });
    };

    /*
     * Enabler implementation lies on webRtcPluginAdaptor.js
     * processPreAnswer to be used when the enabler plugin is enabled
     */
    self.processPreAnswer = function(call) {
        var ans;

        logger.debug("processPreAnswer: state= " + call.peer.signalingState);

        call.sdp = sdpParser.checkSupportedVideoCodecs(call.sdp, sdpParser.getSdpFromObject(call.peer.localDescription), self.isH264Enabled());
        call.sdp = sdpParser.removeG722Codec(call.sdp);
        call.sdp = sdpParser.removeRTXCodec(call.sdp);
        call.sdp = sdpParser.fixRemoteTelephoneEventPayloadType(call, call.sdp);

        ans = self.getRtcLibrary().createRTCSessionDescription(CONSTANTS.WEBRTC.RTC_SDP_TYPE.PRANSWER, call.sdp);

        call.peer.setRemoteDescription(ans,
                function processPreAnswerSetRemoteDescriptionSuccessCallback() {
                    self.setOriginatorReceiveRemoteVideo(call);
                    call.remoteVideoState = sdpParser.getVideoSdpDirection(call.sdp);
                    logger.debug("processPreAnswer: setRemoteDescription success");
                },
                function processPreAnswerSetRemoteDescriptionFailureCallback(e) {
                    logger.debug("processPreAnswer: setRemoteDescription failed: " + e);
                });
    };

    /*
     * Enabler implementation lies on webRtcPluginAdaptor.js
     * processEnablerRespond
     */
    self.processRespond = function(call, onSuccess, onFailure, isJoin) {
        var remoteVideoDirection;

        logger.debug("processRespond: state= " + call.peer.signalingState);

        call.sdp = sdpParser.checkSupportedVideoCodecs(call.sdp, sdpParser.getSdpFromObject(call.peer.localDescription), self.isH264Enabled());

        remoteVideoDirection = sdpParser.getVideoSdpDirection(call.sdp);

        if ((remoteVideoDirection === CONSTANTS.WEBRTC.MEDIA_STATE.INACTIVE) && (call.currentState === "COMPLETED"))
        {
            switch (call.remoteVideoState) {
                case CONSTANTS.WEBRTC.MEDIA_STATE.INACTIVE:
                    call.sdp = sdpParser.updateSdpDirection(call.sdp, CONSTANTS.STRING.VIDEO, CONSTANTS.WEBRTC.MEDIA_STATE.RECEIVE_ONLY);
                    break;
                case CONSTANTS.WEBRTC.MEDIA_STATE.RECEIVE_ONLY:
                    call.sdp = sdpParser.updateSdpDirection(call.sdp, CONSTANTS.STRING.VIDEO, CONSTANTS.WEBRTC.MEDIA_STATE.RECEIVE_ONLY);
                    break;
            }
        }

        call.remoteVideoState = sdpParser.getVideoSdpDirection(call.sdp);
        call.sdp = sdpParser.changeDirection(call.sdp, CONSTANTS.WEBRTC.MEDIA_STATE.SEND_ONLY, CONSTANTS.WEBRTC.MEDIA_STATE.SEND_RECEIVE, CONSTANTS.STRING.VIDEO);
        if (isJoin) {
            call.sdp = sdpParser.changeDirection(call.sdp, CONSTANTS.WEBRTC.MEDIA_STATE.RECEIVE_ONLY, CONSTANTS.WEBRTC.MEDIA_STATE.SEND_RECEIVE, CONSTANTS.STRING.AUDIO);
            self.muteOnHold(call, false);
        }

        if (call.peer.signalingState === CONSTANTS.WEBRTC.RTC_SIGNALING_STATE.STABLE) {
            //if we are in stable state we should not change remotedescription
            utils.callFunctionIfExist(onSuccess);
            return;
        }

        if (sdpParser.getVideoSdpDirection(call.sdp) === CONSTANTS.WEBRTC.MEDIA_STATE.INACTIVE ||
                sdpParser.getVideoSdpDirection(call.sdp) === CONSTANTS.WEBRTC.MEDIA_STATE.RECEIVE_ONLY)
        {
            call.sdp = sdpParser.deleteInactiveVideoSsrc(call.sdp);
        }

        call.peer.setRemoteDescription(
                self.getRtcLibrary().createRTCSessionDescription(CONSTANTS.WEBRTC.RTC_SDP_TYPE.ANSWER, call.sdp),
                function() {
                    logger.debug("processRespond: setRemoteDescription success");
                    var onSuccessAfterWorkaround = function() {
                        call.remoteVideoState = sdpParser.getVideoSdpDirection(call.sdp);
                        call.videoOfferSent = true;
                        utils.callFunctionIfExist(onSuccess);
                    };
                    // utils.callFunctionIfExist(onSuccessAfterWorkaround);
                    self.performVideoStartWorkaround(call, onSuccessAfterWorkaround, onFailure);
                },
                function(e) {
                    logger.debug("processRespond: setRemoteDescription failed: " + e);
                    utils.callFunctionIfExist(onFailure);
                });
    };

    /*
     * createPluginReOffer
     */
    self.createReOffer = function(call, successCallback, failureCallback, usePreviousAudioDirection) {
        var peer = call.peer, newSdp,
                localAudioDirection, localVideoDirection,
                prevLocalSdp = call.peer.localDescription.sdp;
        
         logger.debug("createReOffer:" + call.id);

        if (self.createNewPeerForCall(call))
        {
            peer = call.peer;
        }

        peer.createOffer(
                function processSlowStartCreateOfferSuccessCallback(oSdp) {
                    newSdp = sdpParser.getSdpFromObject(oSdp);
                    oSdp = null;

                    localVideoDirection = sdpParser.getVideoSdpDirection(prevLocalSdp);
                    newSdp = sdpParser.updateVideoSdpDirection(newSdp, localVideoDirection);

                    if (usePreviousAudioDirection) {
                        localAudioDirection = sdpParser.getAudioSdpDirection(prevLocalSdp);
                        newSdp = sdpParser.updateAudioSdpDirection(newSdp, localAudioDirection);
                    }

                    newSdp = sdpParser.deleteCryptoZeroFromSdp(newSdp);
                    newSdp = sdpParser.updateAudioCodec(newSdp);
                    newSdp = sdpParser.removeG722Codec(newSdp);
                    newSdp = sdpParser.deleteCryptoFromSdp(newSdp, self.isDtlsEnabled());
                    newSdp = sdpParser.setTcpSetupAttributeToActpass(newSdp, self.isDtlsEnabled());
                    newSdp = sdpParser.fixLocalTelephoneEventPayloadType(call, newSdp);
                    newSdp = self.performSdpWorkaroundsAfterCreateOffer(call, newSdp);

                    peer.setLocalDescription(
                            self.getRtcLibrary().createRTCSessionDescription(CONSTANTS.WEBRTC.RTC_SDP_TYPE.OFFER, newSdp),
                            function processSlowStartSetLocalDescriptionSuccessCallback() {
                                logger.debug("createReOffer: setLocalDescription success" + call.id);
                            },
                            function processSlowStartSetLocalDescriptionFailureCallback(e) {
                                logger.debug("createReOffer: setLocalDescription failed!!" + e + call.id);
                                utils.callFunctionIfExist(failureCallback);
                            });
                },
                function processSlowStartCreateOfferFailureCallback(e) {
                    logger.error("createReOffer: createOffer failed!! " + e);
                    utils.callFunctionIfExist(failureCallback);
                },
                {
                    'mandatory': {
                        'OfferToReceiveAudio': self.getMediaAudio(),
                        'OfferToReceiveVideo': self.getMediaVideo()
                    }
                });
    };

    /*
     * Enabler implementation lies on webRtcPluginAdaptor.js
     * processEnablerHold to be used when the enabler plugin 30 is enabled.
     */
    self.processHold = function(call, hold, local_hold_status, successCallback, failureCallback) {
        logger.debug("processHold: local hold= " + local_hold_status + " remote hold= " + hold + " state= " + call.peer.signalingState);
        var peer = call.peer, updateSdp, audioDirection, videoDirection,
                peerLocalSdp, localSdp;

        if (!local_hold_status && !hold) {
            self.muteOnHold(call, false);
        }

        call.sdp = sdpParser.checkSupportedVideoCodecs(call.sdp, null, self.isH264Enabled());
        call.sdp = sdpParser.performVideoPortZeroWorkaround(call.sdp);
        call.sdp = sdpParser.checkAndRestoreICEParams(call.sdp, sdpParser.getSdpFromObject(call.peer.localDescription));

        audioDirection = sdpParser.getAudioSdpDirection(call.sdp);
        videoDirection = sdpParser.getVideoSdpDirection(call.sdp);

        updateSdp = self.getRtcLibrary().createRTCSessionDescription(CONSTANTS.WEBRTC.RTC_SDP_TYPE.OFFER, call.sdp);
        peerLocalSdp = sdpParser.getSdpFromObject(peer.localDescription);

        if (self.createNewPeerForCall(call)) {
            peer = call.peer;
        }
        updateSdp.sdp = sdpParser.updateAudioSdpDirection(updateSdp.sdp, CONSTANTS.WEBRTC.MEDIA_STATE.SEND_RECEIVE);

        if (sdpParser.getVideoSdpDirection(updateSdp.sdp) === CONSTANTS.WEBRTC.MEDIA_STATE.INACTIVE ||
                sdpParser.getVideoSdpDirection(updateSdp.sdp) === CONSTANTS.WEBRTC.MEDIA_STATE.RECEIVE_ONLY)
        {
            updateSdp.sdp = sdpParser.deleteInactiveVideoSsrc(updateSdp.sdp);
        }
        peer.setRemoteDescription(
                updateSdp,
                function processHoldSetSecondRemoteDescriptionSuccessCallback() {
                    if (!hold && !local_hold_status && (videoDirection === CONSTANTS.WEBRTC.MEDIA_STATE.INACTIVE)) {
                        call.remoteVideoState = CONSTANTS.WEBRTC.MEDIA_STATE.RECEIVE_ONLY;
                    } else {
                        call.remoteVideoState = sdpParser.getVideoSdpDirection(updateSdp.sdp);
                    }
                    peer.createAnswer(
                            peer.remoteDescription,
                            function processHoldCreateAnswerSuccessCallback(obj) {
                                localSdp = sdpParser.getSdpFromObject(obj);
                                logger.debug("processHold: isSdpEnabled audio= " + sdpParser.isAudioSdpEnabled(obj.sdp));
                                logger.debug("processHold: isSdpEnabled video= " + sdpParser.isVideoSdpEnabled(obj.sdp));
                                obj = null;

                                if (hold) {
                                    logger.debug("processHold: Remote HOLD");
                                    localSdp = sdpParser.respondToRemoteSdpDirections(localSdp, call.sdp);
                                } else if (!local_hold_status) {
                                    logger.debug("processHold: Remote UNHOLD: direction left as it is");

                                    if (sdpParser.isSdpVideoSendEnabled(call.sdp)) {
                                        if (self.canOriginatorSendLocalVideo(call)) {
                                            localSdp = sdpParser.updateVideoSdpDirection(localSdp, CONSTANTS.WEBRTC.MEDIA_STATE.SEND_RECEIVE);
                                        } else {
                                            localSdp = sdpParser.updateVideoSdpDirection(localSdp, CONSTANTS.WEBRTC.MEDIA_STATE.RECEIVE_ONLY);
                                        }
                                    } else {
                                        if (self.canOriginatorSendLocalVideo(call) && !sdpParser.isVideoSdpDirectionInactive(call.sdp)) {
                                            localSdp = sdpParser.updateVideoSdpDirection(localSdp, CONSTANTS.WEBRTC.MEDIA_STATE.SEND_ONLY);
                                        } else {
                                            localSdp = sdpParser.updateVideoSdpDirection(localSdp, CONSTANTS.WEBRTC.MEDIA_STATE.INACTIVE);
                                        }
                                    }
                                    //change audio's direction to sendrecv for ssl attendees in a 3wc
                                    localSdp = sdpParser.changeDirection(localSdp, CONSTANTS.WEBRTC.MEDIA_STATE.RECEIVE_ONLY, CONSTANTS.WEBRTC.MEDIA_STATE.SEND_RECEIVE, CONSTANTS.STRING.AUDIO);
                                } else if (local_hold_status && !hold) {
                                    logger.debug("processHold: Remote UNHOLD on local hold");

                                    if (audioDirection === CONSTANTS.WEBRTC.MEDIA_STATE.INACTIVE) {
                                        localSdp = sdpParser.updateAudioSdpDirectionToInactive(localSdp);
                                    } else {
                                        localSdp = sdpParser.updateAudioSdpDirection(localSdp, CONSTANTS.WEBRTC.MEDIA_STATE.SEND_ONLY);
                                    }

                                    if (self.canOriginatorSendLocalVideo(call)) {
                                        localSdp = sdpParser.updateVideoSdpDirection(localSdp, CONSTANTS.WEBRTC.MEDIA_STATE.SEND_ONLY);
                                    } else {
                                        localSdp = sdpParser.updateVideoSdpDirectionToInactive(localSdp);
                                    }
                                }

                                localSdp = sdpParser.updateVersion(peerLocalSdp, localSdp);
                                localSdp = sdpParser.checkIceParamsLengths(localSdp, updateSdp.sdp);
                                localSdp = sdpParser.fixLocalTelephoneEventPayloadType(call, localSdp);

                                localSdp = sdpParser.setTcpSetupAttributeTo(localSdp, call.localTcpSetupAttribute, self.isDtlsEnabled());

                                localSdp = sdpParser.updateH264Level(localSdp);

                                peer.setLocalDescription(
                                        self.getRtcLibrary().createRTCSessionDescription(CONSTANTS.WEBRTC.RTC_SDP_TYPE.ANSWER, localSdp),
                                        function processHoldSetLocalDescriptionSuccessCallback() {
                                            logger.debug("processHold: setLocalDescription success!! ");
                                        },
                                        function processHoldSetLocalDescriptionFailureCallback(e) {
                                            logger.error("processHold: setLocalDescription failed!! " + e);
                                            utils.callFunctionIfExist(failureCallback, "Session cannot be created");
                                        });
                            },
                            function processHoldCreateAnswerFailureCallback(e) {
                                logger.error("processHold: createAnswer failed!!: " + e);
                                utils.callFunctionIfExist(failureCallback, "Session cannot be created");
                            },
                            {
                                'mandatory': {
                                    'OfferToReceiveAudio': self.getMediaAudio(),
                                    'OfferToReceiveVideo': self.getMediaVideo()
                                }
                            });
                },
                function processHoldSetSecondRemoteDescriptionFailureCallback(e) {
                    logger.error("processHold: second setRemoteDescription failed!! " + e);
                    utils.callFunctionIfExist(failureCallback, "Session cannot be created");
                });

    };

    /*
     * Enabler implementation lies on webRtcPluginAdaptor.js
     * processHoldRespond to be used when the enabler plugin is enabled
     */
    self.processHoldRespond = function(call, onSuccess, onFailure, isJoin) {
        var remoteAudioDirection,
            remoteVideoDirection,
            localHoldFlag = false,
            remoteHoldFlag = false;

        logger.debug("processHoldRespond: state= " + call.peer.signalingState + " call.currentState= " + call.currentState);

        call.sdp = sdpParser.checkSupportedVideoCodecs(call.sdp, sdpParser.getSdpFromObject(call.peer.localDescription), self.isH264Enabled());

        sdpParser.init(call.sdp);
        remoteHoldFlag = sdpParser.isRemoteHold();

        localHoldFlag = (call.currentState === "LOCAL_HOLD");

        if(!localHoldFlag){
            self.addCallIdInPluginContainer(call);
        }
        
        remoteAudioDirection = sdpParser.getAudioSdpDirection(call.sdp);
        remoteVideoDirection = sdpParser.getVideoSdpDirection(call.sdp);

        logger.debug("processHoldRespond: localHold= " + localHoldFlag + " remoteHold= " + remoteHoldFlag);

        /* Required for MOH - start */
        if (remoteHoldFlag === false) {
            if ((remoteAudioDirection === CONSTANTS.WEBRTC.MEDIA_STATE.SEND_RECEIVE) && (call.currentState === "REMOTE_HOLD")) {
                call.previousState = call.currentState;
                call.currentState = "COMPLETED";
            }
        } else {
            if (call.currentState === "COMPLETED") {
                call.previousState = call.currentState;
                call.currentState = "REMOTE_HOLD";
            }
        }

        if (localHoldFlag || remoteHoldFlag) {
            logger.debug("processHoldRespond: " + call.currentState + " : video -> inactive");
            call.sdp = sdpParser.updateSdpDirection(call.sdp, CONSTANTS.STRING.VIDEO, CONSTANTS.WEBRTC.MEDIA_STATE.INACTIVE);
        }

        if ((remoteVideoDirection === CONSTANTS.WEBRTC.MEDIA_STATE.INACTIVE) && (call.currentState === "COMPLETED")) {
            logger.debug("processHoldRespond: video inactive -> recvonly");
            call.sdp = sdpParser.updateSdpDirection(call.sdp, CONSTANTS.STRING.VIDEO, CONSTANTS.WEBRTC.MEDIA_STATE.RECEIVE_ONLY);
        }
        /* Required for MOH - end */

        self.processRespond(call, onSuccess, onFailure, isJoin);
    };

    // Enabler implementation lies on webRtcPluginAdaptor.js
    self.createPeer = function(call, onsuccess, onfailure) {
        try {
            var pc, constraints, i, servers = [], iceServerUrl = self.getIceServerUrl(), stunturn;
            if (iceServerUrl instanceof Array) {
                for (i = 0; i < iceServerUrl.length; i++) {
                    servers[i] = iceServerUrl[i];
                }
            } else if (iceServerUrl === null || iceServerUrl === "") {
                servers = [];
            } else {
                servers[0] = iceServerUrl;
            }
            stunturn = {iceServers: servers};

            constraints = {"optional": {"DtlsSrtpKeyAgreement": self.isDtlsEnabled()}};
            pc = self.getRtcLibrary().createRTCPeerConnection(stunturn, constraints);

            self.setPeerCount(self.getPeerCount() + 1);
            call.peer = pc;

            pc.onconnecting = function(event) {
                self.onSessionConnecting(call, event);
            };
            pc.onopen = function(event) {
                self.onSessionOpened(call, event);
            };
            pc.onsignalingstatechange = function(event) {
                self.onSignalingStateChange(call, event);
            };
            pc.onaddstream = function(event) {
                self.onRemoteStreamAdded(call, event);
            };
            pc.onremovestream = function(event) {
                self.onRemoteStreamRemoved(call, event);
            };
            pc.onicecandidate = function(event) {
                self.setupIceCandidateCollectionTimer(call);
                self.onIceCandidate(call, event);
            };
            pc.onicecomplete = function() {
                self.onIceComplete(call);
            };
            pc.oniceconnectionstatechange = function (event) {
                self.oniceconnectionstatechange(call, event);
            };

            logger.info("create PeerConnection successfully.");

            self.setupWebrtcLogCollectionTimer(call);

            utils.callFunctionIfExist(onsuccess);
        } catch (err) {
            logger.error("Failed to create PeerConnection, exception: " + err.message);
            utils.callFunctionIfExist(onfailure);
        }
    };

    self.createNewPeerForCall = function(call) {
        var isNewPeerCreated = false, peerCount = self.getPeerCount();
        if (call.peer) {
            call.peer.close();
            self.setPeerCount(peerCount - 1);
        }

        logger.trace("Creating new peer for call: " + call.id);
        self.createPeer(call, function createPeerSuccessCallback() {
            logger.trace("New peer has created for call: " + call.id);
            call.peer.addStream(call.localMedia.stream);
            isNewPeerCreated = true;
        }, function createPeerFailureCallback() {
            logger.error("New peer creation has failed!: " + call.id);
        });
        return isNewPeerCreated;
    };

    self.createNewPeerForCallIfIceChangedInRemoteSdp = function(call, newSdp, oldSdp) {
        var hasNewSdpContainsIceLite = sdpParser.isIceLite(newSdp),
                hasOldSdpContainsIceLite = sdpParser.isIceLite(oldSdp),
                isNewPeerCreated = false;

        // In Peer-Peer call, ice-iceLite change indicates
        // a new peer connection with different ip.
        // As for now, webrtc cannot handle ip change
        // without creating a peer.
        // For ex: Peer-Peer call and MoH.
        //
        // In Non Peer-Peer call, ice-iceLite change does
        // not occur so existing peer object will be used.

        if (hasNewSdpContainsIceLite !== hasOldSdpContainsIceLite) {
            logger.trace("Ice - Ice-Lite change detected in call: " + call.id);
            return self.createNewPeerForCall(call);
        }

        return isNewPeerCreated;
    };

    // pluginOnRemoteStreamAdded
    self.onRemoteStreamAdded = function(call, event) {
        var streamUrl, fireEvent,
                remoteVideoTracks = [],
                isVideoTrackAvailable = false;

        if (self.getDefaultVideoContainer()) {
            if(!self.isActiveCallInVideoContainer(self.getDefaultVideoContainer(), call)){
                logger.debug("onRemoteStreamAdded: It is not active call. Call Id: " + call.id);
                return;
            }
        } else if (self.getRemoteVideoContainer()) {
            if(!self.isActiveCallInVideoContainer(self.getRemoteVideoContainer(), call)){
                logger.debug("onRemoteStreamAdded: It is not active call. Call Id: " + call.id);
                return;
            }
        }
        
        if (event.stream) {
            streamUrl = self.getRtcLibrary().getURLFromStream(event.stream);

            if (streamUrl) {
                
                remoteVideoTracks = event.stream.getVideoTracks();
                if (remoteVideoTracks) {
                    if (remoteVideoTracks.length > 0) {
                        isVideoTrackAvailable = true;
                    }
                }
                
                if (self.getDefaultVideoContainer()) {
                    fireEvent = self.useDefaultRenderer(streamUrl, false, isVideoTrackAvailable);
                } else if (self.getRemoteVideoContainer()) {
                    fireEvent = self.createStreamRenderer(streamUrl, self.getRemoteVideoContainer());
                } else {
                    fireEvent = true;
                }
            }

            logger.debug("onRemoteStreamAdded: " + streamUrl);
            if (fireEvent) {
                self.fireOnStreamAddedEvent(call, streamUrl);
            }
        }
    };

    self.iceCandidateCollectionTimeoutHandler = function(call) {
        var sdp = call.peer.localDescription.sdp;
        self.clearIceCandidateCollectionTimer(call);        
        if(fcsConfig.relayCandidateCollectionTimeoutCycle) {
            call.relayCandidateCycle ++; 
        }
        // set timeout if there is no ice candidate available or 
        // when audio, video port assignment isn't complete
        if (!sdpParser.hasCandidates(sdp, call.relayCandidateCycle, fcsConfig.relayCandidateCollectionTimeoutCycle)) {
            logger.debug("Re-setting ice candidate collection timeout: " + fcsConfig.iceCandidateCollectionTimeoutInterval);
            call.iceCandidateCollectionTimer = setTimeout(function() {
                self.iceCandidateCollectionTimeoutHandler(call);
            }, fcsConfig.iceCandidateCollectionTimeoutInterval);
            return;
        }

        if (call.successCallback) {
            logger.debug("Ice candidate collection interrupted after given timeout, invoking successCallback.");

            sdp = sdpParser.updateH264Level(sdp);

            call.successCallback(sdp);
        }
    };

    self.setupIceCandidateCollectionTimer = function(call) {
        if (fcsConfig.iceCandidateCollectionTimeoutInterval) {
            if (!call.iceCandidateCollectionTimer) {
                logger.debug("Setting ice candidate collection timeout: " + fcsConfig.iceCandidateCollectionTimeoutInterval);
                if(fcsConfig.relayCandidateCollectionTimeoutCycle) {
                    call.relayCandidateCycle = 1;                
                } 
                call.iceCandidateCollectionTimer = setTimeout(function() {
                    self.iceCandidateCollectionTimeoutHandler(call);
                }, fcsConfig.iceCandidateCollectionTimeoutInterval);
            } else {
                logger.trace("Ice candidate collection timer exists.");
            }
        }
    };

    /*
     * Enabler implementation lies on webRtcPluginAdaptor.js
     * onIceCandidate to be called when the enabler plugin is enabled
     */
    self.onIceCandidate = function(call, event) {
        var sdp;
        if (event.candidate === null) {
            logger.debug("Null candidate received.");
            if (call.successCallback) {
                sdp = sdpParser.getSdpFromObject(call.peer.localDescription);

                if (sdpParser.hasCandidates(sdp, call.relayCandidateCycle, fcsConfig.relayCandidateCollectionTimeoutCycle)) {
                    self.clearIceCandidateCollectionTimer(call);
                    logger.debug("Candidates received, invoking successCallback.");

                    sdp = sdpParser.updateH264Level(sdp);
                    call.successCallback(sdp);
                }
                else {
                    logger.trace("Sdp does not have candidates.");
                }

            }
        } else {
            logger.debug("ICE candidate received : sdpMLineIndex = " + event.candidate.sdpMLineIndex
                    + ", candidate = " + event.candidate.candidate + " for call : " + call.id);
        }
    };

    // Enabler implementation lies on webRtcPluginAdaptor.js
    self.useDefaultRenderer = function(streamUrl, local, isVideoTrackAvailable) {
        var videoContainer;

        if (self.getDefaultVideoContainer() && self.getDefaultVideoContainer().children.length === 0) {
            // Create divs for the remote and local
            self.getDefaultVideoContainer().innerHTML = "<div style='height:100%;width:100%'></div><div style='position:absolute;bottom:10px;right:10px;height:30%; width:30%;'></div>";
        }

        if (local) {
            videoContainer = self.getDefaultVideoContainer().lastElementChild;
        } else {
            videoContainer = self.getDefaultVideoContainer().firstElementChild;

            if (!isVideoTrackAvailable) {
                videoContainer.style.width = "0%";
            } else {
                videoContainer.style.width = "100%";
            }
        }
        return self.createStreamRenderer(streamUrl, videoContainer, {
            muted: local
        });
    };


    // Enabler implementation lies on webRtcPluginAdaptor.js
    self.createStreamRenderer = function(streamUrl, container, options) {
        var renderer;

        if (!streamUrl || !container) {
            return;
        }

        container.innerHTML = "<object width='100%' height='100%' type='application/x-gcfwenabler-video'><param name='autoplay' value='true' /><param name='videosrc' value='" + streamUrl + "' /></object>";

        return renderer;
    };

    // Enabler implementation lies on webRtcPluginAdaptor.js
    self.sendIntraFrame = function(call) {
        if (!call.peer) {
            return;
        }

        if (self.canOriginatorSendLocalVideo(call)) {
            call.peer.sendIntraFrame();
        } else {
            //call.peer.sendBlackFrame();
            //sendBlackFrame is removed from plugin
            return;
        }
    };

    // Enabler implementation lies on webRtcPluginAdaptor.js
    self.sendBlackFrame = function(call) {
        if (!call.peer) {
            return;
        }
        //call.peer.sendBlackFrame();
        //TODO: This function will be completely removed since sendBlackFrame is removed from plugin
        return;
    };
    
    /**
     * Send DTMF tone
     * Enabler implementation lies on webRtcPluginAdaptor.js
     *
     * @ignore
     * @name rtc.sendDTMF
     * @function
     * @param {Object} call internalCall
     * @param {String} tone DTMF tone
     */
    self.sendDTMF = function (call, tone) {
        var localAudioTrack;

        if (!call.dtmfSender) {
            localAudioTrack = self.getLocalAudioTrack(call.peer);
            if (!localAudioTrack) {
                return;
            }
            call.dtmfSender = call.peer.createDTMFSender(localAudioTrack);
            if (!call.dtmfSender) {
                return;
            }
        }

        if (call.dtmfSender.canInsertDTMF === true) {
            call.dtmfSender.insertDTMF(tone, 400);
            logger.info("sending outband DTMF tone: " + tone);
        }
        else {
            logger.error("Failed to execute 'insertDTMF' on 'RTCDTMFSender': The 'canInsertDTMF' attribute is false: this sender cannot send DTMF");
        }
    };
    
    logger.debug('WebRtcPluginAdaptor initialized');
};

var WebRtcPluginAdaptor = function(_super, _decorator, _model) {
    var decorator = _decorator || webRtcLibraryDecorator,
            model = _model || new WebRtcPluginAdaptorModel();
    return new WebRtcPluginAdaptorImpl(_super ||
            new WebRtcAdaptor({}, decorator, model),
            decorator,
            model,
            logManager);
};

if (__testonly__) {
    __testonly__.WebRtcPluginAdaptor = WebRtcPluginAdaptor;
}

var WebRtcPluginv21AdaptorImpl = function(_super, _decorator, _model, _logManager) {
    var self = this,
        webRtcPlugin21Version = {
            major: 2,
            minor: 1,

            min_revision: 343,
            min_build: 0,

            current_revision: 376,
            current_build: 0
        }, logger = _logManager.getLogger("WebRtcPluginv21AdaptorImpl");
    logger.debug('WebRtcPluginv21Adaptor initializing');

    utils.compose(_super, self);
    utils.compose(_model, self);

    self.setPluginVersion(webRtcPlugin21Version);
    logger.debug('WebRtcPluginv21Adaptor initialized');
};

var WebRtcPluginv21Adaptor = function(_super, _decorator, _model) {
    var decorator = _decorator || webRtcLibraryDecorator,
            model = _model || new WebRtcPluginAdaptorModel();
    return new WebRtcPluginv21AdaptorImpl(_super ||
            new WebRtcPluginAdaptor(undefined, decorator, model),
            decorator, 
            model,
            logManager);
};

if (__testonly__) { __testonly__.WebRtcPluginv21Adaptor = WebRtcPluginv21Adaptor; }
var WebRtcPluginv22AdaptorImpl = function(_super, _decorator, _model, _logManager) {
    var self = this,
        webRtcPlugin22Version = {
            major: 2,
            minor: 2,

            min_revision: 477,
            min_build: 0,

            current_revision: 477,
            current_build: 0
        }, logger = _logManager.getLogger("WebRtcPluginv22AdaptorImpl");
    logger.debug('WebRtcPluginv22Adaptor initializing');

    utils.compose(_super, self);
    utils.compose(_model, self);

    self.setPluginVersion(webRtcPlugin22Version);
    logger.debug('WebRtcPluginv22Adaptor initialized');
};

var WebRtcPluginv22Adaptor = function(_super, _decorator, _model) {
    var decorator = _decorator || webRtcLibraryDecorator,
            model = _model || new WebRtcPluginAdaptorModel();
    return new WebRtcPluginv22AdaptorImpl(_super ||
            new WebRtcPluginAdaptor(undefined, decorator, model),
            decorator, 
            model,
            logManager);
};

if (__testonly__) { __testonly__.WebRtcPluginv22Adaptor = WebRtcPluginv22Adaptor; }
var WebRtcPluginv30AdaptorImpl = function(_super, _decorator, _model, _logManager) {
    var self = this,
        webRtcPlugin30Version = {
            major: 3,
            minor: 0,

            min_revision: 498,
            min_build: 0,

            current_revision: 498,
            current_build: 0
        }, logger = _logManager.getLogger("WebRtcPluginv30AdaptorImpl");
    logger.debug('WebRtcPluginv30Adaptor initializing');
    
    utils.compose(_super, self);
    utils.compose(_model, self);

    self.setPluginVersion(webRtcPlugin30Version);
    
    /**
     * Send DTMF tone
     * Enabler implementation lies on webRtcPluginv30Adaptor.js
     *
     * @ignore
     * @name rtc.sendDTMF
     * @function
     * @param {Object} call internalCall
     * @param {String} tone DTMF tone
     */
    self.sendDTMF = function (call, tone) {
        var localAudioTrack;
        
        if(!call.dtmfSender) {
            localAudioTrack = self.getLocalAudioTrack(call.peer);
            if(!localAudioTrack) {
                return;
            }
            call.dtmfSender = call.peer.createDTMFSender(localAudioTrack);
            if(!call.dtmfSender) {
                return;
            }
        }
        
        if(!sdpParser.isSdpHasTelephoneEvent(call.peer.remoteDescription.sdp)){
            call.dtmfSender.insertDTMF(tone, 400, 100, true);
            logger.info("sending inband DTMF tone: " + tone);        
        } else {
            if (call.dtmfSender.canInsertDTMF === true) {
                call.dtmfSender.insertDTMF(tone, 400);
                logger.info("sending outband DTMF tone: " + tone);
            } else {
                logger.error("Failed to execute 'insertDTMF' on 'RTCDTMFSender': The 'canInsertDTMF' attribute is false: this sender cannot send DTMF");
            }
        }
    };
    
    logger.debug('WebRtcPluginv30Adaptor initialized');
};

var WebRtcPluginv30Adaptor = function(_super, _decorator, _model) {
    var decorator = _decorator || webRtcLibraryDecorator,
            model = _model || new WebRtcPluginAdaptorModel();
    return new WebRtcPluginv30AdaptorImpl(_super ||
            new WebRtcPluginAdaptor(undefined, decorator, model),
            decorator, 
            model,
            logManager);
};

if (__testonly__) { __testonly__.WebRtcPluginv30Adaptor = WebRtcPluginv30Adaptor; }
var WebRtcChromeAdaptorImpl = function(_super, _decorator, _model, _logManager) {
    var self = this, logger = _logManager.getLogger("WebRtcChromeAdaptorImpl");
    logger.debug('WebRtcChromeAdaptor initializing');

    utils.compose(_super, self);
    logger.debug('WebRtcChromeAdaptor initialized');
};

var WebRtcChromeAdaptor = function(_super, _decorator, _model) {
    var decorator = _decorator || webRtcLibraryChromeDecorator,
            model = _model || new WebRtcChromeAdaptorModel();
    return new WebRtcChromeAdaptorImpl(_super ||
            new WebRtcAdaptor({}, decorator, model),
            decorator,
            model,
            logManager);
};

if (__testonly__) { __testonly__.WebRtcChromeAdaptor = WebRtcChromeAdaptor; }

var WebRtcFirefoxAdaptorImpl = function(_super, _decorator, _model, _logManager) {
    var self = this, logger = _logManager.getLogger("WebRtcFirefoxAdaptorImpl");
    logger.debug('WebRtcFirefoxAdaptor initializing');

    utils.compose(_super, self);
    utils.compose(_model, self);

    // firefoxPerformSdpWorkaroundsBeforeProcessingIncomingSdp
    self.performSdpWorkaroundsBeforeProcessingIncomingSdp = function(call) {
        call.sdp = sdpParser.updateH264LevelTo42E01F(call.sdp, self.isH264Enabled());
        call.sdp = sdpParser.deleteBandwidthLineFromSdp(call.sdp);
        call.sdp = sdpParser.addRtpmapForPCMU(call.sdp);
        call.sdp = sdpParser.addRtpmapForPCMA(call.sdp);
        call.sdp = sdpParser.removeG722Codec(call.sdp);
        call.sdp = sdpParser.fixRemoteTelephoneEventPayloadType(call, call.sdp);
        call.sdp = sdpParser.setOpusCodecToLowerCase(call.sdp);
    };

    // firefoxGetUserMedia
    self.getUserMedia = function(onSuccess, onFailure) {
        self.getRtcLibrary().checkMediaSourceAvailability(function mediaSourceCallback(mediaSourceInfo) {
            var video_constraints;
            self.setMediaSources(mediaSourceInfo);
            if (self.getMediaVideo() && self.getVideoSourceAvailable()) {
                video_constraints = {
                    mandatory: {
                        //"minFrameRate": "30",
                        "maxWidth": self.getVideoWidth(),
                        "maxHeight": self.getVideoHeight(),
                        "minWidth": self.getVideoWidth(),
                        "minHeight": self.getVideoHeight()}
                };
            } else {
                video_constraints = false;
            }

            self.getRtcLibrary().getUserMedia({
                audio: self.getMediaAudio(),
                video: video_constraints
            }, function getUserMediaSuccessCallback(stream) {
                var mediaInfo, localMedia ={};
                logger.debug("user has granted access to local media.");
                self.setUserMediaStream(stream);

                localMedia.audioContext = {close: function(){}};
                localMedia.mediaStreamDestination = {disconnect: function(){}};
                localMedia.stream = stream;

                self.getLocalStreamMap().add(localMedia.stream.id, localMedia);

                self.setInitialized(true);
                mediaInfo = {
                    "audio": self.getMediaAudio(),
                    "video": self.getMediaVideo() && self.getVideoSourceAvailable(),
                    "id": localMedia.stream.id
                };

                logger.debug("user has granted access to local media: ", localMedia);
                utils.callFunctionIfExist(onSuccess, mediaInfo);
            }, function getUserMediaFailureCallback(error) {
                logger.debug("Failed to get access to local media. Error code was " + error.code);
                utils.callFunctionIfExist(onFailure, fcs.call.MediaErrors.NOT_ALLOWED);
            });
        });
    };
    
    // firefoxCreateOffer
    self.createOffer = function (call, successCallback, failureCallback, sendInitialVideo) {
        logger.debug("createOffer: sendInitialVideo= " + sendInitialVideo + " state= " + call.peer.signalingState);
        var peer = call.peer;

        call.peer.addStream(call.localMedia.stream);

        self.addCallIdInPluginContainer(call);

        peer.createOffer(
                function createOfferSuccessCallback(oSdp) {
                    sendInitialVideo = sendInitialVideo && self.getVideoSourceAvailable();
                    if (sendInitialVideo) {
                        oSdp.sdp = sdpParser.updateVideoSdpDirection(oSdp.sdp, CONSTANTS.WEBRTC.MEDIA_STATE.SEND_RECEIVE);
                    } else {
                        oSdp.sdp = sdpParser.updateVideoSdpDirection(oSdp.sdp, CONSTANTS.WEBRTC.MEDIA_STATE.RECEIVE_ONLY);
                    }

                    oSdp.sdp = sdpParser.deleteCryptoZeroFromSdp(oSdp.sdp);

                    oSdp.sdp = sdpParser.updateAudioCodec(oSdp.sdp);
                    oSdp.sdp = sdpParser.removeG722Codec(oSdp.sdp);

                    oSdp.sdp = sdpParser.deleteCryptoFromSdp(oSdp.sdp, self.isDtlsEnabled());
                    oSdp.sdp = sdpParser.setTcpSetupAttributeToActpass(oSdp.sdp, self.isDtlsEnabled());

                    oSdp.sdp = sdpParser.fixLocalTelephoneEventPayloadType(call, oSdp.sdp);
                    oSdp = self.performSdpWorkaroundsAfterCreateOffer(call, oSdp);

                    peer.setLocalDescription(
                            self.getRtcLibrary().createRTCSessionDescription(CONSTANTS.WEBRTC.RTC_SDP_TYPE.OFFER, oSdp.sdp),
                            function createOfferSetLocalDescriptionSuccessCallback() {
                                //Due to stun requests, successCallback will be called by onNativeIceCandidate()
                            }
                    , function createOfferSetLocalDescriptionFailureCallback(error) {
                        logger.error("createOffer: setLocalDescription failed : " + error);
                        utils.callFunctionIfExist(failureCallback, "createOffer: setLocalDescription failed");
                    });
                }, function createOfferFailureCallback(e) {
            logger.error("createOffer: createOffer failed!! " + e);
            utils.callFunctionIfExist(failureCallback);
        },
                {
                    'mandatory': {
                        'OfferToReceiveAudio': self.getMediaAudio(),
                        'OfferToReceiveVideo': self.getMediaVideo()
                    }
                });
    };

    // firefoxCreateReOffer
    self.createReOffer = function(call, onSuccess, onFailure, usePreviousAudioDirection) {
        var peer = call.peer, localDescObj, localAudioDirection, localVideoDirection,
                prevLocalSdp = call.peer.localDescription.sdp;

        logger.debug("createReOffer:" + call.id);

        if (self.createNewPeerForCall(call))
        {
            peer = call.peer;
        }

        peer.createOffer(
                function prwCreateOfferSuccessCallback(oSdp) {
                    localVideoDirection = sdpParser.getVideoSdpDirection(prevLocalSdp);
                    oSdp.sdp = sdpParser.updateVideoSdpDirection(oSdp.sdp, localVideoDirection);

                    if (usePreviousAudioDirection) {
                        localAudioDirection = sdpParser.getAudioSdpDirection(prevLocalSdp);
                        oSdp.sdp = sdpParser.updateAudioSdpDirection(oSdp.sdp, localAudioDirection);
                    }

                    oSdp.sdp = sdpParser.deleteCryptoZeroFromSdp(oSdp.sdp);
                    oSdp.sdp = sdpParser.updateAudioCodec(oSdp.sdp);
                    oSdp.sdp = sdpParser.removeG722Codec(oSdp.sdp);
                    oSdp.sdp = sdpParser.deleteCryptoFromSdp(oSdp.sdp, self.isDtlsEnabled());
                    oSdp.sdp = sdpParser.setTcpSetupAttributeToActpass(oSdp.sdp, self.isDtlsEnabled());
                    oSdp.sdp = sdpParser.fixLocalTelephoneEventPayloadType(call, oSdp.sdp);
                    oSdp.sdp = sdpParser.updateVersion(prevLocalSdp, oSdp.sdp);
                    oSdp = self.performSdpWorkaroundsAfterCreateOffer(call, oSdp);

                    localDescObj = self.getRtcLibrary().createRTCSessionDescription(CONSTANTS.WEBRTC.RTC_SDP_TYPE.OFFER, oSdp.sdp);
                    peer.setLocalDescription(
                            localDescObj,
                            function prwSetLocalDescriptionSuccessCallback() {
                                logger.debug("createReOffer: setLocalDescription success" + call.id);
                            },
                            function prwSetLocalDescriptionFailureCallback(e) {
                                logger.debug("createReOffer: setLocalDescription failed!!" + e + call.id);
                                utils.callFunctionIfExist(onFailure);
                            });
                },
                function prwCreateOfferFailureCallback(e) {
                    logger.error("createReOffer: createOffer failed!! " + e);
                    utils.callFunctionIfExist(onFailure);
                },
                {
                    'mandatory': {
                        'OfferToReceiveAudio': self.getMediaAudio(),
                        'OfferToReceiveVideo': self.getMediaVideo()
                    }
                });
    };

    // firefoxProcessAnswer
    self.processAnswer = function(call, successCallback, failureCallback) {
        var remoteVideoDirection, localVideoDirection, peer = call.peer, remoteDescObj;
        logger.debug("processAnswer: state= " + peer.signalingState);

        self.setTcpSetupAttiributesOnProcessAnswer(call, call.sdp);
        call.sdp = sdpParser.checkSupportedVideoCodecs(call.sdp, peer.localDescription.sdp, self.isH264Enabled());
        call.sdp = sdpParser.performVideoPortZeroWorkaround(call.sdp);

        remoteVideoDirection = sdpParser.getVideoSdpDirection(call.sdp);
        localVideoDirection = sdpParser.getVideoSdpDirection(call.peer.localDescription.sdp);

        remoteDescObj = self.getRtcLibrary().createRTCSessionDescription(CONSTANTS.WEBRTC.RTC_SDP_TYPE.ANSWER, call.sdp);

        peer.setRemoteDescription(
                remoteDescObj,
                function processAnswerSetRemoteDescriptionSuccessCallback() {
                    logger.debug("processAnswer: setRemoteDescription success");
                    call.remoteVideoState = sdpParser.getVideoSdpDirection(call.sdp);
                    call.videoOfferSent = sdpParser.isSdpHasVideo(call.sdp);
                    utils.callFunctionIfExist(successCallback);
                },
                function processAnswerSetRemoteDescriptionFailureCallback(e) {
                    logger.error("processAnswer: setRemoteDescription failed: " + e.message);
                    utils.callFunctionIfExist(failureCallback);
                });
    };

    // firefoxRevertRtcState
    self.revertRtcState = function(call, successCallback, failureCallback) {
        //no need to create new peer to handle revertRtc case. Peer will be handled after retryAfter period.
        
        // TODO: Setting timeout to 0 skips the problem of successive holds without glare condition
        // A real solution have to be found
        setTimeout(function(){
            utils.callFunctionIfExist(successCallback, call);
        },0);
    };

    // firefoxCreateHoldUpdate
    self.createHoldUpdate = function(call, hold, remote_hold_status, successCallback, failureCallback) {
        logger.debug("createHoldUpdate: local hold= " + hold + " remote hold= " + remote_hold_status + " state= " + call.peer.signalingState);
        var peer = call.peer,
                audioDirection,
                videoDirection,
                muteCall,
                localDescObj, createHoldUpdate, hasActiveVideo;
        
        createHoldUpdate = function() {

            audioDirection = sdpParser.getAudioSdpDirection(call.stableLocalSdp);
            videoDirection = sdpParser.getVideoSdpDirection(call.stableLocalSdp);

            if (self.createNewPeerForCall(call))
            {
                peer = call.peer;
            }

            peer.createOffer(
                    function createHoldUpdateCreateOfferSuccessCallback(obj) {

                        obj.sdp = sdpParser.incrementVersion(obj.sdp);
                        obj.sdp = sdpParser.setTcpSetupAttributeToActpass(obj.sdp, self.isDtlsEnabled());
                        obj = self.performSdpWorkaroundsAfterCreateOffer(call, obj);

                        if (hold || remote_hold_status) {
                            if (audioDirection === CONSTANTS.WEBRTC.MEDIA_STATE.SEND_RECEIVE) {
                                obj.sdp = sdpParser.updateAudioSdpDirection(obj.sdp, CONSTANTS.WEBRTC.MEDIA_STATE.SEND_ONLY);
                            } else {
                                if (!hold && remote_hold_status) {
                                    obj.sdp = sdpParser.updateAudioSdpDirection(obj.sdp, CONSTANTS.WEBRTC.MEDIA_STATE.SEND_RECEIVE);
                                } else {
                                    obj.sdp = sdpParser.updateAudioSdpDirectionToInactive(obj.sdp);
                                }
                            }
                            if (videoDirection === CONSTANTS.WEBRTC.MEDIA_STATE.SEND_RECEIVE) {
                                obj.sdp = sdpParser.updateVideoSdpDirection(obj.sdp, CONSTANTS.WEBRTC.MEDIA_STATE.SEND_ONLY);
                            } else {
                                if (!hold && remote_hold_status) {
                                    obj.sdp = sdpParser.updateVideoSdpDirection(obj.sdp, CONSTANTS.WEBRTC.MEDIA_STATE.SEND_RECEIVE);
                                } else {
                                    obj.sdp = sdpParser.updateVideoSdpDirectionToInactive(obj.sdp);
                                }
                            }
                            muteCall = true;
                        } else {
                            obj.sdp = sdpParser.updateAudioSdpDirection(obj.sdp, CONSTANTS.WEBRTC.MEDIA_STATE.SEND_RECEIVE);
                            if (self.canOriginatorSendLocalVideo(call)) {
                                obj.sdp = sdpParser.updateVideoSdpDirection(obj.sdp, CONSTANTS.WEBRTC.MEDIA_STATE.SEND_RECEIVE);
                            } else {
                                obj.sdp = sdpParser.updateVideoSdpDirection(obj.sdp, CONSTANTS.WEBRTC.MEDIA_STATE.RECEIVE_ONLY);
                            }
                            muteCall = false;
                        }

                        obj.sdp = sdpParser.fixLocalTelephoneEventPayloadType(call, obj.sdp);

                        localDescObj = self.getRtcLibrary().createRTCSessionDescription(CONSTANTS.WEBRTC.RTC_SDP_TYPE.OFFER, obj.sdp);

                        peer.setLocalDescription(localDescObj,
                                function createHoldUpdateSetLocalDescriptionSuccessCallback() {
                                    logger.debug("createHoldUpdate: setLocalDescription success");
                                    self.muteOnHold(call, muteCall);
                                },
                                function createHoldUpdateSetLocalDescriptionFailureCallback(error) {
                                    logger.error("createHoldUpdate: setLocalDescription failed: " + error.message);
                                    utils.callFunctionIfExist(failureCallback);
                                });
                    }, function createHoldUpdateCreateOfferFailureCallback(error) {
                logger.error("createHoldUpdate: createOffer failed: " + error.message);
                utils.callFunctionIfExist(failureCallback);

            }, {
                'mandatory': {
                    'OfferToReceiveAudio': self.getMediaAudio(),
                    'OfferToReceiveVideo': self.getMediaVideo()
                }
            });
        };
                
        hasActiveVideo = sdpParser.isSdpHasVideo(call.sdp) && 
                !sdpParser.isVideoSdpDirectionInactive(peer.localDescription.sdp);
                
        if (!call.isVideoSourceAllowed && hasActiveVideo) {
            self.setMediaAudio(true);
            self.setMediaVideo(true);
        
            // TODO: This should not be done here just for code consistency
            self.getUserMedia(function(mediaInfo) {
                self.storeLocalStreamToCall(call, mediaInfo.id);
                call.isVideoSourceAllowed = mediaInfo.video;
            createHoldUpdate();
            }, function() {
                utils.callFunctionIfExist(failureCallback);
            });
        }
        else{
            if(hasActiveVideo){
                call.isVideoSourceAllowed = true;
            }
            createHoldUpdate();
        }      
    };

    // firefoxProcessHold
    self.processHold = function(call, hold, local_hold_status, successCallback, failureCallback) {
        logger.debug("processHold: local hold= " + local_hold_status + " remote hold= " + hold + " state= " + call.peer.signalingState);
        var peer = call.peer, updateSdp, peerRemoteSdp, audioDirection;
        
        if (!local_hold_status && !hold) {
            self.muteOnHold(call, false);
        }
        
        audioDirection = sdpParser.getAudioSdpDirection(call.sdp);

        call.sdp = sdpParser.checkSupportedVideoCodecs(call.sdp, null);
        call.sdp = sdpParser.performVideoPortZeroWorkaround(call.sdp);

        call.sdp = sdpParser.setTcpSetupAttributeToActpass(call.sdp, self.isDtlsEnabled());

        peerRemoteSdp = call.prevRemoteSdp;

        updateSdp = self.getRtcLibrary().createRTCSessionDescription(CONSTANTS.WEBRTC.RTC_SDP_TYPE.OFFER, call.sdp);

        if (self.createNewPeerForCall(call))
        {
            peer = call.peer;
        }

        peer.setRemoteDescription(
                updateSdp,
                function processHoldSetRemoteDescriptionSuccessCallback() {
                    peer.createAnswer(function(obj) {
                        logger.debug("processHold: isSdpEnabled audio= " + sdpParser.isAudioSdpEnabled(obj.sdp));
                        logger.debug("processHold: isSdpEnabled video= " + sdpParser.isVideoSdpEnabled(obj.sdp));

                        if (hold) {
                            logger.debug("processHold: Remote HOLD");
                            obj.sdp = sdpParser.respondToRemoteSdpDirections(obj.sdp, call.sdp);
                        } else if (!local_hold_status) {
                            logger.debug("processHold: Remote UNHOLD: direction left as it is");

                            if (sdpParser.isSdpVideoSendEnabled(call.sdp)) {
                                if (self.canOriginatorSendLocalVideo(call)) {
                                    obj.sdp = sdpParser.updateVideoSdpDirection(obj.sdp, CONSTANTS.WEBRTC.MEDIA_STATE.SEND_RECEIVE);
                                } else {
                                    obj.sdp = sdpParser.updateVideoSdpDirection(obj.sdp, CONSTANTS.WEBRTC.MEDIA_STATE.RECEIVE_ONLY);
                                }
                            } else {
                                if (self.canOriginatorSendLocalVideo(call) && !sdpParser.isVideoSdpDirectionInactive(call.sdp)) {
                                    obj.sdp = sdpParser.updateVideoSdpDirection(obj.sdp, CONSTANTS.WEBRTC.MEDIA_STATE.SEND_ONLY);
                                } else {
                                    obj.sdp = sdpParser.updateVideoSdpDirection(obj.sdp, CONSTANTS.WEBRTC.MEDIA_STATE.INACTIVE);
                                }
                            }
                            //change audio's direction to sendrecv for ssl attendees in a 3wc
                            obj.sdp = sdpParser.changeDirection(obj.sdp, CONSTANTS.WEBRTC.MEDIA_STATE.RECEIVE_ONLY, CONSTANTS.WEBRTC.MEDIA_STATE.SEND_RECEIVE, CONSTANTS.STRING.AUDIO);
                        } else if (local_hold_status && !hold) {
                            logger.debug("processHold: Remote UNHOLD on local hold");

                            if (audioDirection === CONSTANTS.WEBRTC.MEDIA_STATE.INACTIVE) {
                                obj.sdp = sdpParser.updateAudioSdpDirectionToInactive(obj.sdp);
                            } else {
                                obj.sdp = sdpParser.updateAudioSdpDirection(obj.sdp, CONSTANTS.WEBRTC.MEDIA_STATE.SEND_ONLY);
                            }

                            if (self.canOriginatorSendLocalVideo(call)) {
                                obj.sdp = sdpParser.updateVideoSdpDirection(obj.sdp, CONSTANTS.WEBRTC.MEDIA_STATE.SEND_ONLY);
                            } else {
                                obj.sdp = sdpParser.updateVideoSdpDirectionToInactive(obj.sdp);
                            }
                        }

                        obj.sdp = sdpParser.setTcpSetupAttributeTo(obj.sdp, call.localTcpSetupAttribute, self.isDtlsEnabled());

                        peer.setLocalDescription(
                                obj,
                                function processHoldSetLocalDescriptionSuccessCallback() {
                                    logger.debug("processHold: setLocalDescription succeeded");
                                },
                                function processHoldSetLocalDescriptionFailureCallback(e) {
                                    logger.error("processHold: setLocalDescription failed!! " + e);
                                    utils.callFunctionIfExist(failureCallback, "Session cannot be created");
                                });
                    }, function() {
                        logger.debug("FAIL");
                    });
                }, function processHoldSetRemoteDescriptionFailureCallback(e) {
            logger.error("processHold: setRemoteDescription failed: " + e.message);
            utils.callFunctionIfExist(failureCallback, "Session cannot be created");
        });
    };

    // firefoxProcessHoldRespond
    self.processHoldRespond = function(call, onSuccess, onFailure, isJoin) {
        var remoteAudioDirection,
                remoteVideoDirection,
                localVideoDirection,
                localHoldFlag = false,
                remoteHoldFlag = false,
                obj;

        logger.debug("processHoldRespond: state= " + call.peer.signalingState + " call.currentState= " + call.currentState);

        call.sdp = sdpParser.checkSupportedVideoCodecs(call.sdp, call.peer.localDescription.sdp, self.isH264Enabled());

        sdpParser.init(call.sdp);
        remoteHoldFlag = sdpParser.isRemoteHold();

        localHoldFlag = (call.currentState === "LOCAL_HOLD");

        if(!localHoldFlag){
            self.addCallIdInPluginContainer(call);
        }
        
        remoteAudioDirection = sdpParser.getAudioSdpDirection(call.sdp);
        remoteVideoDirection = sdpParser.getVideoSdpDirection(call.sdp);

        call.remoteVideoState = remoteVideoDirection;

        localVideoDirection = sdpParser.getVideoSdpDirection(call.peer.localDescription.sdp);

        logger.debug("processHoldRespond: localHold= " + localHoldFlag + " remoteHold= " + remoteHoldFlag);

        /* Required for MOH - start */
        if (remoteHoldFlag === false) {
            if ((remoteAudioDirection === CONSTANTS.WEBRTC.MEDIA_STATE.SEND_RECEIVE) && (call.currentState === "REMOTE_HOLD")) {
                logger.debug("set current web state to COMPLETED");
                call.previousState = call.currentState;
                call.currentState = "COMPLETED";
            }
        } else {
            if (call.currentState === "COMPLETED") {
                logger.debug("set current web state to REMOTE_HOLD");
                call.previousState = call.currentState;
                call.currentState = "REMOTE_HOLD";
            }
        }

        if (localHoldFlag || remoteHoldFlag) {
            logger.debug("processHoldRespond: " + call.currentState + " : video -> inactive");
            call.sdp = sdpParser.updateVideoSdpDirection(call.sdp, CONSTANTS.WEBRTC.MEDIA_STATE.INACTIVE);
        }

        /* Required for MOH - end */

        if (localHoldFlag) {
            if (sdpParser.getAudioSdpDirection(call.sdp) === CONSTANTS.WEBRTC.MEDIA_STATE.SEND_RECEIVE)
            {
                call.sdp = sdpParser.updateAudioSdpDirection(call.sdp, CONSTANTS.WEBRTC.MEDIA_STATE.RECEIVE_ONLY);
            }
            if (sdpParser.getVideoSdpDirection(call.sdp) === CONSTANTS.WEBRTC.MEDIA_STATE.SEND_RECEIVE)
            {
                call.sdp = sdpParser.updateVideoSdpDirection(call.sdp, CONSTANTS.WEBRTC.MEDIA_STATE.RECEIVE_ONLY);
            }
        }

        if (isJoin) {
            self.muteOnHold(call, false);
        }

        if (call.peer.signalingState === CONSTANTS.WEBRTC.RTC_SIGNALING_STATE.STABLE) {
            //if we are in stable state we should not change remotedescription
            utils.callFunctionIfExist(onSuccess);
            return;
        }

        // this is required for displaying remote video when direction is send only
        // call.sdp = sdpParser.changeDirection(call.sdp, CONSTANTS.WEBRTC.MEDIA_STATE.SEND_ONLY, CONSTANTS.WEBRTC.MEDIA_STATE.SEND_RECEIVE, video);
        if (sdpParser.getVideoSdpDirection(call.sdp) === CONSTANTS.WEBRTC.MEDIA_STATE.INACTIVE ||
                sdpParser.getVideoSdpDirection(call.sdp) === CONSTANTS.WEBRTC.MEDIA_STATE.RECEIVE_ONLY)
        {
            call.sdp = sdpParser.deleteInactiveVideoSsrc(call.sdp);
        }
        
        obj = self.getRtcLibrary().createRTCSessionDescription(CONSTANTS.WEBRTC.RTC_SDP_TYPE.ANSWER, call.sdp);

        call.peer.setRemoteDescription(obj,
                function processHoldRespondSetRemoteDescriptionSuccessCallback() {
                    logger.debug("processHoldRespond: setRemoteDescription typeAns success");
                    utils.callFunctionIfExist(onSuccess);
                },
                function processHoldRespondSetRemoteDescriptionFailureCallback(e) {
                    logger.debug("processHoldRespond: setRemoteDescription typeAns failed: " + e);
                    utils.callFunctionIfExist(onFailure);
                });
    };

    // firefoxCreateUpdate
    self.createUpdate = function(call, successCallback, failureCallback, isVideoStart) {
        logger.debug("createUpdate: isVideoStart= " + isVideoStart + " state= " + call.peer.signalingState);
        var peer = call.peer, localSdp, localDesc;

        localSdp = call.peer.localDescription.sdp;
        localSdp = sdpParser.fixLocalTelephoneEventPayloadType(call, localSdp);
        localSdp = sdpParser.incrementVersion(localSdp);

        logger.debug("create new offer to start the video");

        if (self.createNewPeerForCall(call))
        {
            peer = call.peer;
        }

        self.setMediaVideo(true);
        peer.createOffer(
                function createUpdateCreateOfferSuccessCallback(obj) {
                    isVideoStart = isVideoStart && self.getVideoSourceAvailable();
                    if (isVideoStart) {
                        obj.sdp = sdpParser.updateVideoSdpDirection(obj.sdp, CONSTANTS.WEBRTC.MEDIA_STATE.SEND_RECEIVE);
                    } else {
                        if (sdpParser.isVideoSdpDirectionInactive(call.stableRemoteSdp)) {
                            obj.sdp = sdpParser.updateVideoSdpDirectionToInactive(obj.sdp);
                        } else {
                            obj.sdp = sdpParser.updateVideoSdpDirection(obj.sdp, CONSTANTS.WEBRTC.MEDIA_STATE.RECEIVE_ONLY);
                        }
                    }

                    obj.sdp = sdpParser.setTcpSetupAttributeToActpass(obj.sdp, self.isDtlsEnabled());
                    obj.sdp = sdpParser.fixLocalTelephoneEventPayloadType(call, obj.sdp);
                    obj.sdp = sdpParser.deleteCryptoZeroFromSdp(obj.sdp);
                    obj.sdp = sdpParser.updateAudioCodec(obj.sdp);
                    obj.sdp = sdpParser.removeG722Codec(obj.sdp);
                    obj.sdp = sdpParser.deleteCryptoFromSdp(obj.sdp, self.isDtlsEnabled());
                    obj = self.performSdpWorkaroundsAfterCreateOffer(call, obj);

                    localDesc = self.getRtcLibrary().createRTCSessionDescription(CONSTANTS.WEBRTC.RTC_SDP_TYPE.OFFER, obj.sdp);

                    peer.setLocalDescription(localDesc,
                            function createUpdateCreateOfferSetLocalDescriptionSuccessCallback() {
                                //since the candidates have changed we will call the successCallback at onNativeIceCandidate
                                //utils.callFunctionIfExist(successCallback);
                                logger.debug("createUpdate: createOffer setLocalDescription success ");
                            },
                            function crateUpdateCreateOfferSetLocalDescriptionFailureCallback(e) {
                                logger.debug("createUpdate: createOffer setLocalDescription failed: " + e);
                                utils.callFunctionIfExist(failureCallback);
                            });
                },
                function createUpdateCrateOfferFailureCallback(e) {
                    logger.debug("createUpdate: createOffer failed!!: " + e);
                    failureCallback();
                },
                {
                    'mandatory': {
                        'OfferToReceiveAudio': self.getMediaAudio(),
                        'OfferToReceiveVideo': self.getMediaVideo()
                    }
                }
        );
    };

    // firefoxProcessUpdate
    self.processUpdate = function(call, successCallback, failureCallback) {
        logger.debug("processUpdate: state= " + call.peer.signalingState);
        var peer = call.peer,
                remoteVideoDirection,localVideoDirection,
                remoteDescObj, localDescObj, peerLocalSdp;
        
        call.sdp = sdpParser.addSdpMissingCryptoLine(call.sdp); // Meetme workaround        
        call.sdp = sdpParser.checkAndRestoreICEParams(call.sdp, call.stableLocalSdp);

        remoteVideoDirection = sdpParser.getVideoSdpDirection(call.sdp);
        localVideoDirection = sdpParser.getVideoSdpDirection(call.stableLocalSdp);

        call.sdp = sdpParser.checkSupportedVideoCodecs(call.sdp, null, self.isH264Enabled());

        //This is highly required for meetme on DTLS
        call.sdp = sdpParser.setTcpSetupAttributeToActpass(call.sdp, self.isDtlsEnabled());


        peerLocalSdp = call.stableLocalSdp;

        if (self.createNewPeerForCall(call)) {
            peer = call.peer;
        }

        remoteDescObj = self.getRtcLibrary().createRTCSessionDescription(CONSTANTS.WEBRTC.RTC_SDP_TYPE.OFFER, call.sdp);
        peer.setRemoteDescription(
                remoteDescObj,
                function processUpdateSetRemoteDescriptionSuccessCallback() {
                    logger.debug("processUpdate: setRemoteDescription success");
                    call.remoteVideoState = sdpParser.getVideoSdpDirection(call.sdp);

                    peer.createAnswer(
                            function processUpdateCreateAnswerSuccessCallback(obj) {
                                logger.debug("processUpdate: isSdpEnabled audio= " + sdpParser.isAudioSdpEnabled(obj.sdp));
                                logger.debug("processUpdate: isSdpEnabled video= " + sdpParser.isVideoSdpEnabled(obj.sdp));
                                if (sdpParser.isSdpVideoSendEnabled(call.sdp)) {
                                    if (self.canOriginatorSendLocalVideo(call)) {
                                        obj.sdp = sdpParser.updateVideoSdpDirection(obj.sdp, CONSTANTS.WEBRTC.MEDIA_STATE.SEND_RECEIVE);
                                    } else {
                                        obj.sdp = sdpParser.updateVideoSdpDirection(obj.sdp, CONSTANTS.WEBRTC.MEDIA_STATE.RECEIVE_ONLY);
                                    }
                                } else {
                                    if (self.canOriginatorSendLocalVideo(call) && !sdpParser.isVideoSdpDirectionInactive(call.sdp)) {
                                        obj.sdp = sdpParser.updateVideoSdpDirection(obj.sdp, CONSTANTS.WEBRTC.MEDIA_STATE.SEND_ONLY);
                                    } else {
                                        obj.sdp = sdpParser.updateVideoSdpDirection(obj.sdp, CONSTANTS.WEBRTC.MEDIA_STATE.INACTIVE);
                                    }
                                }

                                obj.sdp = sdpParser.updateVersion(peerLocalSdp, obj.sdp);
                                obj.sdp = sdpParser.fixLocalTelephoneEventPayloadType(call, obj.sdp);
                                obj.sdp = sdpParser.checkIceParamsLengths(obj.sdp, remoteDescObj.sdp);
                                obj.sdp = sdpParser.setTcpSetupAttributeTo(obj.sdp, call.localTcpSetupAttribute, self.isDtlsEnabled());

                                localDescObj = self.getRtcLibrary().createRTCSessionDescription(CONSTANTS.WEBRTC.RTC_SDP_TYPE.ANSWER, obj.sdp);
                                peer.setLocalDescription(
                                        localDescObj,
                                        function processUpdateSetLocalDescriptionSuccessCallback() {
                                            logger.debug("processUpdate: setlocalDescription success");
                                        },
                                        function processUpdateSetLocalDescriptionSuccessCallback(e) {
                                            logger.debug("processUpdate: setlocalDescription failed!!" + e);
                                            utils.callFunctionIfExist(failureCallback, "processUpdate: setlocalDescription failed!!");
                                        });
                            },
                            function processUpdateCreateAnswerFailureCallback(e) {
                                logger.debug("processUpdate: createAnswer failed!! " + e);
                                utils.callFunctionIfExist(failureCallback, "Session cannot be created");
                            },
                            {
                                'mandatory': {
                                    'OfferToReceiveAudio': self.getMediaAudio(),
                                    'OfferToReceiveVideo': self.getMediaVideo()
                                }
                            });
                },
                function processUpdateSetRemoteDescriptionSuccessCallback(e) {
                    logger.debug("processUpdate: setRemoteDescription failed!!" + e);
                    utils.callFunctionIfExist(failureCallback, "processUpdate: setRemoteDescription failed!!");
                });
    };

    // firefoxProcessRespond
    self.processRespond = function(call, onSuccess, onFail, isJoin) {
        var remoteVideoDirection, remoteDescObj,
                peer = call.peer;
        logger.debug("processRespond: state= " + call.peer.signalingState);

        call.sdp = sdpParser.checkSupportedVideoCodecs(call.sdp, peer.localDescription.sdp, self.isH264Enabled());

        remoteVideoDirection = sdpParser.getVideoSdpDirection(call.sdp);

        call.remoteVideoState = sdpParser.getVideoSdpDirection(call.sdp);

        if (isJoin) {
            call.sdp = sdpParser.changeDirection(call.sdp, CONSTANTS.WEBRTC.MEDIA_STATE.RECEIVE_ONLY, CONSTANTS.WEBRTC.MEDIA_STATE.SEND_RECEIVE, CONSTANTS.STRING.AUDIO);
            self.muteOnHold(call, false);
        }

        if (call.peer.signalingState === CONSTANTS.WEBRTC.RTC_SIGNALING_STATE.STABLE) {
            //if we are in stable state we should not change remotedescription
            utils.callFunctionIfExist(onSuccess);
            return;
        }

        remoteDescObj = self.getRtcLibrary().createRTCSessionDescription(CONSTANTS.WEBRTC.RTC_SDP_TYPE.ANSWER, call.sdp);
        peer.setRemoteDescription(
                remoteDescObj,
                function processRespondSetRemoteDescriptionSuccessCallback() {
                    logger.debug("processRespond: setRemoteDescription success");
                    call.remoteVideoState = sdpParser.getVideoSdpDirection(call.sdp);
                    call.videoOfferSent = true;
                    utils.callFunctionIfExist(onSuccess);
                },
                function processRespondSetRemoteDescriptionSuccessCallback(e) {
                    logger.debug("processRespond: setRemoteDescription failed: " + e);
                    utils.callFunctionIfExist(onFail);
                });
    };

    // firefoxSendDTMF
    self.sendDTMF = function (call, tone) {
        logger.debug("DMTF IS NOT SUPPORTED FOR FIREFOX");
    };

    // firefoxIceCandidateCollectionTimeoutHandler
    self.iceCandidateCollectionTimeoutHandler = function(call) {
        var sdp = call.peer.localDescription.sdp;
        self.clearIceCandidateCollectionTimer(call);
        if(fcsConfig.relayCandidateCollectionTimeoutCycle) {
            call.relayCandidateCycle ++; 
        }
        // set timeout if there is no ice candidate available or 
        // when audio, video port assignment isn't complete
        if (!sdpParser.hasCandidates(sdp, call.relayCandidateCycle, fcsConfig.relayCandidateCollectionTimeoutCycle)) {
            logger.debug("Re-setting ice candidate collection timeout: " + fcsConfig.iceCandidateCollectionTimeoutInterval);
            call.iceCandidateCollectionTimer = setTimeout(function() {
                self.iceCandidateCollectionTimeoutHandler(call);
            }, fcsConfig.iceCandidateCollectionTimeoutInterval);
            return;
        }

        if (call.successCallback) {
            logger.debug("Ice candidate collection interrupted after given timeout, invoking successCallback.");
            sdp = sdpParser.deleteCurlyBracketsSDP(sdp);
            if (!self.isH264Enabled()) {
                sdp = sdpParser.removeH264Codec(sdp);
            }
            if (!sdpParser.isSdpHasUfrag(sdp)) {
                sdp = sdpParser.checkAndRestoreICEParams(sdp, call.stableLocalSdp);
                logger.debug("Absent ufrag due to inactive video direction is restored from that in stable local sdp");
            }
            call.successCallback(sdp);
        }
    };

    // firefoxSetupIceCandidateCollectionTimer
    self.setupIceCandidateCollectionTimer = function(call) {
        if (fcsConfig.iceCandidateCollectionTimeoutInterval) {
            if (!call.iceCandidateCollectionTimer) {
                logger.debug("Setting ice candidate collection timeout: " + fcsConfig.iceCandidateCollectionTimeoutInterval);
                if(fcsConfig.relayCandidateCollectionTimeoutCycle) {
                    call.relayCandidateCycle = 1;                
                }  
                call.iceCandidateCollectionTimer = setTimeout(function() {
                    self.iceCandidateCollectionTimeoutHandler(call);
                }, fcsConfig.iceCandidateCollectionTimeoutInterval);
            } else {
                logger.trace("Ice candidate collection timer exists.");
            }
        }
    };

    // firefoxOnIceCandidate
    self.onIceCandidate = function(call, event) {
        var sdp;
        if (event.candidate === null) {
            logger.debug("Null candidate received.");
            if (call.successCallback) {
                sdp = call.peer.localDescription.sdp;
                self.clearIceCandidateCollectionTimer(call);
                logger.debug("Candidates received, invoking successCallback.");
                
                sdp = sdpParser.deleteCurlyBracketsSDP(sdp);
                if (!self.isH264Enabled()) {
                    sdp = sdpParser.removeH264Codec(sdp);
                }
                if (!sdpParser.isSdpHasUfrag(sdp)) {
                    sdp = sdpParser.checkAndRestoreICEParams(sdp, call.stableLocalSdp);
                    logger.debug("Absent ufrag due to inactive video direction is restored from that in stable local sdp");
            }
                call.successCallback(sdp);
            }
        } else {
            logger.debug("ICE candidate received: sdpMLineIndex = " + event.candidate.sdpMLineIndex
                    + ", candidate = " + event.candidate.candidate + " for call : " + call.id);
        }
    };

    // firefoxOnIceComplete
    self.onIceComplete = function(call) {
        var sdp;
        logger.debug("All ICE candidates received for call : " + call.id);
        self.clearIceCandidateCollectionTimer(call);

        if (call.successCallback) {
            sdp = call.peer.localDescription.sdp;
            sdp = sdpParser.deleteCurlyBracketsSDP(sdp);
            if (!self.isH264Enabled()) {
                sdp = sdpParser.removeH264Codec(sdp);
            }
            if (!sdpParser.isSdpHasUfrag(sdp)) {
                sdp = sdpParser.checkAndRestoreICEParams(sdp, call.stableLocalSdp);
                logger.debug("Absent ufrag due to inactive video direction is restored from that in stable local sdp");
            }
            
            logger.debug("onIceComplete sdp : " + sdp);
            
            call.successCallback(sdp);
        }
    };

    // firefoxCreateNewPeerForCall
    self.createNewPeerForCall = function(call) {
        var isNewPeerCreated = false, peerCount = self.getPeerCount();
        if (call.peer) {
            call.peer.close();
            self.setPeerCount(peerCount - 1);
        }

        logger.trace("Creating new peer for call: " + call.id);
        self.createPeer(call, function createPeerSuccessCallback() {
            logger.trace("New peer has created for call: " + call.id);
            call.peer.addStream(call.localMedia.stream);
            isNewPeerCreated = true;
        }, function createPeerFailureCallback() {
            logger.error("New peer creation has failed!: " + call.id);
        });
        return isNewPeerCreated;
    };

    // firefoxCreatePeer
    self.createPeer = function(call, onSuccess, onFailure) {
        try {
            var pc, constraints, i, servers = [], iceServerUrl = self.getIceServerUrl(), stunturn;
            if (iceServerUrl instanceof Array) {
                for(i = 0; i<iceServerUrl.length; i++) {
                    servers[i] = iceServerUrl[i];
                }
            } else if (iceServerUrl === null ||  iceServerUrl === ""){
                servers = [];
            } else {
                servers[0] = iceServerUrl;
            }
            stunturn = {iceServers:servers};

            constraints = {"optional": [{"DtlsSrtpKeyAgreement": self.isDtlsEnabled()}]};
            pc = self.getRtcLibrary().createRTCPeerConnection(stunturn, constraints);

            self.setPeerCount(self.getPeerCount() + 1);
            call.peer = pc;

            pc.onconnecting = function(event){
                self.onSessionConnecting(call, event);
            };
            pc.onopen = function(event){
                self.onSessionOpened(call, event);
            };
            pc.onsignalingstatechange = function(event){
                self.onSignalingStateChange(call, event);
            };
            pc.onaddstream = function(event){
                self.onRemoteStreamAdded(call, event);
            };
            pc.onremovestream = function(event){
                self.onRemoteStreamRemoved(call, event);
            };
            pc.onicecandidate = function(event){
                self.setupIceCandidateCollectionTimer(call);
                self.onIceCandidate(call, event);
            };
            pc.onicecomplete = function(){
                self.onIceComplete(call);
            };
            pc.oniceconnectionstatechange = function (event) {
                self.oniceconnectionstatechange(call, event);
            };
            logger.info("create PeerConnection successfully.");
            
            // Will be commented-in after decision of necessary stats
            // self.setupWebrtcLogCollectionTimer(call);
            
            onSuccess(call);
        } catch(err) {
            logger.error("Failed to create PeerConnection, exception: " + err.message);
            onFailure();
        }
    };
    
    logger.debug('WebRtcFirefoxAdaptor initialized');
};

var WebRtcFirefoxAdaptor = function(_super, _decorator, _model) {
    var decorator = _decorator || webRtcLibraryFirefoxDecorator,
            model = _model || new WebRtcFirefoxAdaptorModel();
    return new WebRtcFirefoxAdaptorImpl(_super ||
            new WebRtcAdaptor({}, decorator, model),
            decorator,
            model,
            logManager);
};

if (__testonly__) {__testonly__.WebRtcFirefoxAdaptor = WebRtcFirefoxAdaptor;}

var WebRtcAdaptorFactory = function(_window, _navigator, _logManager, _WebRtcPluginv21Adaptor, _WebRtcPluginv22Adaptor, _WebRtcPluginv30Adaptor, _WebRtcChromeAdaptor, _WebRtcFirefoxAdaptor) {
    var logger = _logManager.getLogger("WebRtcAdaptorFactory"),
    NAVIGATOR_TYPES = {CHROME: "chrome", FIREFOX: "firefox", "PLUGIN": "plugin"},
    PLUGIN_MODES = {
        WEBRTCH264: "webrtch264", // 3.0 Enabler Plugin
        WEBRTC22: "webrtc22", // 2.2 Enabler Plugin
        WEBRTC21: "webrtc21", // 2.1 Enabler Plugin
        WEBRTC: "webrtc", // Default Enabler Plugin
        AUTO: "auto", // Native For Chrome Browser and Default Enabler Plugin for other Browsers
        AUTO21: "auto21", // Native For Chrome Browser and Default Enabler Plugin for other Browsers
        AUTO22: "auto22", // Native For Chrome Browser and Default Enabler Plugin for other Browsers
        AUTOH264: "autoh264", // Native For Chrome Browser and 3.0 Enabler Plugin for other Browsers
        AUTOFIREFOX: "autofirefox" // Native For Chrome AND Firefox Browser and Enabler Plugin for other Browsers
    },
    DEFAULT_RTC_PLUGIN_MODE = PLUGIN_MODES.WEBRTCH264,
    DEFAULT_RTC_ADAPTOR = _WebRtcPluginv30Adaptor,
    PLUGIN_MODE_LOOKUP_TABLE = {
        chrome: {webrtc: DEFAULT_RTC_PLUGIN_MODE,
                autofirefox: PLUGIN_MODES.AUTO,
                autoh264: PLUGIN_MODES.AUTO,
                webrtch264: PLUGIN_MODES.WEBRTCH264},
        firefox: {webrtc: DEFAULT_RTC_PLUGIN_MODE,
                auto: DEFAULT_RTC_PLUGIN_MODE,
                auto21: PLUGIN_MODES.WEBRTC21,
                auto22: PLUGIN_MODES.WEBRTC22,
                autoh264: PLUGIN_MODES.WEBRTCH264,
                autofirefox: PLUGIN_MODES.AUTO
                },
        plugin: {auto: DEFAULT_RTC_PLUGIN_MODE,
            auto21: PLUGIN_MODES.WEBRTC21,
            auto22: PLUGIN_MODES.WEBRTC22,
            autoh264: PLUGIN_MODES.WEBRTCH264,
            autofirefox: DEFAULT_RTC_PLUGIN_MODE,
            webrtc: DEFAULT_RTC_PLUGIN_MODE}},
    ADAPTOR_LOOKUP_TABLE = {
        chrome: {auto: _WebRtcChromeAdaptor,
            autoh264: _WebRtcChromeAdaptor,
            webrtc21: _WebRtcPluginv21Adaptor,
            webrtc22: _WebRtcPluginv22Adaptor,
            webrtch264: _WebRtcPluginv30Adaptor},
        firefox: {auto: _WebRtcFirefoxAdaptor,
            webrtc21: _WebRtcPluginv21Adaptor,
            webrtc22: _WebRtcPluginv22Adaptor,
            webrtch264: _WebRtcPluginv30Adaptor},
        plugin: {webrtc21: _WebRtcPluginv21Adaptor,
            webrtc22: _WebRtcPluginv22Adaptor,
            webrtch264: _WebRtcPluginv30Adaptor}
    }, 
    COMPOSIT_PLUGIN_MODES = {
        WEBRTC: "webrtc", // Default Enabler Plugin
        AUTO: "auto" // Native For Chrome And Firefox Browser and Default Enabler Plugin for other Browsers
    },
    COMPOSIT_ADAPTOR_LOOKUP_TABLE = {
        chrome: {auto: _WebRtcChromeAdaptor,
            webrtc: DEFAULT_RTC_ADAPTOR},
        firefox: {auto: _WebRtcFirefoxAdaptor,
            webrtc: DEFAULT_RTC_ADAPTOR},
        plugin: {auto: DEFAULT_RTC_ADAPTOR,
            webrtc: DEFAULT_RTC_ADAPTOR}
    },pluginMode;

    function getNavigatorType() {
        var type, version, regex;
        if (_navigator.webkitGetUserMedia) {
            type= NAVIGATOR_TYPES.CHROME;
            regex = new RegExp(/\Chrome\/(\d*)/);
        }
        else if (_navigator.mozGetUserMedia) {
            type= NAVIGATOR_TYPES.FIREFOX;
            regex = new RegExp(/\Firefox\/(\d*)/);
        }
        else {
            type= NAVIGATOR_TYPES.PLUGIN;
        }
        if (regex && _navigator.userAgent) {
            version = parseInt(_navigator.userAgent.match(regex).pop(), 10);
        }
        return {type : type, version: version};
    }
    if (__testonly__) { this.getNavigatorType = getNavigatorType; }
    

    function identifyPluginMode(options) {
        var i;

        if (!options || !options.pluginMode) {
            return PLUGIN_MODES.AUTO;
        }

        for(i in PLUGIN_MODES) {
            if (PLUGIN_MODES[i] === options.pluginMode) {
                return PLUGIN_MODES[i];
            }
        }

        return PLUGIN_MODES.AUTO;
    }

    function getPluginModeForComposition(navigatorType) {
        var pluginMode = PLUGIN_MODES.AUTO, validPluginMode=false,
                h264Enabled,
                pluginModeBrowser = fcsConfig.pluginMode[navigatorType.type],
                pluginModeBrowserVersion,
                browserVersion,i,regex;

        if (pluginModeBrowser) {
            regex = new RegExp(/^\d+\+$/);
            if(pluginModeBrowser.version && regex.test(pluginModeBrowser.version)){
                pluginModeBrowserVersion = parseInt(pluginModeBrowser.version.replace(/\+/, ''), 10);
            }
            browserVersion = navigatorType.version;
            if (pluginModeBrowser.mode && (!pluginModeBrowserVersion || browserVersion >= pluginModeBrowserVersion)) {
                pluginMode = pluginModeBrowser.mode;
            }
            else if(fcsConfig.pluginMode.mode){
                pluginMode = fcsConfig.pluginMode.mode;
            }

            if (typeof pluginModeBrowser.h264 !== 'undefined' && (!pluginModeBrowserVersion || browserVersion >= pluginModeBrowserVersion)) {
                h264Enabled = pluginModeBrowser.h264;
            }
            else {
                h264Enabled = fcsConfig.pluginMode.h264;
            }
        }
        else {
            pluginMode = fcsConfig.pluginMode.mode;
            h264Enabled = fcsConfig.pluginMode.h264;
        }
        
        // plugin mode validity check
        for(i in COMPOSIT_PLUGIN_MODES) {
            if (COMPOSIT_PLUGIN_MODES[i] === pluginMode) {
                validPluginMode = true;
            }
        }
        if(!validPluginMode){
            pluginMode = PLUGIN_MODES.AUTO;
        }
        
        // h264 validity check
        if(h264Enabled !== true && h264Enabled !== false){
            h264Enabled = undefined;
        }
        
        return {pluginMode: pluginMode, h264Enabled: h264Enabled};
    }

    function getPluginMode(options, navigatorType) {
        var pluginMode = identifyPluginMode(options);

        return PLUGIN_MODE_LOOKUP_TABLE[navigatorType.type][pluginMode] || pluginMode;
    }

    this.getWebRtcAdaptor = function(options) {
        var Adaptor, navigatorType = getNavigatorType(),
        adaptor, pluginModeAndH264Bundle, h264Enabled;

        if (fcsConfig.pluginMode) {
            pluginModeAndH264Bundle = getPluginModeForComposition(navigatorType);
            pluginMode = pluginModeAndH264Bundle.pluginMode;
            h264Enabled = pluginModeAndH264Bundle.h264Enabled;
            Adaptor = COMPOSIT_ADAPTOR_LOOKUP_TABLE[navigatorType.type][pluginMode];
        }
        else {
            pluginMode = getPluginMode(options, navigatorType);
            Adaptor = ADAPTOR_LOOKUP_TABLE[navigatorType.type][pluginMode];
        }

        if (!Adaptor) {
            // This seems unnecessary, still keeping it just in case of a weird 
            // condition
            logger.debug("Invalid Plugin Mode Detected, Treated as WEBRTC");
            pluginMode = DEFAULT_RTC_PLUGIN_MODE;
            Adaptor = DEFAULT_RTC_ADAPTOR;
        }

        logger.debug("Adaptor initializing from " + navigatorType + " browser and " + pluginMode + " plugIn mode");
        _window.pluginMode = pluginMode;
        adaptor = new Adaptor();
        //TODO: set h264Enabled for adaptor
        if (typeof h264Enabled !== 'undefined' ) {
            adaptor.setH264Enabled(h264Enabled);
        }
        return adaptor;
    };

    this.getPluginModes = function() {
        return PLUGIN_MODES;
    };

    this.getDefaultRtcPluginMode = function() {
        return DEFAULT_RTC_PLUGIN_MODE;
    };

    this.getDefaultRtcAdaptor = function() {
        return DEFAULT_RTC_ADAPTOR;
    };
};

var webRtcAdaptorFactory = new WebRtcAdaptorFactory(window,
        navigator,
        logManager,
        WebRtcPluginv21Adaptor,
        WebRtcPluginv22Adaptor,
        WebRtcPluginv30Adaptor,
        WebRtcChromeAdaptor,
        WebRtcFirefoxAdaptor);
if (__testonly__) { __testonly__.WebRtcAdaptorFactory = WebRtcAdaptorFactory; }
var WebRtcManager = function(_webRtcAdaptorFactory, _logManager, _globalBroadcaster, _navigator) {
    var self = this, rtcAdaptor, turnCredentials,
            logger = _logManager.getLogger("WebRtcManager");

    function onTurnServerCredentialsAcquired(credentials) {
        turnCredentials = credentials;
    }

    /*
     * addTurnCredentialsToUrl to be used when there is an active Turn Server,
     * to replace it's credentials
     */
    function addTurnCredentialsToUrl(iceServerUrl) {
        var i, serverType;
        if (iceServerUrl instanceof Array) {
            for (i = 0; i < iceServerUrl.length; i++) {
                serverType = iceServerUrl[i].url.substring(0, iceServerUrl[i].url.indexOf(':'));
                if (serverType === 'turn' || serverType === 'turns') {
                    iceServerUrl[i].credential = turnCredentials.credential;
                    iceServerUrl[i].username = turnCredentials.username;
                }
            }
        }
        return iceServerUrl;
    }

    function setSuccessCallbacktoCall(call, successCallback) {
        call.successCallback = successCallback;
    }

    function clearSuccessParametersFromCall(call) {
        call.successCallback = null;
    }

    self.canOriginatorSendLocalVideo = function(call) {
        return rtcAdaptor.canOriginatorSendLocalVideo(call);
    };

    self.canOriginatorReceiveRemoteVideo = function(call) {
        return rtcAdaptor.canOriginatorReceiveRemoteVideo(call);
    };

    self.initMedia = function(onSuccess, onFailure, options) {
        var iceServerUrl = "";
        logger.info("Initializing media for call");
        rtcAdaptor = _webRtcAdaptorFactory.getWebRtcAdaptor(options);

        if (options) {
            if (options.iceserver) {
                iceServerUrl = options.iceserver;
                if (turnCredentials) {
                    iceServerUrl = addTurnCredentialsToUrl(iceServerUrl);
                }
                rtcAdaptor.setIceServerUrl(iceServerUrl);
            }
            if (options.webrtcdtls) {
                rtcAdaptor.setDtlsEnabled(options.webrtcdtls);
            }

            if (options.localVideoContainer) {
                rtcAdaptor.setLocalVideoContainer(options.localVideoContainer);
            }

            if (options.remoteVideoContainer) {
                rtcAdaptor.setRemoteVideoContainer(options.remoteVideoContainer);
            }

            if (options.videoContainer) {
                rtcAdaptor.setDefaultVideoContainer(options.videoContainer);
            }
        }

        rtcAdaptor.initMedia(onSuccess, onFailure, options);
    };

    self.getUserMedia = function(onSuccess, onFailure, options) {
        var videoResolutionArray;
        logger.info("getting user media for call: started - userAgent: " + _navigator.userAgent);

        if (options) {
            if (options.audio !== undefined) {
                rtcAdaptor.setMediaAudio(options.audio);
            }
            if (options.video !== undefined) {
                rtcAdaptor.setMediaVideo(options.video);
            }

            if (options.videoResolution) {
                // First element of array will be Width and second element will be Height
                videoResolutionArray = options.videoResolution.split("x");
                if (videoResolutionArray[0] && videoResolutionArray[1]) {
                    rtcAdaptor.setVideoWidth(videoResolutionArray[0]);
                    rtcAdaptor.setVideoHeight(videoResolutionArray[1]);
                }
            }
        }

        rtcAdaptor.getUserMedia(onSuccess, onFailure);
    };

    self.startScreenMedia = function(onSuccess, onFailure, options, onEnded) {
        logger.info("getting screen media for call: started - userAgent: " + _navigator.userAgent);

        if (options) {
            if (options.width) {
                rtcAdaptor.setScreenWidth(options.width);
            }

            if (options.height) {
                rtcAdaptor.setScreenHeight(options.height);
            }

            if (options.frameRate) {
              rtcAdaptor.setScreenFrameRate(options.frameRate);
            }
        }

        rtcAdaptor.startScreenMedia(onSuccess, onFailure, onEnded);
    };

    self.stopScreenMedia = function() {
        rtcAdaptor.stopScreenMedia();
    };

    self.createOffer = function(call, successCallback, failureCallback, sendInitialVideo) {
        logger.info("create offer SDP: sendInitialVideo= " + sendInitialVideo);

        var successCallbackWrapper = function (sdp) {
            clearSuccessParametersFromCall(call);
            rtcAdaptor.setOriginatorSendLocalVideo(call, sendInitialVideo);
            if (typeof (successCallback) === 'function') {
                successCallback(sdp);
            }
        };

        setSuccessCallbacktoCall(call, successCallbackWrapper);

        if (!call.peer) {
            rtcAdaptor.createPeer(
                    call,
                    function createPeerSuccessCallback() {
                        rtcAdaptor.createOffer(call, successCallbackWrapper, function(err) {
                            clearSuccessParametersFromCall(call);
                            if (typeof (failureCallback) === 'function') {
                                failureCallback(err);
                            }
                        }, sendInitialVideo);
                    },
                    function createPeerFailureCallback() {
                        utils.callFunctionIfExist(failureCallback, 2);
                    }
            );
        }
    };

    self.createAnswer = function(call, successCallback, failureCallback, isVideoEnabled) {
        logger.info("creating answer SDP: callid= " + call.id);
        logger.info("creating answer SDP: isVideoEnabled= " + isVideoEnabled);

        var successCallbackWrapper = function (sdp) {
            clearSuccessParametersFromCall(call);
            rtcAdaptor.setOriginatorSendLocalVideo(call, isVideoEnabled);
            rtcAdaptor.setOriginatorReceiveRemoteVideo(call);
            if (typeof (successCallback) === 'function') {
                successCallback(sdp);
            }
        };

        setSuccessCallbacktoCall(call, successCallbackWrapper);

        if (!call.peer) {
            rtcAdaptor.createPeer(
                    call,
                    function createPeerSuccessCallback() {
                        rtcAdaptor.performSdpWorkaroundsBeforeProcessingIncomingSdp(call);
                        rtcAdaptor.createAnswer(call, successCallbackWrapper, function(err) {
                            clearSuccessParametersFromCall(call);
                            if (typeof (failureCallback) === 'function') {
                                failureCallback(err);
                            }
                        }, isVideoEnabled);
                    },
                    function createPeerFailureCallback() {
                        utils.callFunctionIfExist(failureCallback, 2);
                    }
            );
        }
    };

    self.processAnswer = function(call, successCallback, failureCallback) {
        if (call.peer) {

            var successCallbackWrapper = function () {
                clearSuccessParametersFromCall(call);
                rtcAdaptor.setOriginatorReceiveRemoteVideo(call);
                if (typeof (successCallback) === 'function') {
                    successCallback();
                }
            };

            setSuccessCallbacktoCall(call, successCallbackWrapper);

            rtcAdaptor.performSdpWorkaroundsBeforeProcessingIncomingSdp(call);
            rtcAdaptor.processAnswer(call, successCallbackWrapper, function(err){
            clearSuccessParametersFromCall(call);
            if (typeof (failureCallback) === 'function') {
                failureCallback(err);
            }
        });
        }
    };

    self.processRespond = function(call, successCallback, failureCallback, isJoin) {
        if (call.peer) {

            var successCallbackWrapper = function () {
                clearSuccessParametersFromCall(call);
                rtcAdaptor.setOriginatorReceiveRemoteVideo(call);
                if (typeof (successCallback) === 'function') {
                    successCallback();
                }
            };

            setSuccessCallbacktoCall(call, successCallbackWrapper);

            rtcAdaptor.performSdpWorkaroundsBeforeProcessingIncomingSdp(call);
            rtcAdaptor.processRespond(call, successCallbackWrapper, function(err){
            clearSuccessParametersFromCall(call);
            if (typeof (failureCallback) === 'function') {
                failureCallback(err);
            }
        }, isJoin);
        }
    };

    self.createUpdate = function(call, successCallback, failureCallback, isVideoStart){
        logger.info("createUpdate: isVideoStart= " + isVideoStart);

        if (call.peer) {

            var successCallbackWrapper = function (sdp) {
                clearSuccessParametersFromCall(call);
                rtcAdaptor.setOriginatorSendLocalVideo(call, isVideoStart);
                if (typeof (successCallback) === 'function') {
                    successCallback(sdp);
                }
            };

            setSuccessCallbacktoCall(call, successCallbackWrapper);

            rtcAdaptor.storeStableRemoteAndLocalSdpInCall(call);

            rtcAdaptor.createUpdate(call, successCallbackWrapper, failureCallback, isVideoStart);
        }
    };

    self.processUpdate = function(call, successCallback, failureCallback, local_hold_status) {
        logger.info("processUpdate: local_hold_status:" + local_hold_status);

        if (call.peer) {

            var successCallbackWrapper = function (sdp) {
                clearSuccessParametersFromCall(call);
                rtcAdaptor.setOriginatorReceiveRemoteVideo(call);
                if (typeof (successCallback) === 'function') {
                    successCallback(sdp);
                }
            };

            setSuccessCallbacktoCall(call, successCallbackWrapper);

            rtcAdaptor.performSdpWorkaroundsBeforeProcessingIncomingSdp(call);
            rtcAdaptor.storeStableRemoteAndLocalSdpInCall(call);

            rtcAdaptor.processUpdate(call, successCallbackWrapper, function(err){
            clearSuccessParametersFromCall(call);
            if (typeof (failureCallback) === 'function') {
                failureCallback(err);
            }
        }, local_hold_status);
        }
    };

    self.createReOffer = function(call, successCallback, failureCallback, usePreviousAudioDirection) {
        if (call.peer) {

            var successCallbackWrapper = function (sdp) {
                clearSuccessParametersFromCall(call);
                if (typeof (successCallback) === 'function') {
                    successCallback(sdp);
                }
            };

            setSuccessCallbacktoCall(call, successCallbackWrapper);

            rtcAdaptor.createReOffer(call, successCallbackWrapper, function(err){
            clearSuccessParametersFromCall(call);
            if (typeof (failureCallback) === 'function') {
                failureCallback(err);
            }
        }, usePreviousAudioDirection);
        }
    };

    self.createHoldUpdate = function(call, hold, remote_hold_status, successCallback, failureCallback) {
        logger.info("create hold update local hold= " + hold + " remote hold= " + remote_hold_status);

        if (call.peer) {

            var successCallbackWrapper = function (sdp) {
                clearSuccessParametersFromCall(call);
                if (typeof (successCallback) === 'function') {
                    successCallback(sdp);
                }
            };

            setSuccessCallbacktoCall(call, successCallbackWrapper);

            rtcAdaptor.storeStableRemoteAndLocalSdpInCall(call);

            rtcAdaptor.createHoldUpdate(call, hold, remote_hold_status, successCallbackWrapper,
                    function (err) {
                        clearSuccessParametersFromCall(call);
                        if (typeof (failureCallback) === 'function') {
                            failureCallback(err);
                        }
                    });
        }
    };

    self.processRemoteOfferOnLocalHold = function(call, successCallback, failureCallback) {
        if (call.peer) {

            var successCallbackWrapper = function (sdp) {
                clearSuccessParametersFromCall(call);
                if (typeof (successCallback) === 'function') {
                    successCallback(sdp);
                }
            };

            setSuccessCallbacktoCall(call, successCallbackWrapper);

            rtcAdaptor.processRemoteOfferOnLocalHold(call, successCallbackWrapper,
                    function (err) {
                        clearSuccessParametersFromCall(call);
                        if (typeof (failureCallback) === 'function') {
                            failureCallback(err);
                        }
                    });
        }
    };

    self.processEnd = function(call){
        if(call.peer){
            rtcAdaptor.processEnd(call);
        }
    };

    self.processHold = function(call, hold, local_hold_status, successCallback, failureCallback) {
        logger.info("processHold: local hold= " + local_hold_status + " remote hold= " + hold);

        if (call.peer) {

            var successCallbackWrapper = function (sdp) {
                clearSuccessParametersFromCall(call);
                rtcAdaptor.setOriginatorReceiveRemoteVideo(call);
                if (typeof (successCallback) === 'function') {
                    successCallback(sdp);
                }
            };

            setSuccessCallbacktoCall(call, successCallbackWrapper);

            rtcAdaptor.performSdpWorkaroundsBeforeProcessingIncomingSdp(call);
            rtcAdaptor.storeStableRemoteAndLocalSdpInCall(call);

            rtcAdaptor.processHold(call, hold, local_hold_status, successCallbackWrapper, function(err){
            clearSuccessParametersFromCall(call);
            if (typeof (failureCallback) === 'function') {
                failureCallback(err);
            }
        });
        }
    };

    self.processHoldRespond = function(call, successCallback, failureCallback, isJoin) {
        logger.info("Processing response to hold offer sent");

        if (call.peer) {

            var successCallbackWrapper = function() {
                clearSuccessParametersFromCall(call);
                rtcAdaptor.setOriginatorReceiveRemoteVideo(call);
                if (typeof (successCallback) === 'function') {
                    successCallback();
                }
            };

            setSuccessCallbacktoCall(call, successCallbackWrapper);

            rtcAdaptor.performSdpWorkaroundsBeforeProcessingIncomingSdp(call);
            rtcAdaptor.processHoldRespond(call, successCallbackWrapper, function(err) {
                clearSuccessParametersFromCall(call);
                if (typeof (failureCallback) === 'function') {
                    failureCallback(err);
                }
            }, isJoin);
        }
    };

    self.processPreAnswer = function(call){
        logger.info("processing preanswer from the offer we sent");

        if(call.peer){
            rtcAdaptor.processPreAnswer(call);
        }

    };

    self.revertRtcState = function(call, successCallback, failureCallback) {
        rtcAdaptor.revertRtcState(call, successCallback, failureCallback);
    };

    self.getRemoteVideoResolutions = function() {
        return rtcAdaptor.getRemoteVideoResolutions();
    };

    self.getLocalVideoResolutions = function() {
        return rtcAdaptor.getLocalVideoResolutions();
    };

    self.isAudioSourceAvailable = function() {
        return rtcAdaptor.getAudioSourceAvailable();
    };

    self.isVideoSourceAvailable = function() {
        return rtcAdaptor.getVideoSourceAvailable();
    };

    self.refreshVideoRenderer = function() {
        rtcAdaptor.refreshVideoRenderer();
    };

    self.sendIntraFrame = function(internalCall) {
        rtcAdaptor.sendIntraFrame(internalCall);
    };

    self.sendBlackFrame = function(internalCall) {
        rtcAdaptor.sendBlackFrame(internalCall);
    };

    self.muteAudioTrack = function(call, mute) {
        return rtcAdaptor.muteAudioTrack(call, mute);
    };

    self.addLocalStream = function(call) {
        rtcAdaptor.addLocalStream(call);
    };

    self.isPluginEnabled = function() {
        return rtcAdaptor.isPluginEnabled();
    };

    self.sendDTMF = function(call, tone){
        rtcAdaptor.sendDTMF(call, tone);
    };

    self.showSettingsWindow = function(){
        rtcAdaptor.showSettingsWindow();
    };

    self.createStreamRenderer = function(streamId, container, options){
        return rtcAdaptor.createStreamRenderer(streamId, container, options);
    };

    self.disposeStreamRenderer = function(container){
        rtcAdaptor.disposeStreamRenderer(container);
    };

    self.set_logSeverityLevel = function(level){
        rtcAdaptor.set_logSeverityLevel(level);
    };

    self.enable_logCallback = function(){
        rtcAdaptor.enable_logCallback();
    };

    self.disable_logCallback = function(){
        rtcAdaptor.disable_logCallback();
    };

    self.get_audioInDeviceCount = function(){
        rtcAdaptor.get_audioInDeviceCount();
    };

    self.get_audioOutDeviceCount = function(){
        rtcAdaptor.get_audioOutDeviceCount();
    };

    self.get_videoDeviceCount = function(){
        rtcAdaptor.get_videoDeviceCount();
    };

    self.storeLocalStreamToCall = function(call, localStreamId) {
      rtcAdaptor.storeLocalStreamToCall(call, localStreamId);
    };

    _globalBroadcaster.subscribe(CONSTANTS.EVENT.TURN_CREDENTIALS_ESTABLISHED, onTurnServerCredentialsAcquired);
    if (__testonly__) { self.setRtcLibrary = function(_rtcLibrary) { rtcAdaptor = _rtcLibrary; }; }
};

var webRtcManager = new WebRtcManager(webRtcAdaptorFactory, logManager, globalBroadcaster, navigator);
if (__testonly__) { __testonly__.WebRtcManager = WebRtcManager; }

var NotificationServiceImpl = function(_server, _globalBroadcaster) {

    var SUBSCRIPTION_URL = "/subscription",
        CONNECTION_URL = "/rest/version/latest/isAlive",
    SUBSCRITION_KEYS_FOR_ASSIGNED_SERVICES = {
        "CallControl": "call",
        "call" : "call",
        "IM": "IM",
        "Presence": "Presence",
        "custom": "custom",
        "callMe": "callMe"
    },
    DEFAULT_SERVICES = [SUBSCRITION_KEYS_FOR_ASSIGNED_SERVICES.IM,
                        SUBSCRITION_KEYS_FOR_ASSIGNED_SERVICES.Presence,
                        SUBSCRITION_KEYS_FOR_ASSIGNED_SERVICES.CallControl],
    DEFAULT_ANONYMOUS_SERVICES = [SUBSCRITION_KEYS_FOR_ASSIGNED_SERVICES.callMe],
    DEFAULT_SUBSCRIPTION_EXPIRY_VALUE = 3600;

    function getNotificationType() {
        // if SNMP is set return specific data to be sent to the server
        if(fcsConfig.notificationType === fcs.notification.NotificationTypes.WEBSOCKET && window.WebSocket){
            return {
                notificationType: "WebSocket",
                clientIp: fcsConfig.clientIp
            };
        }
        else {
            fcsConfig.notificationType = "longpolling";
            return {
                notificationType: "LongPolling",
                pollingTimer: fcsConfig.polling
            };
        }
    }

    function composeServicesToSubscribeFromAssignedServices(assignedServices) {
        var i, services = [];
        for (i in SUBSCRITION_KEYS_FOR_ASSIGNED_SERVICES) {
            if (SUBSCRITION_KEYS_FOR_ASSIGNED_SERVICES.hasOwnProperty(i)) {
                if (assignedServices.indexOf(i) !== -1) {
                    services.push(SUBSCRITION_KEYS_FOR_ASSIGNED_SERVICES[i]);
                }
            }
        }

        return services;
    }

    function composeSubscribeRequestData(forceLogout, isSubscribe) {
        var notificationTypeData = getNotificationType(),
        i,
        subscribeRequest;
        
        if (fcs.notification.isAnonymous()) {
            if (!fcsConfig.anonymousServices) {
                fcsConfig.anonymousServices = DEFAULT_ANONYMOUS_SERVICES;
            }
        }
        else {
            if (!fcsConfig.services) {
                fcsConfig.services = DEFAULT_SERVICES;
            }
        }
        
        subscribeRequest = {
                "expires": Math.floor(fcsConfig.expires),
                "service": fcs.notification.isAnonymous() ? composeServicesToSubscribeFromAssignedServices(fcsConfig.anonymousServices) : composeServicesToSubscribeFromAssignedServices(fcsConfig.services),
                "localization": "English_US"
        };
        
        if (isSubscribe && fcsConfig.serverProvidedTurnCredentials) {
            subscribeRequest.useTurn = (fcsConfig.serverProvidedTurnCredentials === true ? true : false);
        }
        
        if (forceLogout === true) {
            subscribeRequest.forceLogOut = "true";
        }
        
        for (i in notificationTypeData) {
            if(notificationTypeData.hasOwnProperty(i)) {
                subscribeRequest[i] = notificationTypeData[i];
            }
        }

        return subscribeRequest;
    }

    this.extendSubscription = function(subscriptionURL, onSuccess, onFailure) {
        if (fcsConfig.expires === 0) {
            fcsConfig.expires = DEFAULT_SUBSCRIPTION_EXPIRY_VALUE;
        }

        _server.sendPutRequest(
            {
                url: getUrl() + subscriptionURL,
                data: {"subscribeRequest": composeSubscribeRequestData()}
            },
            function(data) {
                var response = data.subscribeResponse, params = response.subscriptionParams;
                onSuccess(params.notificationChannel, params.assignedService, params.service);
            },
            onFailure
            );
    };

    this.retrieveNotification = function(notificationChannelURL, onSuccess, onFailure) {
        return _server.sendGetRequest(
            {
                url: getUrl() + notificationChannelURL
            },
            function(data){
                var type = null, notificationMessage;
                if(data !== null){
                    notificationMessage = data.notificationMessage;
                    if(notificationMessage){
                        type = notificationMessage.eventType;
                    }
                }
                onSuccess(type, notificationMessage);
            }
            ,
            onFailure
            );
    };

    this.subscribe = function(onSuccess, onFailure ,forceLogout, token) {
        var dummy, realm = getRealm();
        fcsConfig.expires = DEFAULT_SUBSCRIPTION_EXPIRY_VALUE;
        _server.sendPostRequest(
        {
            url: getWAMUrl(1, SUBSCRIPTION_URL + (realm?("?tokenrealm=" + realm):"")),
            data: {"subscribeRequest": composeSubscribeRequestData(forceLogout, true)}
        },
        function(data) {
            var response = data.subscribeResponse, params = response.subscriptionParams, turnParams;
            if (params.turnActive === true) {
                if (params.turnCredentials && params.turnCredentials.username && params.turnCredentials.password) {
                    turnParams = {username : params.turnCredentials.username, credential : params.turnCredentials.password};
                    _globalBroadcaster.publish(CONSTANTS.EVENT.TURN_CREDENTIALS_ESTABLISHED, turnParams);
                }
            }
            onSuccess(response.subscription,
                params.notificationChannel,
                params.expires,
                params.pollingTimer,
                params.assignedService,
                params.service,
                params.sessionId);
        },
        onFailure, dummy, dummy, dummy, dummy, token
        );
    };

    this.deleteSubscription = function(subscriptionURL, onSuccess, onFailure, synchronous) {
        _server.sendDeleteRequest({
            url: getUrl() + subscriptionURL
        },
        onSuccess,
        onFailure
        );
    };
    
    if (__testonly__) { this.composeSubscribeRequestData = composeSubscribeRequestData;}
};

var NotificationService = function (_server, _globalBroadcaster) {
    return new NotificationServiceImpl(_server || server,
                                       _globalBroadcaster || globalBroadcaster);
};
var notifcationService = new NotificationService();

if (__testonly__) { __testonly__.NotificationService = NotificationService; }

var NotificationCallBacks = {};
var NotificationManagerImpl = function(_service, _window, _logManager, _globalBroadcaster, _cache) {
    var logger = _logManager.getLogger("notificationManager"),
            SUBSCRIBEURL = 'SubscriptionUrl',
            NOTIFYURL = 'NotificationUrl',
            NOTIFYID = 'NotificationId',
            SUBSCRIBEEXPIRY = 'SubscriptionExpiry',
            SUBSCRIBEEXTENDINTERVAL = 'SubscriptionExtendInterval',
            USERNAME = 'USERNAME',
            SESSION = 'SESSION',
            NOTIFICATION_EVENTS_QUEUE_MAX_LENGTH = 50,
            NOTIFICATION_EVENTS_QUEUE_CLEARING_AUDIT_INTERVAL = 600,
            CHECK_CONNECTIVITY_INTERVAL = 10000,
            RESTART_SUBSCRIPTION_TIMEOUT = CHECK_CONNECTIVITY_INTERVAL + 1000,
            notificationRetry = 4000,
            WEBSOCKET_CONSTANTS = CONSTANTS.WEBSOCKET,
            notifier = null,
            webSocket = null,
            self = this,
            isAnonymous = false,
            service = _service,
            // function to be invoked on failure (must be set by the user)
            onNotificationFailure = null,
            onNotificationSuccess = null,
            isNotificationFailureDetected = false,
            extendNotificationSubscription, notificationSuccess, notificationFailure,
            extendNotificationSubscriptionTimer = null,
            webSocketConnect,
            onConnectionLost,
            onConnectionEstablished,
            triggeredFetch = false,
            onSubscriptionSuccess = null,
            onSubscriptionFailure = null,
            notificationEventsQueue = [],
            notificationEventsQueueClearingAuditTimer,
            notificationCachePrefix = "",
            startNotificationTimerAfterConnectionReEstablished,
            restartSubscriptionTimer,
            notificationFailureRestartSubscriptionTimeout,
            lastLongpollingRequest = null,
            originalNotificationType = null,
            token = null,
            session = null;
    
    function onTokenAuth(data){
        token = data.token;
    }
    
    function cancelLastLongpollingRequest() {
        if (lastLongpollingRequest) {
            logger.trace("aborting last long polling request.");
            lastLongpollingRequest.abort();
            lastLongpollingRequest = null;
        }
    }
    
    function onTokenOrSessionError(){
        notifier = null;
        triggeredFetch = false;

        _cache.removeItem(notificationCachePrefix + NOTIFYURL);
        _cache.removeItem(notificationCachePrefix + NOTIFYID);
        _cache.removeItem(notificationCachePrefix + SUBSCRIBEURL);
        _cache.removeItem(notificationCachePrefix + SUBSCRIBEEXPIRY);
        _cache.removeItem(notificationCachePrefix + SUBSCRIBEEXTENDINTERVAL);
        _cache.removeItem(notificationCachePrefix + SESSION);
        this.onGoneNotificationReceived();
        cancelLastLongpollingRequest();
    }
   
    function publishDeviceSubscriptionStartedMessage(message) {
        _globalBroadcaster.publish(CONSTANTS.EVENT.DEVICE_SUBSCRIPTION_STARTED, message);
    }

    function publishDeviceSubscriptionEndedMessage() {
        _globalBroadcaster.publish(CONSTANTS.EVENT.DEVICE_SUBSCRIPTION_ENDED);
    }

    function notificationEventsQueueClearingAudit() {
        if (notificationEventsQueue.length > 0) {
            var eventIdtoRemove = notificationEventsQueue.shift();
            logger.info("notification events queue clearing audit timer has expired, removing first eventId: " + eventIdtoRemove);
        }
    }

    notificationEventsQueueClearingAuditTimer = setInterval(notificationEventsQueueClearingAudit, NOTIFICATION_EVENTS_QUEUE_CLEARING_AUDIT_INTERVAL * 1000);

    this.NotificationTypes = {
        LONGPOLLING: "longpolling",
        SNMP: "snmp",
        WEBSOCKET: "websocket"
    };

    this.isAnonymous = function() {
        return isAnonymous;
    };

    function getNotificationType() {

        var type;
        for (type in self.NotificationTypes) {
            if (self.NotificationTypes.hasOwnProperty(type)) {
                if (fcsConfig.notificationType === self.NotificationTypes[type]) {
                    return fcsConfig.notificationType;
                }
            }
        }

        return self.NotificationTypes.WEBSOCKET;
    }

    function isNotificationTypeLongPolling() {
        // If user set long polling return true
        return (getNotificationType() === self.NotificationTypes.LONGPOLLING);
    }

    function isNotificationTypeWebSocket() {
        // If user set websocket return true
        return _window.WebSocket && (getNotificationType() === self.NotificationTypes.WEBSOCKET);
    }

    function stopRestartSubscriptionTimer() {
        clearTimeout(restartSubscriptionTimer);
        restartSubscriptionTimer = null;
    }

    function restartSubscription(toLP) {
        stopRestartSubscriptionTimer();
        restartSubscriptionTimer = setTimeout(function() {
            if (!fcs.isConnected()) {
                logger.debug("Connection is lost, no need to restart subscription...");
                return;
            }

            logger.debug("Restarting subscription...");
            if (toLP) {
                logger.debug("Switching to Long Polling notification...");
                fcsConfig.notificationType = self.NotificationTypes.LONGPOLLING;
            }

            self.start(onSubscriptionSuccess, onSubscriptionFailure, isAnonymous, undefined, undefined, true);

        }, RESTART_SUBSCRIPTION_TIMEOUT);
    }

    function isWebsocketOpened() {
        if (webSocket && webSocket.readyState === webSocket.OPEN) {
            return true;
        }
        return false;
    }

    function validateWebsocketUrl() {
        if (!isWebsocketOpened()) {
            return false;
        }

        if (!notifier) {
            return false;
        }

        if (!notifier.notificationUrl) {
            return false;
        }

        if (webSocket.url.indexOf(notifier.notificationUrl) === -1) {
            return false;
        }

        return true;
    }

    function websocketConnectionCheck() {
        if (isWebsocketOpened()) {
            webSocket.send("test");
        }
    }

    function fetchNotification() {
        if (notifier) {
            if (lastLongpollingRequest) {
                logger.info("longpolling request exists, no need to trigger new one.");
                return;
            }
            //Fetching Notification
            lastLongpollingRequest = _service.retrieveNotification(notifier.notificationUrl, notificationSuccess, notificationFailure);
        }
        else {
            logger.error("notifier is undefined, cannot fetch notification");
        }
    }

    // Handles successfully fetched notification
    notificationSuccess = function(type, data) {
        var eventIdtoRemove;
        if (data && type) {
            logger.info("received notification event:" + type, data);
            if (notificationEventsQueue.indexOf(data.eventId) !== -1) {
                logger.info("previously received notification eventId: " + data.eventId + ", do not execute notification callback function.");
            }
            else {
                logger.info("newly received notification eventId: " + data.eventId);
                notificationEventsQueue.push(data.eventId);
                if (notificationEventsQueue.length === NOTIFICATION_EVENTS_QUEUE_MAX_LENGTH) {
                    eventIdtoRemove = notificationEventsQueue.shift();
                    logger.info("notification events queue is full, remove first eventId: " + eventIdtoRemove);
                }
                utils.callFunctionIfExist(NotificationCallBacks[type], data);
            }
        }

        // if 'Long polling' is used, fetch the notification
        if (isNotificationTypeLongPolling()) {
            lastLongpollingRequest = null;
            fetchNotification();
        }

        if (isNotificationFailureDetected) {
            isNotificationFailureDetected = false;
            utils.callFunctionIfExist(onNotificationSuccess);
        }

    };

    function stopNotificationFailureRestartSubscriptionTimeoutTimer() {
        clearTimeout(notificationFailureRestartSubscriptionTimeout);
        notificationFailureRestartSubscriptionTimeout = null;
    }

    // Handles fail fetched notification
    notificationFailure = function(error) {
        logger.error("received notification error:" + error);
        _globalBroadcaster.publish(CONSTANTS.EVENT.NOTIFICATION_CHANNEL_LOST);
        if (!fcs.isConnected()) {
            logger.debug("Connection is lost, no need to handle notification failure...");
            return;
        }

        isNotificationFailureDetected = true;

        // if 'Long polling' is used, fetch the notification
        if (isNotificationTypeLongPolling()) {
            stopNotificationFailureRestartSubscriptionTimeoutTimer();
            notificationFailureRestartSubscriptionTimeout = setTimeout(function() {
                restartSubscription();
            }, notificationRetry);
        }

        utils.callFunctionIfExist(onNotificationFailure, error);
    };

    function websocketDisconnect() {
        if (webSocket) {
            webSocket.onmessage = null;
            webSocket.onopen = null;
            webSocket.onclose = null;
            webSocket.onerror = null;
            if (webSocket.close) {
                webSocket.close();
            }
            webSocket = null;
        }
    }

    webSocketConnect = function(onSuccess, onFailure) {
        var protocolValue = WEBSOCKET_CONSTANTS.PROTOCOL.NONSECURE;

        function callOnSuccess(status) {
            logger.trace("websocket connection created successfully: " + status);
            if (typeof onSuccess === 'function') {
                onSuccess(status);
            }
        }

        function callOnFailure(status) {
            logger.trace("websocket connection failed: " + status);
            // this is just for clearing local web socket variable.
            websocketDisconnect();
            if (typeof onFailure === 'function') {
                onFailure(status);
            }
        }

        if (isWebsocketOpened()) {
            if (validateWebsocketUrl()) {
                logger.info("WebSocket is already opened, no need to open new one.");
                callOnSuccess(WEBSOCKET_CONSTANTS.STATUS.ALREADY_OPENED);
                return;
            }

            logger.error("websocket connection with invalid url is found!");
            websocketDisconnect();
        }
        else {
            // this is just for clearing local web socket variable.
            websocketDisconnect();
        }

        try {
            if (fcsConfig.websocketProtocol) {
                if (fcsConfig.websocketProtocol === WEBSOCKET_CONSTANTS.PROTOCOL.SECURE) {
                    protocolValue = WEBSOCKET_CONSTANTS.PROTOCOL.SECURE;
                }
            }
            webSocket = new _window.WebSocket(protocolValue + "://" + (fcsConfig.websocketIP ? fcsConfig.websocketIP : _window.location.hostname) + ":" + (fcsConfig.websocketPort ? fcsConfig.websocketPort : WEBSOCKET_CONSTANTS.DEFAULT_PORT) + notifier.notificationUrl);
        }
        catch (exception) {
            logger.error("WebSocket create error: ", exception);
            callOnFailure(WEBSOCKET_CONSTANTS.STATUS.CREATE_ERROR);
            return;
        }

        if (webSocket !== null) {
            webSocket.onmessage = function(event) {
                var data = JSON.parse(event.data), notificationMessage, type;
                if (data) {
                    //logger.info("WebSocket notification event data:" + data);
                    notificationMessage = data.notificationMessage;
                    //logger.info("WebSocket notification event notificationMessage:" + notificationMessage);
                    if (notificationMessage) {
                        type = notificationMessage.eventType;
                        notificationSuccess(type, notificationMessage);
                    }
                }
            };
            webSocket.onopen = function(event) {
                logger.info("WebSocket opened");
                callOnSuccess(WEBSOCKET_CONSTANTS.STATUS.OPENED);
            };
            webSocket.onclose = function(event) {
                logger.info("WebSocket closed");           
                notificationFailure(WEBSOCKET_CONSTANTS.STATUS.CONNECTION_CLOSED);
                callOnFailure(WEBSOCKET_CONSTANTS.STATUS.CONNECTION_CLOSED);
            };
            webSocket.onerror = function(event) {
                logger.error("Error on Web Socket connection.");
                notificationFailure(WEBSOCKET_CONSTANTS.STATUS.CONNECTION_ERROR);
                callOnFailure(WEBSOCKET_CONSTANTS.STATUS.CONNECTION_ERROR);
            };
        }
        else {
            callOnFailure(WEBSOCKET_CONSTANTS.STATUS.NOT_FOUND);
        }
    };

     function onNotificationSubscriptionSuccess() {
        publishDeviceSubscriptionStartedMessage({"connectivity": {
                "handler": websocketConnectionCheck,
                "interval": CHECK_CONNECTIVITY_INTERVAL
            },
            "session": session,
            "notificationId": notifier ? notifier.notificationId : ""
         });
        if (onSubscriptionSuccess) {
            utils.callFunctionIfExist(onSubscriptionSuccess);
            onSubscriptionSuccess = null;
        }
    }

    function onDeviceSubscriptionFailure(err) {
        if (fcs.isConnected()) {
            utils.callFunctionIfExist(onSubscriptionFailure, err);
        }
    }

    function stopExtendNotificationSubscriptionTimer() {
        logger.info("extend notification subscription timer is stopped.");
        clearInterval(extendNotificationSubscriptionTimer);
        extendNotificationSubscriptionTimer = null;
    }
 
    // Subscribe for getting notifications
    function deviceSubscribe(forceLogout) {
        if (!fcs.isConnected()) {
            logger.debug("Connection is lost, no need to subscribe...");
            return;
        }

        logger.debug("Subscribing...");
        _service.subscribe(function(subscribeUrl, notificationUrl, exp, poll, assignedService, servicesReceivingNotification, sessionId) {
            token = null;
            fcs.setServices(assignedService);
            fcsConfig.services = assignedService;
            fcsConfig.servicesReceivingNotification = servicesReceivingNotification;

            fcsConfig.polling = poll;
            fcsConfig.expires = exp;
            fcsConfig.extendInterval = exp / 2;
            notifier = {};
            notifier.subscribeUrl = subscribeUrl;
            notifier.notificationUrl = notificationUrl;
            notifier.notificationId = notificationUrl.substr(notificationUrl.lastIndexOf("/") + 1);
            stopExtendNotificationSubscriptionTimer();
            extendNotificationSubscriptionTimer = setInterval(extendNotificationSubscription, fcsConfig.extendInterval * 1000);
            _cache.setItem(notificationCachePrefix + NOTIFYURL, notificationUrl);
            _cache.setItem(notificationCachePrefix + NOTIFYID, notifier.notificationId);
            _cache.setItem(notificationCachePrefix + SUBSCRIBEURL, subscribeUrl);
            _cache.setItem(notificationCachePrefix + SUBSCRIBEEXPIRY, fcsConfig.expires);
            _cache.setItem(notificationCachePrefix + SUBSCRIBEEXTENDINTERVAL, fcsConfig.extendInterval);
            _cache.setItem(notificationCachePrefix + USERNAME, fcs.getUser());
            if (sessionId) {
                session = sessionId;
                _cache.setItem(notificationCachePrefix + SESSION, session);
            }

            logger.debug("Subscription successfull - notifier: ", notifier);

            // if 'WebSocket' initialize else 'LongPolling' is used, fetch the notification
            if (isNotificationTypeWebSocket()) {
                webSocketConnect(function () {
                    originalNotificationType = self.NotificationTypes.WEBSOCKET;
                    cancelLastLongpollingRequest();
                    onNotificationSubscriptionSuccess();
                }, function() {
                    restartSubscription(true);
                });
            }
            else {
                originalNotificationType = self.NotificationTypes.LONGPOLLING;
                cancelLastLongpollingRequest();
                onNotificationSubscriptionSuccess();
                fetchNotification();
            }
        }, function(err) {
            logger.error("Subscription is failed - error: " + err);

            onDeviceSubscriptionFailure(err);
        },forceLogout, token);
    }

    function sendExtendSubscriptionRequest() {
        if (!fcs.isConnected()) {
            logger.debug("Connection is lost, no need to extend subscribe...");
            return;
        }

        logger.debug("Extending subscription... - notifier: ", notifier);
        _service.extendSubscription(notifier.subscribeUrl, function(notificationChannel, assignedService, servicesReceivingNotification) {
            fcs.setServices(assignedService);
            fcsConfig.services = assignedService;
            fcsConfig.servicesReceivingNotification = servicesReceivingNotification;

            notifier.notificationUrl = notificationChannel;
            _cache.setItem(notificationCachePrefix + NOTIFYURL, notificationChannel);

            //we tried to use precached subscription and it succeed start fetching notifications
            stopExtendNotificationSubscriptionTimer();
            extendNotificationSubscriptionTimer = setInterval(extendNotificationSubscription, fcsConfig.extendInterval * 1000);

            logger.debug("Extending subscription successful - notifier: ", notifier);

            // if 'WebSocket' initialize else 'LongPolling' is used, fetch the notification
            if (isNotificationTypeWebSocket()) {
                webSocketConnect(function() {
                    cancelLastLongpollingRequest();
                    onNotificationSubscriptionSuccess();
                }, function() {
                    restartSubscription(true);
                });
            }
            else {
                cancelLastLongpollingRequest();
                fetchNotification();
                onNotificationSubscriptionSuccess();
            }
        }, function(err) {
            logger.error("Extending subscription is failed - error: " + err);
            logger.error("Fail reusing existing subscription, re-subscribing.");
            cancelLastLongpollingRequest();
            deviceSubscribe();
        });
    }

    extendNotificationSubscription = function(onSuccess, onFailure, restarting) {
        if (!fcs.isConnected()) {
            logger.debug("Connection is lost, no need to extend subscribe...");
            return;
        }

        if (onSuccess) {
            onSubscriptionSuccess = onSuccess;
            onSubscriptionFailure = onFailure;
        }

         if (notifier) {
            if (!restarting) {
                if (originalNotificationType === self.NotificationTypes.WEBSOCKET
                        && isNotificationTypeLongPolling()) {
                    logger.trace("original notification type is websocket, try websocket connection again.");
                    notifier.notificationUrl.replace("/notification/", "/websocket/");
                    webSocketConnect(function() {
                        logger.trace("websocket connection created successfully, use websocket from now on.");
                        _cache.setItem(notificationCachePrefix + NOTIFYURL, notifier.notificationUrl);
                        fcsConfig.notificationType = self.NotificationTypes.WEBSOCKET;
                        sendExtendSubscriptionRequest();
                    }, function() {
                        logger.trace("websocket connection failed, keep using long polling.");
                        notifier.notificationUrl.replace("/websocket/", "/notification/");
                        sendExtendSubscriptionRequest();
                    });
                }
                else {
                    sendExtendSubscriptionRequest();
                }
            }
            else {
                logger.trace("subscription restart is triggered...");
                sendExtendSubscriptionRequest();
            }
            
        }
        else {
            logger.debug("Cannot reuse existing subscription, re-subscribing.");
            deviceSubscribe();
        }
    };

    this.stop = function(onStopSuccess, onStopFailure, synchronous) {
        if (!fcs.isConnected()) {
            logger.debug("Connection is lost, no need to unsubscribe...");
            return;
        }

        logger.debug("Unsubscribing... - notifier: ", notifier);
        if (notifier) {
            _service.deleteSubscription(notifier.subscribeUrl, function() {
                logger.debug("Unsubscription successfull");
                
                stopExtendNotificationSubscriptionTimer();
                publishDeviceSubscriptionEndedMessage();
                cancelLastLongpollingRequest();
                websocketDisconnect();
                notifier = null;
                triggeredFetch = false;
                
                _cache.removeItem(notificationCachePrefix + NOTIFYURL);
                _cache.removeItem(notificationCachePrefix + NOTIFYID);
                _cache.removeItem(notificationCachePrefix + SUBSCRIBEURL);
                _cache.removeItem(notificationCachePrefix + SUBSCRIBEEXPIRY);
                _cache.removeItem(notificationCachePrefix + SUBSCRIBEEXTENDINTERVAL);
                _cache.removeItem(notificationCachePrefix + SESSION);
                if (typeof onStopSuccess === 'function') {
                    onStopSuccess();
                }
            }, function(err) {
                logger.error("Unsubscribe if failed - error:" + err);
                triggeredFetch = false;
                if (typeof onStopFailure === 'function') {
                    onStopFailure();
                }
            }, synchronous);
        }
        else {
            logger.error("notifier is unknown, cannot send unsubscribe request.");
            triggeredFetch = false;
            if (typeof onStopFailure === 'function') {
                onStopFailure();
            }
        }
    };

    function startNotification(onSuccess, onFailure, anonymous, cachePrefix ,forceLogout, restarting) {
        onSubscriptionSuccess = onSuccess;
        onSubscriptionFailure = onFailure;
        isAnonymous = anonymous;

        if (cachePrefix) {
            notificationCachePrefix = cachePrefix;
        }

        if (!fcs.isConnected()) {
            logger.debug("Connection is lost, no need to subscribe...");
            return;
        }


        logger.debug("start - notification subscription...");

        var nurl = _cache.getItem(notificationCachePrefix + NOTIFYURL),
                nid = _cache.getItem(notificationCachePrefix + NOTIFYID),
                surl = _cache.getItem(notificationCachePrefix + SUBSCRIBEURL),
                exp = _cache.getItem(notificationCachePrefix + SUBSCRIBEEXPIRY),
                extendInterval = _cache.getItem(notificationCachePrefix + SUBSCRIBEEXTENDINTERVAL),
                user = _cache.getItem(notificationCachePrefix + USERNAME);

        logger.debug("start - cached data - nurl: " + nurl +
                " nid: " + nid + " surl: " + surl +
                " exp: " + exp + " extendInterval: " + extendInterval +" user: " + user);

        if (nurl && nid && surl && exp && extendInterval && (fcs.getUser() === user)) {
            notifier = {};
            notifier.subscribeUrl = surl;
            notifier.notificationUrl = nurl;
            notifier.notificationId = nid;
            fcsConfig.expires = exp;
            fcsConfig.extendInterval = extendInterval;
            extendNotificationSubscription(undefined, undefined, restarting);
        }
        else {
            deviceSubscribe(forceLogout);
        }
    }

    this.start = startNotification;

    this.extend = startNotification;

    function stopStartNotificationTimerAfterConnectionReEstablishedTimer() {
        clearTimeout(startNotificationTimerAfterConnectionReEstablished);
        startNotificationTimerAfterConnectionReEstablished = null;
    }

    function handleConnectionEstablished() {
        var startNotificationTimeout;
        startNotificationTimeout = Math.random() * RESTART_SUBSCRIPTION_TIMEOUT;
        logger.info("starting notification after timeout: " + startNotificationTimeout);
        stopStartNotificationTimerAfterConnectionReEstablishedTimer();
        startNotificationTimerAfterConnectionReEstablished = setTimeout(function() {
            startNotification(onSubscriptionSuccess,
                    onSubscriptionFailure);
            if (fcs.isConnected()) {
                utils.callFunctionIfExist(onConnectionEstablished);
            }
        }, startNotificationTimeout);
    }

    function handleConnectionLost(err) {
        stopExtendNotificationSubscriptionTimer();
        stopStartNotificationTimerAfterConnectionReEstablishedTimer();
        if (isNotificationTypeLongPolling()) {
            cancelLastLongpollingRequest();
        }

        utils.callFunctionIfExist(onConnectionLost);
    }

    this.setOnError = function(callback) {
        onNotificationFailure = callback;
    };

    this.setOnSuccess = function(callback) {
        onNotificationSuccess = callback;
    };

    this.setOnConnectionLost = function(callback) {
        onConnectionLost = callback;
    };

    this.setOnConnectionEstablished = function(callback) {
        onConnectionEstablished = callback;
    };

    this.trigger = function() {
        if (!triggeredFetch) {
            try {
                fetchNotification();
                triggeredFetch = true;
            }
            catch (err) {
                throw err;
            }
        }
    };

    function handleGoneNotification(data) {
        _cache.removeItem("USERNAME");
        _cache.removeItem("PASSWORD");
        _cache.removeItem(notificationCachePrefix + SESSION);
        stopExtendNotificationSubscriptionTimer();
        publishDeviceSubscriptionEndedMessage();
        utils.callFunctionIfExist(fcs.notification.onGoneReceived, data);
    }

    this.getNotificationId = function() {
        if (notifier) {
            return notifier.notificationId;
        }
    };

    NotificationCallBacks.gone = function (data) {
        handleGoneNotification(data);
    };
    
    _globalBroadcaster.subscribe(CONSTANTS.EVENT.CONNECTION_REESTABLISHED, handleConnectionEstablished);
    _globalBroadcaster.subscribe(CONSTANTS.EVENT.CONNECTION_LOST, handleConnectionLost);
    _globalBroadcaster.subscribe(CONSTANTS.EVENT.TOKEN_AUTH_STARTED, onTokenAuth, 10);
    _globalBroadcaster.subscribe(CONSTANTS.EVENT.TOKEN_NOT_FOUND, onTokenOrSessionError);
    _globalBroadcaster.subscribe(CONSTANTS.EVENT.SESSION_EXPIRED, onTokenOrSessionError);
    
    if (__testonly__) { this.getWebSocket = function() { return webSocket; }; }
    if (__testonly__) { this.webSocketConnect = webSocketConnect; }
    if (__testonly__) { this.websocketDisconnect = websocketDisconnect; }
    if (__testonly__) { this.WEBSOCKET_CONSTANTS = WEBSOCKET_CONSTANTS; }
    if (__testonly__) { this.setNotifier = function(data) { notifier = data; }; }
};

var NotificationManager = function(_service, _window, _logManager, _globalBroadcaster, _cache) {
    return new NotificationManagerImpl(_service || notifcationService,
                                       _window || window,
                                       _logManager || logManager,
                                       _globalBroadcaster || globalBroadcaster,
                                       _cache || cache);
};

var notificationManager = new NotificationManager();

if (__testonly__) { __testonly__.NotificationManager = NotificationManager; }

/**
 * Manages a user's subscriptions to remote notifications.  A user may subscribe to specific
 * event types (calls, instant messages, presence updates) using websocket or long polling.
 *
 * Note that call/im/presence event handlers must be assigned in other objects before calling
 * notificationSubscribe/extendNotificationSubscription.
 *
 * @name notification
 * @namespace
 * @memberOf fcs
 * 
 * @version 3.0.5.1
 * @since 3.0.0
 *
 * @see fcs.config.notificationType
 * @see fcs.im.onReceived
 * @see fcs.call.onReceived
 * @see fcs.presence.onReceived
 *
 */
var NotificationImpl = function(_manager) {
    /**
     * Called on receipt of a 410 GONE message
     *
     * @name fcs.notification.onGoneReceived
     * @event
     * 
     * @since 3.0.0
     * 
     * @example 
     * var goneReceived = function(data){
     *    // do something here
     * };
     * 
     * fcs.notification.onGoneReceived = goneReceived;
     */
    this.onGoneReceived = null;
    
    /**
     * Enum for notification types.
     *
     * @name NotificationTypes
     * @property {string} LONGPOLLING Long polling type
     * @property {string} WEBSOCKET WebSocket type
     * @readonly
     * @memberOf fcs.notification
     */
    this.NotificationTypes = {
        LONGPOLLING: "longpolling",
        WEBSOCKET: "websocket"
    };
    
    /**
     * Boolean for anonymous users.
     * Used by rest requests to determine some parameters at URL and body).
     *
     * @name isAnonymous
     * @return isAnonymous true if the user is anonymous
     * @since 3.0.0
     * @memberOf fcs.notification
     */
    this.isAnonymous = function() {
        return _manager.isAnonymous();
    };
    
    /**
     * Unsubscribe from getting notifications
     *
     * @name fcs.notification.stop
     * @param {function} onSuccess Success callback
     * @param {function} onFailure Failure callback
     * @param {boolean} synchronous Determines if the operation is sync or async
     * @function
     * @since 3.0.0
     * @example
     * fcs.notification.stop(
     * //Success callback
     * function(){
     *     window.console.log("Notification system is stopped successfully!!")
     * },
     * //Failure callback
     * function(){
     *     window.console.log("Something Wrong Here!!!")
     * },
     * // synchronous
     * false
     * );
     */
    this.stop = function(onSuccess, onFailure, synchronous) {
        _manager.stop(onSuccess, onFailure, synchronous);
    };
    
    /**
     * Subscribe and fetch the notifications <BR />
     * NOTE: Before subscribing, you have to set handlers for received notification. Only handlers registered before starting the notification will receive events.
     * @name fcs.notification.start
     * @param {function} onSuccess Success callback
     * @param {function} onFailure Failure callback
     * @param {boolean} anonymous Is this an anonymous
     * @param {string} cachePrefix Prefix of the cache key to be used (this allows for multiple subscriptions)
     * @param {string} forceLogout Kills the session of the oldest device.(For more information : User Guide Demo Examples in Api Doc ) 
     * @function
     * 
     * @since 3.0.0
     * 
     * @example
     * 
     * //Sets up connection and notification types
     * fcs.setup({
     *        "restUrl": "&lt;rest_url&gt;",
     *        "restPort": "rest_port",
     *        "websocketIP": "&lt;websocket_ip&gt;",
     *        "websocketPort": "&lt;websocket_port&gt;",
     *        "notificationType": "websocket",
     *        "callAuditTimer": "30000",
     *        "clientControlled" : true,
     *        "protocol" : "http",
     *        "serverProvidedTurnCredentials": "false"
     *});
     * 
     * // Login
     * // User must login SPiDR to be able to receive and make calls
     * // Login includes authentication and subscription steps. After logging in you can receive notifications
     * // Provide username and password to the setUserAuth method
     * var incomingCall,outgoingCall;
     * fcs.setUserAuth("user@somedomain.com","password");
     * fcs.notification.start(function(){
     *       //Initialize media
     *       fcs.call.initMedia(function(){},function(){},{
     *                 "pluginLogLevel" : 2,
     *                 "videoContainer" : "",
     *                 "pluginMode" : "auto",
     *                 "iceserver" : [{"url":"stun:206.165.51.23:3478"}]
     *             });
     *       fcs.call.onReceived = function(call) {
     *       //Handle incoming notifications here (incomingCall, callEnd, etc.)
     *       //window.alert("incoming call");
     *       //call.onStateChange(state);
     *       //call.onStreamAdded(streamURL);
     *       incomingCall=call;
     *     }
     * },
     * function(){
     * window.console.log("Something Wrong Here!!!")
     * },
     * false,false,false
     * );
     * 
     */
    this.start = function(onSuccess, onFailure, anonymous, cachePrefix ,forceLogout) {
        _manager.start(onSuccess, onFailure, anonymous, cachePrefix ,forceLogout);
    };
    
    /**
     * Extending subscription and fetch the notifications
     *
     * @name fcs.notification.extend
     * @param {function} onSuccess Success callback
     * @param {function} onFailure Failure callback
     * @function
     */
    this.extend = function(onSuccess, onFailure) {
        _manager.extend(onSuccess, onFailure);
    };
    
    /**
     * Sets the notification error handler.
     *
     * @name fcs.notification.setOnError
     * @param {function(error)} callback The failure callback to be called.
     * @function
     * @since 3.0.0
     */
    this.setOnError = function(callback) {
        _manager.setOnError(callback);
    };

    /**
     * Sets the notification success handler.
     *
     * @name fcs.notification.setOnSuccess
     * @param {function} callback The success callback to be called.
     * @function
     * @since 3.0.0
     */
    this.setOnSuccess = function(callback) {
        _manager.setOnSuccess(callback);
    };

    /**
     * Sets the connection lost handler.
     *
     * @name fcs.notification.setOnConnectionLost
     * @function
     * @since 3.0.0
     */
    this.setOnConnectionLost = function(callback) {
        _manager.setOnConnectionLost(callback);
    };
    
    /**
     * Sets the connection established handler.
     *
     * @name fcs.notification.setOnConnectionEstablished
     * @function
     * @since 3.0.0
     */
    this.setOnConnectionEstablished = function(callback) {
        _manager.setOnConnectionEstablished(callback);
    };
    
    /**
     * Will be used by external triggers to fetch notifications.
     *
     * @name fcs.notification.trigger
     * @function
     * @since 3.0.0
     * @example
     *
     * fcs.notification.start();
     *
     * //Native code received SNMP Trigger so retrieve the notification
     *
     * fcs.notification.trigger();
     *
     */
    this.trigger = function() {
        _manager.trigger();
    };
};

var Notification = function(_manager) {
    return new NotificationImpl(_manager || notificationManager);
};

fcs.notification = new Notification(notificationManager);
/* 
 * Finite State machine that defines state transition of basic call model.
 * State machine fires events during state transitions. 
 * Components should register to FSM  in order to receive transition events 
 * 
 */

var CallFSMImpl = function(_logManager) {
    
    this.CallFSMState = {
        INIT: "INIT",
        RINGING: "RINGING",
        TRYING: "TRYING",
        ANSWERING : "ANSWERING",
        COMPLETED: "COMPLETED",
        RINGING_SLOW: "RINGING_SLOW",
        LOCAL_HOLD: "LOCAL_HOLD",
        LOCAL_HOLDING: "LOCAL_HOLDING",
        LOCAL_UNHOLDING: "LOCAL_UNHOLDING",
        LOCAL_VIDEO_STOP_START: "LOCAL_VIDEO_STOP_START",
        REMOTE_OFFER: "REMOTE_OFFER",
        REMOTE_HOLD: "REMOTE_HOLD",
        REMOTE_HOLDING: "REMOTE_HOLDING",
        REMOTE_UNHOLDING: "REMOTE_UNHOLDING",
        BOTH_HOLD: "BOTH_HOLD",
        JOINING: "JOINING",
        PROVISIONRECEIVED: "PROVISIONRECEIVED",
        REFER: "REFER",
        TRANSFERING: "TRANSFERING",
        LOCAL_SLOW_START_OFFER: "LOCAL_SLOW_START_OFFER",
        LOCAL_REOFFER: "LOCAL_REOFFER"
    };
    
    //CallFSM returns TransferEvent after state change
    this.TransferEvent = {
        unknownNotification_fsm: "unknownNotification_fsm",
        ignoredNotification_fsm: "ignoredNotification_fsm",
        callStart_fsm: "callStart_fsm",
        callReceived_fsm: "callReceived_fsm",
        answer_fsm: "answer_fsm",
        reject_GUI: "reject_GUI",
        callCompleted_fsm: "callCompleted_fsm",
        noAnswer_fsm: "noAnswer_fsm",
        localEnd_fsm: "localEnd_fsm",
        remoteEnd_fsm: "remoteEnd_fsm",
        answeringRingingSlow_fsm: "answeringRingingSlow_fsm",
        callCompletedAnswering_fsm: "callCompletedAnswering_fsm",
        localHold_fsm: "localHold_fsm",
        localHolding_fsm: "localHolding_fsm",
        remoteHold_fsm: "remoteHold_fsm",
        remoteHolding_fsm: "remoteHolding_fsm",
        localUnHold_fsm: "localUnHold_fsm",
        localUnHolding_fsm: "localUnHolding_fsm",
        remoteUnHold_fsm: "remoteUnHold_fsm",
        remoteUnHolding_fsm: "remoteUnHolding_fsm",
        localVideoStopStart_fsm: "localVideoStopStart_fsm",
        remoteOffer_fsm: "remoteOffer_fsm",
        joining_fsm: "joining_fsm",
        sessionComplete_fsm: "sessionComplete_fsm",
        joiningSuccess_fsm: "joiningSuccess_fsm",
        sessionFail_fsm: "sessionFail_fsm",
        ringing_fsm: "ringing_fsm",
        respondCallUpdate_fsm: "respondCallUpdate_fsm",
        remoteCallUpdate_fsm: "remoteCallUpdate_fsm",
        preCallResponse_fsm: "preCallResponse_fsm",
        forward_fsm: "forward_fsm",
        refer_fsm: "refer_fsm",
        accepted_fsm: "accepted_fsm",
        transfering_fsm: "transfering_fsm",
        transferSuccess_fsm: "transferSuccess_fsm",
        transferFail_fsm: "transferFail_fsm",
        respondCallHoldUpdate_fsm: "respondCallHoldUpdate_fsm",
        remoteOfferDuringLocalHold_fsm: "remoteOfferDuringHold_fsm",
        renegotiationCompleted_fsm: "renegotiationCompleted_fsm",
        slowStartOfferDuringRemoteHold_fsm : "slowStartOfferDuringRemoteHold_fsm",
        slowStartOfferDuringOnCall_fsm: "slowStartOfferDuringOnCall_fsm",
        stateReverted_fsm: "stateReverted_fsm",
        glareCondition_fsm: "glareCondition_fsm",
        slowStartOfferProcessed_fsm : "slowStartOfferProcessed_fsm",
        performReconnectWorkaround_fsm: "performReconnectWorkaround_fsm"
    };
    
    //CallFSM receives NotificationEvent
    this.NotificationEvent = {
        callStart_GUI: "callStart_GUI",
        callNotify: "callNotify",
        ringing_Notify: "ringing_Notify",
        answer_GUI: "answer_GUI",
        end_GUI: "end_GUI",
        respondCallUpdate_Notify: "respondCallUpdate_Notify",
        respondCallUpdate_glareCondition_Notify: "respondCallUpdate_glareCondition_Notify",
        callCompleted_fsm: "callCompleted_fsm",
        callEnd_Notify: "callEnd_Notify",
        callNotify_noSDP: "callNotify_noSDP",
        startCallUpdate_slowStart_Notify: "startCallUpdate_slowStart_Notify",
        startCallUpdate_remoteHold_Notify: "startCallUpdate_remoteHold_Notify",
        startCallUpdate_remoteOffer_Notify: "startCallUpdate_remoteOffer_Notify",
        joining_Notify: "joining_Notify",
        sessionComplete_Notify: "sessionComplete_Notify",
        joiningSuccess_Notify: "joiningSuccess_Notify",
        sessionFail_Notify: "sessionFail_Notify",
        hold_GUI: "hold_GUI",
        unhold_GUI: "unhold_GUI",
        videoStopStart_GUI: "videoStopStart_GUI",
        sessionProgress: "sessionProgress",
        callCancel_Notify: "callCancel_Notify",
        forward_GUI: "forward_GUI",
        refer_JSL: "refer_JSL",
        accepted_Notify: "accepted_Notify",
        transfering: "transfering",
        requestFailure_JSL: "requestFailure_JSL",
        webrtcFailure_JSL: "webrtcFailure_JSL",
        remoteOfferProcessed_JSL: "remoteOfferProcessed_JSL",
        remoteHoldProcessed_JSL: "remoteHoldProcessed_JSL",
        remoteUnHoldProcessed_JSL: "remoteUnHoldProcessed_JSL",
        slowStartOfferProcessed_JSL: "slowStartOfferProcessed_JSL",
        performReconnectWorkaround_JSL: "performReconnectWorkaround_JSL"
    };
    var self = this, logger = _logManager.getLogger("callFsm");
    
    function FSM (call, event, onSuccess, onFailure) {
        //TODO move sessionProgress somewhere else?
        var sessionProgress = "sessionProgress", 
                callState = self.getCurrentState(call);
        switch (callState) {
            case self.CallFSMState.INIT:
                switch (event) {
                    case self.NotificationEvent.callStart_GUI:
                        call.currentState = self.CallFSMState.TRYING;
                        onSuccess(call, self.TransferEvent.callStart_fsm);
                        break;
                    case self.NotificationEvent.callNotify:
                        call.currentState = self.CallFSMState.RINGING;
                        onSuccess(call, self.TransferEvent.callReceived_fsm);
                        break;
                    case self.NotificationEvent.callNotify_noSDP:
                        call.currentState = self.CallFSMState.RINGING_SLOW;
                        onSuccess(call, self.TransferEvent.callReceived_fsm);
                        break;
                    case self.NotificationEvent.joiningSuccess_Notify:
                        call.currentState = self.CallFSMState.PROVISIONRECEIVED;
                        onSuccess(call, self.TransferEvent.joiningSuccess_fsm);
                        break;
                    default:
                        onFailure(call, self.TransferEvent.unknownNotification_fsm);
                        break;     
                }
                break;
            case self.CallFSMState.RINGING:
                switch (event) {
                    case self.NotificationEvent.answer_GUI:
                        call.currentState = self.CallFSMState.COMPLETED;
                        onSuccess(call, self.TransferEvent.answer_fsm);
                        break;
                    case self.NotificationEvent.end_GUI:
                        call.currentState = self.CallFSMState.INIT;
                        onSuccess(call, self.TransferEvent.reject_GUI);
                        break;
                    case self.NotificationEvent.callNotify_noSDP:
                        call.currentState = self.CallFSMState.RINGING_SLOW;
                        onSuccess(call, self.TransferEvent.callReceived_fsm);
                        break;
                    case self.NotificationEvent.callEnd_Notify:
                    case self.NotificationEvent.callCancel_Notify:
                        call.currentState = self.CallFSMState.INIT;
                        onSuccess(call, self.TransferEvent.remoteEnd_fsm);
                        break;
                    case self.NotificationEvent.forward_GUI:
                        call.currentState = self.CallFSMState.INIT;
                        onSuccess(call, self.TransferEvent.forward_fsm);
                        break;                        
                    default:
                        onFailure(call, self.TransferEvent.unknownNotification_fsm);
                        break;      
                }
                break;
            case self.CallFSMState.RINGING_SLOW:
                switch (event) {
                    case self.NotificationEvent.answer_GUI:
                        call.currentState = self.CallFSMState.ANSWERING;
                        onSuccess(call, self.TransferEvent.answerRingingSlow_fsm);
                        break;
                    case self.NotificationEvent.end_GUI:
                        call.currentState = self.CallFSMState.INIT;
                        onSuccess(call, self.TransferEvent.reject_GUI);
                        break;
                    case self.NotificationEvent.callEnd_Notify:
                    case self.NotificationEvent.callCancel_Notify:
                        call.currentState = self.CallFSMState.INIT;
                        onSuccess(call, self.TransferEvent.remoteEnd_fsm);
                        break;
                    case self.NotificationEvent.forward_GUI:
                        call.currentState = self.CallFSMState.INIT;
                        onSuccess(call, self.TransferEvent.forward_fsm);
                        break;        
                    default:
                        onFailure(call, self.TransferEvent.unknownNotification_fsm);
                        break; 
                }
                break;
            case self.CallFSMState.ANSWERING:
                switch (event) {
                    case self.NotificationEvent.respondCallUpdate_Notify:
                        call.currentState = self.CallFSMState.COMPLETED;
                        onSuccess(call, self.TransferEvent.callCompletedAnswering_fsm);
                        break;
                    case self.NotificationEvent.end_GUI:
                        call.currentState = self.CallFSMState.INIT;
                        onSuccess(call, self.TransferEvent.localEnd_fsm);
                        break;
                    case self.NotificationEvent.callEnd_Notify:
                        call.currentState = self.CallFSMState.INIT;
                        onSuccess(call, self.TransferEvent.remoteEnd_fsm);
                        break;
                    default:
                        onFailure(call, self.TransferEvent.unknownNotification_fsm);
                        break; 
                }
                break;
            case self.CallFSMState.TRYING:
                switch (event) {
                    case self.NotificationEvent.sessionProgress:
                    case sessionProgress:
                        call.currentState = self.CallFSMState.PROVISIONRECEIVED;
                        onSuccess(call, self.TransferEvent.preCallResponse_fsm);
                        break;
                    case self.NotificationEvent.ringing_Notify:
                        call.currentState = self.CallFSMState.PROVISIONRECEIVED;
                        onSuccess(call, self.TransferEvent.ringing_fsm);
                        break;
                    case self.NotificationEvent.end_GUI:
                        call.currentState = self.CallFSMState.INIT;
                        onSuccess(call, self.TransferEvent.localEnd_fsm);
                        break;
                    case self.NotificationEvent.callEnd_Notify:
                        call.currentState = self.CallFSMState.INIT;
                        onSuccess(call, self.TransferEvent.noAnswer_fsm);
                        break;
                    case self.NotificationEvent.respondCallUpdate_Notify:
                        call.currentState = self.CallFSMState.COMPLETED;
                        onSuccess(call, self.TransferEvent.callCompleted_fsm);
                        break;
                    default:
                        onFailure(call, self.TransferEvent.unknownNotification_fsm);
                        break;                            
                }
                break;
            case self.CallFSMState.PROVISIONRECEIVED:
                switch (event) {
                    case self.NotificationEvent.respondCallUpdate_Notify:
                        call.currentState = self.CallFSMState.COMPLETED;
                        onSuccess(call, self.TransferEvent.callCompleted_fsm);
                        break;
                    case self.NotificationEvent.end_GUI:
                        call.currentState = self.CallFSMState.INIT;
                        onSuccess(call, self.TransferEvent.localEnd_fsm);
                        break;
                    case self.NotificationEvent.callEnd_Notify:
                        call.currentState = self.CallFSMState.INIT;
                        onSuccess(call, self.TransferEvent.remoteEnd_fsm);
                        break;                        
                    case self.NotificationEvent.ringing_Notify:
                        onSuccess(call, self.TransferEvent.ringing_fsm);
                        break;
                    case self.NotificationEvent.sessionProgress:
                    case sessionProgress:
                        onSuccess(call, self.TransferEvent.preCallResponse_fsm);
                        break;                        
                    default:
                        onFailure(call, self.TransferEvent.unknownNotification_fsm);
                        break;
                }
                break;
            case self.CallFSMState.COMPLETED:
                switch (event) {
                    case self.NotificationEvent.end_GUI:
                        call.currentState = self.CallFSMState.INIT;
                        onSuccess(call, self.TransferEvent.localEnd_fsm);
                        break;
                    case self.NotificationEvent.callEnd_Notify:
                        call.currentState = self.CallFSMState.INIT;
                        onSuccess(call, self.TransferEvent.remoteEnd_fsm);
                        break;
                    case self.NotificationEvent.startCallUpdate_remoteHold_Notify:
                        call.previousState = call.currentState;
                        call.currentState=self.CallFSMState.REMOTE_HOLDING;
                        onSuccess(call,self.TransferEvent.remoteHolding_fsm);
                        break;
                    case self.NotificationEvent.startCallUpdate_slowStart_Notify:
                        call.previousState = call.currentState;
                        call.currentState=self.CallFSMState.LOCAL_SLOW_START_OFFER;
                        onSuccess(call,self.TransferEvent.slowStartOfferDuringOnCall_fsm);    
                        break;
                    case self.NotificationEvent.hold_GUI:
                        call.previousState = call.currentState;
                        call.currentState=self.CallFSMState.LOCAL_HOLDING;
                        onSuccess(call,self.TransferEvent.localHolding_fsm);
                        break;
                    case self.NotificationEvent.videoStopStart_GUI:
                        call.previousState = call.currentState;
                        call.currentState=self.CallFSMState.LOCAL_VIDEO_STOP_START;
                        onSuccess(call,self.TransferEvent.localVideoStopStart_fsm);
                        break;
                    case self.NotificationEvent.startCallUpdate_remoteOffer_Notify:
                        call.previousState = call.currentState;
                        call.currentState=self.CallFSMState.REMOTE_OFFER;
                        onSuccess(call,self.TransferEvent.remoteOffer_fsm);
                        break;
                    case self.NotificationEvent.transfering:
                        call.previousState = call.currentState;
                        call.currentState = self.CallFSMState.TRANSFERING;
                        onSuccess(call, self.TransferEvent.transfering_fsm);
                        break;
                    case self.NotificationEvent.callCancel_Notify:
                        onSuccess(call, self.TransferEvent.ignoredNotification_fsm);
                        break;
                    case self.NotificationEvent.performReconnectWorkaround_JSL:
                        call.previousState = call.currentState;
                        call.currentState=self.CallFSMState.LOCAL_REOFFER;
                        onSuccess(call,self.TransferEvent.performReconnectWorkaround_fsm);
                        break;
                    default:
                        onFailure(call, self.TransferEvent.unknownNotification_fsm);
                        break;
                }
                break;
            case self.CallFSMState.LOCAL_REOFFER:
                switch (event) {
                    case self.NotificationEvent.end_GUI:
                        call.currentState = self.CallFSMState.INIT;
                        onSuccess(call, self.TransferEvent.localEnd_fsm);
                        break;
                    case self.NotificationEvent.callEnd_Notify:
                        call.currentState = self.CallFSMState.INIT;
                        onSuccess(call, self.TransferEvent.remoteEnd_fsm);
                        break;
                    case self.NotificationEvent.respondCallUpdate_Notify:
                        call.currentState=call.previousState;
                        onSuccess(call,self.TransferEvent.respondCallUpdate_fsm);
                        break;
                    case self.NotificationEvent.webrtcFailure_JSL:
                    case self.NotificationEvent.requestFailure_JSL:
                        call.currentState=call.previousState;
                        onSuccess(call, self.TransferEvent.stateReverted_fsm);
                        break;
                    default:
                        onFailure(call, self.TransferEvent.unknownNotification_fsm);
                        break;
                }
                break;
            case self.CallFSMState.REMOTE_OFFER:
                switch (event) {
                    case self.NotificationEvent.end_GUI:
                        call.currentState = self.CallFSMState.INIT;
                        onSuccess(call, self.TransferEvent.localEnd_fsm);
                        break;
                    case self.NotificationEvent.callEnd_Notify:
                        call.currentState = self.CallFSMState.INIT;
                        onSuccess(call, self.TransferEvent.remoteEnd_fsm);
                        break;
                    case self.NotificationEvent.remoteOfferProcessed_JSL:
                        call.currentState=call.previousState;
                        onSuccess(call,self.TransferEvent.renegotiationCompleted_fsm);
                        break;
                    case self.NotificationEvent.requestFailure_JSL:
                    case self.NotificationEvent.webrtcFailure_JSL:
                        call.currentState=call.previousState;
                        onSuccess(call, self.TransferEvent.stateReverted_fsm);
                        break;
                    default:
                        onFailure(call, self.TransferEvent.unknownNotification_fsm);
                        break;
                }
                break;
            case self.CallFSMState.LOCAL_VIDEO_STOP_START:
                switch (event) {
                    case self.NotificationEvent.end_GUI:
                        call.currentState = self.CallFSMState.INIT;
                        onSuccess(call, self.TransferEvent.localEnd_fsm);
                        break;
                    case self.NotificationEvent.callEnd_Notify:
                        call.currentState = self.CallFSMState.INIT;
                        onSuccess(call, self.TransferEvent.remoteEnd_fsm);
                        break;
                    case self.NotificationEvent.respondCallUpdate_Notify:
                        call.currentState=call.previousState;
                        onSuccess(call,self.TransferEvent.respondCallUpdate_fsm);
                        break;
                    case self.NotificationEvent.requestFailure_JSL:
                    case self.NotificationEvent.webrtcFailure_JSL:
                        call.currentState=call.previousState;
                        onSuccess(call, self.TransferEvent.stateReverted_fsm);
                        break;
                    case self.NotificationEvent.respondCallUpdate_glareCondition_Notify:
                        call.currentState=call.previousState;
                        onSuccess(call, self.TransferEvent.glareCondition_fsm);
                       break;
                    default:
                        onFailure(call, self.TransferEvent.unknownNotification_fsm);
                        break;
                }
                break;
            case self.CallFSMState.LOCAL_HOLDING:
                switch (event) {
                    case self.NotificationEvent.end_GUI:
                        call.currentState = self.CallFSMState.INIT;
                        onSuccess(call, self.TransferEvent.localEnd_fsm);
                        break;
                    case self.NotificationEvent.callEnd_Notify:
                        call.currentState = self.CallFSMState.INIT;
                        onSuccess(call, self.TransferEvent.remoteEnd_fsm);
                        break;
                    case self.NotificationEvent.respondCallUpdate_Notify:
                        call.currentState = self.CallFSMState.LOCAL_HOLD;
                        if (call.previousState === self.CallFSMState.REMOTE_HOLD) {
                            call.currentState=self.CallFSMState.BOTH_HOLD;
                        }
                        call.previousState = callState;
                        onSuccess(call,self.TransferEvent.respondCallHoldUpdate_fsm);
                        break;
                    case self.NotificationEvent.requestFailure_JSL:
                    case self.NotificationEvent.webrtcFailure_JSL:
                        call.currentState=call.previousState;
                        onSuccess(call, self.TransferEvent.stateReverted_fsm);
                        break;
                    case self.NotificationEvent.respondCallUpdate_glareCondition_Notify:
                        call.currentState=call.previousState;
                        onSuccess(call, self.TransferEvent.glareCondition_fsm);
                       break;
                    default:
                        onFailure(call, self.TransferEvent.unknownNotification_fsm);
                        break;
                }
                break;
            case self.CallFSMState.LOCAL_UNHOLDING:
                switch (event) {
                    case self.NotificationEvent.end_GUI:
                        call.currentState = self.CallFSMState.INIT;
                        onSuccess(call, self.TransferEvent.localEnd_fsm);
                        break;
                    case self.NotificationEvent.callEnd_Notify:
                        call.currentState = self.CallFSMState.INIT;
                        onSuccess(call, self.TransferEvent.remoteEnd_fsm);
                        break;
                    case self.NotificationEvent.respondCallUpdate_Notify:
                        call.currentState = self.CallFSMState.COMPLETED;
                        if (call.previousState === self.CallFSMState.BOTH_HOLD) {
                            call.currentState=self.CallFSMState.REMOTE_HOLD;
                        }
                        call.previousState = callState;
                        onSuccess(call,self.TransferEvent.respondCallHoldUpdate_fsm);
                        break;
                    case self.NotificationEvent.requestFailure_JSL:
                    case self.NotificationEvent.webrtcFailure_JSL:
                        call.currentState=call.previousState;
                        onSuccess(call, self.TransferEvent.stateReverted_fsm);
                        break;
                    case self.NotificationEvent.respondCallUpdate_glareCondition_Notify:
                        call.currentState=call.previousState;
                        onSuccess(call, self.TransferEvent.glareCondition_fsm);
                       break;
                    default:
                        onFailure(call, self.TransferEvent.unknownNotification_fsm);
                        break;
                }
                break;
            case self.CallFSMState.LOCAL_HOLD:
                switch (event) {
                    case self.NotificationEvent.end_GUI:
                        call.currentState = self.CallFSMState.INIT;
                        onSuccess(call, self.TransferEvent.localEnd_fsm);
                        break;
                    case self.NotificationEvent.callEnd_Notify:
                        call.currentState = self.CallFSMState.INIT;
                        onSuccess(call, self.TransferEvent.remoteEnd_fsm);
                        break;
                    case self.NotificationEvent.startCallUpdate_remoteHold_Notify:
                        call.previousState = call.currentState;
                        call.currentState = self.CallFSMState.REMOTE_HOLDING;
                        onSuccess(call, self.TransferEvent.remoteHolding_fsm);
                        break;
                    case self.NotificationEvent.startCallUpdate_remoteOffer_Notify:
                        onSuccess(call, self.TransferEvent.remoteOfferDuringLocalHold_fsm);
                        break;
                    case self.NotificationEvent.unhold_GUI:
                        call.previousState = call.currentState;
                        call.currentState=self.CallFSMState.LOCAL_UNHOLDING;
                        onSuccess(call,self.TransferEvent.localUnHolding_fsm);
                        break;
                    case self.NotificationEvent.joining_Notify:
                        call.previousState = call.currentState;
                        call.currentState=self.CallFSMState.JOINING;
                        onSuccess(call,self.TransferEvent.joining_fsm);
                        break;
                    case self.NotificationEvent.transfering:
                        call.previousState = call.currentState;
                        call.currentState = self.CallFSMState.TRANSFERING;
                        onSuccess(call, self.TransferEvent.transfering_fsm);
                        break;
                    case self.NotificationEvent.performReconnectWorkaround_JSL:
                        call.previousState = call.currentState;
                        call.currentState=self.CallFSMState.LOCAL_REOFFER;
                        onSuccess(call,self.TransferEvent.performReconnectWorkaround_fsm);
                        break;
                    default:
                        onFailure(call, self.TransferEvent.unknownNotification_fsm);
                        break;
                }
                break;
            case self.CallFSMState.REMOTE_HOLDING:
                switch (event) {
                    case self.NotificationEvent.end_GUI:
                        call.currentState = self.CallFSMState.INIT;
                        onSuccess(call, self.TransferEvent.localEnd_fsm);
                        break;
                    case self.NotificationEvent.callEnd_Notify:
                        call.currentState = self.CallFSMState.INIT;
                        onSuccess(call, self.TransferEvent.remoteEnd_fsm);
                        break;
                    case self.NotificationEvent.remoteHoldProcessed_JSL:
                        call.currentState = self.CallFSMState.REMOTE_HOLD;
                        if (call.previousState === self.CallFSMState.LOCAL_HOLD) {
                            call.currentState=self.CallFSMState.BOTH_HOLD;
                        }
                        call.previousState = callState;
                        onSuccess(call,self.TransferEvent.remoteHold_fsm);
                        break;
                    case self.NotificationEvent.requestFailure_JSL:
                    case self.NotificationEvent.webrtcFailure_JSL:
                        call.currentState=call.previousState;
                        onSuccess(call, self.TransferEvent.stateReverted_fsm);
                        break;
                    default:
                        onFailure(call, self.TransferEvent.unknownNotification_fsm);
                        break;
                }
                break;
            case self.CallFSMState.REMOTE_UNHOLDING:
                switch (event) {
                    case self.NotificationEvent.end_GUI:
                        call.currentState = self.CallFSMState.INIT;
                        onSuccess(call, self.TransferEvent.localEnd_fsm);
                        break;
                    case self.NotificationEvent.callEnd_Notify:
                        call.currentState = self.CallFSMState.INIT;
                        onSuccess(call, self.TransferEvent.remoteEnd_fsm);
                        break;
                    case self.NotificationEvent.remoteUnHoldProcessed_JSL:
                        call.currentState = self.CallFSMState.COMPLETED;
                        if (call.previousState === self.CallFSMState.BOTH_HOLD) {
                            call.currentState=self.CallFSMState.LOCAL_HOLD;
                        }
                        call.previousState = callState;
                        onSuccess(call,self.TransferEvent.remoteUnHold_fsm);
                        break;
                    case self.NotificationEvent.requestFailure_JSL:
                    case self.NotificationEvent.webrtcFailure_JSL:
                        call.currentState=call.previousState;
                        onSuccess(call, self.TransferEvent.stateReverted_fsm);
                        break;
                    default:
                        onFailure(call, self.TransferEvent.unknownNotification_fsm);
                        break;
                }
                break;
            case self.CallFSMState.REMOTE_HOLD:
                switch (event) {
                    case self.NotificationEvent.end_GUI:
                        call.currentState = self.CallFSMState.INIT;
                        onSuccess(call, self.TransferEvent.localEnd_fsm);
                        break;
                    case self.NotificationEvent.callEnd_Notify:
                        call.currentState = self.CallFSMState.INIT;
                        onSuccess(call, self.TransferEvent.remoteEnd_fsm);
                        break;
                    case self.NotificationEvent.startCallUpdate_remoteHold_Notify:
                        call.previousState = call.currentState;
                        call.currentState = self.CallFSMState.REMOTE_HOLDING;
                        onSuccess(call, self.TransferEvent.remoteHolding_fsm);
                        break;
                    case self.NotificationEvent.startCallUpdate_remoteOffer_Notify:
                        call.previousState = call.currentState;
                        call.currentState = self.CallFSMState.REMOTE_UNHOLDING;
                        onSuccess(call, self.TransferEvent.remoteUnHolding_fsm);
                        break;
                    case self.NotificationEvent.startCallUpdate_slowStart_Notify:
                        call.previousState = call.currentState;
                        call.currentState=self.CallFSMState.LOCAL_SLOW_START_OFFER;
                        onSuccess(call,self.TransferEvent.slowStartOfferDuringRemoteHold_fsm);    
                        break;
                    case self.NotificationEvent.hold_GUI:
                        call.previousState = call.currentState;
                        call.currentState=self.CallFSMState.LOCAL_HOLDING;
                        onSuccess(call,self.TransferEvent.localHolding_fsm);
                        break;
                    case self.NotificationEvent.joining_Notify:
                        call.previousState = call.currentState;
                        call.currentState=self.CallFSMState.JOINING;
                        onSuccess(call,self.TransferEvent.joining_fsm);
                        break;
                    case self.NotificationEvent.performReconnectWorkaround_JSL:
                        call.previousState = call.currentState;
                        call.currentState=self.CallFSMState.LOCAL_REOFFER;
                        onSuccess(call,self.TransferEvent.performReconnectWorkaround_fsm);
                        break;
                    default:
                        onFailure(call, self.TransferEvent.unknownNotification_fsm);
                        break;   
                }
                break;
            case self.CallFSMState.BOTH_HOLD:
                switch (event) {
                    case self.NotificationEvent.end_GUI:
                        call.currentState = self.CallFSMState.INIT;
                        onSuccess(call, self.TransferEvent.localEnd_fsm);
                        break;
                    case self.NotificationEvent.callEnd_Notify:
                        call.currentState = self.CallFSMState.INIT;
                        onSuccess(call, self.TransferEvent.remoteEnd_fsm);
                        break;
                    case self.NotificationEvent.startCallUpdate_remoteHold_Notify:
                    case self.NotificationEvent.startCallUpdate_remoteOffer_Notify:
                        call.previousState = call.currentState;
                        call.currentState = self.CallFSMState.REMOTE_UNHOLDING;
                        onSuccess(call, self.TransferEvent.remoteUnHolding_fsm);
                        break;
                    case self.NotificationEvent.unhold_GUI:
                        call.previousState = call.currentState;
                        call.currentState=self.CallFSMState.LOCAL_UNHOLDING;
                        onSuccess(call,self.TransferEvent.localUnHolding_fsm);
                        break;
                    case self.NotificationEvent.joining_Notify:
                        call.previousState = call.currentState;
                        call.currentState=self.CallFSMState.JOINING;
                        onSuccess(call,self.TransferEvent.joining_fsm);
                        break;
                    case self.NotificationEvent.transfering:
                        call.previousState = call.currentState;
                        call.currentState = self.CallFSMState.TRANSFERING;
                        onSuccess(call, self.TransferEvent.transfering_fsm);
                        break;
                    case self.NotificationEvent.performReconnectWorkaround_JSL:
                        call.previousState = call.currentState;
                        call.currentState=self.CallFSMState.LOCAL_REOFFER;
                        onSuccess(call,self.TransferEvent.performReconnectWorkaround_fsm);
                        break;
                    default:
                        onFailure(call, self.TransferEvent.unknownNotification_fsm);
                        break;  
                }
                break;
            case self.CallFSMState.LOCAL_SLOW_START_OFFER:
                switch (event) {
                    case self.NotificationEvent.end_GUI:
                        call.currentState = self.CallFSMState.INIT;
                        onSuccess(call, self.TransferEvent.localEnd_fsm);
                        break;
                    case self.NotificationEvent.callEnd_Notify:
                        call.currentState = self.CallFSMState.INIT;
                        onSuccess(call, self.TransferEvent.remoteEnd_fsm);
                        break;
                    case self.NotificationEvent.respondCallUpdate_Notify:
                        call.previousState = call.currentState;
                        call.currentState=self.CallFSMState.COMPLETED;
                        onSuccess(call,self.TransferEvent.respondCallUpdate_fsm);
                        break;
                    case self.NotificationEvent.requestFailure_JSL:
                    case self.NotificationEvent.webrtcFailure_JSL:
                        call.currentState=call.previousState;
                        onSuccess(call, self.TransferEvent.stateReverted_fsm);
                        break;
                    case self.NotificationEvent.slowStartOfferProcessed_JSL:
                        onSuccess(call, self.TransferEvent.slowStartOfferProcessed_fsm);
                    break;
                    default:
                        onFailure(call, self.TransferEvent.unknownNotification_fsm);
                        break;
                }
                break;
            case self.CallFSMState.JOINING:
                switch (event) {
                    case self.NotificationEvent.end_GUI:
                        call.currentState = self.CallFSMState.INIT;
                        onSuccess(call, self.TransferEvent.localEnd_fsm);
                        break;
                    case self.NotificationEvent.callEnd_Notify:
                        call.currentState = self.CallFSMState.INIT;
                        onSuccess(call, self.TransferEvent.remoteEnd_fsm);
                        break;
                    case self.NotificationEvent.sessionComplete_Notify:
                        call.currentState = self.CallFSMState.INIT;
                        onSuccess(call, self.TransferEvent.sessionComplete_fsm);
                        break;
                    case self.NotificationEvent.sessionFail_Notify:
                        call.currentState = call.previousState;
                        onSuccess(call, self.TransferEvent.sessionFail_fsm);
                        break;
                    case self.NotificationEvent.refer_JSL:
                        call.currentState = self.CallFSMState.REFER;
                        onSuccess(call, self.TransferEvent.refer_fsm);
                        break;
                    default:
                        onFailure(call, self.TransferEvent.unknownNotification_fsm);
                        break;       
                }
                break;
            case self.CallFSMState.REFER:
                switch (event) {
                    case self.NotificationEvent.end_GUI:
                        call.currentState = self.CallFSMState.INIT;
                        onSuccess(call, self.TransferEvent.localEnd_fsm);
                        break;
                    case self.NotificationEvent.callEnd_Notify:
                        call.currentState = self.CallFSMState.INIT;
                        onSuccess(call, self.TransferEvent.remoteEnd_fsm);
                        break;   
                    case self.NotificationEvent.sessionComplete_Notify:
                        call.currentState = self.CallFSMState.INIT;
                        onSuccess(call, self.TransferEvent.sessionComplete_fsm);
                        break;
                    case self.NotificationEvent.sessionFail_Notify:
                        call.currentState = call.previousState;
                        onSuccess(call, self.TransferEvent.sessionFail_fsm);
                        break;  
                    //TODO Tolga - talk with lale
                    case self.NotificationEvent.accepted_Notify:
                        onSuccess(call, self.TransferEvent.accepted_fsm);                        
                        break; 
                    default:
                        onFailure(call, self.TransferEvent.unknownNotification_fsm);
                        break;       
                }
                break;
           case self.CallFSMState.TRANSFERING:
                switch (event) {
                    case self.NotificationEvent.end_GUI:
                        call.currentState = self.CallFSMState.INIT;
                        onSuccess(call, self.TransferEvent.localEnd_fsm);
                        break;
                    case self.NotificationEvent.callEnd_Notify:
                        call.currentState = self.CallFSMState.INIT;
                        onSuccess(call, self.TransferEvent.remoteEnd_fsm);
                        break;   
                    case self.NotificationEvent.sessionComplete_Notify:
                        call.currentState = self.CallFSMState.INIT;
                        onSuccess(call, self.TransferEvent.transferSuccess_fsm);
                        break;
                    case self.NotificationEvent.sessionFail_Notify:
                        call.currentState = call.previousState;
                        onSuccess(call, self.TransferEvent.transferFail_fsm);
                        break;  
                        //TODO this notification is consumed for now - it is there for completeness
                    case self.NotificationEvent.accepted_Notify:
                        onSuccess(call, self.TransferEvent.accepted_fsm);
                        break;
                    case self.NotificationEvent.startCallUpdate_slowStart_Notify:
                    case self.NotificationEvent.startCallUpdate_remoteHold_Notify:
                    case self.NotificationEvent.startCallUpdate_remoteOffer_Notify:
                        // Some client send hold during transfer
                        onSuccess(call, self.TransferEvent.remoteCallUpdate_fsm);
                        break;
                    default:
                        onFailure(call, self.TransferEvent.unknownNotification_fsm);
                        break;       
                }
                break;
        }
    }

    self.getCurrentState = function(call){
        return (call.currentState ? call.currentState : self.CallFSMState.INIT);
    };

    this.handleEvent = function(call, event, handler) {
        var initialCallState;
        if (call) {
            initialCallState = self.getCurrentState(call);
            logger.info("FSM received NotificationEvent: " + event + " @ " +
                    initialCallState + " state" + ". Call Id: " + call.id);

            FSM(call, event,
                function(call, transferEvent) {
                    logger.debug("FSM handleEvent successful. (Call FSM) State Passed from " +
                            initialCallState + " to " +
                            self.getCurrentState(call) + ". TransferEvent: " +
                            transferEvent + ". Call Id: " + call.id);
                    handler(call, transferEvent);
                },
                function(call, transferEvent) {
                    logger.error("FSM handleEvent failure: " + transferEvent +
                            " @ " + self.getCurrentState(call) + ". Call Id: " +
                            call.id);
                    handler(call, transferEvent);
                });
        }
    };
};

var CallFSM = function(_logManager) {
    return new CallFSMImpl(_logManager || logManager);
};

var callFSM = new CallFSM();

if (__testonly__) { __testonly__.CallFSM = CallFSM; }

var CallControlServiceImpl = function(_server, _logManager, _cache) {

    var logger = _logManager.getLogger("callControlService");

    function addNotificationChannel(data){
        if(fcs.notification.isAnonymous() && _cache.getItem("NotificationId")) {
            data.callMeRequest.notifyChannelId = _cache.getItem("NotificationId");
        }
    }
    
    function errorParser(jqXHR){
        if (jqXHR && jqXHR.responseText) {
            return JSON.parse(jqXHR.responseText).callControlResponse;
        }
    }

    this.startCall = function(from, to, sdp, onSuccess, onFailure) {

        logger.info("Call Start Function: " + from + " --> " + to);
        logger.info("Call Start Function: sdp : " + sdp);

        // response of the startCall contains callid/sessionData
        // callMe and callControl returns same response but object types have different namse
        function parseCallStart(data){
            var callid, response = fcs.notification.isAnonymous() ? data.callMeResponse:data.callControlResponse;
            if(response){
                callid = response.sessionData;
            }
            return callid;
        }

        function dataType() {
            var data;
            if (fcs.notification.isAnonymous()) {
                data = {
                    "callMeRequest":
                    {
                        "type":"callStart",
                        "from": from,
                        "to": to,
                        "sdp": sdp
                    }
                };
            }
            else {
                data = {
                    "callControlRequest":
                    {
                        "type":"callStart",
                        "from": from,
                        "to": to,
                        "sdp": sdp
                    }
                };
            }
            return data;
        }

        var data = dataType(), realm = getRealm();
        addNotificationChannel(data);

        _server.sendPostRequest({
            "url": getWAMUrl(1, fcs.notification.isAnonymous() ? "/callme" + (realm?("?tokenrealm=" + realm):"") : "/callControl"),
            "data": data
        },
        onSuccess,
        onFailure,
        parseCallStart,
        errorParser
        );
    };

    this.audit = function(callid, onSuccess, onFailure){
        var data, realm = getRealm();

           if (fcs.notification.isAnonymous()) {
                data = {
                    "callMeRequest":
                    {
                        "type":"audit"
                    }
                };
            }
            else {
                data = {
                    "callControlRequest":
                    {
                        "type":"audit"
                    }
                };
            }
        //TODO JF verify if we need to always do that and not only for callme realm;
        if(realm){
          callid = callid.split("%0A")[0];
        }

        _server.sendPutRequest({
            "url": getWAMUrl(1, (fcs.notification.isAnonymous() ? "/callme/callSessions/" : "/callControl/callSessions/") + callid + (realm?("?tokenrealm=" + realm):"")),
            "data": data
        }, onSuccess, onFailure, null, errorParser);
    };

    this.hold = function(callid , sdp , onSuccess , onFailure){
        logger.info("Hold Function : sdp : " + sdp);
        var data = {
            "callControlRequest":
            {
                "type":"startCallUpdate",
                "sdp": sdp
            }
        };

        _server.sendPutRequest({
            "url": getWAMUrl(1, "/callControl/callSessions/" + callid),
            "data": data
        }, onSuccess, onFailure, null, errorParser);
    };

    this.unhold = function(callid , sdp , onSuccess , onFailure){
        logger.info("UnHold Function : sdp : " + sdp);
        var data = {
            "callControlRequest":
            {
                "type":"startCallUpdate",
                "sdp": sdp
            }
        };
        _server.sendPutRequest({
            "url": getWAMUrl(1, "/callControl/callSessions/" + callid),
            "data": data
        }, onSuccess, onFailure, null, errorParser);
    };

    this.reinvite = function(callid , sdp , onSuccess , onFailure){
        logger.info("reinvite Function : sdp : " + sdp);

        var data = {
            "callControlRequest":
            {
                "type":"startCallUpdate",
                "sdp": sdp
            }
        };

        _server.sendPutRequest({
            "url": getWAMUrl(1, "/callControl/callSessions/" + callid),
            "data": data
        }, onSuccess, onFailure, null, errorParser);
    };

    this.respondCallUpdate = function(callid , sdp , onSuccess , onFailure){
        logger.info("Respond Call Update Function : sdp : " + sdp);
        var data = {
            "callControlRequest":
            {
                "type":"respondCallUpdate",
                "sdp": sdp
            }
        };
        _server.sendPutRequest({
            "url": getWAMUrl(1, "/callControl/callSessions/" + callid),
            "data": data
        }, onSuccess, onFailure, null, errorParser);
    };

    this.join = function (firstSessionData , secondSessionData , sdp , onSuccess , onFailure){
        logger.info("Join Function : sdp : " + sdp);
        function parseJoin(data){
            var callid, response = data.callControlResponse;

            if(response){
                callid = response.sessionData;
            }

            return callid;
        }

        var data = {
            "callControlRequest":
            {
                "type":"join",
                "firstSessionData":firstSessionData,
                "secondSessionData":secondSessionData,
                "sdp": sdp
            }
        };

        if(fcsConfig.clientControlled === "true") {
            data.callControlRequest.clientControlled = "true";
        }


        _server.sendPostRequest({
            "url": getWAMUrl(1, "/callControl/"),
            "data": data
        },
        onSuccess,
        onFailure,
        parseJoin,
        errorParser
        );
    };

    this.refer = function(callid, referTo, referredBy, onSuccess , onFailure){
        logger.info("Refer Function : refer to: " + referTo);
        var data = {
            "callControlRequest":
            {
                "type": "refer",
                "from": referredBy,
                "to": referTo
            }
        };

        _server.sendPutRequest({
            "url": getWAMUrl(1, "/callControl/callSessions/" + callid),
            "data": data
        }, onSuccess, onFailure, null, errorParser);
    };

    function makeCallControlRequest(type, callid , sdp, onSuccess, onFailure) {
        logger.info("makeCallControlRequest Function : sdp : " + sdp);
        var data = {
            "callControlRequest":{
                "type": type,
                "sdp": sdp
            }
        };

        _server.sendPutRequest({
            "url": getWAMUrl(1, "/callControl/callSessions/" + callid),
            "data": data
        }, onSuccess, onFailure, null, errorParser);
    }

    function makeCallControlEndRequest(callid, onSuccess, onFailure) {
        var realm = getRealm();
        logger.info("makeCallControlEndRequest Function: " + callid);

        _server.sendDeleteRequest({
            "url": getWAMUrl(1, (fcs.notification.isAnonymous() ? "/callme/callSessions/" : "/callControl/callSessions/") + callid + (realm?("?tokenrealm=" + realm):"")),
            "data":{}
        },
        onSuccess,
        onFailure,
        null,
        errorParser
        );
    }

    this.endCall = function(callid, onSuccess, onFailure) {
        logger.info("endCall Function: " + callid);
        makeCallControlEndRequest(callid, onSuccess, onFailure, null, errorParser);
    };

    this.answerCall = function(callid, sdp, onSuccess, onFailure) {
        logger.info("Answer Call Function : sdp : " + sdp);
        makeCallControlRequest("callAnswer", callid, sdp, onSuccess, onFailure, null, errorParser);
    };

    function makeRequest(action, sessionData, onSuccess, onFailure, address) {
        logger.info("makeRequest Function with action : " + action);
        var data = {
            "callDispositionRequest":{
                "action": action,
                "sessionData": sessionData
            }
        };
        if(address){
            data.callDispositionRequest.address = address;
        }
        _server.sendPostRequest({
            "url": getWAMUrl(1, "/calldisposition"),
            "data":data
        },
        onSuccess,
        onFailure,
        null,
        errorParser
        );
    }

    this.reject = function(callid, onSuccess, onFailure) {
        var dummy;
        logger.info("Reject Function: " + callid);
        makeRequest("reject", callid, onSuccess, onFailure, dummy, errorParser);
    };


    this.forward = function(callid, address , onSuccess, onFailure) {
        logger.info("Forward Function : address: " + address);
        makeRequest("forward", callid, onSuccess, onFailure, address);
    };

   this.transfer = function(callid , address , onSuccess , onFailure){
        logger.info("Call Transfer Function : target address: " + address);
        var data = {
            "callControlRequest":
            {
                "type":"transfer",
                "address": address
            }
        };

        _server.sendPutRequest({
            "url": getWAMUrl(1, "/callControl/callSessions/" + callid),
            "data": data
        }, onSuccess, onFailure, null, errorParser);
    };

    this.clickToCall = function(callingParty, calledParty, onSuccess, onFailure) {
        var data = {
            "clickToCallRequest":
            {
                "callingParty": callingParty,
                "calledParty": calledParty
            }
        };
        _server.sendPostRequest({
            "url": getWAMUrl(1, "/clicktocall"),
            "data": data
        },
        onSuccess,
        onFailure
        );
    };
    
    this.getIMRN = function(realm, source, destination, onSuccess, onFailure) {
        logger.info("(Wam Call) getIMRN Function ");

        function parseIMRNResponse(IMRNdata) {
            var receivedIMRN;
            if (IMRNdata && IMRNdata.imrnResponse) {
                receivedIMRN = utils.getProperty(IMRNdata.imrnResponse, 'imrn');
            }
            return receivedIMRN;
        }
        
        if(destination.match('@')){            
         if(destination.split(':')[0]!=="sip"){
            destination = "sip:" + destination;
            }
        }
        
        var data = {
            "imrnRequest":{
                "realm": realm,
                "sourceAddress": source,
                "destinationAddress": destination
            }
        };
        _server.sendPostRequest({
            "url": getWAMUrl(1, "/imrn"),
            "data": data
        },
        onSuccess,
        onFailure,
        parseIMRNResponse
        );
    };

};

var CallControlService = function(_server, _logManager, _cache) {
    return new CallControlServiceImpl(_server || server,
                                      _logManager || logManager,
                                      _cache || cache);
};

var callControlService = new CallControlService();

var CallManagerImpl = function(_webRtcManager, _callFSM, _callControlService,_sdpParser, _logManager) {

    /* AUDIT_KICKOFF_TIMEOUT is the interval we use to kickoff call audit after the call is setup.
     * The timeout is there to ensure we do not hit call setup race conditions when we try to kickoff the call audit */
    var calls = {}, logger = _logManager.getLogger("callManager"),
            AUDIT_KICKOFF_TIMEOUT = 3000, isReconnected = false,
            fsmNotificationEvent = _callFSM.NotificationEvent,
            fsmState = _callFSM.CallFSMState,
            self = this, isQueueEnabled = true,
            NOTIFICATION_STATE =
            {
                BUSY: 0,
                IDLE: 1
            }, CALL_STATES =
            {
                IN_CALL: 0,
                ON_HOLD: 1,
                RINGING: 2,
                ENDED: 3,
                REJECTED: 4,
                OUTGOING: 5,
                INCOMING: 6,
                ANSWERING: 7,
                JOINED: 8,
                RENEGOTIATION: 9,
                TRANSFERRED: 10,
                ON_REMOTE_HOLD: 11
            }, CALL_HOLD_STATES =
            {
                LOCAL_HOLD: 0,
                REMOTE_HOLD: 1,
                BOTH_HOLD: 2
            };

    function parseAddress(address, contact) {

        if (address.indexOf("sip:", 0) > -1) {
            address = address.replace("sip:", "");
        }
        var displayName = "";
        if (contact === undefined || contact === null) {
            return (address.indexOf("@", 0) > -1) ? "sip:" + address : address;
        }
        if (contact.firstName && contact.firstName !== "") {
            displayName += contact.firstName;
        }
        if (contact.lastName && contact.lastName !== "") {
            if (displayName === "") {
                displayName += contact.lastName;
            }
            else {
                displayName += " " + contact.lastName;
            }
        }
        if (displayName === "") {
            return (address.indexOf("@", 0) > -1) ? "sip:" + address : address;
        }
        return displayName + "<" + ((address.indexOf("@", 0) > -1) ? "sip:" + address : address) + ">";
    }

    /*
     * When connection re-establishes sets isReconnected flag true
     */
    function onConnectionLost() {
        isReconnected = true;
    }

    /*
     * clear call resources
     * clear long call audit
     * clear webrtc resources
     * triger web part
     *
     * @param call call object
     * @param state state that will be returned to web part
     */
    function clearResources(call) {
        if (call.call) {
            call.call.clearAuditTimer();
        }
        if (call.pendingRequestTimer) {
            clearTimeout(call.pendingRequestTimer);
        }
        //clear webRTC resources
        _webRtcManager.processEnd(call);
        //clear call object
        delete calls[call.id];
    }

    function setNotificationStateOfCallToBusy(internalCall) {
        logger.debug("Setting notification state to BUSY for call: " + internalCall.id);
        internalCall.notificationState = NOTIFICATION_STATE.BUSY;
    }

    function setNotificationStateOfCallToIdle(internalCall) {
        logger.debug("Setting notification state to IDLE for call: " + internalCall.id);
        internalCall.notificationState = NOTIFICATION_STATE.IDLE;
    }

    function isNotificationStateOfCallBusy(internalCall) {
        return internalCall.notificationState === NOTIFICATION_STATE.BUSY;
    }

    function triggerQueue(call) {
        if (!isQueueEnabled) {
            return;
        }
        logger.debug("NOTIFICATION_QUEUE: Process completed, notification queue state changed to IDLE");
        setNotificationStateOfCallToIdle(call);
        if (call.call.notificationQueue.size() > 0) {
            logger.debug("NOTIFICATION_QUEUE: New notification found in queue, processing it!");
            var notificationObj = call.call.notificationQueue.dequeue();
            self.onNotificationEvent(notificationObj.type, notificationObj.sessionParams);
        }
    }

    function onSubscriptionReEstablished() {
        var id, internalCall;
        if (isReconnected) {
            isReconnected = false;
            for (id in calls) {
                if (calls.hasOwnProperty(id)) {
                    internalCall = calls[id];
                    if (internalCall && _callFSM.getCurrentState(internalCall) !== fsmState.RINGING) {
                        setNotificationStateOfCallToBusy(internalCall);
                        self.delegateToCallFSM(internalCall, fsmNotificationEvent.performReconnectWorkaround_JSL);
                    }
                    else {
                        // If call signalingState is not stable, this call on ringing state. Call will be ended.
                        // Send 0 to delete the call
                        internalCall.call.onStateChange(CALL_STATES.ENDED, 0);
                        clearResources(internalCall);
                    }
                }
            }
        }
    }

    self.CALL_STATES = CALL_STATES;
    self.CALL_HOLD_STATES = CALL_HOLD_STATES;

    self.initMedia = function(onSuccess, onFailure, options) {
        _webRtcManager.initMedia(onSuccess, onFailure, options);
    };

    self.set_logSeverityLevel = function(level) {
        _webRtcManager.set_logSeverityLevel(level);
    };

    self.enable_logCallback = function() {
        _webRtcManager.enable_logCallback();
    };

    self.disable_logCallback = function() {
        _webRtcManager.disable_logCallback();
    };

    self.get_audioInDeviceCount = function() {
        _webRtcManager.get_audioInDeviceCount();
    };

    self.get_audioOutDeviceCount = function() {
        _webRtcManager.get_audioOutDeviceCount();
    };

    self.get_videoDeviceCount = function() {
        _webRtcManager.get_videoDeviceCount();
    };

    self.getUserMedia = function(onSuccess, onFailure, options) {
        _webRtcManager.getUserMedia(onSuccess, onFailure, options);
    };

    self.showSettingsWindow = function(onSuccess, onFailure, options) {
        _webRtcManager.showSettingsWindow(onSuccess, onFailure, options);
    };

    self.createStreamRenderer = function(streamId, container, options) {
        return _webRtcManager.createStreamRenderer(streamId, container, options);
    };

    self.disposeStreamRenderer = function(container) {
        _webRtcManager.disposeStreamRenderer(container);
    };

    self.isPluginEnabled = function() {
        return _webRtcManager.isPluginEnabled();
    };

    self.hasGotCalls = function() {
        var callid, internalCall;
        for (callid in calls) {
            if (calls.hasOwnProperty(callid)) {
                internalCall = calls[callid];
                if (internalCall) {
                    logger.info("has got call - id: " + callid + " - state: " + _callFSM.getCurrentState(internalCall));
                    return true;
                }
            }
        }
        return false;
    };

    self.getCalls = function() {
        return calls;
    };

    self.sendIntraFrame = function(callid) {
        var internalCall = calls[callid];
        if (internalCall) {
            _webRtcManager.sendIntraFrame(internalCall);
        }
    };

    self.sendBlackFrame = function(callid) {
        var internalCall = calls[callid];
        if (internalCall) {
            _webRtcManager.sendBlackFrame(internalCall);
        }
    };

    self.delegateToCallFSM = function(call, stateMessage) {
        _callFSM.handleEvent(call, stateMessage, self.onStateChange);
    };

    self.answer = function(callid, onSuccess, onFailure, isVideoEnabled, videoQuality) {
        var internalCall = calls[callid],
                videoNegotationAvailable = self.isVideoNegotationAvailable(callid);

        if (internalCall) {
            // check if term side tries to answer an audio only call with video
            if (videoNegotationAvailable === false && isVideoEnabled === true) {
                logger.error("[callManager.answer] Video Session Not Available Error ");
                utils.callFunctionIfExist(onFailure, fcs.Errors.VIDEO_SESSION_NOT_AVAILABLE);
                return;
            }

            if (internalCall.sdp) {
                //check with the state machine if the current state would accept an answer.
                if (_callFSM.getCurrentState(internalCall) !== fsmState.RINGING) {
                    utils.callFunctionIfExist(onFailure, fcs.Errors.STATE);
                }
                else {
                    self.getUserMedia(function(mediaInfo) {
                        internalCall.isVideoSourceAllowed = mediaInfo.video;
                        internalCall.isVideoEnabled = isVideoEnabled;
                        _webRtcManager.storeLocalStreamToCall(internalCall, mediaInfo.id);
                        _webRtcManager.createAnswer(
                                internalCall,
                                function(sdp) {
                                    logger.info("[callManager.answer : sdp ]" + sdp);
                                    //change call state
                                    self.delegateToCallFSM(internalCall, fsmNotificationEvent.answer_GUI);
                                    //send answer call
                                    _callControlService.answerCall(
                                            internalCall.id,
                                            sdp,
                                            function() {
                                                //TODO: is this necessary
                                                _webRtcManager.addLocalStream(internalCall);
                                                utils.callFunctionIfExist(onSuccess);
                                            },
                                            onFailure);
                                },
                                function(errStr) {
                                    logger.error("[callManager.answer] Error : " + errStr);
                                    //Change state when the call have failed
                                    //This will trigger send reject
                                    self.delegateToCallFSM(internalCall, fsmNotificationEvent.end_GUI);
                                },
                                isVideoEnabled);
                    }, function(e) {
                        utils.callFunctionIfExist(onFailure, e);
                    },
                            {
                                "audio": true,
                                "video": videoNegotationAvailable ? true : false,
                                "audioIndex": 0,
                                "videoIndex": videoNegotationAvailable ? 0 : -1,
                                "videoResolution": videoQuality
                            });
                }
            }
            else {
                if (_callFSM.getCurrentState(internalCall) !== fsmState.RINGING_SLOW) {
                    utils.callFunctionIfExist(onFailure, fcs.Errors.STATE);
                }
                else {
                    self.getUserMedia(function(mediaInfo) {
                        internalCall.isVideoSourceAllowed = mediaInfo.video;
                        internalCall.isVideoEnabled = isVideoEnabled;
                        _webRtcManager.storeLocalStreamToCall(internalCall, mediaInfo.id);
                        _webRtcManager.createOffer(internalCall, function(sdp) {
                            internalCall.sdp = sdp;
                            self.delegateToCallFSM(internalCall, fsmNotificationEvent.answer_GUI);
                            _callControlService.answerCall(internalCall.id, sdp, onSuccess, onFailure);
                        }, function() {
                            self.delegateToCallFSM(internalCall, fsmNotificationEvent.end_GUI);
                        },
                                isVideoEnabled);
                    }, function(e) {
                        utils.callFunctionIfExist(onFailure, e);
                    },
                            {
                                "audio": true,
                                "video": videoNegotationAvailable ? true : false,
                                "audioIndex": 0,
                                "videoIndex": videoNegotationAvailable ? 0 : -1,
                                "videoResolution": videoQuality
                            });

                }
            }
        }
    };

    self.getIncomingCallById = function(callid) {
        var call = null, cachedCall, internalCall;

        cachedCall = JSON.parse(cache.getItem(callid));
        if (cachedCall) {

            call = new fcs.call.IncomingCall(callid, {reject: cachedCall.optionReject, forward: cachedCall.optionForward, answer: cachedCall.optionAnswer});

            call.canOrigReceiveVideo = _sdpParser.isSdpHasVideo(cachedCall.sdp);

            call.callerNumber = cachedCall.callerNumber;
            call.callerName = cachedCall.callerName;
            call.calleeNumber = cachedCall.calleeNumber;
            call.primaryContact = cachedCall.primaryContact;

            internalCall = {
                "call": call,
                "sdp": cachedCall.sdp,
                "id": callid
            };

            calls[callid] = internalCall;

            self.delegateToCallFSM(internalCall, fsmNotificationEvent.callNotify);
        }

        return call;
    };

    function cacheCall(internalCall) {
        var callToCache = {
            "sdp": internalCall.sdp,
            "callerNumber": internalCall.call.callerNumber,
            "callerName": internalCall.call.callerName,
            "calleeNumber": internalCall.call.calleeNumber,
            "primaryContact": internalCall.call.primaryContact,
            "optionReject": internalCall.call.canReject(),
            "optionForward": internalCall.call.canForward(),
            "optionAnswer": internalCall.call.canAnswer()
        };

        cache.setItem(internalCall.id, JSON.stringify(callToCache));
    }

    self.start = function(from, contact, to, onSuccess, onFailure, isVideoEnabled, sendInitialVideo, videoQuality) {
        var internalCall = {};

        logger.info("start call... from: " + from
                + " contact: " + JSON.stringify(contact)
                + " to: " + to
                + " isVideoEnabled: " + isVideoEnabled
                + " sendInitialVideo: " + sendInitialVideo
                + " videoQuality: " + videoQuality);

        self.getUserMedia(function(mediaInfo) {
            internalCall.isVideoSourceAllowed = mediaInfo.video;
            internalCall.isVideoEnabled = isVideoEnabled;
            _webRtcManager.storeLocalStreamToCall(internalCall, mediaInfo.id);
            _webRtcManager.createOffer(internalCall,
                    function(sdp) {
                        logger.info("[callManager.start : sdp ]" + sdp);

                        internalCall.sdp = sdp;
                        _callControlService.startCall(
                                parseAddress(from, contact),
                                parseAddress(to),
                                sdp,
                                function(callid) {

                                    internalCall.call = new fcs.call.OutgoingCall(callid);
                                    internalCall.id = callid;

                                    self.delegateToCallFSM(internalCall, fsmNotificationEvent.callStart_GUI);
                                    calls[callid] = internalCall;
                                    //TODO: is this necessary
                                    _webRtcManager.addLocalStream(internalCall);
                                    utils.callFunctionIfExist(onSuccess, internalCall.call);
                                },
                                function(e) {
                                    //TODO: update call state
                                    utils.callFunctionIfExist(onFailure, e);
                                });
                    }, function(e) {
                logger.error("doOffer failed: " + e);
                utils.callFunctionIfExist(onFailure, e);
            },
                    sendInitialVideo
                    );
        }, function() {
            utils.callFunctionIfExist(onFailure);
        },
                {
                    "audio": true,
                    "video": isVideoEnabled ? true : false,
                    "audioIndex": 0,
                    "videoIndex": isVideoEnabled ? 0 : -1,
                    "videoResolution": videoQuality
                }
        );

    };
    self.reject = function(callid, onSuccess, onFailure) {
        var internalCall = calls[callid];
        if (!internalCall) {
            utils.callFunctionIfExist(onFailure, fcs.Errors.STATE);
            return;
        }

        _callControlService.reject(callid, function() {
            self.delegateToCallFSM(internalCall, fsmNotificationEvent.end_GUI);
            utils.callFunctionIfExist(onSuccess);
        },
                function() {
                    utils.callFunctionIfExist(onFailure);
                });

    };

    self.ignore = function(callid, onSuccess, onFailure) {
        var internalCall = calls[callid];
        if (!internalCall) {
            utils.callFunctionIfExist(onFailure, fcs.Errors.STATE);
            return;
        }

        self.delegateToCallFSM(internalCall, fsmNotificationEvent.end_GUI);
        utils.callFunctionIfExist(onSuccess);
    };
    self.forward = function(callid, address, onSuccess, onFailure) {
        var internalCall = calls[callid];
        if (!internalCall) {
            utils.callFunctionIfExist(onFailure, fcs.Errors.STATE);
            return;
        }

        _callControlService.forward(callid, address, function() {
            self.delegateToCallFSM(internalCall, fsmNotificationEvent.forward_GUI);
            utils.callFunctionIfExist(onSuccess);
        },
                function() {
                    utils.callFunctionIfExist(onFailure);
                });
    };

    function handleFailure(internalCall, failureHandler, failureEvent, retry) {
        setNotificationStateOfCallToBusy(internalCall);
        _webRtcManager.revertRtcState(internalCall, triggerQueue, triggerQueue);

        if (failureEvent) {
            self.delegateToCallFSM(internalCall, failureEvent);
        }

        if (retry && retry.timeout) {
            internalCall.pendingRequestTimer = setTimeout(function() {
                internalCall.pendingRequestTimer = null;
                retry.args.push(true);
                retry.handler.apply(null, retry.args);
            }, retry.timeout * 1000);
        }
        else {
            if (failureHandler) {
                utils.callFunctionIfExist(failureHandler);
            }
        }
    }

    function handleRequestFailure(internalCall, failureHandler, retry) {
        handleFailure(internalCall, failureHandler,
                fsmNotificationEvent.requestFailure_JSL, retry);
    }

    function handleWebrtcFailure(internalCall, failureHandler) {
        handleFailure(internalCall, failureHandler,
                fsmNotificationEvent.webrtcFailure_JSL);
    }

    self.hold = function(callid, onSuccess, onFailure, isAutoRetried) {
        var internalCall = calls[callid], currentCallState;
        if (!internalCall) {
            utils.callFunctionIfExist(onFailure, fcs.Errors.STATE);
            return;
        }

        if (isNotificationStateOfCallBusy(internalCall)){
            if (isAutoRetried) {
                utils.callFunctionIfExist(onFailure, fcs.Errors.NETWORK);
            }
            else {
                utils.callFunctionIfExist(onFailure, fcs.Errors.STATE);
            }
            return;
        }

        currentCallState = _callFSM.getCurrentState(internalCall);

        if (currentCallState !== fsmState.COMPLETED &&
                currentCallState !== fsmState.REMOTE_HOLD) {
            if (isAutoRetried) {
                utils.callFunctionIfExist(onFailure, fcs.Errors.NETWORK);
            }
            else {
                utils.callFunctionIfExist(onFailure, fcs.Errors.STATE);
            }
            return;
        }

        if (internalCall.pendingRequestTimer) {
            utils.callFunctionIfExist(onFailure, fcs.Errors.PENDING_REQUEST);
            return;
        }

        internalCall.lastUpdateRequest = {handler: self.hold,
            args: [callid, onSuccess, onFailure]};

        setNotificationStateOfCallToBusy(internalCall);

        self.delegateToCallFSM(internalCall, fsmNotificationEvent.hold_GUI);
        _webRtcManager.createHoldUpdate(internalCall,
                true,
                (currentCallState === fsmState.REMOTE_HOLD),
                function(sdp) {
                    logger.debug("[callManager.hold->createHoldUpdate : sdp ]" + sdp);
                    _callControlService.hold(internalCall.id, sdp,
                            function() {
                                setNotificationStateOfCallToIdle(internalCall);
                                utils.callFunctionIfExist(onSuccess);
                            },
                            function(err) {
                                handleRequestFailure(internalCall, onFailure,
                                        {handler: self.hold,
                                            args: [callid, onSuccess, onFailure],
                                            timeout: err.retryAfter});
                            });
                },
                function() {
                    handleWebrtcFailure(internalCall, onFailure);
                });

    };

    self.unhold = function(callid, onSuccess, onFailure, isAutoRetried) {
        var internalCall = calls[callid], currentCallState;

        if (!internalCall) {
            utils.callFunctionIfExist(onFailure, fcs.Errors.STATE);
            return;
        }

        if (isNotificationStateOfCallBusy(internalCall)){
            if (isAutoRetried) {
                utils.callFunctionIfExist(onFailure, fcs.Errors.NETWORK);
            }
            else {
                utils.callFunctionIfExist(onFailure, fcs.Errors.STATE);
            }
            return;
        }

        currentCallState = _callFSM.getCurrentState(internalCall);

        if (currentCallState !== fsmState.LOCAL_HOLD &&
                currentCallState !== fsmState.BOTH_HOLD) {
            if (isAutoRetried) {
                utils.callFunctionIfExist(onFailure, fcs.Errors.NETWORK);
            }
            else {
                utils.callFunctionIfExist(onFailure, fcs.Errors.STATE);
            }
            return;
        }

        if (internalCall.pendingRequestTimer) {
            utils.callFunctionIfExist(onFailure, fcs.Errors.PENDING_REQUEST);
            return;
        }

        internalCall.lastUpdateRequest = {handler: self.unhold,
            args: [callid, onSuccess, onFailure]};

        setNotificationStateOfCallToBusy(internalCall);

        self.delegateToCallFSM(internalCall, fsmNotificationEvent.unhold_GUI);
        _webRtcManager.createHoldUpdate(internalCall, false,
                (currentCallState === fsmState.BOTH_HOLD),
                function(sdp) {
                    logger.debug("[callManager.unhold->createHoldUpdate : sdp ]" + sdp);
                    _callControlService.unhold(internalCall.id, sdp,
                            function() {
                                setNotificationStateOfCallToIdle(internalCall);
                                //TODO: is this necessary
                                _webRtcManager.addLocalStream(internalCall);
                                utils.callFunctionIfExist(onSuccess);
                            },
                            function(err) {
                                handleRequestFailure(internalCall, onFailure,
                                        {handler: self.unhold,
                                            args: [callid, onSuccess, onFailure],
                                            timeout: err.retryAfter});
                            });
                },
                function() {
                    handleWebrtcFailure(internalCall, onFailure);
                });
    };

    self.directTransfer = function(callid, address, onSuccess, onFailure) {
        var internalCall = calls[callid], currentCallState;

        if (!internalCall) {
            utils.callFunctionIfExist(onFailure, fcs.Errors.STATE);
            return;
        }

        currentCallState = _callFSM.getCurrentState(internalCall);
        if (currentCallState === fsmState.LOCAL_HOLD
                || currentCallState === fsmState.COMPLETED
                || currentCallState === fsmState.BOTH_HOLD)
        {
            //TODO: force localhold - if the user is not on hold
            logger.info("[callManager.directTransfer->sendTransfer : transfer target ]" + address);
            _callControlService.transfer(internalCall.id, address, function() {
                self.delegateToCallFSM(internalCall, fsmNotificationEvent.transfering);
                logger.info("[callManager.directTransfer->sentTransfer : transfer target ]" + address);
            }, onFailure);
        } else {
            logger.error("directTransfer call is not in correct state: " + currentCallState);
        }
    };


    self.videoUpdate = function(callid, onSuccess, onFailure) {
        var internalCall = calls[callid], isVideoStart;

        if (!internalCall) {
            utils.callFunctionIfExist(onFailure, fcs.Errors.STATE);
            return;
        }

        isVideoStart = internalCall.isVideoEnabled || internalCall.isScreenShared;

        internalCall.lastUpdateRequest = {handler: self.videoUpdate,
            args: [callid, onSuccess, onFailure]};

        setNotificationStateOfCallToBusy(internalCall);

        self.delegateToCallFSM(internalCall, fsmNotificationEvent.videoStopStart_GUI);
        _webRtcManager.createUpdate(
                internalCall,
                function(sdp) {
                    _callControlService.reinvite(internalCall.id, sdp,
                            function() {
                                setNotificationStateOfCallToIdle(internalCall);
                                //TODO: is this necessary
                                _webRtcManager.addLocalStream(internalCall);
                                utils.callFunctionIfExist(onSuccess);
                            },
                            function(err) {
                                handleRequestFailure(internalCall, onFailure,
                                        {handler: self.videoUpdate,
                                            args: [callid, onSuccess, onFailure],
                                            timeout: err.retryAfter
                                        });
                            }
                    );
                },
                function() {
                    logger.error("reinvite->createUpdate");
                    handleWebrtcFailure(internalCall, onFailure);
                },
                isVideoStart);
    };

    self.videoStopStart = function(callid, onSuccess, onFailure, isVideoStart, videoQuality, isAutoRetried) {
        var internalCall = calls[callid], currentCallState;

        if (!internalCall) {
            utils.callFunctionIfExist(onFailure, fcs.Errors.STATE);
            return;
        }

        if (isNotificationStateOfCallBusy(internalCall)){
            utils.callFunctionIfExist(onFailure, fcs.Errors.STATE);
            return;
        }

        currentCallState = _callFSM.getCurrentState(internalCall);
        if (currentCallState !== fsmState.COMPLETED) {
            utils.callFunctionIfExist(onFailure, fcs.Errors.STATE);
            return;
        }

        if (internalCall.pendingRequestTimer) {
            utils.callFunctionIfExist(onFailure, fcs.Errors.PENDING_REQUEST);
            return;
        }

        if (!internalCall.isVideoSourceAllowed && isVideoStart) {
            self.getUserMedia(function(mediaInfo) {
                internalCall.isVideoSourceAllowed = true;
                internalCall.isVideoEnabled = true;
                _webRtcManager.storeLocalStreamToCall(internalCall, mediaInfo.id);

                // If the screen is shared, we don't need to do an update since the
                // video state won't have changed.
                if (!internalCall.isScreenShared) {
                    self.videoUpdate(callid, onSuccess, onFailure);
                }
            }, function() {
                utils.callFunctionIfExist(onFailure);
            }, {
                "audio": true,
                "video": true,
                "audioIndex": 0,
                "videoIndex": 0,
                "videoResolution": videoQuality
            });
        } else {
            internalCall.isVideoEnabled = isVideoStart;

            // If the screen is shared, we don't need to do an update since the
            // video state won't have changed.
            if (!internalCall.isScreenShared) {
                self.videoUpdate(callid, onSuccess, onFailure);
            }
        }
    };

    self.screenStopStart = function(callid, onSuccess, onFailure, onScreenStop, isScreenStart, options) {
        var internalCall = calls[callid], currentCallState;

        if (!internalCall) {
            utils.callFunctionIfExist(onFailure, fcs.Errors.STATE);
            return;
        }

        if (isNotificationStateOfCallBusy(internalCall)){
            utils.callFunctionIfExist(onFailure, fcs.Errors.STATE);
            return;
        }

        currentCallState = _callFSM.getCurrentState(internalCall);
        if (currentCallState !== fsmState.COMPLETED) {
            utils.callFunctionIfExist(onFailure, fcs.Errors.STATE);
            return;
        }

        if (internalCall.pendingRequestTimer) {
            utils.callFunctionIfExist(onFailure, fcs.Errors.PENDING_REQUEST);
            return;
        }

        if (isScreenStart) {

            // If we are already in the process of starting screensharing, don't
            // try again until it's done.
            if (internalCall.isStartingScreenMedia) {
                utils.callFunctionIfExist(onFailure);
                return;
            }

            internalCall.isStartingScreenMedia = true;

            _webRtcManager.startScreenMedia(function(mediaInfo) {
                    internalCall.isScreenShared = true;
                    internalCall.isStartingScreenMedia = false;
                    _webRtcManager.storeLocalStreamToCall(internalCall, mediaInfo.id);
                    self.videoUpdate(callid, onSuccess, onFailure);
                },
                function() {
                    internalCall.isScreenShared = false;
                    internalCall.isStartingScreenMedia = false;
                    utils.callFunctionIfExist(onFailure);
                },
                options ,
                function() {
                    if (_callFSM.getCurrentState(internalCall) === fsmState.COMPLETED) {
                        //Screen sharing video stream has been stopped, act as if someone called screenStopStart
                        //but pass the result to onScreenStop instead.
                        self.screenStopStart(callid, onScreenStop, function() {
                            logger.error("Failed to stop screen properly after user stopped the stream via" +
                                " the browser controls");
                        }, false);
                    } else if (internalCall.isScreenShared) {
                        internalCall.isScreenShared = false;
                        _webRtcManager.stopScreenMedia();
                        utils.callFunctionIfExist(onScreenStop);
                    }
                });
        } else if (internalCall.isScreenShared){
            internalCall.isScreenShared = false;
            _webRtcManager.stopScreenMedia();

            self.videoUpdate(callid, onSuccess, onFailure);
        }
    };

    self.mute = function(callid, mute) {
        var call = calls[callid];
        if (call) {
            _webRtcManager.muteAudioTrack(call, mute);
        }
    };

    self.sendDTMF = function(callid, tone) {
        var internalCall = calls[callid];

        if (internalCall) {
            _webRtcManager.sendDTMF(internalCall, tone);
        }
    };

    self.join = function(callid1, callid2, onSuccess, onFailure) {
        var internalCall1 = calls[callid1],
                internalCall2 = calls[callid2],
                newInternalCall = {},
                isVideoEnabled = true,
                currentCallState1,
                currentCallState2;

        if ((internalCall1) && (internalCall2)) {
            currentCallState1 = _callFSM.getCurrentState(internalCall1);
            currentCallState2 = _callFSM.getCurrentState(internalCall2);
            if ((currentCallState1 === fsmState.LOCAL_HOLD
                    || currentCallState1 === fsmState.REMOTE_HOLD
                    || currentCallState1 === fsmState.BOTH_HOLD)
                    && (currentCallState2 === fsmState.LOCAL_HOLD
                    || currentCallState2 === fsmState.REMOTE_HOLD
                    || currentCallState2 === fsmState.BOTH_HOLD)) {

                self.getUserMedia(function(mediaInfo) {
                    _webRtcManager.storeLocalStreamToCall(newInternalCall, mediaInfo.id);
                    _webRtcManager.createOffer(newInternalCall,
                            function(sdp) {
                                logger.info("join->doOffer : sdp " + sdp);
                                newInternalCall.sdp = sdp;
                                _callControlService.join(
                                        internalCall1.id,
                                        internalCall2.id,
                                        sdp,
                                        function(callid) {

                                            newInternalCall.call = new fcs.call.OutgoingCall(callid);
                                            newInternalCall.id = callid;

                                            // refer will be handled by client. We are going to need callID of partyB and partyC
                                            if (fcsConfig.clientControlled === "true") {
                                                newInternalCall.isReferer = true;
                                                newInternalCall.refer1ID = internalCall1.id;
                                                newInternalCall.refer2ID = internalCall2.id;
                                            }

                                            self.delegateToCallFSM(internalCall1, fsmNotificationEvent.joining_Notify);
                                            self.delegateToCallFSM(internalCall2, fsmNotificationEvent.joining_Notify);
                                            self.delegateToCallFSM(newInternalCall, fsmNotificationEvent.joiningSuccess_Notify);
                                            calls[callid] = newInternalCall;

                                            utils.callFunctionIfExist(onSuccess, newInternalCall.call);
                                        }, function() {
                                    logger.error("callControlService.join Failed!! sdp " + sdp);
                                    utils.callFunctionIfExist(onFailure);
                                });
                            }, function() {
                        logger.error("doOffer Failed!!");
                        utils.callFunctionIfExist(onFailure);
                    }, false);
                }, function() {
                    utils.callFunctionIfExist(onFailure);
                }, {
                    "audio": true,
                    "video": isVideoEnabled ? true : false,
                    "audioIndex": 0,
                    "videoIndex": isVideoEnabled ? 0 : -1
                });
            }
        }
    };

    self.transfer = function(callid, address, onSuccess, onFailure) {

    };

    self.end = function(callid, onSuccess) {
        var internalCall = calls[callid];
        if (internalCall) {
            //check with the state machine if the current state would accept an endCall.
            if (_callFSM.getCurrentState(internalCall) === fsmState.INIT) {
                logger.error("Cannot end call in INIT callstate :" + fcs.Errors.STATE);
            } else {
                //send the end call to webrtc abstraction, change call state
                //this will trigger the send endcall or reject call
                self.delegateToCallFSM(internalCall, fsmNotificationEvent.end_GUI);

                clearResources(internalCall);
                utils.callFunctionIfExist(onSuccess);
            }
        }

    };

    self.clickToCall = function(callingParty, calledParty, onSuccess, onFailure) {
        _callControlService.clickToCall(callingParty, calledParty, onSuccess, onFailure);
    } ;

    self.getIMRN = function(realm, source, destination, onSuccess, onFailure) {
        _callControlService.getIMRN(realm, source, destination, onSuccess, onFailure);
    } ;

    self.incomingCall = function(call, sdp) {

        logger.info("incomingCall : sdp = " + sdp);
        var internalCall = {
            "call": call,
            "sdp": sdp,
            "id": call.getId()
        };
        logger.info("incomingCall: " + call.getId());

        if (fcsConfig.continuity && call.canAnswer()) {
            cacheCall(internalCall);
        }

        calls[call.getId()] = internalCall;
        self.delegateToCallFSM(internalCall, fsmNotificationEvent.callNotify);
    };


    self.updateCall = function() {
    };

    self.onNotificationEvent = function(type, sessionParams) {
        var callid = sessionParams.sessionData,
                statusCode = sessionParams.statusCode,
                reasonText = sessionParams.reasonText,
                sdp = sessionParams.sdp,
                referTo = sessionParams.referTo,
                referredBy = sessionParams.referredBy,
                retryAfter = sessionParams.retryAfter,
                internalCall = calls[callid];

        logger.debug("Notification received " + type + " callid:" + callid);
        logger.debug("onNotificationEvent : sdp " + sdp);
        if (internalCall) {
            if (isQueueEnabled && isNotificationStateOfCallBusy(internalCall) &&
                    (type !== fsmNotificationEvent.callEnd_Notify) && (type !== fsmNotificationEvent.callCancel_Notify)) {
                logger.debug("NOTIFICATION_QUEUE: notification state is busy, adding process to the queue!");
                internalCall.call.notificationQueue.enqueue({
                    type: type,
                    sessionParams: sessionParams
                });
                logger.debug("NOTIFICATION_QUEUE: queue size is now " + internalCall.call.notificationQueue.size());
                return;
            }

            if(isQueueEnabled){
                setNotificationStateOfCallToBusy(internalCall);
            }

            if (sdp) {
                internalCall.prevRemoteSdp = internalCall.sdp;
                sdp = _sdpParser.deleteGoogleIceFromSdp(sdp);
                internalCall.sdp = sdp;
            }
            if (referTo && referredBy) {
                internalCall.referTo = referTo;
                internalCall.referredBy = referredBy;
            }
            internalCall.retryAfter = retryAfter;
            internalCall.statusCode = statusCode;
            internalCall.reasonText = reasonText;
        }
        self.delegateToCallFSM(internalCall, type);
    };

    self.onStateChange = function(call, event) {
        var callStates = CALL_STATES,
                transferEvent = _callFSM.TransferEvent,
                i, isJoin, isLocalHold, auditTimerDelay, startAuditTimer;

        calls[call.id] = call;


        function triggerCallState(state, doNotTriggerQueue) {
            logger.debug("triggerCallState:  state =   " + state + "    call.statusCode =  " + call.statusCode + "   call.reasonText =  " + call.reasonText);
            call.call.callState = state;
            utils.callFunctionIfExist(call.call.onStateChange, state, call.statusCode, call.reasonText);
            if (!doNotTriggerQueue) {
                triggerQueue(call);
            }
        }

        function triggerCallStateWithoutQueue(state) {
            triggerCallState(state, true);
        }

        auditTimerDelay = function() {
            setTimeout(function() {
                if (fcs.isConnected()) {
                    _callControlService.audit(call.id, function() {
                        logger.info("Audit kicked off: Success for: " + call.id);
                    }, function() {
                        logger.error("Audit: Fail for: " + call.id);
                        // no need to end the call after audit fail
                        // clearResources(call);
                        // triggerCallState(callStates.ENDED);
                    });
                }
            }, AUDIT_KICKOFF_TIMEOUT);
        };

        startAuditTimer = function() {
            call.call.setAuditTimer(function() {
                if (fcs.isConnected()) {
                    _callControlService.audit(call.id, function() {
                        logger.info("Audit: Success for: " + call.id);
                    }, function() {
                        logger.error("Audit: Fail for: " + call.id);
                        // no need to end the call after audit fail
                        // clearResources(call);
                        // triggerCallState(callStates.ENDED);
                        triggerQueue(call);
                    });
                }
            });
        };

        logger.info("Transfer Event: " + event + ". callId: " + call.id);
        switch (event) {
            case transferEvent.callStart_fsm:
            case transferEvent.localHolding_fsm:
            case transferEvent.localUnHolding_fsm:
            case transferEvent.localVideoStopStart_fsm:
            case transferEvent.slowStartOfferProcessed_fsm:
            case transferEvent.joiningSuccess_fsm:
                break;
            case transferEvent.ignoredNotification_fsm:
            case transferEvent.answeringRingingSlow_fsm:
            case transferEvent.transfering_fsm:
            case transferEvent.localHold_fsm:
            case transferEvent.localUnHold_fsm:
                triggerQueue(call);
                break;
            case transferEvent.ringing_fsm:
                triggerCallState(callStates.RINGING);
                break;
            case transferEvent.callReceived_fsm:
                if (!(call.sdp)) {
                    self.delegateToCallFSM(call, fsmNotificationEvent.callNotify_noSDP);
                }
                triggerCallState(callStates.INCOMING);
                break;
            case transferEvent.answer_fsm:
                auditTimerDelay();
                startAuditTimer();
                break;
            case transferEvent.answerRingingSlow_fsm:
                triggerQueue(call);
                break;
            case transferEvent.reject_GUI:
                clearResources(call);
                break;
            case transferEvent.sessionComplete_fsm:
                _callControlService.endCall(call.id, function() {
                    logger.info("callControlService.endCall successful. callId: " + call.id);
                }, function() {
                    logger.error("callControlService.endCall FAILED!!.callId: " + call.id);
                });
                clearResources(call);
                triggerCallState(callStates.JOINED);
                break;
            case transferEvent.sessionFail_fsm:
                triggerCallState(callStates.ON_HOLD);
                break;
            case transferEvent.callCompleted_fsm:
                //startCall case: this is place where we must
                //have already got the remote sdp so need to let webrtc
                //process answer with latest sdp
                auditTimerDelay();
                _webRtcManager.processAnswer(call, function() {
                    startAuditTimer();
                    triggerCallState(callStates.IN_CALL);
                }, function() {
                    clearResources(call);
                    triggerCallState(callStates.ENDED);
                });

                //if client is handling the refers, we need to trigger the refers for partyB and partyC from referer
                if (call.isReferer) {
                    for (i in calls) {
                        if (calls.hasOwnProperty(i)) {
                            if (calls[i] && (calls[i].id === call.refer1ID || calls[i].id === call.refer2ID)) {
                                calls[i].referCall(call.referTo, call.referredBy);
                            }
                        }
                    }
                }
                break;
            case transferEvent.noAnswer_fsm:
                clearResources(call);
                triggerCallState(callStates.ENDED);
                break;
            case transferEvent.localEnd_fsm:
                _callControlService.endCall(call.id, function() {
                    logger.info("CallControlService endCall successful. callId: " + call.id);
                }, function() {
                    logger.error("Cannot callControlService endCall. callId: " + call.id);
                });
                break;
            case transferEvent.callCompletedAnswering_fsm:
                logger.info("callManager: Call Completed Answering Event. callId: " + call.id);
                _webRtcManager.processAnswer(call, function() {
                    triggerCallState(callStates.IN_CALL);
                    auditTimerDelay();
                    startAuditTimer();
                }, function() {
                    clearResources(call);
                    triggerCallState(callStates.ENDED);
                });
                break;
            case transferEvent.remoteEnd_fsm:
                //clear webRTC resources
                clearResources(call);
                triggerCallState(callStates.ENDED);
                break;
            case transferEvent.remoteHold_fsm:
                switch (_callFSM.getCurrentState(call)) {
                    case fsmState.REMOTE_HOLD:
                        triggerCallState(callStates.ON_REMOTE_HOLD);
                        break;
                    case fsmState.BOTH_HOLD:
                        triggerCallState(callStates.ON_HOLD);
                        break;
                    default:
                        triggerQueue(call);
                        break;
                }
                break;
            case transferEvent.remoteUnHold_fsm:
                switch (_callFSM.getCurrentState(call)) {
                    case fsmState.LOCAL_HOLD:
                        triggerCallState(callStates.ON_HOLD);
                        break;
                    case fsmState.COMPLETED:
                        triggerCallState(callStates.IN_CALL);
                        break;
                    default:
                        triggerQueue(call);
                        break;
                }
                break;
            case transferEvent.remoteHolding_fsm:
                isLocalHold = (_callFSM.getCurrentState(call) === fsmState.LOCAL_HOLD) || (_callFSM.getCurrentState(call) === fsmState.BOTH_HOLD);
                _webRtcManager.processHold(call, true, isLocalHold, function(sdp) {
                    logger.info("[callManager.onStateChange.transferEvent.remoteHold_fsm->processHold : sdp ]" + sdp);
                    _callControlService.respondCallUpdate(call.id, sdp, function() {
                        logger.info("Remote Hold Transfer Event Successful. callId: " + call.id);
                        self.delegateToCallFSM(call, fsmNotificationEvent.remoteHoldProcessed_JSL);
                    }, function(errorStr) {
                        logger.error("Remote Hold Transfer Event FAILED!! - " + errorStr);
                        handleRequestFailure(call);
                    });
                }, function(errorStr) {
                    logger.error("Remote Hold FAILED!! - " + errorStr);
                    handleWebrtcFailure(call);
                });
                break;
            case transferEvent.remoteOfferDuringLocalHold_fsm:
                _webRtcManager.processRemoteOfferOnLocalHold(call, function(sdp) {
                    logger.info("onStateChange.transferEvent.remoteOfferDuringLocalHold_fsm : sdp " + sdp);
                    _callControlService.respondCallUpdate(call.id, sdp, function() {
                        logger.info("Remote Offer During Local Hold Transfer Event successful. callId: " + call.id);
                        triggerQueue(call);
                    }, function(errorStr) {
                        handleRequestFailure(call);
                        logger.error("Remote Offer During Local Hold  Transfer Event FAILED!! - " + errorStr);
                    });
                }, function(errorStr) {
                    logger.error("Remote Offer During Local Hold FAILED!! - " + errorStr);
                    handleWebrtcFailure(call);
                });
                break;
            case transferEvent.slowStartOfferDuringOnCall_fsm:
            case transferEvent.slowStartOfferDuringRemoteHold_fsm:
                _webRtcManager.createReOffer(call, function(sdp) {
                    logger.info("onStateChange.transferEvent.createReOffer: sdp " + sdp);
                    _callControlService.respondCallUpdate(call.id, sdp, function() {
                        logger.info("Slow Start Offer respondCallUpdate successful. callId: " + call.id);
                        self.delegateToCallFSM(call, fsmNotificationEvent.slowStartOfferProcessed_JSL);
                        triggerQueue(call);
                    }, function(errorStr) {
                        logger.error("Slow Start Offer respondCallUpdate FAILED!! - " + errorStr);
                        handleRequestFailure(call);
                    });
                }, function(errorStr) {
                    logger.error("Slow Start Offer createReOffer FAILED!! - " + errorStr);
                    handleWebrtcFailure(call);
                    });
                break;
            case transferEvent.performReconnectWorkaround_fsm:
                _webRtcManager.createReOffer(call, function createReOfferSuccessCallback(sdp)
                {
                    logger.info("onStateChange.transferEvent.createReOffer : sdp " + sdp);
                    _callControlService.reinvite(call.id, sdp, function reInviteSuccessCallback() {
                        setNotificationStateOfCallToIdle(call);
                        _webRtcManager.addLocalStream(call);
                        logger.info("callControlService.reinvite successful. callId: " + call.id);
                    }, function() {
                        self.delegateToCallFSM(call, fsmNotificationEvent.requestFailure_JSL);
                    });
                }, function(errorStr) {
                    handleWebrtcFailure(call);
                }, true);
                break;
            case transferEvent.remoteUnHolding_fsm:
                isLocalHold = (call.previousState === fsmState.LOCAL_HOLD) || (call.previousState === fsmState.BOTH_HOLD);
                _webRtcManager.processHold(call, false, isLocalHold, function(sdp) {
                    logger.info("onStateChange.transferEvent.remoteUnHold_fsm->processHold : sdp " + sdp);
                    _callControlService.respondCallUpdate(call.id, sdp, function() {
                        logger.info("Remote UnHold Transfer Event successful. callId: " + call.id);
                        self.delegateToCallFSM(call, fsmNotificationEvent.remoteUnHoldProcessed_JSL);
                    }, function(errorStr) {
                        logger.error("Remote UnHold Transfer Event FAILED!! - " + errorStr);
                        handleRequestFailure(call);
                    });
                }, function(errorStr) {
                    logger.error("Remote UnHold FAILED!! - " + errorStr);
                    handleWebrtcFailure(call);
                });
                break;
            case transferEvent.renegotiationCompleted_fsm:
                triggerCallState(callStates.RENEGOTIATION);
            break;
            case transferEvent.remoteOffer_fsm:
            case transferEvent.remoteCallUpdate_fsm:
                _webRtcManager.processUpdate(call, function(sdp) {
                    logger.info("onStateChange.transferEvent.remoteCallUpdate_fsm->processUpdate : sdp " + sdp);
                    _callControlService.respondCallUpdate(call.id, sdp, function() {
                        logger.info("Remote Call Update Transfer Event Successful. callId: " + call.id);
                        self.delegateToCallFSM(call, fsmNotificationEvent.remoteOfferProcessed_JSL);
                    }, function(errorStr) {
                        logger.error("Remote Call Update Transfer Event FAILED!! - " + errorStr);
                        handleRequestFailure(call);
                    });
                }, function(errorStr) {
                    logger.error("Remote Call Update FAILED!! - " + errorStr);
                    handleWebrtcFailure(call);
                }, call.currentState === fsmState.LOCAL_HOLD ? true : false);
                break;
            case transferEvent.respondCallHoldUpdate_fsm:
                isJoin = call.call.getJoin();
                _webRtcManager.processHoldRespond(call, function() {
                    logger.info("Respond Call Hold Update Event Successful. callId: " + call.id);
                    switch (_callFSM.getCurrentState(call)) {
                        case fsmState.REMOTE_HOLD:
                            triggerCallState(callStates.ON_REMOTE_HOLD);
                            break;
                        case fsmState.LOCAL_HOLD:
                        case fsmState.BOTH_HOLD:
                            triggerCallState(callStates.ON_HOLD);
                            break;
                        case fsmState.COMPLETED:
                            triggerCallState(callStates.IN_CALL);
                            break;
                    }
                    //triggerCallState(callStates.RENEGOTIATION);
                }, function(e) {
                    logger.error("Respond Call Hold Update Event FAILED: " + e);
                    triggerQueue(call);
                }, isJoin);

                //enable clicking
                call.call.setButtonDisabler(false);
                call.call.clearBtnTimeout();

                if (isJoin === true) {
                    call.call.onJoin();
                }

                break;
            case transferEvent.respondCallUpdate_fsm:
                isJoin = call.call.getJoin();

                //enable clicking
                call.call.setButtonDisabler(false);
                call.call.clearBtnTimeout();

                //If this is a join call we need to send join request
                //onJoin() function is created at callController.js
                if (isJoin === true) {
                    _webRtcManager.processRespond(call, function() {
                        logger.info("Respond Call Update Event Successful. callId: " + call.id);
                        triggerCallState(callStates.RENEGOTIATION);
                    }, function(e) {
                        logger.error("Respond Call Update Event FAILED: " + e);
                        triggerQueue(call);
                    }, isJoin);

                    call.call.onJoin();
                } else {
                    _webRtcManager.processRespond(call, function() {
                        logger.info("Respond Call Update Event Successful. callId: " + call.id);
                        switch (_callFSM.getCurrentState(call)) {
                            case fsmState.REMOTE_HOLD:
                                triggerCallState(callStates.ON_REMOTE_HOLD);
                                break;
                            case fsmState.BOTH_HOLD:
                                triggerCallState(callStates.ON_HOLD);
                                break;
                            case fsmState.LOCAL_HOLD:
                                triggerCallState(callStates.ON_HOLD);
                                break;
                            case fsmState.COMPLETED:
                        triggerCallState(callStates.IN_CALL);
                                break;
                        }
                    }, function(e) {
                        logger.error("Respond Call Update Event FAILED: " + e);
                        triggerQueue(call);
                    }, isJoin);
                }
                break;
            case transferEvent.preCallResponse_fsm:
                _webRtcManager.processPreAnswer(call);
                triggerCallState(callStates.RINGING);
                break;
            case transferEvent.forward_fsm:
                clearResources(call);
                break;
            case transferEvent.joining_fsm:
                //if client is handling the refers from referer we need to trigger the refers for partyB and partyC
                if (fcsConfig.clientControlled === "true") {
                    call.referCall = function(referTo, referredBy) {
                        _callControlService.refer(call.id, referTo, referredBy, function() {
                            logger.info("Joining Event Successful. callId: " + call.id);
                            self.delegateToCallFSM(call, fsmNotificationEvent.refer_JSL);
                        }, function(errorStr) {
                            logger.error("Joining Event FAILED!!" + errorStr);
                        });
                    };
                }
                triggerQueue(call);
                break;
            case transferEvent.transferSuccess_fsm:
                _callControlService.endCall(call.id, function() {
                    logger.info("callControlService.endCall successful. callId: " + call.id);
                }, function() {
                    logger.error("callControlService.endCall FAILED!! callId: " + call.id);
                });
                clearResources(call);
                triggerCallState(callStates.TRANSFERRED);
                logger.info("endCall successful. callId: " + call.id);
                break;
            case transferEvent.transferFail_fsm:
                triggerCallState(callStates.ON_HOLD);
                break;
            case transferEvent.stateReverted_fsm:
                //enable clicking
                call.call.setButtonDisabler(false);
                call.call.clearBtnTimeout();

                switch (_callFSM.getCurrentState(call)) {
                    case fsmState.REMOTE_HOLD:
                        triggerCallStateWithoutQueue(callStates.ON_REMOTE_HOLD);
                        break;
                    case fsmState.BOTH_HOLD:
                        triggerCallStateWithoutQueue(callStates.ON_HOLD);
                        break;
                    case fsmState.LOCAL_HOLD:
                        triggerCallStateWithoutQueue(callStates.ON_HOLD);
                        break;
                    case fsmState.COMPLETED:
                        triggerCallStateWithoutQueue(callStates.IN_CALL);
                        break;
                    default:
                        logger.error("CANNOT REVERT THE STATE: " + _callFSM.getCurrentState(call) + ". callId: " + call.id);
                        break;
                }
                break;
            case transferEvent.glareCondition_fsm:
                handleFailure(call, null, null, {
                    handler: call.lastUpdateRequest.handler,
                    args: call.lastUpdateRequest.args,
                    timeout: call.retryAfter});
                break;
            default:
                logger.error("Undefined transition event: " + event + " for " + call.id);
                triggerQueue(call);
                break;

        }

    };

    self.refreshVideoRenderer = function(callid) {
        var internalCall = calls[callid];
        if (internalCall) {
            _webRtcManager.refreshVideoRenderer(internalCall);
        }
    };

    self.hasVideoDevice = function() {
        return _webRtcManager.isVideoSourceAvailable();
    };

    self.hasAudioDevice = function() {
        return _webRtcManager.isAudioSourceAvailable();
    };

    self.hasScreenSharing = function() {
        return _webRtcManager.isScreenSourceAvailable();
    };

    self.getLocalVideoResolutions = function() {
        return _webRtcManager.getLocalVideoResolutions();
    };

    self.getRemoteVideoResolutions = function() {
        return _webRtcManager.getRemoteVideoResolutions();
    };

    self.isCallMuted = function(callid) {
        var call = calls[callid];
        if (call && call.audioMuted) {
            return call.audioMuted;
        }
        return false;
    };

    self.isVideoNegotationAvailable = function(callid) {
        var call = calls[callid];
        if (call.sdp){
            return _sdpParser.isSdpHasVideo(call.sdp);
        } else {
            return false;
        }
    };

    self.getRemoteVideoState = function(callid) {
        var call = calls[callid];
        return call.remoteVideoState;
    };

    self.getHoldStateOfCall = function(callid) {
        var internalCall = calls[callid];
        if (internalCall) {
            return CALL_HOLD_STATES[_callFSM.getCurrentState(internalCall)];
        }
        return undefined;
    };

    self.canOriginatorSendLocalVideo = function(callid) {
        var call = calls[callid];
        if (call) {
            return _webRtcManager.canOriginatorSendLocalVideo(call);
        }
        return false;
    };

    self.canOriginatorReceiveRemoteVideo = function(callid) {
        var call = calls[callid];
        if (call) {
            return _webRtcManager.canOriginatorReceiveRemoteVideo(call);
        }
        return false;
    };

    NotificationCallBacks.call = function handleIncomingCall(data) {
        // disabling the notifications for verizon demo
        if (!fcs.notification.isAnonymous()) {
            var sdp, actions, params, calls,
                    call = null,
                    callid = null,
                    options = {},
                    callParams = data.callNotificationParams,
                    dispositionParams = data.callDispositionParams,
                    sessionParams = data.sessionParams;

            //Since session also include disposition use it as default
            params = sessionParams ? sessionParams : (dispositionParams ? dispositionParams : null);
            logger.info("params: " + params);

            if (params) {
                actions = params.actions;
                logger.info("actions: " + actions);
                if (params.sessionData) {
                    callid = params.sessionData;
                    calls = self.getCalls();
                    if (calls[callid] !== undefined) {
                        logger.info("call already exists: " + callid);
                        return;
                    }
                    logger.info("sessionData: " + callid);
                }
                if (actions) {
                    options.reject = (actions.indexOf("reject", 0) > -1);
                    options.forward = (actions.indexOf("forward", 0) > -1);
                    options.answer = (actions.indexOf("answer", 0) > -1);
                }
                if (params.sdp) {
                    sdp = params.sdp;
                }
            }

            call = new fcs.call.IncomingCall(callid, options);
            call.callerNumber = utils.getProperty(callParams, 'callerDisplayNumber');
            call.callerName = utils.getProperty(callParams, 'callerName');
            call.calleeNumber = utils.getProperty(callParams, 'calleeDisplayNumber');
            call.primaryContact = utils.getProperty(callParams, 'primaryContact');
            if (call.primaryContact) {
                call.primaryContact = call.primaryContact.split(";")[0];
            }

            //create the call in the state machine
            self.incomingCall(call, sdp);

            //notify the callback
            utils.callFunctionIfExist(fcs.call.onReceived, call);
        }
    };

    function handleCallControlNotification(type, data) {
        var sessionParams = data.sessionParams;
        logger.info("CallControl notification received " + type + " sessionData:" + sessionParams.sessionData);
        if (sessionParams.referTo) {
            logger.info("CallControl notification received: " + "referTo:" + sessionParams.referTo + " referredBy: " + sessionParams.referredBy);
        }
        if (sessionParams) {
            self.onNotificationEvent(type, sessionParams);
        }
    }

    NotificationCallBacks.ringing = function(data) {
        handleCallControlNotification(fsmNotificationEvent.ringing_Notify, data);
    };

    NotificationCallBacks.sessionProgress = function(data) {
        //We are discarding the sessionProgress if the SDP is empty
        if (data.sessionParams.sdp !== "") {
            handleCallControlNotification(fsmNotificationEvent.sessionProgress, data);
        }
        else {
            logger.info("Warning: SDP of sessionProgress is empty.");
        }
    };

    NotificationCallBacks.startCallUpdate = function handleStartCallUpdateNotification(data) {
        var sdp = data.sessionParams.sdp,
                notificationEvent = fsmNotificationEvent.startCallUpdate_slowStart_Notify;
        if (sdp) {
            _sdpParser.init(sdp);
            if (_sdpParser.isRemoteHold()) {
                notificationEvent = fsmNotificationEvent.startCallUpdate_remoteHold_Notify;
            }
            else {
                notificationEvent = fsmNotificationEvent.startCallUpdate_remoteOffer_Notify;
            }
        }
        handleCallControlNotification(notificationEvent, data);
    };

    NotificationCallBacks.respondCallUpdate = function handleRespondCallUpdateNotification(data) {
        if (data.sessionParams && data.sessionParams.retryAfter) {
            handleCallControlNotification(fsmNotificationEvent.respondCallUpdate_glareCondition_Notify, data);
        }
        else {
            handleCallControlNotification(fsmNotificationEvent.respondCallUpdate_Notify, data);
        }
    };

    NotificationCallBacks.sessionComplete = function handleSssionCompleteNotification(data) {
        handleCallControlNotification(fsmNotificationEvent.sessionComplete_Notify, data);
    };

    NotificationCallBacks.sessionFail = function handleSessionFailNotification(data) {
        handleCallControlNotification(fsmNotificationEvent.sessionFail_Notify, data);
    };

    NotificationCallBacks.callEnd = function handleCallEndNotification(data) {
        handleCallControlNotification(fsmNotificationEvent.callEnd_Notify, data);
    };

    NotificationCallBacks.trying = function handleTryingNotification(data) {
        handleCallControlNotification(fsmNotificationEvent.trying_Notify, data);
    };

    NotificationCallBacks.callCancel = function handleCallCancelNotification(data) {
        handleCallControlNotification(fsmNotificationEvent.callCancel_Notify, data);
    };

    NotificationCallBacks.accepted = function handleAcceptedNotification(data) {
        handleCallControlNotification(fsmNotificationEvent.accepted_Notify, data);
    };

    globalBroadcaster.subscribe(CONSTANTS.EVENT.DEVICE_SUBSCRIPTION_STARTED, onSubscriptionReEstablished);
    globalBroadcaster.subscribe(CONSTANTS.EVENT.CONNECTION_REESTABLISHED, onConnectionLost);
    globalBroadcaster.subscribe(CONSTANTS.EVENT.NOTIFICATION_CHANNEL_LOST, onConnectionLost);
    if (__testonly__) { self.setCalls = function(_calls){ calls=_calls;}; }
};

var CallManager = function(_webRtcManager, _callFSM, _callControlService,_sdpParser, _logManager) {
    return new CallManagerImpl(_webRtcManager || webRtcManager,
                               _callFSM || callFSM,
                               _callControlService || callControlService,
                               _sdpParser || sdpParser,
                               _logManager || logManager);
};

var callManager = new CallManager();

fcs.asd = callManager;

if (__testonly__) { __testonly__.CallManager = CallManager; }

/**
* Call related resources (IMRN, Click To Call, Call Disposition).
*
* @name call
* @namespace
*
* @memberOf fcs
*
* @version 3.0.5.1
* @since 3.0.0
*/

var CallImpl = function(_manager) {

    var videoDeviceStatus = true,notificationState;

   /**
    * This field provides the state of local video status like "recvonly", "sendrecv", "sendrecv" etc.
    *
    * @name fcs.call.localVideoState
    * @field
    * @type {number}
    * @since 3.0.0
    */
    this.localVideoState = 0;

   /**
    * This field provides the state of remote video status like "recvonly", "sendrecv", "sendrecv" etc.
    *
    * @name fcs.call.remoteVideoState
    * @field
    * @since 3.0.0
    * @type {number}
    */
    this.remoteVideoState = 0;

    /**
    * Sets the handler for received call notifications.
    *
    * @name onReceived
    * @event
    * @since 3.0.0
    * @memberOf fcs.call
    * @param {fcs.call.Call} call The call object
    *
    * @example
    * // This function listens received calls
    * function callReceived(call) {
    *    console.log("There is an incomming call...");
    *
    *    //This function listens call state changes in JSL API level
    *    call.onStateChange = function(state) {
    *        onStateChange(call, state);
    *    };
    *
    *    //This function listens media streams in JSL API level
    *    call.onStreamAdded = function(streamURL) {
    *        // Remote Video is turned on by the other end of the call
    *        // Stream URL of Remote Video stream is passed into this function
    *        onStreamAdded(streamURL);
    *    };
    *
    *    // Answering the incomming call
    *    call.answer(onAnswer, onFailure, isVideoAnswer);
    * }
    *
    * fcs.call.onReceived = callReceived;
    */
    this.onReceived = null;

    /**
    * Initialize the media components in order to provide real time communication.
    * When using FCS Plug-in with audio only the plugin will be added as an hidden object to root of the document.
    * When using FCS Plug-in with both audio and video, the object will be added to the videoContainer.
    *
    * @name fcs.call.initMedia
    * @function
    * @since 3.0.0
    * @param {function} [onSuccess] The onSuccess() to be called when the media have been successfully acquired
    * @param {function} [onFailure] The onFailure({@link fcs.call.MediaErrors}) to be called when media could not be aquired
    * @param {object} [options] The options used for initialization
    * @param {string} [options.type="plugin"] The type of media to use (for future use with webRTC)
    * @param {string} [options.pluginLogLevel="2"] The log level of webrtc plugin
    * @param {object} [options.videoContainer] html node in which to inject the video
    * @param {object} [options.remoteVideoContainer] html node in which to inject the remote video
    * @param {object} [options.localVideoContainer] html node in which to inject the preview of the user camera
    * @param {object} [options.iceserver] ice server ip address ex: [{"url" : "stun:206.165.51.23:3478"}]
    * @param {object} [options.pluginMode=LEGACY] use downloaded plugin which disables webrtc capabilities of browser if avaliable (DEPRECATED. See {@link fcs.setup} for the new usage. )
    * @param {object} [options.pluginMode=WEBRTC] use downloaded plugin which overrides webrtc capabilities of browser if avaliable (DEPRECATED. See {@link fcs.setup} for the new usage. )
    * @param {object} [options.pluginMode=AUTO] use webrtc capabilities of browser if avaliable otherwise force user to download plugin (DEPRECATED. See {@link fcs.setup} for the new usage. )
    * @param {object} [options.webrtcdtls=FALSE] webrtc disabled
    * @param {object} [options.webrtcdtls=TRUE] webrtc enabled
    * @param {object} [options.language="en"] language setting of the plugin
    * @param {object} [options.screenSharing={}] Screensharing options
    * @param {string} [options.screenSharing.chromeExtensionId] The id of the chrome extension that provides access to the screen stream resource.
    *
    * @example
    * &lt;script&gt;
    * fcs.setup(
    *   {
    *       notificationType: fcs.notification.NotificationTypes.WEBSOCKET,
    *       websocketProtocol : 'wss',
    *       websocketIP: '1.1.1.1',
    *       websocketPort : '8581',
    *       clientIp: 'IP Address',
    *       restUrl: 'http://ip:port',
    *       restPort": '443',
    *       callAuditTimer: 30000,
    *       clientControlled : true,
    *       pluginMode: {
    *           mode: 'webrtc',
    *           h264: false,
    *           chrome: {
    *               mode: 'auto'
    *           },
    *           firefox: {
    *               version: '38+',
    *               mode: 'auto'
    *           }
    *       }
    *   );
    *
    *   // Media options
    *   var mediaOptions = {
    *       "notificationType": "websocket",
    *       "iceserver": [{"url":"stun:206.165.51.69:3478"}],
    *                       [{"url":"turn:206.165.51.69:3478",
    *                       "credential":""}]
    *       "webrtcdtls": false,
    *       "language": "fr",
    *       "videoContainer": document.getElementById("defaultVideoContainer")
    *   };
    *
    *   // Initializing media
    *   fcs.call.initMedia(
    *       function() {
    *           console.log("Media was initialized successfully!");
    *       },
    *       function(error) {
    *           switch(error) {
    *               case fcs.call.MediaErrors.WRONG_VERSION : // Alert
    *                   console.log("Media Plugin Version Not Supported");
    *                   break;
    *
    *               case fcs.call.MediaErrors.NEW_VERSION_WARNING : //Warning
    *                   console.log("New Plugin Version is available");
    *                   break;
    *
    *               case fcs.call.MediaErrors.NOT_INITIALIZED : // Alert
    *                   console.log("Media couldn't be initialized");
    *                   break;
    *
    *               case fcs.call.MediaErrors.NOT_FOUND : // Alert
    *                   console.log("Plugin couldn't be found!");
    *                   break;
    *           }
    *       },
    *       mediaOptions
    *   );
    * &lt;/script&gt;
    *
    * &lt;div id="defaultVideoContainer"&gt;&lt;/div&gt;
    */

    this.initMedia = _manager.initMedia;

    /**
    * Starts a call.
    *
    * @name fcs.call.startCall
    * @function
    * @since 3.0.0
    * @param {string} from The caller's address (e.g. SIP URI) used to establish the call
    * @param {object} [contact] Contains users firstName and lastName
    * @param {string} [contact.firstName="John"] First Name of the user
    * @param {string} [contact.lastName="Doe"] Last Name of the user
    * @param {string} to The callee's address (e.g. SIP URI) used to establish the call
    * @param {function} onSuccess The onSuccess({@link fcs.call.OutgoingCall}) callback function to be called<
    * @param {function} onFailure The onFailure({@link fcs.Errors}) callback function to be called
    * @param {boolean} [isVideoEnabled] This will add m=video to SDP
    * @param {boolean} [sendInitialVideo] In order to make video call set this to true
    * @param {string} [videoQuality] Sets the quality of video
    *
    * @example
    * // Make Voice Call
    * // Start a voice call to the uri indicated with "to" argument
    * // Login is a prerequisite for making calls
    * // contact is an object with two fields contact.firstName and contact.lastName that specifies caller info
    * fcs.call.startCall(fcs.getUser(), contact, to,
    *      function(outgoingCall){
    *                //get callid for your web app to be used later for handling popup windows
    *                var callId = outgoingCall.getId();
    *
    *                outgoingCall.onStateChange = function(state,statusCode){
    *                //Add statusCode that returned from the server property to the call
    *                outgoingCall.statusCode = statusCode;
    *                //Put your web app code to handle call state change like ringing, onCall ...etc.
    *	    };
    *
    *       outgoingCall.onStreamAdded = function(streamURL){
    *           // Setting up source (src tag) of remote video container
    *           $("#remoteVideo").attr("src", streamURL);
    *       };
    *    },
    *    function(){
    *       //put your web app failure handling code
    *       window.alert("CALL_FAILED");
    *    },
    *    false, false);
    *
    */

    this.startCall = _manager.start;

    /**
    * Sets log severity level for Webrtc Plugin (not used for native webrtc)
    * 5 levels(sensitive:0, verbose:1, info:2, warning:3, error:4)
    *
    * @name fcs.call.set_logSeverityLevel
    * @function
    * @since 3.0.0
    */

    this.set_logSeverityLevel = _manager.set_logSeverityLevel;

    /**
    * Enables log callback for Webrtc Plugin (not used for native webrtc)
    *
    * @name fcs.call.enable_logCallback
    * @function
    * @since 3.0.0
    */

    this.enable_logCallback = _manager.enable_logCallback;

    /**
    * Disables log callback for Webrtc Plugin (not used for native webrtc)
    *
    * @name fcs.call.disable_logCallback
    * @function
    * @since 3.0.0
    */

    this.disable_logCallback = _manager.disable_logCallback;

    /**
    * Gets audioInDeviceCount
    *
    * @name fcs.call.get_audioInDeviceCount
    * @function
    * @since 3.0.0
    */

    this.get_audioInDeviceCount = _manager.get_audioInDeviceCount;

    /**
    * Gets audioOutDeviceCount
    *
    * @name fcs.call.get_autioOutDeviceCount
    * @function
    * @since 3.0.0
    */

    this.get_audioOutDeviceCount = _manager.get_audioOutDeviceCount;

    /**
    * Gets videoDeviceCount
    *
    * @name fcs.call.get_videoDeviceCount
    * @function
    * @since 3.0.0
    */

    this.get_videoDeviceCount = _manager.get_videoDeviceCount;

    /**
    * Returns Video Device(Camera) availability
    * @name fcs.call.hasVideoDevice
    * @function
    * @since 3.0.0
    * @example
    * if(fcs.call.hasVideoDevice()){
    *     // If there is a video device available, show local video container
    *     callView.toggleLocalVideo(true);
    * }
    */
    this.hasVideoDevice = _manager.hasVideoDevice;

    /**
    * Returns Audio Device(Microphone) availability
    * @name fcs.call.hasAudioDevice
    * @function
    * @since 3.0.0
    * @example
    * if(!fcs.call.hasAudioDevice()){
    *     window.alert("There is no available audio source!");
    * }
    */
    this.hasAudioDevice = _manager.hasAudioDevice;


    /**
    * Gets User Media functionality for plugin
    * Only works with PLUGIN
    *
    * @name fcs.call.getUserMedia
    * @function
    * @since 3.0.0
    * @example
    * fcs.call.getUserMedia(
    *    function(mediaInfo){
    *        window.console.log("media initialized. mediaInfo: " + JSON.stringify(mediaInfo));
    *    },
    *    function(err){
    *        window.console.log("media initialization error " + err);
    *    },
    *    {
    *        "audio": true,
    *        "video": true,
    *        "audioIndex":0,
    *        "videoIndex":0
    *    }
    * );
    */

    this.getUserMedia = _manager.getUserMedia;

    /**
    * Shows device settings Window
    * Only works with PLUGIN
    *
    * @name fcs.call.showSettingsWindow
    * @function
    * @since 3.0.0
    * @example
    * $("#device_settings_button").click(function() {
    *    fcs.call.showSettingsWindow();
    * });
    */

    this.showSettingsWindow = _manager.showSettingsWindow;

    /**
    * Gets local video resolutions with the order below
    * localVideoHeight-localVideoWidth
    * Only works with PLUGIN
    *
    * @name fcs.call.getLocalVideoResolutions
    * @function
    * @since 3.0.0
    * @example
    * var pluginLocalVideoResolution = fcs.call.getLocalVideoResolutions();
    * var localVideoHeight = pluginLocalVideoResolution[0];
    * var localVideoWidth = pluginLocalVideoResolution[1];
    * console.log("Local Video Dimensions: " + localVideoWidth + "," + localVideoHeight);
    */

    this.getLocalVideoResolutions = _manager.getLocalVideoResolutions;

    /**
    * Gets remote video resolutions with the order below
    * remoteVideoHeight-remoteVideoWidth
    * Only works with PLUGIN
    *
    * @name fcs.call.getRemoteVideoResolutions
    * @function
    * @since 3.0.0
    * @example
    * var pluginRemoteVideoResolution = fcs.call.getRemoteVideoResolutions();
    * var remoteVideoHeight = pluginRemoteVideoResolution[0];
    * var remoteVideoWidth = pluginRemoteVideoResolution[1];
    * console.log("Remote Video Dimensions: " + remoteVideoWidth + "," + remoteVideoHeight);
    */

    this.getRemoteVideoResolutions = _manager.getRemoteVideoResolutions;

    /**
    * Shows if plugin is enabled.
    * Only works with PLUGIN
    *
    * @name fcs.call.isPluginEnabled
    * @function
    * @since 3.0.0
    * @example
    * if(fcs.call.isPluginEnabled()) {
    *     $("#device_settings_details").show();
    * }
    */

    this.isPluginEnabled = _manager.isPluginEnabled;

    this.hasGotCalls = _manager.hasGotCalls;

    /**
    * Retrived a call by Id.
    *
    * This function allow to retrive a call which was cached by the call continuation feature.
    *
    * @name fcs.call.getIncomingCallById
    * @function
    * @since 3.0.0
    * @param {string} id from The id of the incoming call
    * @returns {fcs.call.IncomingCall}
    *
    */
    this.getIncomingCallById = function(id) {
        return _manager.getIncomingCallById(id);
    };

    /**
    * Create a renderer for an audio/video stream
    *
    * @name fcs.call.createStreamRenderer
    * @function
    * @since 3.0.0
    * @param {string} streamUrl The url of the stream
    * @param {object} container The DOM node into which to create the renderer (the content of the node will be cleared)
    * @param {object} options The options to be used for the renderer
    * @returns {Object} renderer Renderer object
    *
    */
    this.createStreamRenderer = _manager.createStreamRenderer;

    /**
    * Discpose of a previously created renderer
    *
    * @name fcs.call.disposeStreamRenderer
    * @function
    * @since 3.0.0
    * @param {object} container The DOM node into which the renderer was previously created
    */
    this.disposeStreamRenderer = _manager.disposeStreamRenderer;

    /**
    * States of the Call.
    * @name States
    * @enum {number}
    * @since 3.0.0
    * @readonly
    * @memberOf fcs.call
    * @property {number} [IN_CALL=0] The call has been established.
    * @property {number} [ON_HOLD=1] The call has been put on hold.
    * @property {number} [RINGING=2] The outgoing call is ringing.
    * @property {number} [ENDED=3] The call has been terminated.
    * @property {number} [REJECTED=4] The outgoing call request has been rejected by the other party.
    * @property {number} [OUTGOING=5] The outgoing call request has been sent but no response have been received yet.
    * @property {number} [INCOMING=6] The incoming call has been received but has not been answered yet.
    * @property {number} [ANSWERING=7] The incoming call has been answered but the call as not been establish yet.
    * @property {number} [JOINED=8] The call is joined.
    * @property {number} [RENEGOTIATION=9] The call is re-established.
    * @property {number} [TRANSFERRED=10] The call is treansffered to a third party
    * @property {number} [ON_REMOTE_HOLD=11] The call has been put on hold remotely.
    */
    this.States = _manager.CALL_STATES;

    /**
    * Hold states of the Call.
    * @name HoldStates
    * @enum {number}
    * @since 3.0.0
    * @readonly
    * @memberOf fcs.call
    * @property {number} [LOCAL_HOLD=0] The call has been put on hold locally.
    * @property {number} [REMOTE_HOLD=1] The call has been put on hold remotely.
    * @property {number} [BOTH_HOLD=2] he call has been put on both locally and remotely.
    */
    this.HoldStates = _manager.CALL_HOLD_STATES;

    /**
    * Type of media initialization errors.
    * @name MediaErrors
    * @enum {number}
    * @since 3.0.0
    * @readonly
    * @memberOf fcs.call
    * @property {number} [NOT_FOUND=1] No media source available.
    * @property {number} [NOT_ALLOWED=2] User did not allow media use.
    * @property {number} [OPTIONS=3] Missing or wrong use of options.
    * @property {number} [WRONG_VERSION=4] The version of the plugin is not supported.
    * @property {number} [NOT_INITIALIZED=5] The media is not initialized.
    * @property {number} [NEW_VERSION_WARNING=6] New plugin version is available.
    * @property {number} [NO_SCREENSHARING_WARNING=7] Screen sharing is not possible with this browser or the
    *                                                 screensharing extension could not be found.
    */
    this.MediaErrors = {

        NOT_FOUND: 1,

        NOT_ALLOWED: 2,

        OPTIONS: 3,

        WRONG_VERSION: 4,

        NOT_INITIALIZED: 5,

        NEW_VERSION_WARNING: 6,

        NO_SCREENSHARING_WARNING: 7
    };

    /**
    * Call a party through a client device using the Click To Call service.
    *
    * @name fcs.call.clickToCall
    * @function
    * @since 3.0.0
    * @param {string} callingParty The caller's address (e.g. SIP) used to establish the call
    * @param {string} calledParty The callee's address (e.g. SIP) used to establish the call
    * @param {function} onSuccess The onSuccess() callback to be called
    * @param {function} onFailure The onFailure({@link fcs.Errors}) callback to be called
    *
    * @example
    * var onSuccess = function(){
    *    //do something here
    * };
    * var onError = function (err) {
    *   //do something here
    * };
    *
    * fcs.call.clickToCall("user1@test.com", "user2@test.com", onSuccess, onError);
    */

    this.clickToCall = _manager.clickToCall;

   /**
    * Provide the user with a routable PSTN number as a result of an IMRN allocation request.
    *
    * @name fcs.call.getIMRN
    * @function
    * @param {string} realm The pool of numbers from which IMRN will be allocated
    * @param {string} source The URI of the individual placing the call
    * @param {string} destination The URI of the individual receiving the call
    * @param {function} onSuccess The onSuccess() callback to be called
    * @param {function} onFailure The onFailure({@link fcs.Errors}) callback to be called
    */

    this.getIMRN = _manager.getIMRN;

    /**
     * Call is super class of {@link fcs.call.IncomingCall} and {@link fcs.call.OutgoingCall}
     *
     * @name Call
     * @class
     * @since 3.0.0
     * @memberOf fcs.call
     * @param {String} callid Unique identifier for the call
     * @version 3.0.5.1
     * @since 3.0.0
     */
    this.Call = function(callid){};

    /**
    * When an incoming call is received, {@link fcs.call.event:onReceived} handler will be invoked.
    *
    * @name IncomingCall
    * @class
    * @since 3.0.0
    * @memberOf fcs.call
    * @augments fcs.call.Call
    * @param {String} callid Unique identifier for the call
    * @param {Object} data options
    * @version 3.0.5.1
    * @since 3.0.0
    */
    this.IncomingCall = function(callid, data){
        var id = callid, options = data, sendVideo = true, receiveVideo = true, receivingVideo = false, isJoin = false, buttonDisabler = false, btnTimeout, auditTimer;

        this.notificationQueue = new utils.Queue();

        /**
         * Sets the handler for listening local video stream ready event.
         *
         * @name fcs.call.IncomingCall#onLocalStreamAdded
         * @function
         * @since 3.0.0.1
         *
         **/
        this.onLocalStreamAdded = null;

        /**
         * Sets the handler for listening remote video stream ready event.
         *
         * @name fcs.call.IncomingCall#onStreamAdded
         *
         * @function
         * @since 2.0.0
         * @param {?String} streamUrl remote video streamUrl
         *
         **/
        this.onStreamAdded = null;

        /**
       * @name fcs.call.IncomingCall#calleeNumber
       * @field
       * @since 3.0.0
       * @type {String}
       *
       * @example
       *
       * When an incoming call is received, {@link fcs.call.event:onReceived} handler will be invoked.
       *
       * var incomingCall = {};
       * fcs.call.onReceived = function(call) {
       *    incomingCall = call;
       * };
       *
       * incomingCall.calleeNumber;
       */

        /**
       * @name fcs.call.IncomingCall#callerNumber
       * @field
       * @since 3.0.0
       * @type {String}
       *
       * @example
       *
       * When an incoming call is received, {@link fcs.call.event:onReceived} handler will be invoked.
       *
       * var incomingCall = {};
       * fcs.call.onReceived = function(call) {
       *    incomingCall = call;
       * };
       *
       * incomingCall.callerNumber;
       */

        /**
       * @name fcs.call.IncomingCall#callerName
       * @field
       * @since 3.0.0
       * @type {String}
       *
       * @example
       *
       * When an incoming call is received, {@link fcs.call.event:onReceived} handler will be invoked.
       *
       * var incomingCall = {};
       * fcs.call.onReceived = function(call) {
       *    incomingCall = call;
       * };
       *
       * incomingCall.callerName;
       */

        /**
       * @name fcs.call.IncomingCall#primaryContact
       * @field
       * @since 3.0.0
       * @type {String}
       *
       * @example
       *
       * When an incoming call is received, {@link fcs.call.event:onReceived} handler will be invoked.
       *
       * var incomingCall = {};
       * fcs.call.onReceived = function(call) {
       *    incomingCall = call;
       * };
       *
       * incomingCall.primaryContact;
       */


        /**
         * Puts the speaker into mute.
         *
         * @name fcs.call.IncomingCall#mute
         * @function
         * @since 3.0.0
         *
         * @example
         *
         * When an incoming call is received, {@link fcs.call.event:onReceived} handler will be invoked.
         *
         * var incomingCall = {};
         * fcs.call.onReceived = function(call) {
         *    incomingCall = call;
         * };
         *
         * incomingCall.mute();
         */
        this.mute = function(){
            _manager.mute(id, true);
        };

        /**
         * Puts the speaker into unmute.
         *
         * @name fcs.call.IncomingCall#unmute
         * @function
         * @since 3.0.0
         *
         * @example
         *
         * When an incoming call is received, {@link fcs.call.event:onReceived} handler will be invoked.
         *
         * var incomingCall = {};
         * fcs.call.onReceived = function(call) {
         *    incomingCall = call;
         * };
         *
         * incomingCall.unmute();
         */
        this.unmute = function(){
            _manager.mute(id, false);
        };

        /**
         * Answers the call.
         * @name fcs.call.IncomingCall#answer
         * @function
         * @since 3.0.0
         * @param {function} onSuccess The onSuccess() callback function to be called
         * @param {function} onFailure The onFailure({@link fcs.Errors}) callback function to be called
         * @param {boolean} [isVideoEnabled] Start call with video or not
         * @param {String} [videoQuality] Video quality
         *
         * @example
         *
         * When an incoming call is received, {@link fcs.call.event:onReceived} handler will be invoked.
         *
         * var incomingCall = {};
         * fcs.call.onReceived = function(call) {
         *    incomingCall = call;
         * };
         *
         * var onSuccess = function(){
         *    //do something here
         * };
         * var onError = function (err) {
         *   //do something here
         * };
         *
         * incomingCall.answer(onSuccess, onFailure, true, "1280x720");
         */
        this.answer = function(onSuccess, onFailure, isVideoEnabled, videoQuality){
            if(options.answer){
                _manager.answer(id, onSuccess, onFailure, isVideoEnabled, videoQuality);
            } else {
                onFailure();
            }
        };

        /**
         * Rejects the call
         *
         * @name fcs.call.IncomingCall#reject
         * @function
         * @since 3.0.0
         * @param {function} onSuccess The onSuccess() callback function to be called
         * @param {function} onFailure The onFailure({@link fcs.Errors}) callback function to be called
         *
         * @example
         *
         * When an incoming call is received, {@link fcs.call.event:onReceived} handler will be invoked.
         *
         * var incomingCall = {};
         * fcs.call.onReceived = function(call) {
         *    incomingCall = call;
         * };
         *
         * var onSuccess = function(){
         *    //do something here
         * };
         * var onError = function (err) {
         *   //do something here
         * };
         *
         * incomingCall.reject(onSuccess, onFailure);
         */
        this.reject = function(onSuccess, onFailure) {
            if(options.reject){
                _manager.reject(id, onSuccess, onFailure);
            } else {
                onFailure();
            }
        };

        /**
         * Ignores the call. Client will not send any rest request for this one. Ignore is on client side only.
         *
         * @name fcs.call.IncomingCall#ignore
         * @function
         * @since 3.0.0
         * @param {function} onSuccess The onSuccess() callback function to be called
         * @param {function} onFailure The onFailure({@link fcs.Errors}) callback function to be called
         *
         * @example
         *
         * When an incoming call is received, {@link fcs.call.event:onReceived} handler will be invoked.
         *
         * var incomingCall = {};
         * fcs.call.onReceived = function(call) {
         *    incomingCall = call;
         * };
         *
         * var onSuccess = function(){
         *    //do something here
         * };
         * var onError = function (err) {
         *   //do something here
         * };
         *
         * incomingCall.ignore(onSuccess, onFailure);
         */
        this.ignore = function(onSuccess, onFailure) {
            _manager.ignore(id, onSuccess, onFailure);
        };

        /**
         * Forwards the call.
         *
         * @name fcs.call.IncomingCall#forward
         * @function
         * @since 3.0.0
         * @param {string} address The address where the call is transferred (e.g. SIP URI)
         * @param {function} onSuccess The onSuccess() callback function to be called
         * @param {function} onFailure The onFailure({@link fcs.Errors}) callback function to be called
         *
         * @example
         *
         * When an incoming call is received, {@link fcs.call.event:onReceived} handler will be invoked.
         *
         * var incomingCall = {};
         * fcs.call.onReceived = function(call) {
         *    incomingCall = call;
         * };
         *
         * var onSuccess = function(){
         *    //do something here
         * };
         * var onError = function (err) {
         *   //do something here
         * };
         *
         * incomingCall.forward("user1@test.com", onSuccess, onFailure);
         */
        this.forward = function(address, onSuccess, onFailure) {
            if(options.forward){
                _manager.forward(id, address, onSuccess, onFailure);
            } else {
                onFailure();
            }
        };

        /**
         *
         * Checks the incoming call if it has reject option.
         *
         * @name fcs.call.IncomingCall#canReject
         * @function
         * @since 3.0.0
         * @returns {Boolean}
         *
         * @example
         *
         * When an incoming call is received, {@link fcs.call.event:onReceived} handler will be invoked.
         *
         * var incomingCall = {};
         * fcs.call.onReceived = function(call) {
         *    incomingCall = call;
         * };
         *
         * incomingCall.canReject();
         */
        this.canReject = function(){
            return options.reject === true;
        };

        /**
         *
         * Checks the incoming call if it has forward option.
         *
         * @name fcs.call.IncomingCall#canForward
         * @function
         * @since 3.0.0
         * @returns {Boolean}
         *
         * @example
         *
         * When an incoming call is received, {@link fcs.call.event:onReceived} handler will be invoked.
         *
         * var incomingCall = {};
         * fcs.call.onReceived = function(call) {
         *    incomingCall = call;
         * };
         *
         * incomingCall.canForward();
         */
        this.canForward = function(){
            return options.forward === true;
        };

        /**
         * Checks the incoming call if it has answer option.
         *
         * @name fcs.call.IncomingCall#canAnswer
         * @function
         * @since 3.0.0
         * @returns {Boolean}
         *
         * @example
         *
         * When an incoming call is received, {@link fcs.call.event:onReceived} handler will be invoked.
         *
         * var incomingCall = {};
         * fcs.call.onReceived = function(call) {
         *    incomingCall = call;
         * };
         *
         * incomingCall.canAnswer();
         */
        this.canAnswer = function(){
            return options.answer === true;
        };

        /**
         * Are we able to send video.
         * Ex: Client may try to send video but video cam can be unplugged. Returns false in that case
         *
         * @name fcs.call.IncomingCall#canSendVideo
         * @function
         * @since 3.0.0
         * @returns {Boolean}
         *
         * @example
         *
         * When an incoming call is received, {@link fcs.call.event:onReceived} handler will be invoked.
         *
         * var incomingCall = {};
         * fcs.call.onReceived = function(call) {
         *    incomingCall = call;
         * };
         *
         * incomingCall.canSendVideo();
         */
        this.canSendVideo = function(){
            return _manager.canOriginatorSendLocalVideo(id);
        };

        /**
         * Are we able to send video. Checks the incoming SDP
         *
         * @name fcs.call.IncomingCall#canReceiveVideo
         * @function
         * @since 3.0.0
         * @returns {Boolean}
         *
         * @example
         *
         * When an incoming call is received, {@link fcs.call.event:onReceived} handler will be invoked.
         *
         * var incomingCall = {};
         * fcs.call.onReceived = function(call) {
         *    incomingCall = call;
         * };
         *
         * incomingCall.canReceiveVideo();
         */
        this.canReceiveVideo = function(){
            return _manager.canOriginatorReceiveRemoteVideo(id);
        };

        /**
         * @deprecated DO NOT USE, This will be handled by the framework.
         * Are we able to receive video. Checks the incoming SDP
         *
         * @name fcs.call.IncomingCall#canReceivingVideo
         * @function
         * @since 3.0.0
         * @returns {Boolean}
         *
         * @example
         *
         * When an incoming call is received, {@link fcs.call.event:onReceived} handler will be invoked.
         *
         * var incomingCall = {};
         * fcs.call.onReceived = function(call) {
         *    incomingCall = call;
         * };
         *
         * incomingCall.canReceivingVideo();
         */
        this.canReceivingVideo = function(){
            return receivingVideo;
        };

        /**
         * @deprecated DO NOT USE, This will be handled by the framework.
         * sets the outgoing video condition.
         *
         * @name fcs.call.IncomingCall#setSendVideo
         * @function
         * @since 3.0.0
         * @param {Boolean} videoSendStatus video send status
         *
         * @example
         *
         * When an incoming call is received, {@link fcs.call.event:onReceived} handler will be invoked.
         *
         * var incomingCall = {};
         * fcs.call.onReceived = function(call) {
         *    incomingCall = call;
         * };
         *
         * incomingCall.setSendVideo(true);
         */
        this.setSendVideo = function(videoSendStatus){
            sendVideo = videoDeviceStatus && videoSendStatus;
        };

        /**
         * @deprecated DO NOT USE, This will be handled by the framework.
         * sets the outgoing video condition
         *
         * @name fcs.call.IncomingCall#setReceiveVideo
         * @function
         * @since 3.0.0
         * @param {Boolean} videoReceiveStatus video receive status
         *
         * @example
         *
         * When an incoming call is received, {@link fcs.call.event:onReceived} handler will be invoked.
         *
         * var incomingCall = {};
         * fcs.call.onReceived = function(call) {
         *    incomingCall = call;
         * };
         *
         * incomingCall.setReceiveVideo(true);
         */
        this.setReceiveVideo = function(videoReceiveStatus){
            receiveVideo = videoReceiveStatus;
        };

        /**
         * @deprecated DO NOT USE, This will be handled by the framework.
         * sets the incoming video condition
         *
         * @name fcs.call.IncomingCall#setReceivingVideo
         * @function
         * @since 3.0.0
         * @param {Boolean} isReceiving video receive status
         *
         * @example
         *
         * When an incoming call is received, {@link fcs.call.event:onReceived} handler will be invoked.
         *
         * var incomingCall = {};
         * fcs.call.onReceived = function(call) {
         *    incomingCall = call;
         * };
         *
         * incomingCall.setReceivingVideo(true);
         */
        this.setReceivingVideo = function(isReceiving){
            receivingVideo = isReceiving;
        };

         /**
         * Returns hold state of call.
         *
         * @name fcs.call.IncomingCall#getHoldState
         * @function
         * @since 3.0.4
         * @returns {@link fcs.HoldStates} or undefined if call has not been put
         * on hold.
         *
         * @example
         *
         * When an incoming call is received, {@link fcs.call.event:onReceived} handler will be invoked.
         *
         * var incomingCall = {};
         * fcs.call.onReceived = function(call) {
         *    incomingCall = call;
         * };
         *
         * incomingCall.getHoldState();
         */
        this.getHoldState = function() {
            return _manager.getHoldStateOfCall(id);
        };

        /**
         * Gets call id.
         *
         * @name fcs.call.IncomingCall#getId
         * @function
         * @since 3.0.0
         * @returns {id} Unique identifier for the call
         *
         * @example
         *
         * When an incoming call is received, {@link fcs.call.event:onReceived} handler will be invoked.
         *
         * var incomingCall = {};
         * fcs.call.onReceived = function(call) {
         *    incomingCall = call;
         * };
         *
         * incomingCall.getId();
         */
        this.getId = function(){
            return id;
        };

        /**
         * End the call
         *
         * @name fcs.call.IncomingCall#end
         * @function
         * @since 3.0.0
         * @param {function} onSuccess The onSuccess() callback function to be called
         *
         * @example
         *
         * When an incoming call is received, {@link fcs.call.event:onReceived} handler will be invoked.
         *
         * var incomingCall = {};
         * fcs.call.onReceived = function(call) {
         *    incomingCall = call;
         * };
         *
         * var onSuccess = function(){
         *    //do something here
         * };
         *
         * incomingCall.end(onSuccess);
         */
        this.end = function(onSuccess){
            _manager.end(id, onSuccess);
        };

        /**
          * Holds the call.
          *
          * @name fcs.call.IncomingCall#hold
          * @function
          * @since 3.0.0
          * @param {function} onSuccess The onSuccess() callback function to be called
          * @param {function} onFailure The onFailure({@link fcs.Errors}) callback function to be called
          *
          * @example
          *
          * When an incoming call is received, {@link fcs.call.event:onReceived} handler will be invoked.
          *
          * var incomingCall = {};
          * fcs.call.onReceived = function(call) {
          *    incomingCall = call;
          * };
          *
          * var onSuccess = function(){
          *    //do something here
          * };
          * var onFailure = function(err){
          *    //do something here
          * };
          *
          * incomingCall.hold(onSuccess, onFailure);
          */
        this.hold = function(onSuccess, onFailure){
            _manager.hold(callid, onSuccess, onFailure);
        };

        /**
         * Resume the call.
         *
         * @name fcs.call.IncomingCall#unhold
         * @function
         * @since 3.0.0
         * @param {function} onSuccess The onSuccess() callback function to be called
         * @param {function} onFailure The onFailure({@link fcs.Errors}) callback function to be called
         *
         * @example
         *
         * When an incoming call is received, {@link fcs.call.event:onReceived} handler will be invoked.
         *
         * var incomingCall = {};
         * fcs.call.onReceived = function(call) {
         *    incomingCall = call;
         * };
         *
         * var onSuccess = function(){
         *    //do something here
         * };
         * var onFailure = function(err){
         *    //do something here
         * };
         *
         * incomingCall.unhold(onSuccess, onFailure);
         */
        this.unhold = function(onSuccess,onFailure){
            _manager.unhold(id, onSuccess,onFailure);
        };

        this.directTransfer = function(address,onSuccess,onFailure){
            _manager.directTransfer(id, address, onSuccess,onFailure);
        };

        /**
         * Stop the video for this call after the call is established
         *
         * @name fcs.call.IncomingCall#videoStop
         * @function
         * @since 3.0.0
         * @param {function} onSuccess The onSuccess() callback function to be called
         * @param {function} onFailure The onFailure({@link fcs.Errors}) callback function to be called
         *
         * @example
         *
         * When an incoming call is received, {@link fcs.call.event:onReceived} handler will be invoked.
         *
         * var incomingCall = {};
         * fcs.call.onReceived = function(call) {
         *    incomingCall = call;
         * };
         *
         * var onSuccess = function(){
         *    //do something here
         * };
         * var onFailure = function(err){
         *    //do something here
         * };
         *
         * incomingCall.videoStop(onSuccess, onFailure);
         */
        this.videoStop = function(onSuccess, onFailure){
            _manager.videoStopStart(callid, onSuccess, onFailure, false);
        };

        /**
         * Start the video for this call after the call is established
         *
         * @name fcs.call.IncomingCall#videoStart
         * @function
         * @since 3.0.0
         * @param {function} onSuccess The onSuccess() callback function to be called
         * @param {function} onFailure The onFailure() callback function to be called
         * @param {string} [videoQuality] Sets the quality of video, this parameter will be passed to getUserMedia()
         *                  if the video source is allowed before, this parameter will not be used
         *
         * @example
         *
         * When an incoming call is received, {@link fcs.call.event:onReceived} handler will be invoked.
         *
         * var incomingCall = {};
         * fcs.call.onReceived = function(call) {
         *    incomingCall = call;
         * };
         *
         * var onSuccess = function(){
         *    //do something here
         * };
         * var onFailure = function(err){
         *    //do something here
         * };
         *
         * incomingCall.videoStart(onSuccess, onFailure);
         */
        this.videoStart = function(onSuccess, onFailure, videoQuality){
            _manager.videoStopStart(callid, onSuccess, onFailure, true, videoQuality);
        };

        /**
         * Start sharing the screen for this call after the call is established.
         *
         * @name fcs.call.IncomingCall#screenSharingStart
         * @function
         * @param {function} [onSuccess] The onSuccess() to be called when the screen sharing is started
         * @param {function} [onFailure] The onFailure() to be called when the screen sharing could not be started
         * @param {function} [onStopped] The onStopped() to be called when the user has clicked to stop sharing the screen.
         * @param {object} [options] The screen sharing options
         * @param {number} [options.width=1024] The width of the screen to request.
         * @param {number} [options.height=768] The height of the screen to request.
         * @param {number} [options.frameRate=15] The number of frames per second to request.
         */
        this.screenSharingStart = function(onSuccess, onFailure, onStopped, options){
             callManager.screenStopStart(callid, onSuccess, onFailure, onStopped, true, options);
        };

        /**
         * Stop sharing the screen for this call after the call is established.
         *
         * @name fcs.call.OutgoingCall#screenSharingStop
         * @function
         * @param {function} [onSuccess] The onSuccess() to be called when the screen sharing is stopped.
         * @param {function} [onFailure] The onFailure() to be called when the screen sharing could not be stopped.
         */
        this.screenSharingStop = function(onSuccess, onFailure){
            callManager.screenStopStart(callid, onSuccess, onFailure, null, false);
        };

        /**
         * Join 2 calls
         * You need two different calls to establish this functionality.
         * In order to join two calls. both calls must be put in to hold state first.
         * If not call servers will not your request.
         *
         * @name fcs.call.IncomingCall#join
         * @function
         * @since 3.0.0
         * @param {fcs.call.Call} anotherCall Call that we want the current call to be joined to.
         * @param {function} onSuccess The onSuccess({@link fcs.call.Call}) to be called when the call have been joined provide the joined call as parameter
         * @param {function} [onFailure] The onFailure() to be called when media could not be join
         *
         * @example
         *
         * When an incoming call is received, {@link fcs.call.event:onReceived} handler will be invoked.
         *
         * var incomingCall = {};
         * fcs.call.onReceived = function(call) {
         *    incomingCall = call;
         * };
         *
         * And another {@link fcs.call.OutgoingCall} or {@link fcs.call.IncomingCall} is requeired which is going to be joined.
         * var anotherCall; // assume this is previosuly created.
         *
         * var joinOnSuccess = function(joinedCall){
         *    joinedCall // newly created.
         *    //do something here
         * };
         * var joinOnFailure = function(){
         *    //do something here
         * };
         *
         * incomingCall.join(anotherCall, joinOnSuccess, joinOnFailure);
         *
         * When join() is successfuly compeled, joinOnSuccess({@link fcs.call.OutgoingCall}) will be invoked.
         */
        this.join = function(anotherCall, onSuccess, onFailure){
            _manager.join(id, anotherCall.getId(), onSuccess, onFailure);
        };

        /**
         * Send Dual-tone multi-frequency signaling.
         *
         * @name fcs.call.IncomingCall#sendDTMF
         * @function
         * @since 3.0.0
         * @param {String} tone Tone to be send as dtmf.
         *
         * @example
         *
         * When an incoming call is received, {@link fcs.call.event:onReceived} handler will be invoked.
         *
         * var incomingCall = {};
         * fcs.call.onReceived = function(call) {
         *    incomingCall = call;
         * };
         *
         * incomingCall.sendDTMF("0");
         */
        this.sendDTMF = function(tone){
            _manager.sendDTMF(id, tone);
        };

        /**
         * Force the plugin to send a IntraFrame
         * Only used by PLUGIN.
         * This needs to be called when sending video.
         * Solves video freeze issue
         *
         * @name fcs.call.IncomingCall#sendIntraFrame
         * @function
         * @since 3.0.0
         *
         * @example
         *
         * When an incoming call is received, {@link fcs.call.event:onReceived} handler will be invoked.
         *
         * var incomingCall = {};
         * fcs.call.onReceived = function(call) {
         *    incomingCall = call;
         * };
         *
         * incomingCall.sendIntraFrame();
         */
        this.sendIntraFrame = function(){
            if (sendVideo) {
                _manager.sendIntraFrame(id);
            }
        };

        /**
         * Force the plugin to send a BlackFrame
         * Only used by PLUGIN.
         * Some of the SBC's(Session Border Controllers) do not establish one way video.
         * audio only side has to send a blackFrame in order to see the incoming video
         *
         * @name fcs.call.IncomingCall#sendBlackFrame
         * @function
         * @since 3.0.0
         *
         * @example
         *
         * When an incoming call is received, {@link fcs.call.event:onReceived} handler will be invoked.
         *
         * var incomingCall = {};
         * fcs.call.onReceived = function(call) {
         *    incomingCall = call;
         * };
         *
         * incomingCall.sendBlackFrame();
         */
        this.sendBlackFrame = function(){
            _manager.sendBlackFrame(id);
        };

        /**
         * Force the plugin to refresh video renderer
         * with this call's remote video stream
         * Only used by PLUGIN.
         *
         * @name fcs.call.IncomingCall#refreshVideoRenderer
         * @function
         * @since 3.0.0
         *
         * @example
         *
         * When an incoming call is received, {@link fcs.call.event:onReceived} handler will be invoked.
         *
         * var incomingCall = {};
         * fcs.call.onReceived = function(call) {
         *    incomingCall = call;
         * };
         *
         * incomingCall.refreshVideoRenderer();
         */
        this.refreshVideoRenderer = function(){
            _manager.refreshVideoRenderer(id);
        };

        /**
         * Returns the call is a join call or not
         * Do not use this function if you really dont need it.
         * This will be handled by the framework
         *
         * @name fcs.call.IncomingCall#getJoin
         * @function
         * @since 3.0.0
         * @returns {Boolean} isJoin
         *
         * @example
         *
         * When an incoming call is received, {@link fcs.call.event:onReceived} handler will be invoked.
         *
         * var incomingCall = {};
         * fcs.call.onReceived = function(call) {
         *    incomingCall = call;
         * };
         *
         * incomingCall.getJoin();
         */
        this.getJoin = function() {
            return isJoin;
        };

        /**
         * Marks the call as a join call or not
         * Do not use this function if you really dont need it.
         * This will be handled by the framework
         *
         * @name fcs.call.IncomingCall#setJoin
         * @function
         * @since 3.0.0
         * @param {String} join
         *
         * @example
         *
         * When an incoming call is received, {@link fcs.call.event:onReceived} handler will be invoked.
         *
         * var incomingCall = {};
         * fcs.call.onReceived = function(call) {
         *    incomingCall = call;
         * };
         *
         * incomingCall.setJoin(true);
         */
        this.setJoin = function (join) {
            isJoin = join;
        };

        /**
         * Returns the button is a disabled or not
         * You may want to disable your buttons while waiting for a response.
         * Ex: this will prevent clicking multiple times for hold button until first hold response is not recieved
         *
         * @name fcs.call.IncomingCall#getButtonDisabler
         * @function
         * @since 3.0.0
         * @returns {Boolean} buttonDisabler
         *
         * @example
         *
         * When an incoming call is received, {@link fcs.call.event:onReceived} handler will be invoked.
         *
         * var incomingCall = {};
         * fcs.call.onReceived = function(call) {
         *    incomingCall = call;
         * };
         *
         * incomingCall.getButtonDisabler();
         */
        this.getButtonDisabler = function() {
            return buttonDisabler;
        };

        /**
         * Disable the button after waiting 4000 milliseconds.
         * You may want to disable your buttons while waiting for a response.
         * Ex: this will prevent clicking multiple times for hold button until first hold response is not recieved
         *
         * @name fcs.call.IncomingCall#setButtonDisabler
         * @function
         * @since 3.0.0
         * @param {Boolean} disable
         *
         * @example
         *
         * When an incoming call is received, {@link fcs.call.event:onReceived} handler will be invoked.
         *
         * var incomingCall = {};
         * fcs.call.onReceived = function(call) {
         *    incomingCall = call;
         * };
         *
         * incomingCall.setButtonDisabler(true);
         */
        this.setButtonDisabler = function(disable) {
            buttonDisabler = disable;
            if(buttonDisabler) {
                btnTimeout = setTimeout( function() {
                    buttonDisabler = false;
                },
                4000 );
            }
        };

        /**
         * Clears the timer set with fcs.call.IncomingCall#setButtonDisabler.
         * You may want to disable your buttons while waiting for a response.
         * Ex: this will prevent clicking multiple times for hold button until first hold response is not recieved
         *
         * @name fcs.call.IncomingCall#clearBtnTimeout
         * @function
         * @since 3.0.0
         *
         * @example
         *
         * When an incoming call is received, {@link fcs.call.event:onReceived} handler will be invoked.
         *
         * var incomingCall = {};
         * fcs.call.onReceived = function(call) {
         *    incomingCall = call;
         * };
         *
         * incomingCall.clearBtnTimeout();
         */
        this.clearBtnTimeout = function() {
            clearTimeout(btnTimeout);
        };


        /**
        * Long call audit
        * Creates a timer after call is established.
        * This timer sends a "PUT" request to server.
        * This will continue until one request fails.
        * Handled by framework. You dont need to call this function
        *
        * @name fcs.call.IncomingCall#setAuditTimer
        * @function
        * @since 3.0.0
        * @param {String} audit
        *
        * @example
        *
        * When an incoming call is received, {@link fcs.call.event:onReceived} handler will be invoked.
        * incomingCall.setAuditTimer(audit);
        */
        this.setAuditTimer = function (audit) {
            auditTimer = setInterval(function() {
                audit();
            },
            fcsConfig.callAuditTimer ? fcsConfig.callAuditTimer:30000);
        };


        /**
        * Clears the long call audit prior to clearing all call resources.
        * Handled by framework. you dont need to call this function
        *
        * @name fcs.call.IncomingCall#clearAuditTimer
        * @function
        * @since 3.0.0
        *
        * @example
        *
        * When an incoming call is received, {@link fcs.call.event:onReceived} handler will be invoked.
        */
        this.clearAuditTimer = function() {
            clearInterval(auditTimer);
        };

        this.isCallMuted = function() {
            return _manager.isCallMuted(id);
        };

        /**
         * Returns video negotation availability
         * @name fcs.call.IncomingCall#isVideoNegotationAvailable
         * @function
         * @since 3.0.1
         * @param {String} id Unique identifier for the call
         * @example
         * When an incoming call is received, {@link fcs.call.event:onReceived} handler will be invoked.
         *
         * var incomingCall = {};
         * fcs.call.onReceived = function(call) {
         *    incomingCall = call;
         * };
         *
         * incomingCall.isVideoNegotationAvailable();
         */
        this.isVideoNegotationAvailable = function(id) {
            return _manager.isVideoNegotationAvailable(id);
        };

        /**
         * Returns the state of the remote video.
         * @name fcs.call.IncomingCall#getRemoteVideoState
         * @function
         * @since 3.0.6
         */
        this.getRemoteVideoState = function() {
            return callManager.getRemoteVideoState(this.getId());
        };
    };

    this.IncomingCall.prototype = new this.Call();

    /**
    * @name OutgoingCall
    * @class
    * @memberOf fcs.call
    * @augments fcs.call.Call
    * @param {String} callid Unique identifier for the call
    * @version 3.0.5.1
    * @since 3.0.0
    */
    this.OutgoingCall = function(callid){
        var id = callid, sendVideo = true, receiveVideo = true, receivingVideo = false, isJoin = false, buttonDisabler = false, btnTimeout, auditTimer;

        this.notificationQueue = new utils.Queue();

        /**
         * Sets the handler for listening local video stream ready event.
         *
         * @name fcs.call.OutgoingCall#onLocalStreamAdded
         * @function
         * @since 3.0.0.1
         *
         **/
        this.onLocalStreamAdded = null;

        /**
         * Sets the handler for listening remote video stream ready event.
         *
         * @name fcs.call.OutgoingCall#onStreamAdded
         *
         * @function
         * @since 2.0.0
         * @param {?String} streamUrl remote video streamUrl
         *
         **/
        this.onStreamAdded = null;

        /**
         * Are we able to send video.
         * Ex: Client may try to send video but video cam can be unplugged. Returns false in that case
         *
         * @name fcs.call.OutgoingCall#canSendVideo
         * @function
         * @since 3.0.0
         * @returns {Boolean}
         *
         * @example
         *
         * A previously created {@link fcs.call.OutgoingCall} is required. {@see {@link fcs.call.startCall}} for more details.
         *
         * var outgoingCall = {};
         * fcs.call.startCall(..., ..., ..., onSuccess(outgoingCall), ..., ...);
         * outgoingCall.canSend();
         */
        this.canSendVideo = function(){
            return _manager.canOriginatorSendLocalVideo(id);
        };

        /**
         * Are we able to send video. Checks the incoming SDP
         *
         * @name fcs.call.OutgoingCall#canReceiveVideo
         * @function
         * @since 3.0.0
         * @returns {Boolean}
         *
         * @example
         *
         * A previously created {@link fcs.call.OutgoingCall} is required. {@see {@link fcs.call.startCall}} for more details.
         *
         * var outgoingCall = {};
         * fcs.call.startCall(..., ..., ..., onSuccess(outgoingCall), ..., ...);
         * outgoingCall.canReceiveVideo();
         */
        this.canReceiveVideo = function(){
            return _manager.canOriginatorReceiveRemoteVideo(id);
        };

        /**
         * @deprecated DO NOT USE, This will be handled by the framework.
         * Are we able to receive video. Checks the incoming SDP
         *
         * @name fcs.call.OutgoingCall#canReceivingVideo
         * @function
         * @since 3.0.0
         * @returns {Boolean}
         *
         * @example
         *
         * A previously created {@link fcs.call.OutgoingCall} is required. {@see {@link fcs.call.startCall}} for more details.
         *
         * var outgoingCall = {};
         * fcs.call.startCall(..., ..., ..., onSuccess(outgoingCall), ..., ...);
         * outgoingCall.canReceivingVideo();
         */
        this.canReceivingVideo = function(){
            return receivingVideo;
        };

        /**
         * @deprecated DO NOT USE, This will be handled by the framework.
         * sets the outgoing video condition.
         *
         *
         * @name fcs.call.OutgoingCall#setSendVideo
         * @function
         * @since 3.0.0
         * @param {Boolean} videoSendStatus video send status
         *
         * @example
         *
         * A previously created {@link fcs.call.OutgoingCall} is required. {@see {@link fcs.call.startCall}} for more details.
         *
         * var outgoingCall = {};
         * fcs.call.startCall(..., ..., ..., onSuccess(outgoingCall), ..., ...);
         * outgoingCall.setSendVideo(true);
         */
        this.setSendVideo = function(videoSendStatus){
            sendVideo = videoDeviceStatus && videoSendStatus;
        };

        /**
         * @deprecated DO NOT USE, This will be handled by the framework.
         * sets the outgoing video condition
         *
         * @name fcs.call.OutgoingCall#setReceiveVideo
         * @function
         * @since 3.0.0
         * @param {Boolean} videoReceiveStatus video receive status
         *
         * @example
         *
         * A previously created {@link fcs.call.OutgoingCall} is required. {@see {@link fcs.call.startCall}} for more details.
         *
         * var outgoingCall = {};
         * fcs.call.startCall(..., ..., ..., onSuccess(outgoingCall), onFail(error), ...);
         * outgoingCall.setReceiveVideo(true);
         */
        this.setReceiveVideo = function(videoReceiveStatus){
            receiveVideo = videoReceiveStatus;
        };

        /**
         * @deprecated DO NOT USE, This will be handled by the framework.
         * sets the incoming video condition
         *
         * @name fcs.call.OutgoingCall#setReceivingVideo
         * @function
         * @since 3.0.0
         * @param {Boolean} isReceiving video receive status
         *
         * @example
         *
         * A previously created {@link fcs.call.OutgoingCall} is required. {@see {@link fcs.call.startCall}} for more details.
         *
         * var outgoingCall = {};
         * fcs.call.startCall(..., ..., ..., onSuccess(outgoingCall), ..., ...);
         * outgoingCall.isReceiving(true);
         */
        this.setReceivingVideo = function(isReceiving){
            receivingVideo = isReceiving;
        };

         /**
         * Returns hold state of call.
         *
         * @name fcs.call.OutgoingCall#getHoldState
         * @function
         * @since 3.0.4
         * @returns {@link fcs.HoldStates} or undefined if call has not been put
         * on hold.
         *
         * @example
         *
         * When an outgoingCall call is received, {@link fcs.call.event:onReceived} handler will be invoked.
         *
         * var outgoingCall = {};
         * fcs.call.startCall(..., ..., ..., onSuccess(outgoingCall), ..., ...);
         *
         * outgoingCall.getHoldState();
         */
        this.getHoldState = function() {
            return _manager.getHoldStateOfCall(id);
        };

        /**
         * Gets call id.
         *
         * @name fcs.call.OutgoingCall#getId
         * @function
         * @since 3.0.0
         * @returns {id} Unique identifier for the call
         *
         * @example
         *
         * A previously created {@link fcs.call.OutgoingCall} is required. {@see {@link fcs.call.startCall}} for more details.
         *
         * var outgoingCall = {};
         * fcs.call.startCall(..., ..., ..., onSuccess(outgoingCall), ..., ...);
         * outgoingCall.getId();
         */
        this.getId = function(){
            return id;
        };

        /**
         * Force the plugin to send a IntraFrame
         *
         * @name fcs.call.OutgoingCall#sendIntraFrame
         * @function
         * @since 3.0.0
         *
         * @example
         *
         * A previously created {@link fcs.call.OutgoingCall} is required. {@see {@link fcs.call.startCall}} for more details.
         *
         * var outgoingCall = {};
         * fcs.call.startCall(..., ..., ..., onSuccess(outgoingCall), ..., ...);
         * outgoingCall.sendIntraFrame();
         */
        this.sendIntraFrame = function(){
            if (sendVideo) {
                _manager.sendIntraFrame(id);
            }
        };

        /**
         * Force the plugin to send a BlackFrame
         *
         * @name fcs.call.OutgoingCall#sendBlackFrame
         * @function
         * @since 3.0.0
         *
         * @example
         *
         * A previously created {@link fcs.call.OutgoingCall} is required. {@see {@link fcs.call.startCall}} for more details.
         *
         * var outgoingCall = {};
         * fcs.call.startCall(..., ..., ..., onSuccess(outgoingCall), ..., ...);
         * outgoingCall.sendBlackFrame();
         */
        this.sendBlackFrame = function(){
            _manager.sendBlackFrame(id);
        };

        /**
         * Force the plugin to refresh video renderer
         * with this call's remote video stream
         *
         * @name fcs.call.OutgoingCall#refreshVideoRenderer
         * @function
         * @since 3.0.0
         *
         * @example
         *
         * A previously created {@link fcs.call.OutgoingCall} is required. {@see {@link fcs.call.startCall}} for more details.
         *
         * var outgoingCall = {};
         * fcs.call.startCall(..., ..., ..., onSuccess(outgoingCall), ..., ...);
         * outgoingCall.refreshVideoRenderer();
         */
        this.refreshVideoRenderer = function(){
                _manager.refreshVideoRenderer(id);
        };

        /**
         * Puts the speaker into mute.
         *
         * @name fcs.call.OutgoingCall#mute
         * @function
         * @since 3.0.0
         *
         * @example
         *
         * A previously created {@link fcs.call.OutgoingCall} is required. {@see {@link fcs.call.startCall}} for more details.
         *
         * var outgoingCall = {};
         * fcs.call.startCall(..., ..., ..., onSuccess(outgoingCall), ..., ...);
         * outgoingCall.mute();
         */
        this.mute = function(){
            _manager.mute(id, true);
        };

        /**
         * Puts the speaker into unmute.
         *
         * @name fcs.call.OutgoingCall#unmute
         * @function
         * @since 3.0.0
         *
         * @example
         *
         * A previously created {@link fcs.call.OutgoingCall} is required. {@see {@link fcs.call.startCall}} for more details.
         *
         * var outgoingCall = {};
         * fcs.call.startCall(..., ..., ..., onSuccess(outgoingCall), ..., ...);
         * outgoingCall.unmute();
         */
        this.unmute = function(){
            _manager.mute(id, false);
        };

        /**
         * End the call
         *
         * @name fcs.call.OutgoingCall#end
         * @param {function} onSuccess The onSuccess() callback function to be called
         * @function
         * @since 3.0.0
         *
         * @example
         *
         * A previously created {@link fcs.call.OutgoingCall} is required. {@see {@link fcs.call.startCall}} for more details.
         *
         * var outgoingCall = {};
         * fcs.call.startCall(..., ..., ..., onSuccess(outgoingCall), ..., ...);
         *
         * var endCallOnSuccess = function(){
         *    //do something here
         * };
         *
         * outgoingCall.end(endCallOnSuccess);
         */
        this.end = function(onSuccess){
            _manager.end(id, onSuccess);
        };

        /**
          * Holds the call.
          * @name fcs.call.OutgoingCall#hold
          * @function
          * @since 3.0.0
          * @param {function} onSuccess The onSuccess() callback function to be called
          * @param {function} onFailure The onFailure({@link fcs.Errors}) callback function to be called
          *
          * @example
          *
          * A previously created {@link fcs.call.OutgoingCall} is required. {@see {@link fcs.call.startCall}} for more details.
          *
          * var outgoingCall = {};
          * fcs.call.startCall(..., ..., ..., onSuccess(outgoingCall), ..., ...);
          *
          * var holdCallOnSuccess = function(){
          *    //do something here
          * };
          * var holdCallOnFailure = function(err){
          *    //do something here
          * };
          *
          * outgoingCall.hold(holdCallOnSuccess, holdCallOnFailure);
          */
        this.hold = function(onSuccess, onFailure){
            _manager.hold(callid, onSuccess, onFailure);
        };

        /**
         * Resume the call.
         * @name fcs.call.OutgoingCall#unhold
         * @function
         * @since 3.0.0
         * @param {function} onSuccess The onSuccess() callback function to be called
         * @param {function} onFailure The onFailure({@link fcs.Errors}) callback function to be called
         *
         * @example
         *
         * A previously created {@link fcs.call.OutgoingCall} is required. {@see {@link fcs.call.startCall}} for more details.
         *
         * var outgoingCall = {};
         * fcs.call.startCall(..., ..., ..., onSuccess(outgoingCall), ..., ...);
         *
         * var unholdCallOnSuccess = function(){
         *    //do something here
         * };
         * var unholdCallOnFailure = function(err){
         *    //do something here
         * };
         *
         * outgoingCall.unhold(unholdCallOnSuccess, unholdCallOnFailure);
         */
        this.unhold = function(onSuccess,onFailure){
            _manager.unhold(id, onSuccess,onFailure);
        };

        this.directTransfer = function(address,onSuccess,onFailure){
            _manager.directTransfer(id, address, onSuccess,onFailure);
        };

        /**
         * Stop the video for this call after the call is established
         *
         * @name fcs.call.OutgoingCall#videoStop
         * @function
         * @since 3.0.0
         * @param {function} [onSuccess] The onSuccess() to be called when the video is stopped<br />
         * function()
         * @param {function} [onFailure] The onFailure() to be called when the video could not be stopped<br />
         * function()
         *
         * @example
         *
         * A previously created {@link fcs.call.OutgoingCall} is required. {@see {@link fcs.call.startCall}} for more details.
         *
         * var outgoingCall = {};
         * fcs.call.startCall(..., ..., ..., onSuccess(outgoingCall), ..., ...);
         *
         * var videoStopOnSuccess = function(){
         *    //do something here
         * };
         * var videoStopOnFailure = function(){
         *    //do something here
         * };
         *
         * outgoingCall.videoStop(videoStopOnSuccess, videoStopOnFailure);
         */
        this.videoStop = function(onSuccess, onFailure){
            _manager.videoStopStart(callid, onSuccess, onFailure, false);
        };

        /**
         * Start the video for this call after the call is established
         *
         * @name fcs.call.OutgoingCall#videoStart
         * @function
         * @since 3.0.0
         * @param {function} [onSuccess] The onSuccess() to be called when the video is started
         * @param {function} [onFailure] The onFailure() to be called when the video could not be started
         * @param {string} [videoQuality] Sets the quality of video, this parameter will be passed to getUserMedia()
         *                  if the video source is allowed before, this parameter will not be used
         *
         * @example
         *
         * A previously created {@link fcs.call.OutgoingCall} is required. {@see {@link fcs.call.startCall}} for more details.
         *
         * var outgoingCall = {};
         * fcs.call.startCall(..., ..., ..., onSuccess(outgoingCall), ..., ...);
         *
         * var videoStartOnSuccess = function(){
         *    //do something here
         * };
         * var videoStartOnFailure = function(){
         *    //do something here
         * };
         *
         * outgoingCall.videoStart(videoStopOnSuccess, videoStopOnFailure);
         */
        this.videoStart = function(onSuccess, onFailure, videoQuality){
            _manager.videoStopStart(callid, onSuccess, onFailure, true, videoQuality);
        };

        /**
         * Start sharing the screen for this call after the call is established.
         *
         * @name fcs.call.OutgoingCall#screenSharingStart
         * @function
         * @param {function} [onSuccess] The onSuccess() to be called when the screen sharing is started
         * @param {function} [onFailure] The onFailure() to be called when the screen sharing could not be started
         * @param {function} [onStopped] The onStopped() to be called when the user has clicked to stop sharing the screen.
         * @param {object} [options] The screen sharing options
         * @param {number} [options.width=1024] The width of the screen to request.
         * @param {number} [options.height=768] The height of the screen to request.
         * @param {number} [options.frameRate=15] The number of frames per second to request.
         */
        this.screenSharingStart = function(onSuccess, onFailure, onStopped, options){
             callManager.screenStopStart(callid, onSuccess, onFailure, onStopped, true, options);
        };

        /**
         * Stop sharing the screen for this call after the call is established.
         *
         * @name fcs.call.OutgoingCall#screenSharingStop
         * @function
         * @param {function} [onSuccess] The onSuccess() to be called when the screen sharing is stopped.
         * @param {function} [onFailure] The onFailure() to be called when the screen sharing could not be stopped.
         */
        this.screenSharingStop = function(onSuccess, onFailure){
            callManager.screenStopStart(callid, onSuccess, onFailure, null, false);
        };

        /**
         * Join 2 calls
         * You need two different calls to establish this functionality.
         * In order to join two calls. both calls must be put in to hold state first.
         * If not call servers will not your request.
         *
         * @name fcs.call.OutgoingCall#join
         * @function
         * @since 3.0.0
         * @param {fcs.call.Call} anotherCall Call that we want the current call to be joined to.
         * @param {function} onSuccess The onSuccess({@link fcs.call.OutgoingCall}) to be called when the call have been joined provide the joined call as parameter
         * @param {function} [onFailure] The onFailure() to be called when media could not be join
         *
         * @example
         *
         * A previously created {@link fcs.call.OutgoingCall} is required. {@see {@link fcs.call.startCall}} for more details.
         *
         * var outgoingCall = {};
         * fcs.call.startCall(..., ..., ..., onSuccess(outgoingCall), ..., ...);
         *
         * And another {@link fcs.call.OutgoingCall} or {@link fcs.call.IncomingCall} is requeired which is going to be joined.
         * var anotherCall; // assume this is previosuly created.
         *
         * var joinOnSuccess = function(joinedCall){
         *    joinedCall // newly created.
         *    //do something here
         * };
         * var joinOnFailure = function(){
         *    //do something here
         * };
         *
         * outgoingCall.join(anotherCall, joinOnSuccess, joinOnFailure);
         *
         * When join() is successfuly compeled, joinOnSuccess({@link fcs.call.OutgoingCall}) will be invoked.
         */
        this.join = function(anotherCall, onSuccess, onFailure){
            _manager.join(id, anotherCall.getId(), onSuccess, onFailure);
        };

        /**
         * Send Dual-tone multi-frequency signaling.
         *
         * @name fcs.call.OutgoingCall#sendDTMF
         * @function
         * @since 3.0.0
         * @param {String} tone Tone to be send as dtmf.
         *
         * @example
         *
         * A previously created {@link fcs.call.OutgoingCall} is required. {@see {@link fcs.call.startCall}} for more details.
         *
         * var outgoingCall = {};
         * fcs.call.startCall(..., ..., ..., onSuccess(outgoingCall), ..., ...);
         *
         * var videoStartOnSuccess = function(){
         *    //do something here
         * };
         * var videoStartOnFailure = function(){
         *    //do something here
         * };
         *
         * outgoingCall.sendDTMF("0");
         */
        this.sendDTMF = function(tone){
            _manager.sendDTMF(id, tone);
        };

        /**
         * Returns the call is a join call or not
         * Do not use this function if you really dont need it.
         * This will be handled by the framework
         *
         * @name fcs.call.OutgoingCall#getJoin
         * @function
         * @since 3.0.0
         * @returns {Boolean} isJoin
         *
         * @example
         *
         * A previously created {@link fcs.call.OutgoingCall} is required. {@see {@link fcs.call.startCall}} for more details.
         *
         * var outgoingCall = {};
         * fcs.call.startCall(..., ..., ..., onSuccess(outgoingCall), ..., ...);
         *
         * var videoStartOnSuccess = function(){
         *    //do something here
         * };
         * var videoStartOnFailure = function(){
         *    //do something here
         * };
         *
         * outgoingCall.getJoin();
         *
         * This method will return true if the outgoingCall is a previously joined call {@see {@link fcs.call.outgoingCall#join}}.
         */
        this.getJoin = function() {
            return isJoin;
        };

        /**
         * Marks the call as a join call or not
         * Do not use this function if you really dont need it.
         * This will be handled by the framework
         *
         * @name fcs.call.OutgoingCall#setJoin
         * @function
         * @since 3.0.0
         * @param {String} join
         *
         * @example
         *
         * When an outgoing call is received, {@link fcs.call.event:onReceived} handler will be invoked.
         *
         * var outgoingCall = {};
         * fcs.call.onReceived = function(call) {
         *    outgoingCall = call;
         * };
         *
         * outgoingCall.setJoin(true);
         */
        this.setJoin = function (join) {
            isJoin = join;
        };

        /**
         * Returns the button is a disabled or not
         * You may want to disable your buttons while waiting for a response.
         * Ex: this will prevent clicking multiple times for hold button until first hold response is not recieved
         *
         * @name fcs.call.OutgoingCall#getButtonDisabler
         * @function
         * @since 3.0.0
         * @returns {Boolean} buttonDisabler
         *
         * @example
         *
         * When an outgoing call is received, {@link fcs.call.event:onReceived} handler will be invoked.
         *
         * var outgoingCall = {};
         * fcs.call.onReceived = function(call) {
         *    outgoingCall = call;
         * };
         *
         * outgoingCall.getButtonDisabler();
         */
        this.getButtonDisabler = function() {
            return buttonDisabler;
        };

        /**
         * Clears the timer set with fcs.call.IncomingCall#setButtonDisabler.
         * You may want to disable your buttons while waiting for a response.
         * Ex: this will prevent clicking multiple times for hold button until first hold response is not recieved
         *
         * @name fcs.call.OutgoingCall#clearBtnTimeout
         * @function
         * @since 3.0.0
         * @param {bool} disable
         *
         * @example
         *
         * When an outgoing call is received, {@link fcs.call.event:onReceived} handler will be invoked.
         *
         * var outgoingCall = {};
         * fcs.call.onReceived = function(call) {
         *    outgoingCall = call;
         * };
         *
         * outgoingCall.clearBtnTimeout();
         */
        this.setButtonDisabler = function(disable) {
            buttonDisabler = disable;
            if(buttonDisabler) {
                btnTimeout = setTimeout( function() {
                    buttonDisabler = false;
                },
                4000 );
            }
        };

        /**
         * Clears the timer set with fcs.call.IncomingCall#setButtonDisabler.
         * You may want to disable your buttons while waiting for a response.
         * Ex: this will prevent clicking multiple times for hold button until first hold response is not recieved
         *
         * @name fcs.call.OutgoingCall#clearBtnTimeout
         * @function
         * @since 3.0.0
         *
         * @example
         *
         * When an outgoing call is received, {@link fcs.call.event:onReceived} handler will be invoked.
         *
         * var outgoingCall = {};
         * fcs.call.onReceived = function(call) {
         *    outgoingCall = call;
         * };
         *
         * outgoingcall.clearBtnTimeout();
         */
        this.clearBtnTimeout = function() {
            clearTimeout(btnTimeout);
        };

        /**
        * Long call audit
        * Creates a timer after call is established.
        * This timer sends a "PUT" request to server.
        * This will continue until one request fails.
        * Handled by framework. You dont need to call this function
        *
        * @name fcs.call.OutgoingCall#setAuditTimer
        * @function
        * @since 3.0.0
        * @param {function} audit
        *
        * @example
        *
        * When an incoming call is received, {@link fcs.call.event:onReceived} handler will be invoked.
        * incomingCall.setAuditTimer(audit);
        */
        this.setAuditTimer = function (audit) {
            auditTimer = setInterval(function() {
                audit();
            },
            fcsConfig.callAuditTimer ? fcsConfig.callAuditTimer:30000);
        };


        /**
        * Clears the long call audit prior to clearing all call resources.
        * Handled by framework. you dont need to call this function
        *
        * @name fcs.call.OutgoingCall#clearAuditTimer
        * @function
        * @since 3.0.0
        *
        * @example
        *
        * When an outgoing call is received, {@link fcs.call.event:onReceived} handler will be invoked.
        */
        this.clearAuditTimer = function() {
            clearInterval(auditTimer);
        };

        this.isCallMuted = function() {
            return _manager.isCallMuted(id);
        };

        /**
         * Returns video negotation availability
         * @name fcs.call.OutgoingCall#isVideoNegotationAvailable
         * @function
         * @since 3.0.1
         * @param {String} id Unique identifier for the call
         * @example
         * A previously created {@link fcs.call.OutgoingCall} is required. {@see {@link fcs.call.startCall}} for more details.
         *
         * var outgoingCall = {};
         * fcs.call.startCall(..., ..., ..., onSuccess(outgoingCall), ..., ...);
         * outgoingCall.isVideoNegotationAvailable(id);
         */
        this.isVideoNegotationAvailable = function(id) {
            return _manager.isVideoNegotationAvailable(id);
        };

        /**
         * Returns the state of the remote video.
         * @name fcs.call.IncomingCall#getRemoteVideoState
         * @function
         * @since 3.0.6
         */
        this.getRemoteVideoState = function() {
            return callManager.getRemoteVideoState(this.getId());
        };
    };

    this.OutgoingCall.prototype = new this.Call();
    if (__testonly__) { this.setNotificationState = function(_notificationState){ this.notificationState=_notificationState;}; }

};

var Call = function(manager) {
    return new CallImpl(manager || callManager);
};

fcs.call = new Call(callManager);

if (__testonly__) { __testonly__.Call = Call; }
if (__testonly__) { __testonly__.OutgoingCall = fcs.call.OutgoingCall;}

/**
* Handles receiving of custom messages (Custom).
* 
* @name custom
* @namespace
* @memberOf fcs
* 
* @version 3.0.5.1
* @since 3.0.0
*/
var Custom = function() {
      
   /**
    * Called on receipt of an instant message
    *
    * @name fcs.custom.onReceived
    * @event
    * @param {fcs.custom.Message} custom Message received
    * @since 3.0.0
    * @example 
    * var messageReceived = function(msg){
    *    // do something here
    * };
    * 
    * fcs.custom.onReceived = messageReceived;
    */
      
};

var CustomImpl = function() {
    this.onReceived = null;
};

CustomImpl.prototype = new Custom();
fcs.custom = new CustomImpl();

NotificationCallBacks.custom = function(data) {
    utils.callFunctionIfExist(fcs.custom.onReceived, data);
};
var PRESENCE_URL = "/presence", PRESENCE_WATCHER_URL = "/presenceWatcher", 
    REQUEST_TYPE_WATCH = "watch", REQUEST_TYPE_STOP_WATCH = "stopwatch", REQUEST_TYPE_GET = "get",
    PRESENCE_STATE = {
        CONNECTED:       0,
        UNAVAILABLE:     1,
        AWAY:            2,
        OUT_TO_LUNCH:    3,
        BUSY:            4,
        ON_VACATION:     5,
        BE_RIGHT_BACK:   6,
        ON_THE_PHONE:    7,
        ACTIVE:          8,
        INACTIVE:        9,
        PENDING:         10,
        OFFLINE:         11,
        CONNECTEDNOTE:   12,
        UNAVAILABLENOTE: 13
    },
    STATUS_OPEN = "open",
    STATUS_CLOSED = "closed",
    ACTIVITY_UNKNOWN = "unknown",
    ACTIVITY_AWAY = "away",
    ACTIVITY_LUNCH = "lunch",
    ACTIVITY_BUSY = "busy",
    ACTIVITY_VACATION = "vacation",
    ACTIVITY_ON_THE_PHONE = "on-the-phone",
    ACTIVITY_OTHER = "other",
    NOTE_BE_RIGHT_BACK = "Be Right Back",
    NOTE_OFFLINE = "Offline",
    USERINPUT_ACTIVE = "active",
    USERINPUT_INACTIVE = "inactive";

var PresenceStateParser =  function(){

    var stateRequest = [];
    
    stateRequest[PRESENCE_STATE.CONNECTED] = {status: STATUS_OPEN, activity: ACTIVITY_UNKNOWN};
    stateRequest[PRESENCE_STATE.UNAVAILABLE] = {status: STATUS_CLOSED, activity: ACTIVITY_UNKNOWN};
    stateRequest[PRESENCE_STATE.AWAY] = {status: STATUS_OPEN, activity: ACTIVITY_AWAY};
    stateRequest[PRESENCE_STATE.OUT_TO_LUNCH] = {status: STATUS_OPEN, activity: ACTIVITY_LUNCH};
    stateRequest[PRESENCE_STATE.BUSY] = {status: STATUS_CLOSED, activity: ACTIVITY_BUSY};
    stateRequest[PRESENCE_STATE.ON_VACATION] = {status: STATUS_CLOSED, activity: ACTIVITY_VACATION};
    stateRequest[PRESENCE_STATE.BE_RIGHT_BACK] = {status: STATUS_OPEN, activity: ACTIVITY_OTHER, note: NOTE_BE_RIGHT_BACK};
    stateRequest[PRESENCE_STATE.ON_THE_PHONE] = {status: STATUS_OPEN, activity: ACTIVITY_ON_THE_PHONE};
    stateRequest[PRESENCE_STATE.ACTIVE] = {status: STATUS_OPEN, activity: ACTIVITY_UNKNOWN, userInput: USERINPUT_ACTIVE};
    stateRequest[PRESENCE_STATE.INACTIVE] = {status: STATUS_CLOSED, activity: ACTIVITY_UNKNOWN, userInput: USERINPUT_INACTIVE};
    stateRequest[PRESENCE_STATE.OFFLINE] = {status: STATUS_CLOSED, activity: ACTIVITY_OTHER, note: NOTE_OFFLINE};
    stateRequest[PRESENCE_STATE.CONNECTEDNOTE] = {status: STATUS_OPEN, activity: ACTIVITY_OTHER};
    stateRequest[PRESENCE_STATE.UNAVAILABLENOTE] = {status: STATUS_CLOSED, activity: ACTIVITY_OTHER};
    
    this.getRequestObject = function(presenceState){
        var state = stateRequest[presenceState];
        
        if(state){
            return state;
        } else {
        throw new Error("Invalid Presence State");
        }
    };

    this.getState = function(presence) {
        switch (presence.userInput) {
            case USERINPUT_ACTIVE:
                return PRESENCE_STATE.ACTIVE;
            case USERINPUT_INACTIVE:
                return PRESENCE_STATE.INACTIVE;
        }

        switch (presence.note) {
            case NOTE_BE_RIGHT_BACK:
                return PRESENCE_STATE.BE_RIGHT_BACK;
            case NOTE_OFFLINE:
                return PRESENCE_STATE.OFFLINE;
        }
        if (presence.note) {
            if (presence.status === STATUS_OPEN) {
                return PRESENCE_STATE.CONNECTEDNOTE;
            }
            else {
                return PRESENCE_STATE.UNAVAILABLENOTE;
            }
        }

        switch (presence.activity) {
            case ACTIVITY_AWAY:
                return PRESENCE_STATE.AWAY;
            case ACTIVITY_LUNCH:
                return PRESENCE_STATE.OUT_TO_LUNCH;
            case ACTIVITY_BUSY:
                return PRESENCE_STATE.BUSY;
            case ACTIVITY_VACATION:
                return PRESENCE_STATE.ON_VACATION;
            case ACTIVITY_ON_THE_PHONE:
                return PRESENCE_STATE.ON_THE_PHONE;
            case ACTIVITY_UNKNOWN:
                if (presence.status === STATUS_OPEN) {
                    return PRESENCE_STATE.CONNECTED;
                }
                else {
                    return PRESENCE_STATE.UNAVAILABLE;
                }
        }
        return PRESENCE_STATE.CONNECTED;
    };
};

var presenceStateParser;

var PresenceServiceImpl = function(_server, _globalBroadcaster, _logManager) {
    var lastWatchedUserList = null, subscriptionRefreshTimer = null,
            onPresenceWatchSuccess = null, onPresenceWatchFailure = null,
            logger = _logManager.getLogger("presenceService"),
            subscriptionExpiryTimestamp = 0;


    this.getLastWatchedUserList = function () {
        return lastWatchedUserList;
    };

    this.onReceived = null;

    this.update = function(presenceState, onSuccess, onFailure) {

        _server.sendPostRequest({
            "url": getWAMUrl(1, PRESENCE_URL),
            "data": {"presenceRequest": presenceStateParser.getRequestObject(presenceState)}
                },
                onSuccess,
                onFailure
        );

    };

    function makeRequest(watchedUserList, onSuccess, onFailure, action) {
        var data = {"presenceWatcherRequest":{"userList": watchedUserList, "action": action}};
        _server.sendPostRequest({
                        "url": getWAMUrl(1, PRESENCE_WATCHER_URL),
                        "data": data
                    },
                    onSuccess,
                    onFailure
        );
    }

    function stopSubscriptionRefreshTimer() {
        if (subscriptionRefreshTimer) {
            logger.trace("presence watch timer is stopped: " + subscriptionRefreshTimer);
            clearTimeout(subscriptionRefreshTimer);
            subscriptionRefreshTimer = null;
        }
    }

    function startServiceSubscription(watchedUserList, onSuccess, onFailure) {
        var self = this, currentTimestamp = utils.getTimestamp();

        if (!watchedUserList) {
            if (lastWatchedUserList) {
                logger.trace("watchedUserList is empty, use lastWatchedUserList.");
                watchedUserList = lastWatchedUserList;
            }
            else {
                logger.trace("presence service subscription has not been initialized, do not trigger service subscription.");
                return;
            }
        }

        logger.info("presence service subscription, currentTimestamp: " + currentTimestamp + " expiryTimestamp: " + subscriptionExpiryTimestamp);
        if (currentTimestamp - subscriptionExpiryTimestamp < 0) {
            logger.trace("previous presence service subscription is still valid, do not trigger service subscription.");
            return;
        }

        if (onSuccess) {
            onPresenceWatchSuccess = onSuccess;
        }
        if (onFailure) {
            onPresenceWatchFailure = onFailure;
        }

        logger.info("subscribe presence status of users:", watchedUserList);
        makeRequest(watchedUserList, function(result) {
            var response, expiry;
            if (result) {
                response = result.presenceWatcherResponse;
                if (response) {
                    expiry = response.expiryValue / 2;
                    if (expiry) {
                        subscriptionExpiryTimestamp = utils.getTimestamp() + expiry * 1000;
                        stopSubscriptionRefreshTimer();
                        subscriptionRefreshTimer = setTimeout(function() {
                            self.watch(watchedUserList, null, onPresenceWatchFailure);
                        }, expiry * 1000);
                        logger.trace("presence watch, timer: " + subscriptionRefreshTimer + " expiryTimestamp: " + subscriptionExpiryTimestamp);
                    }
                }
            }
            lastWatchedUserList = watchedUserList;
            if (onPresenceWatchSuccess && typeof onPresenceWatchSuccess === 'function') {
                onPresenceWatchSuccess(result);
            }
        }, onPresenceWatchFailure, REQUEST_TYPE_WATCH);
    }

    this.watch = startServiceSubscription;
    
    this.stopwatch = function(watchedUserList, onSuccess, onFailure) {

        makeRequest(watchedUserList, onSuccess, onFailure, REQUEST_TYPE_STOP_WATCH);
    };


    this.retrieve = function(watchedUserList, onSuccess, onFailure) {

        makeRequest(watchedUserList, onSuccess, onFailure, REQUEST_TYPE_GET);
    };

    function presenceServiceOnSubscriptionStartedHandler() {
        startServiceSubscription(undefined, onPresenceWatchSuccess, onPresenceWatchFailure);
    }

    _globalBroadcaster.subscribe(CONSTANTS.EVENT.DEVICE_SUBSCRIPTION_STARTED,
            presenceServiceOnSubscriptionStartedHandler);

    _globalBroadcaster.subscribe(CONSTANTS.EVENT.DEVICE_SUBSCRIPTION_ENDED,
            stopSubscriptionRefreshTimer);

};

var PresenceService = function (_server, _globalBroadcaster, _logManager) {
    return new PresenceServiceImpl(_server || server,
                                   _globalBroadcaster || globalBroadcaster,
                                   _logManager || logManager);
};
var presenceService = new PresenceService();

presenceStateParser = new PresenceStateParser();

/*
 * In order to find the users presence client receives 3 parameters from WAM
 * status, activity, note and userInput.
 * status is received in every presence notification and can have two parameters: open and closed
 * For activity and note there can be only one of them in the presence notification.
 * userInput comes with activity but userInput is the  one that decides presence.
 * Presence is decided according to status and activity/note combination
 */
NotificationCallBacks.presenceWatcher = function(data){
    if(!fcs.notification.isAnonymous()) {
        var presence = new fcs.presence.UpdateEvent(), presenceParams = data.presenceWatcherNotificationParams;

        presence.name = utils.getProperty(presenceParams, 'name');
        presence.type = utils.getProperty(presenceParams, 'type');
        presence.status = utils.getProperty(presenceParams, 'status');
        presence.activity = utils.getProperty(presenceParams, 'activity');
        presence.note = utils.getProperty(presenceParams, 'note');
        presence.userInput = utils.getProperty(presenceParams, 'userInput');

        presence.state = presenceStateParser.getState(presence);

        utils.callFunctionIfExist(fcs.presence.onReceived, presence);
        
    }    
};
var PresenceManagerImpl = function (_service) {
    this.update = function (presenceState, onSuccess, onFailure) {
        _service.update(presenceState, onSuccess, onFailure);
    };

    this.watch = function (watchedUserList, onSuccess, onFailure) {
        _service.watch(watchedUserList, onSuccess, onFailure);
    };

    this.stopwatch = function (watchedUserList, onSuccess, onFailure) {
        _service.stopwatch(watchedUserList, onSuccess, onFailure);
    };

    this.retrieve = function (watchedUserList, onSuccess, onFailure) {
        _service.retrieve(watchedUserList, onSuccess, onFailure);
    };
};

var PresenceManager = function (_service) {
    return new PresenceManagerImpl(_service || presenceService);
};

var presenceManager = new PresenceManager();

/**
* Groups presence related resources (Presence Update, Presence Watcher)
* 
* @name presence
* @namespace
* @memberOf fcs
* 
* @version 3.0.5.1
* @since 3.0.0
*/
var PresenceImpl = function(_manager) {
    
   /**
    * States for presences update requests.
    * 
    * @name State
    * @enum {number}
    * @since 3.0.0
    * @readonly
    * @memberOf fcs.presence
    * @property {number} [CONNECTED=0] The user is currently online
    * @property {number} [UNAVAILABLE=1] The user is currently unavailable
    * @property {number} [AWAY=2] The user is currently away
    * @property {number} [OUT_TO_LUNCH=3] The user is currently out for lunch
    * @property {number} [BUSY=4] The user is currently busy
    * @property {number} [ON_VACATION=5] The user is currently on vacation
    * @property {number} [BE_RIGHT_BACK=6] The user will be right back
    * @property {number} [ON_THE_PHONE=7] The user is on the phone
    * @property {number} [ACTIVE=8] The user is currently active
    * @property {number} [INACTIVE=9] The user is currently inactive
    * @property {number} [PENDING=10] Waiting for user authorization
    * @property {number} [OFFLINE=11] The user is currently offline
    * @property {number} [CONNECTEDNOTE=12] The user is connected and defined a note
    * @property {number} [UNAVAILABLENOTE=13] The user is unavailable and defined a note
    */
    this.State = {
        CONNECTED:       0,
        UNAVAILABLE:     1,
        AWAY:            2,
        OUT_TO_LUNCH:    3,
        BUSY:            4,
        ON_VACATION:     5,
        BE_RIGHT_BACK:   6,
        ON_THE_PHONE:    7,
        ACTIVE:          8,
        INACTIVE:        9,
        PENDING:         10,
        OFFLINE:         11,
        CONNECTEDNOTE:   12,
        UNAVAILABLENOTE: 13
    };

   /**
    * Sends the user's updated status and activity to the server.
    *
    * @name fcs.presence.update
    * @function
    * @param {fcs.presence.State} presenceState The user's presence state    
    * @param {function} onSuccess The onSuccess() callback to be called
    * @param {function} onFailure The onFailure({@link fcs.Errors}) callback to be called
    * @since 3.0.0
    * @example
    * var onSuccess = function(){
    *    //do something here
    * };
    * var onError = function (err) {
    *   //do something here
    * };
    * 
    * fcs.presence.update(fcs.presence.State.BE_RIGHT_BACK, onSuccess, onError );
    */  
    this.update = function(presenceState, onSuccess, onFailure) {
        _manager.update(presenceState, onSuccess, onFailure);
    };

   /**
    * Starts watching the presence status of users in the provided user list.
    *
    * @name fcs.presence.watch
    * @function
    * @param {Array.<String>} watchedUserList list of users whose status is to be watched    
    * @param {function} onSuccess The onSuccess() callback to be called
    * @param {function} onFailure The onFailure({@link fcs.Errors}) callback to be called
    * @since 3.0.0
    * @example
    * var onSuccess = function(){
    *    //do something here
    * };
    * var onError = function (err) {
    *   //do something here
    * };
    * 
    * fcs.presence.watch(["user1", "user2"], onSuccess, onError );
    */
    this.watch = function(watchedUserList, onSuccess, onFailure) {
        _manager.watch(watchedUserList, onSuccess, onFailure);
    };

   /**
    * Stops watching the presence status of the users in the provided user list.
    *
    * @name fcs.presence.stopwatch
    * @function
    * @param {Array.<String>} unwatchedUserList list of users whose status is to be unwatched    
    * @param {function} onSuccess The onSuccess() callback to be called
    * @param {function} onFailure The onFailure({@link fcs.Errors}) callback to be called
    * @since 3.0.0
    * @example
    * var onSuccess = function(){
    *    //do something here
    * };
    * var onError = function (err) {
    *   //do something here
    * };
    * 
    * fcs.presence.stopwatch(["user1", "user2"], onSuccess, onError ); 
    */  
    this.stopwatch = function(watchedUserList, onSuccess, onFailure) {
        _manager.stopwatch(watchedUserList, onSuccess, onFailure);
    };

   /**
    * Sends a request to receive a notification for the presence status of the users in the provided user list.<br />
    * For each user in the provided list, {@link fcs.presence.event:onReceived} handler will be invoked.
    *
    * @name fcs.presence.retrieve
    * @function
    * @param {Array.<String>} userList list of users whose status is to be retrieved    
    * @param {function} onSuccess The onSuccess() callback to be called
    * @param {function} onFailure The onFailure({@link fcs.Errors}) callback to be called
    * @since 3.0.0
    * @example
    * var onSuccess = function(){
    *    //do something here
    * };
    * var onError = function (err) {
    *   //do something here
    * };
    * 
    * fcs.presence.retrieve(["user1", "user2"], onSuccess, onError ); 
    */
    this.retrieve = function(watchedUserList, onSuccess, onFailure) {
        _manager.retrieve(watchedUserList, onSuccess, onFailure);
    };

   /**
    * Handler called for when receiving a presence notification
    *
    * @name onReceived
    * @event
    * @memberOf fcs.presence
    * @param {fcs.presence.UpdateEvent} event The presence update event
    * @since 3.0.0
    * @example
    * 
    * fcs.presence.onReceived = function(data) {
    *    //do something here
    * }
    */
   
   
   /**
    * Represents a presence change event
    *
    * @name UpdateEvent
    * @class
    * @memberOf fcs.presence
    * @version 3.0.5.1
    * @since 3.0.0
    */
   this.UpdateEvent = function(){};
   /**
    * User name of the contact whose presence has changed.
    *
    * @name fcs.presence.UpdateEvent#name
    * @field
    * @type {String}
    * @since 3.0.0
    */

    /**
     * The presence state of the user.
     *
    * @name fcs.presence.UpdateEvent#state
    * @field
    * @type {fcs.presence.State}
    * @since 3.0.0
    */
   
   /**
    * The type of network for this presence.
    *
    * @name fcs.presence.UpdateEvent#type
    * @field
    * @type {String}
    * @since 3.0.0
    */
};

var Presence = function (_manager) {
    return new PresenceImpl(_manager || presenceManager);
};

fcs.presence = new Presence();
// Return the fcs module.
return fcs;

}));


// UMD module definition as described by https://github.com/umdjs/umd
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['fcs'], factory);
        // AMD. Also register named module.
        define('kandy', ['fcs'], factory);
    } else {
        // Browser globals
        root.kandy = root.KandyAPI = factory(root.fcs);
    }
 }(this, function (fcs) {
    'use strict';

    var kandyVersion = '2.4.2';

    /*
 * Utility namespace containing various functions used throughout Kandy.
 *
 * @class utils
 * @static
 */
var utils = (function() {
    var exports = {};

    /*
     * Function to create a Universally Unique ID.
     *
     * @method createUUIDv4
     * @returns {String} s The resulting UUID.
     */
    exports.createUUIDv4 = function() {
        var s = [],
            itoh = '0123456789ABCDEF';

        // Make array of random hex digits. The UUID only has 32 digits in it, but we
        // allocate an extra items to make room for the '-'s we'll be inserting.
        for (var i = 0; i < 36; i++) {
            s[i] = Math.floor(Math.random() * 0x10);
        }

        // Conform to RFC-4122, section 4.4
        s[14] = 4; // Set 4 high bits of time_high field to version
        s[19] = (s[19] & 0x3) | 0x8; // Specify 2 high bits of clock sequence

        // Convert to hex chars
        for (i = 0; i < 36; i++) {
            s[i] = itoh[s[i]];
        }

        // Insert '-'s
        s[8] = s[13] = s[18] = s[23] = '-';

        return s.join('');
    };

    /*
     * Function to extend an object with passed in parameters.
     *
     * @method extend
     * @return {Object} out The resulting object with extended values.
     */
    exports.extend = function(out) {
        out = out || {};

        for (var i = 1; i < arguments.length; i++) {
            if (!arguments[i]) {
                continue;
            }

            for (var key in arguments[i]) {
                if (arguments[i].hasOwnProperty(key)) {
                    out[key] = arguments[i][key];
                }
            }
        }

        return out;
    };

    /*
     * Function to set default values of an object if they do not already exist.
     *
     * @method defaults
     * @return {Object} out The resulting object with added default values.
     */
    exports.defaults = function(out) {
        out = out || {};

        for (var i = 1; i < arguments.length; i++) {
            if (!arguments[i]) {
                continue;
            }

            for (var key in arguments[i]) {
                if (!out[key] && arguments[i].hasOwnProperty(key)) {
                    out[key] = arguments[i][key];
                }
            }
        }

        return out;
    };

    /*
     * Function to add URI parameters to a string.
     *
     * @method param
     * @return {String} encodedString String composed of URI property/value pairs.
     * TODO: Test.
     */
    exports.param = function(object) {
        var encodedString = '', prop;

        for (prop in object) {
            if (object.hasOwnProperty(prop)) {
                var value = object[prop];

                if (value === undefined) {
                    // Skip over values that are undefined
                    continue;
                }

                if (value === null) {
                    value = '';
                }

                if (typeof value !== 'string') {
                    value = JSON.stringify(value);
                }

                if (encodedString.length > 0) {
                    encodedString += '&';
                }
                encodedString += encodeURIComponent(prop) + '=' + encodeURIComponent(value);
            }
        }
        return encodedString;
    };

    /*
     * Function to check whether an object is a plain object.
     *
     * @method isPlainObject
     * @param {any} value The value to check.
     * @returns {Boolean} true if the value is a plain object. false otherwise.
     */
    exports.isPlainObject = function(value) {
        return !!value && typeof value === 'object' && value.constructor === Object;
    };

    /*
     * Extends a target object deeply.
     *
     * @method deepExtend
     * @param {Object} target The target object that will be extended.
     * @param {Object} ...objects The objects to extend target with.
     * @returns {Object} Returns target.
     */
    exports.deepExtend = function(target) {
        var args = Array.prototype.slice.call(arguments, 1);

        args.forEach(function(obj) {
            if (exports.isPlainObject(obj)){
                Object.keys(obj).forEach(function(key) {
                    var src = target[key];
                    var val = obj[key];

                    if (!exports.isPlainObject(val)) {
                        target[key] = val;
                    } else if (!exports.isPlainObject(src)) {
                        target[key] = exports.deepExtend({}, val);
                    } else {
                        target[key] = exports.deepExtend(src, val);
                    }
                });
            }
        });

        return target;
    };

    return exports;
})();

/*
 * Request class provides functionality for creating and sending XML Http requests.
 *
 * @method request
 */
var request = (function(utils) {

    var exports = function (options) {

        options = utils.defaults(options, exports.defaultOptions);
        options.headers = utils.defaults(options.headers, exports.defaultHeaders);

        // Take the data parameters and append them to the URL.
        var queryString = utils.param(options.params);
        if (queryString.length > 0) {
            if (options.url.indexOf('?') === -1) {
                options.url += '?';
            }
            options.url += queryString;
        }

        var xhr = new XMLHttpRequest();
        xhr.open(options.type, options.url, true);
        xhr.withCredentials = options.withCredentials;

        // Set the headers.
        var headerKey;
        for (headerKey in options.headers) {
            xhr.setRequestHeader(headerKey, options.headers[headerKey]);
        }

        // Stringify data if not already a string.
        if (options.data && typeof options.data !== 'string' ) {
            options.data = JSON.stringify(options.data);
        }

        // Attach the call back
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {

                // All the status codes considered a success.
                var success = (xhr.status >= 200 && xhr.status < 300) || xhr.status === 304;

                // TODO: Promisify this.
                if (success) {
                    if (typeof options.success === 'function') {
                        var response = xhr.responseText;
                        if (options.dataType === 'json' && typeof response === 'string') {

                            if (response.length) {
                                response = JSON.parse(response);
                            } else {
                                response = {};
                            }
                        }

                        options.success({status: xhr.status, response: response});
                    }
                } else {
                    if (typeof options.failure === 'function') {
                        options.failure({status: xhr.status, statusText: xhr.statusText, response: xhr.responseText });
                    }
                }

            } else if (xhr.readyState === 0) {
                if (typeof options.failure === 'function') {
                    options.failure({status: xhr.status, statusText: xhr.statusText, response: 'Call aborted.'});
                }
            }
        };

        xhr.send(options.data);
    };

    /*
     * Default headers for a request.
     */
    exports.defaultHeaders = {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    };

    /*
     * Default options for a request.
     */
    exports.defaultOptions = {
        type: 'GET',
        url: '',
        withCredentials: false,
        dataType: 'json'
    };

    return exports;

})(utils);


/*
 * Event emitter module. Can be used as a standalone factory or as a mixin.
 *
 * @private
 * @class emitter
 * @example
 * ``` javascript
 * var eventEmitter = emitter(); // Create a new emitter.
 * emitter(myEmittingObject.prototype); // Mixin to an existing object.
 * ```
 */
var emitter = (function(utils) {
    return function(prototype) {

        var eventMap = [];
        var strictMode = false;

        /*
         * Check if the event is a valid event type.
         */
        function checkEvent(type) {
            if (strictMode && !eventMap[type]) {
                throw new Error('Invalid event type: ' + type);
            }
        }

        return utils.extend(prototype, {
            /*
             * Define an event type with the event emitter.
             *
             * @method define
             * @param {String} type The name for the event type.
             */
            define: function(type) {
                eventMap[type] = eventMap[type] || [];
            },

            /*
             * Define an alias for an event type.
             *
             * @method alias
             * @param {String} type The event type for which to add an alias.
             * @param {String} alias The alias name for the event type.
             * @throws {Error} Invalid event type
             */
            alias: function(type, alias) {
                checkEvent(type);

                eventMap[alias] = (eventMap[type] = eventMap[type] || []);
            },

            /*
             * Add an event listener for the specified event type.
             *
             * @method on
             * @param {String} type The event type for which to add the listener.
             * @param {Function} listener The listener for the event type. The parameters
             *                            of the listener depend on the event type.
             * @throws {Error} Invalid event type
             */
            on: function(type, listener) {
                checkEvent(type);

                (eventMap[type] = eventMap[type] || []).push(listener);
            },

            /*
             * Removes an event listener for the specified event type.
             *
             * @method off
             * @param {String} type The event type for which to remote the listener.
             * @param {Function} listener The listener to remove.
             * @throws {Error} Invalid event type
             */
            off: function(type, listener) {
                checkEvent(type);

                var list = eventMap[type] || [];
                var i = list.length;
                while(i--) {
                    if (listener === list[i]) {
                        list.splice(i, 1);
                    }
                }
            },

            /*
             * Emits an event of the specified type.
             *
             * @method emit
             * @param {String} type The event type to emit.
             * @param {any} [...args] The arguments to pass to the listeners of the event.
             * @throws {Error} Invalid event type
             */
            emit: function(type) {
                checkEvent(type);

                var args = Array.prototype.slice.call(arguments, 1),
                    list = eventMap[type] || [],
                    i = 0;

                for(; i < list.length; i++) {
                    list[i].apply(undefined, args);
                }
            },

            /*
             * Sets the emitter in strict mode where it only allows events that have been defined or aliases.
             *
             * @method setStrictMode
             * @param {Boolean} strict Whether to set strict mode for the emitter.
             */
            setStrictMode: function(strict) {
                strictMode = strict;
            }
        });
    };
})(utils);

/*
 * The core namespace contains miscellaneous stand-alone functions. Core includes API information, logging functions, and event declarations.
 *
 * @class core
 * @static
 */

/*
 * Private copy of response codes.
 */
var responseCodes = {
    OK: 0,
    internalServerError: 1,
    tokenExpired: 10,
    permissionDenied: 11,
    usageQuotaExceeded: 12,
    insufficientFunds: 13,
    validationFailed: 14,
    missingParameter: 15,
    invalidParameterValue: 16,
    badParameterValue: 17,
    unknownRequest: 18,
    noData: 19,
    alreadyExists: 50,
    invalidIdentifier: 51,
    invalidPassword: 52,
    doesNotExist: 53,
    invalidCountryCode: 54,
    invalidCredentials: 55,
    ajaxError: 5000,
    wsError: 6000,
    wsAlreadyOpened: 6001,
    wsNotFound: 6002,
    wsCreateError: 6003,
    wsNotAuth: 6004
};

/**
 * The kandy namespace is the overarching container for Kandy's methods and information.
 *
 * @module kandy
 * @class kandy
 * @static
 */
var api = {

    /**
     * Current version of Kandy.
     *
     * @property version
     * @type String
     * @readonly
     */
    version: (typeof kandyVersion !== 'undefined') ? kandyVersion : 'dev',

    /*
     * Map of response codes for kandy.
     *
     * @todo Document this property and make it public.
     * @property responseCodes
     */
    responseCodes: JSON.parse(JSON.stringify(responseCodes))
};

/*
 * Initialize logger levels.
 */
var _nofunc = function(){};
var _logger = {
        'info': _nofunc,
        'warn': _nofunc,
        'error': _nofunc,
        'debug': _nofunc
    };

/*
 * Sets the log level for logging output.
 *
 * @method _setLogLevel
 * @param {String} level Log level to be set, ie. error/warn/info/debug.
 */
function _setLogLevel(level){

    var lError = false, lWarn = false, lInfo = false, lDebug = false;
    if(window.console && console.warn && console.error && console.info){
        if(level === 'debug'){
            lError = lWarn = lInfo = lDebug = true;
        }if(level === 'info'){
            lError = lWarn = lInfo = true;
        } else if(level === 'warn'){
            lError = lWarn = true;
        } else if(level === 'error'){
            lError = true;
        }

        if(lDebug){
            _logger.debug = window.console.log.bind(window.console, 'kandy debug: %s');
        }

        if(lInfo){
            _logger.info = window.console.info.bind(window.console, 'kandy info: %s');
        }

        if(lWarn){
            _logger.warn = window.console.warn.bind(window.console, 'kandy warn: %s');
        }

        if(lError){
            _logger.error = window.console.error.bind(window.console, 'kandy error: %s');
        }
    }
}

/*
 * Default log level to warn.
 */
_setLogLevel('warn');

/*
 * Configuration for KandyAPI.Phone.
 */
var _config = {
    version: 0,
    listeners: {},
    kandyApiUrl: 'https://api.kandy.io/v1.2',
    mediatorUrl: 'http://service.kandy.io:8080/kandywrapper-1.0-SNAPSHOT',
    messageProvider: 'fring',
    pstnOutNumber: '71',
    sipOutNumber: '72',
    allowAutoLogin: false,
    kandyWSUrl: null,
    fcsConfig: {
        restPlatform: 'kandy', // 'spidr' or 'kandy'
        kandyApiUrl: 'https://api.kandy.io/v1.1/users/gateway',
        useInternalJquery: false
    },
    spidrApi: {
        cors: false,
        disableNotifications: null,
        notificationType: fcs.notification.NotificationTypes.WEBSOCKET,
        websocketProtocol: 'wss'
    },
    spidrMedia: {
      pluginLogLevel: 2,
      screenSharing: {
          chromeExtensionId: 'daohbhpgnnlgkipndobecbmahalalhcp'
      }
    }
};

/*
 * User Details gotten from login.
 */
var _userDetails = null;

/*
 * Auto Reconnection configuration.
 */
var _autoReconnect = true;

/*
 * Register for Calls configuration.
 */
var _registerForCalls = true;

 /*
  * This method is for setting up default values for an AJAX call.
  * @method _kandyRequest
  */
var _kandyRequest = function (options) {

    // set the default method as GET
    if (options.type === undefined || !options.type) {
        options.type = 'GET';
    }

    // Set the base url to talk to the correct version of kandy.
    options.url = (options.kandyApiUrl || _config.kandyApiUrl) + options.url;

    // Add an empty params option if there is none so we can add the key.
    options.params = options.params || {};

    // check if the url doesn't contain 'key' as param, then add userDetails.userAccessToken as 'key'
    if (!options.params.key) {
        options.params.key = _userDetails.userAccessToken;
    }

    // The REST API will expect a body if Content-Type is not set to 'text/html' during a DELETE operation.
    if (options.type === 'DELETE' && !options.data) {
        options.headers = options.headers || {};
        options.headers['Content-Type'] = 'text/html';
    }

    var success = options.success;
    var failure = options.failure;

    // Map a different success function that also takes into account the response's status field.
    // Note: Doing this will be more elegant once we have promise support.
    options.success = function(result) {
        if (result.response.status === responseCodes.OK) {
            if (success) {
                // Note: Here we just send the response back to the success handler to support backwards compatibility.
                success(result.response);
            }
        } else {
            if (failure) {
                failure(result.statusText, responseCodes.ajaxError);
            }
        }
    };

    options.failure = function(result) {
        // TODO: These error messages seem arbitrary and rather useless. Remove them?
        if (result.status === 403 || result.status === 401) {
            console.log('Unauthorized Error !!!');
        } else if (result.status === 426) {
            console.log('Kandy upgrade required!');
        }

        if (failure) {
            failure(result.statusText, responseCodes.ajaxError);
        }
    };

    request(options);
};

/*
 * This method initializes the logger.
 * @method _initLogger
 */
var _initLogger = function () {
    try {
        fcs.logManager.initLogging(function (x, y, z) {
            if (z.message === 'ERROR') {
                window.console.log(z.message);
            }
            else {
                window.console.log(z.message);
            }
        }, true);
        _logger = fcs.logManager.getLogger('kandy_js');
    } catch (e) {
        // TODO: Shouldn't swallow exceptions silently
    }
};

/*global emitter*/

var events = (function(api, emitter) {

    var exports = emitter();

    // TODO: Enable this whenever we have defined every event that we fire.
    // exports.setStrictMode(true);

    /**
     * Add an event listener for a specific Kandy event.
     *
     * @method on
     * @for kandy
     * @param {String} type The event type for which to register an event listener.
     * @param {Function} listener The listener function that will be called when the event is emitted with the parameters
     *                   of the event.
     * @param {any} [listener....arguments] The arguments corresponding to the event being emitted.
     */
    api.on = exports.on.bind(exports);

    /**
     * Remove an event listener for a specific Kandy event.
     *
     * @method off
     * @param {String} type The event type for which to remove the listener.
     * @param {Function} listener The listener function to remove from the list of listeners.
     */
    api.off = exports.off.bind(exports);

    /**
     * Fired when an outgoing call is initiated.
     *
     * @event callinitiated
     * @param {Call} outgoingCall Current active call.
     * @param {String} number The Kandy user being called.
     */
    exports.define('callinitiated');

    /**
     * Fired when an attempt to initiate an outgoing call fails.
     *
     * @event callinitiatefailed
     * @param {String} reasonText The reason for the failure or empty string.
     */
    exports.define('callinitiatefailed');

    /**
     * Fired when an incoming call is received.
     *
     * @event callincoming
     * @param {Call} call Current active call.
     */
    exports.define('callincoming');

    /**
     * Fired when an outgoing or incoming call has ended.
     *
     * @event callended
     * @param {Call} call The call object that was ended.
     */
    exports.define('callended');

    /**
     * Fired when a call fails to end.
     *
     * @event callendfailed
     * @param {Call} call Current active call.
     * @param {String} errorCode Error code of the reason for the failure.
     */
    exports.define('callendfailed');

    /**
     * Fired when a call is answered.
     *
     * @event callanswered
     * @param {Call} call Current active call.
     */
    exports.define('callanswered');

    /**
     * Fired when answering an incoming call fails.
     *
     * @event callanswerfailed
     * @param {Call} call Current active call.
     */
    exports.define('callanswerfailed');

    /**
     * Fired when a call is established or a call parameter changes.
     *
     * @event oncall
     * @deprecated Use a `callestablished` and/or `callstatechanged` instead.
     * @param {Call} call Current active call.
     */
    exports.define('oncall');

    /**
     * Fired when a call has been established.
     *
     * @event callestablished
     * @param {Call} call Current active call.
     */
    exports.define('callestablished');

    /**
     * Fired during a call when the state of the call changes. For example whether
     * the other side is no longer sending video.
     *
     * @event callstatechanged
     * @param {Call} call Current active call.
     */
    exports.define('callstatechanged');

    /**
     * Fired when an error occurs when initiating media.
     *
     * @event media
     * @param {Object} errorInfo Information about the media error.
     */
    exports.define('media');

    /*
     * Fired when a presence notification is received.
     *
     * @event presencenotification
     * @deprecated This type of presence notification was removed.
     * @param {String} username Username of presence event
     * @param {String} state Presence state
     * @param {String} description Presence description
     * @param {String} activity Presence activity
     */
    exports.define('presencenotification');

    /**
     * Fired when the user logs in.
     *
     * @event loginsuccess
     * @param {User} user The logged on user object
     */
    exports.define('loginsuccess');

    /**
     * Fired when login failed.
     *
     * @event loginfailed
     * @param {string} message Error message for loginfailed.
     */
    exports.define('loginfailed');

    /**
     * Fired when an incoming call is rejected.
     *
     * @event callrejected
     * @param {Call} call Current active call.
     */
    exports.define('callrejected');

    /**
     * Fired when an incoming call rejection fails.
     *
     * @event callrejectfailed
     * @param {Call} call Current active call.
     */
    exports.define('callrejectfailed');

    /**
     * Fired when an incoming call is ignored.
     *
     * @event callignored
     * @param {Call} call Current active call.
     */
    exports.define('callignored');

    /**
     * Fired when an incoming call ignore fails.
     *
     * @event callignorefailed
     * @param {Call} call Current active call.
     */
    exports.define('callignorefailed');

    /**
     * Fired when the remote party puts the call on hold.
     *
     * @event callhold
     * @param {Call} call Current active call.
     */
    exports.define('callhold');

    /**
     * @event remotehold
     * @deprecated Use the 'callhold' event instead.
     * @param {Call} call Current active call.
     */
    exports.alias('callhold', 'remotehold');

    /**
     * Fired when the remote party releases hold the on call.
     *
     * @event callunhold
     * @param {Call} call Current active call.
     */
    exports.define('callunhold');

    /**
     * @event remoteunhold
     * @deprecated Use the 'callunhold' event instead.
     * @param {Call} call Current active call.
     */
    exports.alias('callunhold', 'remoteunhold');

    /**
     * Fired when a user stops a screensharing session using the browser provided controls or by calling
     * `kandy.call.stopScreenSharing`.
     *
     * @event callscreenstopped
     * @param {Call} call Call for which the screen sharing was stopped.
     */
    exports.define('callscreenstopped');

    /**
     * Fired when connection to Kandy server dies.
     *
     * @event onconnectionlost
     */
    exports.define('onconnectionlost');

    /**
     * Fired when new messages are available.
     *
     * @event message
     * @param {Object} message The chat message to be handled.
     */
    exports.define('message');

    /**
     * Fired when new messages are available.
     *
     * @event messagesavailable
     * @deprecated Use event 'message' instead. Note that this is not an alias. It is fired in slightly different
     *             circumstances than the 'message' event.
     */
    exports.define('messagesavailable');

    return exports;

})(api, emitter);

/*
 * Websocket class containing all functions and properties related to the websocket.
 *
 * @class websocket
 * @static
 */

/*
 * Registered WebSocket events.
 */
var _wsEvents = {};

/*
 * Registered WebSocket handlers for responses.
 */
var _wsResponses = {};

/*
 * WebSocket object.
 */
var _ws = null;

/*
 * Timeout for ping mechanism.
 */
var _wsPingTimeout;

/*
 * Timeout for reconnect mechanism.
 */
var _connectionLostTimeout;

/*
 * Count for failed reconnect attempts.
 */
var _reconnectCount = 0;

/*
 * Indicator for if online and offline events has been added to the window.
 */
var _onlineEventAttached = false;


/*
 * Function to test whether the websocket is opened or not.
 *
 * @method isWebSocketOpened
 * @return {Boolean} opened Indication of if the WebSocket is open.
 */
function isWebSocketOpened() {
    var opened = false;

    if (_ws) {
        opened = (_ws.readyState === 1);
    }

    return opened;
}


/*
 * Function to send a ping to the websocket.
 *
 * @method sendWSPing
 */
function sendWSPing() {
    if (isWebSocketOpened())
    {
        _wsPingTimeout = setTimeout(sendWSPing, 30000);

        var json = {
           'message_type': 'ping'
        };
        try {
            _ws.send(JSON.stringify(json));
        } catch (e) {
            window.console.error('Exception in sendWSPing: ' + e.message);
        }
    }
}

/*
 * Function to reconnect to the websocket.
 *
 * @method reconnect
 */
function reconnect() {
    window.console.log('reconnecting');

    openWebSocket(function () {
        window.console.log('reconnect success');
        _reconnectCount = 0;
        events.emit('onconnectionrestored');
    },
            function () {
                _reconnectCount++;
                window.console.log('failed to reconnect');
                autoReconnect();
            });
}

/*
 * Function to set auto-reconnect timer.
 *
 * @method autoReconnect
 */
function autoReconnect() {
    var timeout = (_reconnectCount > 10) ? ((_reconnectCount > 100) ? 60000 : 30000) : 10000;
    _connectionLostTimeout = setTimeout(reconnect, timeout);
}

/*
 * Event function triggered when the window goes online. Sets reconnect timeout.
 *
 * @method onBrowserOnline
 */
function onBrowserOnline() {
    window.console.log('browser going online');
    clearTimeout(_connectionLostTimeout);
    _connectionLostTimeout = setTimeout(reconnect, 500);
}

/*
 * Event function triggered when the window goes offline. Closes the websocket.
 *
 * @method onBrowserOffline
 */
function onBrowserOffline() {
    window.console.log('browser going offline');
    clearTimeout(_wsPingTimeout);

    // We need to manually call `onclose` because it's not called when we do
    // _ws.close(). It's only called when the server accepts to close the WS.
    if (_ws && _ws.onclose) {
        _ws.onclose();

        // We still need to call close(); so that isWebSocketOpened() behaves
        // correctly. We make sure to cleanup the websocket before we close it
        // just to be sure not to call `onclose` more than once.
        cleanupWebSocket();
        _ws.close();
    }
}

/*
 * Function to generate a URL for the websocket using the data channel configurations.
 *
 * @method buildWebSocketUrlFromDataChannelConfig
 * @param {Object} dataChannelConfig Configuration of the data channel.
 * @return {String} wsURL Websocket URL.
 */
function buildWebSocketUrlFromDataChannelConfig(dataChannelConfig) {
    var host = dataChannelConfig.data_server_host,
            port = dataChannelConfig.data_server_port,
            isSecure = dataChannelConfig.is_secure;

    //only keep the url because of an issue with REST api 1.1 and 1.2
    var hostMatches = host.match('^(?:https?:\/\/)?(?:www\.)?([^\/]+)');
    var portString = port ? (':' + port) : '';

    return (isSecure ? 'wss' : 'ws') + '://' + hostMatches[1] + portString;
}

/*
 * Get the data channel configuration used to connect to the websocket.
 *
 * @method getDataChannelConfiguration
 * @async
 * @param {Function} success Callback function that will be called when the retrieval is completed successfully.
 * @param {Function} failure Callback function that will be called whenever an error occurs.
 */
function getDataChannelConfiguration(success, failure) {
    _kandyRequest({
        url: '/users/configurations/data_channel',
        success: function (response) {
            if (success) {
                success(response.result);
            }
        },
        failure: failure
    });
}

/*
 * Function to open the websocket channel.
 *
 * @method openWebSocket
 * @param {Object} [success] Callback function that will be called when the websocket has been opened successfully.
 * @param {Object} [failure] Callback function that will be called whenever an error occurs.
 */
function openWebSocket(success, failure) {
    var handshareId;

    if (isWebSocketOpened()) {
        closeWebSocket();
        return;
    }

    getDataChannelConfiguration(
            function (result) {
                _config.kandyWSUrl = buildWebSocketUrlFromDataChannelConfig(result) + '?client_sw_type=js&client_sw_version=' + api.version + '&user_access_token=';

                try {
                    _logger.debug('Opening websocket, UAT = ' + _userDetails.userAccessToken);

                    // Remove listeners before losing a reference to the current socket
                    if (_ws) {
                        cleanupWebSocket();
                    }
                    _ws = new WebSocket(_config.kandyWSUrl + encodeURIComponent(_userDetails.userAccessToken));
                } catch (wsError) {
                    if (failure) {
                        failure('Error opening websocket', responseCodes.wsCreateError);
                    }
                    return;
                }

                if (_ws !== null && _ws.readyState !== 2 && _ws.readyState !== 3) {

                    _ws.onopen = function (evt) {
                        if (window.addEventListener && !_onlineEventAttached) {
                            window.addEventListener('online', onBrowserOnline);
                            window.addEventListener('offline', onBrowserOffline);
                            _onlineEventAttached = true;
                        }
                        success();
                        sendWSPing();
                    };

                    _ws.onclose = function (evt) {
                        if(_wsPingTimeout){
                            if (_autoReconnect && !_connectionLostTimeout) {
                                window.console.log('connection closed');
                                clearTimeout(_wsPingTimeout);
                                autoReconnect();
                            }

                            if (_reconnectCount === 0) {
                                events.emit('onconnectionlost', evt);
                            }
                        }
                    };

                    _ws.onerror = function (evt) {
                        events.emit('onconnectionerror', evt);
                    };

                    _ws.onmessage = function (evt) {
                        var message = JSON.parse(evt.data), callbacks, responseCallbacks, callbackItter, callbackLength;
                        if (message.message_type === 'response') {
                            responseCallbacks = _wsResponses[message.id];
                            if (responseCallbacks) {
                                delete _wsResponses[message.id];
                                if (message.status === 0) {
                                    if (responseCallbacks.success) {
                                        responseCallbacks.success();
                                    }
                                }
                                else {
                                    if (responseCallbacks.failure) {
                                        responseCallbacks.failure(message.message, message.status);
                                    }
                                }
                            }
                        } else {
                            if (_wsEvents.hasOwnProperty(message.message_type)) {
                                callbacks = _wsEvents[message.message_type];

                                if (callbacks && callbacks.length > 0) {
                                    callbackLength = callbacks.length;
                                    for (callbackItter = 0; callbackItter < callbackLength; callbackItter++) {
                                        if (typeof callbacks[callbackItter] === 'function') {
                                            callbacks[callbackItter](message);
                                        }
                                    }

                                }
                            }
                        }
                    };
                } else {
                    failure('Error opening websocket', responseCodes.wsCreateError);
                }
            },
            failure
            );
}

/*
 * Function to send data through the Websocket Channel.
 *
 * @method sendWebSocketData
 * @param {String} data The data to be sent.
 * @param {Object} [success] Callback function that will be called when the data is sent successfully.
 * @param {Object} [failure] Callback function that will be called whenever an error occurs.
 */
function sendWebSocketData(data, success, failure) {
    if (isWebSocketOpened()) {
        if ((success || failure) && (data.id === undefined)) {
            var id = utils.createUUIDv4();
            data.id = id;
            _wsResponses[id] = {success: success, failure: failure};
        }

        try {
            _ws.send(JSON.stringify(data));
        } catch (e) {
            window.console.log('Exception in sendWebSocketData: ' + e.message);
        }

    } else {
        failure();
    }
}

/*
 * Function to close the Web Socket.
 *
 * @method closeWebSocket
 */
function closeWebSocket() {
    clearTimeout(_wsPingTimeout);
    _wsPingTimeout = null;
    if (isWebSocketOpened()) {
        _ws.close();
    }
}

/*
 * Function to remove listeners on a Web Socket
 *
 * @method cleanupWebSocket
 */
function cleanupWebSocket() {
    _ws.onclose = null;
    _ws.onopen = null;
    _ws.onerror = null;
    _ws.onmessage = null;
}

/*
 * Function to register listeners to Web Socket events.
 *
 * @method registerWebSocketListeners
 * @param {Object} listeners
 */
function registerWebSocketListeners(listeners) {
    var listner;
    if (listeners) {
        for (var listener in listeners) {
            if (listeners.hasOwnProperty(listener)) {
                if (_wsEvents[listener] === undefined) {
                    _wsEvents[listener] = [];
                }
                _wsEvents[listener].push(listeners[listener]);
            }
        }
    }
}

/**
 * The kandy namespace contains functions for basic features of Kandy. This includes setting up Kandy, logging in/out,
 * and getter functions.
 *
 * @class kandy
 * @static
 */

/**
 * Prepare Kandy for use; setup configurations and listeners.
 *
 * @method setup
 * @param {Object} config Configuration object used to set up Kandy.
 * @param {HTMLElement} config.remoteVideoContainer Element that will be used as the container to the video of the remote party in a video call.
 * @param {HTMLElement} config.localVideoContainer Element that will be used as the container to the video of the local party in a video call.
 * @param {Object} config.listeners List of event listeners.
 * @param {Boolean} config.autoreconnect Whether Kandy should autoreconnect if connection is lost.
 * @param {Boolean} config.registerforcalls Whether the user should be registered for calls.
 * @param {String} config.loglevel Log level to be set, ie. error/warn/info/debug.
 * @param {Object} config.screenSharing Screensharing options.
 * @param {String} config.screenSharing.chromeExtensionId Chrome extension ID for the extension to use to enable
 *                                                        screen sharing. See the screensharing tutorial for more
 *                                                        information.
 * @example
 * ``` javascript
 * kandy.setup({
 *     remoteVideoContainer: document.getElementById('remote-video');
 *     localVideoContainer: document.getElementById('local-video');
 *     listeners: {
 *         callincoming: onCallIncoming
 *     },
 *     autoreconnect: true,
 *     registerforcalls: true,
 *     loglevel: 'debug'
 * });
 *
 * function onCallIncoming(call) {...}
 * ```
 */
api.setup = function (config) {
    config = config || {};
    // setup default configuration
    _config = utils.extend(_config, config);

    if (_config.screenSharing) {
        _config.spidrMedia.screenSharing = utils.extend(_config.spidrMedia.screenSharing, config.screenSharing);
    }

    // setup listeners
    if (config.listeners) {
        for (var key in config.listeners) {
            if (config.listeners.hasOwnProperty(key)) {
                events.on(key, config.listeners[key]);
            }
        }
    }

    if (config.hasOwnProperty('autoreconnect')) {
        _autoReconnect = config.autoreconnect;
    }

    if (config.hasOwnProperty('registerforcalls')) {
        _registerForCalls = config.registerforcalls;
    }


    if (config.hasOwnProperty('loglevel')) {
        _setLogLevel(config.loglevel);
    }

    if(_registerForCalls && _setupCall){
        _setupCall(config);
    }

    if(config.hasOwnProperty('exposeFcs')) {
        api._fcs = fcs;
    }
};

function _getUserAccessToken (domainApiKey, username, userPassword, success, failure, options) {
    // if username has domain in it remove it
    username = username.split('@')[0];

    _kandyRequest({
        url: '/domains/users/accesstokens',
        params: {
            key: domainApiKey,
            'user_id': username,
            'user_password': userPassword,
            'client_sw_version': options && options.client_sw_version,
            'client_sw_type': options && options.client_sw_type,
            'kandy_device_id': options && options.kandy_device_id
        },
        success: function (response) {
            if (success) {
                success(response.result);
            }
        },
        failure: failure
    });
}

/**
 * Retrieves a user access token for a specified user.
 *
 * @method getUserAccessToken
 * @async
 * @param {String} domainApiKey The API key for the domain.
 * @param {String} userName The name of the user.
 * @param {String} userPassword The password of the user.
 * @param {Function} success The success callback. It receives one parameter.
 * @param {String} success.user_access_token The user access token.
 * @param {Function} failure The failure callback. It receives no parameters.
 * @param {Object} options Client information.
 * @param {String} options.client_sw_version Software version.
 * @param {String} options.client_sw_type Software type, 'JS/android/ios'.
 * @param {String} options.kandy_device_id Device ID.
 */
api.getUserAccessToken = _getUserAccessToken;

/**
 * Retrieves details about a user for a specified user access token.
 *
 * @method getLimitedUserDetails
 * @async
 * @param {String} userAccessToken
 * @param {Function} success The success callback. It receives one parameter.
 * @param {User} success.user A User object corresponding to the provided user access token.
 * @param {Function} failure The failure callback. It receives one parameter.
 * @param {String} failure.errorMessage The error message explaining what failed.
 */
api.getLimitedUserDetails = function (userAccessToken, success, failure) {
    _kandyRequest({
        url: '/users/details/limited',
        params: {
            key: userAccessToken
        },
        success: function (response) {
            if (success) {
                success(response.result.user);
            }
        },
        failure: failure
    });
};

/**
 * Retrieves devices associated with a user access token.
 *
 * @method getDevices
 * @async
 * @param {String} userAccessToken User Access Token.
 * @param {Function} success The success callback. It receives one parameter.
 * @param {Device[]} success.devices An array of device objects.
 * @param {Function} failure The failure callback. It receives one parameter.
 * @param {String} failure.errorMessage The error message explaining what failed.
 * @example
 * Here is an example of the result object given to the success callback.
 * ``` javascript
 *  {
 *      devices: [
 *          {
 *              id: "8E2C0E50D19A45FABCD9F70ABB93AF80",
 *              nativeID: "55555555555555",
 *              family: "portal",
 *              name: "portal",
 *              osVersion: "6.6.5",
 *              clientVersion: "1"
 *          },
 *          ...
 *      ]
 *  }
 * ```
 */
api.getDevices = function (userAccessToken, success, failure) {
    _kandyRequest({
        url: '/users/devices',
        params: {
            key: userAccessToken
        },
        success: function (response) {
            if (success) {
                success(response.result);
            }
        },
        failure: failure
    });
};

/**
 * Get last seen timestamps for the users passed in.
 *
 * @method getLastSeen
 * @async
 * @param {Array} users Array of users.
 * @param {Function} success The success callback. It receives one parameter.
 * @param {Object} success.result The result object.
 * @param {Number} success.result.server_timestamp The current server timestamp.
 * @param {Array} success.result.users The array of users and their last seen times.
 * @param {String} success.result.users[i].full_user_id The user's full user ID.
 * @param {Number} success.result.users[i].last_seen The unix timestamp of the last time the user was seen.
 * @param {Function} failure The failure callback. It receives one parameter.
 * @param {String} failure.errorMessage The error message explaining what failed.
 * @example
 * Here is an example of the result object given to the success callback.
 * ``` javascript
 *  {
 *      server_timestamp: 1442340323747,
 *      users: [
 *          {
 *              full_user_id: "user1@test.kandy.io",
 *              last_seen: 1442337579648
 *          },
 *          ...
 *      ]
 *  }
 * ```
 */
api.getLastSeen = function (users, success, failure) {
    _kandyRequest({
        url: '/users/presence/last_seen',
        params: {
            users: users
        },
        success: function (response) {
            if (success) {
                success(response.result);
            }
        },
        failure: failure
    });
};

/**
 * Logs the user into Kandy.
 *
 * @method login
 * @async
 * @param {String} domainApiKey The API key of the user's domain.
 * @param {String} userName The name of the user.
 * @param {String} userPassword The password for the user.
 * @param {Function} success The success callback. It receives one parameter.
 * @param {String} success.user_access_token The logged-on user's access token.
 * @param {Function} failure The failure callback. It receives no parameters.
 */
api.login = function (domainApiKey, userName, password, success, failure) {

    var failureFunction = function () {
        _userDetails = null;
        if(failure && typeof failure === 'function'){
            failure();
        }
    };

    // TODO: Rename these to camel case
    var options = {
        'client_sw_version': api.version,
        'client_sw_type': 'JS',
        'kandy_device_id': null
    };

    _getUserAccessToken(domainApiKey, userName, password,
            function (result) {
                var userAccessToken = result.user_access_token;

                api.getLimitedUserDetails(userAccessToken,
                        function (userDetailResult) {
                            _userDetails = userDetailResult;
                            _userDetails.userPassword = password;
                            _userDetails.userAccessToken = userAccessToken;
                            openWebSocket(
                                    //openWebSocket Success
                                    function () {
                                        _userDetails.devices = [];
                                        api.getDevices(userAccessToken,
                                            function (data) {
                                                _userDetails.devices = data.devices;

                                                if(_registerForCalls && _logInToSpidr){
                                                    _logInToSpidr(function(){
                                                            if(success){
                                                                success(result);
                                                            }
                                                        },
                                                        failureFunction
                                                    );
                                                } else {
                                                    if(success){
                                                        success(result);
                                                    }
                                                }
                                            },
                                            failureFunction
                                        );
                                    },
                                    failureFunction
                                    );
                        },
                        failureFunction
                        );
            },
            failureFunction,
            options
            );

};

/**
 * Logs the user in with user access token (for single sign-on).
 *
 * @method loginSSO
 * @async
 * @param {String} userAccessToken User access token
 * @param {Function} success The success callback. It receives one parameter.
 * @param {Object} sucess.result The result object.
 * @param {String} sucess.result.user_id The logged-on user's username.
 * @param {String} sucess.result.full_user_id The logged-on username(username@domain).
 * @param {String} sucess.result.user_access_token The logged-on user's user_access_token.
 * @param {String} sucess.result.user_password The logged-on user's user_password.
 * @param {String} sucess.result.domain_name The logged-on user's domain name.
 * @param {Function} failure The failure callback. It receives no parameters.
 * @param {String} password The user's password.
 */
api.loginSSO = function (userAccessToken, success, failure, password) {
    _logger.info('loginSSO is not supported for calls at the moment, unless provided with the password');

    var failureFunction = function () {
        _userDetails = null;
        if(failure && typeof failure === 'function'){
            failure();
        }
    };

    api.getLimitedUserDetails(userAccessToken,
        function (result) {
            _userDetails = result;
            _userDetails.userAccessToken = userAccessToken;
            _userDetails.userPassword = password;
            openWebSocket(
                    function () {
                        _userDetails.devices = [];
                        api.getDevices(userAccessToken,
                            function (data) {
                                _userDetails.devices = data.devices;

                                if(_registerForCalls && _logInToSpidr){
                                    _logInToSpidr(function(){
                                            if(success){
                                                success(result);
                                            }
                                        },
                                        failureFunction
                                    );
                                } else {
                                    if(success){
                                        success(result);
                                    }
                                }
                            },
                            failureFunction
                        );
                    },
                    failureFunction);
        },
        failureFunction
    );


};

/**
 * Logs the user out of Kandy.

 * @method logout
 * @param {Function} success The success callback. It receives no parameters.
 */
api.logout = function (success) {
    closeWebSocket();
    _logOutOfSpidr(success);
};

/*
 * Reconnect the user to the previously connected websocket.
 *
 * @method reconnect
 * @param {Function} success The success callback. It receives no parameters.
 * @param {Function} failure The failure callback. It receives no parameters.
 * @deprecated
 */
api.reconnect = function (success, failure) {
    _logger.warn('Deprecated method KandyAPI.reconnet.');
    openWebSocket(success, failure);
};

/**
 * The Session namespace provides functionality for using sessions. It allows for creation and management of a session,
 * retrieval of information about sessions, user management for a session, and sending data over the session.
 *
 * @class session
 * @namespace kandy
 * @static
 */
api.Session = api.session = (function () {
    var me = {};

    /*
     * Initialize the listeners object.
     */
    var _listeners = {
    };

    /*
     * Forwards messages to the appropriate session handler.
     *
     * @method _messageHandler
     */
    var _messageHandler = function (message) {
        var simpleType, sessionListeners, sessionListener, listenerCount, listenerItter = 0;

        if (message.message_type === 'sessionNotification') {
            message = message.payload;
        }

        window.console.log('Session message recvd: ' + message.message_type);
        simpleType = message.message_type.replace(/^session/, 'on');
        sessionListeners = _listeners[message.session_id];

        if (sessionListeners) {
            var listnerCount = sessionListeners.length;

            for (listenerItter; listenerItter < listnerCount; listenerItter++) {
                sessionListener = sessionListeners[listenerItter];
                if (sessionListener && sessionListener.hasOwnProperty(simpleType)) {
                    try {
                        sessionListener[simpleType](message);
                    } catch (e) {
                        console.log('could not execute listner: ' + e);
                    }
                }
            }
        }
    };

    /*
     * Register session related listeners with the websocket.
     */
    registerWebSocketListeners({
        'sessionData': _messageHandler,
        'sessionNotification': _messageHandler
    });


    /**
     * Registers listeners for events.
     *
     * @method setListeners
     * @param {String} sessionId Id of the session to listen on.
     * @param {Object} listeners Set of listeners be to set up.
     * @param {Function} listeners.onData Fired when a participant sends data with sendData().
     * @param {Function} listeners.onActive Fired when a session is activated.
     * @param {Function} listeners.onUserJoinRequest Fired when a participant sends a join request for a session.
     * @param {Function} listeners.onUserJoin Fired when a participant joins a session.
     * @param {Function} listeners.onJoinApprove Fired when a participant's join request has been approved.
     * @param {Function} listeners.onJoinReject Fired when a participant's join request has been rejected.
     * @param {Function} listeners.onUserLeave Fired when a participant leaves a session.
     * @param {Function} listeners.onUserBoot Fired when a participant is booted by an admin.
     * @param {Function} listeners.onBoot Fired when a participant is booted by an admin.
     * @param {Function} listeners.onInactive Fired when a session is inactivated.
     * @param {Function} listeners.onTermination Fired when a session is terminated.
     * @example
     * ``` javascript
     *     var sessionId = "b39ba65691af47bba43c6e19b6d334d3";
     *     kandy.session.setListeners(sessionId, {
     *         onData: function(data) {...}
     *     });
     * ```
     */
    me.setListeners = function (sessionId, listeners) {

        if (_listeners[sessionId] === undefined) {
            _listeners[sessionId] = [];
        }

        _listeners[sessionId].push(listeners);
    };

    /**
     * Fired when a participant sends data with sendData(). This is received by
     * all participants except the sender. The only exception is that if a
     * particular user is given to sendData() then only that participant will
     * receive it.
     *
     * @event onData
     * @param {Object} data Data object containing message details.
     * @param {String} data.id Unique id for the message.
     * @param {String} data.session_id Id of the session from which the message came.
     * @param {String} data.message_type Type of the message
     * @param {String} data.source The full user id of the participant who sent the message.
     * @param {Object} data.payload The payload of the message.
     * @example
     * Here is an example of a data message
     * ``` javascript
     *     {
     *         id: "D262619D-DD81-4549-BAEA-368B8DBFCDF5",
     *         session_id: "b39ba65691af47bba43c6e19b6d334d3",
     *         message_type: "sessionData",
     *         source: "robinsummers@jltest.kandy.io",
     *         payload: {...}
     *     }
     * ```
     */

    /**
     * Fired when a session is activated. This is received by all participants.
     *
     * @event onActive
     * @param {Object} data Data object containing message details.
     * @param {String} data.message_type Type of the message
     * @param {String} data.session_id Id of the session from which the message came.
     * @example
     * Here is an example of a data message
     * ``` javascript
     *  {
     *      message_type: "sessionActive",
     *      session_id: "b39ba65691af47bba43c6e19b6d334d3"
     *  }
     * ```
     */

    /**
     * Fired when a participant sends a join request for a session. Only administrators
     * of the session will receive this event.
     *
     * @event onUserJoinRequest
     * @param {Object} data Data object containing message details.
     * @param {String} data.message_type Type of the message
     * @param {String} data.session_id Id of the session from which the message came.
     * @param {String} data.full_user_id The full user id for the participant.
     * @example
     * Here is an example of a data message
     * ``` javascript
     *  {
     *      message_type: "sessionUserJoinRequest",
     *      session_id: "b39ba65691af47bba43c6e19b6d334d3",
     *      full_user_id: "username1@test.kandy.io"
     *  }
     * ```
     */

    /**
     * Fired when a participant joins a session. This is received by all participants.
     *
     * @event onUserJoin
     * @param {Object} data Data object containing message details.
     * @param {String} data.message_type Type of the message
     * @param {String} data.session_id Id of the session from which the message came.
     * @param {String} data.full_user_id The full user id for the participant.
     * @example
     * Here is an example of a data message
     * ``` javascript
     *  {
     *      message_type: "sessionUserJoin",
     *      session_id: "b39ba65691af47bba43c6e19b6d334d3",
     *      full_user_id: "username1@test.kandy.io"
     *  }
     * ```
     */

    /**
     * Fired when a participant's join request has been approved. This is received
     * by the participant who made the request.
     *
     * @event onJoinApprove
     * @param {Object} data Data object containing message details.
     * @param {String} data.message_type Type of the message
     * @param {String} data.session_id Id of the session from which the message came.
     * @example
     * Here is an example of a data message
     * ``` javascript
     *  {
     *      message_type: "sessionJoinApprove",
     *      session_id: "b39ba65691af47bba43c6e19b6d334d3"
     *  }
     * ```
     */

    /**
     * Fired when a participant's join request has been rejected. This is received
     * by the participant who made the request.
     *
     * @event onJoinReject
     * @param {Object} data Data object containing message details.
     * @param {String} data.message_type Type of the message
     * @param {String} data.session_id Id of the session from which the message came.
     * @param {String} data.reject_reason The reason given by the admin who rejected the request.
     * @example
     * Here is an example of a data message
     * ``` javascript
     *  {
     *      message_type: "sessionJoinApprove",
     *      session_id: "b39ba65691af47bba43c6e19b6d334d3",
     *      reject_reason: "A well thought out reason"
     *  }
     * ```
     */

    /**
     * Fired when a participant leaves a session. This is received by all of
     * the participants in the session.
     *
     * @event onUserLeave
     * @param {Object} data Data object containing message details.
     * @param {String} data.message_type Type of the message
     * @param {String} data.session_id Id of the session from which the message came.
     * @param {String} data.reject_reason The reason given by the admin who rejected the request.
     * @param {String} data.full_user_id The full user id for the participant.
     * @example
     * Here is an example of a data message
     * ``` javascript
     *  {
     *      message_type: "sessionJoinApprove",
     *      session_id: "b39ba65691af47bba43c6e19b6d334d3",
     *      full_user_id: "username1@test.kandy.io",
     *      leave_reason: "A well thought out reason"
     *  }
     * ```
     */

    /**
     * Fired when a participant is booted by an admin. This is received
     * all participants except the participant that was booted.
     *
     * @event onUserBoot
     * @param {Object} data Data object containing message details.
     * @param {String} data.message_type Type of the message
     * @param {String} data.session_id Id of the session from which the message came.
     * @param {String} data.reject_reason The reason given by the admin who rejected the request.
     * @param {String} data.full_user_id The full user id for the participant.
     * @example
     * Here is an example of a data message
     * ``` javascript
     *  {
     *      message_type: "sessionUserBoot",
     *      session_id: "b39ba65691af47bba43c6e19b6d334d3",
     *      full_user_id: "username1@test.kandy.io",
     *      leave_reason: "A well thought out reason"
     *  }
     * ```
     */

    /**
     * Fired when a participant is booted by an admin. This is only received
     * by booted participant.
     *
     * @event onBoot
     * @param {Object} data Data object containing message details.
     * @param {String} data.message_type Type of the message
     * @param {String} data.session_id Id of the session from which the message came.
     * @param {String} data.reject_reason The reason given by the admin who rejected the request.
     * @example
     * Here is an example of a data message
     * ``` javascript
     *  {
     *      message_type: "sessionBoot",
     *      session_id: "b39ba65691af47bba43c6e19b6d334d3",
     *      boot_reason: "A well thought out reason"
     *  }
     * ```
     */

    /**
     * Fired when a session is inactivated. This is received by all participants.
     *
     * @event onInactive
     * @param {Object} data Data object containing message details.
     * @param {String} data.message_type Type of the message
     * @param {String} data.session_id Id of the session from which the message came.
     * @param {String} data.reject_reason The reason given by the admin who rejected the request.
     * @example
     * Here is an example of a data message
     * ``` javascript
     *  {
     *      message_type: "sessionInactive",
     *      session_id: "b39ba65691af47bba43c6e19b6d334d3"
     *  }
     * ```
     */

    /**
     * Fired when a session is terminated. This is received by all participants.
     *
     * @event onTermination
     * @param {Object} data Data object containing message details.
     * @param {String} data.message_type Type of the message
     * @param {String} data.session_id Id of the session from which the message came.
     * @example
     * Here is an example of a data message
     * ``` javascript
     *  {
     *      message_type: "sessionTermination",
     *      session_id: "b39ba65691af47bba43c6e19b6d334d3"
     *  }
     * ```
     */

    /**
     * Creates a session using specified configurations. The user that creates a session is the
     * session administrator. A newly created session is inactive by default.
     *
     * @method create
     * @param {Object} sessionConfig Configuration object used for creating the session.
     * @param {String} sessionConfig.session_type Type of session to be created. Session type is not restricted in its value; it can be defined as need be.
     * @param {String} sessionConfig.session_name Name of the session to be created.
     * @param {String} sessionConfig.session_description Description of the session to be created.
     * @param {String} sessionConfig.user_nickname Nickname of the user creating the session.
     * @param {String} sessionConfig.user_first_name First name of the user creating the session.
     * @param {String} sessionConfig.user_last_name Last name of the user creating the session.
     * @param {String} sessionConfig.user_phone_number Phone number of the user creating the session.
     * @param {String} sessionConfig.user_email Email of the user creating the session.
     * @param {Function} success The success callback. It receives one parameter.
     * @param {Object} success.result The result object.
     * @param {String} success.result.session_id The session ID of the created session.
     * @param {Function} failure The failure callback. It receives one parameter.
     * @param {String} failure.errorMessage The error message explaining what failed.
     */
    me.create = function (sessionConfig, success, failure) {
        _kandyRequest({
            type: 'POST',
            url: '/users/sessions/session',
            data: sessionConfig,
            success: function (response) {
                if (success) {
                    success(response.result);
                }
            },
            failure: failure
        });
    };

    /**
     * Activates an existing session, allowing for data to be sent to all users.
     * Only the session administrator can activate the session.
     *
     * @method activate
     * @param {String} sessionId Id of the session to be activated.
     * @param {Function} success The success callback. It receives no parameters.
     * @param {Function} failure The failure callback. It receives one parameter.
     * @param {String} failure.errorMessage The error message explaining what failed.
     */
    me.activate = function (sessionId, success, failure) {
        _kandyRequest({
            type: 'POST',
            url: '/users/sessions/session/id/start',
            data: {
                'session_id': sessionId
            },
            success: function (response) {
                if (success) {
                    success();
                }
            },
            failure: failure
        });
    };

    /**
     * Inactivates an existing session, preventing data being sent to all users.
     * Only the session administrator can inactivate the session.
     *
     * @method inactivate
     * @param {String} sessionId Id of the session to be activated.
     * @param {Function} success The success callback. It receives no parameters.
     * @param {Function} failure The failure callback. It receives one parameter.
     * @param {String} failure.errorMessage The error message explaining what failed.
     */
    me.inactivate = function (sessionId, success, failure) {
        _kandyRequest({
            type: 'POST',
            url: '/users/sessions/session/id/stop',
            data: {
                'session_id': sessionId
            },
            success: function (response) {
                if (success) {
                    success();
                }
            },
            failure: failure
        });
    };

    /**
     * Sends data to session users. Requires the session to be active.
     *
     * @method sendData
     * @param {String} sessionId Id of session to send data through.
     * @param {Object} data Data to be sent to the session users.
     * @param {function} [success] success Function called when the data is sent successfully.
     * @param {function} [failure] failure Function called when an error occurs while sending data.
     * @param {String} [destination] Full user id for the destination (if none provided, sends to all users).
     */
    me.sendData = function (sessionId, data, success, failure, destination) {
        sendWebSocketData({
            'message_type': 'sessionData',
            'session_id': sessionId,
            destination: destination,
            payload: data
        }, success, failure);
    };

    /**
     * Terminates an existing session. Only the session administrator can terminate the session.
     *
     * @method terminate
     * @param {String} sessionId Id of session to delete.
     * @param {Function} success The success callback. It receives no parameters.
     * @param {Function} failure The failure callback. It receives one parameter.
     * @param {String} failure.errorMessage The error message explaining what failed.
     */
    me.terminate = function (sessionId, success, failure) {
        _kandyRequest({
            type: 'DELETE',
            url: '/users/sessions/session/id',
            data: {
                'session_id': sessionId
            },
            success: function (response) {
                if (success) {
                    success();
                }
            },
            failure: failure
        });
    };

    /**
     * Gets session details for a given session Id.
     *
     * @method getSessionInfoById
     * @param {String} sessionId Id of session for which to get info.
     * @param {Function} success The success callback. It receives one parameter.
     * @param {Object} success.result Information about the session.
     * @param {String} success.result.session_id The session ID.
     * @param {String} success.result.session_name The name of the session.
     * @param {String} success.result.session_status The status of the session.
     * @param {String} success.result.session_type The type of the session.
     * @param {String} success.result.session_description The description of the session.
     * @param {String} success.result.admin_full_user_id The full user ID of the admin of the session.
     * @param {Number} success.result.creation_timestamp The time at which the session was created.
     * @param {String} success.result.domain_name The domain name of the session.
     * @param {Number} success.result.expiry_timestamp The expiry time of the session.
     * @param {Array} success.result.participants The list of participants in the session.
     * @param {Array} success.result.participants.full_user_id The full user ID of the participant.
     * @param {Array} success.result.participants.profile The profile of the participant.
     * @param {Array} success.result.participants.status The status of the participant.
     * @param {Array} success.result.participants.type The type of the participant.
     * @param {Array} success.result.participants.status The status of the participant.
     * @param {Array} success.result.participants.user_email The email of the participant.
     * @param {Array} success.result.participants.user_first_name The first name of the participant.
     * @param {Array} success.result.participants.user_last_name The last name of the participant.
     * @param {Array} success.result.participants.user_nickname The nickname of the participant.
     * @param {Array} success.result.participants.user_phone_number The phone number of the participant.
     * @param {Function} failure The failure callback. It receives one parameter.
     * @param {String} failure.errorMessage The error message explaining what failed.
     * @example
     * Here is an example of the result.
     * ``` javascript
     *  {
     *      session_id: "70efdb80a067439481f7dbfb99619a78",
     *      session_name: "Session Name",
     *      session_status: "inactive",
     *      session_type: "Sesstion Type",
     *      session_description: "A description of the session",
     *      admin_full_user_id: "user1@test.kandy.io",
     *      creation_timestamp: 1440598570170,
     *      domain_name: "test.kandy.io",
     *      expiry_timestamp: 981003600000,
     *      participants: [
     *          {
     *              full_user_id: "user1@test.kandy.io",
     *              profile: "registered",
     *              status: "approved",
     *              type: "admin",
     *              user_email: "user1@test.kandy.io",
     *              user_first_name: "User",
     *              user_last_name: "One",
     *              user_nickname: "Onesie",
     *              user_phone_number: "1111111111"
     *          },
     *          ...
     *      ]
     *  }
     * ```
     */
    me.getInfoById = function (sessionId, success, failure) {
        _kandyRequest({
            url: '/users/sessions/session/id',
            params: {
                'session_id': sessionId
            },
            success: function (response) {
                if (success) {
                    success(response.result);
                }
            },
            failure: failure
        });
    };

    /**
     * Gets session details with a given a session name.
     *
     * @method getSessionInfoByName
     * @param {String} sessionName Name of session for which to get info.
     * @param {Function} success The success callback. It receives one parameter.
     * @param {Object} success.result Information about the session.
     * @param {String} success.result.session_id The session ID.
     * @param {String} success.result.session_name The name of the session.
     * @param {String} success.result.session_status The status of the session.
     * @param {String} success.result.session_type The type of the session.
     * @param {String} success.result.session_description The description of the session.
     * @param {String} success.result.admin_full_user_id The full user ID of the admin of the session.
     * @param {Number} success.result.creation_timestamp The time at which the session was created.
     * @param {String} success.result.domain_name The domain name of the session.
     * @param {Number} success.result.expiry_timestamp The expiry time of the session.
     * @param {Array} success.result.participants The list of participants in the session.
     * @param {Array} success.result.participants.full_user_id The full user ID of the participant.
     * @param {Array} success.result.participants.profile The profile of the participant.
     * @param {Array} success.result.participants.status The status of the participant.
     * @param {Array} success.result.participants.type The type of the participant.
     * @param {Array} success.result.participants.status The status of the participant.
     * @param {Array} success.result.participants.user_email The email of the participant.
     * @param {Array} success.result.participants.user_first_name The first name of the participant.
     * @param {Array} success.result.participants.user_last_name The last name of the participant.
     * @param {Array} success.result.participants.user_nickname The nickname of the participant.
     * @param {Array} success.result.participants.user_phone_number The phone number of the participant.
     * @param {Function} failure The failure callback. It receives one parameter.
     * @param {String} failure.errorMessage The error message explaining what failed.
     * @example
     * Here is an example of the result.
     * ``` javascript
     *  {
     *      session_id: "70efdb80a067439481f7dbfb99619a78",
     *      session_name: "Session Name",
     *      session_status: "inactive",
     *      session_type: "Sesstion Type",
     *      session_description: "A description of the session",
     *      admin_full_user_id: "user1@test.kandy.io",
     *      creation_timestamp: 1440598570170,
     *      domain_name: "test.kandy.io",
     *      expiry_timestamp: 981003600000,
     *      participants: [
     *          {
     *              full_user_id: "user1@test.kandy.io",
     *              profile: "registered",
     *              status: "approved",
     *              type: "admin",
     *              user_email: "user1@test.kandy.io",
     *              user_first_name: "User",
     *              user_last_name: "One",
     *              user_nickname: "Onesie",
     *              user_phone_number: "1111111111"
     *          },
     *          ...
     *      ]
     *  }
     * ```
     */
    me.getInfoByName = function (sessionName, success, failure) {
        _kandyRequest({
            url: '/users/sessions/session/name',
            params: {
                'session_name': sessionName
            },
            success: function (response) {
                if (success) {
                    success(response.result);
                }
            },
            failure: failure
        });
    };

    /**
     * Gets a list of all open sessions.
     *
     * @method getOpenSessions
     * @param {Function} success The success callback. It receives one parameter.
     * @param {Object} success.result Information about the session.
     * @param {Array} success.result.sessions The list of sessions.
     * @param {String} success.result.sessions.session_id The session ID.
     * @param {String} success.result.sessions.session_name The name of the session.
     * @param {String} success.result.sessions.session_status The status of the session.
     * @param {String} success.result.sessions.session_type The type of the session.
     * @param {String} success.result.sessions.session_description The description of the session.
     * @param {String} success.result.sessions.admin_full_user_id The full user ID of the admin of the session.
     * @param {Number} success.result.sessions.creation_timestamp The time at which the session was created.
     * @param {String} success.result.sessions.domain_name The domain name of the session.
     * @param {Number} success.result.sessions.expiry_timestamp The expiry time of the session.
     * @param {Array} success.result.sessions.participants The list of participants in the session.
     * @param {Array} success.result.sessions.participants.full_user_id The full user ID of the participant.
     * @param {Array} success.result.sessions.participants.profile The profile of the participant.
     * @param {Array} success.result.sessions.participants.status The status of the participant.
     * @param {Array} success.result.sessions.participants.type The type of the participant.
     * @param {Array} success.result.sessions.participants.status The status of the participant.
     * @param {Array} success.result.sessions.participants.user_email The email of the participant.
     * @param {Array} success.result.sessions.participants.user_first_name The first name of the participant.
     * @param {Array} success.result.sessions.participants.user_last_name The last name of the participant.
     * @param {Array} success.result.sessions.participants.user_nickname The nickname of the participant.
     * @param {Array} success.result.sessions.participants.user_phone_number The phone number of the participant.
     * @param {Function} failure The failure callback. It receives one parameter.
     * @param {String} failure.errorMessage The error message explaining what failed.
     * @example
     * Here is an example of the result.
     * ``` javascript
     *  {
     *      sessions: [
     *          {
     *              session_id: "70efdb80a067439481f7dbfb99619a78",
     *              session_name: "Session Name",
     *              session_status: "inactive",
     *              session_type: "Sesstion Type",
     *              session_description: "A description of the session",
     *              admin_full_user_id: "user1@test.kandy.io",
     *              creation_timestamp: 1440598570170,
     *              domain_name: "test.kandy.io",
     *              expiry_timestamp: 981003600000,
     *              participants: [
     *                  {
     *                      full_user_id: "user1@test.kandy.io",
     *                      profile: "registered",
     *                      status: "approved",
     *                      type: "admin",
     *                      user_email: "user1@test.kandy.io",
     *                      user_first_name: "User",
     *                      user_last_name: "One",
     *                      user_nickname: "Onesie",
     *                      user_phone_number: "1111111111"
     *                  },
     *                  ...
     *              ]
     *          }
     *      ]
     * }
     * ```
     */
    me.getOpenSessions = function (success, failure) {
        _kandyRequest({
            url: '/users/sessions',
            success: function (response) {
                if (success) {
                    success(response.result);
                }
            },
            failure: failure
        });
    };

    /**
     * Gets a list of open sessions with a given session type.
     *
     * @method getOpenSessionsByType
     * @param {String} sessionType Type of session for which to search.
     * @param {Function} success The success callback. It receives one parameter.
     * @param {Object} success.result Information about the session.
     * @param {Array} success.result.sessions The list of sessions.
     * @param {String} success.result.sessions.session_id The session ID.
     * @param {String} success.result.sessions.session_name The name of the session.
     * @param {String} success.result.sessions.session_status The status of the session.
     * @param {String} success.result.sessions.session_type The type of the session.
     * @param {String} success.result.sessions.session_description The description of the session.
     * @param {String} success.result.sessions.admin_full_user_id The full user ID of the admin of the session.
     * @param {Number} success.result.sessions.creation_timestamp The time at which the session was created.
     * @param {String} success.result.sessions.domain_name The domain name of the session.
     * @param {Number} success.result.sessions.expiry_timestamp The expiry time of the session.
     * @param {Array} success.result.sessions.participants The list of participants in the session.
     * @param {Array} success.result.sessions.participants.full_user_id The full user ID of the participant.
     * @param {Array} success.result.sessions.participants.profile The profile of the participant.
     * @param {Array} success.result.sessions.participants.status The status of the participant.
     * @param {Array} success.result.sessions.participants.type The type of the participant.
     * @param {Array} success.result.sessions.participants.status The status of the participant.
     * @param {Array} success.result.sessions.participants.user_email The email of the participant.
     * @param {Array} success.result.sessions.participants.user_first_name The first name of the participant.
     * @param {Array} success.result.sessions.participants.user_last_name The last name of the participant.
     * @param {Array} success.result.sessions.participants.user_nickname The nickname of the participant.
     * @param {Array} success.result.sessions.participants.user_phone_number The phone number of the participant.
     * @param {Function} failure The failure callback. It receives one parameter.
     * @param {String} failure.errorMessage The error message explaining what failed.
     * @example
     * Here is an example of the result.
     * ``` javascript
     *  {
     *      sessions: [
     *          {
     *              session_id: "70efdb80a067439481f7dbfb99619a78",
     *              session_name: "Session Name",
     *              session_status: "inactive",
     *              session_type: "Sesstion Type",
     *              session_description: "A description of the session",
     *              admin_full_user_id: "user1@test.kandy.io",
     *              creation_timestamp: 1440598570170,
     *              domain_name: "test.kandy.io",
     *              expiry_timestamp: 981003600000,
     *              participants: [
     *                  {
     *                      full_user_id: "user1@test.kandy.io",
     *                      profile: "registered",
     *                      status: "approved",
     *                      type: "admin",
     *                      user_email: "user1@test.kandy.io",
     *                      user_first_name: "User",
     *                      user_last_name: "One",
     *                      user_nickname: "Onesie",
     *                      user_phone_number: "1111111111"
     *                  },
     *                  ...
     *              ]
     *          }
     *      ]
     * }
     * ```
     */
    me.getOpenSessionsByType = function (sessionType, success, failure) {
        _kandyRequest({
            url: '/users/sessions/type',
            params: {
                'session_type': sessionType
            },
            success: function (response) {
                if (success) {
                    success(response.result);
                }
            },
            failure: failure
        });
    };

    /**
     * Gets a list of sessions created by the current user.
     *
     * @method getOpenSessionsCreatedByUser
     * @param {Function} success The success callback. It receives one parameter.
     * @param {Object} success.result Information about the session.
     * @param {Array} success.result.sessions The list of sessions.
     * @param {String} success.result.sessions.session_id The session ID.
     * @param {String} success.result.sessions.session_name The name of the session.
     * @param {String} success.result.sessions.session_status The status of the session.
     * @param {String} success.result.sessions.session_type The type of the session.
     * @param {String} success.result.sessions.session_description The description of the session.
     * @param {String} success.result.sessions.admin_full_user_id The full user ID of the admin of the session.
     * @param {Number} success.result.sessions.creation_timestamp The time at which the session was created.
     * @param {String} success.result.sessions.domain_name The domain name of the session.
     * @param {Number} success.result.sessions.expiry_timestamp The expiry time of the session.
     * @param {Array} success.result.sessions.participants The list of participants in the session.
     * @param {Array} success.result.sessions.participants.full_user_id The full user ID of the participant.
     * @param {Array} success.result.sessions.participants.profile The profile of the participant.
     * @param {Array} success.result.sessions.participants.status The status of the participant.
     * @param {Array} success.result.sessions.participants.type The type of the participant.
     * @param {Array} success.result.sessions.participants.status The status of the participant.
     * @param {Array} success.result.sessions.participants.user_email The email of the participant.
     * @param {Array} success.result.sessions.participants.user_first_name The first name of the participant.
     * @param {Array} success.result.sessions.participants.user_last_name The last name of the participant.
     * @param {Array} success.result.sessions.participants.user_nickname The nickname of the participant.
     * @param {Array} success.result.sessions.participants.user_phone_number The phone number of the participant.
     * @param {Function} failure The failure callback. It receives one parameter.
     * @param {String} failure.errorMessage The error message explaining what failed.
     * @example
     * Here is an example of the result.
     * ``` javascript
     *  {
     *      sessions: [
     *          {
     *              session_id: "70efdb80a067439481f7dbfb99619a78",
     *              session_name: "Session Name",
     *              session_status: "inactive",
     *              session_type: "Sesstion Type",
     *              session_description: "A description of the session",
     *              admin_full_user_id: "user1@test.kandy.io",
     *              creation_timestamp: 1440598570170,
     *              domain_name: "test.kandy.io",
     *              expiry_timestamp: 981003600000,
     *              participants: [
     *                  {
     *                      full_user_id: "user1@test.kandy.io",
     *                      profile: "registered",
     *                      status: "approved",
     *                      type: "admin",
     *                      user_email: "user1@test.kandy.io",
     *                      user_first_name: "User",
     *                      user_last_name: "One",
     *                      user_nickname: "Onesie",
     *                      user_phone_number: "1111111111"
     *                  },
     *                  ...
     *              ]
     *          }
     *      ]
     * }
     * ```
     */
    me.getOpenSessionsCreatedByUser = function (success, failure) {
        _kandyRequest({
            url: '/users/sessions/user',
            success: function (response) {
                if (success) {
                    success(response.result);
                }
            },
            failure: failure
        });
    };

    /**
     * Requests permission from the session administrator to join a session with a given Id.
     *
     * @method join
     * @param {String} sessionId Id of the session to requeset to join.
     * @param {Object} userInfo Extra, optional, user info that will be visisble in session information.
     * @param {String} userInfo.user_email The user's email.
     * @param {String} userInfo.user_first_name The user's first name.
     * @param {String} userInfo.user_last_name The user's last name.
     * @param {String} userInfo.user_nickname The user's nickname.
     * @param {String} userInfo.user_phone_number The user's phone number.
     * @param {Function} success The success callback. It receives no parameters.
     * @param {Function} failure The failure callback. It receives one parameter.
     * @param {String} failure.errorMessage The error message explaining what failed.
     */
    me.join = function (sessionId, userInfo, success, failure) {
        var params = userInfo || {};
        params.session_id = sessionId;

        _kandyRequest({
            type: 'POST',
            url: '/users/sessions/session/id/participants/participant',
            data: params,
            success: function (response) {
                if (success) {
                    success(response.result);
                }
            },
            failure: failure
        });
    };

    /**
     * Removes the current user from a session.
     *
     * @method leave
     * @param {String} sessionId Id of the session to leave.
     * @param {String} leaveReason Reason why we are leaving the session.
     * @param {Function} success The success callback. It receives no parameters.
     * @param {Function} failure The failure callback. It receives one parameter.
     * @param {String} failure.errorMessage The error message explaining what failed.
     */
    me.leave = function (sessionId, leaveReason, success, failure) {
        _kandyRequest({
            type: 'DELETE',
            url: '/users/sessions/session/id/participants/participant',
            data: {
                'session_id': sessionId,
                'leave_reason': leaveReason
            },
            success: function (response) {
                if (success) {
                    success();
                }
            },
            failure: failure
        });
    };

    /**
     * Accepts a join request for a session. Only the session administrator can accept join requests.
     *
     * @method acceptJoinRequest
     * @param {String} sessionId Id of session the user is requesting to join.
     * @param {String} fullUserId Full user Id of the user sending the join request.
     * @param {Function} success The success callback. It receives no parameters.
     * @param {Function} failure The failure callback. It receives one parameter.
     * @param {String} failure.errorMessage The error message explaining what failed.
     */
    me.acceptJoinRequest = function (sessionId, fullUserId, success, failure) {

        _kandyRequest({
            type: 'POST',
            url: '/users/sessions/session/id/admin/participants/participant/join',
            data: {
                'session_id': sessionId,
                'full_user_id': fullUserId
            },
            success: function (response) {
                if (success) {
                    success();
                }
            },
            failure: failure
        });
    };

    /**
     * Rejects a join request for a session. Only the session administrator can reject join requests.
     *
     * @method rejectJoinRequest
     * @param {String} sessionId Session Id of the join request.
     * @param {String} Full user Id of the user sending the join request.
     * @param {String} rejectReason Reason for rejecting the join request.
     * @param {Function} success The success callback. It receives no parameters.
     * @param {Function} failure The failure callback. It receives one parameter.
     * @param {String} failure.errorMessage The error message explaining what failed.
     */
    me.rejectJoinRequest = function (sessionId, fullUserId, rejectReason, success, failure) {
        _kandyRequest({
            type: 'DELETE',
            url: '/users/sessions/session/id/admin/participants/participant/join',
            data: {
                'session_id': sessionId,
                'full_user_id': fullUserId,
                'reject_reason': rejectReason
            },
            success: function (response) {
                if (success) {
                    success();
                }
            },
            failure: failure
        });
    };

    /**
     * Removes a user from the session. Only the session administrator can boot a user.
     *
     * @method bootUser
     * @param {String} sessionId Session Id of the session the user should be removed from.
     * @param {String} fullUserId Full user Id of the user to be removed.
     * @param {String} bootReason Reason for removing the user.
     * @param {Function} success The success callback. It receives no parameters.
     * @param {Function} failure The failure callback. It receives one parameter.
     * @param {String} failure.errorMessage The error message explaining what failed.
     */
    me.bootUser = function (sessionId, fullUserId, bootReason, success, failure) {

        _kandyRequest({
            type: 'DELETE',
            url: '/users/sessions/session/id/admin/participants/participant',
            data: {
                'session_id': sessionId,
                'full_user_id': fullUserId,
                'boot_reason': bootReason
            },
            success: function (response) {
                if (success) {
                    success();
                }
            },
            failure: failure
        });
    };

    return me;
}());

/**
 * CoBrowsing is used to share a webpage from one user to multiple users. Allows for a user to start and stop sending their webpage, and for users (called Agents herein) to start and stop receiving another user's webpage. CoBrowsing requires the use of sessions for sending the webpage.
 *
 * @class coBrowsing
 * @namespace kandy
 * @static
 */
api.coBrowsing = api.CoBrowse = (function() {
    // local scope reference
    var me = {};

    // flag to indacate if CoBrowseing is started
    var coBrowseStarted = false;

    // flag to lock scrolling
    var scrollLock = false;

    // flag to pervent loop scroll events
    var emitScrollEvent = true;

    // flag to pervent input update loop
    var emitFormChange = true;

    // MutationObserver holder
    var mutationObserver;

    // set lowest element defualt flags
    var lowestElement = -1,
        lowestElementId = '',
        lowestElementTree = '';

    // inline css cahce
    var inlineCSSCache = '';

    // agent iframe reference holders
    var sessionId, coBrowsingContainer, coBrowsingDiv, iframe, iframeWindow, iframeDocument;

    // base64 default cursor image
    var defaultCursor = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAeCAMAAAAbzM5ZAAABNVBMVEUAvuf///8AvucAvucAvucAvucAvucAvucAvucAvucAvucAvucAvucAvucAvucAvucAvucAvucAvucAvucAvucAvucAvucAvucAvucAvucAvucAvucAvucAvucAvucAvucAvucAvucAvucAvucAvucAvucAvucAvucAvucAvucAvucAvucAvucAvucAvucAvucAvucAvucAvucAvucAvucBveYCuuECuuIDuN8Ett0FtdsGstcHsNUIr9MJrdEKqs0Kq80Kq84LqMoMpsgPocEQnr0RnbwSm7kWkq0XkasYj6kaiqIdhJoeg5kgf5MhfJAkdogkd4kldYcmcoMqa3oraXYsaHQwYGoxXmc0WGA1VVw1Vl06TFA7Sk07Sk48R0o8SEo+Q0Q+REU/QUE/QkNAQEBAQEFG5UD4AAAANHRSTlMAAAIEBggKHCMnKS0uNTk7PEBCSUpLU1dcX2tsbnFzdXeAhYuSk5aho63Fz9XZ29/l6uv9gq4ZTAAAAQBJREFUeAFdzmcjQmEAR/EngwzZkSSyR0aOvUe2DMoW8u/7fwRuV7r3OS9/r44xJhhpMG6Bv4wZBhbCfgwCQNSHETjbBRJeHILMRxqYsFCfJ8BUsx9VvASSLX6Urpcg1WahsstAl4V6WAN6LdTzFhC1UK8HQMJCucMWusOtFpaGBy0s5NLQ7sO3zAZAtReLe1Ca+sfHgpSB2YG68tLX3T456X0FGp35OFzcbgPHkk5hxMEQ5V6kJ1is+kUzDjA/BueSDqHPQROKj/aYJljNS/cwV0K3abiRvjehvoJh2CkqfwQdFTQpyF6tAzUejOHWH/BgbRJgptv59GhsMtEZcPoBmRFquUFm5kkAAAAASUVORK5CYII=';


    /* ****************************************************************************************************************
     * functions related to data handling starts here
     * ****************************************************************************************************************/

    /*
     * Process an event form the user on the agent side
     *
     * @method agentEventRecieved
     * @param {Object} message
     */
    var agentEventRecieved = function(message) {
        // if cobrowsing isn't listen to any messages
        if (coBrowseStarted === false) {
            return;
        }

        // switch through the messages that could have been reserved
        switch (message.payload.type) {
            case 'screenUpdate':
                // display the html update to the agent
                renderScreen(message.payload.data);
                break;
            case 'userMousePosition':
                // display the client mouse movement to the agent
                displayUserMouseMove(message.payload.data);
                break;
            case 'userWindowScroll':
                // move the agent viewport to match the clients scroll position
                displayUserScroll(message.payload.data);
                break;
            case 'userWindowResize':
                // resize the agent viewport to match the clients
                resizeViewport(message.payload.data);
                break;
            case 'closeCoBrowse':
                // resize the agent viewport to match the clients
                me.stopBrowsingAgent();
                break;
        }
    };

    /*
     * Process an event form the agent on the user side
     *
     * @method userEventRecieved
     * @param {Object} message
     */
    var userEventRecieved = function(message) {
        // if cobrowsing isn't listen to any messages
        if (coBrowseStarted === false) {
            return;
        }

        // switch through the messages that could have been reserved
        switch (message.payload.type) {
            case 'agentWindowScroll':
                // dispaly the current scroll position from the agent
                getAgentWindowScroll(message.payload.data);
                break;
            case 'agentMouseMove':
                // dispaly the agent mouse movement to the viewer
                getAgentMouseMove(message.payload.data);
                break;
            case 'agentClick':
                // trigger a click from the agent
                triggerAgentClick(message.payload.data);
                break;
            case 'agentInputChange':
                // load a input change from the agent
                showAgentInputChange(message.payload.data);
                break;
            case 'requestFullPage':
                // send full page to new agent
                sendScreen('HTML', message.full_user_id);
                break;
        }
    };

    /*
     * Send data through the WebSocket Channel
     *
     * @method eventEmit
     * @param {String} [type] The message type
     * @param {Mixed} [data] The message to be sent
     * @param {String} [destination] full user id for the destination
     */
    var eventEmit = function(type, data, destination) {
        // if cobrowsing isn't started don't send any messages
        if (coBrowseStarted === false) {
            return;
        }

        // send Kandy session message
        kandy.session.sendData(
            sessionId, {
                type: type,
                data: data
            },
            null,
            null,
            destination
        );
    };


    /* ****************************************************************************************************************
     * functions related to agent screen starts here
     * ****************************************************************************************************************/

    /*
     * Render the complete html or a partial update from the users screen
     *
     * @method renderScreen
     * @param {Object} [msg] contains full or partial HTML and other update information
     */
    var renderScreen = function(msg) {
        // set the iframe content window if its undefined
        if (typeof iframe === 'undefined' || iframe == null) {
            iframeSetup();
        }

        // cleanup the reseved html
        var oDOM = cleanHtml(msg.html);

        // if rendering the whole page or the <head> make sure there is a proper <base> tag
        if ((msg.element == 'HTML' || msg.element == 'HEAD') && typeof msg.baseURI == 'string' && !oDOM.head.getElementsByTagName('base')[0]) {
            // create a new <base> tag
            var newBaseTag = document.createElement('base');
            newBaseTag.href = msg.baseURI;

            // add it to the top of the <head> tag
            if (oDOM.head.firstChild) {
                oDOM.head.insertBefore(newBaseTag, oDOM.head.firstChild);
            } else {
                oDOM.head.appendChild(newBaseTag);
            }
        }

        // render the html into the iframe
        if (msg.element == 'HTML') {
            // set the iframe size
            iframe.width = msg.screenx + 'px';
            iframe.height = msg.screeny + 'px';

            // set the scroll lock to false to pervent content load scroll
            scrollLock = true;

            // if rendering the full page get the whole dom
            var content = serializeXmlNode(oDOM);

            // open the iframe on write the html content to the frame
            iframeDocument.open();
            iframeDocument.write(content);
            iframeDocument.close();

            // check if the iframe is ready if not add a listener for when it is
            if (iframeDocument.readyState === 'complete') {
                // set the scroll lock to false to allow scrolling
                scrollLock = false;

                // scroll the iframe to match the users window
                iframeWindow.scroll(msg.scrollx, msg.scrolly);
            } else {
                // set a onreadystatechange handler to set the user's scroll position
                iframeDocument.onreadystatechange = function() {
                    if (iframeDocument.readyState === 'complete') {
                        // set the scroll emit flag to false to pervent the users window from scrolling
                        emitScrollEvent = false;

                        // set the scroll lock to false to allow scrolling
                        scrollLock = false;

                        // scroll the iframe to match the users window
                        iframeWindow.scroll(msg.scrollx, msg.scrolly);
                    }
                };
            }

            // reset the iframe event listeners
            agentAddEventListeners();
        } else if (msg.element == 'HEAD') {
            // replace the <head> tag
            iframeDocument.documentElement.replaceChild(oDOM.head.cloneNode(true), iframeDocument.head);
        } else if (msg.element == 'BODY') {
            // replace the <body> tag
            iframeDocument.documentElement.replaceChild(oDOM.body.cloneNode(true), iframeDocument.body);
        } else {
            // strip the # from the id
            var id = msg.element.substr(1);

            // get the node to be replaced
            var node = iframeDocument.getElementById(id);

            // replace the node
            node.parentNode.replaceChild(oDOM.getElementById(id).cloneNode(true), node);
        }

        // add the inline style tag if the css has changed
        if (typeof msg.css == 'string') {
            // remove existing styles
            var styleTags = iframeDocument.getElementsByTagName('style');
            for (var s = 0; s < styleTags.length; s++) {
                styleTags[s].parentNode.removeChild(styleTags[s]);
            }

            // create <style> tag
            var newStyleTag = document.createElement('style');
            newStyleTag.type = 'text/css';

            // add the css to the <style> tag
            newStyleTag.appendChild(document.createTextNode(msg.css));

            // append the <style> tag to the head
            iframeDocument.head.appendChild(newStyleTag);
        }

        // set focus to the frame
        iframeWindow.focus();

        console.log(Math.floor(Date.now() / 1000) + ' Changed ' + msg.element); // [DEBUG]
    };

    /*
     * Remove the iframe event listeners
     *
     * @method agentRemoveEventListeners
     */
    var agentRemoveEventListeners = function() {
        // set reference to the iframe content window
        if (typeof iframeWindow == 'undefined') {
            return;
        }

        // clear all of the iframe event listeners
        iframeWindow.removeEventListener('mousemove', agentSendMouseMove);
        iframeWindow.removeEventListener('scroll', agentSendScroll);
        iframeWindow.removeEventListener('click', agentSendClick);
        iframeWindow.removeEventListener('input', agentInputChange);
    };

    /*
     * Adds the iframe event listeners
     *
     * @method agentAddEventListeners
     */
    var agentAddEventListeners = function() {
        // make sure there isn't currently any cobrowsing event listeners binded
        agentRemoveEventListeners();

        // listen for mouse movement in the iframe
        iframeWindow.addEventListener('mousemove', agentSendMouseMove);

        // listen for scrolling in the iframe
        iframeWindow.addEventListener('scroll', agentSendScroll);

        // listen for any clicks in the iframe
        iframeWindow.addEventListener('click', agentSendClick);

        // listen for any input changes
        iframeWindow.addEventListener('input', agentInputChange);
    };

    /*
     * Respond to an agent click in the agent iframe
     *
     * @method agentSendClick
     * @param {Event} click event
     */
    var agentSendClick = function(e) {
        // pervent default click action
        e.preventDefault();

        // send click notification as long the id isn't empty
        if (e.target.id != null && e.target.id != '') {
            eventEmit('agentClick', e.target.id);
        }
    };

    /*
     * Send the agents mouse position to the user
     *
     * @method agentSendMouseMove
     * @param {Event} mouse movement event
     */
    var agentSendMouseMove = function(e) {
        // send mouse movement notification
        eventEmit('agentMouseMove', {
            x: e.clientX,
            y: e.clientY
        });
    };

    /*
     * Send the agents scroll position to the user
     *
     * @method agentSendScroll
     * @param {Event} scroll event
     */
    var agentSendScroll = function(e) {
        // send scroll notification if it didn't come from the user
        if (emitScrollEvent && !scrollLock) {
            eventEmit('agentWindowScroll', {
                x: (e.target.documentElement.scrollLeft != 0) ? e.target.documentElement.scrollLeft : e.target.body.scrollLeft,
                y: (e.target.documentElement.scrollTop != 0) ? e.target.documentElement.scrollTop : e.target.body.scrollTop
            });
        }

        // set the scroll emit flag back to true
        emitScrollEvent = true;
    };

    /*
     * Moved the agents cursor on the users screen
     *
     * @method displayUserMouseMove
     * @param {Object} [msg] contains the x and y coordinates of the agents cursor
     */
    var displayUserMouseMove = function(msg) {
        // if the cobrowsing div isn't setup yet return
        if (typeof coBrowsingDiv == 'undefined') {
            return;
        }

        var cursor = document.getElementById('coBrowsingCursor-' + sessionId);
        // check to make sure the cursor is on the page, if its not add it
        if (cursor == null) {
            // create cursor node
            cursor = document.createElement('img');
            cursor.id = 'coBrowsingCursor-' + sessionId;
            cursor.src = defaultCursor;
            cursor.style.position = 'absolute';
            cursor.style.zIndex = '2147483647';

            // append cursor to the cobrowsing div
            coBrowsingDiv.appendChild(cursor);
        }


        // move the mouse cursor
        cursor.style.left = msg.x + 'px';
        cursor.style.top = msg.y + 'px';

    };

    /*
     * Scroll the users window to match the agents
     *
     * @method displayUserScroll
     * @param {Object} [msg] contains the x and y coordinates of the viewport scroll position
     */
    var displayUserScroll = function(msg) {
        // if the cobrowsing div isn't setup yet return
        if (typeof coBrowsingDiv == 'undefined') {
            return;
        }

        // the the emit flag to false to pervent sending the scroll event back to the agent
        emitScrollEvent = false;

        // scroll the window the same place as the agent
        iframeWindow.scroll(msg.x, msg.y);
    };

    /*
     * Resize the agents viewport
     *
     * @method resizeViewport
     * @param {Object} [msg] contains the x and y window sizes
     */
    var resizeViewport = function(msg) {
        // resize the the iframe size
        iframe.width = msg.x + 'px';
        iframe.height = msg.y + 'px';
    };

    /*
     * Gets any input changes the agent makes and send it to the user
     *
     * @method agentInputChange
     */
    var agentInputChange = function(e) {
        // set the element reference
        var element = e.target;

        // set the holder for changed data
        var data = {
            id: element.id,
            type: element.nodeName
        };

        // switch between input types
        switch (element.nodeName) {
            case 'INPUT':
                // check for a password field
                switch (element.type) {
                    case 'password':
                        // if the field is a password hide the value
                        for (var value = ''; value.length < element.value.length;) {
                            value += '*';
                        }

                        data.value = value;
                        break;
                    default:
                        // set the value from the input field
                        data.value = element.value;
                        break;
                }
                break;
            case 'SELECT':
                // set a holder for the changed options
                data.options = {};

                // loop though each option
                for (var o = element.options.length - 1; o >= 0; o--) {
                    // check if the option is selected
                    if (element.options[o].selected) {
                        // set the selected flag
                        data.options[o] = element.options[o].selected;
                    }
                }
                break;
            case 'TEXTAREA':
                // set the value from the textaera value
                data.value = element.value;
                break;
        }

        // send input change to the user
        eventEmit('agentInputChange', data);
    };

    /*
     * Adds the agents iframe to the cobrowsing container and setups the iframe references
     *
     * @method iframeSetup
     */
    var iframeSetup = function() {
        // clear the cobrowsing container div and insert holder div
        coBrowsingContainer.innerHTML = '<div id="coBrowsingDiv-' + sessionId + '" style="position: relative;"></div>';
        coBrowsingDiv = document.getElementById('coBrowsingDiv-' + sessionId);

        // clear the cobrowsing div and insert the iframe
        coBrowsingDiv.innerHTML = '<iframe id="coBrowsingIframe-' + sessionId + '" sandbox="allow-same-origin allow-scripts" src="javascript:;" style="border: none;"></iframe>';

        // set references to the iframe
        iframe = document.getElementById('coBrowsingIframe-' + sessionId);
        iframeWindow = iframe.contentWindow;
        iframeDocument = iframeWindow.document;
    };

    /**
     * Starts listening for a user sending their webpage in the session. Displays the webpage in the specified container when received.
     *
     * @method startBrowsingAgent
     * @param {String} session The session ID.
     * @param {HTMLElement} container Element reference to be used for the agent's view.
     */
    me.startBrowsingAgent = function(session, container) {
        // set the session id
        sessionId = session;

        // set the cobrowsing container
        coBrowsingContainer = container;

        // set the started flag
        coBrowseStarted = true;

        // register Kandy session listeners
        kandy.session.setListeners(sessionId, {
            'onData': agentEventRecieved
        });

        // request full page
        eventEmit('requestFullPage', true);
    };

    /**
     * Stops listening for a webpage in the session. Clears the container used for viewing.
     *
     * @method stopBrowsingAgent
     */
    me.stopBrowsingAgent = function() {
        // remove agent event listeners
        agentRemoveEventListeners();

        // clear references to the iframe and cobrowsing div
        coBrowsingDiv = iframe = iframeWindow = iframeDocument = null;

        // empty the cobrowsing container
        while (coBrowsingContainer.firstChild) {
            coBrowsingContainer.removeChild(coBrowsingContainer.firstChild);
        }

        // clear the references to the session and cobrowsing container
        sessionId = coBrowsingContainer = null;

        // set the started flag
        coBrowseStarted = false;
    };

    /* ****************************************************************************************************************
     * functions related to the users starts here
     * ****************************************************************************************************************/

    /*
     * Trigger a click event from an agent
     *
     * @method triggerAgentClick
     * @param {String} [msg] contains the id of the element clicked
     */
    var triggerAgentClick = function(msg) {
        // trigger a click from the agent
        document.getElementById(msg).click();
    };

    /*
     * Sets the position of the agents cursor in the users window
     *
     * @method getAgentMouseMove
     * @param {Object} [msg] contains the x and y coordinates of the agents cursor
     */
    var getAgentMouseMove = function(msg) {

        var cursor = document.getElementById('coBrowsingCursor-' + sessionId);
        // check to make sure the cursor is on the page, if its not add it
        if (cursor == null) {
            // create cursor node
            cursor = document.createElement('img');
            cursor.id = 'coBrowsingCursor-' + sessionId;
            cursor.src = defaultCursor;
            cursor.style.position = 'fixed';
            cursor.style.zIndex = '2147483647';

            // append cursor to the document body
            document.body.appendChild(cursor);
        }

        // move the mouse cursor
        cursor.style.left = msg.x + 'px';
        cursor.style.top = msg.y + 'px';

    };

    /*
     * Sets the window scroll position to match the agents
     *
     * @method getAgentWindowScroll
     * @param {Object} [msg] contains the x and y coordinates of the scroll position
     */
    var getAgentWindowScroll = function(msg) {
        // the the emit flag to false to pervent sending the scroll event back to the agent
        emitScrollEvent = false;

        // scroll the window the same place as the agent
        window.scroll(msg.x, msg.y);
    };

    /*
     * Send the users mouse position to the agent
     *
     * @method userMouseMove
     * @param {Event} mouse movement event
     */
    var userMouseMove = function(e) {
        // send mouse movement notification
        eventEmit('userMousePosition', {
            x: e.clientX,
            y: e.clientY
        });
    };

    /*
     * Send the users scroll position to the agent
     *
     * @method userScrollPosition
     * @param {Event} scroll event
     */
    var userScrollPosition = function(e) {
        // send scroll notification if it didn't come from the agent
        if (emitScrollEvent) {
            eventEmit('userWindowScroll', {
                x: (e.target.documentElement.scrollLeft != 0) ? e.target.documentElement.scrollLeft : e.target.body.scrollLeft,
                y: (e.target.documentElement.scrollTop != 0) ? e.target.documentElement.scrollTop : e.target.body.scrollTop
            });
        }

        // set the scroll emit flag back to true
        emitScrollEvent = true;
    };

    /*
     * Send the users new window size to the agent
     *
     * @method userWindowResize
     * @param {Event} window event object
     */
    var userWindowResize = function(e) {
        eventEmit('userWindowResize', {
            x: window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
            y: window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
        });
    };

    /*
     * Displays any input changes that the agent makes
     *
     * @method showAgentInputChange
     */
    var showAgentInputChange = function(msg) {
        // set the element reference
        var element = document.getElementById(msg.id);

        // set form emit to false to pervent loop updates
        emitFormChange = false;

        // switch between input types
        switch (msg.type) {
            case 'INPUT':
                // set the value from the input field
                element.value = msg.value;
                break;
            case 'SELECT':
                // loop though each option
                for (var o = element.options.length - 1; o >= 0; o--) {
                    // check if the option is selected
                    element.options[o].selected = (msg.options[o]);
                }
                break;
            case 'TEXTAREA':
                // set the value from the textaera value
                element.value = msg.value;
                break;
        }
    };

    /*
     * Send the full or partial screen elements to the agent
     *
     * @method sendScreen
     * @param {String} [element] the element of that needs to be updated
     */
    var sendScreen = function(element, user) {
        // set the element thats being updated or HTML for the whole page
        var getElement = (typeof element == 'string') ? element : 'HTML';

        // get the html content
        var contentHtml;
        if (getElement == 'HTML') {
            // get the full page and doctype
            contentHtml = serializeXmlNode(document.doctype) + document.documentElement.outerHTML;

            // output the full html document
            contentHtml = serializeXmlNode(cleanHtml(contentHtml));
        } else if (getElement == 'HEAD') {
            // get just the <head> tag
            contentHtml = cleanHtml(document.head.outerHTML).head.outerHTML;
        } else if (getElement == 'BODY') {
            // get just the <body> tag
            contentHtml = cleanHtml(document.body.outerHTML).body.outerHTML;
        } else {
            // get the element id
            var id = getElement.substr(1);

            // get the element and clean the html
            contentHtml = cleanHtml(document.getElementById(id).outerHTML).getElementById(id).outerHTML;
        }

        // setup the message to agent
        var message = {
            element: getElement,
            html: contentHtml
        };

        // get all on page <style> blocks and loop through each to add it to a single css variable
        var inlineCSS = '',
            styleTags = document.getElementsByTagName('style');
        for (var s = 0; s < styleTags.length; s++) {
            inlineCSS += styleTags[s].innerHTML;
        }

        // if the current css doesn't match what we have in the cache send it to be updated
        if (inlineCSS !== inlineCSSCache || getElement == 'HTML') {
            message.css = inlineCSSCache = inlineCSS;
            console.log('New CSS');
        }

        // send extra info if sending the whole page
        if (getElement == 'HTML') {
            // send the window height and width
            message.screenx = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
            message.screeny = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

            // send the scroll position
            message.scrollx = (document.documentElement.scrollLeft != 0) ? document.documentElement.scrollLeft : document.body.scrollLeft;
            message.scrolly = (document.documentElement.scrollTop != 0) ? document.documentElement.scrollTop : document.body.scrollTop;
        }

        // get the base URI if sending the whole page or the <head>
        if (getElement == 'HTML' || getElement == 'HEAD') {
            message.baseURI = document.baseURI;
        }

        // send the changes to the agent
        eventEmit('screenUpdate', message, user);

        console.log(Math.floor(Date.now() / 1000) + ' Screen Sent ' + getElement); // [DEBUG]
    };

    /*
     * Removes the user event listeners
     *
     * @method userRemoveEventListeners
     */
    var userRemoveEventListeners = function() {
        // clear all of the document event listeners
        document.removeEventListener('mousemove', userMouseMove);
        document.removeEventListener('scroll', userScrollPosition);

        // clear the window document event listeners
        window.removeEventListener('resize', userWindowResize);
        window.removeEventListener('input', saveFormData);
        window.removeEventListener('change', radioCheckboxChange);
    };

    /*
     * Adds the user event listeners
     *
     * @method userAddEventListeners
     */
    var userAddEventListeners = function() {
        // make sure there isn't currently any cobrowsing event listeners binded
        userRemoveEventListeners();

        // listen for mouse movement in the iframe
        document.addEventListener('mousemove', userMouseMove);

        // listen for scrolling in the iframe
        document.addEventListener('scroll', userScrollPosition);

        // listen for window resize events
        window.addEventListener('resize', userWindowResize);

        // listen for form changes
        window.addEventListener('input', saveFormData);
        window.addEventListener('change', radioCheckboxChange);
    };

    /*
     * The mutation observer handler function that is called when there is a group of mutations
     *
     * @method mutationHandler
     * @param {Object} [mutations] contains all of the mutations that have happened
     * @param {Object} [observer] contains a reference to the mutation observer
     */
    var mutationHandler = function(mutations, observer) {
        // test each mutation to understand the updated dom
        mutations.forEach(function(mutation) {
            // set defualt options
            var element, treePosition = 0,
                id = '',
                idTree = [];

            // check to make sure the mutation wasn't the agents cursor being added to the screen
            if (typeof mutation.addedNodes[0] != 'undefined' && mutation.addedNodes[0].id == 'coBrowsingCursor-' + sessionId) {
                return;
            }

            // set the element to the current mutation
            if (mutation.type == 'characterData' || (mutation.type == 'attributes' && mutation.attributeName == 'id')) {
                // if the mutation type is characterData get the element the characterData change was in || or if the id was changed force get the parent node
                element = mutation.target.parentNode;
            } else {
                element = mutation.target;
            }

            // while there is a parent item
            while (element.parentNode) {
                // if the element isn't empty
                if (element.id != '' || element.tagName == 'HTML' || element.tagName == 'HEAD' || element.tagName == 'BODY') {
                    // set the element tag or id
                    if (element.tagName == 'HTML' || element.tagName == 'HEAD' || element.tagName == 'BODY') {
                        var thisID = element.tagName;
                    } else {
                        var thisID = '#' + element.id;
                    }

                    // set the id of the first id in the mutation
                    if (id == '') {
                        id = thisID;
                    }

                    // push the id onto the tree
                    idTree.push(thisID);
                }

                // count the parent number
                if (id != '') {
                    treePosition++;
                }

                // set the parent element for the next iteration
                element = element.parentNode;
            }

            // if no id is set do a full page refresh
            if (id == '') {
                lowestElementId = 'HTML';
                return false;
            }

            // verify the change isn't the cursor moving
            if (id == '#coBrowsingCursor-' + sessionId) {
                return false;
            }

            // flip the id tree for easy walking
            idTree = idTree.reverse();

            // check if the modifyed element is the highest in the dom tree
            if (lowestElement == -1) {
                console.log('First element: ' + id + ' (' + treePosition + ')'); // [DEBUG]

                // set the first element
                lowestElement = treePosition;
                lowestElementId = id;
                lowestElementTree = idTree;
            } else if (idTree.indexOf(lowestElementId) == -1) {
                // if the modified element is not under the current highest element negotiate the highest common dom element
                console.log(id + ' (' + treePosition + ') not under ' + lowestElementId); // [DEBUG]

                // set the default common element
                var lastCommonElement = 'HTML';

                // walk through the element id tree to find the last common element
                lowestElementTree.forEach(function(value) {
                    if (idTree.indexOf(value) != -1) {
                        lastCommonElement = value;
                    } else {
                        return false;
                    }
                });

                // set the new lowest common element
                lowestElement = lowestElementTree.indexOf(lastCommonElement) + 1;
                lowestElementId = lastCommonElement;
                lowestElementTree = lowestElementTree.slice(0, lowestElement);

                console.log('Renegotiated top to: ' + lowestElementId + ' (' + lowestElement + ')'); // [DEBUG]
            }
        });

        // make sure every element has a unique id and get changed count
        var idChanged = assignUniqueIds();

        // save any form changes to the DOM and get the changed count
        var formChanged = saveFormData();

        // if the number of elements changed isn't 0 hold the screen update
        if (idChanged != 0 || formChanged != 0) {
            console.log('Updated skipped, ids:' + idChanged + ' forms:' + formChanged); // [DEBUG]
            return;
        }

        // if full page refresh is set, do a full page refresh otherwise a partial page update
        if (lowestElementId == 'HTML') {
            console.log('Doing a full page refresh'); // [DEBUG]

            // do full page refresh
            sendScreen();
        } else if (lowestElementId != '') {
            console.log('Doing a partial page update on: ' + lowestElementId); // [DEBUG]

            // send a partial page update
            sendScreen(lowestElementId);
        }

        // clear the lowest element
        lowestElement = -1;
        lowestElementId = '';
        lowestElementTree = '';
    };

    /**
     * Starts sending current webpage to the session.
     *
     * @method startBrowsingUser
     * @param {String} session The session ID.
     */
    me.startBrowsingUser = function(session) {
        // set the session id
        sessionId = session;

        // set the started flag
        coBrowseStarted = true;

        // register Kandy session listeners
        kandy.session.setListeners(sessionId, {
            'onData': userEventRecieved
        });

        // assign unique ids to all elements on the page to allow for agent interaction
        assignUniqueIds();

        // save form data to the dom before starting the cobrowsing session
        saveFormData();

        // sends the screen to any connected agents
        sendScreen();

        // add the document listeners for user side changes
        userAddEventListeners();

        // setup the mutation observer to watch for dom changes
        mutationObserver = new MutationObserver(mutationHandler);

        // define the elements that should be observed by the observer
        mutationObserver.observe(document.body, {
            childList: true,
            attributes: true,
            characterData: true,
            subtree: true
        });
    };

    /**
     * Stops sending webpage to the session.
     *
     * @method stopBrowsingUser
     */
    me.stopBrowsingUser = function() {
        // stop lissning the mutationObserver
        mutationObserver.disconnect();

        // remove document and window listeners
        userRemoveEventListeners();

        // inform connected agents that the screenshare has been stopped
        eventEmit('closeCoBrowse', true);

        // remove agents cursor
        var cursor = document.getElementById('coBrowsingCursor-' + sessionId);
        if (cursor != null) {
            cursor.remove();
        }

        // set the started flag
        coBrowseStarted = false;
    };

    /* ****************************************************************************************************************
     * utility functions starts here
     * ****************************************************************************************************************/

    /*
     * Clean and strip the HTML for transmission and display
     *
     * @method cleanHtml
     * @param {String} html
     * @returns {Object} HTMLDocument object
     */
    var cleanHtml = function(html) {
        // set the tags to be removed
        var removeTags = ['SCRIPT', 'STYLE'];

        // regex search string for on* attributes like onload, onclick, etc.
        var onSearch = new RegExp('^on', 'i');

        // regex search string for attribute level javascript
        var jsSearch = new RegExp('^javascript:', 'i');

        // array of nodes that needs to be removed
        var deleteNodeList = [];

        // create a new dom object from a html string
        var oDOM = new DOMParser().parseFromString(html, 'text/html');

        // get all of the tags
        var elements = oDOM.getElementsByTagName('*');


        // for each element
        for (var i = 0; i < elements.length; i++) {
            // set the current element
            var element = elements[i];

            // check if the element should be removed
            if (removeTags.indexOf(element.nodeName) != -1) {
                // adds the element onto the node removal list
                deleteNodeList.push(element);

                continue;
            }

            // check each attribute that the element has
            for (var a = 0; a < element.attributes.length; a++) {
                // set the current attribute
                var attr = element.attributes[a];

                // check if the attribute is a on* attribute
                if (onSearch.test(attr.name)) {
                    element.removeAttribute(attr.name);
                    continue;
                }

                // check if the attribute has javascript
                if (jsSearch.test(attr.value)) {
                    attr.value = '';
                }
            }
        }

        // fix for IE not allowing optional parameters
        var fliter = null;

        // create a tree walker to find all html comments
        var treeWalker = document.createTreeWalker(oDOM, NodeFilter.SHOW_COMMENT, fliter, false);

        // stores each comment node that needs to be removed
        while (treeWalker.nextNode()) {
            deleteNodeList.push(treeWalker.currentNode);
        }

        // remove all of the illegal nodes
        deleteNodeList.forEach(function(node) {
            node.parentNode.removeChild(node);
        });

        // remove the agent cursor
        var cursor = oDOM.getElementById('coBrowsingCursor-' + sessionId);
        cursor && cursor.parentNode && cursor.parentNode.removeChild(cursor);

        return oDOM;
    };

    /*
     * Serialize the XML node to a string
     *
     * @method serializeXmlNode
     * @param {Object} document node
     * @returns {String} the html from the XML node
     */
    var serializeXmlNode = function(xmlNode) {
        if (typeof xmlNode === 'object' && xmlNode != null) {
            if (typeof window.XMLSerializer != 'undefined') {
                return (new window.XMLSerializer()).serializeToString(xmlNode);
            } else if (typeof xmlNode.xml != 'undefined') {
                return xmlNode.xml;
            }
        }

        return '';
    };

    /*
     * Saves the current form data to the DOM
     *
     * @method saveFormData
     * @returns {Number} count of the number of elements that where changed
     */
    var saveFormData = function() {
        // check to make sure a form save is needed
        if (!emitFormChange) {
            emitFormChange = true;
            return;
        }

        // count for the number of changed elements
        var changedCount = 0;

        // get all <input> tags
        var inputs = document.getElementsByTagName('input');

        // process each <input> tag
        for (var i = 0; i < inputs.length; i++) {
            // set the element reference
            var element = inputs[i];

            // switch the input type
            switch (element.type) {
                case 'password':
                    // if the field is a password hide the value
                    for (var value = ''; value.length < element.value.length;) {
                        value += '*';
                    }

                    // load the new hidden value into the dom
                    if (element.defaultValue != value) {
                        element.defaultValue = value;
                        changedCount++;
                    }
                    break;
                case 'checkbox':
                case 'radio':
                    // set the checked value
                    if (element.defaultChecked != element.checked) {
                        element.defaultChecked = element.checked;
                        changedCount++;
                    }
                    break;
                case 'reset':
                case 'submit':
                case 'button':
                    // don't change button values
                    break;
                default:
                    // set the value in the dom
                    if (element.defaultValue != element.value) {
                        element.defaultValue = element.value;
                        changedCount++;
                    }
                    break;
            }
        }

        // get all <select> tags
        var selects = document.getElementsByTagName('select');

        // process each <select> tag
        for (var i = 0; i < selects.length; i++) {
            // set the element reference
            var element = selects[i];

            // loop though each option
            for (var o = element.options.length - 1; o >= 0; o--) {
                // set the selected flag
                if (element.options[o].defaultSelected != element.options[o].selected) {
                    element.options[o].defaultSelected = element.options[o].selected;
                    changedCount++;
                }
            }
        }

        // get all <textarea> tags
        var textareas = document.getElementsByTagName('textarea');

        // process each <textarea> tag
        for (var i = 0; i < textareas.length; i++) {
            // save the value into the dom
            if (textareas[i].defaultValue != textareas[i].value) {
                textareas[i].defaultValue = textareas[i].value;
                changedCount++;
            }
        }

        return changedCount;
    };

    /*
     * Saves changes to radio buttons and checkboxs to the DOM
     *
     * @method radioCheckboxChange
     */
    var radioCheckboxChange = function(e) {
        // only trigger a form save if the element is a radio button or an checkbox
        if (e.target.nodeName == 'INPUT' && (e.target.type == 'radio' || e.target.type == 'checkbox')) {
            // save the form data to dom
            saveFormData();
        }
    };

    /*
     * Adds a unique id to elements on the page that don't already have one to allow for agent interaction
     *
     * @method assignUniqueIds
     * @returns {Number} number of elements that needed ids added
     */
    var assignUniqueIds = function() {
        // set the base id name
        var idName = 'uid-ui-';

        // set the start unique id count
        var uniqueId = 0;

        // get all of the tags without an id or an emtpy id
        var elements = document.querySelectorAll('body *:not([id]), body *[id=""]');

        // process each element without a vaild id
        for (var l = 0; l < elements.length; l++) {
            // if there is an element with the id increase the unique id count
            while (document.getElementById(idName + uniqueId) != null) {
                uniqueId++;
            }

            // add the unique id and increase the unique id count
            elements[l].id = idName + uniqueId;
            uniqueId++;
        }

        return elements.length;
    };

    return me;
}());

/**
 * Kandy messaging is used to send and receive messages. Messages can be regular chat messages, SMS, files, audio, video, or images. Using messaging you can also manage messaging groups.
 *
 * @class messaging
 * @namespace kandy
 * @static
 */
api.messaging = (function () {

    /*
     * @property {Object} _imContentTypes Holds IM content types.
     */
    var _imContentTypes = {
        VIDEO: 'video',
        AUDIO: 'audio',
        IMAGE: 'image',
        FILE: 'file',
        LOCATION: 'location',
        CONTACT: 'contact'
    };

    var me = {};

    function _sendIM(destination, contentType, msg, success, failure, isGroup, messageOptions) {
        messageOptions = messageOptions || {};

        // Create the message object.
        var uuid = (messageOptions && messageOptions.uuid) || utils.createUUIDv4();
        var message = {
            message: {
                contentType: contentType,
                UUID: uuid,
                message: msg,
                additional_data: messageOptions.additionalData
            }
        };

        // Select the correct url and params depending on whether this is a group IM or not.
        var url;
        var params;
        if(isGroup){
            utils.extend(message.message, {
                'group_id': destination
            });
            url = '/users/chatgroups/chatgroup/messages';
            //message.messageType = "groupChat";
        } else {
            message.message.destination = destination;
            message.messageType = 'chat';
            url = '/devices/messages';
            params = {
                'device_id': _userDetails.devices[0].id
            };
        }

        _kandyRequest({
            type: 'POST',
            url: url,
            params: params,
            data: message,
            success: function (response) {
                if (success) {
                    success(message.message);
                }
            },
            failure: failure
        });
        return uuid;
    }

    /*
     * Sends a File message to another Kandy user
     *
     * @method _sendImWithAttachment
     * async
     * @param {String} destination Destination of message recipient
     * @param {Object} attachment Attachement to be sent
     * @param {String} contentType Content Type of file.
     * @param {Function} success The success callback. It receives no parameters.
     * @param {Function} failure The failure callback. It receives one parameter.
     * @param {String} failure.errorMessage The error message explaining what failed.
     */
    function _sendImWithAttachment(destination, attachment, contentType, success, failure, isGroup, messageOptions) {
        if (_config.messageProvider === 'fring') {

            var uuid = utils.createUUIDv4();
            messageOptions = messageOptions || {};
            messageOptions.uuid = uuid;

            // Upload file and if we get a success send the IM
            me.uploadFile(
                attachment,
                function (fileUuid) {
                    var message = {
                        mimeType: attachment.type,
                        'content_uuid': fileUuid,
                        'content_name': attachment.name,
                        'contact_display_name': messageOptions.contact_display_name
                    };

                    return _sendIM(destination, contentType, message, success, failure, isGroup, messageOptions);
                },
                failure
            );
            return uuid;
        } else {
            _logger.error('NOT SUPPORTED');
            if(failure){
                failure();
            }
        }
    }

    function _sendImWithLocation(destination, location, success, failure, isGroup, messageOptions) {
        // Creating an alias for backwards compatibility
        if (location.location_latitude && location.location_longitude) {
            location.latitude = location.location_latitude;
            location.longitude = location.location_longitude;
        }

        return _sendIM(destination, _imContentTypes.LOCATION, {
            mimeType: 'location/utm',
            'media_map_zoom': 10,
            'location_latitude': location.latitude,
            'locationLatitude': location.latitude,
            'location_longitude': location.longitude,
            'locationLongitude': location.longitude
        }, success, failure, isGroup, messageOptions);

    }

    function _sendJSON(user, object, success, failure, isGroup, messageOptions) {
        return _sendIM(user, 'text', {
            mimeType: 'application/json',
            json: JSON.stringify(object)
        }, success, failure, isGroup, messageOptions);
    }

    /**
     * Sends an SMS message.
     *
     * @method sendSMS
     * @async
     * @param {String} number Phone number to which SMS message will be sent. Make sure to preceed the phone number with the appropriate country code.
     * @param {String} sender A description of the sender (could be name or phone number).
     * @param {String} text Text of message to send.
     * @param {Function} success The success callback. It receives no parameters.
     * @param {Function} failure The failure callback. It receives one parameter.
     * @param {String} failure.errorMessage The error message explaining what failed.
     */
    me.sendSMS = function (number, sender, text, success, failure) {
        _kandyRequest({
            type: 'POST',
            url: '/devices/smss',
            params: {
                'device_id': _userDetails.devices[0].id
            },
            data: {
                message: {
                    source: sender,
                    destination: number,
                    message: {text: text}
                }
            },

            // TODO: Shouldn't we map to return result here?
            success: success,
            failure: failure
        });
    };

    /**
     * Sends an instant message to another Kandy user.
     *
     * @method sendIm
     * @async
     * @param {String} fullUserId Username of the intended recipient.
     * @param {String} message Message to send.
     * @param {Function} success The success callback. It receives one parameter.
     * @param {Object} success.result The result object.
     * @param {String} success.result.UUID Unique Id for the message.
     * @param {String} success.result.contentType The type of the message.
     * @param {String} success.result.destination The full user Id of the message's destination.
     * @param {Object} success.result.message Object representing the payload of the message.
     * @param {String} success.result.message.mimeType The MIME type of the message.
     * @param {String} success.result.message.text The actual text of the message.
     * @param {Function} failure The failure callback. It receives one parameter.
     * @param {String} failure.errorMessage The error message explaining what failed.
     * @param {Object} options Object of options for the message.
     * @param {Object} options.additionalData Object with arbitrary metadata about the IM.
     * @return {String} uuid Unique string identifier for the sent message.
     * @example
     * Here is an example of a result given to the success function.
     * ``` javascript
     *  {
     *      "UUID": "E72F1D02-5ED7-4E36-9938-78460ABD286B",
     *      "contentType": "text",
     *      "destination": "user1@test.kandy.io"
     *      "message": {
     *          "mimeType": "text/plain",
     *          "text": "this is the text to send"
     *      },
     *      "additionalData" {
     *          ...
     *      }
     *  }
     * ```
     */
    me.sendIm = function(fullUserId, message, success, failure, options) {
        if (_config.messageProvider === 'fring') {
            return _sendIM(fullUserId, 'text', { 'mimeType': 'text/plain', 'text': message }, success, failure, false, options);
        } else if (_config.messageProvider === 'spidr') {
            var im = new fcs.im.Message();
            im.primaryContact = fullUserId;
            im.type = 'A2';
            im.msgText = message;
            im.charset = 'UTF-8';

            fcs.im.send(im, success, failure);
            return 0;
        }
    };

    /**
     * Sends arbitrary JSON object via instant message.
     *
     * @method sendJSON
     * @async
     * @param {String} fullUserId Full user Id of the intended recipient.
     * @param {Object} object Arbitrary JSON object to send.
     * @param {Function} success The success callback. It receives one parameter.
     * @param {Object} success.result The result object.
     * @param {String} success.result.UUID Unique Id for the message.
     * @param {String} success.result.contentType The type of the message.
     * @param {String} success.result.destination The full user Id of the message's destination.
     * @param {Object} success.result.message Object representing the payload of the message.
     * @param {String} success.result.message.mimeType The MIME type of the message.
     * @param {String} success.result.message.json The actual text of the message.
     * @param {Function} failure The failure callback. It receives no parameters.
     * @param {Object} options Object of options for the message.
     * @param {Object} options.additionalData Object with arbitrary metadata about the IM.
     * @return {String} uuid Unique string identifier for the sent message.
     * @example
     * Here is an example of a result given to the success function.
     * ``` javascript
     *  {
     *      "UUID": "E72F1D02-5ED7-4E36-9938-78460ABD286B",
     *      "contentType": "text",
     *      "destination": "user1@test.kandy.io"
     *      "message": {
     *          mimeType: "application/json",
     *          json: "{"key":"value"}"
     *      },
     *      "additionalData" {
     *          ...
     *      }
     *  }
     * ```
     */
    me.sendJSON = function (fullUserId, object, success, failure, options) {
        return _sendJSON(fullUserId, object, success, failure, false, options);
    };

    /**
     * Sends a File via instant message.
     *
     * @method sendImWithFile
     * @async
     * @param {String} fullUserId Full user Id of the intended recipient.
     * @param {File} file File object to send.
     * @param {Function} success The success callback. It receives one parameter.
     * @param {Object} success.result The result object.
     * @param {String} success.result.UUID Unique Id for the message.
     * @param {String} success.result.contentType The type of the message.
     * @param {String} success.result.destination The full user Id of the message's destination.
     * @param {Object} success.result.message Object representing the payload of the message.
     * @param {String} success.result.message.mimeType The MIME type of the message.
     * @param {String} success.result.message.content_name The name of the uploaded file.
     * @param {String} success.result.message.content_uuid The UUID of the file that was uploaded.
     * @param {Function} failure The failure callback. It receives no parameters.
     * @param {Object} options Object of options for the message.
     * @param {Object} options.additionalData Object with arbitrary metadata about the IM.
     * @return {String} uuid Unique string identifier for the sent message.
     * @example
     * Here is an example of a result given to the success function.
     * ``` javascript
     *  {
     *      "UUID": "E72F1D02-5ED7-4E36-9938-78460ABD286B",
     *      "contentType": "file",
     *      "destination": "user1@test.kandy.io"
     *      "message": {
     *          mimeType: "application/pdf",
     *          content_name: "file.pdf",
     *          content_uuid: "738814CB-1019-4482-9200-56CB3FA033D9"
     *      },
     *      "additionalData" {
     *          ...
     *      }
     *  }
     * ```
     */
    me.sendImWithFile = function (fullUserId, file, success, failure, options) {
        return _sendImWithAttachment(fullUserId, file, _imContentTypes.FILE, success, failure, false, options);
    };

    /**
     * Sends an image file via instant message.
     *
     * @method sendImWithImage
     * @async
     * @param {String} fullUserId Full user Id of the intended recipient.
     * @param {File} file Image file to be sent
     * @param {Function} success The success callback. It receives one parameter.
     * @param {Object} success.result The result object.
     * @param {String} success.result.UUID Unique Id for the message.
     * @param {String} success.result.contentType The type of the message.
     * @param {String} success.result.destination The full user Id of the message's destination.
     * @param {Object} success.result.message Object representing the payload of the message.
     * @param {String} success.result.message.mimeType The MIME type of the message.
     * @param {String} success.result.message.content_name The name of the uploaded file.
     * @param {String} success.result.message.content_uuid The UUID of the file that was uploaded.
     * @param {Function} failure The failure callback. It receives no parameters.
     * @param {Object} options Object of options for the message.
     * @param {Object} options.additionalData Object with arbitrary metadata about the IM.
     * @return {String} uuid Unique string identifier for the sent message.
     * @example
     * Here is an example of a result given to the success function.
     * ``` javascript
     *  {
     *      "UUID": "E72F1D02-5ED7-4E36-9938-78460ABD286B",
     *      "contentType": "image",
     *      "destination": "user1@test.kandy.io"
     *      "message": {
     *          content_name: "image.jpg",
     *          content_uuid: "738814CB-1019-4482-9200-56CB3FA033D9",
     *          mimeType: "image/jpeg"
     *      },
     *      "additionalData" {
     *          ...
     *      }
     *  }
     * ```
     */
    me.sendImWithImage = function (fullUserId, file, success, failure, options) {
        return _sendImWithAttachment(fullUserId, file, _imContentTypes.IMAGE, success, failure, false, options);
    };

    /**
     * Sends an audio file via instant message.
     *
     * @method sendImWithAudio
     * @async
     * @param {String} fullUserId Full user Id of the intended recipient.
     * @param {File} file Audio file to be sent
     * @param {Function} success The success callback. It receives one parameter.
     * @param {Object} success.result The result object.
     * @param {String} success.result.UUID Unique Id for the message.
     * @param {String} success.result.contentType The type of the message.
     * @param {String} success.result.destination The full user Id of the message's destination.
     * @param {Object} success.result.message Object representing the payload of the message.
     * @param {String} success.result.message.mimeType The MIME type of the message.
     * @param {String} success.result.message.content_name The name of the uploaded file.
     * @param {String} success.result.message.content_uuid The UUID of the file that was uploaded.
     * @param {Function} failure The failure callback. It receives no parameters.
     * @param {Object} options Object of options for the message.
     * @param {Object} options.additionalData Object with arbitrary metadata about the IM.
     * @return {String} uuid Unique string identifier for the sent message.
     * @example
     * Here is an example of a result given to the success function.
     * ``` javascript
     *  {
     *      "UUID": "E72F1D02-5ED7-4E36-9938-78460ABD286B",
     *      "contentType": "audio",
     *      "destination": "user1@test.kandy.io"
     *      "message": {
     *          content_name: "audio_file.mp3",
     *          content_uuid: "738814CB-1019-4482-9200-56CB3FA033D9",
     *          mimeType: "audio/mp3"
     *      },
     *      "additionalData" {
     *          ...
     *      }
     *  }
     * ```
     */
    me.sendImWithAudio = function (fullUserId, file, success, failure, options) {
        return _sendImWithAttachment(fullUserId, file, _imContentTypes.AUDIO, success, failure, false, options);
    };

    /**
     * Sends an video file via instant message.
     *
     * @method sendImWithVideo
     * @async
     * @param {String} fullUserId Full user Id of the intended recipient.
     * @param {Object} file Video file to be sent
     * @param {Function} success The success callback. It receives one parameter.
     * @param {Object} success.result The result object.
     * @param {String} success.result.UUID Unique Id for the message.
     * @param {String} success.result.contentType The type of the message.
     * @param {String} success.result.destination The full user Id of the message's destination.
     * @param {Object} success.result.message Object representing the payload of the message.
     * @param {String} success.result.message.mimeType The MIME type of the message.
     * @param {String} success.result.message.content_name The name of the uploaded file.
     * @param {String} success.result.message.content_uuid The UUID of the file that was uploaded.
     * @param {Function} failure The failure callback. It receives no parameters.
     * @param {Object} options Object of options for the message.
     * @param {Object} options.additionalData Object with arbitrary metadata about the IM.
     * @return {String} uuid Unique string identifier for the sent message.
     * @example
     * Here is an example of a result given to the success function.
     * ``` javascript
     *  {
     *      "UUID": "E72F1D02-5ED7-4E36-9938-78460ABD286B",
     *      "contentType": "video",
     *      "destination": "user1@test.kandy.io"
     *      "message": {
     *          content_name: "video_file.avi",
     *          content_uuid: "738814CB-1019-4482-9200-56CB3FA033D9",
     *          mimeType: "video/avi"
     *      },
     *      "additionalData" {
     *          ...
     *      }
     *  }
     * ```
     */
    me.sendImWithVideo = function (fullUserId, file, success, failure, options) {
        return _sendImWithAttachment(fullUserId, file, _imContentTypes.VIDEO, success, failure, false, options);
    };

    /**
     * Sends a contact object via instant message.
     *
     * @method sendImWithContact
     * @async
     * @param {String} fullUserId Full user Id of the intended recipient.
     * @param {File} vCard Contact object to be sent
     * @param {Function} success The success callback. It receives one parameter.
     * @param {Object} success.result The result object.
     * @param {String} success.result.UUID Unique Id for the message.
     * @param {String} success.result.contentType The type of the message.
     * @param {String} success.result.destination The full user Id of the message's destination.
     * @param {Object} success.result.message Object representing the payload of the message.
     * @param {String} success.result.message.mimeType The MIME type of the message.
     * @param {String} success.result.message.content_name The name of the uploaded file.
     * @param {String} success.result.message.content_uuid The UUID of the file that was uploaded.
     * @param {Function} failure The failure callback. It receives no parameters.
     * @param {Object} options Object of options for the message.
     * @param {Object} options.additionalData Object with arbitrary metadata about the IM.
     * @param {Object} options.contact_display_name Contact name sent alongside vCard file.
     * @return {String} uuid Unique string identifier for the sent message.
     * @example
     * Here is an example of a result given to the success function.
     * ``` javascript
     *  {
     *      "UUID": "E72F1D02-5ED7-4E36-9938-78460ABD286B",
     *      "contentType": "contact",
     *      "destination": "user1@test.kandy.io"
     *      "message": {
     *          contact_display_name: "Example Contact Name",
     *          content_name: "contact_file.vcf",
     *          content_uuid: "738814CB-1019-4482-9200-56CB3FA033D9",
     *          mimeType: "text-vcard"
     *      },
     *      "additionalData" {
     *          ...
     *      }
     *  }
     * ```
     */
    me.sendImWithContact = function (fullUserId, vCard, success, failure, options) {
        // It used to be that instead of 'options', this function accepted
        // a 'displayName'. We will unofficially support that case with this
        // workaround.
        if (typeof options === 'string') {
            var displayName = options;
            options = {'contact_display_name': displayName};
        }

        return _sendImWithAttachment(fullUserId, vCard, _imContentTypes.CONTACT, success, failure, false, options);
    };

    /**
     * Sends a location object via instant message.
     *
     * @method sendImWithLocation
     * @async
     * @param {String} fullUserId Full user Id of the intended recipient.
     * @param {Object} location Location object to be sent
     * @param {String} location.longitude Location's longitude
     * @param {String} location.latitude Location's latitude
     * @param {Function} success The success callback. It receives one parameter.
     * @param {Object} success.result The result object.
     * @param {String} success.result.UUID Unique Id for the message.
     * @param {String} success.result.contentType The type of the message.
     * @param {String} success.result.destination The full user Id of the message's destination.
     * @param {Object} success.result.message Object representing the payload of the message.
     * @param {String} success.result.message.mimeType The MIME type of the message.
     * @param {String} success.result.message.locationLongitude The longitude of the location that was sent.
     * @param {String} success.result.message.locationLatitude The latitude of the location that was sent.
     * @param {Function} failure The failure callback. It receives no parameters.
     * @param {Object} options Object of options for the message.
     * @param {Object} options.additionalData Object with arbitrary metadata about the IM.
     * @return {String} uuid Unique string identifier for the sent message.
     * @example
     * Here is an example of a result given to the success function.
     * ``` javascript
     *  {
     *      "UUID": "E72F1D02-5ED7-4E36-9938-78460ABD286B",
     *      "contentType": "location",
     *      "destination": "user1@test.kandy.io
     *      "message": {
     *          locationLongitude: "45.298834",
     *          locationLatitude: "-75.913328",
     *          mimeType: "location/utm"
     *      },
     *      "additionalData" {
     *          ...
     *      }
     *  }
     * ```
     */
    me.sendImWithLocation = function (fullUserId, location, success, failure, options) {
        return _sendImWithLocation(fullUserId, location, success, failure, false, options);
    };

    /*
     * Uploads file to be used in Rich IM messaging
     *
     * @method uploadFile
     * @async
     * @param {File} file File to be sent
     * @param {Function} success The success callback. It receives one parameter.
     * @param {String} success.uuid The UUID of the uploaded file.
     * @param {Function} failure The failure callback. It receives two parameters.
     * @param {string} failure.message Error Message.
     * @param {string} failure.statusCode Error status code.
     */
    me.uploadFile = function (file, success, failure) {
        // Generate a UUID
        var uuid = utils.createUUIDv4();

        // Create a new FormData object.
        var formData = new FormData();

        // Add the file to the request.
        formData.append('file', file, file.name);

        // Set up the request.
        var xhr = new XMLHttpRequest();

        var url = _config.kandyApiUrl + '/devices/content?key=' + _userDetails.userAccessToken + '&content_uuid=' + encodeURIComponent(uuid) + '&device_id=' + _userDetails.devices[0].id + '&content_type=' + encodeURIComponent(file.type);

        // Open the connection.
        xhr.open('POST', url, true);

        // Set up a handler for when the request finishes.
        xhr.onload = function () {
            if (xhr.status === 200) {
                var result = JSON.parse(xhr.responseText);

                if (result.status === responseCodes.OK) {
                    // File(s) uploaded.
                    if (success) {
                        success(uuid);
                    }
                }
                else if (failure) {
                    failure(result.message, result.status);
                }

            } else {
                if (failure) {
                    failure('Request Error', '500');
                }
            }
        };

        // Send the Data.
        xhr.send(formData);

        return uuid;
    };

    /**
     * Builds a url to retrieve a previously uploaded file.
     *
     * @method buildFileUrl
     * @param {String} uuid UUID for file that you would receive in an instant message.
     * @return {String} url Url pointing to the uploaded file.
     */
    me.buildFileUrl = function (uuid) {
        return _config.kandyApiUrl + '/devices/content?key=' + _userDetails.userAccessToken + '&content_uuid=' + encodeURIComponent(uuid) + '&device_id=' + _userDetails.devices[0].id;
    };

    /**
     * Builds a Url to retrieve a thumbnail of a previously uploaded image file.
     *
     * @method buildFileThumbnailUrl
     * @param {String} uuid UUID for file that you would receive in an instant message.
     * @param {String} size Size of the thumbnail in pixels (ex: "250x250"). The default is 500x500.
     * @return {String} url Url pointing to the thumbnail of the uploaded image file.
     */
    me.buildFileThumbnailUrl = function (uuid, size) {
        if (size === undefined || !size) {
            size = '500x500';
        }

        return _config.kandyApiUrl + '/devices/content/thumbnail?key=' + _userDetails.userAccessToken + '&content_uuid=' + encodeURIComponent(uuid) + '&device_id=' + _userDetails.devices[0].id + '&thumbnail_size=' + size;
    };

    /**
     * Retrieves IM messages that were missed while offline. Please listen for the "message" event to receive messages while online.
     *
     * @method getIm
     * @async
     * @param {Function} success The success callback. It receives one parameter.
     * @param {Array} success.messages An array of messages
     * @param {Function} failure The failure callback. It receives one parameter.
     * @param {String} failure.errorMessage The error message explaining what failed.
     * @example
     * Here is an example of a result given to the success function.
     * ``` javascript
     *  [
     *      {
     *          "messageType":"chat",
     *          "sender":
     *          {
     *              "user_id":"972542205056",
     *              "domain_name":"domain.com",
     *              "full_user_id":"972542205056@domain.com"
     *           },
     *          "UUID":"acd2fa752c3c4edf97de8b0a48f622f0",
     *          "timestamp":"1400510413",
     *          "message":
     *          {
     *              "mimeType": "text/plain",
     *              "text": "let's meet tonight"
     *          }
     *      }
     *  ]
     * ```
     */
    me.getIm = function (success, failure, autoClear) {

        _logger.info('Consider using the message event instead of fetching messages');

        if (autoClear === undefined) {
            autoClear = true;
        }

        _kandyRequest({
            url: '/devices/messages',
            params: {
                'device_id': _userDetails.devices[0].id
            },
            success: function (response) {
                var incoming;
                if (success) {

                    if (response.result.messages.length) {
                        // prepare id list for clearing
                        var idList = response.result.messages.map(function (item) {
                            return item.UUID;
                        });

                        // make sure UUIDs have hyphens
                        response.result.messages = response.result.messages.map(function (msg) {
                            if (msg.UUID.indexOf('-') === -1) {
                                msg.UUID = [msg.UUID.substring(0, 8),
                                    msg.UUID.substring(8, 12),
                                    msg.UUID.substring(12, 16),
                                    msg.UUID.substring(16, 20),
                                    msg.UUID.substring(20, msg.UUID.length)
                                ].join('-');
                            }
                            return msg;
                        });
                    }

                    success(response.result);

                    if (autoClear && response.result.messages.length) {
                        me.clearIm(idList);
                    }
                }
            },
            failure: failure
        });
    };

    /*
     * Retrieves IM messages
     *
     * @method clearIm
     * @async
     * @param {Array} ids Id of IMs to remove.
     * @param {Function} failure The failure callback.
     * @return {Object} response An array of messages
     */
    me.clearIm = function (ids, success, failure) {
        var i = 0;
        for (; i < ids.length; i += 10) {
            // TODO: Once we have promises we should handle the success and failure callbacks properly.
            _kandyRequest({
                type: 'DELETE',
                url: '/devices/messages',
                params: {
                    messages: ids.slice(i, i + 10),
                    'device_id': _userDetails.devices[0].id
                },
                failure: failure
            });
        }
    };

    /**
     * Gets the list of groups of which the current user is a part.
     *
     * @method getGroups
     * @async
     * @param {Function} success The success callback. It receives one parameter.
     * @param {Object} success.result Object containing list of groups.
     * @param {Group[]} success.result.groups An array of Group objects.
     * @param {Function} failure The failure callback. It receives one parameter.
     * @param {String} failure.errorMessage The error message explaining what failed.
     * @example
     * Here is an example of a result given to the success function.
     * ``` javascript
     *     {
     *         groups: [
     *             Group objects
     *         ]
     *  }
     * ```
     */
    me.getGroups = function (success, failure){
        _kandyRequest({
            url: '/users/chatgroups',
            success: function (response) {
                if (success) {
                    success(response.result);
                }
            },
            failure: failure
        });
    };

    /**
     * Creates a new group. The user that creates the group is designated as the group owner.
     *
     * @method createGroup
     * @async
     * @param {String} name The name of the group to create.
     * @param {File} image The image file of the group to create.
     * @param {Function} success The success callback. It receives one parameter.
     * @param {Group} success.group Group object that was just created.
     * @param {Function} failure The failure callback. It receives one parameter.
     * @param {String} failure.errorMessage The error message explaining what failed.
     */
    me.createGroup = function (name, image, success, failure){
        //TODO what should be the image.

        var data = {
            'group_name': name,
            'group_image': {}
        };

        _kandyRequest({
            type: 'POST',
            data: data,
            url: '/users/chatgroups',
            success: function (response) {
                if (success) {
                    success(response.result);
                }
            },
            failure: failure
        });
    };

    /**
     * Gets group with a given group id.
     *
     * @method getGroupById
     * @async
     * @param {String} groupId The group id to get group details.
     * @param {Function} success The success callback. It receives one parameter.
     * @param {Group} success.group The requested group object.
     * @param {Function} failure The failure callback. It receives one parameter.
     * @param {String} failure.errorMessage The error message explaining what failed.
     */
    me.getGroupById = function (groupId, success, failure){
        _kandyRequest({
            url: '/users/chatgroups/chatgroup',
            params: {
                'group_id': groupId
            },
            success: function (response) {
                if (success) {
                    success(response.result);
                }
            },
            failure: failure
        });
    };

    /**
     * Delete a group with a given id. Only the group owner can delete a group.
     *
     * @method deleteGroup
     * @async
     * @param {String} groupId The id of the group.
     * @param {Function} success The success callback. It receives no parameters.
     * @param {Function} failure The failure callback. It receives one parameter.
     * @param {String} failure.errorMessage The error message explaining what failed.
     */
    me.deleteGroup = function (groupId, success, failure){
        _kandyRequest({
            type: 'DELETE',
            url: '/users/chatgroups/chatgroup',
            params: {
                'group_id': groupId
            },
            success: function (response) {
                if (success) {
                    success(response.result);
                }
            },
            failure: failure
        });
    };

    /**
     * Update group with new information.
     *
     * @method updateGroup
     * @async
     * @param {String} groupId The id of the group.
     * @param {String} name The name of the group.
     * @param {File} image The image file of the group.
     * @param {Function} success The success callback. It receives one parameter.
     * @param {Group} success.group The updated group object.
     * @param {Function} failure The failure callback. It receives one parameter.
     * @param {String} failure.errorMessage The error message explaining what failed.
     */
    me.updateGroup = function (groupId, name, image, success, failure){

        var data = {
            'group_id': groupId,
            'group_name': name,
            'group_image': {}
        };

        _kandyRequest({
            type: 'PUT',
            data: data,
            url: '/users/chatgroups/chatgroup',
            success: function (response) {
                if (success) {
                    success(response.result);
                }
            },
            failure: failure
        });
    };

    /**
     * Add members to the group.
     *
     * @method addGroupMembers
     * @async
     * @param {String} groupId The id of the group.
     * @param {Array} members The list of new members to add to the group.
     * @param {Function} success The success callback. It receives one parameter.
     * @param {Group} success.group The updated group object.
     * @param {Function} failure The failure callback. It receives one parameter.
     * @param {String} failure.errorMessage The error message explaining what failed.
     * @example
     * Here is an example of the members parameter.
     * ``` javascript
     *  [
     *      'user1@test.kandy.io',
     *      'user2@test.kandy.io'
     *  ]
     * ```
     */
    me.addGroupMembers = function (groupId, members, success, failure){
        var data = {
            members: members
        };
        _kandyRequest({
            type: 'POST',
            url: '/users/chatgroups/chatgroup/members',
            params: {
                'group_id': groupId
            },
            data: data,
            success: function (response) {
                if (success) {
                    success(response.result);
                }
            },
            failure: failure
        });
    };

    /**
     * Removes members from the group.
     *
     * @method removeGroupMembers
     * @async
     * @param {String} groupId The id of the group.
     * @param {Array} members The list of members to remove from the group.
     * @param {Function} success The success callback. It receives one parameter.
     * @param {Group} success.group The updated group object.
     * @param {Function} failure The failure callback. It receives one parameter.
     * @param {String} failure.errorMessage The error message explaining what failed.
     * @example
     * Here is an example of the members parameter.
     * ``` javascript
     *  [
     *      'user1@test.kandy.io',
     *      'user2@test.kandy.io'
     *  ]
     * ```
     */
    me.removeGroupMembers = function (groupId, members, success, failure){
        _kandyRequest({
            type: 'DELETE',
            url: '/users/chatgroups/chatgroup/members',
            params: {
                'group_id': groupId,
                members: members
            },
            success: function (response) {
                if (success) {
                    success(response.result);
                }
            },
            failure: failure
        });
    };

    /**
     * Leave a group with a given id. If the owner leaves the group, a group member is assigned as the new owner. If there are no group members when the owner leaves, the group is deleted.
     *
     * @method leaveGroup
     * @async
     * @param {String} groupId The id of the group.
     * @param {Function} success The success callback. It receives no parameters.
     * @param {Function} failure The failure callback. It receives one parameter.
     * @param {String} failure.errorMessage The error message explaining what failed.
     */
    me.leaveGroup = function (groupId, success, failure){
        _kandyRequest({
            type: 'DELETE',
            url: '/users/chatgroups/chatgroup/members/membership',
            params: {
                'group_id': groupId
            },
            success: function (response) {
                if (success) {
                    success(response.result);
                }
            },
            failure: failure
        });
    };

    /*
     * Mute/unmute the group.
     *
     * @method muteUnmuteGroup
     * @async
     * @param {String} groupId The id of the group.
     * @param {Function} success The success callback function.
     * @param {Function} failure The error callback function.
     * @param {Boolean} mute To set true/false for mute/unmute the group.
     */
    function muteUnmuteGroup(groupId, success, failure, mute){
        _kandyRequest({
            type: 'PUT',
            url: '/users/chatgroups/chatgroup/mute',
            params: {
                mute: mute,
                'group_id': groupId
            },
            success: function (response) {
                if (success) {
                    success(response.result);
                }
            },
            failure: failure
        });
    }

    /**
     * Mute a group with a given id.
     *
     * @method muteGroup
     * @async
     * @param {String} groupId The id of the group.
     * @param {Function} success The success callback. It receives one parameter.
     * @param {Group} success.group The updated group object.
     * @param {Function} failure The failure callback. It receives one parameter.
     * @param {String} failure.errorMessage The error message explaining what failed.
     */
    me.muteGroup = function (groupId, success, failure){
        muteUnmuteGroup(groupId, success, failure, true);
    };

    /**
     * Unmute a group with a given id.
     *
     * @method unmuteGroup
     * @async
     * @param {String} groupId The id of the group.
     * @param {Function} success The success callback. It receives one parameter.
     * @param {Group} success.group The updated group object.
     * @param {Function} failure The failure callback. It receives one parameter.
     * @param {String} failure.errorMessage The error message explaining what failed.
     */

    me.unmuteGroup = function (groupId, success, failure){
        muteUnmuteGroup(groupId, success, failure, false);
    };

    /*
     * Mute/unmute members of the group.
     *
     * @method muteUnmuteGroup
     * @async
     * @param {String} groupId The id of the group.
     * @param {Array} members The list of members to mute/unmute in the group.
     * @param {Function} success The success callback. It receives no parameters.
     * @param {Function} failure The failure callback. It receives no parameters.
     * @param {Boolean} mute To set true/false for mute/unmute members of the group.
     */
    function muteUnmuteGroupMembers(groupId, members, success, failure, mute){

        var data = {
            members: members,
            mute: mute,
            'group_id': groupId
        };

        _kandyRequest({
            type: 'PUT',
            data: data,
            url: '/users/chatgroups/chatgroup/members/mute',
            success: function (response) {
                if (success) {
                    success(response.result);
                }
            },
            failure: failure
        });
    }

    /**
     * Mutes group members.
     *
     * @method muteGroupMembers
     * @async
     * @param {String} groupId The id of the group.
     * @param {Array} members The list of members to mute in the group.
     * @param {Function} success The success callback. It receives one parameter.
     * @param {Group} success.group The updated group object.
     * @param {Function} failure The failure callback. It receives one parameter.
     * @param {String} failure.errorMessage The error message explaining what failed.
     * @example
     * Here is an example of the members parameter.
     * ``` javascript
     *  [
     *      'user1@test.kandy.io',
     *      'user2@test.kandy.io'
     *  ]
     * ```
     */
    me.muteGroupMembers = me.muteGroupMember = function (groupId, members, success, failure){
        muteUnmuteGroupMembers(groupId, members, success, failure, true);
    };

    /**
     * Unmutes group members.
     *
     * @method unmuteGroupMembers
     * @async
     * @param {String} groupId The id of the group.
     * @param {Array} members The list of members to unmute in the group.
     * @param {Function} success The success callback. It receives one parameter.
     * @param {Group} success.group The updated group object.
     * @param {Function} failure The failure callback. It receives one parameter.
     * @param {String} failure.errorMessage The error message explaining what failed.
     * @example
     * Here is an example of the members parameter.
     * ``` javascript
     *  [
     *      'user1@test.kandy.io',
     *      'user2@test.kandy.io'
     *  ]
     * ```
     */
    me.unmuteGroupMembers = me.unmuteGroupMember = function (groupId, members, success, failure){
        muteUnmuteGroupMembers(groupId, members, success, failure, false);
    };

    /**
     * Sends a message to all the members in the group.
     *
     * @method sendGroupIm
     * @async
     * @param {String} groupId The id of the group.
     * @param {String} text The message to send.
     * @param {Function} success The success callback. It receives one parameter.
     * @param {Object} success.result The result object.
     * @param {String} success.result.UUID Unique Id for the message.
     * @param {String} success.result.contentType The type of the message.
     * @param {String} success.result.group_id The group Id of the message's destination.
     * @param {Object} success.result.message Object representing the payload of the message.
     * @param {String} success.result.message.mimeType The MIME type of the message.
     * @param {String} success.result.message.text The actual text of the message.
     * @param {Function} failure The failure callback. It receives one parameter.
     * @param {String} failure.errorMessage The error message explaining what failed.
     * @param {Object} options Object of options for the message.
     * @param {Object} options.additionalData Object with arbitrary metadata about the IM.
     */
    me.sendGroupIm = function (groupId, text, success, failure, options) {
        return _sendIM(groupId, 'text', { mimeType: 'text/plain', text: text }, success, failure, true, options);
    };

    /**
     * Sends a file to all the members in the group.
     *
     * @method sendGroupImWithFile
     * @async
     * @param {String} groupId The id of the group.
     * @param {File} file The file object to send.
     * @param {Function} success The success callback. It receives one parameter.
     * @param {Object} success.result The result object.
     * @param {String} success.result.UUID Unique Id for the message.
     * @param {String} success.result.contentType The type of the message.
     * @param {String} success.result.group_id The group Id of the message's destination.
     * @param {Object} success.result.message Object representing the payload of the message.
     * @param {String} success.result.message.mimeType The MIME type of the message.
     * @param {String} success.result.message.content_name The name of the uploaded file.
     * @param {String} success.result.message.content_uuid The UUID of the file that was uploaded.
     * @param {Function} failure The failure callback. It receives one parameter.
     * @param {String} failure.errorMessage The error message explaining what failed.
     * @param {Object} options Object of options for the message.
     * @param {Object} options.additionalData Object with arbitrary metadata about the IM.
     */
    me.sendGroupImWithFile = function (groupId, file, success, failure, options) {
        return _sendImWithAttachment(groupId, file, _imContentTypes.FILE, success, failure, true, options);
    };

    /**
     * Sends an image to all the members in the group.
     *
     * @method sendGroupImWithImage
     * @async
     * @param {String} groupId The id of the group.
     * @param {File} file The image file object to send.
     * @param {Function} success The success callback. It receives one parameter.
     * @param {Object} success.result The result object.
     * @param {String} success.result.UUID Unique Id for the message.
     * @param {String} success.result.contentType The type of the message.
     * @param {String} success.result.group_id The group Id of the message's destination.
     * @param {Object} success.result.message Object representing the payload of the message.
     * @param {String} success.result.message.mimeType The MIME type of the message.
     * @param {String} success.result.message.content_name The name of the uploaded file.
     * @param {String} success.result.message.content_uuid The UUID of the file that was uploaded.
     * @param {Function} failure The failure callback. It receives one parameter.
     * @param {String} failure.errorMessage The error message explaining what failed.
     * @param {Object} options Object of options for the message.
     * @param {Object} options.additionalData Object with arbitrary metadata about the IM.
     */
    me.sendGroupImWithImage = function (groupId, file, success, failure, options) {
        return _sendImWithAttachment(groupId, file, _imContentTypes.IMAGE, success, failure, true, options);
    };

    /**
     * Sends an audio file to all the members in the group.
     *
     * @method sendGroupImWithAudio
     * @async
     * @param {String} groupId The id of the group.
     * @param {File} file The audio file object to send.
     * @param {Function} success The success callback. It receives one parameter.
     * @param {Object} success.result The result object.
     * @param {String} success.result.UUID Unique Id for the message.
     * @param {String} success.result.contentType The type of the message.
     * @param {String} success.result.group_id The group Id of the message's destination.
     * @param {Object} success.result.message Object representing the payload of the message.
     * @param {String} success.result.message.mimeType The MIME type of the message.
     * @param {String} success.result.message.content_name The name of the uploaded file.
     * @param {String} success.result.message.content_uuid The UUID of the file that was uploaded.
     * @param {Function} failure The failure callback. It receives one parameter.
     * @param {String} failure.errorMessage The error message explaining what failed.
     * @param {Object} options Object of options for the message.
     * @param {Object} options.additionalData Object with arbitrary metadata about the IM.
     */
    me.sendGroupImWithAudio = function (groupId, file, success, failure, options) {
        return _sendImWithAttachment(groupId, file, _imContentTypes.AUDIO, success, failure, true, options);
    };

    /**
     * Sends a video file to all the members in the group.
     *
     * @method sendGroupImWithVideo
     * @async
     * @param {String} groupId The id of the group.
     * @param {File} file The video file object to send.
     * @param {Function} success The success callback. It receives one parameter.
     * @param {Object} success.result The result object.
     * @param {String} success.result.UUID Unique Id for the message.
     * @param {String} success.result.contentType The type of the message.
     * @param {String} success.result.group_id The group Id of the message's destination.
     * @param {Object} success.result.message Object representing the payload of the message.
     * @param {String} success.result.message.mimeType The MIME type of the message.
     * @param {String} success.result.message.content_name The name of the uploaded file.
     * @param {String} success.result.message.content_uuid The UUID of the file that was uploaded.
     * @param {Function} failure The failure callback. It receives one parameter.
     * @param {String} failure.errorMessage The error message explaining what failed.
     * @param {Object} options Object of options for the message.
     * @param {Object} options.additionalData Object with arbitrary metadata about the IM.
     */
    me.sendGroupImWithVideo = function (groupId, file, success, failure, options) {
        return _sendImWithAttachment(groupId, file, _imContentTypes.VIDEO, success, failure, true, options);
    };

    /**
     * Sends a JSON object to all the members in the group.
     *
     * @method sendGroupJSON
     * @async
     * @param {String} groupId The id of the group.
     * @param {Object} object The JSON object to send.
     * @param {Function} success The success callback. It receives one parameter.
     * @param {Object} success.result The result object.
     * @param {String} success.result.UUID Unique Id for the message.
     * @param {String} success.result.contentType The type of the message.
     * @param {String} success.result.group_id The group Id of the message's destination.
     * @param {Object} success.result.message Object representing the payload of the message.
     * @param {String} success.result.message.mimeType The MIME type of the message.
     * @param {String} success.result.message.json The actual text of the message.
     * @param {Function} failure The failure callback. It receives one parameter.
     * @param {String} failure.errorMessage The error message explaining what failed.
     * @param {Object} options Object of options for the message.
     * @param {Object} options.additionalData Object with arbitrary metadata about the IM.
     */
    me.sendGroupJSON = function (groupId, object, success, failure, options) {
        return _sendJSON(groupId, object, success, failure, true, options);
    };

    /**
     * Sends a location object to all the members in the group.
     *
     * @method sendGroupImWithLocation
     * @async
     * @param {String} groupId The id of the group.
     * @param {Object} location The location object to send.
     * @param {String} location.longitude Location's longitude
     * @param {String} location.latitude Location's latitude
     * @param {Function} success The success callback. It receives one parameter.
     * @param {Object} success.result The result object.
     * @param {String} success.result.UUID Unique Id for the message.
     * @param {String} success.result.contentType The type of the message.
     * @param {String} success.result.group_id The group Id of the message's destination.
     * @param {Object} success.result.message Object representing the payload of the message.
     * @param {String} success.result.message.mimeType The MIME type of the message.
     * @param {String} success.result.message.locationLongitude The longitude of the location that was sent.
     * @param {String} success.result.message.locationLatitude The latitude of the location that was sent.
     * @param {Function} failure The failure callback. It receives one parameter.
     * @param {String} failure.errorMessage The error message explaining what failed.
     * @param {Object} options Object of options for the message.
     * @param {Object} options.additionalData Object with arbitrary metadata about the IM.
     */
    me.sendGroupImWithLocation = function (groupId, location, success, failure, options) {
        return _sendImWithLocation(groupId, location, success, failure, true, options);
    };

    function _notificationHandler(message) {
        var msg = message.message;
        if(msg){
            var msgType = msg.messageType;
            if (msgType === 'chat') {
                events.emit('message', msg);
            } else if (msgType === 'groupChat') {
                events.emit('chatGroupMessage', msg);
            } else if (msgType === 'chatGroupInvite') {
                events.emit('chatGroupInvite', msg);
            } else if (msgType === 'chatGroupBoot') {
                events.emit('chatGroupBoot', msg);
            } else if (msgType === 'chatGroupLeave') {
                events.emit('chatGroupLeave', msg);
            } else if (msgType === 'chatGroupUpdate') {
                events.emit('chatGroupUpdate', msg);
            } else if (msgType === 'chatGroupDelete') {
                events.emit('chatGroupDelete', msg);
            }
        }
    }

    registerWebSocketListeners({
        'notification': _notificationHandler
    });

    return me;
}());

/**
 * Kandy call is used to make calls (audio and video) from Kandy users to other Kandy
 * users, PSTN phones or SIP endpoints.
 *
 * @class call
 * @namespace kandy
 * @static
 */

var _logInToSpidr;
var _logOutOfSpidr;
var _setupCall;

api.Phone = api.call = api.voice = (function () {
    var me = {};

    /*
     * Domain API Key token.
     */
    var _domainApiKey = null;

    /*
     *  Holds call types.
     */
    var _callTypes = {
        INCOMING_CALL: 1,
        OUTGOING_CALL: 2
    };

    /*
     * Types of presence.
     */
    var _presenceTypes = {
        0: 'Available',
        1: 'Unavailable',
        2: 'Away',
        3: 'Out To Lunch',
        4: 'Busy',
        5: 'On Vacation',
        6: 'Be Right Back',
        7: 'On The Phone',
        8: 'Active',
        9: 'Inactive',
        10: 'Pending',
        11: 'Offline'
    };

    var _pluginUrls = {
        urlWin32bit: 'https://kandy-portal.s3.amazonaws.com/public/plugin/3.0.498/Kandy_Plugin_3.0.498.exe',
        urlWin64bit: 'https://kandy-portal.s3.amazonaws.com/public/plugin/3.0.498/Kandy_Plugin_3.0.498_x86_64.exe',
        urlMacUnix: 'https://kandy-portal.s3.amazonaws.com/public/plugin/3.0.498/Kandy_Plugin_3.0.498.pkg'
    };

    /*
     * call objects.
     */
    var _calls = [];

    var _mediaInitiated = false;

    var _initMediaDone = false;

    // This should be lower camel case but we will leave it for backwards compat.
    // There is a property mediaErrors below that is documented and more official.
    me.MediaErrors = fcs.call.MediaErrors;

    /*
     * Starts infra-frame coding for compression
     *
     * @method _startIntraFrame
     * @param {Object} call The call Object
     */
    function _startIntraFrame(call) {
        if (!call.intraframe) {
            call.intraframe = setInterval(function () {
                call.sendIntraFrame();
            }, 5000);
        }
    }

    /*
     * Stops infra-frame coding for compression
     *
     * @method _stopIntraFrame
     * @param {Object} call The call Object
     */
    function _stopIntraFrame(call) {
        if (call.intraframe) {
            clearInterval(call.intraframe);
            delete call.intraframe;
        }
    }

    /*
     * Handles call state changes
     *
     * @method _handleCallStateChange
     * @param {Call} call The call object
     * @param {State} state The state of the call
     */
    function _handleCallStateChange(call, state) {
        switch(state) {
            case fcs.call.States.IN_CALL:
                if (call.canSendVideo()) {
                    _startIntraFrame(call);
                }

                // This is kept for backwards compatibility.
                events.emit('oncall', call);

                if (call._remoteHold) {
                    events.emit('callunhold');
                    call._remoteHold = false;
                }

                if (!call._established) {
                    events.emit('callestablished', call);
                    call._established = true;
                } else {
                    events.emit('callstatechanged', call);
                }

                break;
            case fcs.call.States.RENEGOTIATION:
                events.emit('callstatechanged', call);
                break;
            case fcs.call.States.RINGING:
                events.emit('ringing', call.getId());
                break;
            case fcs.call.States.ENDED:
                if (call) {
                    _stopIntraFrame(call);
                    if (call.statusCode === 0 || call.statusCode === undefined) {
                        _logger.info('CALL END');
                    } else {
                        if ((call.statusCode >= 100 && call.statusCode <= 300)) {
                            _logger.error('WebRTC ERROR');
                        } else {
                            _logger.error('ERROR');
                        }
                    }

                    if (call.isAnonymous && call.isOutgoing) {
                        me.logout();
                    }

                    delete _calls[call.getId()];
                    events.emit('callended', call);
                }
                break;
            case fcs.call.States.ON_REMOTE_HOLD:
                call._remoteHold = true;
                events.emit('callhold', call);

                break;
        }
    }

    /*
     * Handles presence notifications, fires the presencenotification event
     *
     * @method _handlePresenceNotification
     * @param {Presence} presence The Presence object
     */
    function _handlePresenceNotification(presence) {
        if (presence.state === null) {
            _logger.info('State is empty.');
            return;
        }

        if (presence.name === null) {
            _logger.info('Name is empty.');
            return;
        }
        events.emit('presencenotification', presence.name, presence.state, _presenceTypes[presence.state], presence.activity);
    }


    /*
     * Checks if local storage is available
     *
     * @method _supportsLocalStorage
     */
    function _supportsLocalStorage() {
        try {
            return 'localStorage' in window && window.localStorage !== null;
        } catch (e) {
            return false;
        }
    }

    /*
     * Set access token in local storage
     *
     * @method _setUserInformationLocalStorage
     * @param {String} password Password to set
     */
    function _setUserInformationLocalStorage(password) {
        localStorage['kandyphone.userinformation'] = _domainApiKey + ';' + _userDetails.full_user_id + ';' + password;
        return true;
    }

    /*
     * Get access token from local storage
     *
     * @method _getUserInformationLocalStorage
     */
    function _getUserInformationLocalStorage() {
        return localStorage['kandyphone.userinformation'];
    }

    /*
     * Clears access token from local storage
     *
     * @method _clearAccessTokeLocalStorage
     */
    function _clearAccessTokeLocalStorage() {
        localStorage.removeItem('kandyphone.userinformation');
        return true;
    }

    // TODO: Move configuration for different versions into a strategy pattern.

    /*
     * Maps the spider configs retrived from getSpiderConfiguration to fcs configs which can then be passed to fcs.setup
     *
     * @method _mapSpidrConfigToAPI
     * @param {Object} spidrConfig Spider config from getSpiderConfiguration
     */
    function _mapSpidrConfigToAPI(spidrConfig) {

        // In newer version (2.2.1+) we don't do any parsing of the parameters and pass them through directly if the server
        // configuration also supports it.
        if (spidrConfig.fcsApi) {
            return spidrConfig.fcsApi;
        }

        return {
            notificationType: fcs.notification.NotificationTypes.WEBSOCKET,
            restUrl: spidrConfig.REST_server_address,
            restPort: spidrConfig.REST_server_port,
            websocketIP: spidrConfig.webSocket_server_address,
            websocketPort: spidrConfig.webSocket_server_port,
            websocketProtocol: (spidrConfig.webSocket_secure !== false ? 'wss' : 'ws'),
            protocol: spidrConfig.REST_protocol,
            serverProvidedTurnCredentials: spidrConfig.serverProvidedTurnCredentials
        };
    }

    /*
     * Maps the spider configs retrived from getSpiderConfiguration to spidrEnv config which can then be passed to fcs.call.initMedia
     *
     * @method _mapSpidrConfigToMedia
     * @param {Object} spidrConfig Spider config from getSpiderConfiguration
     */
    function _mapSpidrConfigToMedia(spidrConfig) {

        // In newer version (2.2.1+) we don't do any parsing of the parameters and pass them through directly if the server
        // configuration also supports it.
        if (spidrConfig.fcsMedia) {
            return spidrConfig.fcsMedia;
        }

        if (spidrConfig.ICE_servers) {
            utils.extend(spidrConfig,
                {
                    'ICE_server_address': spidrConfig.ICE_servers[0],
                    'ICE_server_port': ''
                }
            );
        }

        return {
            iceserver: spidrConfig.ICE_server_address,
            iceserverPort: spidrConfig.ICE_server_port,
            webrtcdtls: spidrConfig.use_DTLS
        };
    }

    /*
     * merges _config with spidr config retrived from getSpidrConfiguration
     *
     * @method _mergeConfigWithSpidrConfiguration
     * @param {Object} spidrConfig Spider config from getSpiderConfiguration
     */
    function _mergeConfigWithSpidrConfiguration(spidrConfig) {

        // merge with configs from KandyAPI.Phone.setup
        _config.spidrApi = utils.defaults(_mapSpidrConfigToAPI(spidrConfig), _config.spidrApi);

        // apply default SPiDR configuration
        _config.spidrMedia = utils.defaults(_mapSpidrConfigToMedia(spidrConfig), _config.spidrMedia);

        if (_config.screenSharing) {
            _config.spidrMedia.screenSharing = _config.screenSharing;
        }

        if (_config.screenSharingChromeExtensionId) {
            _config.spidrMedia.screenSharingChromeExtensionId = _config.screenSharingChromeExtensionId;
        }
    }

    /*
     * Processes versioned configuration. This mechanism is in place to allow changes to domain configuration
     * for new versions of Kandy.js without impacting old versions.
     */
    function _processSpiderConfigurationVersion(config) {
        var versions = config.versions;
        if (versions) {
            // Remove the versions from the root config.
            delete config.versions;

            // Get the versions up until the current version.
            var currentVersions = versions.slice(0, _config.version + 1);

            // Deep extend each version with the next.
            utils.deepExtend.apply(undefined, [config].concat(currentVersions));
        }
        return config;
    }

    function _applySpiderConfiguration(spidrConfig, success, failure) {

        // Process version config.
        _processSpiderConfigurationVersion(spidrConfig);

        // merge _config with spirdConfig
        _mergeConfigWithSpidrConfiguration(spidrConfig);

        // setup SPiDR with fcsConfig
        fcs.setup(_config.spidrApi);

        if (spidrConfig.useProxy) {
            fcs.setKandyUAT(_userDetails.userAccessToken);
        }

        fcs.setUserAuth(_userDetails.full_user_id, _userDetails.userPassword);

        fcs.notification.start(
                function () {
                    // if the browser supports local storage persist the Access Token
                    if (_config.allowAutoLogin && _supportsLocalStorage()) {
                        _setUserInformationLocalStorage(_userDetails.userPassword);
                    }
                    success();
                },
                function (errorCode) {
                    _logger.error('login failed: unable to start spidr notification');
                    failure(errorCode);
                },
                false
        );
    }

    /*
     * Logs in to Experius and SPiDR through fcs JSL
     *
     * @method _logInToSpidr
     * @param {Function} success Callback for successful login.
     * @param {Function} failure Callback for unsuccessful login.
     */
    _logInToSpidr = function(success, failure) {
        _getSpidrConfiguration(
            function(spidrConfig) {
                _applySpiderConfiguration(spidrConfig, success, failure);
            },
            function (error) {
                _logger.error('login failed: unable to get spidr configuration');
                failure();
            }
        );
    };

    /*
     * Event handler for beforeunload event.
     */
    function _beforeUnloadEventHandler(event) {

        // End all calls right before leaving a page.
        for (var i in _calls) {
            me.endCall(i);
        }
    }

    /*
     * Handles notifications
     */
    function _notificationHandler(message) {
        message = message.message;
        message = message && (message.kandyType || message.message_type);
        if (!message || message === 'gofetch') {
            events.emit('messagesavailable');
        } else if (message === 'incomingCall') {
            me._onIncommingCall('CALLavailable', message.call_id);
        }
    }

    /*
     * WebSocketListeners
     */
    registerWebSocketListeners({
        'notification': _notificationHandler
    });

    /*
     * Setup Spdir
     * @deprecated
     */
    me.setup = function(config) {
        _logger.warn('Deprecated method KandyAPI.Phone.setup use kandy.setup');
        api.setup(config);
    };

    _setupCall = function (config) {

        // apply default configuration
        _config = utils.extend(_config, config);

        fcs.notification.setOnConnectionEstablished(function () {
            _logger.info('Connection established');
            events.emit('onconnectionestablished', 'spider');
        });

        fcs.notification.setOnConnectionLost(function () {
            _logger.info('Connection Lost');
            events.emit('onconnectionlost', 'spider');
        });

        if (_config.allowAutoLogin && _supportsLocalStorage() && _getUserInformationLocalStorage()) {
            api.login(_getUserInformationLocalStorage().split(';')[0],
                    _getUserInformationLocalStorage().split(';')[1],
                    _getUserInformationLocalStorage().split(';')[2],
                    function () {
                        events.emit('loginsuccess', _userDetails);
                    },
                    function (msg, errorCode) {
                        events.emit('loginfailed', msg, errorCode);
                    }
            );
        }

        /*
         * To handle when the user presence on received
         * @param {object} presence the Prensece object
         */
        fcs.presence.onReceived = function (presence) {
            _handlePresenceNotification(presence);
        };

        /*
         * To handle when call on received
         * @param {object} presence the Call object
         */
        fcs.call.onReceived = function (call) {
            _logger.info('incoming call');

            call.onStateChange = function (state) {
                _handleCallStateChange(call, state);
            };

            call.isOutgoing = false;
            _calls[call.getId()] = call;

            //TODO: What is this doing? concierge?
            // check if this is an anonymous call
            call.isAnonymous = (call.callerNumber.indexOf('concierge') !== -1);

            events.emit('callincoming', call, call.isAnonymous);
        };
    };

    /*
     * Login as a user
     *
     * @method login
     * @deprecated Use 'kandy.login'
     * @param {String} domainApiKey
     * @param {String} userName
     * @param {String} userPassword
     * @deprecated
     */
    me.login = function (domainApiKey, userName, password) {
        _logger.warn('Deprecated method KandyAPI.Phone.login use kandy.login');

        api.login(domainApiKey, userName, password,
                function () {
                    events.emit('loginsuccess', _userDetails);
                },
                function (errorCode) {
                    events.emit('loginfailed', '', errorCode);
                }
        );
    };

    /**
     * All possible media errors.
     *
     * @property mediaErrors
     * @type {Object} Object with keys for each media error.
     * @example
     * ``` javascript
     *  onMediaFailure(errorCode) {
     *      switch(errorCode) {
     *          case kandy.call.mediaErrors.WRONG_VERSION:
     *              ...
     *          case kandy.call.mediaErrors.NEW_VERSION_WARNING:
     *              ...
     *      }
     *  }
     *
     *  // Possible values
     *  // WRONG_VERSION: The plugin was found but the version is not supported.
     *  // NEW_VERSION_WARNING: The plugin was found and is supported, but a new version is available.
     *  // NOT_INITIALIZED: An error happened while initializing user media.
     *  // NOT_FOUND: No webRTC support or plugin was found.
     *  // NO_SCREENSHARING_WARNING: Screen sharing is not possible with this browser or the
     *                               screensharing extension could not be found.
     * ```
     */
    me.mediaErrors = fcs.call.MediaErrors;

    /**
     * Check whether the browser has native WebRTC support or has the Kandy Plugin installed.
     * If WebRTC is supported either by native support or via the plugin, the success callback
     * will be called with no parameters. If no support is detected, the failure callback will
     * be called with an error code. This function will be called automatically when making
     * or receiving a call but you may want to call it sooner than that in case you need to
     * direct your user to install the Kandy Plugin.
     *
     * @method initMedia
     * @async
     * @param {Function} success The success callback. It receives no parameters.
     * @param {Function} failure The failure callback. It receives one parameter.
     * @param {Object} failure.error Error object describing error state.
     * @param {Number} failure.error.type Error code corresponding to the reason WebRTC is not supported. Refer to mediaErrors for possible errors.
     * @param {String} [failure.error.urlWin32bit] The URL you can use to download the Kandy plugin for Windows 32bit.
     * @param {String} [failure.error.urlWin64bit] The URL you can use to download the Kandy plugin for Windows 64bit.
     * @param {String} [failure.error.urlMacUnix] The URL you can use to download the Kandy plugin for Mac.
     * @param {Boolean} force Force a re-initialization of the media.
     * @param {Object} options Additional options to set for a call. Implies force.
     * @param {HTMLElement} options.remoteVideoContainer The container to use for remote video during the call.
     * @param {HTMLElement} options.localVideoContainer The container to use for local video during the call.
     */
    me.initMedia = function (success, failure, force, options) {
        if (!force && !options && _initMediaDone) {
            success();
            return;
        }

        _initMediaDone = false;
        _mediaInitiated = false;

        options = options || {};
        options = utils.defaults(
            {
                remoteVideoContainer: options.remoteVideoContainer || _config.remoteVideoContainer,
                localVideoContainer: options.localVideoContainer || _config.localVideoContainer
            },
            _config.spidrMedia);

        // make sure the browser supports WebRTC
        fcs.call.initMedia(
                function () {
                    _logger.info('media initiated');
                    _mediaInitiated = true;

                    // add unload event to end any calls
                window.addEventListener('beforeunload', _beforeUnloadEventHandler);

                    _initMediaDone = true;
                    success();
                },
                function (errorCode) {
                    switch (errorCode) {
                        case me.mediaErrors.WRONG_VERSION:
                            _logger.error('Media Plugin Version Not Supported');
                            events.emit('media', {type: me.mediaErrors.WRONG_VERSION});
                            break;
                        case me.mediaErrors.NEW_VERSION_WARNING:
                            _logger.error('New Plugin Version is available');
                            events.emit('media', utils.extend({ type: me.mediaErrors.NEW_VERSION_WARNING }, _pluginUrls));
                            break;
                        case me.mediaErrors.NOT_INITIALIZED:
                            _logger.error('Media couldn\'t be initialized');
                            events.emit('media', {type: me.mediaErrors.NOT_INITIALIZED});
                            break;
                        case me.mediaErrors.NOT_FOUND:
                            _logger.error('Plugin couldn\'t be found!');
                            events.emit('media', utils.extend({ type: me.mediaErrors.NOT_FOUND }, _pluginUrls));
                            break;
                        case me.mediaErrors.NO_SCREENSHARING_WARNING:
                            _logger.info('ScreenShare extension could not be found');
                            events.emit('media', { type: me.mediaErrors.NO_SCREENSHARING_WARNING });

                            // This is not a failure case, just a warning.
                            _initMediaDone = true;
                            success();
                            return;
                    }

                    failure(errorCode);
                },
            options
        );
    };

    _logOutOfSpidr = function(success){
        // if the browser supports local storage clear out the stored access token
        if (_supportsLocalStorage()) {
            _clearAccessTokeLocalStorage();
        }

        fcs.clearResources(function () {
            if (success) {
                success();
            }
        }, true);
    };


    /*
     * Logs out
     *
     * @method logout
     * @param {Function} success The success callback. It receives no parameters.
     */
    me.logout = function (success) {
        _logger.info('KandyAPI.Phone.logout is deprecated use kandy.logout');

        api.logout(success);
    };

    /*
     * Returns true if login information has been stored in local storage and false otherwise.
     *
     * @method hasStoredLogin
     */
    me.hasStoredLogin = function () {
        if (_supportsLocalStorage()) {
            _getUserInformationLocalStorage();
        }
    };

    /**
     * Returns true if media is initialized and false otherwise.
     *
     * @method isMediaInitialized
     * @return {Boolean} isMediaInitiated The state of media initialization.
     */
    me.isMediaInitiated = function () {
        return _mediaInitiated;
    };

    /**
     * Returns true if the call is incoming and false otherwise.
     *
     * @method isIncoming
     * @param {String} callId The id of the call.
     * @return {Boolean} isIncoming The state of the call, whether it's incoming or outgoing.
     */
    me.isIncoming = function (callId) {
        var call = _calls[callId];

        return !call.isOutgoing;
    };

    /**
     * Returns true if call is outgoing and false otherwise.
     *
     * @method isOutgoing
     * @param {String} callId The id of the call.
     * @return {Boolean} isOutgoing The state of the call, whether it's incoming or outgoing.
     */
    me.isOutgoing = function (callId) {
        var call = _calls[callId];

        return call.isOutgoing;
    };

    /**
     * All call types.
     *
     * @property callTypes
     * @type {Object} Object with keys for each call type.
     * @example
     * ``` javascript
     *  var type = kandy.call.callType(callId);
     *
     *  switch(type) {
     *      case kandy.call.callTypes.INCOMING_CALL:
     *          ...
     *      case kandy.call.callTypes.OUTGOING_CALL:
     *          ...
     *  }
     *
     *  // Possible values
     *  // INCOMING_CALL: The call is incoming.
     *  // OUTGOING_CALL: The call is outgoing.
     * ```
     */
    me.callTypes = function () {
        return _callTypes;
    };

    /*
     * We want callTypes to be a property but there was already a getter function
     * so now we merge _callTypes and me.callTypes so that me.callTypes is a function
     * that can be used like an object property. Officially, this is just an object.
     */
    for(var key in _callTypes) {
        if(_callTypes.hasOwnProperty(key)) {
            me.callTypes[key] = _callTypes[key];
        }
    }

    /*
     * Returns anonymous data if the call is anonymous and null if it isn't.
     *
     * @method getAnonymousData
     * @param {String} callId The id of the call to get the Anonymous data for.
     */
    me.getAnonymousData = function (callId) {
        var call = _call[callId];

        if (call && call.isAnonymous) {
            return call.callerName;
        } else {
            return null;
        }
    };

    /**
     * Returns call type which is either incoming or outgoing.
     *
     * @method callType
     * @param {String} callId The id of the call.
     * @return {Number} callType Use callTypes() to interpret callType. Possible types are INCOMING_CALL and OUTGOING_CALL.
     */
    me.callType = function (callId) {
        var call = _calls[callId];

        if (call.isIncoming) {
            return _callTypes.INCOMING_CALL;
        }
        else if (call.isOutgoing) {
            return _callTypes.OUTGOING_CALL;
        }
    };

    /**
     * Make a SIP trunk call to a given SIP phone number or SIP endpoint URI.
     *
     * @method makeSIPCall
     * @async
     * @param {String} number SIP phone number to call
     * @param {String} callerId Caller's phone number / username as it should appear to callee
     * @param {Object} options Additional options to set for a call.
     * @param {HTMLElement} options.remoteVideoContainer The container to use for remote video during the call.
     * @param {HTMLElement} options.localVideoContainer The container to use for local video during the call.
     */
    me.makeSIPCall = function (number, callerId, options) {
        me.makeCall(_config.sipOutNumber + number + '@' + _userDetails.domain_name, false, callerId, options);
    };

    /**
     * Make a Public Switched Telephone Network (PSTN) call to a given PSTN phone number.
     *
     * @method makePSTNCall
     * @async
     * @param {String} number PSTN phone number to call
     * @param {String} callerId Caller's phone number as it should appear to callee.
     * @param {Object} options Additional options to set for a call.
     * @param {HTMLElement} options.remoteVideoContainer The container to use for remote video during the call.
     * @param {HTMLElement} options.localVideoContainer The container to use for local video during the call.
     */
    me.makePSTNCall = function (number, callerId, options) {
        me.makeCall(_config.pstnOutNumber + number + '@' + _userDetails.domain_name, false, callerId, options);
    };

    /**
     * Make an IP call to another Kandy user
     *
     * @method makeCall
     * @async
     * @param {String} userName The number to call
     * @param {Boolean} cameraOn When true, the user's video will be sent to the callee. Otherwise, the user's video will not be sent.
     * @param {String} callerId Caller's identification as it should appear to callee
     * @param {Object} options Additional options to set for a call.
     * @param {HTMLElement} options.remoteVideoContainer The container to use for remote video during the call.
     * @param {HTMLElement} options.localVideoContainer The container to use for local video during the call.
     */
    me.makeCall = function (userName, cameraOn, callerId, options) {
        _logger.info('making voice call');

        me.initMedia(
            function () {
                if (userName === _userDetails.full_user_id) {
                  events.emit('callinitiatefailed', 'You cannot call yourself');
                    return;
                }

                fcs.call.startCall(fcs.getUser(), {firstName: callerId}, userName,
                    //onSuccess
                    function (outgoingCall) {
                        outgoingCall.onStateChange = function (state, statusCode) {
                            outgoingCall.statusCode = statusCode;

                            _handleCallStateChange(outgoingCall, state);
                        };

                        outgoingCall.isOutgoing = true;
                        outgoingCall.isAnonymous = false;
                        _calls[outgoingCall.getId()] = outgoingCall;

                        events.emit('callinitiated', outgoingCall, userName);
                    },
                    //onFailure
                    function (errorCode) {
                        _logger.error('call failed');
                        events.emit('callinitiatefailed', 'Start call failed: ' + errorCode);

                    }, true, cameraOn);
            },
            function (errorCode) {
                _logger.error('call failed');
                events.emit('callinitiatefailed', 'Init media failed: ' + errorCode);
            },
            false,
            options
        );
    };

    /*
     * Starts Anonymous video call
     *
     * @method makeAnonymousCall
     * @param {String} domainApiKey The Domain API Key for the domain on which the call will be made.
     * @param {String} account The account on which the call will be made.
     * @param {String} caller The Kandy user making the call (caller)
     * @param {String} callee The Kandy user being called (callee)
     * @param {String} cli
     * @param {Boolean} cameraOn Whether call is made with camera on
     */
    function makeAnonymousCall(domainApiKey, account, caller, callee, cli, cameraOn){
        _initLogger();

        _kandyRequest({
          url: '/domains/configurations/communications/spidr',
          params: { key: domainApiKey },
          success: applyConfiguration,
          failure: function() {
              events.emit('callinitiatefailed', 'Failed to retrieve domain configuration');
              _logger.error('Call Failed: Failed to retrieve domain configuration');
          }
        });

        /*
        * Apply spidr configuration
        *
        * @method applyConfiguration
        * @param {JSON} Config Input configuration variable for Spidr.
        */
        function applyConfiguration(config) {

            _mergeConfigWithSpidrConfiguration(config.result.spidr_configuration);

            fcs.setup(_config.spidrApi);

            //Setup user credential
            fcs.setUserAuth(account, '');

            fcs.notification.start(
                function () {
                  _logger.info('Notification started');


                  me.initMedia(
                      function () {
                        _logger.info('Call init successfully');
                        //TODO: do we need setTimeout
                        setTimeout(function () {

                            fcs.call.startCall(caller, cli, callee,
                                //onSuccess
                                function (outgoingCall) {
                                    outgoingCall.onStateChange = function (state, statusCode) {
                                        outgoingCall.statusCode = statusCode;

                                        _handleCallStateChange(outgoingCall, state);
                                    };

                                    outgoingCall.isOutgoing = true;
                                    outgoingCall.isAnonymous = true;
                                    _calls[outgoingCall.getId()] = outgoingCall;
                                    events.emit('callinitiated', outgoingCall, callee);
                                },
                                //onFailure
                                function (errorCode) {
                                    _logger.error('call failed');
                                    events.emit('callinitiatefailed', 'error code: ' + errorCode);

                                }, false, cameraOn
                            );

                        }, 100);
                      },
                      function (errorCode) {
                          _logger.error('Call init failed');
                          api.logout();
                          events.emit('callinitiatefailed', 'Init media failed: ' + errorCode);
                      }
                  );
                },
                function () {
                    console.error('Notification failed');
                    events.emit('callinitiatefailed', 'Auth failed');
                }, true);
        }
    }

    /*
     * Starts Anonymous video call using a token
     *
     * @method makeAnonymousCallWithToken
     * @param {String} domainApiKey The Domain API Key for the domain on which the call will be made.
     * @param {String} tokenRealm The realm used to encrypt the tokens
     * @param {String} acountToken The encoded account token used to make the call
     * @param {String} fromToken The encoded origination for the call
     * @param {String} toToken The encoded destination for the call
     * @param {Boolean} cameraOn Whether call is made with camera on
     * @private
     */
    me.makeAnonymousCallWithToken = function (domainApiKey, tokenRealm, acountToken, fromToken, toToken, cameraOn){
        fcs.setRealm(tokenRealm);
        makeAnonymousCall(domainApiKey, acountToken, fromToken, toToken, null, cameraOn);
    };

    /*
     * Starts Anonymous video call
     *
     * @method makeAnonymousCall
     * @param {String} domainApiKey The Domain API Key for the domain on which the call will be made.
     * @param {String} calleeUsername The Kandy user being called (callee)
     * @param {String} anonymousData Data to send with anonymous call
     * @param {String} callerUserName The Kandy user making the call (caller)
     * @param {Boolean} cameraOn Whether call is made with camera on
     */
    me.makeAnonymousCall = function (domainApiKey, calleeUsername, anonymousData, callerUserName, cameraOn) {
        var anonymousUserName = {
            firstName: anonymousData
        };
        callerUserName = callerUserName || 'anonymous@concierge.com';
        makeAnonymousCall(domainApiKey, callerUserName, callerUserName, calleeUsername, anonymousUserName, cameraOn);
    };

    /**
     * Reject incoming call.
     *
     * @method rejectCall
     * @param {String} callId ID of call. This can be obtained from calling getId() on the call object received by the callincoming event handler.
     */
    me.rejectCall = function (callId) {
        var call = _calls[callId];
        call.reject(
                function () {
                    events.emit('callrejected', call);
                },
                function (errorCode) {
                    _logger.info('reject failed');
                    events.emit('callrejectfailed', call, errorCode);
                }
        );
    };

    /**
     * Ignore incoming call.
     *
     * @method ignoreCall
     * @param {String} callId ID of call. This can be obtained from calling getId() on the call object received by the callincoming event handler.
     */
    me.ignoreCall = function (callId) {
        var call = _calls[callId];
        call.ignore(
                function () {
                    events.emit('callignored', call);
                },
                function (errorCode) {
                    events.emit('callignorefailed', call, errorCode);
                    _logger.info('ignore failed');
                }
        );
    };

    /**
     * Answer an incoming call.
     *
     * @method answerCall
     * @param {String} ID of call. This can be obtained by calling getId() on the call object passed to the callincoming event listener.
     * @param {Boolean} cameraOn When true, call will be answered with the user's video being sent to caller. Otherwise, the user's video will not be sent.
     * @param {Object} options Additional options to set for a call.
     * @param {HTMLElement} options.remoteVideoContainer The container to use for remote video during the call.
     * @param {HTMLElement} options.localVideoContainer The container to use for local video during the call.
     */
    me.answerCall = function (callId, cameraOn, options) {
        me.initMedia(function () {
            var call = _calls[callId];
            call.answer(function () {
                        events.emit('callanswered', call, call.isAnonymous);

                        // For some reason, FCS doesn't send us a state change to IN_CALL whenever
                        // we answer an incoming call. Trigger it here to fake it.
                        _handleCallStateChange(call, fcs.call.States.IN_CALL);
                    },
                    function (errorCode) {
                        _logger.info('answer failed');
                        events.emit('callanswerfailed', call, errorCode);
                    },
                    cameraOn
            );
        },
            function (errorCode) {
                _logger.info('answer failed');
                events.emit('callanswerfailed');
            },
            false,
            options
        );
    };

    /**
     * Stop sending the user's audio to the other party on the call
     *
     * @method muteCall
     * @param {String} callId ID of call. This can be obtained from calling getId() on the call object received by either the callincoming or callinitiated event handler.
     */
    me.muteCall = function (callId) {
        var call = _calls[callId];
        if (call) {
            call.mute();
            call.isMuted = true;
        }
    };

    /**
     * Start sending the user's audio to the other party on the call.
     *
     * @method unMuteCall
     * @param {String} callId ID of call. This can be gotten from calling getId() on the call object received by either the callincoming or callinitiated event handler.
     */
    me.unMuteCall = function (callId) {
        var call = _calls[callId];
        if (call) {
            call.unmute();
            call.isMuted = false;
        }
    };

    /**
     * Place a call on hold.
     *
     * @method holdCall
     * @async
     * @param {String} callId ID of call. This can be obtained from calling getId() on the call object received by either the callincoming or callinitiated event handler.
     * @param {Function} success The success callback. It receives no parameters.
     * @param {Function} failure The failure callback. It receives no parameters.
     */
    me.holdCall = function (callId, success, failure) {
        var call = _calls[callId];
        if (call) {
            call.hold(success, failure);
            call.held = true;
        }
    };

    /**
     * Take a call off hold.
     *
     * @method unHoldCall
     * @async
     * @param {String} callId ID of call. This can be obtained from calling getId() on the call object received by either the callincoming or callinitiated event handler.
     * @param {Function} success The success callback. It receives no parameters.
     * @param {Function} failure The failure callback. It receives no parameters.
     */
    me.unHoldCall = function (callId, success, failure) {
        var call = _calls[callId];
        if (call) {
            call.unhold(success, failure);
            call.held = false;
        }
    };

    /**
     * Start sending the user's video to the other party on the call.
     *
     * @method startCallVideo
     * @async
     * @param {String} callId ID of call. This can be obtained from calling getId() on the call object received by either the callincoming or callinitiated event handler.
     * @param {Function} success The success callback. It receives no parameters.
     * @param {Function} failure The failure callback. It receives no parameters.
     */
    me.startCallVideo = function (callId, success, failure) {
        var call = _calls[callId];
        if (call) {
            call.videoStart(success, failure);
        }
    };

    /**
     * Stop sending the user's video to the other party on the call
     *
     * @method stopCallVideo
     * @async
     * @param {String} callId ID of call. This can be obtained from calling getId() on the call object received by either the callincoming or callinitiated event handler.
     * @param {Function} success The success callback. It receives no parameters.
     * @param {Function} failure The failure callback. It receives no parameters.
     */
    me.stopCallVideo = function (callId, success, failure) {
        var call = _calls[callId];
        if (call) {
            call.videoStop(success, failure);
        }
    };

    /**
     * Start screen sharing for the specified call. If the call already has video, the screen sharing will replace the video. Note
     * that a screensharing extension has to be present to enable this. See `kandy.setup` for more information.
     *
     * @method startScreenSharing
     * @async
     * @param {String} callId Id of the call for which to start screen sharing.
     * @param {Function} success The success callback. It receives no parameters.
     * @param {Function} failure The failure callback. It receives one parameter.
     * @param {Number} failure.errorCode Error code for the failure.
     * @param {Object} options Options for the screen sharing session.
     * @param {Number} [options.width=1024] The width of the screen to request.
     * @param {Number} [options.height=768] The height of the screen to request.
     * @param {Number} [options.frameRate=15] The number of frames per second to request.
     */
    me.startScreenSharing = function (callId, success, failure, options) {
        var call = _calls[callId];
        if (call) {

            call.screenSharingStart(success, failure, function() {
                // Emit the callscreenstopped event.
                events.emit('callscreenstopped', call);
            }, options);
        }
    };

    /**
     * Stop screen sharing for the specified call. If the call is set to send video, then the screen sharing will
     * stop and video will resume.
     *
     * @method stopScreenSharing
     * @async
     * @param {String} callId Id of call.
     * @param {Function} success The success callback. It receives no parameters.
     * @param {Function} failure The failure callback. It receives no parameters.
     */
    me.stopScreenSharing = function (callId, success, failure) {
        var call = _calls[callId];
        if (call) {
            call.screenSharingStop(function() {
                events.emit('callscreenstopped', call);
                if (success) {
                    success();
                }
            }, failure);
        }
    };

    /**
     * Send a tone (Dual Tone Multi Frequency) in a PSTN call.
     *
     * @method sendDTMF
     * @param {String} callId ID of call. This can be obtained from calling getId() on the call object passed to either the callincoming or callinitiated event handlers.
     * @param {String} tones Tones to send.
     */
    //TODO: Document format of tones
    me.sendDTMF = function (callId, tones) {
        var call = _calls[callId];
        if (call) {
            call.sendDTMF(tones);
        }
    };


    /**
     * Ends a call.
     *
     * @method endCall
     * @param {String} callId ID of call. This can be obtained from calling getId() on the call object passed to either the callincoming or callinitiated event handlers.
     */
    me.endCall = function (callId) {
        var call = _calls[callId];

        if (call) {
            _logger.info('ending call');
            call.end(
                function () {
                    _stopIntraFrame(call);

                    delete _calls[callId];

                    if (call.isAnonymous && call.isOutgoing) {
                        fcs.clearResources(function () {
                        }, true);
                    }

                    events.emit('callended', call);
                },
                function (errorCode) {
                    _logger.error('COULD NOT END CALL');
                    events.emit('callendfailed', call, errorCode);
                }
            );
        }
    };

    /*
     * watch presence for logged in user.
     *
     * @method watchPresence
     * @deprecated Use `kandy.getLastSeen`
     * @async
     * no callbacks
     * @param {Array} list Watch presence given array of users
     * @param {Function} success The success callback
     * @param {Function} failure The failure callback
     * @deprecated Use `kandy.getLastSeen`
     */
    me.watchPresence = function (list, success, failure) {

        _logger.warn('KandyAPI.Phone.watchPresence is deprecated please use kandy.getLastSeen');

        var contactList = [];

        fcs.presence.watch(
                list.map(function (item) {
                    return item.full_user_id;
                }),
                function () {
                    _logger.info('Watch presence successful');
                    if (success) {
                        success();
                    }
                },
                function () {
                    _logger.error('Watch presence error');
                    if (failure) {
                        failure();
                    }
                }
        );
    };

    /*
     * Sets presence for logged in user.
     *
     * @method updatePresence
     * @param {Boolean} status true or false value to set for user presence
     * @deprecated Use `kandy.getLastSeen`
     */
    me.updatePresence = function (status) {
        _logger.warn('KandyAPI.Phone.updatePresence is deprecated please use kandy.getLastSeen');
        if (fcs.getServices().presence === true) {
            fcs.presence.update(parseInt(status),
                    function () {
                        _logger.info('Presence update success');
                    },
                    function () {
                        _logger.error('Presence update failed');
                    });
        } else {
            _logger.error('Presence service not available for account');
        }
    };

    me.normalizeNumber = function (number, countryCode, success, failure) {
        _kandyRequest({
            url: '/users/services/normalize/phone_number',
            params: {
                'phone_number': number,
                'countryCode': countryCode
            },
            success: function (response) {
                if (success) {
                    success(response.result);
                }
            },
            failure: failure
        });
    };

    function _getSpidrConfiguration(success, failure) {
        _kandyRequest({
            url: '/users/configurations/communications/spidr',
            params: {
                secure: true
            },
            success: function (response) {
                if (success) {
                    success(response.result.spidr_configuration);
                }
            },
            failure: failure
        });
    }

    /*
     * Retrieves spidr configuration
     *
     * @method getSpidrConfiguration
     * @param {Function} userAccessToken User Access Token.
     * @param {Function} success The success callback.
     * @param {Function} failure The failure callback.
     */
    me.getSpidrConfiguration = _getSpidrConfiguration;

    return me;
}());

/**
 * The addressBook namespace contains functions to manage user's address book as well as to provide search and retrieval
 * of the Kandy domain's directory. The address book contains user contacts that can be shared between all the different
 * devices and Kandy apps.
 *
 * @todo We should add the ability to modify users in the personal address book.
 * @class addressBook
 * @namespace kandy
 * @static
 */
api.addressBook = api.addressbook = (function() {

    var me = {};

    /**
     * Search the domain directory by phone number.
     *
     * @method searchDirectoryByPhoneNumber
     * @async
     * @param {String} phoneNumber The phone number to search for. Can be a partial phone number.
     * @param {Function} success The success callback. It receives one parameter.
     * @param {User[]} success.users An array of users that correspond to the search criteria.
     * @param {Function} failure The failure callback. It receives one parameter.
     * @param {String} failure.errorMessage The error message explaining what failed.
     */
    me.searchDirectoryByPhoneNumber = function(phoneNumber, success, failure) {
        _kandyRequest({
            url: '/users/directories/native/searches/phone_number',
            params: {
                'search_string': phoneNumber
            },
            success: function(response) {
                if (success) {
                    success(response.result.contacts);
                }
            },
            failure: failure
        });
    };

    /**
     * Search the domain directory by name. The search will be done on both the first name and the last name.
     *
     * @method searchDirectoryByName
     * @async
     * @param {String} name The name to search for. The name is case sensitive and can be a partial name.
     * @param {Function} success The success callback. It receives one parameter.
     * @param {User[]} success.users An array of users that correspond to the search criteria.
     * @param {Function} failure The failure callback. It receives one parameter.
     * @param {String} failure.errorMessage The error message explaining what failed.
     */
    me.searchDirectoryByName = function(name, success, failure) {
        _kandyRequest({
            url: '/users/directories/native/searches/name',
            params: {
                'search_string': name
            },
            success: function(response) {
                if (success) {
                    success(response.result.contacts);
                }
            },
            failure: failure
        });
    };

    /**
     * Search the domain directory by username.
     *
     * @method searchDirectoryByUsername
     * @async
     * @param {String} username Username to search for.
     * @param {Function} success The success callback. It receives one parameter.
     * @param {User[]} success.users An array of users that correspond to the search criteria.
     * @param {Function} failure The failure callback. It receives one parameter.
     * @param {String} failure.errorMessage The error message explaining what failed.
     */
    me.searchDirectoryByUsername = function(username, success, failure) {
        _kandyRequest({
            url: '/users/directories/native/searches/user_id',
            params: {
                'search_string': username
            },
            success: function(response) {
                if (success) {
                    success(response.result.contacts);
                }
            },
            failure: failure
        });
    };

    /*
     * @method searchDirectoryByUserName
     * @deprecated Use `kandy.addressBook.searchDirectoryByUsername` instead.
     * @async
     * @param {String} username Username to search for.
     * @param {Function} success The success callback. It receives one parameter.
     * @param {User[]} success.users An array of users that correspond to the search criteria.
     * @param {Function} failure The failure callback. It receives one parameter.
     * @param {String} failure.errorMessage The error message explaining what failed.
     */
    me.searchDirectoryByUserName = me.searchDirectoryByUsername;

    /**
     * Full text search of the directory. This will search the first name, last name, user id and phone number. The
     * search is case-sensitive and can be partial.
     *
     * @method searchDirectory
     * @async
     * @param {String} searchString The string to search for.
     * @param {Function} success The success callback. It receives one parameter.
     * @param {User[]} success.users An array of users that correspond to the search criteria.
     * @param {Function} failure The failure callback. It receives one parameter.
     * @param {String} failure.errorMessage The error message explaining what failed.
     */
    me.searchDirectory = function(searchString, success, failure) {
        _kandyRequest({
            url: '/users/directories/native/search/',
            params: {
                'search_string': searchString
            },
            success: function(response) {
                if (success) {
                    success(response.result.contacts);
                }
            },
            failure: failure
        });
    };

    /**
     * Retrieves the whole directory.
     *
     * @method retrieveDirectory
     * @async
     * @param {Function} success The success callback. It receives one parameter.
     * @param {User[]} success.users An array of all users in the directory.
     * @param {Function} failure The failure callback. It receives one parameter.
     * @param {String} failure.errorMessage The error message explaining what failed.
     */
    me.retrieveDirectory = function(success, failure) {
        _kandyRequest({
            url: '/users/directories/native',
            success: function(response) {
                if (success && response.result && response.result.contacts) {
                    response.result.contacts.forEach(function(contact) {
                        contact.firstName = contact.user_first_name;
                        contact.lastName = contact.user_last_name;
                        contact.number = contact.user_phone_number;
                        contact.hintType = 'community';
                        delete contact.user_first_name;
                        delete contact.user_last_name;
                    });
                    success(response.result);
                }
            },
            failure: failure
        });
    };

    /**
     * Retrieves all entries of the user's personal address book.
     *
     * @method retrievePersonalAddressBook
     * @async
     * @param {Function} success The success callback. It receives one parameter.
     * @param {Contact[]} success.contacts An array of all contacts in the user's address book.
     * @param {Function} failure The failure callback. It receives one parameter.
     * @param {String} failure.errorMessage The error message explaining what failed.
     */
    me.retrievePersonalAddressBook = function(success, failure) {
        _kandyRequest({
            url: '/users/addressbooks/personal',
            success: function(response) {
                if (success) {
                    success(response.result.contacts);
                }
            },
            failure: failure
        });
    };

    /**
     * Adds a contact to the user's personal address book.
     *
     * @method addToPersonalAddressBook
     * @async
     * @param {Contact} contact The contact to add to the address book.
     * @param {Function} success The success callback. It receives one parameter.
     * @param {Contact} success.contact The contact that was added to the address book with it's newly generated
     *                                  contact_id.
     * @param {Function} failure The failure callback. It receives one parameter.
     * @param {String} failure.errorMessage The error message explaining what failed.
     */
    me.addToPersonalAddressBook = function(contact, success, failure) {
        _kandyRequest({
            type: 'POST',
            url: '/users/addressbooks/personal',
            data: {
                contact: contact
            },
            success: function(response) {
                if (success) {
                    success(response.result);
                }
            },
            failure: failure
        });
    };

    /**
     * Remove a contact from the user's personal address book.
     *
     * @method removeFromPersonalAddressBook
     * @async
     * @param {String} contactId The contact id of the contact to remove.
     * @param {Function} success The success callback. It receives no parameters.
     * @param {Function} failure The failure callback. It receives one parameter.
     * @param {String} failure.errorMessage The error message explaining what failed.
     */
    me.removeFromPersonalAddressBook = function(contactId, success, failure) {
        _kandyRequest({
            type: 'DELETE',
            url: '/users/addressbooks/personal',
            params: {
                'contact_id': contactId
            },
            success: function(response) {
                if (success) {
                    success();
                }
            },
            failure: failure
        });
    };

    /**
     * Retrieves the user's device address book. This address book is a separate address book.
     *
     * @private
     * @todo One of a few things should happen here. Either we document why we have a separate read-only address book,
     *       remove this feature, or add full management of this address book.
     *
     * @method retrieveUserDeviceAddressBook
     * @async
     * @param {Function} success The success callback. It receives one parameter.
     * @param {Contact[]} success.contacts An array of all contacts in the user's address book.
     * @param {Function} failure The failure callback. It receives one parameter.
     * @param {String} failure.errorMessage The error message explaining what failed.
     */
    me.retrieveUserDeviceAddressBook = function(success, failure) {
        _kandyRequest({
            url: '/users/addressbooks/device',
            success: function(response) {
                if (success) {
                    success(response.result);
                }
            },
            failure: failure
        });
    };

    return me;
}());

/*
 * Everything in registration needs to be deprecated. These functions should be
 * run on the server, especially since one of them requires a secret key.
 *
 * @class registration
 * @namespace kandy
 * @static
 */

api.Registration = api.registration = (function () {
    var me = {};

    /*
     * @property {String} _config Domain Access Code.
     */
    var _domainAccessToken = null;

    /*
     * Fires passed event
     *
     * @method _fireEvent
     */
    function _fireEvent() {
        var eventName = Array.prototype.shift.apply(arguments);

        if (me.events[eventName]) {
            me.events[eventName].apply(me, arguments);
        }
    }

    /*
     * @method setup
     * @param {Object} config Configuration.
     * @param {Array} [config.listeners={}] Listeners for KandyAPI.Registration.
     * @param {String} [config.mediatorUrl="http://api.kandy.io"] Rest endpoint for KandyWrapper.
     */
    me.setup = function (config) {

        // setup default configuration
        _config = utils.extend(_config, config);

        me._domainAccessToken = config.domainAccessToken;

        // setup listeners
        //TODO me.events realy needed for KandyAPI.Registration?
        /*
        if (_config.listeners) {
            for (var listener in _config.listeners) {

                // TODO: This has to be a bug right? We're only adding the listener if it's already defined?
                if (me.events[listener] !== undefined) {
                    me.events[listener] = _config.listeners[listener];
                }
            }
        }

        */
        _logger = fcs.logManager.getLogger();
    };

    /*
     * @method retrieveCountryCode
     * Retrieves county code based on Device
     * @param {Function} success The success callback.
     * @param {Function} failure The failure callback.
     */
    me.retrieveCountryCode = function (success, failure) {
        _kandyRequest({
            url: '/domains/countrycodes',
            params: {
                key: me._domainAccessToken
            },
            success: function (response) {
                if (success) {
                    success(response.result);
                }
            },
            failure: failure
        });
    };

    /*
     * @method sendValidationCode
     * Send validation code to phone
     * @param {String} phoneNumber Phone number to send validation SMS to.
     * @param {Function} success The success callback.
     * @param {Function} failure The failure callback.
     */
    me.sendValidationCode = function (phoneNumber, countryCode, success, failure) {
        _kandyRequest({
            type: 'POST',
            url: '/domains/verifications/smss',
            params: {
                key: me._domainAccessToken
            },
            data: {
                'user_phone_number': phoneNumber,
                'user_country_code': countryCode
            },
            success: success,
            failure: failure
        });
    };

    /*
     * @method validateCode
     * Validate SMS code sent to phone
     * @param {String} validationCode Validation code sent to phone.
     * @param {Function} success The success callback.
     * @param {Function} failure The failure callback.
     */
    me.validateCode = function (validationCode, success, failure) {
        var encodedAccessCode = encodeURIComponent(me._domainAccessToken);

        _kandyRequest({
            url: '/domains/verifications/codes',
            params: {
                key: me._domainAccessToken,
                'validation_code': validationCode
            },
            success: function (response) {
                if (success) {
                    success(response.result.valid);
                }
            },
            failure: failure
        });
    };

    me.getUserInfo = function (success, failure) {
        _kandyRequest({
            url: '/users/billing/packages/status/active',
            success: function (response) {
                if (success) {
                    success(response.result);
                }
            },
            failure: failure
        });
    };

    me.getProfileInfo = function (userId, domainId, success, failure) {

        _kandyRequest({
            url: '/users/profiles/user_profiles/user_profile',
            params: {
                'user_id': userId,
                'domain_name': domainId
            },
            success: function (response) {
                if (success) {
                    success(response.result);
                }
            },
            failure: failure
        });
    };

    // TODO: Document, and set parameters to camel case.
    me.setProfileInfo = function (data, success, failure) {
        _kandyRequest({
            type: 'POST',
            url: '/users/profiles/user_profiles',
            params: {
                'first_name': data.first_name,
                'last_name': data.last_name,
                'status_text': data.status_text,
                'image_details': data.image_details,
                'user_data': data.user_data
            },
            success: function (response) {
                if (success) {
                    success();
                }
            },
            failure: failure
        });
    };


    /*
     * @method register a device
     * Registers a device in Kandy
     * @param {Object}
     * e.g. {
     *        {String} domainAccessToken: "7b81d8e63f5b478382b4e23127260090", // optional
     *        {String} userPhoneNumber: "4034932232",
     *        {String} userCountryCode "UA",
     *        {String} validationCode "1234",
     *        {String} deviceNativeId "3456",
     *        {String} deviceFamily "iPhone",  // optional
     *        {String} deviceName "myPhone",  // optional
     *        {String} clientSwVersion "4",  // optional
     *        {String} deviceOsVersion "801",  // optional
     *        {String} userPassword "pwdxyz13!",  // optional
     *        {Function} success = function() { doSomething(); }
     *        {Function} failure = function() { doSomethingElse(); }
     *   }
     * @return {Object} response object
     * e.g. { user_id: "972542405850",
     full_user_id: "972542405850@domain.com",
     domain_name:  "domain.com",
     user_access_token: "4d405f6dfd9842a981a90daaf0da08fa",
     device_id: "4d405f6dfd9842a389d5b45d65a9dfd0"
     }
     */
    me.register = function (params, success, failure) {
        _kandyRequest({
            type: 'POST',
            url: '/api_wrappers/registrations',
            params: {
                // TODO "internal server error" if client_sw_version and client_sw_type are used.
                // 'client_sw_version': api.version,
                // 'client_sw_type': 'JS',

                key: me._domainAccessToken
            },
            data: {

                'user_phone_number': params.userPhoneNumber,
                'user_country_code': params.userCountryCode,
                'validation_code': params.validationCode,
                'device_native_id': params.deviceNativeId
            },
            success: function (response) {
                if (success) {
                    success(response.result);
                }

            },
            failure: failure
        });
    };

    /*
     * @method getConfiguration
     * Retrieves domain name, access token, and SPiDR configuration
     * @param {String} domainApiKey
     * @param {String} domainApiSecret
     * @param {Function} success The success callback.
     * @param {Function} failure The failure callback.
     * @return {Object} response object
     * e.g. {
     "domain_name": "domain.com",
     "domain_access_token": "4d405f6dfd9842a981a90daaf0da08fa",
     "spidr_configuration":
     {
     "REST_server_address":"kandysimplex.fring.com",
     "REST_server_port":443,
     "webSocket_server_address":"kandysimplex.fring.com",
     "webSocket_server_port":8582,
     "ICE_server_address":"54.84.226.174",
     "ICE_server_port":3478,
     "subscription_expire_time_seconds":null,
     "REST_protocol":"https",
     "server_certificate":null,
     "use_DTLS":false,
     "audit_enable":true,
     "audit_packet_frequency":null
     }
     }
     */

    me.getConfiguration = function (params, success, failure) {
        _kandyRequest({
            url: '/api_wrappers/configurations',
            params: {
                key: params.domainApiKey,
                'domain_api_secret': params.domainApiSecret
            },
            success: function (response) {
                if (success) {
                    success({
                        domainName: response.result.domain_name,
                        domainAccessToken: response.result.domain_access_token,
                        spidrConfiguration: {
                            restUrl: response.result.spidr_configuration.REST_server_address,
                            restPort: response.result.spidr_configuration.REST_server_port,
                            protocol: response.result.spidr_configuration.REST_protocol,
                            websocketIP: response.result.spidr_configuration.webSocket_server_address,
                            websocketPort: response.result.spidr_configuration.webSocket_server_port,
                            'spidr_env': {
                                iceserver: ('stun:' + response.result.spidr_configuration.ICE_server_address + ':' +
                                        response.result.spidr_configuration.ICE_server_port),
                                ice: ('STUN stun:' + response.result.spidr_configuration.ICE_server_address + ':' +
                                        response.result.spidr_configuration.ICE_server_port)

                            }
                        }
                    });
                }
            },
            failure: failure
        });
    };

    return me;
}());

/**
 * Module to group type interfaces used throughout kandy.
 *
 * @todo Split this into multiple files. It is getting too big.
 * @module interfaces
 * @namespace
 */

/**
 * The call interface contains information about a call. It is used only during call events.
 *
 * @class Call
 */

/**
 * The username or number of the callee for the call.
 *
 * @property calleeNumber
 * @type String
 */

/**
 * Caller first and last name of the call.
 *
 * @property callerName
 * @type String
 */

/**
 * The number or fully qualified caller username (username@domainname.com) for the call.
 *
 * @property callerNumber
 * @type String
 */

/**
 * Flag indicating whether the call is an anonymous call.
 *
 * @private
 * @property isAnonymous
 * @type Boolean
 */

/**
 * Returns the id of the call.
 *
 * @method getId
 * @return {String} Id of the call.
 */

/**
 * Returns a string that corresponds to the remote video state.
 * @method getRemoteVideoState
 * @return {String} Can be "sendrecv", "sendonly", "recvonly", "inactive" or "notfound"
 */


/**
 * The User interface represents a user and it's properties. It is used as part of the address book APIs.
 *
 * @todo This should be normalized to using camel case properties.
 * @class User
 */

/**
 * The user id without the domain (e.g. "john.smith").
 *
 * @property user_id
 * @type String
 */

/**
 * The user's domain name.
 *
 * @property domain_name
 * @type String
 */

/**
 * The user's full user id including the domain (e.g. "john.smith@domain.com")
 *
 * @property full_user_id
 * @type String
 */

/**
 * The user's first name.
 *
 * @property user_first_name
 * @type String
 */

/**
 * The user's last name.
 *
 * @property user_last_name
 * @type String
 */

/**
 * The user's email.
 *
 * @property user_email
 * @type String
 */

/**
 * The user's phone number.
 *
 * @property user_phone_number
 * @type String
 */



/**
 * The Contact interface represents a contact stored in a user's personal address book. Note that
 * a contact does not have any formal references to a Kandy user. An application can manage such a reference
 * by using one of the fields provided, or add new fields as needed.
 *
 * @class Contact
 */

/**
 * The id of the contact. This is a read-only property generated by Kandy.
 *
 * @todo Make this camel case.
 * @property contact_id
 * @readOnly
 */

/**
 * The name of the contact.
 *
 * @property name
 * @type String
 * @optional
 */

/**
 * The nickname of the contact.
 *
 * @property nickname
 * @type String
 * @optional
 */

/**
 * The first name of the contact.
 *
 * @property firstName
 * @type String
 * @optional
 */

/**
 * The last name of the contact.
 *
 * @property lastName
 * @type String
 * @optional
 */

/**
 * The email of the contact.
 *
 * @property email
 * @type String
 * @optional
 */

/**
 * The home phone number of the contact.
 *
 * @property homePhone
 * @type String
 * @optional
 */

/**
 * The business phone number of the contact.
 *
 * @property businessPhone
 * @type String
 * @optional
 */

/**
 * The mobile phone number of the contact.
 *
 * @property mobilePhone
 * @type String
 * @optional
 */

/**
 * The fax number of the contact.
 *
 * @property fax
 * @type String
 * @optional
 */


/**
 * The group interface represents a group that can contain one or many users. Users can join and leave
 * groups in order to send and receive messages posted to the group for all members to see. The
 * creator of the group is the admin and they can do things like add group members or mute them.
 *
 * @class Group
 */

/**
 * The id of the group. This is a read-only property generated by Kandy.
 *
 * @todo Make every property of this class camel case.
 * @property group_id
 * @type String
 * @readOnly
 */

/**
 * The name of the group assigned or updated by the creator.
 *
 * @property group_name
 * @type String
 * @optional
 */

/**
 * The image of the group assigned or updated by the creator.
 *
 * @property group_image
 * @type String
 * @optional
 */

/**
 * The maximum number of members allowed to join the group.
 *
 * @property max_members
 * @type Number
 * @optional
 */

/**
 * An array of member objects for members who are owners of the group.
 *
 * @property owners
 * @optional
 */

/**
 * A unix timestamp of the time the date and time the group was created.
 *
 * @property creation_time
 * @optional
 */

/**
 * An array of member objects corresponding to the members in the group.
 *
 * @property members
 * @optional
 */

/**
 * A boolean property that is true when the group is muted and false otherwise.
 * When a group is muted, none of its members can send messages.
 *
 * @property muted
 * @optional
 */


/**
 * The Member interface represents a user who is part of a group.
 *
 * @class Member
 */

/**
 * The user id for the member.
 *
 * @todo Make this camel case.
 * @property full_user_id
 * @type String
 * @readonly
 */

/**
 * A boolean property that is true when the member is muted and false otherwise.
 * Muted members cannot send messages.
 *
 * @property muted
 * @type Boolean
 * @optional
 */

/**
 * Interface representing a device.
 *
 * @class Device
 */

/**
 * The device's id.
 *
 * @property id
 * @type String
 */

/**
 * The device's native id.
 *
 * @property nativeID
 * @type String
 */

/**
 * The device's family.
 *
 * @property family
 * @type String
 */

/**
 * The device's name.
 *
 * @property name
 * @type String
 */

/**
 * The device's OS version.
 *
 * @property osVersion
 * @type String
 */

/**
 * The device's client version.
 *
 * @property clientVersion
 * @type String
 */


    //Announced deprecation in 2.2.0

    api.Phone.sendSMS = function (){
        _logger.warn('KandyAPI.Phone.sendSMS is deprecated please use kandy.messaging.sendSMS');
        return api.messaging.sendSMS.apply(null, arguments);
    };

    api.Phone.sendIm = function (){
        _logger.warn('KandyAPI.Phone.sendIm is deprecated please use kandy.messaging.sendIm');
        return api.messaging.sendIm.apply(null, arguments);
    };
    api.Phone.sendJSON = function (){
        _logger.warn('KandyAPI.Phone.sendJSON is deprecated please use kandy.messaging.sendJSON');
        return api.messaging.sendJSON.apply(null, arguments);
    };
    api.Phone.sendImWithFile = function (){
        _logger.warn('KandyAPI.Phone.sendImWithFile is deprecated please use kandy.messaging.sendImWithFile');
        return api.messaging.sendImWithFile.apply(null, arguments);
    };
    api.Phone.sendImWithImage = function (){
        _logger.warn('KandyAPI.Phone.sendImWithImage is deprecated please use kandy.messaging.sendImWithImage');
        return api.messaging.sendImWithImage.apply(null, arguments);
    };
    api.Phone.sendImWithAudio = function (){
        _logger.warn('KandyAPI.Phone.sendImWithAudio is deprecated please use kandy.messaging.sendImWithAudio');
        return api.messaging.sendImWithAudio.apply(null, arguments);
    };
    api.Phone.sendImWithVideo = function (){
        _logger.warn('KandyAPI.Phone.sendImWithVideo is deprecated please use kandy.messaging.sendImWithVideo');
        return api.messaging.sendImWithVideo.apply(null, arguments);
    };
    api.Phone.uploadFile = function (){
        _logger.warn('KandyAPI.Phone.uploadFile is deprecated please use kandy.messaging.uploadFile');
        return api.messaging.uploadFile.apply(null, arguments);
    };
    api.Phone.buildFileUrl = function (){
        _logger.warn('KandyAPI.Phone.buildFileUrl is deprecated please use kandy.messaging.buildFileUrl');
        return api.messaging.buildFileUrl.apply(null, arguments);
    };
    api.Phone.buildFileThumbnailUrl = function (){
        _logger.warn('KandyAPI.Phone.buildFileThumbnailUrl is deprecated please use kandy.messaging.buildFileThumbnailUrl');
        return api.messaging.buildFileThumbnailUrl.apply(null, arguments);
    };

    api.Phone.getIm = function (){
        _logger.warn('KandyAPI.Phone.getIm is deprecated please use kandy.messaging.getIm');
        return api.messaging.getIm.apply(null, arguments);
    };

    api.Phone.clearIm = function (){
        _logger.warn('KandyAPI.Phone.clearIm is deprecated please use kandy.messaging.clearIm');
        return api.messaging.clearIm.apply(null, arguments);
    };

    api.Phone.searchDirectoryByPhoneNumber = function (){
        _logger.warn('KandyAPI.Phone.searchDirectoryByPhoneNumber is deprecated please use kandy.addressbook.searchDirectoryByPhoneNumber');
        return api.addressbook.searchDirectoryByPhoneNumber.apply(null, arguments);
    };
    api.Phone.searchDirectoryByName = function (){
        _logger.warn('KandyAPI.Phone.searchDirectoryByName is deprecated please use kandy.addressbook.searchDirectoryByName');
        return api.addressbook.searchDirectoryByName.apply(null, arguments);
    };
    api.Phone.searchDirectoryByUserName = function (){
        _logger.warn('KandyAPI.Phone.searchDirectoryByUserName is deprecated please use kandy.addressbook.searchDirectoryByUserName');
        return api.addressbook.searchDirectoryByUserName.apply(null, arguments);
    };
    api.Phone.searchDirectory = function (){
        _logger.warn('KandyAPI.Phone.searchDirectory is deprecated please use kandy.addressbook.searchDirectory');
        return api.addressbook.searchDirectory.apply(null, arguments);
    };
    api.Phone.retrievePersonalAddressBook = function (){
        _logger.warn('KandyAPI.Phone.retrievePersonalAddressBook is deprecated please use kandy.addressbook.retrievePersonalAddressBook');
        api.addressbook.retrievePersonalAddressBook.apply(null, arguments);
    };
    api.Phone.addToPersonalAddressBook = function (){
        _logger.warn('KandyAPI.Phone.addToPersonalAddressBook is deprecated please use kandy.addressbook.addToPersonalAddressBook');
        return api.addressbook.addToPersonalAddressBook.apply(null, arguments);
    };
    api.Phone.removeFromPersonalAddressBook = function (){
        _logger.warn('KandyAPI.Phone.removeFromPersonalAddressBook is deprecated please use kandy.addressbook.removeFromPersonalAddressBook');
        return api.addressbook.removeFromPersonalAddressBook.apply(null, arguments);
    };
    api.Phone.retrieveUserDeviceAddressBook = function (){
        _logger.warn('KandyAPI.Phone.retrieveUserDeviceAddressBook is deprecated please use kandy.addressbook.retrieveUserDeviceAddressBook');
        return api.addressbook.retrieveUserDeviceAddressBook.apply(null, arguments);
    };


    return api;
}));