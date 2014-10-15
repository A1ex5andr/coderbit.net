$(document).ready(function() {

    // set .codeCover-amount color considering amount of % done
    $(function () {
        $('.codeCover-amount').each(function () {
            var target = $(this);
            var value = parseInt(target.html());
            value >= 50 ? target.css('color', '#44572b') : target.css('color', '#743e15')
        });
    }());

    //data blocks popUp to be developed
    $('.data-bl-metrics,.data-bl-build,.data-bl-uTest,.data-bl-fTest, .data-bl .btn').click(function (event) {
       alert('Hi there :) PopUp window is Under Construction');
        event.stopPropagation();
    });

    //chart uTest
    jsEasyCharts.pie(
        'chart-uTest_1', [73,27], { altText: 'Unit Test', colour: '84ab50,d47c3a', size: '100x100'}
    );
    jsEasyCharts.pie(
        'chart-uTest_2', [73,27], { altText: 'Unit Test', colour: '84ab50,d47c3a', size: '100x100'}
    );
    jsEasyCharts.pie(
        'chart-uTest_3', [73,27], { altText: 'Unit Test', colour: '84ab50,d47c3a', size: '100x100'}
    );
    jsEasyCharts.pie(
        'chart-uTest_4', [73,27], { altText: 'Unit Test', colour: '84ab50,d47c3a', size: '100x100'}
    );
    jsEasyCharts.pie(
        'chart-fTest_1', [68,42], { altText: 'Unit Test', colour: '84ab50,d47c3a', size: '100x100' }
    );
    jsEasyCharts.pie(
        'chart-fTest_2', [68,42], { altText: 'Unit Test', colour: '84ab50,d47c3a', size: '100x100' }
    );
    jsEasyCharts.pie(
        'chart-fTest_3', [68,42], { altText: 'Unit Test', colour: '84ab50,d47c3a', size: '100x100' }
    );
    jsEasyCharts.pie(
        'chart-fTest_4', [68,42], { altText: 'Unit Test', colour: '84ab50,d47c3a', size: '100x100' }
    );
});


