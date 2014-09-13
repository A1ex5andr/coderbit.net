/*! responsive-nav.js 1.0.32
 * https://github.com/viljamis/responsive-nav.js
 * http://responsive-nav.com
 *
 * Copyright (c) 2014 @viljamis
 * Available under the MIT license
 */

(function(document, window, index) {

    "use strict";

    var responsiveNav = function(el, options) {

        var computed = !! window.getComputedStyle;

        // getComputedStyle polyfill
        if (!computed) {
            window.getComputedStyle = function(el) {
                this.el = el;
                this.getPropertyValue = function(prop) {
                    var re = /(\-([a-z]){1})/g;
                    if (prop === "float") {
                        prop = "styleFloat";
                    }
                    if (re.test(prop)) {
                        prop = prop.replace(re, function() {
                            return arguments[2].toUpperCase();
                        });
                    }
                    return el.currentStyle[prop] ? el.currentStyle[prop] : null;
                };
                return this;
            };
        }
        /* exported addEvent, removeEvent, getChildren, setAttributes, addClass, removeClass, forEach */
        // fn arg can be an object or a function, thanks to handleEvent
        // read more at: http://www.thecssninja.com/javascript/handleevent
        var addEvent = function(el, evt, fn, bubble) {
            if ("addEventListener" in el) {
                // BBOS6 doesn't support handleEvent, catch and polyfill
                try {
                    el.addEventListener(evt, fn, bubble);
                } catch (e) {
                    if (typeof fn === "object" && fn.handleEvent) {
                        el.addEventListener(evt, function(e) {
                            // Bind fn as this and set first arg as event object
                            fn.handleEvent.call(fn, e);
                        }, bubble);
                    } else {
                        throw e;
                    }
                }
            } else if ("attachEvent" in el) {
                // check if the callback is an object and contains handleEvent
                if (typeof fn === "object" && fn.handleEvent) {
                    el.attachEvent("on" + evt, function() {
                        // Bind fn as this
                        fn.handleEvent.call(fn);
                    });
                } else {
                    el.attachEvent("on" + evt, fn);
                }
            }
        },

            removeEvent = function(el, evt, fn, bubble) {
                if ("removeEventListener" in el) {
                    try {
                        el.removeEventListener(evt, fn, bubble);
                    } catch (e) {
                        if (typeof fn === "object" && fn.handleEvent) {
                            el.removeEventListener(evt, function(e) {
                                fn.handleEvent.call(fn, e);
                            }, bubble);
                        } else {
                            throw e;
                        }
                    }
                } else if ("detachEvent" in el) {
                    if (typeof fn === "object" && fn.handleEvent) {
                        el.detachEvent("on" + evt, function() {
                            fn.handleEvent.call(fn);
                        });
                    } else {
                        el.detachEvent("on" + evt, fn);
                    }
                }
            },

            getChildren = function(e) {
                if (e.children.length < 1) {
                    throw new Error("The Nav container has no containing elements");
                }
                // Store all children in array
                var children = [];
                // Loop through children and store in array if child != TextNode
                for (var i = 0; i < e.children.length; i++) {
                    if (e.children[i].nodeType === 1) {
                        children.push(e.children[i]);
                    }
                }
                return children;
            },

            setAttributes = function(el, attrs) {
                for (var key in attrs) {
                    el.setAttribute(key, attrs[key]);
                }
            },

            addClass = function(el, cls) {
                if (el.className.indexOf(cls) !== 0) {
                    el.className += " " + cls;
                    el.className = el.className.replace(/(^\s*)|(\s*$)/g, "");
                }
            },

            removeClass = function(el, cls) {
                var reg = new RegExp("(\\s|^)" + cls + "(\\s|$)");
                el.className = el.className.replace(reg, " ").replace(/(^\s*)|(\s*$)/g, "");
            },

            // forEach method that passes back the stuff we need
            forEach = function(array, callback, scope) {
                for (var i = 0; i < array.length; i++) {
                    callback.call(scope, i, array[i]);
                }
            };

        var nav,
            opts,
            navToggle,
            styleElement = document.createElement("style"),
            htmlEl = document.documentElement,
            hasAnimFinished,
            isMobile,
            navOpen;

        var ResponsiveNav = function(el, options) {
            var i;

            // Default options
            this.options = {
                animate: true, // Boolean: Use CSS3 transitions, true or false
                transition: 284, // Integer: Speed of the transition, in milliseconds
                label: "Menu", // String: Label for the navigation toggle
                insert: "before", // String: Insert the toggle before or after the navigation
                customToggle: "", // Selector: Specify the ID of a custom toggle
                closeOnNavClick: true, // Boolean: Close the navigation when one of the links are clicked
                openPos: "relative", // String: Position of the opened nav, relative or static
                navClass: "nav-collapse", // String: Default CSS class. If changed, you need to edit the CSS too!
                navActiveClass: "js-nav-active", // String: Class that is added to <html> element when nav is active
                jsClass: "js", // String: 'JS enabled' class which is added to <html> element
                init: function() {}, // Function: Init callback
                open: function() {}, // Function: Open callback
                close: function() {} // Function: Close callback
            };

            // User defined options
            for (i in options) {
                this.options[i] = options[i];
            }

            // Adds "js" class for <html>
            addClass(htmlEl, this.options.jsClass);

            // Wrapper
            this.wrapperEl = el.replace("#", "");

            // Try selecting ID first
            if (document.getElementById(this.wrapperEl)) {
                this.wrapper = document.getElementById(this.wrapperEl);

                // If element with an ID doesn't exist, use querySelector
            } else if (document.querySelector(this.wrapperEl)) {
                this.wrapper = document.querySelector(this.wrapperEl);

                // If element doesn't exists, stop here.
            } else {
                throw new Error("The nav element you are trying to select doesn't exist");
            }

            // Inner wrapper
            this.wrapper.inner = getChildren(this.wrapper);

            // For minification
            opts = this.options;
            nav = this.wrapper;

            // Init
            this._init(this);
        };

        ResponsiveNav.prototype = {

            // Public methods
            destroy: function() {
                this._removeStyles();
                removeClass(nav, "closed");
                removeClass(nav, "opened");
                removeClass(nav, opts.navClass);
                removeClass(nav, opts.navClass + "-" + this.index);
                removeClass(htmlEl, opts.navActiveClass);
                nav.removeAttribute("style");
                nav.removeAttribute("aria-hidden");

                removeEvent(window, "resize", this, false);
                removeEvent(document.body, "touchmove", this, false);
                removeEvent(navToggle, "touchstart", this, false);
                removeEvent(navToggle, "touchend", this, false);
                removeEvent(navToggle, "mouseup", this, false);
                removeEvent(navToggle, "keyup", this, false);
                removeEvent(navToggle, "click", this, false);

                if (!opts.customToggle) {
                    navToggle.parentNode.removeChild(navToggle);
                } else {
                    navToggle.removeAttribute("aria-hidden");
                }
            },

            toggle: function() {
                if (hasAnimFinished === true) {
                    if (!navOpen) {
                        this.open();
                    } else {
                        this.close();
                    }
                }
            },

            open: function() {
                if (!navOpen) {
                    removeClass(nav, "closed");
                    addClass(nav, "opened");
                    addClass(htmlEl, opts.navActiveClass);
                    addClass(navToggle, "active");
                    nav.style.position = opts.openPos;
                    setAttributes(nav, {
                        "aria-hidden": "false"
                    });
                    navOpen = true;
                    opts.open();
                }
            },

            close: function() {
                if (navOpen) {
                    addClass(nav, "closed");
                    removeClass(nav, "opened");
                    removeClass(htmlEl, opts.navActiveClass);
                    removeClass(navToggle, "active");
                    setAttributes(nav, {
                        "aria-hidden": "true"
                    });

                    if (opts.animate) {
                        hasAnimFinished = false;
                        setTimeout(function() {
                            nav.style.position = "absolute";
                            hasAnimFinished = true;
                        }, opts.transition + 10);
                    } else {
                        nav.style.position = "absolute";
                    }

                    navOpen = false;
                    opts.close();
                }
            },

            resize: function() {
                if (window.getComputedStyle(navToggle, null).getPropertyValue("display") !== "none") {

                    isMobile = true;
                    setAttributes(navToggle, {
                        "aria-hidden": "false"
                    });

                    // If the navigation is hidden
                    if (nav.className.match(/(^|\s)closed(\s|$)/)) {
                        setAttributes(nav, {
                            "aria-hidden": "true"
                        });
                        nav.style.position = "absolute";
                    }

                    this._createStyles();
                    this._calcHeight();
                } else {

                    isMobile = false;
                    setAttributes(navToggle, {
                        "aria-hidden": "true"
                    });
                    setAttributes(nav, {
                        "aria-hidden": "false"
                    });
                    nav.style.position = opts.openPos;
                    this._removeStyles();
                }
            },

            handleEvent: function(e) {
                var evt = e || window.event;

                switch (evt.type) {
                    case "touchstart":
                        this._onTouchStart(evt);
                        break;
                    case "touchmove":
                        this._onTouchMove(evt);
                        break;
                    case "touchend":
                    case "mouseup":
                        this._onTouchEnd(evt);
                        break;
                    case "click":
                        this._preventDefault(evt);
                        break;
                    case "keyup":
                        this._onKeyUp(evt);
                        break;
                    case "resize":
                        this.resize(evt);
                        break;
                }
            },

            // Private methods
            _init: function() {
                this.index = index++;

                addClass(nav, opts.navClass);
                addClass(nav, opts.navClass + "-" + this.index);
                addClass(nav, "closed");
                hasAnimFinished = true;
                navOpen = false;

                this._closeOnNavClick();
                this._createToggle();
                this._transitions();
                this.resize();

                // IE8 hack
                var self = this;
                setTimeout(function() {
                    self.resize();
                }, 20);

                addEvent(window, "resize", this, false);
                addEvent(document.body, "touchmove", this, false);
                addEvent(navToggle, "touchstart", this, false);
                addEvent(navToggle, "touchend", this, false);
                addEvent(navToggle, "mouseup", this, false);
                addEvent(navToggle, "keyup", this, false);
                addEvent(navToggle, "click", this, false);

                // Init callback
                opts.init();
            },

            _createStyles: function() {
                if (!styleElement.parentNode) {
                    styleElement.type = "text/css";
                    document.getElementsByTagName("head")[0].appendChild(styleElement);
                }
            },

            _removeStyles: function() {
                if (styleElement.parentNode) {
                    styleElement.parentNode.removeChild(styleElement);
                }
            },

            _createToggle: function() {
                if (!opts.customToggle) {
                    var toggle = document.createElement("a");
                    toggle.innerHTML = opts.label;
                    setAttributes(toggle, {
                        "href": "#",
                        "class": "nav-toggle"
                    });

                    if (opts.insert === "after") {
                        nav.parentNode.insertBefore(toggle, nav.nextSibling);
                    } else {
                        nav.parentNode.insertBefore(toggle, nav);
                    }

                    navToggle = toggle;
                } else {
                    var toggleEl = opts.customToggle.replace("#", "");

                    if (document.getElementById(toggleEl)) {
                        navToggle = document.getElementById(toggleEl);
                    } else if (document.querySelector(toggleEl)) {
                        navToggle = document.querySelector(toggleEl);
                    } else {
                        throw new Error("The custom nav toggle you are trying to select doesn't exist");
                    }
                }
            },

            _closeOnNavClick: function() {
                if (opts.closeOnNavClick && "querySelectorAll" in document) {
                    var links = nav.querySelectorAll("a"),
                        self = this;
                    forEach(links, function(i, el) {
                        addEvent(links[i], "click", function() {
                            if (isMobile) {
                                self.toggle();
                            }
                        }, false);
                    });
                }
            },

            _preventDefault: function(e) {
                if (e.preventDefault) {
                    e.preventDefault();
                    e.stopPropagation();
                } else {
                    e.returnValue = false;
                }
            },

            _onTouchStart: function(e) {
                e.stopPropagation();
                if (opts.insert === "after") {
                    addClass(document.body, "disable-pointer-events");
                }
                this.startX = e.touches[0].clientX;
                this.startY = e.touches[0].clientY;
                this.touchHasMoved = false;
                removeEvent(navToggle, "mouseup", this, false);
            },

            _onTouchMove: function(e) {
                if (Math.abs(e.touches[0].clientX - this.startX) > 10 ||
                    Math.abs(e.touches[0].clientY - this.startY) > 10) {
                    this.touchHasMoved = true;
                }
            },

            _onTouchEnd: function(e) {
                this._preventDefault(e);
                if (!this.touchHasMoved) {
                    if (e.type === "touchend") {
                        this.toggle();
                        if (opts.insert === "after") {
                            setTimeout(function() {
                                removeClass(document.body, "disable-pointer-events");
                            }, opts.transition + 300);
                        }
                        return;
                    } else {
                        var evt = e || window.event;
                        // If it isn't a right click
                        if (!(evt.which === 3 || evt.button === 2)) {
                            this.toggle();
                        }
                    }
                }
            },

            _onKeyUp: function(e) {
                var evt = e || window.event;
                if (evt.keyCode === 13) {
                    this.toggle();
                }
            },

            _transitions: function() {
                if (opts.animate) {
                    var objStyle = nav.style,
                        transition = "max-height " + opts.transition + "ms";

                    objStyle.WebkitTransition = transition;
                    objStyle.MozTransition = transition;
                    objStyle.OTransition = transition;
                    objStyle.transition = transition;
                }
            },

            _calcHeight: function() {
                var savedHeight = 0;
                for (var i = 0; i < nav.inner.length; i++) {
                    savedHeight += nav.inner[i].offsetHeight;
                }
                var innerStyles = "." + opts.jsClass + " ." + opts.navClass + "-" + this.index + ".opened{max-height:" + savedHeight + "px !important}";

                if (styleElement.styleSheet) {
                    styleElement.styleSheet.cssText = innerStyles;
                } else {
                    styleElement.innerHTML = innerStyles;
                }

                innerStyles = "";
            }

        };

        return new ResponsiveNav(el, options);

    };

    window.responsiveNav = responsiveNav;

}(document, window, 0));
/*! jQuery UI - v1.9.2 - 2014-03-21
* http://jqueryui.com
* Includes: jquery.ui.effect.js
* Copyright 2014 jQuery Foundation and other contributors; Licensed MIT */

