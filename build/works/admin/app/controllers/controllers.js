app.controller('adminController', function ($scope, $http) {

    $http.get('data/data.json').success(function(data) {

        $scope.bl1235 = data["bl1235"];
        $scope.bl432462_1 = data["bl432462_1"];
        $scope.bl432462_2 = data["bl432462_2"];
        $scope.bl1234 = data["bl1234"];
        $scope.bl432460 = data["bl432460"];
        $scope.bl432459 = data["bl432459"];

        setTimeout(function() {
            // этот код запустится через секунду после http success
            // должно хватить чтобы построить ДОМ
            // ugly hack но а что делать
            // show/hide blocks with details
            $('.firewall-reject .blockWrapper, .firewall-accept .blockWrapper, .build-succeed .blockWrapper').on('click', function (e) {
                var t = $(this).parent(),
                    tA = 'toggleActive',
                    speed = 100;

                if (t.hasClass(tA)) {
                    t.find('.data').slideUp(speed, function () {
                        t.find('.indicator').fadeToggle(speed);
                    });
                    t.removeClass(tA);
                } else {
                    $('.'+tA).find('.indicator').fadeToggle(speed);
                    $('.'+tA).find('.data').slideToggle(speed);
                    $('.'+tA).removeClass(tA);
                    t.addClass(tA);
                    t.find('.indicator').fadeToggle(speed, function () {
                        t.find('.data').slideDown(speed);
                    });
                }
            });
        }, 100);

    });

});