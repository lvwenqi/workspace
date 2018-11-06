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
        imgUrls: [
            'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
            'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
            'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg'
        ],
        swiperCurrent: 1,
        swiperLength: 3
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        console.log(options)
        var scene = decodeURIComponent(options.scene)

    },
    swiperChange: function(e) {
        this.setData({
            current: e.detail.current
        })
    },
})