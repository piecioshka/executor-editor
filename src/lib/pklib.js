/**
 * pklib JavaScript library v1.1.1
 *
 * Copyright (c) 2012 Piotr Kowalski, http://pklib.com/
 *
 * MIT License
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 * http://www.opensource.org/licenses/mit-license.php
 *
 * Date: Sat Sep 22 16:01:17 CEST 2012
 */

/*jslint plusplus: true, regexp: true */
/*global window, document, XMLHttpRequest, ActiveXObject, setInterval, clearInterval, setTimeout */

var pklib;
pklib = (function () {
    "use strict";

    /**
     * Global object, contain modules
     * @namespace
     * @type {Object}
     */
    return {
        author: "Piotr Kowalski",
        www: "http://pklib.com/",
        version: "1.1.0"
    };
}());

if (typeof Function.prototype.bind !== "function") {
    /**
     * Creates a new function that, when called, itself calls this function in the context of the provided this value,
     * with a given sequence of arguments preceding any provided when the new function was called.
     *
     * <pre>
     * Method of "Function"
     * Implemented in	JavaScript 1.8.5
     * ECMAScript Edition	ECMAScript 5th Edition
     * </pre>
     *
     * @param {*} that Context
     * @returns {Function}
     */
    Function.prototype.bind = function (that) {
        "use strict";

        var method = this,
            slice = Array.prototype.slice,
            args = slice.apply(arguments, [1]);

        return function () {
            return method.apply(that, args.concat(slice.apply(arguments, [0])));
        };
    };
}
/**
 * @package pklib.ajax
 * @dependence pklib.array, pklib.common
 */

/**
 * Service to send request to server.
 * With first param, which is hashmap, define params, ex. request url
 * @namespace
 */
pklib.ajax = (function () {
    "use strict";

    var /**
         * Default time what is timeout to use function pklib.ajax
         *
         * @private
         * @constant
         * @type {Number}
         */
            DEFAULT_TIMEOUT_TIME = 30000,

        /**
         * @private
         * @constant
         * @type {Number}
         */
            REQUEST_STATE_UNSENT = 0,

    // REQUEST_STATE_OPENED = 1,
    // REQUEST_STATE_HEADERS_RECEIVED = 2,
    // REQUEST_STATE_LOADING = 3,
        /**
         * @private
         * @constant
         * @type {Number}
         */
            REQUEST_STATE_DONE = 4,

        /**
         * Array contain key as url, value as ajax response
         *
         * @private
         * @type {Array}
         */
            cache = [];

    /**
     * When success request
     *
     * @private
     * @function
     * @param {Object} settings
     * @param {XMLHttpRequest} xhr
     */
    function success_handler(settings, xhr) {
        var contentType,
            xmlContentType = ["application/xml", "text/xml"],
            property = "responseText";

        if (settings.cache) {
            cache[settings.url] = xhr;
        }

        contentType = xhr.getResponseHeader("Content-Type");

        if (pklib.array.in_array(contentType, xmlContentType)) {
            property = "responseXML";
        }

        settings.done.call(null, xhr[property]);

        // clear memory
        xhr = null;
    }

    /**
     * When error request
     *
     * @private
     * @function
     * @param {Object} settings
     * @param {XMLHttpRequest} xhr
     */
    function error_handler(settings, xhr) {
        xhr.error = true;
        settings.error.call(null, settings, xhr);
    }

    /**
     * Use when state in request is changed or if used cache is handler to request.
     *
     * @private
     * @function
     * @param {Object} settings
     * @param {XMLHttpRequest} xhr
     */
    function handler(settings, xhr) {
        var status = 0;

        if (xhr.readyState === REQUEST_STATE_DONE) {
            if (xhr.status !== undefined) {
                status = xhr.status;
            }

            if ((status >= 200 && status < 300) || status === 304) {
                // success
                success_handler(settings, xhr);
            } else {
                // error
                error_handler(settings, xhr);
            }
        }
    }

    /**
     * Handler to unusually situation - timeout.
     *
     * @private
     * @function
     * @param {Object} settings
     * @param {XMLHttpRequest} xhr
     * @throws {Error} If exists timeout on request
     */
    function timeout_handler(settings, xhr) {
        // clear memory
        xhr = null;
        // throw exception
        throw new Error("pklib.ajax.load: timeout on url: " + settings.url);
    }

    /**
     * Method use when request has timeout
     *
     * @private
     * @function
     * @param {Object} settings
     * @param {XMLHttpRequest} xhr
     * @throws {Error} If exists timeout on request
     */
    function request_timeout(settings, xhr) {
        if (xhr.aborted === undefined &&
            xhr.error === undefined &&
            xhr.readyState === REQUEST_STATE_DONE &&
            xhr.status === REQUEST_STATE_UNSENT) {
            xhr.abort();
            timeout_handler.call(null, settings, xhr);
        }
    }

    /**
     * Try to create Internet Explorer XMLHttpRequest
     *
     * @private
     * @function
     * @throws {Error} If can not create XMLHttpRequest object
     * @returns {ActiveXObject|Undefined}
     */
    function create_microsoft_xhr() {
        var xhr;
        try {
            xhr = new ActiveXObject("Msxml2.XMLHTTP");
        } catch (ignore) {
            try {
                xhr = new ActiveXObject("Microsoft.XMLHTTP");
            } catch (ignored) {
                throw new Error("pklib.ajax.load: can't create XMLHttpRequest object");
            }
        }
        return xhr;
    }

    /**
     * Try to create XMLHttpRequest
     *
     * @private
     * @function
     * @throws {Error} If can not create XMLHttpRequest object
     * @returns {XMLHttpRequest|Undefined}
     */
    function create_xhr() {
        var xhr;
        try {
            xhr = new XMLHttpRequest();
        } catch (ignore) {
            xhr = create_microsoft_xhr();
        }
        return xhr;
    }

    /**
     * Add headers to xhr object
     *
     * @private
     * @function
     * @param {Object} settings
     * @param {XMLHttpRequest} xhr
     */
    function add_headers_to_xhr(settings, xhr) {
        var header,
            headers = settings.headers;

        if (headers !== null) {
            for (header in headers) {
                if (headers.hasOwnProperty(header)) {
                    xhr.setRequestHeader(header, headers[header]);
                }
            }
        }
    }

    /**
     * Add timeout service to xhr object
     *
     * @private
     * @function
     * @param {Object} settings
     * @param {XMLHttpRequest} xhr
     */
    function add_timeout_service_to_xhr(settings, xhr) {
        if (typeof xhr.ontimeout === "function") {
            xhr.ontimeout = timeout_handler.bind(null, settings, xhr);
        } else {
            pklib.common.defer(request_timeout.bind(null, settings, xhr), settings.timeout);
        }
    }

    /**
     * Add error service to xhr object
     *
     * @private
     * @function
     * @param {Object} settings
     * @param {XMLHttpRequest} xhr
     */
    function add_error_service_to_xhr(settings, xhr) {
        xhr.onerror = function () {
            error_handler(settings, xhr);
        };
    }

    /**
     * Check is response on this request is in cache
     *
     * @private
     * @function
     * @param {Object} settings
     * @returns {Boolean}
     */
    function is_response_in_cache(settings) {
        return settings.cache && cache[settings.url];
    }

    /**
     * Return object what is default configuration of request
     *
     * @private
     * @function
     * @returns {Object} Default configuration
     */
    function get_default_settings() {
        /**
         * Request settings, contain ex. headers, callback when run after request finish.
         * Default timeout on request is 30 seconds. This is default timeout from popular web servers
         * ex. Apache, ngninx.
         * Default request hasn't any headers.
         * Default cache is disabled.
         * Default asynchronous is enable.
         */
        return {
            type: "get",
            async: true,
            cache: false,
            url: null,
            params: null,
            timeout: DEFAULT_TIMEOUT_TIME,
            headers: {},
            /**
             * Function run after request ended
             * In params exists only: response
             */
            done: function () {
                // do something when success request
            },
            error: function () {
                // do something when appear error in request
            }
        };
    }

    /**
     * Check url in request is defined.
     * Throw error if is undefined
     *
     * @private
     * @function
     * @param {Object} settings
     * @throws {Error} If unset request url
     */
    function check_if_url_is_defined(settings) {
        pklib.common.assert(settings.url !== null, "pklib.ajax.load: undefined request url");
    }

    // public API
    return {
        /**
         * Send request to server on url defined in config.url.
         * Method throw exception when request have timeout on server or if url is not set.
         * Also, every response (if config.cache is true) saved to hashmap by key config.url.
         * Method on first try to can create XMLHttpRequest if browser doesn't support, check
         * if browser support object ActiveXObject which is implemented in Internet Explorer.
         *
         * @memberOf pklib.ajax
         * @function
         * @param {Object} config
         * <pre>
         * {
         *      {String} [type="get"]
         *      {Boolean} [async=true]
         *      {Boolean} [cache=false]
         *      {String} url
         *      {Object} [params]
         *      {Object} [headers]
         *      {Function} [done]
         *      {Function} [error]
         * }
         * </pre>
         * @example
         * <pre>
         * pklib.ajax.load({
         *      type: "post",
         *      async: false,
         *      cache:  true,
         *      url: "http://example.org/check-item.php",
         *      params: {
         *          id: 33
         *      },
         *      headers: {
         *          "User-Agent": "tv"
         *      },
         *      done: function (res) {
         *          // pass
         *      }
         * });
         * </pre>
         * @throws {Error} If unset request url
         * @returns {XMLHttpRequest|Null}
         */
        load: function (config) {
            var xhr = null,
                settings = get_default_settings();

            settings = pklib.object.mixin(settings, config);
            settings.type = settings.type.toUpperCase();

            check_if_url_is_defined(settings);

            if (is_response_in_cache(settings)) {
                handler.call(null, settings, cache[settings.url]);
            } else {
                xhr = create_xhr();
                xhr.onreadystatechange = handler.bind(null, settings, xhr);
                xhr.open(settings.type, settings.url, settings.async);

                add_headers_to_xhr(settings, xhr);

                add_timeout_service_to_xhr(settings, xhr);
                add_error_service_to_xhr(settings, xhr);
                xhr.send(settings.params);
            }
            return xhr;
        },

        /**
         * Stop request setting in param
         *
         * @memberOf pklib.ajax
         * @function
         * @param {XMLHttpRequest|ActiveXObject} xhr XMLHttpRequest object, or ActiveXObject object if Internet Explorer
         */
        stop: function (xhr) {
            xhr.abort();
            xhr.aborted = true;
            // clear memory
            xhr = null;
        }
    };
}());
/**
 * @package pklib.array
 */

