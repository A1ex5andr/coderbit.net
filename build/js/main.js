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
// run animation on text and other blocks

function runAnimation(){

    // name slide
    $('.slName').animate({
        opacity: 1,
        top: '10'
    }, 300, function(){
        $('.slName').animate({
            top:0
        }, 100);
    });

    // dev slide
    setTimeout(showDev, 400);
    function showDev() {
        $('.slDev').animate({
            opacity: 1,
            right: '10'
        }, 300, function(){
            $('.slDev').animate({
                right: 0
            }, 100);
        });
    };

    // des slide
    setTimeout(showDes, 800);
    function showDes() {
        $('.slDes').animate({
            opacity: 1,
            bottom: '10'
        }, 300, function(){
            $('.slDes').animate({
                bottom: 0
            }, 100);
        });
    };

    // code slide
    setTimeout(showCode, 1200);
    function showCode() {
        $('.slCode').animate({
            opacity: 1,
            left: '10'
        }, 300, function(){
            $('.slCode').animate({
                left: 0
            }, 100);
        });
    };

    // web slide
    setTimeout(showWeb, 1600);
    function showWeb() {
        $('.slWeb').animate({
            opacity: 1,
            right: '10'
        }, 300, function(){
            $('.slWeb').animate({
                right: 0
            }, 100);
        });
    };

}; // end of function
// var sayHello = require('./say-hello');// example of Browserify require

$(window).load( function () {

    // DEVELOPMENT
    //    $('.popUp').fadeOut(); // destroy pop up div
        //runAnimation(); // first slide animation start
    // PRODUCTION
    setTimeout (popUp, 1600);
    function popUp(){
    // blow away each spinner ball
    $(function() {
        // hide balls
        $('.preLoader li').each(function(i) {
            $(this).addClass('noAnimation');
            $(this).delay(200*i).animate({
                opacity: 0,
                top: '-=600'
            }, 200, 'linear' );
        });
    });
    // hide loading text
    $('.preLoader h1').animate({
            opacity: 0,
            left: '-=1000'
        }, 2000, function(){
            $('.popUp').fadeOut(500); // destroy pop up div
            runAnimation(); // first slide animation start
        });
    }

});

$(document).ready(function(data) {
    // sayHello();// example of Browserify require

    // navigation MAIN MENU
    var navigation = responsiveNav(".nav-collapse", {
        animate: true,
        transition: 160,
        closeOnNavClick: false
    });


    // smooth page changes
    $('#slideBlocks, .enterAnimation').fadeIn(500);
    $(".top-logo, #navigation  a").click(function () {
        event.preventDefault();
        newLocation = this.href;
        $('#slideBlocks, .enterAnimation').fadeOut(500, newpage);
    });
    function newpage() { window.location = newLocation;}

    // DEBUG / / / / / / / / / / / / / / / / / / / / / /
    // ORIENTATION DETECTION
    //$(window).on("orientationchange",function(){
    //    alert($(window).width());
    //    if (window.orientation == 90){
    //        //alert($(window).width());
    //    }else{
    //        //alert($(window).width());ы
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

(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    (i[r].q=i[r].q || []).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','//www.google-analytics.com/analytics.js','ga');
ga('create', 'UA-44277096-1', 'auto');
ga('send', 'pageview');