jQuery.effects||function(e,t){var i=e.uiBackCompat!==!1,a="ui-effects-";e.effects={effect:{}},function(t,i){function a(e,t,i){var a=c[t.type]||{};return null==e?i||!t.def?null:t.def:(e=a.floor?~~e:parseFloat(e),isNaN(e)?t.def:a.mod?(e+a.mod)%a.mod:0>e?0:e>a.max?a.max:e)}function s(e){var a=u(),s=a._rgba=[];return e=e.toLowerCase(),m(l,function(t,n){var r,o=n.re.exec(e),h=o&&n.parse(o),l=n.space||"rgba";return h?(r=a[l](h),a[d[l].cache]=r[d[l].cache],s=a._rgba=r._rgba,!1):i}),s.length?("0,0,0,0"===s.join()&&t.extend(s,r.transparent),a):r[e]}function n(e,t,i){return i=(i+1)%1,1>6*i?e+6*(t-e)*i:1>2*i?t:2>3*i?e+6*(t-e)*(2/3-i):e}var r,o="backgroundColor borderBottomColor borderLeftColor borderRightColor borderTopColor color columnRuleColor outlineColor textDecorationColor textEmphasisColor".split(" "),h=/^([\-+])=\s*(\d+\.?\d*)/,l=[{re:/rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*(?:,\s*(\d+(?:\.\d+)?)\s*)?\)/,parse:function(e){return[e[1],e[2],e[3],e[4]]}},{re:/rgba?\(\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*(?:,\s*(\d+(?:\.\d+)?)\s*)?\)/,parse:function(e){return[2.55*e[1],2.55*e[2],2.55*e[3],e[4]]}},{re:/#([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})/,parse:function(e){return[parseInt(e[1],16),parseInt(e[2],16),parseInt(e[3],16)]}},{re:/#([a-f0-9])([a-f0-9])([a-f0-9])/,parse:function(e){return[parseInt(e[1]+e[1],16),parseInt(e[2]+e[2],16),parseInt(e[3]+e[3],16)]}},{re:/hsla?\(\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*(?:,\s*(\d+(?:\.\d+)?)\s*)?\)/,space:"hsla",parse:function(e){return[e[1],e[2]/100,e[3]/100,e[4]]}}],u=t.Color=function(e,i,a,s){return new t.Color.fn.parse(e,i,a,s)},d={rgba:{props:{red:{idx:0,type:"byte"},green:{idx:1,type:"byte"},blue:{idx:2,type:"byte"}}},hsla:{props:{hue:{idx:0,type:"degrees"},saturation:{idx:1,type:"percent"},lightness:{idx:2,type:"percent"}}}},c={"byte":{floor:!0,max:255},percent:{max:1},degrees:{mod:360,floor:!0}},p=u.support={},f=t("<p>")[0],m=t.each;f.style.cssText="background-color:rgba(1,1,1,.5)",p.rgba=f.style.backgroundColor.indexOf("rgba")>-1,m(d,function(e,t){t.cache="_"+e,t.props.alpha={idx:3,type:"percent",def:1}}),u.fn=t.extend(u.prototype,{parse:function(n,o,h,l){if(n===i)return this._rgba=[null,null,null,null],this;(n.jquery||n.nodeType)&&(n=t(n).css(o),o=i);var c=this,p=t.type(n),f=this._rgba=[];return o!==i&&(n=[n,o,h,l],p="array"),"string"===p?this.parse(s(n)||r._default):"array"===p?(m(d.rgba.props,function(e,t){f[t.idx]=a(n[t.idx],t)}),this):"object"===p?(n instanceof u?m(d,function(e,t){n[t.cache]&&(c[t.cache]=n[t.cache].slice())}):m(d,function(t,i){var s=i.cache;m(i.props,function(e,t){if(!c[s]&&i.to){if("alpha"===e||null==n[e])return;c[s]=i.to(c._rgba)}c[s][t.idx]=a(n[e],t,!0)}),c[s]&&0>e.inArray(null,c[s].slice(0,3))&&(c[s][3]=1,i.from&&(c._rgba=i.from(c[s])))}),this):i},is:function(e){var t=u(e),a=!0,s=this;return m(d,function(e,n){var r,o=t[n.cache];return o&&(r=s[n.cache]||n.to&&n.to(s._rgba)||[],m(n.props,function(e,t){return null!=o[t.idx]?a=o[t.idx]===r[t.idx]:i})),a}),a},_space:function(){var e=[],t=this;return m(d,function(i,a){t[a.cache]&&e.push(i)}),e.pop()},transition:function(e,t){var i=u(e),s=i._space(),n=d[s],r=0===this.alpha()?u("transparent"):this,o=r[n.cache]||n.to(r._rgba),h=o.slice();return i=i[n.cache],m(n.props,function(e,s){var n=s.idx,r=o[n],l=i[n],u=c[s.type]||{};null!==l&&(null===r?h[n]=l:(u.mod&&(l-r>u.mod/2?r+=u.mod:r-l>u.mod/2&&(r-=u.mod)),h[n]=a((l-r)*t+r,s)))}),this[s](h)},blend:function(e){if(1===this._rgba[3])return this;var i=this._rgba.slice(),a=i.pop(),s=u(e)._rgba;return u(t.map(i,function(e,t){return(1-a)*s[t]+a*e}))},toRgbaString:function(){var e="rgba(",i=t.map(this._rgba,function(e,t){return null==e?t>2?1:0:e});return 1===i[3]&&(i.pop(),e="rgb("),e+i.join()+")"},toHslaString:function(){var e="hsla(",i=t.map(this.hsla(),function(e,t){return null==e&&(e=t>2?1:0),t&&3>t&&(e=Math.round(100*e)+"%"),e});return 1===i[3]&&(i.pop(),e="hsl("),e+i.join()+")"},toHexString:function(e){var i=this._rgba.slice(),a=i.pop();return e&&i.push(~~(255*a)),"#"+t.map(i,function(e){return e=(e||0).toString(16),1===e.length?"0"+e:e}).join("")},toString:function(){return 0===this._rgba[3]?"transparent":this.toRgbaString()}}),u.fn.parse.prototype=u.fn,d.hsla.to=function(e){if(null==e[0]||null==e[1]||null==e[2])return[null,null,null,e[3]];var t,i,a=e[0]/255,s=e[1]/255,n=e[2]/255,r=e[3],o=Math.max(a,s,n),h=Math.min(a,s,n),l=o-h,u=o+h,d=.5*u;return t=h===o?0:a===o?60*(s-n)/l+360:s===o?60*(n-a)/l+120:60*(a-s)/l+240,i=0===d||1===d?d:.5>=d?l/u:l/(2-u),[Math.round(t)%360,i,d,null==r?1:r]},d.hsla.from=function(e){if(null==e[0]||null==e[1]||null==e[2])return[null,null,null,e[3]];var t=e[0]/360,i=e[1],a=e[2],s=e[3],r=.5>=a?a*(1+i):a+i-a*i,o=2*a-r;return[Math.round(255*n(o,r,t+1/3)),Math.round(255*n(o,r,t)),Math.round(255*n(o,r,t-1/3)),s]},m(d,function(e,s){var n=s.props,r=s.cache,o=s.to,l=s.from;u.fn[e]=function(e){if(o&&!this[r]&&(this[r]=o(this._rgba)),e===i)return this[r].slice();var s,h=t.type(e),d="array"===h||"object"===h?e:arguments,c=this[r].slice();return m(n,function(e,t){var i=d["object"===h?e:t.idx];null==i&&(i=c[t.idx]),c[t.idx]=a(i,t)}),l?(s=u(l(c)),s[r]=c,s):u(c)},m(n,function(i,a){u.fn[i]||(u.fn[i]=function(s){var n,r=t.type(s),o="alpha"===i?this._hsla?"hsla":"rgba":e,l=this[o](),u=l[a.idx];return"undefined"===r?u:("function"===r&&(s=s.call(this,u),r=t.type(s)),null==s&&a.empty?this:("string"===r&&(n=h.exec(s),n&&(s=u+parseFloat(n[2])*("+"===n[1]?1:-1))),l[a.idx]=s,this[o](l)))})})}),m(o,function(e,i){t.cssHooks[i]={set:function(e,a){var n,r,o="";if("string"!==t.type(a)||(n=s(a))){if(a=u(n||a),!p.rgba&&1!==a._rgba[3]){for(r="backgroundColor"===i?e.parentNode:e;(""===o||"transparent"===o)&&r&&r.style;)try{o=t.css(r,"backgroundColor"),r=r.parentNode}catch(h){}a=a.blend(o&&"transparent"!==o?o:"_default")}a=a.toRgbaString()}try{e.style[i]=a}catch(l){}}},t.fx.step[i]=function(e){e.colorInit||(e.start=u(e.elem,i),e.end=u(e.end),e.colorInit=!0),t.cssHooks[i].set(e.elem,e.start.transition(e.end,e.pos))}}),t.cssHooks.borderColor={expand:function(e){var t={};return m(["Top","Right","Bottom","Left"],function(i,a){t["border"+a+"Color"]=e}),t}},r=t.Color.names={aqua:"#00ffff",black:"#000000",blue:"#0000ff",fuchsia:"#ff00ff",gray:"#808080",green:"#008000",lime:"#00ff00",maroon:"#800000",navy:"#000080",olive:"#808000",purple:"#800080",red:"#ff0000",silver:"#c0c0c0",teal:"#008080",white:"#ffffff",yellow:"#ffff00",transparent:[null,null,null,0],_default:"#ffffff"}}(jQuery),function(){function i(){var t,i,a=this.ownerDocument.defaultView?this.ownerDocument.defaultView.getComputedStyle(this,null):this.currentStyle,s={};if(a&&a.length&&a[0]&&a[a[0]])for(i=a.length;i--;)t=a[i],"string"==typeof a[t]&&(s[e.camelCase(t)]=a[t]);else for(t in a)"string"==typeof a[t]&&(s[t]=a[t]);return s}function a(t,i){var a,s,r={};for(a in i)s=i[a],t[a]!==s&&(n[a]||(e.fx.step[a]||!isNaN(parseFloat(s)))&&(r[a]=s));return r}var s=["add","remove","toggle"],n={border:1,borderBottom:1,borderColor:1,borderLeft:1,borderRight:1,borderTop:1,borderWidth:1,margin:1,padding:1};e.each(["borderLeftStyle","borderRightStyle","borderBottomStyle","borderTopStyle"],function(t,i){e.fx.step[i]=function(e){("none"!==e.end&&!e.setAttr||1===e.pos&&!e.setAttr)&&(jQuery.style(e.elem,i,e.end),e.setAttr=!0)}}),e.effects.animateClass=function(t,n,r,o){var h=e.speed(n,r,o);return this.queue(function(){var n,r=e(this),o=r.attr("class")||"",l=h.children?r.find("*").andSelf():r;l=l.map(function(){var t=e(this);return{el:t,start:i.call(this)}}),n=function(){e.each(s,function(e,i){t[i]&&r[i+"Class"](t[i])})},n(),l=l.map(function(){return this.end=i.call(this.el[0]),this.diff=a(this.start,this.end),this}),r.attr("class",o),l=l.map(function(){var t=this,i=e.Deferred(),a=jQuery.extend({},h,{queue:!1,complete:function(){i.resolve(t)}});return this.el.animate(this.diff,a),i.promise()}),e.when.apply(e,l.get()).done(function(){n(),e.each(arguments,function(){var t=this.el;e.each(this.diff,function(e){t.css(e,"")})}),h.complete.call(r[0])})})},e.fn.extend({_addClass:e.fn.addClass,addClass:function(t,i,a,s){return i?e.effects.animateClass.call(this,{add:t},i,a,s):this._addClass(t)},_removeClass:e.fn.removeClass,removeClass:function(t,i,a,s){return i?e.effects.animateClass.call(this,{remove:t},i,a,s):this._removeClass(t)},_toggleClass:e.fn.toggleClass,toggleClass:function(i,a,s,n,r){return"boolean"==typeof a||a===t?s?e.effects.animateClass.call(this,a?{add:i}:{remove:i},s,n,r):this._toggleClass(i,a):e.effects.animateClass.call(this,{toggle:i},a,s,n)},switchClass:function(t,i,a,s,n){return e.effects.animateClass.call(this,{add:i,remove:t},a,s,n)}})}(),function(){function s(t,i,a,s){return e.isPlainObject(t)&&(i=t,t=t.effect),t={effect:t},null==i&&(i={}),e.isFunction(i)&&(s=i,a=null,i={}),("number"==typeof i||e.fx.speeds[i])&&(s=a,a=i,i={}),e.isFunction(a)&&(s=a,a=null),i&&e.extend(t,i),a=a||i.duration,t.duration=e.fx.off?0:"number"==typeof a?a:a in e.fx.speeds?e.fx.speeds[a]:e.fx.speeds._default,t.complete=s||i.complete,t}function n(t){return!t||"number"==typeof t||e.fx.speeds[t]?!0:"string"!=typeof t||e.effects.effect[t]?!1:i&&e.effects[t]?!1:!0}e.extend(e.effects,{version:"1.9.2",save:function(e,t){for(var i=0;t.length>i;i++)null!==t[i]&&e.data(a+t[i],e[0].style[t[i]])},restore:function(e,i){var s,n;for(n=0;i.length>n;n++)null!==i[n]&&(s=e.data(a+i[n]),s===t&&(s=""),e.css(i[n],s))},setMode:function(e,t){return"toggle"===t&&(t=e.is(":hidden")?"show":"hide"),t},getBaseline:function(e,t){var i,a;switch(e[0]){case"top":i=0;break;case"middle":i=.5;break;case"bottom":i=1;break;default:i=e[0]/t.height}switch(e[1]){case"left":a=0;break;case"center":a=.5;break;case"right":a=1;break;default:a=e[1]/t.width}return{x:a,y:i}},createWrapper:function(t){if(t.parent().is(".ui-effects-wrapper"))return t.parent();var i={width:t.outerWidth(!0),height:t.outerHeight(!0),"float":t.css("float")},a=e("<div></div>").addClass("ui-effects-wrapper").css({fontSize:"100%",background:"transparent",border:"none",margin:0,padding:0}),s={width:t.width(),height:t.height()},n=document.activeElement;try{n.id}catch(r){n=document.body}return t.wrap(a),(t[0]===n||e.contains(t[0],n))&&e(n).focus(),a=t.parent(),"static"===t.css("position")?(a.css({position:"relative"}),t.css({position:"relative"})):(e.extend(i,{position:t.css("position"),zIndex:t.css("z-index")}),e.each(["top","left","bottom","right"],function(e,a){i[a]=t.css(a),isNaN(parseInt(i[a],10))&&(i[a]="auto")}),t.css({position:"relative",top:0,left:0,right:"auto",bottom:"auto"})),t.css(s),a.css(i).show()},removeWrapper:function(t){var i=document.activeElement;return t.parent().is(".ui-effects-wrapper")&&(t.parent().replaceWith(t),(t[0]===i||e.contains(t[0],i))&&e(i).focus()),t},setTransition:function(t,i,a,s){return s=s||{},e.each(i,function(e,i){var n=t.cssUnit(i);n[0]>0&&(s[i]=n[0]*a+n[1])}),s}}),e.fn.extend({effect:function(){function t(t){function i(){e.isFunction(n)&&n.call(s[0]),e.isFunction(t)&&t()}var s=e(this),n=a.complete,r=a.mode;(s.is(":hidden")?"hide"===r:"show"===r)?i():o.call(s[0],a,i)}var a=s.apply(this,arguments),n=a.mode,r=a.queue,o=e.effects.effect[a.effect],h=!o&&i&&e.effects[a.effect];return e.fx.off||!o&&!h?n?this[n](a.duration,a.complete):this.each(function(){a.complete&&a.complete.call(this)}):o?r===!1?this.each(t):this.queue(r||"fx",t):h.call(this,{options:a,duration:a.duration,callback:a.complete,mode:a.mode})},_show:e.fn.show,show:function(e){if(n(e))return this._show.apply(this,arguments);var t=s.apply(this,arguments);return t.mode="show",this.effect.call(this,t)},_hide:e.fn.hide,hide:function(e){if(n(e))return this._hide.apply(this,arguments);var t=s.apply(this,arguments);return t.mode="hide",this.effect.call(this,t)},__toggle:e.fn.toggle,toggle:function(t){if(n(t)||"boolean"==typeof t||e.isFunction(t))return this.__toggle.apply(this,arguments);var i=s.apply(this,arguments);return i.mode="toggle",this.effect.call(this,i)},cssUnit:function(t){var i=this.css(t),a=[];return e.each(["em","px","%","pt"],function(e,t){i.indexOf(t)>0&&(a=[parseFloat(i),t])}),a}})}(),function(){var t={};e.each(["Quad","Cubic","Quart","Quint","Expo"],function(e,i){t[i]=function(t){return Math.pow(t,e+2)}}),e.extend(t,{Sine:function(e){return 1-Math.cos(e*Math.PI/2)},Circ:function(e){return 1-Math.sqrt(1-e*e)},Elastic:function(e){return 0===e||1===e?e:-Math.pow(2,8*(e-1))*Math.sin((80*(e-1)-7.5)*Math.PI/15)},Back:function(e){return e*e*(3*e-2)},Bounce:function(e){for(var t,i=4;((t=Math.pow(2,--i))-1)/11>e;);return 1/Math.pow(4,3-i)-7.5625*Math.pow((3*t-2)/22-e,2)}}),e.each(t,function(t,i){e.easing["easeIn"+t]=i,e.easing["easeOut"+t]=function(e){return 1-i(1-e)},e.easing["easeInOut"+t]=function(e){return.5>e?i(2*e)/2:1-i(-2*e+2)/2}})}()}(jQuery);

/**
 * fullPage 2.2.5
 * https://github.com/alvarotrigo/fullPage.js
 * MIT licensed
 *
 * Copyright (C) 2013 alvarotrigo.com - A project by Alvaro Trigo
 */
(function(a){a.fn.fullpage=function(c){function M(){a(".fp-section").each(function(){var b=a(this).find(".fp-slide");b.length?b.each(function(){z(a(this))}):z(a(this))});a.isFunction(c.afterRender)&&c.afterRender.call(this)}function N(){if(!c.autoScrolling){var b=a(window).scrollTop(),d=a(".fp-section").map(function(){if(a(this).offset().top<b+100)return a(this)}),d=d[d.length-1];if(!d.hasClass("active")){var e=a(".fp-section.active").index(".fp-section")+1;F=!0;var f=G(d);d.addClass("active").siblings().removeClass("active");
var g=d.data("anchor");a.isFunction(c.onLeave)&&c.onLeave.call(this,e,d.index(".fp-section")+1,f);a.isFunction(c.afterLoad)&&c.afterLoad.call(this,g,d.index(".fp-section")+1);H(g);I(g,0);c.anchors.length&&!t&&(v=g,location.hash=g);clearTimeout(O);O=setTimeout(function(){F=!1},100)}}}function da(b){var d=b.originalEvent;c.autoScrolling&&b.preventDefault();if(!P(b.target)&&(b=a(".fp-section.active"),!t&&!p))if(d=Q(d),w=d.y,A=d.x,b.find(".fp-slides").length&&Math.abs(B-A)>Math.abs(x-w))Math.abs(B-A)>
a(window).width()/100*c.touchSensitivity&&(B>A?a.fn.fullpage.moveSlideRight():a.fn.fullpage.moveSlideLeft());else if(c.autoScrolling&&(d=b.find(".fp-slides").length?b.find(".fp-slide.active").find(".fp-scrollable"):b.find(".fp-scrollable"),Math.abs(x-w)>a(window).height()/100*c.touchSensitivity))if(x>w)if(0<d.length)if(C("bottom",d))a.fn.fullpage.moveSectionDown();else return!0;else a.fn.fullpage.moveSectionDown();else if(w>x)if(0<d.length)if(C("top",d))a.fn.fullpage.moveSectionUp();else return!0;
else a.fn.fullpage.moveSectionUp()}function P(b,d){d=d||0;var e=a(b).parent();return d<c.normalScrollElementTouchThreshold&&e.is(c.normalScrollElements)?!0:d==c.normalScrollElementTouchThreshold?!1:P(e,++d)}function ea(b){b=Q(b.originalEvent);x=b.y;B=b.x}function n(b){if(c.autoScrolling){b=window.event||b;b=Math.max(-1,Math.min(1,b.wheelDelta||-b.deltaY||-b.detail));var d;d=a(".fp-section.active");if(!t)if(d=d.find(".fp-slides").length?d.find(".fp-slide.active").find(".fp-scrollable"):d.find(".fp-scrollable"),
0>b)if(0<d.length)if(C("bottom",d))a.fn.fullpage.moveSectionDown();else return!0;else a.fn.fullpage.moveSectionDown();else if(0<d.length)if(C("top",d))a.fn.fullpage.moveSectionUp();else return!0;else a.fn.fullpage.moveSectionUp();return!1}}function R(b){var d=a(".fp-section.active").find(".fp-slides");if(d.length&&!p){var e=d.find(".fp-slide.active"),f=null,f="prev"===b?e.prev(".fp-slide"):e.next(".fp-slide");if(!f.length){if(!c.loopHorizontal)return;f="prev"===b?e.siblings(":last"):e.siblings(":first")}p=
!0;q(d,f)}}function k(b,d,e){var f={},g=b.position();if("undefined"!==typeof g){var g=g.top,y=G(b),r=b.data("anchor"),h=b.index(".fp-section"),p=b.find(".fp-slide.active"),s=a(".fp-section.active"),l=s.index(".fp-section")+1,E=D;if(p.length)var n=p.data("anchor"),q=p.index();if(c.autoScrolling&&c.continuousVertical&&"undefined"!==typeof e&&(!e&&"up"==y||e&&"down"==y)){e?a(".fp-section.active").before(s.nextAll(".fp-section")):a(".fp-section.active").after(s.prevAll(".fp-section").get().reverse());
u(a(".fp-section.active").position().top);var k=s,g=b.position(),g=g.top,y=G(b)}b.addClass("active").siblings().removeClass("active");t=!0;"undefined"!==typeof r&&S(q,n,r);c.autoScrolling?(f.top=-g,b=".fullpage-wrapper"):(f.scrollTop=g,b="html, body");var m=function(){k&&k.length&&(e?a(".fp-section:first").before(k):a(".fp-section:last").after(k),u(a(".fp-section.active").position().top))};c.css3&&c.autoScrolling?(a.isFunction(c.onLeave)&&!E&&c.onLeave.call(this,l,h+1,y),T("translate3d(0px, -"+g+
"px, 0px)",!0),setTimeout(function(){m();a.isFunction(c.afterLoad)&&!E&&c.afterLoad.call(this,r,h+1);setTimeout(function(){t=!1;a.isFunction(d)&&d.call(this)},600)},c.scrollingSpeed)):(a.isFunction(c.onLeave)&&!E&&c.onLeave.call(this,l,h+1,y),a(b).animate(f,c.scrollingSpeed,c.easing,function(){m();a.isFunction(c.afterLoad)&&!E&&c.afterLoad.call(this,r,h+1);setTimeout(function(){t=!1;a.isFunction(d)&&d.call(this)},600)}));v=r;c.autoScrolling&&(H(r),I(r,h))}}function U(){if(!F){var b=window.location.hash.replace("#",
"").split("/"),a=b[0],b=b[1];if(a.length){var c="undefined"===typeof v,f="undefined"===typeof v&&"undefined"===typeof b&&!p;(a&&a!==v&&!c||f||!p&&J!=b)&&K(a,b)}}}function q(b,d){var e=d.position(),f=b.find(".fp-slidesContainer").parent(),g=d.index(),h=b.closest(".fp-section"),r=h.index(".fp-section"),k=h.data("anchor"),l=h.find(".fp-slidesNav"),s=d.data("anchor"),m=D;if(c.onSlideLeave){var n=h.find(".fp-slide.active").index(),q;q=n==g?"none":n>g?"left":"right";m||a.isFunction(c.onSlideLeave)&&c.onSlideLeave.call(this,
k,r+1,n,q)}d.addClass("active").siblings().removeClass("active");"undefined"===typeof s&&(s=g);c.loopHorizontal||(h.find(".fp-controlArrow.fp-prev").toggle(0!=g),h.find(".fp-controlArrow.fp-next").toggle(!d.is(":last-child")));h.hasClass("active")&&S(g,s,k);c.css3?(e="translate3d(-"+e.left+"px, 0px, 0px)",b.find(".fp-slidesContainer").toggleClass("fp-easing",0<c.scrollingSpeed).css(V(e)),setTimeout(function(){m||a.isFunction(c.afterSlideLoad)&&c.afterSlideLoad.call(this,k,r+1,s,g);p=!1},c.scrollingSpeed,
c.easing)):f.animate({scrollLeft:e.left},c.scrollingSpeed,c.easing,function(){m||a.isFunction(c.afterSlideLoad)&&c.afterSlideLoad.call(this,k,r+1,s,g);p=!1});l.find(".active").removeClass("active");l.find("li").eq(g).find("a").addClass("active")}function fa(b,d){if(825>b||900>d){var c=Math.min(100*b/825,100*d/900).toFixed(2);a("body").css("font-size",c+"%")}else a("body").css("font-size","100%")}function I(b,d){c.navigation&&(a("#fp-nav").find(".active").removeClass("active"),b?a("#fp-nav").find('a[href="#'+
b+'"]').addClass("active"):a("#fp-nav").find("li").eq(d).find("a").addClass("active"))}function H(b){c.menu&&(a(c.menu).find(".active").removeClass("active"),a(c.menu).find('[data-menuanchor="'+b+'"]').addClass("active"))}function C(b,a){if("top"===b)return!a.scrollTop();if("bottom"===b)return a.scrollTop()+1+a.innerHeight()>=a[0].scrollHeight}function G(b){var c=a(".fp-section.active").index(".fp-section");b=b.index(".fp-section");return c>b?"up":"down"}function z(b){b.css("overflow","hidden");var a=
b.closest(".fp-section"),e=b.find(".fp-scrollable");if(e.length)var f=e.get(0).scrollHeight;else f=b.get(0).scrollHeight,c.verticalCentered&&(f=b.find(".fp-tableCell").get(0).scrollHeight);a=l-parseInt(a.css("padding-bottom"))-parseInt(a.css("padding-top"));f>a?e.length?e.css("height",a+"px").parent().css("height",a+"px"):(c.verticalCentered?b.find(".fp-tableCell").wrapInner('<div class="fp-scrollable" />'):b.wrapInner('<div class="fp-scrollable" />'),b.find(".fp-scrollable").slimScroll({allowPageScroll:!0,
height:a+"px",size:"10px",alwaysVisible:!0})):W(b);b.css("overflow","")}function W(a){a.find(".fp-scrollable").children().first().unwrap().unwrap();a.find(".slimScrollBar").remove();a.find(".slimScrollRail").remove()}function X(a){a.addClass("fp-table").wrapInner('<div class="fp-tableCell" style="height:'+Y(a)+'px;" />')}function Y(a){var d=l;if(c.paddingTop||c.paddingBottom)d=a,d.hasClass("fp-section")||(d=a.closest(".fp-section")),a=parseInt(d.css("padding-top"))+parseInt(d.css("padding-bottom")),
d=l-a;return d}function T(a,c){h.toggleClass("fp-easing",c);h.css(V(a))}function K(b,c){"undefined"===typeof c&&(c=0);var e=isNaN(b)?a('[data-anchor="'+b+'"]'):a(".fp-section").eq(b-1);b===v||e.hasClass("active")?Z(e,c):k(e,function(){Z(e,c)})}function Z(a,c){if("undefined"!=typeof c){var e=a.find(".fp-slides"),f=e.find('[data-anchor="'+c+'"]');f.length||(f=e.find(".fp-slide").eq(c));f.length&&q(e,f)}}function ga(a,d){a.append('<div class="fp-slidesNav"><ul></ul></div>');var e=a.find(".fp-slidesNav");
e.addClass(c.slidesNavPosition);for(var f=0;f<d;f++)e.find("ul").append('<li><a href="#"><span></span></a></li>');e.css("margin-left","-"+e.width()/2+"px");e.find("li").first().find("a").addClass("active")}function S(a,d,e){var f="";c.anchors.length&&(a?("undefined"!==typeof e&&(f=e),"undefined"===typeof d&&(d=a),J=d,location.hash=f+"/"+d):("undefined"!==typeof a&&(J=d),location.hash=e))}function ha(){var a=document.createElement("p"),c,e={webkitTransform:"-webkit-transform",OTransform:"-o-transform",
msTransform:"-ms-transform",MozTransform:"-moz-transform",transform:"transform"};document.body.insertBefore(a,null);for(var f in e)void 0!==a.style[f]&&(a.style[f]="translate3d(1px,1px,1px)",c=window.getComputedStyle(a).getPropertyValue(e[f]));document.body.removeChild(a);return void 0!==c&&0<c.length&&"none"!==c}function $(){return window.PointerEvent?{down:"pointerdown",move:"pointermove"}:{down:"MSPointerDown",move:"MSPointerMove"}}function Q(a){var c=[];window.navigator.msPointerEnabled?(c.y=
a.pageY,c.x=a.pageX):(c.y=a.touches[0].pageY,c.x=a.touches[0].pageX);return c}function aa(b){var d=c.scrollingSpeed;a.fn.fullpage.setScrollingSpeed(0);q(b.closest(".fp-slides"),b);a.fn.fullpage.setScrollingSpeed(d)}function u(a){c.css3?T("translate3d(0px, -"+a+"px, 0px)",!1):h.css("top",-a)}function V(a){return{"-webkit-transform":a,"-moz-transform":a,"-ms-transform":a,transform:a}}function ia(){u(0);a("#fp-nav, .fp-slidesNav, .fp-controlArrow").remove();a(".fp-section").css({height:"","background-color":"",
padding:""});a(".fp-slide").css({width:""});h.css({height:"",position:"","-ms-touch-action":""});a(".fp-section, .fp-slide").each(function(){W(a(this));a(this).removeClass("fp-table active")});h.find(".fp-easing").removeClass("fp-easing");h.find(".fp-tableCell, .fp-slidesContainer, .fp-slides").each(function(){a(this).replaceWith(this.childNodes)});a("html, body").scrollTop(0);h.addClass("fullpage-used")}c=a.extend({verticalCentered:!0,resize:!0,sectionsColor:[],anchors:[],scrollingSpeed:700,easing:"easeInQuart",
menu:!1,navigation:!1,navigationPosition:"right",navigationColor:"#000",navigationTooltips:[],slidesNavigation:!1,slidesNavPosition:"bottom",controlArrowColor:"#fff",loopBottom:!1,loopTop:!1,loopHorizontal:!0,autoScrolling:!0,scrollOverflow:!1,css3:!1,paddingTop:0,paddingBottom:0,fixedElements:null,normalScrollElements:null,keyboardScrolling:!0,touchSensitivity:5,continuousVertical:!1,animateAnchor:!0,normalScrollElementTouchThreshold:5,sectionSelector:".section",slideSelector:".slide",afterLoad:null,
onLeave:null,afterRender:null,afterResize:null,afterSlideLoad:null,onSlideLeave:null},c);c.continuousVertical&&(c.loopTop||c.loopBottom)&&(c.continuousVertical=!1,console&&console.log&&console.log("Option loopTop/loopBottom is mutually exclusive with continuousVertical; continuousVertical disabled"));a.fn.fullpage.setAutoScrolling=function(b){c.autoScrolling=b;b=a(".fp-section.active");c.autoScrolling?(a("html, body").css({overflow:"hidden",height:"100%"}),b.length&&u(b.position().top)):(a("html, body").css({overflow:"visible",
height:"initial"}),u(0),a("html, body").scrollTop(b.position().top))};a.fn.fullpage.setScrollingSpeed=function(a){c.scrollingSpeed=a};a.fn.fullpage.setMouseWheelScrolling=function(a){a?document.addEventListener?(document.addEventListener("mousewheel",n,!1),document.addEventListener("wheel",n,!1)):document.attachEvent("onmousewheel",n):document.addEventListener?(document.removeEventListener("mousewheel",n,!1),document.removeEventListener("wheel",n,!1)):document.detachEvent("onmousewheel",n)};a.fn.fullpage.setAllowScrolling=
function(b){if(b){if(a.fn.fullpage.setMouseWheelScrolling(!0),L||ba)MSPointer=$(),a(document).off("touchstart "+MSPointer.down).on("touchstart "+MSPointer.down,ea),a(document).off("touchmove "+MSPointer.move).on("touchmove "+MSPointer.move,da)}else if(a.fn.fullpage.setMouseWheelScrolling(!1),L||ba)MSPointer=$(),a(document).off("touchstart "+MSPointer.down),a(document).off("touchmove "+MSPointer.move)};a.fn.fullpage.setKeyboardScrolling=function(a){c.keyboardScrolling=a};var p=!1,L=navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|BB10|Windows Phone|Tizen|Bada)/),
ba="ontouchstart"in window||0<navigator.msMaxTouchPoints,h=a(this),l=a(window).height(),t=!1,D=!1,v,J;a.fn.fullpage.setAllowScrolling(!0);c.css3&&(c.css3=ha());a(this).length?(h.css({height:"100%",position:"relative","-ms-touch-action":"none"}),h.addClass("fullpage-wrapper")):console.error("Error! Fullpage.js needs to be initialized with a selector. For example: $('#myContainer').fullpage();");a(c.sectionSelector).each(function(){a(this).addClass("fp-section")});a(c.slideSelector).each(function(){a(this).addClass("fp-slide")});
if(c.navigation){a("body").append('<div id="fp-nav"><ul></ul></div>');var m=a("#fp-nav");m.css("color",c.navigationColor);m.addClass(c.navigationPosition)}a(".fp-section").each(function(b){var d=a(this),e=a(this).find(".fp-slide"),f=e.length;b||0!==a(".fp-section.active").length||a(this).addClass("active");a(this).css("height",l+"px");(c.paddingTop||c.paddingBottom)&&a(this).css("padding",c.paddingTop+" 0 "+c.paddingBottom+" 0");"undefined"!==typeof c.sectionsColor[b]&&a(this).css("background-color",
c.sectionsColor[b]);"undefined"!==typeof c.anchors[b]&&a(this).attr("data-anchor",c.anchors[b]);if(c.navigation){var g="";c.anchors.length&&(g=c.anchors[b]);b=c.navigationTooltips[b];"undefined"===typeof b&&(b="");m.find("ul").append('<li data-tooltip="'+b+'"><a href="#'+g+'"><span></span></a></li>')}if(1<f){var g=100*f,h=100/f;e.wrapAll('<div class="fp-slidesContainer" />');e.parent().wrap('<div class="fp-slides" />');a(this).find(".fp-slidesContainer").css("width",g+"%");a(this).find(".fp-slides").after('<div class="fp-controlArrow fp-prev"></div><div class="fp-controlArrow fp-next"></div>');
"#fff"!=c.controlArrowColor&&(a(this).find(".fp-controlArrow.fp-next").css("border-color","transparent transparent transparent "+c.controlArrowColor),a(this).find(".fp-controlArrow.fp-prev").css("border-color","transparent "+c.controlArrowColor+" transparent transparent"));c.loopHorizontal||a(this).find(".fp-controlArrow.fp-prev").hide();c.slidesNavigation&&ga(a(this),f);e.each(function(b){a(this).css("width",h+"%");c.verticalCentered&&X(a(this))});d=d.find(".fp-slide.active");0==d.length?e.eq(0).addClass("active"):
aa(d)}else c.verticalCentered&&X(a(this))}).promise().done(function(){a.fn.fullpage.setAutoScrolling(c.autoScrolling);var b=a(".fp-section.active").find(".fp-slide.active");b.length&&(0!=a(".fp-section.active").index(".fp-section")||0==a(".fp-section.active").index(".fp-section")&&0!=b.index())&&aa(b);c.fixedElements&&c.css3&&a(c.fixedElements).appendTo("body");c.navigation&&(m.css("margin-top","-"+m.height()/2+"px"),m.find("li").eq(a(".fp-section.active").index(".fp-section")).find("a").addClass("active"));
c.menu&&c.css3&&a(c.menu).closest(".fullpage-wrapper").length&&a(c.menu).appendTo("body");c.scrollOverflow?(h.hasClass("fullpage-used")&&M(),a(window).on("load",M)):a.isFunction(c.afterRender)&&c.afterRender.call(this);b=window.location.hash.replace("#","").split("/")[0];if(b.length){var d=a('[data-anchor="'+b+'"]');!c.animateAnchor&&d.length&&(c.autoScrolling?u(d.position().top):(u(0),a("html, body").scrollTop(d.position().top)),H(b),I(b,null),a.isFunction(c.afterLoad)&&c.afterLoad.call(this,b,d.index(".fp-section")+
1),d.addClass("active").siblings().removeClass("active"))}a(window).on("load",function(){var a=window.location.hash.replace("#","").split("/"),b=a[0],a=a[1];b&&K(b,a)})});var O,F=!1;a(window).on("scroll",N);var x=0,B=0,w=0,A=0;a.fn.fullpage.moveSectionUp=function(){var b=a(".fp-section.active").prev(".fp-section");b.length||!c.loopTop&&!c.continuousVertical||(b=a(".fp-section").last());b.length&&k(b,null,!0)};a.fn.fullpage.moveSectionDown=function(){var b=a(".fp-section.active").next(".fp-section");
b.length||!c.loopBottom&&!c.continuousVertical||(b=a(".fp-section").first());b.length&&k(b,null,!1)};a.fn.fullpage.moveTo=function(b,c){var e="",e=isNaN(b)?a('[data-anchor="'+b+'"]'):a(".fp-section").eq(b-1);"undefined"!==typeof c?K(b,c):0<e.length&&k(e)};a.fn.fullpage.moveSlideRight=function(){R("next")};a.fn.fullpage.moveSlideLeft=function(){R("prev")};a(window).on("hashchange",U);a(document).keydown(function(b){if(c.keyboardScrolling&&!t)switch(b.which){case 38:case 33:a.fn.fullpage.moveSectionUp();
break;case 40:case 34:a.fn.fullpage.moveSectionDown();break;case 36:a.fn.fullpage.moveTo(1);break;case 35:a.fn.fullpage.moveTo(a(".fp-section").length);break;case 37:a.fn.fullpage.moveSlideLeft();break;case 39:a.fn.fullpage.moveSlideRight()}});a(document).on("click","#fp-nav a",function(b){b.preventDefault();b=a(this).parent().index();k(a(".fp-section").eq(b))});a(document).on({mouseenter:function(){var b=a(this).data("tooltip");a('<div class="fp-tooltip '+c.navigationPosition+'">'+b+"</div>").hide().appendTo(a(this)).fadeIn(200)},
mouseleave:function(){a(this).find(".fp-tooltip").fadeOut(200,function(){a(this).remove()})}},"#fp-nav li");c.normalScrollElements&&(a(document).on("mouseenter",c.normalScrollElements,function(){a.fn.fullpage.setMouseWheelScrolling(!1)}),a(document).on("mouseleave",c.normalScrollElements,function(){a.fn.fullpage.setMouseWheelScrolling(!0)}));a(".fp-section").on("click",".fp-controlArrow",function(){a(this).hasClass("fp-prev")?a.fn.fullpage.moveSlideLeft():a.fn.fullpage.moveSlideRight()});a(".fp-section").on("click",
".toSlide",function(b){b.preventDefault();b=a(this).closest(".fp-section").find(".fp-slides");b.find(".fp-slide.active");var c=null,c=b.find(".fp-slide").eq(a(this).data("index")-1);0<c.length&&q(b,c)});var ca;a(window).resize(function(){L?a.fn.fullpage.reBuild():(clearTimeout(ca),ca=setTimeout(a.fn.fullpage.reBuild,500))});a.fn.fullpage.reBuild=function(){D=!0;var b=a(window).width();l=a(window).height();c.resize&&fa(l,b);a(".fp-section").each(function(){parseInt(a(this).css("padding-bottom"));parseInt(a(this).css("padding-top"));
c.verticalCentered&&a(this).find(".fp-tableCell").css("height",Y(a(this))+"px");a(this).css("height",l+"px");if(c.scrollOverflow){var b=a(this).find(".fp-slide");b.length?b.each(function(){z(a(this))}):z(a(this))}b=a(this).find(".fp-slides");b.length&&q(b,b.find(".fp-slide.active"))});a(".fp-section.active").position();b=a(".fp-section.active");b.index(".fp-section")&&k(b);D=!1;a.isFunction(c.afterResize)&&c.afterResize.call(this)};a(document).on("click",".fp-slidesNav a",function(b){b.preventDefault();
b=a(this).closest(".fp-section").find(".fp-slides");var c=b.find(".fp-slide").eq(a(this).closest("li").index());q(b,c)});a.fn.fullpage.destroy=function(b){a.fn.fullpage.setAutoScrolling(!1);a.fn.fullpage.setAllowScrolling(!1);a.fn.fullpage.setKeyboardScrolling(!1);a(window).off("scroll",N).off("hashchange",U);a(document).off("click","#fp-nav a").off("mouseenter","#fp-nav li").off("mouseleave","#fp-nav li").off("click",".fp-slidesNav a").off("mouseover",c.normalScrollElements).off("mouseout",c.normalScrollElements);
a(".fp-section").off("click",".fp-controlArrow").off("click",".toSlide");b&&ia()}}})(jQuery);
// run animation on text and other blocks

function runAnimation(){

    // name slide
    $('.slName').animate({
        opacity: 1,
        top: '10'
    }, 500, function(){
        $('.slName').animate({
            top:0
        }, 300);
    });

    // dev slide
    setTimeout(showDev, 800);
    function showDev() {
        $('.slDev').animate({
            opacity: 1,
            right: '10'
        }, 500, function(){
            $('.slDev').animate({
                right: 0
            }, 300);
        });
    };

    // des slide
    setTimeout(showDes, 1600);
    function showDes() {
        $('.slDes').animate({
            opacity: 1,
            bottom: '10'
        }, 500, function(){
            $('.slDes').animate({
                bottom: 0
            }, 300);
        });
    };

    // code slide
    setTimeout(showCode, 2400);
    function showCode() {
        $('.slCode').animate({
            opacity: 1,
            left: '10'
        }, 500, function(){
            $('.slCode').animate({
                left: 0
            }, 300);
        });
    };

    // web slide
    setTimeout(showWeb, 3200);
    function showWeb() {
        $('.slWeb').animate({
            opacity: 1,
            right: '10'
        }, 500, function(){
            $('.slWeb').animate({
                right: 0
            }, 300);
        });
    };

}; // end of function
// var sayHello = require('./say-hello');// example of Browserify require

$(window).load( function () {
    // DEVELOPMENT
    //    $('.popUp').fadeOut(1); // destroy pop up div
    //    runAnimation(); // first slide animation start
    // PRODUCTION
    setTimeout (popUp, 2000);
    function popUp(){
    // blow away each spinner ball
    $(function() {
        // hide balls
        $('.preLoader li').each(function(i) {
            $(this).addClass('noAnimation');
            $(this).delay(200*i).animate({
                opacity: 0,
                top: '-=300'
            }, 150, 'linear' );
        });
    });
    // hide loading text
    $('.preLoader h1').animate({
            opacity: 0,
            left: '-=500'
        }, 2000, function(){
            $('.popUp').fadeOut(500); // destroy pop up div
            runAnimation(); // first slide animation start
        });
    }
});

$(document).ready(function() {

    // sayHello();// example of Browserify require

    // navigation MAIN MENU
    var navigation = responsiveNav(".nav-collapse", {
        animate: true,
        transition: 160,
        closeOnNavClick: false
    });

    /* Every time the window is scrolled ... */
    $(window).scroll( function(){
        /* Check the location of each desired element */
        $('.hideme').each( function(i){
            var bottom_of_object = $(this).position().top + $(this).outerHeight();
            var bottom_of_window = $(window).scrollTop() + $(window).height();
            /* If the object is completely visible in the window, fade it in */
            if( bottom_of_window > bottom_of_object ){
                $(this).animate({'opacity':'1'},500);
            }
        });
    });

    //initialize full screen pages
    $('#slideBlocks').fullpage({
        verticalCentered: false,
        resize: false,
        sectionsColor : [],
        anchors:['wellcome', 'web', 'design', 'skills', 'about' ],
        scrollingSpeed: 300,
        easing: 'easeInQuart',
        menu: false,
        navigation: true,
        navigationPosition: 'right',
        navigationTooltips: [],
        slidesNavigation: true,
        slidesNavPosition: 'bottom',
        loopBottom: false,
        loopTop: false,
        loopHorizontal: false,
        autoScrolling: true,
        scrollOverflow: false,
        css3: true,
        paddingTop: '0',
        paddingBottom: '0',
        normalScrollElements: '#element1, .element2',
        normalScrollElementTouchThreshold: 5,
        keyboardScrolling: true,
        touchSensitivity: 10,
        continuousVertical: false,
        animateAnchor: true,
        sectionSelector: '.section',
        slideSelector: '.slide',

        //events
        onLeave: function(index, nextIndex, direction){},
        afterLoad: function(anchorLink, index){},
        afterRender: function(){},
        afterResize: function(){},
        afterSlideLoad: function(anchorLink, index, slideAnchor, slideIndex){},
        onSlideLeave: function(anchorLink, index, slideIndex, direction){}
    })

    // fix ios bug with landscape mode
    var buggyIOS = /\b(?:iPhone|iPod|iPad).*?\bOS 7/.test(window.navigator.userAgent);
    if (buggyIOS) {
        //alert('buggyIOS');
        $(window).on('orientationchange', function () {
            window.scrollTo(0, 0);
        });
    }



    // DEBUG / / / / / / / / / / / / / / / / / / / / / /
    // ORIENTATION DETECTION
    //$(window).on("orientationchange",function(){
    //    alert($(window).width());
    //    if (window.orientation == 90){
    //        //alert($(window).width());
    //    }else{
    //        //alert($(window).width());
    //    }
    //});

    //div.tag // make only real examples :)
    //div.tag     var skills;
    //div.tag     skills = {
    //div.tag         layout: 'html',
    //div.tag         style: 'css',
    //div.tag         programming: 'javascript',
    //div.tag         design: 'photoshop'
    //div.tag     };
    //div.tag     for (var key in skills) {
    //div.tag         if (skills.hasOwnProperty(key)) {
    //div.tag             console.log(skills[key] + ' - is good!');
    //div.tag         }
    //div.tag     }
});