/**
 * Module to service array object
 * @namespace
 */
pklib.array = (function () {
    "use strict";

    /**
     * Check if param is array
     *
     * @private
     * @function
     * @param {Object} array
     * @returns {Boolean}
     */
    function is_array(array) {
        try {
            pklib.common.assert(typeof array === "object" &&
                array !== null &&
                array.length !== undefined &&
                array.slice !== undefined);
            return true;
        } catch (ignore) {
            return false;
        }
    }

    /**
     * Check if element is in array by loop
     *
     * @private
     * @function
     * @param {Object} param
     * @param {Array} array
     * @returns {Boolean}
     */
    function in_array(param, array) {
        var i, len = array.length;
        for (i = 0; i < len; ++i) {
            if (array[i] === param) {
                return true;
            }
        }
        return false;
    }

    /**
     * Get index of element.
     * If couldn't find searching element, return null value
     *
     * @private
     * @function
     * @param {Object} item
     * @param {Array} array
     * @returns {Number|Null}
     */
    function index(item, array) {
        var i, len = array.length;
        for (i = 0; i < len; ++i) {
            if (array[i] === item) {
                return i;
            }
        }
        return null;
    }

    /**
     * Unique array. Delete element what was duplicated
     *
     * @private
     * @function
     * @param {Array} array
     * @returns {Array}
     */
    function unique(array) {
        var i, item, temp = [],
            len = array.length;

        for (i = 0; i < len; ++i) {
            item = array[i];
            if (!pklib.array.in_array.call(null, item, temp)) {
                temp.push(item);
            }
        }
        return temp;
    }

    /**
     * Remove element declared in infinity params without first.
     * First parameter is array object
     *
     * @private
     * @function
     * @param {Array} array
     * @returns {Array}
     */
    function remove(array) {
        var i, param,
            params = Array.prototype.slice.call(arguments, 1),
            len = params.length;

        for (i = 0; i < len; ++i) {
            param = params[i];
            if (pklib.array.in_array(param, array)) {
                array.splice(pklib.array.index(param, array), 1);
            }
        }
        return array;
    }

    // public API
    return {
        is_array: is_array,
        in_array: in_array,
        index: index,
        unique: unique,
        remove: remove
    };
}());
/**
 * @package pklib.aspect
 */

/**
 * Bind function to aspect.
 * Create method with merge first and second.
 * Second method is run after first
 *
 * @function
 * @param {Function} fun The function to bind aspect function
 * @param {Function} asp The aspect function
 * @param {String} [when="before"] Place to aspect function
 * @throws {TypeError} If any param is not function
 * @returns {Function}
 */
pklib.aspect = function (fun, asp, when) {
    "use strict";

    var that = this,
        result;

    pklib.common.assert(typeof fun === "function", "pklib.aspect: @func: not {Function}");
    pklib.common.assert(typeof asp === "function", "pklib.aspect: @asp: not {Function}");

    when = when || "before";

    return function () {
        if (when === "before") {
            asp.call(that);
        }

        result = fun.apply(that, arguments);

        if (when === "after") {
            result = asp.call(that);
        }
        return result;
    };
};
/**
 * @package pklib.browser
 */

/**
 * Get best information about browser
 * @namespace
 */
