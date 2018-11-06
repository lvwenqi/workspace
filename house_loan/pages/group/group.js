var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        currentTab: 0,
        group: {}
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {

    },
    onReady: function() {
        this.setData({
            group: app.globalData.group
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
    getaverageDetail: function() {
        var businessList = this.averageStaging(app.globalData.group.average.business.monthlySupply, app.globalData.group.businessRate, app.globalData.group.businessAll);
        var fundList = this.averageStaging(app.globalData.group.average.fund.monthlySupply, app.globalData.group.fundRate, app.globalData.group.fundAll);
        var deatilList = [];
        if (businessList.length && fundList.length) {
            for (var i = 0; i < businessList.length; i++) {
                var data = {
                    index: businessList[i].index,
                    interest: (businessList[i].interest + fundList[i].interest).toFixed(2),
                    principal: (businessList[i].principal + fundList[i].principal).toFixed(2),
                    supply: (businessList[i].supply + fundList[i].supply).toFixed(2),
                    date: businessList[i].date
                }
                deatilList.push(data)
            }
            app.globalData.averageStaging = deatilList;
            wx.navigateTo({
                url: '/pages/staging/staging'
            })
        }

    },
    averageStaging: function(monthlySupply, rate, money) {
        var total = 0,
            arr = [],
            monthMoney = parseFloat(monthlySupply),
            monthRate = rate / 12 / 100;
        var date = app.globalData.date.slice(0, 7);
        var y = Number(date.split('-')[0]);
        var m = Number(date.split('-')[1]);
        for (var i = 0; i < app.globalData.group.period; i++) {
            m++;
            if (m > 12) {
                m = 1;
                y++
            }
            var a = (money * 10000 - total) * monthRate
            var b = monthMoney - a;
            total += b;
            var data = {
                index: i + 1,
                supply: monthMoney,
                principal: b,
                interest: a,
                date: y + '-' + this.formatNumber(m)
            }
            arr.push(data);
        }
        return arr;
    },
    getStandarDetail: function() {
        var businessList = this.standardStaging(app.globalData.group.businessRate, app.globalData.group.businessAll);
        var fundList = this.standardStaging(app.globalData.group.fundRate, app.globalData.group.fundAll);
        var deatilList = [];
        if (businessList.length && fundList.length) {
            for (var i = 0; i < businessList.length; i++) {
                var data = {
                    index: businessList[i].index,
                    interest: (businessList[i].interest + fundList[i].interest).toFixed(2),
                    principal: (businessList[i].principal + fundList[i].principal).toFixed(2),
                    supply: (businessList[i].supply + fundList[i].supply).toFixed(2),
                    date: businessList[i].date
                }
                deatilList.push(data)
            }
            app.globalData.averageStaging = deatilList;
            wx.navigateTo({
                url: '/pages/staging/staging'
            })
        }
    },
    standardStaging: function(rate, money) {
        // 每月应还本金=贷款本金÷还款月数
        // 每月应还利息=剩余本金×月利率=(贷款本金-已归还本金累计额)×月利率
        var monthMoney = money * 10000 / app.globalData.group.period;
        var monthRate = rate / 12 / 100;
        var total = 0,
            arr = [];
        var date = app.globalData.date.slice(0, 7);
        var y = Number(date.split('-')[0]);
        var m = Number(date.split('-')[1]);
        for (var i = 0; i < app.globalData.group.period; i++) {
            m++;
            if (m > 12) {
                m = 1;
                y++
            }
            var a = (money * 10000 - total) * monthRate;
            var b = monthMoney + a;
            total += monthMoney;
            var data = {
                index: i + 1,
                supply: b,
                principal: monthMoney,
                interest: a,
                date: y + '-' + this.formatNumber(m)
            }
            arr.push(data);
        }
        return arr;
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