var utils = require('../../utils/util.js')
var mta = require('../../utils/mta_analysis.js');
var app = getApp()
Page({
    data: {
        indicatorDots: true,
        autoplay: true,
        interval: 3000,
        duration: 500,
        imgUrls: [],
        countTimeList: [],
        itemList: [],
        startTime: 0,
        endTime: [],
        isIpx: app.globalData.isIpx ? 1 : 0
    },
    onLoad: function() {
        var _this = this;
        wx.request({
            url: 'https://wx.rdtuijian.com/wx-application/mall/flashsale/init.action?page=1&size=10',
            header: {
                'content-type': 'application/json'
            },
            success: function(res) {
                if (res.data.code == 0) {
                    _this.setData({
                        startTime: res.data.s_stamp
                    })
                    var data = res.data.data;
                    if (data.f_banner.length) {
                        _this.setData({
                            imgUrls: data.f_banner
                        })
                    }
                    if (data.f_coupons.length) {
                        _this.setData({
                            itemList: data.f_coupons
                        })
                        var arr = []
                        for (let i = 0; i < _this.data.itemList.length; i++) {
                            var time = { start: _this.data.startTime, end: _this.data.itemList[i].g_endTime };
                            arr.push(time);
                        }
                        _this.setData({
                            endTime: arr
                        })
                        for (let j = 0; j < _this.data.endTime.length; j++) {
                            _this.countTime(j, _this.data.endTime[j].end, _this.data.endTime[j].start, _this)
                        }
                    }
                }
            }
        })
    },
    bannerTap(e) {
        console.log(e)
        wx.navigateTo({
            url: '/pages/feature/feature?id=' + e.currentTarget.dataset.id
        })

    },
    timeFormat(param) {
        return param < 10 ? '0' + param : param;
    },
    countTime(i, end, now, that) {
        var now = now;
        var leftTime = end - now;
        var h, m, s, count;
        if (leftTime >= 0) {

            h = that.timeFormat(Math.floor(leftTime / 1000 / 60 / 60));
            m = that.timeFormat(Math.floor(leftTime / 1000 / 60 % 60));
            s = that.timeFormat(Math.floor(leftTime / 1000 % 60));
            now = now + 1000;
            count = { h: h, m: m, s: s }
        } else {
            count = { h: '00', m: '00', s: '00' }
        }
        var up = "countTimeList[" + i + "]";
        that.setData({
            [up]: count
        })
        setTimeout(function() { that.countTime(i, end, now, that) }, 1000);
    },
    goDetail(e) {
        wx.navigateTo({
            url: '/pages/detail/detail?id=' + e.currentTarget.dataset.id
        })
    },
    onShareAppMessage(res) {
        if (res.from === 'button') {
            // 来自页面内转发按钮
            console.log(res.target)
        }
        return {
            title: '2M²甄选',
            path: '/pages/index/index'
        }
    }
})