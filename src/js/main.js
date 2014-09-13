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