pklib.browser = (function (global) {
    "use strict";

    /**
     * Array with browsers name
     *
     * @private
     * @type {Array}
     */
    var browsers = ["msie", "chrome", "safari", "opera", "mozilla", "konqueror"];

    /**
     * Get browser name by checking userAgent in global object navigator
     *
     * @private
     * @function
     * @returns {String}
     */
    function get_name() {
        var i, browser,
            len = browsers.length,
            userAgent = global.navigator.userAgent.toLowerCase();

        for (i = 0; i < len; ++i) {
            browser = browsers[i];
            if (new RegExp(browser).test(userAgent)) {
                return browser;
            }
        }
        return null;
    }

    /**
     * Get browser version by checking userAgent.
     * Parse userAgent to find next 3 characters
     *
     * @private
     * @function
     * @returns {String|Null}
     */
    function get_version() {
        var i, len = browsers.length, browser, cur,
            user_agent = global.navigator.userAgent.toLowerCase();

        for (i = 0; i < len; ++i) {
            browser = browsers[i];
            cur = user_agent.indexOf(browser);
            if (cur !== -1) {
                return user_agent.substr(cur + len + 1, 3);
            }
        }
        return null;
    }

    // public API
    return {
        get_name: get_name,
        get_version: get_version
    };
}(this));
/**
 * @package pklib.common
 */

/**
 * Common stuff
 * @namespace
 */
pklib.common = (function () {
    "use strict";

    /**
     * Basic test function. Simple assertion 2 variables
     *
     * @private
     * @function
     * @param {Object} expression Object what is true
     * @param {String} comment Message to throw in error
     * @throws {Error}
     */
    function assert(expression, comment) {
        if (expression !== true) {
            throw new Error(comment);
        }
    }

    /**
     * Deferred function about some milliseconds.
     * If milliseconds is 0 that it's hack for some platforms to use function in "next" thread
     *
     * @private
     * @function
     * @param {Function} defer_function Function what would be deferred
     * @param {Number} milliseconds Time to deferred function
     */
    function defer(defer_function, milliseconds) {
        milliseconds = milliseconds || 0;
        setTimeout(defer_function, milliseconds);
    }

    /**
     * Interval checking first function until returns true,
     * run after this second function callback
     *
     * @private
     * @param {Function} condition Function returns {Boolean} status
     * @param {Function} callback
     */
    function checking(condition, callback) {
        var interval,
            interval_time = 100;

        pklib.common.assert(typeof condition === "function", "pklib.common.checking: @condition: not {Function}");
        pklib.common.assert(typeof callback === "function", "pklib.common.checking: @callback: not {Function}");

        if (condition()) {
            callback();
        } else {
            interval = setInterval(function () {
                if (condition()) {
                    clearInterval(interval);
                    callback();
                }
            }, interval_time);
        }
    }

    // public API
    return {
        assert: assert,
        defer: defer,
        checking: checking
    };
}());
/**
 * @package pklib.cookie
 */

/**
 * Cookie service manager
 * @namespace
 */
pklib.cookie = (function () {
    "use strict";

    /**
     * Read cookie by it name
     *
     * @private
     * @function
     * @param {String} name
     * @returns {String|Null}
     */
    function get_cookie(name) {
        if (name === undefined) {
            return null;
        }
        name += "=";
        var i, c,
            ca = document.cookie.split(";"),
            len = ca.length;

        for (i = 0; i < len; ++i) {
            c = ca[i];
            while (c.charAt(0) === " ") {
                c = c.substring(1, c.length);
            }
            if (c.indexOf(name) === 0) {
                return decodeURIComponent(c.substring(name.length, c.length));
            }
        }
        return null;
    }

    /**
     * Create cookie file with name, value and day expired
     *
     * @private
     * @function
     * @param {String} name
     * @param {String} value
     * @param {Number} days
     * @returns {String}
     */
    function create_cookie(name, value, days) {
        var expires = "",
            date = new Date();

        value = value || null;

        if (days !== undefined) {
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toGMTString();
        }

        document.cookie = name + "=" + encodeURIComponent(value) + expires + "; path=/";

        return get_cookie(name);
    }

    /**
     * Delete cookie by it name
     *
     * @private
     * @function
     * @param {String} name
     * @returns {String}
     */
    function remove_cookie(name) {
        return create_cookie(name, undefined, -1);
    }

    // public API
    return {
        create: create_cookie,
        get: get_cookie,
        remove: remove_cookie
    };
}());
/**
 * @package pklib.css
 * @dependence pklib.string. pklib.dom
 */

/**
 * Utils method related css on tags in DOM tree
 * @namespace
 */
pklib.css = (function () {
    "use strict";

    /**
     * RegExp use to delete white chars
     *
     * @private
     * @type {RegExp}
     */
    var rclass = /[\n\t\r]/g;

    /**
     * Check typeof params
     *
     * @private
     * @function
     * @param {String} css_class
     * @param {HTMLElement} element
     * @throws {TypeError} If first param is not string, or second param is not Node
     */
    function check_params(css_class, element, call_func_name) {
        var prefix = "pklib.css." + call_func_name;
        pklib.common.assert(typeof css_class === "string", prefix + ": @css_class: not {String}");
        pklib.common.assert(pklib.dom.is_element(element), prefix + ": @element: not {HTMLElement}");
    }

    /**
     * Add CSS class to element define in second parameter
     *
     * @private
     * @function
     * @param {String} css_class
     * @param {HTMLElement} element
     * @throws {TypeError} If first param is not string, or second param is not Node
     */
    function add_class(css_class, element) {
        check_params(css_class, element, "add_class");
        var class_element = element.className;
        if (!pklib.css.has_class(css_class, element)) {
            if (class_element.length) {
                class_element += " " + css_class;
            } else {
                class_element = css_class;
            }
        }
        element.className = class_element;
    }

    /**
     * Remove CSS class from element define in second parameter
     *
     * @private
     * @function
     * @param {String} css_class
     * @param {HTMLElement} element
     * @throws {TypeError} If first param is not string, or second param is not Node
     */
    function remove_class(css_class, element) {
        check_params(css_class, element, "remove_class");
        var regexp = new RegExp("(\\s" + css_class + ")|(" + css_class + "\\s)|" + css_class, "i");
        element.className = pklib.string.trim(element.className.replace(regexp, ""));
    }

    /**
     * Check if element has CSS class
     *
     * @private
     * @function
     * @param {String} css_class
     * @param {HTMLElement} element
     * @throws {TypeError} If first param is not string, or second param is not Node
     * @returns {Boolean}
     */
    function has_class(css_class, element) {
        check_params(css_class, element, "has_class");
        var className = " " + css_class + " ";
        return ((" " + element.className + " ").replace(rclass, " ").indexOf(className) > -1);
    }

    // public API
    return {
        add_class: add_class,
        remove_class: remove_class,
        has_class: has_class
    };
}());
/**
 * @package pklib.date
 */

/**
 * Utils stack to Date object
 * @namespace
 */
pklib.date = (function () {
    "use strict";

    return {
        /**
         * Simple return month in string and file 0 at first place if month smaller than 10
         *
         * @private
         * @function
         * @returns {String}
         */
        get_full_month: function () {
            var month = (parseInt(new Date().getMonth(), 10) + 1);

            if (month < 10) {
                month = "0" + month;
            }

            return String(month);
        }
    };
}());
/**
 * @package pklib.dom
 * @dependence pklib.browser, pklib.css, pklib.string, pklib.utils
 */

