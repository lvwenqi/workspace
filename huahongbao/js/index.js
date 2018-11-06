$(document).ready(function () {

    var stores = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 100];
    var clock = false;
    var store = 0;
    var startGame = true;
    var closeTime = false;
    var t_url = 'taobao://s.click.taobao.com/p5EU2Lw';
    var o_url = 'https://s.click.taobao.com/p5EU2Lw';
    var bj = [{
        t: '4rem',
        l: '0.2rem'
    }, {
        t: '5.7rem',
        l: '5.3rem'
    }];
    $('.container').on('touchstart', function (e) {
        if (clock) {
            $(this).find('.move').append('<img src="./images/hhb_hb.png" alt="">')
            var num = stores[Math.round(Math.random() * 10)]
            store += num;
            if (num == 100) {
                var index = Math.round(Math.random());
                $('.bj').css({
                    'top': bj[index].t,
                    'left': bj[index].l
                }).show(1, function () {
                    setTimeout(function () {
                        $('.bj').hide()
                    }, 500)
                })
            }

            $('.store span').html(num);
        }
    })
    $('.container').on('touchmove', function (e) {
        if (clock) {
            if(startGame){
                selfCollectData("oct-26st-wxdt1-start");
                startGame = false;
            }
            $('.base').children('.arrow').hide();
            $('.animate').show();
            $('#count').html(store);
            $('.store').show().addClass('storemove');
            $(this).find('.move').children('img:last-child').addClass('hb')
        }
    })
    $('.container').on('touchend', function (e) {
        if (clock) {
            $(this).find('.move').children('img:last-child').prevAll().remove()
        }
    })
    $('.store').on("animationend webkitAnimationEnd", function () {
        $(this).hide()
    })

    function start(down) {

        setTimeout(function () {
            down--
            $('.count_down span').html(down)
            if (down == 0) {
                $('.count_down span').html('开始');
                $('.count_down').addClass('small_count')
                setTimeout(function () {

                    $('.count_down').hide();
                    
                    clock = true;
                    timeDown(5)
                }, 1000)
            } else {
                start(down)
            }
        }, 1000)
    }

    function timeDown(count) {
        setTimeout(function () {
            count--
            $('#time').html(count)
            if (count == 0) {
                $('.animate').hide()
                clock = false;
                if(store == 0){
                    $('.p_1 span').html('0');
                } else if (store>0&&store <= 600) {
                    $('.p_1 span').html('66.7');
                } else if (store > 600 && store <= 900) {
                    $('.p_1 span').html('86.5');
                } else if(store>900 && store <=1100){
                    $('.p_1 span').html('93.8');
                }else{
                    $('.p_1 span').html('98.6');
                }
                $('.result').show(0, function () {
                    closeTime = true;
                    // setTimeout(function () {
                    //     if (window.splash) {
                    //         if (window.splash.isInstalledApp("com.taobao.taobao")) {
                    //             selfCollectData("oct-26st-wxdt1-jump");
                    //             window.open(t_url,'_self');
                    //         } else {
                    //             window.open(o_url,'_self');
                    //         }
                    //     } else {
                    //         window.open(o_url,'_self');
                    //     }
                    // }, 500)
                })
            } else {
                timeDown(count)
            }
        }, 1000)
    }
    $('.close').click(function() {
        if (window.splash) {
            if(!closeTime){
                alert(111)
                selfCollectData("oct-26st-wxdt1-close");
            }
            window.splash.onBackPressed(true);
           
        }
    })
    setTimeout(function () { start(3)  },1000)
    function selfCollectData(data) {
        if (window.splash) {
            window.splash.collectData(data);
        }
    }
    selfCollectData("oct-26st-wxdt1-show");
})