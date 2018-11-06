// pages/staging.js
var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        averageStaging: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {

    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {
        this.setData({
            averageStaging: app.globalData.averageStaging
        })
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },
    onShareAppMessage: function() {
        return {
            title: '房贷利率计算器Pro',
            path: '/pages/index/index'
        }
    }
})