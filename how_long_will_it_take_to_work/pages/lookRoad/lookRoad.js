var mta = require('../../utils/mta_analysis.js');
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        longitude: '',
        latitude: '',
        markers: [],
        userSetting: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        console.log(options)
        mta.Page.init()
        if (options) {
            this.setData({
                userSetting: options.userSetting
            })
        }
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {
        this.getMyPosition()
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {

    },
    getMyPosition: function() {
        var _this = this;
        wx.getLocation({
            type: 'wgs84',
            success: function(res) {
                var latitude = res.latitude
                var longitude = res.longitude
                _this.setData({
                    longitude: longitude,
                    latitude: latitude,
                    markers: [{
                        iconPath: "/images/location.png",
                        id: 0,
                        latitude: latitude,
                        longitude: longitude,
                        width: 50,
                        height: 50
                    }]
                })
            }
        })
        if (this.data.userSetting == 0) {
            console.log('未注册')
            wx.showModal({
                title: '',
                content: '要先设置地理位置才能保证你上班路况顺畅哦~',
                cancelText: '再看看',
                confirmText: '去设置',
                success: function(res) {
                    if (res.confirm) {
                        wx.redirectTo({
                            url: '/pages/index/index'
                        })
                    } else if (res.cancel) {}
                }
            })
        } else if (this.data.userSetting == 1) {
            console.log('首次注册')
            wx.showModal({
                title: '',
                content: '别着急，到上班时间前我会提前帮你规划路线的',
                showCancel: false,
                confirmText: '确定',
                success: function(res) {

                }
            })
        }

    },
    goIndex: function(e) {
        if (e.detail.formId) {
            app.updateFormId(e.detail.formId)
        }
        wx.navigateTo({
            url: '/pages/index/index?isLook=1'
        })
    },
    onShareAppMessage: function() {
        return {
            title: '上班要多久',
            path: '/pages/index/index'
        }
    }
})