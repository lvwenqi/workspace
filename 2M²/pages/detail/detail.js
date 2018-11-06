// pages/detail/detail.js
var app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        current: 0,
        autoplay: true,
        interval: 3000,
        duration: 500,
        imgUrls: [],
        imgDetail: [],
        goods: {},
        gid: '',
        creator: {},
        count: {},
        buy: true,
        buyText: '抢购中'
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var _this = this;
        if (options.id) {
            this.setData({
                gid: options.id
            })
        }
        wx.request({
            url: 'https://wx.rdtuijian.com/wx-application/mall/flashsale/detail.action?gid=' + this.data.gid,
            header: {
                'content-type': 'application/json'
            },
            success: function(res) {
                if (res.data.code == 0) {
                    var data = res.data.data;
                    if (JSON.parse(data.f_goods.g_images)) {
                        _this.setData({
                            imgUrls: JSON.parse(data.f_goods.g_images),
                            imgDetail: JSON.parse(data.f_goods.g_detail)
                        })
                    }
                    _this.setData({
                        goods: data.f_goods,
                        gResource: data.f_goods.g_resource == 1 ? '淘宝' : data.f_goods.g_resource == 2 ? '天猫' : '京东',
                        creator: data.g_creator,
                        coupons: data.f_coupons
                    })
                    _this.countTime(data.f_goods.g_endTime, res.data.s_stamp, _this)
                }
            }
        })
    },
    swiperChange: function(e) {
        this.setData({
            current: e.detail.current
        })
    },
    timeFormat(param) {
        return param < 10 ? '0' + param : param;
    },
    countTime(end, now, that) {
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
            count = { h: '00', m: '00', s: '00' };
            that.setData({
                count: count,
                buyText: '已结束',
                buy: false
            })
            return;
        }

        that.setData({
            count: count
        })

        setTimeout(function() { that.countTime(end, now, that) }, 1000);
    },
    goDetail(e) {
        wx.redirectTo({
            url: '/pages/detail/detail?id=' + e.currentTarget.dataset.id
        })
    },
    goBuy(e) {
        wx.showToast({
            title: '还不能买哦~',
            icon: 'loading',
            duration: 2000
        })

    },
    onShareAppMessage(res) {
        return {
            title: this.data.goods.g_skuName,
            path: '/pages/detail/detail?id=' + this.data.gid
        }
    }
})