//index.js
//获取应用实例
const app = getApp()
Page({
    data: {
        wage: 0,
        checked: true,
        socialSecurity: 3387,
        fund: 2140
    },
    getWage(e) {
        this.setData({
            wage: parseFloat(e.detail.value)
        });
        if (e.detail.value > 25401) {
            this.setData({
                socialSecurity: 25401,
                fund: 25401
            })
        } else {
            this.setData({
                socialSecurity: parseFloat(e.detail.value),
                fund: parseFloat(e.detail.value)
            })
        }
    },
    getFund(e) {
        if (e.detail.value > 25401) {
            this.setData({
                fund: 25401
            })
        } else {
            this.setData({
                fund: parseFloat(e.detail.value)
            })
        }
    },
    getScoialSecurity(e) {
        if (e.detail.value > 25401) {
            this.setData({
                socialSecurity: 25401
            })
        } else {
            this.setData({
                socialSecurity: parseFloat(e.detail.value)
            })
        }
    },
    isFund(e) {
        this.setData({
            checked: !this.data.checked
        })
    },
    compute() {
        if (!this.data.wage) {
            return this.notice('请输入税前工资')
        }
        app.globalData.wage = this.data.wage;
        app.globalData.socialSecurity = this.data.socialSecurity;
        app.globalData.fund = this.data.fund;
        app.globalData.checked = this.data.checked;
        wx.navigateTo({
            url: '/pages/result/result'
        })

    },
    notice(str) {
        wx.showToast({
            title: str,
            icon: 'none',
            duration: 2000
        })
    },
    onShareAppMessage: function() {
        return {
            title: '税后工资计算器Pro',
            path: '/pages/index/index'
        }
    }
})