/**
 * Helper related with DOM service
 * @namespace
 */
pklib.dom = (function () {
    "use strict";

    /**
     * Types of all available node
     */
    var node_types = {
        "ELEMENT_NODE": 1,
        "ATTRIBUTE_NODE": 2,
        "TEXT_NODE": 3,
        "CDATA_SECTION_NODE": 4,
        "ENTITY_REFERENCE_NODE": 5,
        "ENTITY_NODE": 6,
        "PROCESSING_INSTRUCTION_NODE": 7,
        "COMMENT_NODE": 8,
        "DOCUMENT_NODE": 9,
        "DOCUMENT_TYPE_NODE": 10,
        "DOCUMENT_FRAGMENT_NODE": 11,
        "NOTATION_NODE": 12
    };

    /**
     * Walking on every node in node
     *
     * @private
     * @function
     * @param {HTMLElement} node
     * @param {Function} func Run on every node
     */
    function walk_the_dom(node, func) {
        if (!!node) {
            func(node);
            node = node.firstChild;
            while (node) {
                walk_the_dom(node, func);
                node = node.nextSibling;
            }
        }
    }

    /**
     * Check if param is Node, with use assertions
     *
     * @private
     * @function
     * @param {Node} node
     * @returns {String}
     */
    function is_node(node) {
        try {
            pklib.common.assert(Boolean(node && node.nodeType && node.nodeName));
            pklib.common.assert(Object.prototype.toString.call(node) === "[object Node]");
            return true;
        } catch (ignore) {
            return false;
        }
    }

    /**
     * Check if param is NodeList, with use assertions
     *
     * @private
     * @function
     * @param {NodeList} node_list
     * @returns {String}
     */
    function is_node_list(node_list) {
        try {
            var to_string = Object.prototype.toString.call(node_list),
                list = ["[object HTMLCollection]", "[object NodeList]"];

            pklib.common.assert(pklib.array.in_array(to_string, list));
            return true;
        } catch (ignore) {
            return false;
        }
    }

    /**
     * Check if param is instanceOf Element
     *
     * @private
     * @function
     * @param {HTMLElement} node
     * @returns {String}
     */
    function is_element(node) {
        return (node && node.nodeType === node_types.ELEMENT_NODE) || false;
    }

    /**
     * Check visibility of Node, with use assertions
     *
     * @private
     * @function
     * @param {HTMLElement} node
     * @returns {Boolean}
     */
    function is_visible(node) {
        pklib.common.assert(pklib.dom.is_element(node), "pklib.dom.is_visible: @node is not HTMLElement");

        return node.style.display !== "none" &&
            node.style.visibility !== "hidden" &&
            node.offsetWidth !== 0 &&
            node.offsetHeight !== 0;
    }

    /**
     * Get element by attribute ID
     *
     * @private
     * @function
     * @param {String} id
     * @returns {HTMLElement|Null}
     */
    function by_id(id) {
        return document.getElementById(id);
    }

    /**
     * Get elements by tag name
     *
     * @private
     * @function
     * @param {String} tag
     * @param {Element} element
     * @returns {NodeList}
     */
    function by_tag(tag, element) {
        element = element || document;
        return element.getElementsByTagName(tag);
    }

    /**
     * Get elements by attribute CLASS
     *
     * @private
     * @function
     * @param {String} css_class
     * @param {HTMLElement} wrapper
     * @returns {NodeList|Array}
     */
    function by_class(css_class, wrapper) {
        var results;

        wrapper = wrapper || document;

        if (wrapper.getElementsByClassName) {
            results = wrapper.getElementsByClassName(css_class);
        } else {
            results = [];
            walk_the_dom(wrapper, function (node) {
                if (pklib.dom.is_element(node) && pklib.css.has_class(css_class, node)) {
                    results.push(node);
                }
            });
        }
        return results;
    }

    /**
     * Get index of node relative siblings
     *
     * @private
     * @function
     * @param {HTMLElement} node
     * @returns {Number|Null}
     */
    function index(node) {
        var i,
            parent = pklib.dom.parent(node),
            childs = pklib.dom.children(parent),
            len = childs.length;

        for (i = 0; i < len; ++i) {
            if (childs[i] === node) {
                return i;
            }
        }
        return null;
    }

    /**
     * Get children of element filter by Element type
     *
     * @private
     * @function
     * @param {HTMLElement} node
     * @returns {Array}
     */
    function children(node) {
        var i,
            array = [],
            childs = node.childNodes,
            len = childs.length;

        for (i = 0; i < len; ++i) {
            if (pklib.dom.is_element(childs[i])) {
                array.push(childs[i]);
            }
        }
        return array;
    }

    /**
     * Insert data to Node. Maybe param is string so insert will be exec by innerHTML,
     * but if param is Node inserting will be by appendChild() function
     *
     * @private
     * @function
     * @param {HTMLElement|String} element
     * @param {HTMLElement} node
     * @returns {HTMLElement}
     */
    function insert(element, node) {
        if (pklib.dom.is_element(element)) {
            node.appendChild(element);
        } else if (pklib.string.is_string(element)) {
            node.innerHTML += element;
        }
        return element;
    }

    /**
     * Remove Element specified in params
     *
     * @private
     * @function
     * @param {HTMLElement}
        */
    function remove() {
        var i, node = null, parent = null,
            args = Array.prototype.slice.call(arguments),
            len = args.length;

        for (i = 0; i < len; ++i) {
            node = args[i];
            if (pklib.dom.is_element(node)) {
                parent = node.parentNode;
                parent.removeChild(node);
            }
        }
    }

    /**
     * Get prev Node what will be Element
     *
     * @private
     * @function
     * @param {HTMLElement} node
     * @returns {HTMLElement|Null}
     */
    function prev(node) {
        var pNode;
        while (true) {
            pNode = node.previousSibling;
            if (pNode !== undefined &&
                pNode !== null &&
                pNode.nodeType !== node_types.ELEMENT_NODE) {
                node = pNode;
            } else {
                break;
            }
        }
        return pNode;
    }

    /**
     * Get next Node what will be Element
     *
     * @private
     * @function
     * @param {HTMLElement} node
     * @returns {HTMLElement|Null}
     */
    function next(node) {
        var nNode;
        while (true) {
            nNode = node.nextSibling;
            if (nNode !== undefined &&
                nNode !== null &&
                nNode.nodeType !== node_types.ELEMENT_NODE) {
                node = nNode;
            } else {
                break;
            }
        }
        return nNode;
    }

    /**
     * Get parent element what will by Element, but if parent is not exists returns Null
     *
     * @private
     * @function
     * @param {HTMLElement} node
     * @returns {HTMLElement|Null}
     */
    function parent(node) {
        var prNode;
        while (true) {
            prNode = node.parentNode;
            if (prNode !== undefined &&
                prNode !== null &&
                prNode.nodeType !== node_types.ELEMENT_NODE) {
                node = prNode;
            } else {
                break;
            }
        }
        return prNode;
    }

    // public API
    return {
        is_node: is_node,
        is_node_list: is_node_list,
        is_element: is_element,
        is_visible: is_visible,
        by_id: by_id,
        by_tag: by_tag,
        by_class: by_class,
        index: index,
        children: children,
        insert: insert,
        remove: remove,
        prev: prev,
        next: next,
        parent: parent
    };
}());
/**
 * @package pklib.event
 */

