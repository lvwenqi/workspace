$(function() {
    $('.fuzhi_btn').click(function() {
        var url = window.location.href;
        $('#copyValue').val(url);
        var clipboard = new ClipboardJS('.fuzhi_btn');
        //safari 版本号>=10，提示复制成功；否则提示需在文字选中后，手动选择“拷贝”进行复制
        clipboard.on('success', function(e) {
            alert('复制成功')
            e.clearSelection();
        });
        clipboard.on('error', function(e) {

        });
    })
    var mySwiper = new Swiper('.swiper-container', {
        autoplay: 3000, //可选选项，自动滑动
        pagination: '.swiper-pagination',
        paginationClickable: true
    })

    function shareCallback(result) {

    }

    var Client = function() {
            this.now = 1532507646483;
            this.end = 1532680200000;
            this.end2 = 1532680811000;
            this.shareImgUrlDefault = 'www.baidu.com'
        }
        //---------------------------------------------------------------------------------------  倒计时
    Client.prototype.countTime = function(dom, end, now) {

            //时间差  
            var now = now;
            var leftTime = end - now;
            var _this = this;
            //定义变量 d,h,m,s保存倒计时的时间  
            var d, h, m, s;
            if (leftTime >= 0) {
                h = Math.floor(leftTime / 1000 / 60 / 60);
                m = Math.floor(leftTime / 1000 / 60 % 60);
                s = Math.floor(leftTime / 1000 % 60);
            }
            dom.find('.h').html(this.zero(h) + "时")
            dom.find('.m').html(this.zero(m) + "分")
            dom.find('.s').html(this.zero(s) + "秒")

            now = now + 1000;
            setTimeout(function() { _this.countTime(dom, end, now) }, 1000);
        }
        //-------------------------------------------------------------------------------------------   补零

    Client.prototype.zero = function(num) {
            if (num < 10) {
                num = '0' + num
            }
            return num
        }
        //-------------------------------------------------------------------------------------------  wps端内分享
    Client.prototype.shareWx = function(share_scene, title, shareCallback, selfShareUrl) {
        if (window.splash) {
            client.shareTo(title, shareCallback, selfShareUrl, (share_scene == 'timeline' ? "friends-cycle" : "friends"));
        } else {
            var data = { title: title, imageUrl: client.shareImgUrlDefault, url: selfShareUrl };
            window.webkit.messageHandlers.CallCustomizeShare.postMessage(data);
            shareCallback(null);
        }
    }

    Client.prototype.shareTo = function(title, shareCallback, selfShareUrl, share_scene) {
            var appType = 'shareToWechat';
            var opt = {
                title: title, //'测试你的潜力，看看什么职业更适合你？',
                desc: '很便捷!',
                link: selfShareUrl, // 分享链接
                imgUrl: client.shareImgUrlDefault,
                shareType: share_scene, //分享类型（"friends-cycle","friends"） { 朋友圈，好友 }
                shareStyle: 'card', //分享类型（"text","card"）{ 文本，卡片式 }
                success: function(res) {
                    if (null != shareCallback)
                        shareCallback(null);
                },
                cancel: function(res) {
                    if (null != shareCallback)
                        shareCallback(null);
                },
                fail: function(res) {
                    if (null != shareCallback)
                        shareCallback(null);
                },
                complete: function(res) {
                    if (null != shareCallback)
                        shareCallback(null);
                }
            };
            var parseOptions = parseApiOptions(opt)
            var callbacks = parseOptions.callbacks
            var options = parseOptions.options
            var callbackID = client.generateCallback(appType, callbacks)
            if (window.splash) {
                window.splash.invoke(appType, JSON.stringify(options), callbackID)
            } else {
                shareCallback(null);
            }
        }
        //------------------------------------------------------------------------------------------------ h5设置微信分享
    Client.prototype.shareWeChatByWX = function(callbackFun, url) {
            client.getTicket(function(jsonData) {
                // timestamp = jsonData.timestamp;
                // if (!isWeiXin()) {
                //     try {
                //         var serverStamp = jsonData.stamp;
                //         if (serverStamp != null && serverStamp != undefined && serverStamp != '') {
                //             var data = $.cookie('selfStamp');
                //             if (data != serverStamp) {
                //                 window.splash.JSSetClipboardText(serverStamp);
                //                 $.cookie('selfStamp', serverStamp, { expires: 1 });
                //             }
                //         }
                //     } catch (exception) {

                //     }
                // }
                callbackFun(jsonData);
            }, url);
        }
        //------------------------------------------------------------------------------------------------- 获取微信分享签名
    Client.prototype.getTicket = function(callbackFun, selfUrl) {

            $.ajax({
                url: "http://pay.rdtuijian.com/wx-application/ltb/querytoken.action?shareurl=" + selfUrl,
                type: 'get',
                dataType: 'json',
                success: function(result) {
                    callbackFun(result);
                },
                error: function(data) {
                    callbackFun(data);
                }
            });
        }
        //-------------------------------------------------------------------------------------------------- 分享设置
    Client.prototype.wxShareFuction = function(jsonData, title) {
        wx.config({
            debug: false,
            appId: "wxc703231e060959af",
            timestamp: jsonData.timestamp,
            nonceStr: jsonData.noncestr,
            signature: jsonData.sign,

            jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage'] // 功能列表，我们要使用JS-SDK的什么功能
        });
        //config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在 页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready 函数中。
        wx.ready(function() {
            // 获取“分享到朋友圈”按钮点击状态及自定义分享内容接口
            wx.onMenuShareTimeline({
                title: title, // 分享标题
                link: jsonData.shareUrl,
                imgUrl: client.shareImgUrlDefault, // 分享图标
                success: function() {},
                cancel: function() {}
            });
            // 获取“分享给朋友”按钮点击状态及自定义分享内容接口
            wx.onMenuShareAppMessage({
                title: title, // 分享标题
                desc: "真的很好用哦！", // 分享描述
                link: jsonData.shareUrl,
                imgUrl: client.shareImgUrlDefault, // 分享图标
                type: 'link', // 分享类型,music、video或link，不填默认为link
                success: function() {},
                cancel: function() {}
            });
        });
    }
    Client.prototype.generateCallback = function(apiName, callbacks) {
        var callbackID = apiName + +new Date()
        window[callbackID] = function(res) {
            res = JSON.parse(res)
            var errMsg = res.errMsg
            var e = errMsg.indexOf(':')
            var result = errMsg.substring(e + 1);
            switch (result) {
                case 'ok':
                    callbacks.success && callbacks.success(res);
                    break;
                case 'cancel':
                    callbacks.cancel && callbacks.cancel(res);
                    break;
                default:
                    callbacks.fail && callbacks.fail(res);
            }
            callbacks.complete && callbacks.complete(res)
            delete window[callbackID]
        }
        return callbackID
    }
    var client = new Client();
    client.countTime($('#time1'), client.end, client.now)
    client.countTime($('#time2'), client.end2, client.now)

    client.shareWeChatByWX(function(jsonData) {
        client.wxShareFuction(jsonData, '摧毁一个中年人有多容易？');
    }, window.location.href);
    client.shareWx('sdfj', function() {}, 'sdlfjsl', 'sdkfjlsk')
})