// roadConditions.js
var amapFile = require('../../utils/amap-wx.js');
var QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js');
var mta = require('../../utils/mta_analysis.js');
const app = getApp();
var myAmapFun, qqmapsdk;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        longitude: '',
        latitude: '',
        markers: [],
        polyline: [],
        distance: '', //行驶距离
        duration: '', //行驶时间
        trafficLights: '', //红绿灯数
        congestionDistance: '', //拥堵长度
        congestionList: [], //拥堵路段
        isCongestion: true,
        startAdd: '',
        endAdd: '',
        city: '',
        paths: {},
        date: '',
        limit: '',
        isMap: true
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        console.log(options)
        mta.Page.init()
        var date = this.getDate(new Date().getDay());
        if (options.notice == 1) {
            this.setData({
                isMap: false
            })
        }
        this.setData({
            longitude: options.flng,
            latitude: options.flat,
            date: date,
            markers: [{
                iconPath: "/images/location.png",
                id: 0,
                latitude: options.flat,
                longitude: options.flng,
                width: 30,
                height: 30,
                title: "起点",
                label: { content: '起点', bgColor: '#ffffff', color: '#1a1a1a', padding: 3, textAlign: 'center', borderRadius: 2, borderColor: '#dddddd' }
            }, {
                iconPath: "/images/location.png",
                id: 1,
                latitude: options.tlat,
                longitude: options.tlng,
                width: 30,
                height: 30,
                title: "终点",
                label: { content: '终点', bgColor: '#ffffff', color: '#1a1a1a', padding: 3, textAlign: 'center', borderRadius: 2, borderColor: '#dddddd' }
            }]
        })
        myAmapFun = new amapFile.AMapWX({ key: '95968b07d0d93b6b7340a632ea3c8a6a' });
        qqmapsdk = new QQMapWX({
            key: 'SXABZ-HENLQ-RX25F-G7X3T-DOPPF-RRB5P'
        });
        var that = this;
        myAmapFun.getDrivingRoute({
            origin: options.flng + ',' + options.flat,
            destination: options.tlng + ',' + options.tlat,
            success: function(data) {
                var points = [];
                if (data.paths && data.paths[0] && data.paths[0].steps) {
                    var steps = data.paths[0].steps;
                    for (var i = 0; i < steps.length; i++) {
                        var poLen = steps[i].polyline.split(';');
                        for (var j = 0; j < poLen.length; j++) {
                            points.push({
                                longitude: parseFloat(poLen[j].split(',')[0]),
                                latitude: parseFloat(poLen[j].split(',')[1])
                            })
                        }
                    }
                }
                var duration = data.paths[0].duration;
                var h = Math.floor(duration / 3600) < 1 ? '' : Math.floor(duration / 3600);
                var m = Math.floor((duration / 60 % 60)) < 1 ? '' : Math.floor((duration / 60 % 60));
                var str = h ? h + '时' + m + '分' : m + '分';
                that.setData({
                    polyline: [{
                        points: points,
                        color: "#0091ff",
                        width: 6
                    }],
                    distance: Number(data.paths[0].distance / 1000).toFixed(1),
                    duration: str,
                    trafficLights: data.paths[0].traffic_lights,
                    paths: data.paths[0]
                });
                that.getSatrtAndEnd(data.paths[0], options.flat, options.flng, options.tlng, options.tlat)
            },
            fail: function(info) {
                app.notice('服务异常')
            }
        })

    },
    onReady: function(options) {},
    goIndex: function(e) {
        if (app.globalData.openId) {
            app.updateFormId(e.detail.formId)
        }
        wx.navigateTo({
            url: '/pages/index/index'
        })
    },
    changeFormId: function(e) {
        console.log(e)
        if (e.detail.target.dataset.notice == 1) {
            mta.Event.stat("formid", {})
            this.setData({
                isMap: true
            })
        }
        if (app.globalData.openId) {
            app.updateFormId(e.detail.formId)
        }
    },
    updateFormId: function(e) {
        if (app.globalData.openId) {
            app.updateFormId(e.detail.formId)
        }
    },
    getSatrtAndEnd: function(paths, flat, flng, tlng, tlat) {
        var that = this;
        qqmapsdk.reverseGeocoder({
            location: {
                latitude: flat,
                longitude: flng
            },
            success: function(res) {
                if (res.status == 0) {
                    that.setData({
                        startAdd: res.result.address,
                        city: res.result.address_component.city
                    })
                    that.getRoadInfo(paths)
                } else {
                    console.log(222)
                    app.notice('路线解析错误~')
                }
            },
            fail: function(res) {
                app.notice('服务异常')
            }
        });
        qqmapsdk.reverseGeocoder({
            location: {
                latitude: tlat,
                longitude: tlng
            },
            success: function(res) {
                if (res.status == 0) {
                    that.setData({
                        endAdd: res.result.address
                    })
                } else {
                    console.log(333)
                    app.notice('路线解析错误~')
                }
            },
            fail: function(res) {
                app.notice('服务异常')
            }
        });
    },

    getRoadInfo: function(paths) {
        console.log(paths)
        var _this = this;
        wx.request({
            url: 'https://wx.rdtuijian.com/wx-application/map/common/paths.action?city=' + _this.data.city,
            data: paths,
            method: 'POST',
            header: { 'content-type': 'application/json;charset=utf-8' },
            success: function(res) {
                console.log(res)
                if (res.data.code == 0) {
                    if (res.data.data.paths.length) {
                        _this.setData({
                            congestionList: [],
                            congestionDistance: res.data.data.length == 0 ? 0 : Number(res.data.data.length / 1000).toFixed(1),
                            isCongestion: res.data.data.length == 0 ? false : true
                        })
                        var list = [];
                        for (var i = 0; i < res.data.data.paths.length; i++) {
                            var item = res.data.data.paths[i];
                            if (item.status == '拥堵') {
                                var steps = {
                                    name: item.address.addressComponent.businessAreas[0].name,
                                    length: item.length
                                }
                                list.push(steps);
                            }
                        }
                        _this.setData({
                            congestionList: list
                        })
                    }
                    _this.setData({
                        limit: res.data.data.xianhao.f_number.replace(',', '/')
                    })
                } else {
                    console.log('paths')
                    app.notice('路线解析错误~')
                }
            },
            fail: function() {
                app.notice('服务异常')
            }
        })
    },
    getDate: function(date) {
        switch (date) {
            case 0:
                date = '周日'
                break;
            case 1:
                date = '周一'
                break;
            case 2:
                date = '周二'
                break;
            case 3:
                date = '周三'
                break;
            case 4:
                date = '周四'
                break;
            case 5:
                date = '周五'
                break;
            case 6:
                date = '周六'
                break;
        }
        return date;
    },
    getFormid: function(e) {
        console.log(e)
    },
    onShareAppMessage: function() {
        return {
            title: '上班要多久',
            path: '/pages/index/index'
        }
    }
})