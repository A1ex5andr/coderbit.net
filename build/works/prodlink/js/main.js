 $(document).ready(function() {
     $('.banner').revolution({
         delay: 9000,
         startwidth: 959,
         startheight: 371,
         autoHeight: "off",
         fullScreenAlignForce: "off",

         onHoverStop: "off",

         thumbWidth: 100,
         thumbHeight: 50,
         thumbAmount: 3,

         hideThumbsOnMobile: "on",
         hideBulletsOnMobile: "on",
         hideArrowsOnMobile: "on",
         hideThumbsUnderResoluition: 0,

         hideThumbs: 0,

         navigationType: "bullet",
         navigationArrows: "solo",
         navigationStyle: "round",

         navigationHAlign: "bottom",
         navigationVAlign: "bottom",
         navigationHOffset: 0,
         navigationVOffset: 0,

         soloArrowLeftHalign: "left",
         soloArrowLeftValign: "center",
         soloArrowLeftHOffset: 20,
         soloArrowLeftVOffset: 0,

         soloArrowRightHalign: "right",
         soloArrowRightValign: "center",
         soloArrowRightHOffset: 20,
         soloArrowRightVOffset: 0,


         touchenabled: "on",

         stopAtSlide: -1,
         stopAfterLoops: -1,
         hideCaptionAtLimit: 0,
         hideAllCaptionAtLilmit: 0,
         hideSliderAtLimit: 0,

         dottedOverlay: "none",

         fullWidth: "off",
         forceFullWidth: "off",
         fullScreen: "off",
         fullScreenOffsetContainer: "#topheader-to-offset",

         shadow: 0

     });

     $(function() {
         $('a[href*=#]:not([href=#])').click(function() {
             if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
                 var target = $(this.hash);
                 target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
                 if (target.length) {
                     $('html,body').animate({
                         scrollTop: target.offset().top
                     }, 1000);
                     return false;
                 }
             }
         });
     });

 });