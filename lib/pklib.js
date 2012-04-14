/**
 * pklib JavaScript library v1.0.1
 * http://pklib.com/
 * 
 * Copyright (c) 2011
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, 
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES 
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. 
 * IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, 
 * DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, 
 * TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE 
 * OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 * 
 * http://www.opensource.org/licenses/mit-license.php
 * 
 * Date: Tue Nov 01 2011 16:05:01 GMT+0100 (CEST)
 */

// pklib definition and initialization
pklib = this.pklib || {
    author: "Piotr Kowalski",
    www: "http://pklib.com/",
    version: "1.0.1"
};

	
/**
 * @package ajax
 * @dependence array, utils
 */
pklib = this.pklib || {};

/**
 * Module to service asynchronous request.
 */
pklib.ajax = (function () {

    var client = null,
        settings = {},
        cache = [];

    function handler () {
        var method = "responseText";

        if (this.readyState === 4) {
            cache[settings.url] = this;

            var ct = this.getResponseHeader("Content-Type"),
                xmlct = ["application/xml", "text/xml"];

            if (pklib.array.inArray(ct, xmlct)) {
                method = "responseXML";
            }

            settings.done.call(null, this[method]);
        }
    }

    return {

        /**
         * Lazy load file.
         *
         * @param {object} config
         * <pre>
         * {
         *      type {string|default /get/}
         *      async {boolean|default true}
         *      cache {boolean|default false}
         *      url {string}
         *      params {array or object}
         *      headers {object}
         *
         *      done {function}
         * }
         * </pre>
         */
        load: function (config) {
            client = null;
            settings = {
                type: "get",
                async: true,
                cache: false,
                url: null,
                params: null,
                headers: {},
    
                done: function (data) {
                    // pass
                }
            };
            
            settings = pklib.array.mixin(settings, config);
            settings.type = settings.type.toUpperCase();
    
            if (settings.cache && cache[settings.url]) {
                handler.call(cache[settings.url]);
            } else {
                client = new XMLHttpRequest();
                client.onreadystatechange = function () {
                    handler.call(client);
                };
                client.open(settings.type, settings.url, settings.async);
                if (settings.headers != null) {
                    for(var item in settings.headers) {
                        if (settings.headers.hasOwnProperty(item)) {
                            client.setRequestHeader(item, settings.headers[item]);
                        }
                    }
                }
                client.send(settings.params);
            }
        }

    };
    
})();
	
/**
 * @package array
 */
pklib = this.pklib || {};

/**
 * Module to service array object.
 */
pklib.array = (function () {

    return {

        /**
         * Check if object is array,
         * Check by:
         * - typeof object
         * - not null
         * - typeof object.length
         * - typeof object.slice
         * 
         * @param {HTMLElement} obj
         * @return {boolean}
         */
        isArray: function (obj) {
            return typeof obj === "object" && obj != null && typeof obj.length !== "undefined" && typeof obj.slice !== "undefined";
        },
        
        /**
         * Check if element is in array by loop.
         * 
         * @param {any Object) param
         * @param {array} array
         * @return {boolean or number}
         */
        inArray: function (param, array) {
            for(var i = 0, len = array.length; i < len; ++i) {
                if (array[i] === param) {
                    return true;
                }
            }
            return false;
        },
        
        /**
         * Unique array. Delete element what was duplicated.
         * 
         * @param {array} array
         * @return {array}
         */
        unique: function (array) {
            for(var i = 0, temp = [], len = array.length; i < len; ++i) {
                var item = array[i];
                if (this.inArray.call(null, item, temp) === false) {
                    temp.push(item);
                }
            }
            return temp;
        },
        
        /**
         * Remove element declarated in infinity params without first.
         * First parameter is array object.
         * 
         * @param {array} array
         * @param {any Object}...
         * @return {array}
         */
        remove: function (array /*,  */) {
            var params = Array.prototype.splice.call(arguments, 1);
            for(var i = 0, len = params.length; i < len; ++i) {
                var param = params[i], 
                    inside = this.inArray(param, array);
                if (inside !== false) {
                    array.splice(inside, 1);
                }
            }
            return array;
        },
        
        /**
         * @param {array or object} target
         * @param {array or object} source
         * @return {array}
         */
        mixin: function (target, source) {
            if (this.isArray(target) && this.isArray(source)) {
                for(var i = 0, len = source.length; i < len; ++i) {
                    var element = source[i];
                    if (!this.inArray(element, target)) {
                        target.push(element);
                    }
                }
                return target.sort();
            } else {
                for(var item in source) {
                    if (source.hasOwnProperty(item)) {
                        target[item] = source[item];
                    }
                }
                return target;
            }
        }
    };

})();
	
