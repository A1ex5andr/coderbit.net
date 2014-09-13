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