/**
 * Helper about manage event on HTMLElement
 * @namespace
 */
pklib.event = (function () {
    "use strict";

    /**
     * Add event to Element
     *
     * @private
     * @function
     * @param {HTMLElement} target
     * @param {String} event_name
     * @param {Function} handler
     */
    function add_event(target, event_name, handler) {
        if (target.events === undefined) {
            target.events = {};
        }

        var event = target.events[event_name];

        if (event === undefined) {
            target.events[event_name] = [];
        }

        target.events[event_name].push(handler);

        if (target.attachEvent) {
            // IE browser
            target.attachEvent("on" + event_name, handler);
        } else if (target.addEventListener) {
            // other browser
            target.addEventListener(event_name, handler, false);
        } else {
            // for very old browser
            target["on" + event_name] = handler;
        }
    }

    /**
     * Remove event from Element
     *
     * @private
     * @function
     * @param {HTMLElement} target
     * @param {String} event_name
     */
    function remove_event(target, event_name) {
        var removeEvent, events, len, i, handler;

        if (target.events === undefined) {
            target.events = {};
        }

        if (target.detachEvent) {
            // IE browser
            removeEvent = "detachEvent";
        } else if (target.removeEventListener) {
            // other browser
            removeEvent = "removeEventListener";
        }

        if (removeEvent === undefined) {
            // for old browser
            delete target["on" + event_name];
        } else {
            events = target.events[event_name];

            if (events !== undefined) {
                len = events.length;

                for (i = 0; i < len; ++i) {
                    handler = events[i];
                    target[removeEvent](event_name, handler);
                    delete target.events[event_name];
                }
            }
        }
    }

    /**
     * Get array with events with concrete name
     *
     * @private
     * @function
     * @param {HTMLElement} target
     * @param {String} event_name
     * @returns {Array|Undefined}
     */
    function get_event(target, event_name) {
        if (target.events === undefined) {
            target.events = {};
        }
        return target.events[event_name];
    }

    /**
     * Run events on Element
     *
     * @private
     * @function
     * @param {HTMLElement} target
     * @param {String} event_name
     */
    function trigger(target, event_name) {
        var events, len, i;

        if (target.events === undefined) {
            target.events = {};
        }

        events = target.events[event_name];

        if (events !== undefined) {
            len = events.length;

            for (i = 0; i < len; ++i) {
                events[i].call(target, events[i]);
            }
        }
    }

    // public API
    return {
        add: add_event,
        remove: remove_event,
        get: get_event,
        trigger: trigger
    };
}());
/**
 * @package pklib.file, pklib.string
 */

/**
 * JS file loader
 * @namespace
 */
pklib.file = (function () {
    "use strict";

    /**
     * @private
     * @type {Array}
     */
    var copy_files = [];

    /**
     * @private
     * @function
     * @param {String} url
     * @param {Function} callback
     */
    function simple_load_js(url, callback) {
        /**
         * Create HTMLElement <script>
         */
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.src = url;

        if (script.readyState === undefined) {
            /**
             * Method run when request has ended
             * @memberOf script
             * @function
             */
            script.onload = function () {
                if (typeof callback === "function") {
                    callback(script);
                }
            };
        } else {
            /**
             * Method run when request has change state
             * @memberOf script
             * @function
             */
            script.onreadystatechange = function () {
                if (script.readyState === "loaded" || script.readyState === "complete") {
                    script.onreadystatechange = null;
                    if (typeof callback === "function") {
                        callback(script);
                    }
                }
            };
        }

        if (document.head === undefined) {
            document.head = document.getElementsByTagName("head")[0];
        }

        document.head.appendChild(script);
    }

    /**
     * Load JS files. Url to files could be with path absolute or not.
     * If you must load more than 1 file use array, to set url to files
     *
     * @private
     * @function
     * @param {String|Array} files
     * @param {Function} callback
     */
    function load_js_file(files, callback) {
        var file;

        if (typeof files === "string") {
            file = files;
            simple_load_js(file, function (script) {
                if (typeof callback === "function") {
                    callback(script);
                }
            });
        } else if (pklib.array.is_array(files)) {
            if (!copy_files.length) {
                copy_files = pklib.object.mixin(copy_files, files);
            }

            file = files.shift();

            if (file === undefined) {
                if (typeof callback === "function") {
                    callback({
                        src: copy_files[copy_files.length - 1]
                    });

                    copy_files = [];
                }
            } else {
                simple_load_js(file, function () {
                    load_js_file(files, callback);
                });
            }
        } else {
            throw new TypeError("pklib.file.loadjs: @files not {String} or {Array}");
        }
    }

    // public API
    return {
        loadjs: load_js_file
    };
}());
/**
 * @package pklib.object
 */

/**
 * Module to service object
 * @namespace
 */
pklib.object = (function () {
    "use strict";

    /**
     * Check if param is object
     *
     * @private
     * @function
     * @param {Object} obj
     * @returns {Boolean}
     */
    function is_object(obj) {
        return obj && typeof obj === "object" &&
            typeof obj.hasOwnProperty === "function" &&
            typeof obj.isPrototypeOf === "function" &&
            obj.length === undefined;
    }

    /**
     * Mix two params, from second to first param. Return first param mixin with second param
     *
     * @private
     * @function
     * @param {Array|Object} target
     * @param {Array|Object} source
     * @returns {Array}
     */
    function mixin(target, source) {
        var i, len, element, item;

        if (pklib.array.is_array(target) && pklib.array.is_array(source)) {
            len = source.length;
            for (i = 0; i < len; ++i) {
                element = source[i];
                if (!pklib.array.in_array(element, target)) {
                    target.push(element);
                }
            }
            target.sort();
        } else {
            for (item in source) {
                if (source.hasOwnProperty(item)) {
                    if (pklib.object.is_object(target[item])) {
                        target[item] = pklib.object.mixin(target[item], source[item]);
                    } else {
                        target[item] = source[item];
                    }
                }
            }
        }
        return target;
    }

    // public API
    return {
        is_object: is_object,
        mixin: mixin
    };
}());

/**
 * @package pklib.profiler
 */

/**
 * Time analyzer
 * @namespace
 */
pklib.profiler = (function () {
    "use strict";

    /**
     * @namespace
     * @type {Object}
     */
    var data = {};

    /**
     * @private
     * @function
     * @param {String} name
     * @returns {Number}
     */
    function start(name) {
        data[name] = new Date();
        return data[name];
    }

    /**
     * @private
     * @function
     * @param {String} name
     * @returns {Number}
     */
    function stop(name) {
        data[name] = new Date() - data[name];
        return new Date((new Date()).getTime() + data[name]);
    }

    /**
     * @private
     * @function
     * @param {String} name
     * @returns {Number}
     */
    function get_time(name) {
        return data[name];
    }

    // public API
    return {
        start: start,
        stop: stop,
        get_time: get_time
    };
}());