/**
 * @package aspect
 */
pklib = this.pklib || {};

/**
 * Create method with merge first and second.
 * Second method is run after first.
 *
 * @param fun {function} The function to bind aspect function
 * @param asp {function} The aspect function
 */
pklib.aspect = function (fun, asp) {
    if (typeof fun !== "function" || typeof asp !== "function") {
        throw new TypeError("Params are not functions");
    }

    var that = this;

    return function () {
        asp.call(that);
        return fun.apply(that, arguments);
    };
};
	
/**
 * @package browser
 */
pklib = this.pklib || {};

/**
 * Get best information about browser.
 */
pklib.browser = (function () {

    var browsers = ["msie", "chrome", "safari", "opera", "mozilla", "konqueror"];

    return {

        /**
         * Get browser name by checking userAgent in global object navigator.
         *
         * @return {string}
         */
        getName: function () {
            var userAgent = navigator.userAgent.toLowerCase();

            for(var i = 0, len = browsers.length; i < len; ++i) {
                var browser = browsers[i];
                if (new RegExp(browser).test(userAgent)) {
                    return browser;
                }
            }
        },
        
        /**
         * Get browser version by checking userAgent.
         * Parse userAgent to find next 3 characters.
         *
         * @return {string}
         */
        getVersion: function () {
            var userAgent = navigator.userAgent.toLowerCase();

            for(var i = 0, len = browsers.length; i < len; ++i) {
                var browser = browsers[i],
                    cur = userAgent.indexOf(browser);
                if (cur != -1) {
                    return userAgent.substr(cur + len + 1, 3);
                }
            }
        }
    };

})();
	
/**
 * @package cookie
 */
pklib = this.pklib || {};

/**
 * Cookie service manager.
 */
pklib.cookie = (function () {

    var doc = document;

    return {

        /**
         * Create cookie file with name, value and day expired.
         *
         * @param {string} name
         * @param {string} value
         * @param {number} days
         * @return {string}
         */
        create: function (name, value, days) {
            value = value || null;
            var expires = "";

            if (typeof days !== "undefined") {
                var date = new Date();
                date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
                expires = "; expires=" + date.toGMTString();
            }

            doc.cookie = name + "=" + value + expires + "; path=/";

            return this.read(name);
        },
        
        /**
         * Read cookie by it name.
         *
         * @param {string} name
         * @return {null or string}
         */
        read: function (name) {
            if (typeof name === "undefined") {
                return null;
            }
            name = name + "=";
            var ca = doc.cookie.split(";");

            for(var i = 0, len = ca.length; i < len; ++i) {
                var c = ca[i];
                while(c.charAt(0) === " ") {
                    c = c.substring(1, c.length);
                }
                if (c.indexOf(name) === 0) {
                    return c.substring(name.length, c.length);
                }
            }
        },
        
        /**
         * Delete cookie by it name.
         *
         * @param {string} name
         * @return {string}
         */
        erase: function (name) {
            return this.create(name, undefined, -1);
        }
    };

})();
	
/**
 * @package css
 */
pklib = this.pklib || {};

/**
 * Utils method related css on tags in DOM tree.
 */
