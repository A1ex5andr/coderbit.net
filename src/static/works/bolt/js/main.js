// var sayHello = require('./say-hello');// example of Browserify require

$(document).ready(function() {

    // sayHello();// example of Browserify require
    $('.opt-link').hover( function() {
        var blockId = $(this).attr('id');
        $('.hover').toggle();
        $('.hover .'+blockId).toggle();
    });
});