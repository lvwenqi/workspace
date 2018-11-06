//app.js
var mta = require('utils/mta_analysis.js');
App({
    onLaunch: function(options) {
        mta.App.init({
            "appID": "500617892",
            "eventID": "500617895",
        });
        var _this = this;
        if (options.scene == 1014) {
            wx.reLaunch({
                url: '/pages/roadConditions/roadConditions?flat=' + options.query.flat + '&flng=' + options.query.flng + '&tlat=' + options.query.tlat + '&tlng=' + options.query.tlng + '&notice=1',
                success: function(res) {},
                fail: function(res) {
                    _this.notice('未知错误，请重新进入小程序')
                }
            })
        }

        try {
            var value = wx.getStorageSync('openid')
            if (value) {
                this.globalData.openId = value
                this.getUserInfo(value)
            } else {
                this.login()
            }
        } catch (e) {
            this.notice('未知错误，请退出小程序重新进入')
        }
    },
    getUserInfo: function(openid) {
        var _this = this;

        wx.request({
            url: 'https://wx.rdtuijian.com/wx-application/map/common/user.action?openId=' + openid,
            method: 'GET',
            success: function(res) {
                if (res.data.code == 0) {
                    if (!res.data.data) {
                        _this.globalData.userSetting = 0
                        _this.globalData.isIndex = 'noSet'
                    } else {
                        if (res.data.data.u_c) {
                            _this.globalData.userSetting = 2
                        } else {
                            _this.globalData.userSetting = 1
                        }
                        var data = JSON.parse(res.data.data.userInfo);
                        _this.globalData.fLocation = data.location.fLocation;
                        _this.globalData.tLocation = data.location.tLocation;
                        _this.globalData.time = data.u_time;
                        _this.globalData.remindDate = data.u_flag;
                    }
                } else if (res.data.code != 0) {
                    _this.notice(res.data.msg)
                }
            },
            fail: function() {
                _this.notice('服务异常')
            }
        })
    },
    login: function() {
        var _this = this
        wx.login({
            success: function(res) {
                console.log('login', res)
                if (res.code) {
                    wx.request({
                        url: 'https://wx.rdtuijian.com/wx-application/map/common/login.action?jsCode=' + res.code,
                        method: 'GET',
                        success: function(res) {
                            console.log('openid', res)
                            if (res.data.code == 0) {
                                if (res.data.data.openid) {
                                    wx.setStorageSync('openid', res.data.data.openid);
                                    _this.globalData.openId = res.data.data.openid;
                                    _this.getUserInfo(res.data.data.openid)
                                }
                            } else {
                                _this.notice('登陆异常~~~')
                            }
                        },
                        fail: function() {
                            _this.notice('服务异常')
                        }
                    })
                } else {
                    _this.notice('登陆失败！' + res.errMsg)
                }

            },
            fail: function(res) {

            }
        })
    },
    notice: function(str) {
        wx.showToast({
            title: str,
            icon: 'none'
        })

        setTimeout(function() {
            wx.hideLoading()
        }, 2000)
    },
    updateFormId: function(formId) {
        var _this = this;
        if (this.globalData.openId) {
            wx.request({
                url: 'https://wx.rdtuijian.com/wx-application/map/common//formId.action?openId=' + this.globalData.openId + '&formId=' + formId,
                method: 'GET',
                data: { openId: this.globalData.openId, formId: formId },
                header: { 'content-type': 'application/json;charset=utf-8' },
                success: function(res) {
                    if (res.data.code != 0) {
                        _this.notice('更新formid失败')
                    }
                },
                fail: function() {
                    _this.notice('服务错误')
                }
            })
        }
    },
    globalData: {
        openId: '',
        userSetting: '',
        fLocation: null,
        tLocation: null,
        time: '',
        remindDate: '',
        isIndex: ''
    }
})