pklib.css = (function () {

    return {

        /**
         * Add CSS class to element define in second parameter.
         *
         * @param {HTMLElement} element
         * @param {string} cssClass
         */
        addClass: function (cssClass, element) {
            if (typeof element === "undefined" || element == null || typeof cssClass === "undefined") {
                throw new TypeError("pklib.css.addClass: Element is undefined/null or cssClass is undefined");
            }
            var classElement = element.className;
            if (!this.hasClass(cssClass, element)) {
                if (classElement.length) {
                    classElement += " " + cssClass;
                } else {
                    classElement = cssClass;
                }
            }
            element.className = classElement;
        },
        
        /**
         * Remove CSS class from element define in second parameter.
         *
         * @param {HTMLElement} element
         * @param {string} cssClass
         */
        removeClass: function (cssClass, element) {
            if (typeof element === "undefined" || element == null || typeof cssClass === "undefined") {
                throw new TypeError("pklib.css.removeClass: Element is undefined/null or cssClass is undefined");
            }
            var regexp = new RegExp("(\s" + cssClass + ")|(" + cssClass + "\s)|" + cssClass, "i");
            element.className = element.className.replace(regexp, "");
        },
        
        /**
         * Check if element has CSS class
         * 
         * @param {HTMLElement} element
         * @param {string} cssClass
         * @return {boolean}
         */
        hasClass: function (cssClass, element) {
            if (typeof element === "undefined" || element == null || typeof cssClass === "undefined") {
                throw new TypeError("pklib.css.hasClass: Element is undefined/null or cssClass is undefined");
            }
            var regexp = new RegExp("(\s" + cssClass + ")|(" + cssClass + "\s)|" + cssClass, "i");
            return regexp.test(element.className);
        }
    };

})();
	
/**
 * @package dom
 * @dependence browser, css, utils
 */
pklib = this.pklib || {};

/**
 * Helper related with DOM service.
 */
pklib.dom = (function () {

    var doc = document,
    
        walk_the_dom = function (node, func) {
            func(node);
            node = node.firstChild;
            while(node) {
                walk_the_dom(node, func);
                node = node.nextSibling;
            }
        };

    return {

        nodeTypes: {
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
        },

        /**
         * @param {HTMLElement} element
         * @return {string}
         */
        isNode: function (element) {
            return element && element.nodeType && element.nodeName|| null;
        },
        
        /**
         * @param {string} id
         * @param {HTMLElement} container
         * @return {HTMLElement}
         */
        byId: function (id, container) {
            container = container || doc;
            return container.getElementById(id);
        },
        
        /**
         * @param {string} tag
         * @param {HTMLElement} container
         * @return {NodeList}
         */
        byTag: function (tag, container) {
            container = container || doc;
            return container.getElementsByTagName(tag);
        },
        
        /**
         * @param {string} cssClass
         * @param {HTMLElement} container
         * @return {NodeList or array}
         */
        byClass: function (cssClass, container) {
            container = container || doc;
            if (container.getElementsByClassName) {
                return container.getElementsByClassName(cssClass);
            } else {
                var results = [];
                walk_the_dom(container, function (node) {
                    if (pklib.css.hasClass(cssClass, node)) {
                        results.push(node);
                    }
                });
                return results;
            }
        },
        
        /**
         * @param {HTMLElement} element
         * @return {null or number}
         */
        index: function (element) {
            var parent = element.parentNode,
                elements = this.children(parent);
            for(var i = 0, len = elements.length; i < len; ++i) {
                var item = elements[i];
                if (item === element) {
                    return i;
                }
            }
            return null;
        },
        
        /**
         * @param {HTMLElement} element
         * @return {array}
         */
        children: function (element) {
            var array = [], 
                childs = element.childNodes;
            for(var i = 0, len = childs.length; i < len; ++i) {
                if (childs[i].nodeType === this.nodeTypes.ELEMENT_NODE) {
                    array.push(childs[i]);
                }
            }
            return array;
        },
        
        /**
         * @param {HTMLElement} element
         * @param {HTMLElement} container
         * @return {array}
         */
        center: function (element, container) {
            var left = null,
                top = null;
            if (container === doc.body) {
                left = (Math.max(pklib.utils.size.window("width"), pklib.utils.size.document("width")) - pklib.utils.size.object(element, "width")) / 2;
                top = (Math.max(pklib.utils.size.window("height"), pklib.utils.size.document("height")) - pklib.utils.size.object(element, "height")) / 2;
            } else {
                left = (pklib.utils.size.window("width") - pklib.utils.size.object(element, "width")) / 2;
                top = (pklib.utils.size.window("height") - pklib.utils.size.object(element, "height")) / 2;
            }
            element.style.left = left + "px";
            element.style.top = top + "px";
            element.style.position = "absolute";
            return [left, top];
        },
        
        /**
         * @param {HTMLElement} element
         * @param {HTMLElement} container
         * @return {array}
         */
        maximize: function (element, container) {
            var width = null, 
                height = null;
            if (container === doc.body) {
                width = Math.max(pklib.utils.size.window("width"), pklib.utils.size.document("width"));
                height = Math.max(pklib.utils.size.window("height"), pklib.utils.size.document("height"));
                if (pklib.browser.getName() === "msie") {
                    width -= 20;
                }
            } else {
                width = pklib.utils.size.object(container, "width");
                height = pklib.utils.size.object(container, "height");
            }
            element.style.width = width;
            element.style.height = height;
            return [width, height];
        },
        
        /**
         * @param {HTMLElement} element
         * @param {HTMLElement} container
         * @return {HTMLElement}
         */
        insert: function (element, container) {
            if (this.isNode(element)) {
                container.appendChild(element);
            } else if (typeof element === "string") {
                container.innerHTML += element;
            }
            return element;
        }
    };

})();
	