/**
 * @package pklib.string
 */

/**
 * String service manager
 * @namespace
 */
pklib.string = (function () {
    "use strict";

    /**
     * @private
     * @function
     * @param {String} source
     * @returns {Boolean}
     */
    function is_string(source) {
        return typeof source === "string";
    }

    /**
     * @private
     * @function
     * @param {String} source
     * @returns {Boolean}
     */
    function is_letter(source) {
        return pklib.string.is_string(source) && /^[a-zA-Z]$/.test(source);
    }

    /**
     * @private
     * @function
     * @param {String} source
     * @returns {String}
     */
    function trim(source) {
        return source.replace(/^\s+|\s+$/g, "");
    }

    /**
     * @private
     * @function
     * @param {String} source
     * @returns {String}
     */
    function slug(source) {
        var result = source.toLowerCase().replace(/\s/mg, "-");
        result = result.replace(/[^a-zA-Z0-9\-]/mg, function (ch) {
            switch (ch.charCodeAt(0)) {
                case 261:
                    return String.fromCharCode(97);
                case 281:
                    return String.fromCharCode(101);
                case 243:
                    return String.fromCharCode(111);
                case 347:
                    return String.fromCharCode(115);
                case 322:
                    return String.fromCharCode(108);
                case 378:
                case 380:
                    return String.fromCharCode(122);
                case 263:
                    return String.fromCharCode(99);
                case 324:
                    return String.fromCharCode(110);
                default:
                    return "";
            }
        });
        return result;
    }

    /**
     * @private
     * @function
     * @param {String} source
     * @returns {String}
     */
    function capitalize(source) {
        return source.substr(0, 1).toUpperCase() + source.substring(1, source.length).toLowerCase();
    }

    /**
     * @private
     * @function
     * @param {String} source
     * @returns {String}
     */
    function delimiter_separated_words(source) {
        return source.replace(/[A-ZĘÓĄŚŁŻŹĆŃ]/g, function (match) {
            return "-" + match.toLowerCase();
        });
    }

    /**
     * @private
     * @function
     * @param {String} source
     * @returns {String}
     */
    function strip_tags(source) {
        pklib.common.assert(typeof source === "string", "pklib.string.strip_tags: param @source is not a string");
        if (source && source.length !== 0) {
            var dummy = document.createElement("div");
            dummy.innerHTML = source;
            return dummy.textContent || dummy.innerText;
        }
        return source;
    }

    /**
     * @private
     * @function
     * @param {String} source
     * @returns {String}
     */
    function camel_case(source) {
        while (source.indexOf("-") !== -1) {
            var pos = source.indexOf("-"),
                pre = source.substr(0, pos),
                sub = source.substr(pos + 1, 1).toUpperCase(),
                post = source.substring(pos + 2, source.length);
            source = pre + sub + post;
        }
        return source;
    }

    /**
     * @private
     * @function
     * @param {String} source Text to slice
     * @param {Number} length Number of chars what string will be slice
     * @param {Boolean} [is_force] Force mode. If slice will be end in middle of word, use this to save it, or algorytm slice to last space
     * @returns {String}
     */
    function slice(source, length, is_force) {
        pklib.common.assert(typeof source === "string", "pklib.string.slice: param @source is not a string");

        // jeśli długość przycinania jest wiąksza niż długość całego tekstu
        // to zwracamy przekazany tekst
        if (source.length < length) {
            return source;
        }

        // ucinamy tyle tekstu ile jest wskazane w parametrze length
        var text = source.slice(0, length), last_space;

        // sprawdzamy czy nie ucieliśmy w połowie wyrazu:
        // * tj. czy kolejnym znakiem nie jest spacja
        if (source[length] === " ") {
            return text + "...";
        }

        // * ostatnim znakiem w uciętym tekście jest spacja
        if (text[length - 1] === " ") {
            return pklib.string.trim(text) + "...";
        }

        // jesli nie ma wymuszenia przycinania wyrazu w jego części 
        // to sprawdzamy czy możemy przyciąć do ostatniej spacji w przycietym tekście
        if (!is_force) {
            // niestety ucieliśmy tekst w połowie wyrazu
            // postępujemy zgodnie z intrukcja, że odnajdujemy ostatnią spację
            // i obcinamy fraze do tej spacji 
            last_space = text.lastIndexOf(" ");

            // spacja została znaleziona, więc przycinamy frazę do spacji
            if (last_space !== -1) {
                return text.slice(0, last_space) + "...";
            }
        }

        // włączony tryb "force" albo spacja nie została odnaleziona więc aby nie zwracać 
        // w pustej wartości, ucinamy wyraz w tym miejscu w którym jest
        return text + "...";
    }

    /**
     * Replace tags in string to defined data
     * Tags:
     * ${NAME} - replace by value of object["NAME"]
     *
     * @private
     * @function
     * @param {String} str Some string to replace by objects
     * @param {Object} obj Object what will serve data to replacer
     *
     * @example.
     *
     * In:
     * %{car} is the best!
     *
     * Run:
     * pklib.string.format("%{car} is the best", { car: "Ferrari" });
     *
     * Out:
     * Ferrari is the best!
     */
    function format(str, obj) {
        var name;

        for (name in obj) {
            if (obj.hasOwnProperty(name)) {
                str = str.replace(new RegExp("%{" + name + "}", "ig"), obj[name]);
            }
        }

        return str;
    }

    // public API
    return {
        is_string: is_string,
        is_letter: is_letter,
        trim: trim,
        slug: slug,
        capitalize: capitalize,
        delimiter_separated_words: delimiter_separated_words,
        strip_tags: strip_tags,
        camel_case: camel_case,
        slice: slice,
        format: format
    };
}());

/**
 * @package pklib.ui
 * @dependence pklib.string. pklib.dom
 */

/**
 * User Interface
 * @namespace
 */
