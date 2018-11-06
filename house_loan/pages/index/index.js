var app = getApp();
const util = require('../../utils/util.js');
Page({

    data: {
        currentTab: 0,
        left: 0,
        businessMoney: 100,
        fundMoney: 50,
        LoanText: ['上浮50个点', '上浮45个点', '上浮40个点', '上浮35个点', '上浮30个点', '上浮25个点', '上浮20个点', '上浮15个点', '上浮10个点', '上浮5个点', '95折', '9折', '85折', '8折', '7折', '基准利率'],
        businessLoan: ['7.3500', '7.1050', '6.8600', '6.6150', '6.3700', '6.1250', '5.8800', '5.6350', '5.3900', '5.1450', '4.6550', '4.4100', '4.1650', '3.9200', '3.4300', '4.9000'],
        fundLoan: ['4.8750', '4.7125', '4.5500', '4.3875', '4.2250', '4.0625', '3.9000', '3.7350', '3.5750', '3.4125', '3.0875', '2.9250', '2.7625', '2.6000', '2.2750', '3.2500'],
        limit: ['1年', '2年', '3年', '4年', '5年', '6年', '7年', '8年', '9年', '10年', '11年', '12年', '13年', '14年', '15年', '16年', '17年', '18年', '19年', '20年', '21年', '22年', '23年', '24年', '25年', '26年', '27年', '28年', '29年', '30年'],
        limitIndex: 29,
        businessIndex: 15,
        fundIndex: 15,
        date: '',
        businessRate: 4.9,
        fundRate: 3.25,
        period: 360
    },
    onReady: function() {
        var time = util.formatTime(new Date())
        this.setData({
            date: time
        })
        app.globalData.date = time;
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
    bindBusinessChange: function(e) {
        var _this = this;
        this.setData({
            businessIndex: e.detail.value,
            businessRate: parseFloat(_this.data.businessLoan[parseInt(e.detail.value)])
        });
        // app.globalData.businessRate = this.data.businessRate;
    },
    bindFundChange: function(e) {
        var _this = this;
        this.setData({
            fundIndex: e.detail.value,
            fundRate: parseFloat(_this.data.fundLoan[parseInt(e.detail.value)])
        });
        // app.globalData.fundRate = this.data.fundRate;
    },
    bindDateChange: function(e) {
        this.setData({
            date: e.detail.value
        });
        app.globalData.date = this.data.date;
    },
    bindLimitChange: function(e) {
        this.setData({
            limitIndex: parseFloat(e.detail.value),
            period: (parseFloat(e.detail.value) + 1) * 12
        });
    },
    getBusinessMoney: function(e) {
        this.setData({
            businessMoney: parseFloat(e.detail.value)
        })
    },
    getFundMoney: function(e) {
        this.setData({
            fundMoney: parseFloat(e.detail.value)
        })
        console.log(this.data.fundMoney)
    },
    // 单项计算按钮
    businessBtn: function(e) {
        if (e.currentTarget.dataset.type == 1) {
            if (!this.data.businessMoney) {
                return app.notice('请输入贷款总额');
            }
            this.businessCompute(this.data.businessMoney, this.data.businessRate)
            app.globalData.singleMoney = this.data.businessMoney;
            app.globalData.singleRate = this.data.businessRate;
        } else if (e.currentTarget.dataset.type == 2) {
            if (!this.data.fundMoney) {
                return app.notice('请输入贷款总额');
            }
            app.globalData.singleMoney = this.data.fundMoney;
            app.globalData.singleRate = this.data.fundRate;
            this.businessCompute(this.data.fundMoney, this.data.fundRate)
        }

    },
    //单项贷款计算方法
    businessCompute: function(money, rate) {
        // 等额本息
        // 总利息=贷款额*贷款月数*月利率*（1+月利率）贷款月数/【（1+月利率）还款月数 - 1】-贷款额
        // 每月还款额=[本金x月利率x(1+月利率)^贷款月数]/[(1+月利率)^还款月数-1]

        /**
         * 　每月月供额=〔贷款本金×月利率×（1＋月利率）＾还款月数〕÷〔（1＋月利率）＾还款月数-1〕

　　            每月应还利息=贷款本金×月利率×〔（1+月利率）^还款月数-（1+月利率）^（还款月序号-1）〕÷〔（1+月利率）^还款月数-1〕

　　            每月应还本金=贷款本金×月利率×（1+月利率）^（还款月序号-1）÷〔（1+月利率）^还款月数-1〕

　　            总利息=还款月数×每月月供额-贷款本金
         */
        var monthRate = rate / 12 / 100;
        var businessMoney = money * 10000;
        //总利息
        var interestTotal = businessMoney * this.data.period * monthRate * Math.pow(1 + monthRate, this.data.period) / (Math.pow(1 + monthRate, this.data.period) - 1) - businessMoney;
        //月供
        var businessMonthlySupply = (businessMoney * monthRate * Math.pow(1 + monthRate, this.data.period)) / (Math.pow(1 + monthRate, this.data.period) - 1)

        // 等额本金
        //总利息=〔(总贷款额÷还款月数+总贷款额×月利率)+总贷款额÷还款月数×(1+月利率)〕÷2×还款月数-总贷款额
        //每月月供递减额 = 每月应还本金×月利率=贷款本金÷还款月数×月利率
        //每月月供额=(贷款本金÷还款月数)+(贷款本金-已归还本金累计额)×月利率


        // 总利息
        var principalTotal = ((businessMoney / this.data.period + businessMoney * monthRate) + businessMoney / this.data.period * (1 + monthRate)) / 2 * this.data.period - businessMoney;
        // 首月月供
        var firstMonthlySupply = (businessMoney / this.data.period) + (businessMoney * monthRate);
        // 每月递减
        var cut = businessMoney / this.data.period * monthRate;
        app.globalData.business = {
            interest: {
                interestTotal: interestTotal,
                monthlySupply: businessMonthlySupply
            },
            principal: {
                interestTotal: principalTotal,
                monthlySupply: firstMonthlySupply,
                cut: cut
            }
        }
        app.globalData.businessMoney = money;
        app.globalData.period = this.data.period;
        app.globalData.businessRate = this.data.businessRate;
        app.globalData.fundRate = this.data.fundRate;
        wx.navigateTo({
            url: '/pages/result/result'
        })
    },
    groupBtn: function(e) {
        if (!this.data.businessMoney) {
            return app.notice('请输入商业贷款总额');
        } else if (!this.data.fundMoney) {
            return app.notice('请输入公积金贷款总额');
        }
        this.groupCompute();
    },
    groupCompute: function() {
        /**等额本息 */
        // 商业贷
        var averageBusiness = this.average(this.data.businessRate, this.data.businessMoney);
        // 公积金贷
        var averageFund = this.average(this.data.fundRate, this.data.fundMoney);
        /**等额本金 */
        // 商业贷
        var standardBusiness = this.standard(this.data.businessRate, this.data.businessMoney)
            // 公积金贷
        var standardFund = this.standard(this.data.fundRate, this.data.fundMoney);

        app.globalData.group = {
            average: {
                total: {
                    monthlySupply: (averageBusiness.businessMonthlySupply + averageFund.businessMonthlySupply).toFixed(2),
                    interestTotal: ((averageBusiness.interestTotal + averageFund.interestTotal) / 10000).toFixed(2),
                    giveBackTotal: ((this.data.businessMoney * 10000 + this.data.fundMoney * 10000 + averageBusiness.interestTotal + averageFund.interestTotal) / 10000).toFixed(2)
                },
                business: {
                    monthlySupply: averageBusiness.businessMonthlySupply.toFixed(2),
                    interest: (averageBusiness.interestTotal / 10000).toFixed(2),
                    giveBackTotal: ((this.data.businessMoney * 10000 + averageBusiness.interestTotal) / 10000).toFixed(2)
                },
                fund: {
                    monthlySupply: averageFund.businessMonthlySupply.toFixed(2),
                    interest: (averageFund.interestTotal / 10000).toFixed(2),
                    giveBackTotal: ((this.data.fundMoney * 10000 + averageFund.interestTotal) / 10000).toFixed(2)
                }
            },
            standard: {
                total: {
                    monthlySupply: (standardBusiness.businessMonthlySupply + standardFund.businessMonthlySupply).toFixed(2),
                    interestTotal: ((standardBusiness.interestTotal + standardFund.interestTotal) / 10000).toFixed(2),
                    giveBackTotal: ((this.data.businessMoney * 10000 + this.data.fundMoney * 10000 + standardBusiness.interestTotal + standardFund.interestTotal) / 10000).toFixed(2)
                },
                business: {
                    monthlySupply: standardBusiness.businessMonthlySupply.toFixed(2),
                    interest: (standardBusiness.interestTotal / 10000).toFixed(2),
                    giveBackTotal: ((this.data.businessMoney * 10000 + standardBusiness.interestTotal) / 10000).toFixed(2)
                },
                fund: {
                    monthlySupply: standardFund.businessMonthlySupply.toFixed(2),
                    interest: (standardFund.interestTotal / 10000).toFixed(2),
                    giveBackTotal: ((this.data.fundMoney * 10000 + standardFund.interestTotal) / 10000).toFixed(2)
                }
            },
            businessAll: this.data.businessMoney,
            fundAll: this.data.fundMoney,
            period: this.data.period,
            businessRate: this.data.businessRate,
            fundRate: this.data.fundRate
        }
        wx.navigateTo({
            url: '/pages/group/group'
        })
    },
    // 等额本息还款法
    average: function(rate, money) {
        var monthRate = rate / 12 / 100;
        var businessMoney = money * 10000;
        //总利息
        var interestTotal = businessMoney * this.data.period * monthRate * Math.pow(1 + monthRate, this.data.period) / (Math.pow(1 + monthRate, this.data.period) - 1) - businessMoney;
        //月供
        var businessMonthlySupply = (businessMoney * monthRate * Math.pow(1 + monthRate, this.data.period)) / (Math.pow(1 + monthRate, this.data.period) - 1)
        return {
            interestTotal: interestTotal,
            businessMonthlySupply: businessMonthlySupply
        }

    },
    // 等额本金还款法
    standard: function(rate, money) {
        var monthRate = rate / 12 / 100;
        var businessMoney = money * 10000;
        // 总利息
        var principalTotal = ((businessMoney / this.data.period + businessMoney * monthRate) + businessMoney / this.data.period * (1 + monthRate)) / 2 * this.data.period - businessMoney;
        // 首月月供
        var firstMonthlySupply = (businessMoney / this.data.period) + (businessMoney * monthRate);
        // 每月递减
        var cut = businessMoney / this.data.period * monthRate;
        return {
            interestTotal: principalTotal,
            businessMonthlySupply: firstMonthlySupply,
            cut: cut
        }
    },
    onShareAppMessage: function() {
        return {
            title: '房贷利率计算器Pro',
            path: '/pages/index/index'
        }
    }
})