/**
 * @package event
 */
pklib = this.pklib || {};

/**
 * Helper about manage event on HTMLElement.
 */
pklib.event = (function () {

    return {

        /**
         * @param {HTMLElement} target
         * @param {string} eventType
         * @param {function} callback
         * @param {boolean} bubbles
         * @return {Event}
         */
        add: function (target, eventType, callback, bubbles) {
            bubbles = bubbles || false;

            if (target.attachEvent) {
                target.attachEvent("on" + eventType, callback);
            } else if (target.addEventListener) {
                target.addEventListener(eventType, callback, bubbles);
            }
        },
        
        /**
         * @param {HTMLElement} target
         * @param {string} eventType
         * @param {function} callback
         * @param {boolean} bubbles
         * @return {boolean}
         */
        remove: function (target, eventType, callback, bubbles) {
            if (target.detachEvent) {
                this.remove = function (target, eventType, callback) {
                    target.detachEvent("on" + eventType, callback);
                    return true;
                };
            } else if (target.removeEventListener) {
                this.remove = function (target, eventType, callback, bubbles) {
                    bubbles = bubbles || false;
                    target.removeEventListener(eventType, callback, bubbles);
                    return true;
                };
            }
            return this.remove(target, eventType, callback, bubbles);
        }
    };

})();
	
/**
 * @package file
 */
pklib = this.pklib || {};

/**
 * File manager
 */
pklib.file = (function () {

    var doc = document;

    return {

        /**
         * Lazy load scripts.
         * Append script to HEAD section.
         *
         * @param {string} src
         * @param {function} callback
         */
        load: function (src, callback) {
            var script = doc.createElement("script");
            script.type = "text/javascript";
            script.src = src;

            if (script.readyState) {
                script.onreadystatechange = function () {
                    if (script.readyState === "loaded" || script.readyState === "complete") {
                        script.onreadystatechange = null;
                        (typeof callback === "function") && callback(script);
                    }
                };
            } else {
                script.onload = function () {
                    (typeof callback === "function") && callback(script);
                };
            }

            doc.head.appendChild(script);
        }
    };

})();
	
/**
 * @package glass
 * @dependence browser, dom, event, utils
 */
pklib = this.pklib || {};

/**
 * Glass Adapter.
 * Show this on dimensions on browser. 
 */