pklib.ui = (function () {
    "use strict";

    /**
     * @private
     * @function
     * @param {HTMLElement} element
     * @param {HTMLElement} wrapper
     * @throws {TypeError} If first param is not HTMLElement
     * @returns {Array}
     */
    function center(element, wrapper) {
        var left = null,
            top = null,
            pus = pklib.ui.size;

        pklib.common.assert(pklib.dom.is_element(element), "pklib.ui.center: @element: not {HTMLElement}");

        if (wrapper === document.body) {
            left = (Math.max(pus.window("width"), pus.document("width")) - pus.object(element, "width")) / 2;
            top = (Math.max(pus.window("height"), pus.document("height")) - pus.object(element, "height")) / 2;
        } else {
            left = (pus.window("width") - pus.object(element, "width")) / 2;
            top = (pus.window("height") - pus.object(element, "height")) / 2;
        }
        element.style.left = left + "px";
        element.style.top = top + "px";
        element.style.position = "absolute";

        return [left, top];
    }

    /**
     * @private
     * @function
     * @param {HTMLElement} element
     * @param {HTMLElement} wrapper
     * @returns {Array}
     */
    function maximize(element, wrapper) {
        var width = null,
            height = null,
            pus = pklib.ui.size;

        if (wrapper === document.body) {
            width = Math.max(pus.window("width"), pus.document("width"));
            height = Math.max(pus.window("height"), pus.document("height"));
            if (pklib.browser.get_name() === "msie") {
                width -= 20;
            }
        } else {
            width = pus.object(wrapper, "width");
            height = pus.object(wrapper, "height");
        }
        element.style.width = width;
        element.style.height = height;
        return [width, height];
    }

    /**
     * @private
     * @function
     * @param {Number} param
     * @param {Boolean} animate
     */
    function scroll_to(param, animate) {
        var interval = null;
        if (animate) {
            interval = setInterval(function () {
                document.body.scroll_top -= 5;
                if (document.body.scroll_top <= 0) {
                    clearInterval(interval);
                }
            }, 1);
        } else {
            document.body.scroll_top = param + "px";
        }
    }

    // public API
    return {
        center: center,
        maximize: maximize,
        scroll_to: scroll_to
    };
}());

/**
 * @package pklib.glass
 * @dependence pklib.browser, pklib.dom, pklib.event, pklib.utils
 */

/**
 * Show glass on dimensions on browser
 * @namespace
 */
pklib.ui.glass = (function () {
    "use strict";

    /**
     * @namespace
     * @type {Object}
     */
    var id = "pklib-glass-wrapper",
        settings = {
            container: null,
            style: {
                position: "absolute",
                left: 0,
                top: 0,
                background: "#000",
                opacity: 0.5,
                zIndex: 1000
            }
        };

    /**
     * @private
     * @function
     * @param {Object} config
     * @param {Function} callback
     * @returns {HTMLElement}
     */
    function show_glass(config, callback) {
        var glass = document.createElement("div"),
            glassStyle = glass.style,
            style;

        settings.container = document.body;
        settings = pklib.object.mixin(settings, config);
        settings.style.filter = "alpha(opacity=" + parseFloat(settings.style.opacity) * 100 + ")";

        glass.setAttribute("id", pklib.ui.glass.obj_id);

        for (style in settings.style) {
            if (settings.style.hasOwnProperty(style)) {
                glassStyle[style] = settings.style[style];
            }
        }

        settings.container.appendChild(glass);

        pklib.ui.maximize(glass, settings.container);

        pklib.event.add(window, "resize", function () {
            pklib.ui.glass.close();
            pklib.ui.glass.show(config, callback);
            pklib.ui.maximize(glass, settings.container);
        });

        if (typeof callback === "function") {
            callback();
        }

        return glass;
    }

    /**
     * @private
     * @function
     * @param {Function} callback
     * @returns {Boolean}
     */
    function close_glass(callback) {
        var glass = pklib.dom.by_id(pklib.ui.glass.obj_id),
            result = false;

        pklib.event.remove(window, "resize");

        if (glass !== null) {
            glass.parentNode.removeChild(glass);
            close_glass(callback);
            result = true;
        }

        if (typeof callback === "function") {
            callback();
        }

        return result;
    }

    // public API
    return {
        /**
         * @memberOf pklib.ui.glass
         * @type {String}
         */
        obj_id: id,

        show: show_glass,
        close: close_glass
    };
}());

/**
 * @package pklib.ui.loader
 * @dependence pklib.dom, pklib.event, pklib.utils
 */

/**
 * Loader adapter.
 * Show animate image (GIF) on special place.
 * @namespace
 */
pklib.ui.loader = (function () {
    "use strict";

    /**
     * @namespace
     * @type {Object}
     */
    var id = "pklib-loader-wrapper",
        settings = {
            src: "",
            container: null,
            style: {
                width: 31,
                height: 31,
                zIndex: 1010
            },
            center: true
        };

    /**
     * @private
     * @function
     * @param {object} config
     * @param {function} callback
     */
    function show_loader(config, callback) {
        var loader = document.createElement("img"),
            loaderStyle = loader.style,
            style;

        settings.container = document.body;
        settings = pklib.object.mixin(settings, config);

        loader.setAttribute("id", pklib.ui.loader.obj_id);
        loader.setAttribute("src", settings.src);

        for (style in settings.style) {
            if (settings.style.hasOwnProperty(style)) {
                loaderStyle[style] = settings.style[style];
            }
        }

        if (settings.center) {
            pklib.ui.center(loader, settings.container);

            pklib.event.add(window, "resize", function () {
                pklib.ui.center(loader, settings.container);
            });
        }

        settings.container.appendChild(loader);

        if (typeof callback === "function") {
            callback();
        }
        // clear memory
        loader = null;
    }

    /**
     * @private
     * @function
     * @param {Function} callback
     * @returns {Boolean}
     */
    function close_loader(callback) {
        var loader = pklib.dom.by_id(pklib.ui.loader.obj_id),
            result = false;

        if (loader !== null) {
            loader.parentNode.removeChild(loader);
            close_loader(callback);
            result = true;
        }

        if (typeof callback === "function") {
            callback();
        }

        return result;
    }

    // public API
    return {
        /**
         * @memberOf pklib.ui.glass
         * @type {String}
         */
        obj_id: id,

        show: show_loader,
        close: close_loader
    };
}());

/**
 * @package pklib.ui.message
 * @dependence pklib.dom, pklib.event, pklib.string, pklib.utils
 */

/**
 * Show layer on special place.
 * @namespace
 */
pklib.ui.message = (function () {
    "use strict";

    /**
     * @namespace
     * @type {Object}
     */
    var id = "pklib-message-wrapper",
        settings = {
            container: null,
            style: {
                width: 300,
                height: 300,
                zIndex: 1010
            }
        };

    /**
     * @private
     * @function
     * @param {Object} config
     * @param {Function} callback
     * @returns {HTMLElement}
     */
    function show_message(config, callback) {
        var message = document.createElement("div"),
            messageStyle = message.style,
            style;

        settings.container = document.body;
        settings = pklib.object.mixin(settings, config);

        message.setAttribute("id", pklib.ui.message.obj_id);

        for (style in settings.style) {
            if (settings.style.hasOwnProperty(style)) {
                messageStyle[style] = settings.style[style];
            }
        }

        pklib.dom.insert(pklib.ui.message.content, message);

        settings.container.appendChild(message);
        pklib.ui.center(message, settings.container);

        pklib.event.add(window, "resize", function () {
            pklib.ui.center(message, settings.container);
        });

        if (typeof callback === "function") {
            callback();
        }

        return message;
    }

    /**
     * @private
     * @function
     * @param {Function} callback
     * @returns {Boolean}
     */
    function close_message(callback) {
        var message = pklib.dom.by_id(pklib.ui.message.obj_id),
            result = false;

        if (message !== null) {
            message.parentNode.removeChild(message);
            close_message(callback);
            result = true;
        }

        if (typeof callback === "function") {
            callback();
        }

        return result;
    }

    // public API
    return {
        /**
         * @memberOf pklib.ui.glass
         * @type {String}
         */
        obj_id: id,

        /**
         * @memberOf pklib.ui.glass
         * @type {HTMLElement}
         */
        content: null,

        show: show_message,
        close: close_message
    };
}());

