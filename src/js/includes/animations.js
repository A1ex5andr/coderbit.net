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