pklib.glass = (function () {

    var doc = document,
        id = "pklib-glass-wrapper",
        settings = {
            container: doc.body,
            style: {
                position: "absolute",
                left: 0,
                top: 0,
                background: "#000",
                opacity: 0.5,
                zIndex: 1000
            }
        };

    return {

        /**
         * @type string
         */
        objId: id,

        /**
         * @param {object} config
         * @param {function} callback
         */
        show: function (config, callback) {
            var that = this,
                glass = doc.createElement("div"),
                glassStyle = glass.style;
                
            settings = pklib.array.mixin(settings, config);
            settings.style.filter = "alpha(opacity=" + parseFloat(settings.style.opacity, 10) * 100 + ")";

            glass.setAttribute("id", this.objId);
            for(var style in settings.style) {
                if (settings.style.hasOwnProperty(style)) {
                    glassStyle[style] = settings.style[style];
                }
            }

            settings.container.appendChild(glass);

            pklib.dom.maximize(glass, settings.container);

            pklib.event.add(window, "resize", function () {
                that.close();
                that.show(config, callback);
                pklib.dom.maximize(glass, settings.container);
            });
            
            (typeof callback === "function") && callback();

            return glass;
        },
        
        /**
         * @param {function} callback
         * @return {boolean}
         */
        close: function (callback) {
            var glass = pklib.dom.byId(this.objId),
                result = false;
                
            if (glass !== null) {
                glass.parentNode.removeChild(glass);
                arguments.callee(callback);
                result = true;
            }
            
            (typeof callback === "function") && callback();

            return result;
        }
    };
    
})();
	
/**
 * @package json
 */
pklib = this.pklib || {};

/**
 * JSON manager
 */
pklib.json = (function () {

    return {

        /**
         * @param {array} object
         * @param {number} ind
         * @return {string}
         */
        stringify: function (object, ind) {
            var source = "", 
                type = "", 
                index = ind || 0;

            function indent(len) {
                for(var i = 0, preffix = "\t", source = ""; i < len; ++i) {
                    source += preffix;
                }
                return source;
            }

            // Undefined
            if (typeof object === "undefined") {
                return undefined;
            } else

            // Null
            if (object == null) {
                return null;
            } else

            // Boolean
            if (typeof object === "boolean") {
                type = "boolean";
                return object;
            } else

            // Number
            if (typeof object === "number") {
                type = "number";
                return object;
            } else

            // String
            if (typeof object === "string") {
                type = "string";
                return '"' + object + '"';
            } else

            // Function
            if (typeof object === "function") {
                type = "function";

                function __getName(fun) {
                    var text = fun.toString();
                    text = text.split("\n")[0].replace("function ", "");
                    return text.substr(0, text.indexOf("(")) + "()";
                }

                return __getName(object);
            } else

            // Array
            if (typeof object === "object" && typeof object.slice === "function") {
                type = "array";
                if (object.length === 0) {
                    return "[]";
                }
                source = "[\n" + indent(index);
                index++;
                for(var i = 0, len = object.length; i < len; ++i) {
                    source += indent(index) + arguments.callee(object[i], index);
                    if (i !== len - 1) {
                        source += ",\n";
                    }
                }
                index--;
                source += "\n" + indent(index) + "]";
            } else

            // Object
            if (typeof object === "object") {
                type = "object";

                function __getLast(object) {
                    for(var i in object) {
                    }
                    return i;
                }

                source = "{\n";
                index++;
                for(var item in object) {
                    if (object.hasOwnProperty(item)) {
                        source += indent(index) + '"' + item + '": ' + arguments.callee(object[item], index);
                        if (item !== __getLast(object)) {
                            source += ",\n";
                        }
                    }
                }
                index--;
                source += "\n" + indent(index) + "}";
            }

            return source;
        },
        
        /**
         * @param {object} object
         * @param {boolean} toJson
         * @returns {string}
         */
        serialize: function (source, toJson) {
            if (typeof source !== "object" || source == null) {
                throw new TypeError("pklib.json.serialize: Source is null or not object");
            }

            var amp = false, 
                response = ''; 

            toJson && (response += "{");
            
            for(var item in source) {
                if (source.hasOwnProperty(item)) {(amp) ? response += toJson ? ',': '&': ( amp = true);

                    var value = '';
                    if (typeof source[item] !== "undefined" && source[item] !== null) {
                        value = source[item];
                    }

                    var mtz = toJson ? '"': '';
                    response += item;
                    response += toJson ? ':': '=';
                    response += mtz;
                    response += value + mtz;
                }
            }
            
            toJson && (response += "}");

            return response;
        }
    };

})();
	
/**
 * @package loader
 * @dependence dom, event, utils
 */
pklib = this.pklib || {};

