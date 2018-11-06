//index.js
//获取应用实例
const app = getApp()
var mta = require('../../utils/mta_analysis.js');
var res = /^[1-9]+.?[0-9]*$/;
Page({
    data: {
        loanMoney: '',
        loanTime: '',
        loanRate: '',
        loanMode: '',
        isTime: true,
        isRate: true,
        isMode: true,
        showCover: false,
        showNper: false,
        showRate: false,
        showMode: false,
        modeText: ''
    },
    onLoad: function() {
        mta.Page.init();
    },
    toPoint: function(str) {
        str = str / 100;
        return str;
    },
    getLoanMoney: function(e) {
        this.setData({
            loanMoney: e.detail.value
        })
    },
    showDialog: function(e) {
        var _this = this;
        this.setData({
            showCover: true,
            showNper: false,
            showRate: false,
            showMode: false
        })

        if (e.currentTarget.dataset.type == '3') {
            setTimeout(function() {
                _this.setData({
                    showMode: true,
                })
            }, 100)
        } else if (e.currentTarget.dataset.type == '1') {
            setTimeout(function() {
                _this.setData({
                    showNper: true,
                })
            }, 100)

        } else if (e.currentTarget.dataset.type == '2') {
            setTimeout(function() {
                _this.setData({
                    showRate: true,
                })
            }, 100)

        }
    },
    closeDialog: function() {
        var _this = this
        this.setData({
            showNper: false,
            showRate: false,
            showMode: false
        })
        setTimeout(function() {
            _this.setData({
                showCover: false
            })
        }, 200)
    },
    getLoanTime: function(e) {
        this.setData({
            loanTime: e.target.dataset.time,
            isTime: false
        })
        this.closeDialog()
    },
    getLoanRate: function(e) {
        if (e.target.dataset.rate) {
            this.setData({
                loanRate: e.target.dataset.rate,
                isRate: false
            })
            this.closeDialog()
        }

    },
    inputRate: function(e) {
        console.log(e)
        this.setData({
            loanRate: e.detail.value
        })
    },
    subLoanRate: function(e) {
        if (this.data.loanRate) {
            this.setData({
                isRate: false
            })
            this.closeDialog();
        } else {
            this.notice('请输入年利率');
        }
    },
    getLoanMode: function(e) {
        console.log(e)
        if (e.target.dataset.mode) {
            var text = '';
            switch (e.target.dataset.mode) {
                case '1':
                    text = '等本等息';
                    break;
                case '2':
                    text = '等额本息';
                    break;
                case '3':
                    text = '等额本金';
                    break;
                case '4':
                    text = '先息后本';
                    break;
            }
            this.setData({
                loanMode: e.target.dataset.mode,
                isMode: false,
                modeText: text
            })
        }
    },
    compute: function() {
        if (!this.data.loanMoney || this.data.loanMoney == 0) {
            return this.notice('请输入贷款金额');
        } else if (!res.test(this.data.loanMoney)) {
            return this.notice('请输入贷款金额');
        } else if (!this.data.loanTime) {
            return this.notice('请选择贷款期数');
        } else if (!this.data.loanRate || this.data.loanRate == 0) {
            return this.notice('请输入年利率');
        } else if (!this.data.loanMode) {
            return this.notice('请选择还款方式');
        }

        var num, arr = [];
        if (this.data.loanMode == 4) {
            // 先息后本
            console.log('先息后本');
            num = this.data.loanMoney * this.data.loanRate / 100 * this.data.loanTime
            for (var i = 0; i < this.data.loanTime; i++) {
                var data = {
                    index: i + 1,
                    principal: 0,
                    interest: (this.data.loanMoney * this.data.loanRate / 100).toFixed(2),
                    supply: (this.data.loanMoney * this.data.loanRate / 100).toFixed(2)
                }
                if (i == this.data.loanTime - 1) {
                    data = {
                        index: i + 1,
                        principal: this.data.loanMoney,
                        interest: (this.data.loanMoney * this.data.loanRate / 100).toFixed(2),
                        supply: (this.data.loanMoney * this.data.loanRate / 100 + parseFloat(this.data.loanMoney)).toFixed(2)
                    }
                }
                arr.push(data)
            }
            console.log(arr)
        } else {
            if (this.data.loanMode == 1) {
                console.log('等本等息')
                num = this.data.loanMoney * this.data.loanRate * 12 / 100;
                for (var i = 0; i < this.data.loanTime; i++) {
                    var data = {
                        index: i + 1,
                        principal: (this.data.loanMoney / this.data.loanTime).toFixed(2),
                        interest: (num / this.data.loanTime).toFixed(2),
                        supply: (this.data.loanMoney / this.data.loanTime + num / this.data.loanTime).toFixed(2)
                    }
                    arr.push(data);
                }
            } else if (this.data.loanMode == 2) {
                //等额本息
                // 总利息=贷款额*贷款月数*月利率*（1+月利率）贷款月数/【（1+月利率）还款月数 - 1】-贷款额
                console.log('等额本息');
                var monthRate = this.data.loanRate / 100;

                num = this.data.loanMoney * this.data.loanTime * monthRate * Math.pow(1 + monthRate, this.data.loanTime) / (Math.pow(1 + monthRate, this.data.loanTime) - 1) - this.data.loanMoney;
                //每月还款额=[本金x月利率x(1+月利率)^贷款月数]/[(1+月利率)^还款月数-1]
                var monthMoney = this.data.loanMoney * monthRate * Math.pow(1 + monthRate, this.data.loanTime) / (Math.pow(1 + monthRate, this.data.loanTime) - 1);
                var total = 0;
                for (var i = 0; i < this.data.loanTime; i++) {
                    var a = (this.data.loanMoney - total) * monthRate
                    var b = monthMoney - a;
                    total += b;
                    var data = {
                        index: i + 1,
                        supply: monthMoney.toFixed(2),
                        principal: b.toFixed(2),
                        interest: a.toFixed(2)
                    }
                    arr.push(data);
                }
            } else if (this.data.loanMode == 3) {
                //等额本金
                //〔(总贷款额÷还款月数+总贷款额×月利率)+总贷款额÷还款月数×(1+月利率)〕÷2×还款月数-总贷款额
                console.log('等额本金');
                var monthRate = this.data.loanRate / 100;
                num = ((this.data.loanMoney / this.data.loanTime + this.data.loanMoney * monthRate) + this.data.loanMoney / this.data.loanTime * (1 + monthRate)) / 2 * this.data.loanTime - this.data.loanMoney;
                // 每月应还本金=贷款本金÷还款月数
                // 每月应还利息=剩余本金×月利率=(贷款本金-已归还本金累计额)×月利率
                var monthMoney = this.data.loanMoney / this.data.loanTime;
                var total = 0;
                for (var i = 0; i < this.data.loanTime; i++) {
                    var a = (this.data.loanMoney - total) * monthRate;
                    var b = monthMoney + a;
                    total += monthMoney;
                    var data = {
                        index: i + 1,
                        supply: b.toFixed(2),
                        principal: monthMoney.toFixed(2),
                        interest: a.toFixed(2)
                    }
                    arr.push(data);
                }
                console.log(arr)

            }

        }
        mta.Event.stat("compute", {})
        app.globalData.loanInterest = num.toFixed(2)
        app.globalData.loanMoney = this.data.loanMoney;
        app.globalData.loanTime = this.data.loanTime;
        app.globalData.loanArr = arr;
        wx.navigateTo({
            url: '/pages/result/result'
        })
    },
    notice: function(str) {
        wx.showToast({
            title: str,
            icon: 'none',
            duration: 2000
        })
    },
    onShareAppMessage: function() {
        return {
            title: '2018商贷利率计算器',
            path: '/pages/index/index'
        }
    }
})