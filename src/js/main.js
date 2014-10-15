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
    $(".top-logo, #navigation  a, .slowMoLink").click(function () {
        event.preventDefault();
        newLocation = this.href;
        $('#slideBlocks, .enterAnimation').fadeOut(500, newpage);
    });
    function newpage() { window.location = newLocation;}

    //portfolio showcase initialization
    (function() {
        $('.portfolio-link').click(function (e) {
            var id = $(this).attr("href").substr(1);
                link = id.concat("Show");
            console.log(link);
            console.log(this);
            $('.'+link).addClass('activeShow');
            $('.showPopUp').fadeIn(300);
//            $('body, html').css('overflow', 'hidden');
            $('.'+link).find('.workShow-image').attr('src', 'img/portfolio/' + id + '.jpg');
            $('.'+link).find('.imagePreLoader').fadeOut(1000, function () {
                $('.'+link).find('.workShow-image').slideDown(300);
            });
            e.preventDefault();
        });
        $('.closeShow').on('click', function () {
            $('.showPopUp').fadeOut(500, function () {
                $('.showPopUp').find('.activeShow').removeClass('activeShow');
            });
//            $('body, html').css('overflow-y', 'visible');
        });
    }());


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