/**
 * Loader adapter.
 * Show animate image (GIF) on special place.
 */
pklib.loader = (function () {

    var doc = document,
        id = "pklib-loader-wrapper",
        settings = {
            src: "http://pklib.com/img/icons/loader.gif",
            container: doc.body,
            style: {
                width: 31,
                height: 31,
                zIndex: 1010
            },
            center: true
        };

    return {

        /**
         * @type string
         */
        objId: id,

        /**
         * @param {object} config
         * @param {function} callback
         */
        show: function (config, callback) {
            settings = pklib.array.mixin(settings, config);

            var loader = doc.createElement("img"),
                loaderStyle = loader.style;

            loader.setAttribute("id", this.objId);
            loader.setAttribute("src", settings.src);
            for(var style in settings.style) {
                if (settings.style.hasOwnProperty(style)) {
                    loaderStyle[style] = settings.style[style];
                }
            }
            if (settings.center) {
                pklib.dom.center(loader, settings.container);

                pklib.event.add(window, "resize", function () {
                    pklib.dom.center(loader, settings.container);
                });
            }

            settings.container.appendChild(loader); 
            
            (typeof callback === "function") && callback();
            
            delete loader;
        },
        
        /**
         * @param {function} callback
         */
        close: function (callback) {
            var loader = pklib.dom.byId(this.objId),
                result = false;
                
            if (loader !== null) {
                loader.parentNode.removeChild(loader);
                this.close(callback);
                result = true;
            }
            
            (typeof callback === "function") && callback();

            return result;
        }
    };

})();
	
/**
 * @package message
 * @dependence dom, event, utils
 */
pklib = this.pklib || {};

/**
 * Show layer on special place.
 */
pklib.message = (function () {

    var doc = document,
        id = "pklib-message-wrapper",
        contents = null,
        settings = {
            container: doc.body,
            style: {
                width: 300,
                height: 300,
                zIndex: 1010
            }
        };

    return {
        objId: id,
        content: contents,
        show: function (config, callback) {
            settings = pklib.array.mixin(settings, config);

            var message = doc.createElement("div"),
                messageStyle = message.style;

            message.setAttribute("id", this.objId);
            for(var style in settings.style) {
                if (settings.style.hasOwnProperty(style)) {
                    messageStyle[style] = settings.style[style];
                }
            }

            if (typeof this.content === "string") {
                message.innerHTML = this.content;
            } else if (typeof this.content === "object") {
                message.appendChild(this.content);
            }

            settings.container.appendChild(message);

            pklib.dom.center(message, settings.container);

            pklib.event.add(window, "resize", function () {
                pklib.dom.center(message, settings.container);
            }); 
            
            (typeof callback === "function") && callback();

            return message;
        },
        
        close: function (callback) {
            var message = pklib.dom.byId(this.objId),
                result = false;

            if (message !== null) {
                message.parentNode.removeChild(message);
                this.close(callback);
                result = true;
            }
            
            (typeof callback === "function") && callback();

            return result;
        }
    };

})();
	
/**
 * @package pklib.profiler
 */
pklib = this.pklib || {};

/**
 * Time analyzer
 */
pklib.profiler = (function () {

    var data = {};

    return {

        /**
         * @param {string} name
         * @return {number}
         */
        start: function (name) {
            data[name] = new Date();
            return data[name];
        },
        
        /**
         * @param {string} name
         * @return {number}
         */
        stop: function (name) {
            data[name] = new Date() - data[name];
            return new Date((new Date()).getTime() + data[name]);
        },
        
        /**
         * @param {string} name
         * @return {number}
         */
        getTime: function (name) {
            return data[name];
        }
    };

})();
	
/**
 * @package prototypes
 */
Function.prototype.bind = Function.prototype.bind || function (oThis) {
    if (typeof this !== "function") {
        throw new TypeError("Function.prototype.bind - what is trying to be fBound is not callable");
    }

    var aArgs = Array.prototype.slice.call(arguments, 1), 
        fToBind = this, 
        fNOP = function () {
            // pass
        },
        fBound = function () {
            return fToBind.apply(this instanceof fNOP 
                ? this 
               : oThis || window, aArgs.concat(Array.prototype.slice.call(arguments)));
        };

    fNOP.prototype = this.prototype;
    fBound.prototype = new fNOP();

    return fBound;
};

