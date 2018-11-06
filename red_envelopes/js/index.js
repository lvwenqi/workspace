$(function() {
    var picImg = $('.animate .pic img'),
        clockImg = $('.animate .clock img'),
        pic = $('.animate .pic');

    function openUrl(url) {
        try {
            if (window.splash.isInstalledApp("com.taobao.taobao")) {
                window.open(url, '_self');
            } else {
                window.splash.loadHyperlink(url, "webview")
            }
        } catch (exception) {
            window.open(url, '_self')
        }

    }

    function parseURL() {
        var url = location.search;
        var theRequest = new Object();
        if (url.indexOf("?") != -1) {
            var str = url.substr(1);
            strs = str.split("&");
            for (var i = 0; i < strs.length; i++) {
                theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
            }
        }
        return theRequest.adset;
    }
    var adset = parseURL() ? parseURL() : 'a';

    function getAjax(adset) {
        $.ajax({
            type: 'GET',
            url: 'https://pay.rdtuijian.com/wx-application/sales/common/init.action?adset=' + adset,
            success: function(data) {
                try {
                    if (window.splash.isInstalledApp("com.taobao.taobao")) {
                        picImg.prop('src', data.data.tb_type)
                        clockImg.prop('src', data.data.tb_bg)
                        pic.addClass('zoomIn').css('display', 'block');
                        trySuccess(data.data.tb_url)
                    } else {
                        picImg.prop('src', data.data.other_type)
                        clockImg.prop('src', data.data.other_bg)
                        pic.addClass('zoomIn').css('display', 'block');
                        trySuccess(data.data.other_url);
                    }
                } catch (exception) {
                    picImg.prop('src', data.data.other_type)
                    clockImg.prop('src', data.data.other_bg)
                    pic.addClass('zoomIn').css('display', 'block');
                    trySuccess(data.data.other_url);
                }

            },
            error: function() {
                try {
                    if (window.splash.isInstalledApp("com.taobao.taobao")) {
                        picImg.prop('src', 'https://dl.op.wpscdn.cn/odimg/2018-05-22/5b0384ac1e032.png')
                        clockImg.prop('src', 'https://dl.op.wpscdn.cn/odimg/2018-05-22/5b03856119316.png')
                        pic.addClass('zoomIn').css('display', 'block');
                        trySuccess('taobao://ai.m.taobao.com/index.html?pid=mm_35876686_13194734_74188525');
                    } else {
                        picImg.prop('src', 'https://dl.op.wpscdn.cn/odimg/2018-05-22/5b0384ac1e032.png')
                        clockImg.prop('src', 'https://dl.op.wpscdn.cn/odimg/2018-05-22/5b03856119316.png')
                        pic.addClass('zoomIn').css('display', 'block');
                        trySuccess('https://uland.taobao.com/thb?pid=mm_35876686_13194734_74188525');
                    }
                } catch (exception) {
                    picImg.prop('src', 'https://dl.op.wpscdn.cn/odimg/2018-05-22/5b0384ac1e032.png')
                    clockImg.prop('src', 'https://dl.op.wpscdn.cn/odimg/2018-05-22/5b03856119316.png')
                    pic.addClass('zoomIn').css('display', 'block');
                    trySuccess('https://uland.taobao.com/thb?pid=mm_35876686_13194734_74188525');
                }
            }

        })
    }

    function trySuccess(url) {
        var n, i, a = url,
            e = {
                data: function(n) {
                    window.splash && window.splash.collectData(n)
                },
                animation: function() {
                    e.data("op_ad_20171111_float_rain_show"),
                        $(".pic").one("animationend webkitAnimationEnd", function() {
                            setTimeout(function() {
                                    $(".pic").removeClass("zoomIn").addClass("animated fadeOut"),
                                        $(".clock").removeClass("hide").addClass("animated fadeIn")
                                }, 300),
                                setTimeout(function() {
                                    $(".time3").removeClass("hide").addClass("zoomIn")
                                }, 600)
                        }),
                        $(".time3").one("animationend webkitAnimationEnd", function() {
                            $(".time3").removeClass("zoomIn").addClass("zoomOut"),
                                setTimeout(function() {
                                    $(".time2").removeClass("hide").addClass("zoomIn")
                                }, 150)
                        }),
                        $(".time2").one("animationend webkitAnimationEnd", function() {
                            $(".time2").removeClass("zoomIn").addClass("zoomOut"),
                                setTimeout(function() {
                                    $(".time1").removeClass("hide").addClass("zoomIn")
                                }, 150)
                        }),
                        $(".time1").one("animationend webkitAnimationEnd", function() {
                            $(".time1").removeClass("zoomIn").addClass("zoomOut"),
                                setTimeout(function() {
                                    $(".time0").removeClass("hide").addClass("animated zoomIn")
                                }, 150)
                        }),
                        $(".time0").one("animationend webkitAnimationEnd", function() {
                            $(".animate").addClass("animated enlarge"),
                                $(".redrain").removeClass("hide");
                            $('#close').show();
                            var i = 0,
                                e = function() {

                                    i++
                                    if (i > 3) {
                                        openUrl(a)
                                        window.clearInterval(n)
                                        setTimeout(function() {
                                            window.splash.onBackPressed(true)
                                        }, 5000);
                                    }
                                };
                            n = window.setInterval(e, 1e3)
                        })
                },
                redrain: function() {
                    var o = 0,
                        t = 0,
                        s = !0,
                        d = parseInt($(".redrain").width()) - 80;
                    d < 0 && (d = 400);
                    var m = function() {
                        o++;
                        var i = parseInt(Math.random() * d),
                            m = parseInt(100 * Math.random() - 50) + "deg";
                        $(".rainul").append("<li class='li" + o + "'><img src='https://dl.op.wpscdn.cn/odimg/2018-05-24/5b0657f4495ba.png'></li>"),
                            $(".li" + o).css({
                                left: i
                            }),
                            $(".li" + o + " img").css({
                                transform: "rotate(" + m + ")",
                                "-webkit-transform": "rotate(" + m + ")"
                            }),
                            $(".li" + o).animate({
                                top: $(window).height()
                            }, 3500, function() {
                                this.remove()
                            }),
                            $(".li" + o).click(function() {
                                window.clearInterval(n)
                                t++;
                                if (t > 3 && Math.random() > .5) {
                                    openUrl(a);
                                    window.clearInterval(i);
                                    setTimeout(function() {
                                        window.splash.onBackPressed(true)
                                    }, 5000);
                                } else {
                                    $(this).find("img").attr("src", "https://dl.op.wpscdn.cn/odimg/2018-05-24/5b0658096cbe0.png")
                                }
                            })
                    };
                    i = window.setInterval(m, 200)
                }
            };
        e.animation(),
            e.redrain()

    }
    getAjax(adset)
    $('#close').click(function() {
        if (window.splash) {
            window.splash.onBackPressed(true)
        }
    })
});