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
        isIpx: app.globalData.isIpx ? 1 : 0,
        coupons: [],
        creator: {},
        desc: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        console.log(111, options)
        var _this = this;
        wx.request({
            url: 'https://wx.rdtuijian.com/wx-application/mall/flashsale/topic.action?topicId=' + options.id,
            method: 'POST',
            header: {
                'content-type': 'application/json'
            },
            success: function(res) {
                var data = res.data;
                console.log(data)
                var info = JSON.parse(data.topic_Info.topic_title)
                console.log(info)
                _this.setData({
                    coupons: data.f_coupons,
                    creator: data.g_creator,
                    desc: info.t_title,
                    imgDetail: JSON.parse(data.topic_Info.topic_Info),
                    imgUrls: info.t_pics
                })
            }
        })
    },
    onReady: function(options) {
        // console.log(222, options)
        // wx.request({
        //     url: 'https://wx.rdtuijian.com/wx-application/mall/flashsale/topic.action?topicId=' + options.id,
        //     method: 'POST',
        //     header: {
        //         'content-type': 'application/json'
        //     },
        //     success: function(res) {
        //         console.log('onready', res)
        //     }
        // })
    },
    swiperChange: function(e) {
        this.setData({
            current: e.detail.current
        })
    },
    goDetail(e) {
        wx.redirectTo({
            url: '/pages/detail/detail?id=' + e.currentTarget.dataset.id
        })
    },
    onShareAppMessage(res) {
        return {
            title: '2M²甄选',
            path: '/pages/index/index'
        }
    }
})