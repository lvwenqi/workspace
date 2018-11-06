//app.js
App({
    onLaunch: function() {

    },
    notice: function(str) {
        wx.showToast({
            title: str,
            icon: 'none',
            duration: 2000
        })
    },
    globalData: {
        business: {
            interest: {

            },
            principal: {

            }
        },
        singleMoney: 0,
        period: 0,
        group: {},
        singleRate: 0,
        businessRate: 0,
        fundRate: 0,
        averageStaging: [],
        businessAll: 0,
        fundAll: 0,
        date: ''
    }
})