Function.prototype.addMethod = function (name, func) {
    this.prototype[name] = func;
    return this;
};
	
/**
 * @package string
 */
pklib = this.pklib || {};

/**
 * String service manager
 */
pklib.string = (function () {
    
    return {
    
        /**
         * @param {any Object} source
         * @return {boolean}
         */
        isString: function (source) {
            return typeof source === "string";
        },
    
        /**
         * @param {any Object} source
         * @return {boolean}
         */
        isLetter: function (source) {
            return typeof source === "string" && /^[a-zA-Z]$/.test(source);
        },
    
        /**
         * @param {string} source
         * @return {string}
         */
        trim: function (source) {
            return source.replace(/^\s+|\s+$/g, "");
        },
    
        /**
         * @param {string} source
         * @return {string}
         */
        slug: function (source) {
            var result = source.toLowerCase().replace(/\s/mg, "-");
            result = result.replace(/[^a-zA-Z0-9\-]/mg, function (ch) {
                switch (ch.charCodeAt()) {
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
        },
    
        /**
         * @param {string} source
         * @return {string}
         */
        capitalize: function (source) {
            return source.substr(0, 1).toUpperCase() + source.substring(1, source.length).toLowerCase();
        },
    
        /**
         * @param {string} source
         * @return {string}
         */
        delimiterSeparatedWords: function (source) {
            return source.replace(/[A-ZĘÓĄŚŁŻŹĆŃ]/g, function (match) {
                return "-" + match.toLowerCase();
            });
        },
    
        /**
         * @param {string} source
         * @return {string}
         */
        camelCase: function (source) {
            while (source.indexOf("-") != -1) {
                var pos = source.indexOf("-"),
                    pre = source.substr(0, pos),
                    sub = source.substr(pos + 1, 1).toUpperCase(),
                    post = source.substring(pos + 2, source.length);
                source = pre + sub + post;
            }
            return source;
        },
    
        /**
         * @param {string} source
         * @param {number} len
         * @return {string}
         */
        slice: function (source, len) {
            for ( var item = 0, text = "", num = source.length; item < num; ++item) {
                text += source[item];
                if (item == len - 1) {
                    if (num - len >= 1) {
                        text += "...";
                    }
                    break;
                }
            }
    
            return text;
        }
    
    };
    
})();
	
/**
 * @package utils
 * @dependence array, browser, dom, event, string
 */
pklib = this.pklib || {};

/**
 * Utils tools
 */
pklib.utils = (function () {

    var doc = document;

    return {

        size: {

            /**
             * @param {string} name
             * @returns {number}
             */
            window: function (name) {
                if (typeof name === "undefined") {
                    throw new TypeError("pklib.utils.size.window: Parameter name is mandatory");
                }
                name = pklib.string.capitalize(name);
                var win = window,
                    clientName = win.document.documentElement["client" + name];
                return win.document.compatMode === "CSS1Compat" && clientName || win.document.body["client" + name] || clientName;
            },
            
            /**
             * @param {string} name
             * @return {number}
             */
            document: function (name) {
                if (typeof name === "undefined") {
                    throw new TypeError("pklib.utils.size.document: Parameter name is mandatory");
                }
                name = pklib.string.capitalize(name);
                var clientName = doc.documentElement["client" + name],
                    scrollBodyName = doc.body["scroll" + name],
                    scrollName = doc.documentElement["scroll" + name],
                    offsetBodyName = doc.body["offset" + name],
                    offsetName = doc.documentElement["offset" + name];
                return Math.max(clientName, scrollBodyName, scrollName, offsetBodyName, offsetName);
            },
            
            /**
             * @param {HTMLElement} obj
             * @param {string} name
             * @return {number}
             */
            object: function (obj, name) {
                if (typeof name === "undefined" || typeof obj === "undefined") {
                    throw new TypeError("pklib.utils.size.object: Parameter name is mandatory");
                }
                name = pklib.string.capitalize(name);
                var client = obj["client" + name], scroll = obj["scroll" + name], offset = obj["offset" + name];
                return Math.max(client, scroll, offset);
            }
        },

        ascii: {

            letters: {
                lower: [113, 119, 101, 114, 116, 121, 117, 105, 111, 112, 97, 115, 100, 102, 103, 104, 106, 107, 108, 122, 120, 99, 118, 98, 110, 109],
                upper: [81, 87, 69, 82, 84, 89, 85, 73, 79, 80, 65, 83, 68, 70, 71, 72, 74, 75, 76, 90, 88, 67, 86, 66, 78, 77]
            }

        },

        date: {

            /**
             * @return {string}
             */
            getFullMonth: function () {
                var month = (parseInt(new Date().getMonth(), 10) + 1);
                return (month < 10) ? "0" + month: month;
            }
        },

        action: {

            /**
             * @param {HTMLElement} obj
             */
            clearfocus: function (obj) {
                if (typeof obj !== "undefined") {
                    pklib.event.add(obj, "focus", function () {
                        if (this.value === this.defaultValue) {
                            this.value = "";
                        }
                    });
                    pklib.event.add(obj, "blur", function () {
                        if (this.value === "") {
                            this.value = this.defaultValue;
                        }
                    });
                }
            },
            
            /**
             * @param {HTMLElement} area
             */
            outerlink: function (area) {
                area = area || doc;
                var links = pklib.dom.byTag("a");
                for(var i = 0, len = links.length; i < len; ++i) {
                    var link = links[i];
                    if (link.rel === "outerlink") {
                        pklib.event.add(link, "click", function (e) {
                            window.open(this.href);
                            e.preventDefault();
                        });
                    }
                }
            },
            
            /**
             * @param {HTMLElement} element
             * @param {string} text
             */
            confirm: function (element, text) {
                if (typeof element !== "undefined") {
                    text = text || "Sure?";

                    pklib.event.add(element, "click", function (evt) {
                        var response = confirm(text);
                        if (true === response) {
                            return true;
                        } else {
                            evt.preventDefault();
                        }
                    });
                }
            }
        },

        /**
         * @param param
         * @param {boolean} animate
         */
        scrollTo: function (param, animate) {
            if (true === animate) {
                var interval = null;
                interval = setInterval(function () {
                    doc.body.scrollTop -= 5;
                    if (doc.body.scrollTop <= 0) {
                        clearInterval(interval);
                    }
                }, 1);
            } else {
                doc.body.scrollTop = param;
            }
        }
    };

})();
	
/**
 * @package validate
 * @dependence array, utils
 */
pklib = this.pklib || {};

/**
 * Validate module
 */
pklib.validate = (function () {

    return {

        /**
         * @param {object} object
         * @return {boolean}
         */
        empty: function (object) {
            if (object == null) {
                return true;
            } else if (pklib.array.isArray(object)) {
                return (object.length === 0);
            } else {
                switch (typeof object) {
                    case "string":
                        return (object === "");
                        break;
                    case "number":
                        return (object === 0);
                        break;
                    case "object":
                        var iterator = 0;
                        for(var item in object) {
                            if (object.hasOwnProperty(item)) {
                                iterator++;
                            }
                        }
                        return (iterator === 0);
                        break;

                    case "undefined":
                }
                return false;
            }
        },
        
        /**
         * @param {object} config
         * <pre>
         * {
         *      object {string}
         *      regexp {object}
         *
         *      error {function},
         *      success {function}
         * }
         * </pre>
         *
         * @return {function}
         */
        regexp: function (config) {
            var settings = {
                object: null,
                regexp: null,
                error: function () {
                    // pass
                },
                success: function () {
                    // pass
                }
            };
            settings = pklib.array.mixin(settings, config);

            if (settings.regexp == null) {
                throw new TypeError("pklib.validate.regexp: Regular expressino is neeeded");
            }
            var exp = new RegExp(settings.regexp);

            if (settings.object == null) {
                throw new TypeError("pklib.validate.regexp: Object is neeeded");
            }
            if (exp.test(settings.object)) {
                return (typeof settings.success === "function") && settings.success();
            }

            return (typeof settings.error === "function") && settings.error();
        }
    };

})();
	
