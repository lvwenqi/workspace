// pages/result/result.js
const app = getApp()
var mta = require('../../utils/mta_analysis.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        allMoney: '',
        loanMoney: '',
        loanInterest: '',
        loanTime: '',
        loanArr: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        mta.Page.init();
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {
        // globalData: {
        //     loanMoney: '',
        //     loanInterest: '',
        //     loanTime: ''
        // }
        if (app.globalData.loanMoney) {
            var allMoney = parseFloat(app.globalData.loanMoney) + parseFloat(app.globalData.loanInterest);
            console.log(app.globalData.loanMoney, app.globalData.loanInterest)
            console.log(allMoney, typeof(allMoney))
            this.setData({
                allMoney: allMoney.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,'),
                loanMoney: parseFloat(app.globalData.loanMoney).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,'),
                loanTime: app.globalData.loanTime,
                loanInterest: parseFloat(app.globalData.loanInterest).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,'),
                loanArr: app.globalData.loanArr
            })
        }
    },
    goBack: function() {
        wx.navigateBack()
    },
    onShareAppMessage: function() {
        return {
            title: '2018商贷利率计算器',
            path: '/pages/index/index'
        }
    }

})