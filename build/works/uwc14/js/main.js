$("document").ready(function($) {

    // run placeholder fix if old browsers
    $('input, textarea').placeholder();

    // check if user previously registered
    function getCookie(name) {
        var dc = document.cookie;
        var prefix = name + "=";
        var begin = dc.indexOf("; " + prefix);
        if (begin == -1) {
            begin = dc.indexOf(prefix);
            if (begin != 0) return null;
        } else {
            begin += 2;
            var end = document.cookie.indexOf(";", begin);
            if (end == -1) {
                end = dc.length;
            }
        }
        return unescape(dc.substring(begin + prefix.length, end));
    }

    // setup behaviuor on cookie existance
    function checkCookie() {
        var myCookie = getCookie("uaWeb");

        if (myCookie == null) {
            // do cookie doesn't exist stuff;
            $('.onLoad').show();
        } else {
            // do cookie exists stuff
            $('.onLoad').hide();
            $('.advContainer').hide();
            $('.social').show();
            $('.headBar').css('margin-bottom', '0');
        }
    }
    checkCookie();

    // login 
    $('.login').click(function(event) {
        $('.onLoad').hide();
        $('.social').hide();
        $('.popUp').show();
        event.preventDefault();
    });

    // show password reset block 
    $('.passReset').click(function(event) {
        $('.recoverPass').slideToggle();
        event.preventDefault();
    });

    // submit login on html tag
    $('.loginSubmit').click(function(event) {
        //$('form').submit();
        alert("Далі справа за backEnd'ом :)");
        event.preventDefault();
    });

    // reset password
    $('.passResetSend').click(function(event) {
        //$('form').submit();
        alert("Далі справа за backEnd'ом :)");
        event.preventDefault();

    });

    // submit facebook connect tag
    $('.faceConnect').click(function() {
        alert("Далі facebook API :)");
    });

    // hide login if clicked out of box
    $('.popUp').click(function(e) {
        if ($(e.target).hasClass('popUp')) {
            $('.popUp').fadeOut(300);
            checkCookie();
        };
    });

    // smooth scrolling up-to registration form
    $('#registerNow').click(function(event) {
        event.preventDefault();
        $('html, body').animate({
            scrollTop: 0
        }, 600);
        return false;
    });

    // мені дуже подобається як працює в полі input 
    // :required CSS pseudo-classes, особливо в Хромі,
    // але, нажаль, навіть safari його ще не розуміє
    // не кажучи про ie9 ))
    // тому "js наше все"
    // registration submission
    $('#regForm').on('submit', function(event) {
        var isFormValid = true;
        // check if all input fields ok!
        $("#regForm").children().each(function() {
            if ($.trim($(this).val()).length == 0) {
                $(this).addClass("highlight");
                isFormValid = false;
                event.preventDefault();
                //alert('Form submitted!');
            } else {
                $(this).removeClass("highlight");
            }

            if (isFormValid) {
                document.cookie = "uaWeb=registered; expires=Thu, 01 Oct 2014 12:00:00 GMT";
            }
        });
        // return false; 
        // наразі PHP script "register.php"
        // обробляє форму, бо, відверто кажучи,
        // не знаю як це реалізувати 
        // тільки одним АЯКСом ))
    });

    // if field has input unMask it
    $('#regForm input').on('input', function() {
        if ($.trim($(this).val()).length > 0) {
            $(this).removeClass("highlight");
        };
    });

})

$(window).load(function() {

    // contact links and form transitions
    $('.onLoad-web.transition').animate({
        opacity: 1,
        top: "+=100"
    }, 300, function() {
        $('.onLoad-phn.transition').animate({
            opacity: 1,
            top: "+=100"
        }, 300, function() {
            $('.onLoad-eml.transition').animate({
                opacity: 1,
                top: "+=100"
            }, 300, function() {
                $('.onLoad-cnt.transition').animate({
                    opacity: 1,
                    top: "+=100"
                }, 300, function() {
                    $('.onLoad-app.transition').animate({
                        opacity: 1,
                        top: "+=100"
                    }, 300, function() {
                        $('.transition>span').animate({
                            opacity: 1
                        }, 300, function() {
                            $('.onLoad>form ').animate({
                                opacity: 1
                            }, 350, function() {
                                // Animation complete.
                            });
                        });
                    });
                });
            });
        });
    });

})