/**
 * @package pklib.ui.size
 * @dependence pklib.string
 */

/**
 * Check ui dimensions
 * @namespace
 */
pklib.ui.size = (function () {
    "use strict";

    /**
     * @private
     * @function
     * @param {String} name
     * @throws {TypeError}
     * @returns {Number}
     */
    function size_of_window(name) {
        var clientName;
        pklib.common.assert(typeof name === "string", "pklib.ui.size.window: @name: not {String}");

        name = pklib.string.capitalize(name);
        clientName = document.documentElement["client" + name];
        return (document.compatMode === "CSS1Compat" && clientName) ||
            document.body["client" + name] ||
            clientName;
    }

    /**
     * @private
     * @function
     * @param {String} name
     * @returns {Number}
     */
    function size_of_document(name) {
        var clientName,
            scrollBodyName,
            scrollName,
            offsetBodyName,
            offsetName;

        pklib.common.assert(typeof name === "string", "pklib.ui.size.document: @name: not {String}");

        name = pklib.string.capitalize(name);
        clientName = document.documentElement["client" + name];
        scrollBodyName = document.body["scroll" + name];
        scrollName = document.documentElement["scroll" + name];
        offsetBodyName = document.body["offset" + name];
        offsetName = document.documentElement["offset" + name];
        return Math.max(clientName, scrollBodyName, scrollName, offsetBodyName, offsetName);
    }

    /**
     * @private
     * @function
     * @param {HTMLElement} obj
     * @param {String} name
     * @returns {Number}
     */
    function size_of_object(obj, name) {
        pklib.common.assert(typeof name === "string", "pklib.ui.size.object: @name: not {String}");
        pklib.common.assert(pklib.dom.is_element(obj), "pklib.ui.size.object: @obj: not {HTMLElement}");

        name = pklib.string.capitalize(name);
        var client = obj["client" + name],
            scroll = obj["scroll" + name],
            offset = obj["offset" + name];
        return Math.max(client, scroll, offset);
    }

    // public APi
    return {
        window: size_of_window,
        document: size_of_document,
        object: size_of_object
    };
}());

/**
 * @package pklib.url
 */

/**
 * Url helper manager
 * @namespace
 */
pklib.url = (function () {
    "use strict";

    /**
     * Get all params, and return in JSON object
     *
     * @private
     * @function
     * @returns {Object}
     */
    function get_params() {
        var i,
            item,
            len,
            params = window.location.search,
            params_list = {};

        if (params.substr(0, 1) === "?") {
            params = params.substr(1);
        }

        params = params.split("&");
        len = params.length;

        for (i = 0; i < len; ++i) {
            item = params[i].split("=");
            params_list[item[0]] = item[1];
        }
        return params_list;
    }

    /**
     * Get concrete param from URL.
     * If param if not defined return null
     *
     * @private
     * @function
     * @param {String} key
     * @returns {String}
     */
    function get_param(key) {
        var params = window.location.search,
            i,
            item,
            len;

        if (params.substr(0, 1) === "?") {
            params = params.substr(1);
        }

        params = params.split("&");
        len = params.length;

        for (i = 0; i < len; ++i) {
            item = params[i].split("=");
            if (item[0] === key) {
                return item[1];
            }
        }
        return null;
    }

    // public API
    return {
        get_params: get_params,
        get_param: get_param
    };
}());

/**
 * @package pklib.utils
 * @dependence pklib.common, pklib.dom, pklib.event
 */

/**
 * Utils tools
 * @namespace
 */
pklib.utils = (function () {
    "use strict";

    /**
     * @private
     * @function
     * @param {Event} evt
     */
    function open_trigger(evt) {
        var url = "";

        if (evt.originalTarget &&
            typeof evt.originalTarget === "object" &&
            evt.originalTarget.href !== undefined) {
            url = evt.originalTarget.href;
        } else if (evt.toElement &&
            typeof evt.toElement === "object" &&
            evt.toElement.href !== undefined) {
            url = evt.toElement.href;
        } else if (evt.srcElement &&
            typeof evt.srcElement === "object" &&
            evt.srcElement !== undefined) {
            url = evt.srcElement.href;
        }

        window.open(url);

        try {
            evt.preventDefault();
        } catch (ignore) {
            window.event.returnValue = false;
        }

        return false;
    }

    /**
     * @private
     * @function
     * @param {HTMLElement} obj
     */
    function clear_focus(obj) {
        if (pklib.dom.is_element(obj)) {
            pklib.event.add(obj, "focus", function () {
                if (obj.value === obj.defaultValue) {
                    obj.value = "";
                }
            });
            pklib.event.add(obj, "blur", function () {
                if (obj.value === "") {
                    obj.value = obj.defaultValue;
                }
            });
        }
    }

    /**
     * @private
     * @function
     * @param {HTMLElement} area
     */
    function outerlink(area) {
        var i, len,
            link, links;

        area = area || document;

        links = pklib.dom.by_tag("a", area);
        len = links.length;

        for (i = 0; i < len; ++i) {
            link = links[i];
            if (link.rel === "outerlink") {
                pklib.event.add(link, "click", open_trigger.bind(link));
            }
        }
    }

    /**
     * @private
     * @function
     * @param {HTMLElement} element
     * @param {String} [text="Sure?"]
     */
    function confirm(element, text) {
        var response;
        if (element !== undefined) {
            text = text || "Sure?";

            pklib.event.add(element, "click", function (evt) {
                response = window.confirm(text);
                if (!response) {
                    try {
                        evt.preventDefault();
                    } catch (ignore) {
                        window.event.returnValue = false;
                    }

                    return false;
                }
                return true;
            });
        }
    }

    // public API
    return {
        /**
         * Numbers of chars in ASCII system
         * @memberOf pklib.utils
         * @field
         * @namespace
         */
        ascii: {
            /**
             * @memberOf pklib.utils.ascii
             * @field
             * @namespace
             */
            letters: {
                /**
                 * @memberOf pklib.utils.ascii.letters
                 * @field
                 * @type {Array}
                 */
                lower: [113, 119, 101, 114, 116, 121, 117, 105, 111, 112, 97, 115, 100, 102, 103, 104, 106, 107, 108, 122, 120, 99, 118, 98, 110, 109],

                /**
                 * @memberOf pklib.utils.ascii.letters
                 * @field
                 * @type {Array}
                 */
                upper: [81, 87, 69, 82, 84, 89, 85, 73, 79, 80, 65, 83, 68, 70, 71, 72, 74, 75, 76, 90, 88, 67, 86, 66, 78, 77]
            }
        },

        /**
         * @memberOf pklib.utils
         * @namespace
         */
        action: {
            clearfocus: clear_focus,
            outerlink: outerlink,
            confirm: confirm
        }
    };
}());