// pages/result.js
var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        currentTab: 0,
        business: {},
        businessMoney: 0,
        period: 0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {

    },
    onReady: function() {
        this.setData({
            business: {
                interest: {
                    interestTotal: parseFloat((app.globalData.business.interest.interestTotal / 10000).toFixed(2)),
                    monthlySupply: parseFloat(app.globalData.business.interest.monthlySupply.toFixed(2)),
                    giveBackTotal: ((app.globalData.businessMoney * 10000 + app.globalData.business.interest.interestTotal) / 10000).toFixed(2)
                },
                principal: {
                    interestTotal: parseFloat((app.globalData.business.principal.interestTotal / 10000).toFixed(2)),
                    monthlySupply: parseFloat(app.globalData.business.principal.monthlySupply.toFixed(2)),
                    cut: parseFloat(app.globalData.business.principal.cut.toFixed(2)),
                    giveBackTotal: ((app.globalData.businessMoney * 10000 + app.globalData.business.principal.interestTotal) / 10000).toFixed(2)
                }
            },
            businessMoney: app.globalData.businessMoney,
            period: app.globalData.period
        })
    },
    swiperTab: function(e) {
        var that = this;
        that.setData({
            currentTab: e.detail.current
        });
    },
    //点击切换
    clickTab: function(e) {
        var that = this;
        if (this.data.currentTab === e.target.dataset.current) {
            return false;
        } else {
            that.setData({
                left: e.target.offsetLeft,
                currentTab: e.target.dataset.current
            })
        }
    },
    averageStaging: function(e) {
        var total = 0,
            arr = [],
            monthMoney = this.data.business.interest.monthlySupply,
            monthRate = app.globalData.singleRate / 12 / 100;
        var date = app.globalData.date.slice(0, 7);
        var y = Number(date.split('-')[0]);
        var m = Number(date.split('-')[1]);
        for (var i = 0; i < this.data.period; i++) {
            m++;
            if (m > 12) {
                m = 1;
                y++
            }
            var a = (app.globalData.singleMoney * 10000 - total) * monthRate
            var b = monthMoney - a;
            total += b;
            var data = {
                index: i + 1,
                supply: monthMoney.toFixed(2),
                principal: b.toFixed(2),
                interest: a.toFixed(2),
                date: y + '-' + this.formatNumber(m)
            }
            arr.push(data);
        }
        app.globalData.averageStaging = arr;
        wx.navigateTo({
            url: '/pages/staging/staging'
        })
    },
    standardStaging: function(e) {
        // 每月应还本金=贷款本金÷还款月数
        // 每月应还利息=剩余本金×月利率=(贷款本金-已归还本金累计额)×月利率
        var monthMoney = app.globalData.singleMoney * 10000 / this.data.period;
        var monthRate = app.globalData.singleRate / 12 / 100;
        var total = 0,
            arr = [];
        var date = app.globalData.date.slice(0, 7);
        var y = Number(date.split('-')[0]);
        var m = Number(date.split('-')[1]);
        for (var i = 0; i < this.data.period; i++) {
            m++;
            if (m > 12) {
                m = 1;
                y++
            }
            var a = (app.globalData.singleMoney * 10000 - total) * monthRate;
            var b = monthMoney + a;
            total += monthMoney;
            var data = {
                index: i + 1,
                supply: b.toFixed(2),
                principal: monthMoney.toFixed(2),
                interest: a.toFixed(2),
                date: y + '-' + this.formatNumber(m)
            }
            arr.push(data);
        }
        app.globalData.averageStaging = arr;
        wx.navigateTo({
            url: '/pages/staging/staging'
        })
    },
    formatTime: function(date) {
        var _this = this;
        var year = date.getFullYear()
        var month = date.getMonth() + 1

        return [year, month].map(_this.formatNumber).join('-')
    },
    formatNumber: function(n) {
        n = n.toString()
        return n[1] ? n : '0' + n
    },
    onShareAppMessage: function() {
        return {
            title: '房贷利率计算器Pro',
            path: '/pages/index/index'
        }
    }
})