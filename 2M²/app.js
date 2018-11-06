//app.js

var mta = require('utils/mta_analysis.js');
App({
    onLaunch: function(options) {
        this.getDevice()

    },
    getUserInfo: function(cb) {

    },
    getDevice: function() {
        var _this = this;
        wx.getSystemInfo({
            success: function(res) {
                if (res.model.indexOf('iPhone X') != -1) {
                    _this.globalData.isIpx = true;
                }
            }
        })
    },
    globalData: {
        userInfo: null,
        textList: [],
        isIpx: false
    },

})