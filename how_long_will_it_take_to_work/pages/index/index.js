//index.js
//获取应用实例
const app = getApp();
var mta = require('../../utils/mta_analysis.js');
Page({
    data: {
        isIndex: true,
        isSetting: false,
        time: '',
        times: false,
        remindDate: 0,
        check: true,
        markers: [{
            iconPath: "/images/location.png",
            id: 0,
            latitude: '',
            longitude: '',
            width: 50,
            height: 50
        }],
        homeAddress: '',
        companyAddress: '',
        userSetting: false,
        fLocation: null,
        tLocation: null,
        formId: '',
        timer: null
    },
    onLoad: function (options) {
        var _this = this;
        mta.Page.init()

        this.data.timer = setInterval(function () {
            if (app.globalData.fLocation && app.globalData.tLocation) {
                _this.setData({
                    homeAddress: app.globalData.fLocation.address,
                    companyAddress: app.globalData.tLocation.address,
                    time: app.globalData.time,
                    remindDate: app.globalData.remindDate,
                    fLocation: app.globalData.fLocation,
                    tLocation: app.globalData.tLocation,
                    isIndex: false
                })
                if (_this.data.remindDate == 1) {
                    _this.setData({
                        check: false
                    })
                } else {
                    _this.setData({
                        check: true
                    })
                }
                clearInterval(_this.data.timer)
            } else if (app.globalData.isIndex == 'noSet') {
                clearInterval(_this.data.timer)
            }
        }, 50)


        if (wx.getStorageSync('isLook') && wx.getStorageSync('isLook') == 1) {
            this.setData({
                isIndex: false
            })
        }
        if (options.isLook == 1) {
            this.setData({
                isIndex: false
            })
        }
    },
    onReady: function () {

    },
    getUserInfoAction: function (res) {
    },
    goSetting: function (e) {
        mta.Event.stat("set", {})
        mta.Event.stat('shezhibaocun', {'set': 'true'});
        this.setData({
            isIndex: false
        })
    },
    changeFormId: function (e) {
        if (e.detail.formId) {
            app.updateFormId(e.detail.formId)
        }
    },
    lookRoad: function (e) {
        var _this = this;
        app.updateFormId(e.detail.formId);
        if (app.globalData.userSetting == 2) {
            mta.Event.stat('road', {'registerend': 'true'});
            wx.navigateTo({
                url: '/pages/roadConditions/roadConditions?flat=' + app.globalData.fLocation.lat + '&flng=' + app.globalData.fLocation.lng + '&tlat=' + app.globalData.tLocation.lat + '&tlng=' + app.globalData.tLocation.lng
            })
        } else if (app.globalData.userSetting == 1) {
            mta.Event.stat('road', {'registerfirst': 'true'});
            wx.navigateTo({
                url: '/pages/roadConditions/roadConditions?flat=' + app.globalData.fLocation.lat + '&flng=' + app.globalData.fLocation.lng + '&tlat=' + app.globalData.tLocation.lat + '&tlng=' + app.globalData.tLocation.lng
            })
        } else if (app.globalData.userSetting == 0) {
            mta.Event.stat('road', {'noregister': 'true'});
            wx.navigateTo({
                url: '/pages/lookRoad/lookRoad?userSetting=0'
            })
        }
    },

    setPosition: function (e) {
        var action = e.target.dataset.action
        this.userAuthorized(action)
    },
    userAuthorized: function (action) {
        var _this = this;
        wx.getSetting({
            success(res) {
                if (!res.authSetting['scope.userLocation']) {
                    wx.authorize({
                        scope: 'scope.userLocation',
                        success() {
                            _this.getUserLocation(_this, action)
                        },
                        fail() {
                            _this.rejeacPos()
                        }
                    })
                } else {
                    _this.getUserLocation(_this, action)
                }
            }
        })
    },
    getUserLocation: function (_this, action) {
        wx.getLocation({
            type: 'gcj02',
            success: function (res) {
                var latitude = res.latitude
                var longitude = res.longitude
                wx.chooseLocation({
                    success: function (res) {
                        if (action == 'home') {
                            _this.setData({
                                homeAddress: res.address,
                                fLocation: {lat: res.latitude, lng: res.longitude, address: res.address}
                            })
                        } else if (action == 'company') {
                            _this.setData({
                                companyAddress: res.address,
                                tLocation: {lat: res.latitude, lng: res.longitude, address: res.address}
                            })
                        }

                    }
                })
            }
        })
    },
    bindTimeChange: function (e) {
        this.setData({
            time: e.detail.value + ':00'
        })
    },
    bindTimeCancel: function () {
        this.setData({
            time: ''
        })
    },

    radioChange: function (e) {
        this.setData({
            remindDate: e.detail.value
        })
    },
    rejeacPos: function () {
        var _this = this
        wx.showModal({
            title: '',
            content: '为了您上班一路顺畅，请确定授权定位服务',
            success: function (res) {
                if (res.confirm) {
                    wx.getSetting({
                        success(res) {
                            if (!res.authSetting['scope.userLocation']) {
                                wx.openSetting({
                                    success(res) {
                                    }
                                })
                            }
                        }
                    })
                } else if (res.cancel) {

                }
            }
        })
    },
    save: function (e) {
        var formId = e.detail.formId;
        if (!this.data.fLocation) {
            wx.showToast({
                title: '请选择家的地址',
                icon: 'none'
            })

            setTimeout(function () {
                wx.hideLoading()
            }, 2000)
        } else if (!this.data.tLocation) {
            wx.showToast({
                title: '请选择公司地址',
                icon: 'none'
            })

            setTimeout(function () {
                wx.hideLoading()
            }, 2000)
        } else if (!this.data.time) {
            wx.showToast({
                title: '请选择出发时间',
                icon: 'none'
            })

            setTimeout(function () {
                wx.hideLoading()
            }, 2000)
        } else {
            this.postSave(formId)
        }
    },
    postSave: function (formId) {
        var _this = this;
        if (!app.globalData.openId) return app.notice('登陆异常');
        var data = {
            "openid": app.globalData.openId,
            "form_id": formId,
            "page": 'pages/roadConditions/roadConditions?flat=' + this.data.fLocation.lat + '&flng=' + this.data.fLocation.lng + '&tlat=' + this.data.tLocation.lat + '&tlng=' + this.data.tLocation.lng,
            "u_time": this.data.time,
            "u_flag": this.data.remindDate,
            "location": {
                "fLocation": this.data.fLocation,
                "tLocation": this.data.tLocation
            }
        }
        console.log(data)
        wx.request({
            url: 'https://wx.rdtuijian.com/wx-application/map/common/update.action',
            data: data,
            method: 'POST',
            header: {'content-type': 'application/json;charset=utf-8'},
            success: function (res) {
                if (res.data.code == 0) {
                    wx.showModal({
                        title: '提示',
                        content: '保存成功，请留意每天消息推送',
                        showCancel: false,
                        success: function (res) {
                            app.globalData.fLocation = _this.data.fLocation;
                            app.globalData.tLocation = _this.data.tLocation;
                            if (!app.globalData.userSetting) {
                                mta.Event.stat('shezhibaocun', {'save': 'true'})
                                app.globalData.userSetting = 1;
                            }

                        }
                    })
                } else {
                    app.notice(res.data.msg)
                }
            },
            fail: function () {
                app.notice('服务异常~')
            },
            complete: function (res) {
                console.log(res)
            }
        })
    },
    onShareAppMessage: function () {
        return {
            title: '上班要多久',
            path: '/pages/index/index'
        }
    }
})