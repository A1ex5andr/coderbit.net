jQuery("document").ready(function($) {

    // мені дуже подобається як працює в полі input 
    // :required CSS pseudo-classes, особливо в Хромі,
    // але, нажаль, навіть safari його ще не розуміє
    // не кажучи про ie9 ))
    // тому "js наше все"
    // registration submission
    $('#checksForm').on('submit', function(event) {
        var isFormValid = true;
        // check if all input fields ok!
        $("#checksForm").find('.reqInput').each(function() {
            if ($.trim($(this).val()).length == 0) {
                $(this).addClass("highlight");
                isFormValid = false;
                event.preventDefault();
                //alert('Form submitted!');
            } else {
                $(this).removeClass("highlight");
            }

        });
    });

    // if field has input unMask it
    $('#checksForm').find('.reqInput').on('input', function() {
        if ($.trim($(this).val()).length > 0) {
            $(this).removeClass("highlight");
        };
    });

    //customizing select arrow and functions
    //with select2 plugin
    $('#e1').select2();

})