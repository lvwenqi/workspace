//app.js
var mta = require('utils/mta_analysis.js');
App({
    onLaunch: function() {
        mta.App.init({
            "appID": "500622377",
            "eventID": "500622378",
        });
    },
    globalData: {
        loanMoney: '',
        loanInterest: '',
        loanTime: '',
        loanArr: []
    }
})