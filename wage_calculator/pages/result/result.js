const app = getApp()

Page({
    data: {
        wage: 0,
        laveWage: 0,
        checked: null,
        socialSecurity: 0,
        fund: 0,
        iPension: 0, //养老保险
        cPension: 0,
        iMedical: 0, //医疗保险
        cMedical: 0,
        iJob: 0,
        cJob: 0, //失业保险
        cWork: 0, //工伤保险
        cFertility: 0, //生育保险
        iFund: '--',
        cFund: '--', //公积金
        iPay: 0,
        cPay: 0,
        beforTax: 0,
        nowTax: 0,
        difference: 0
    },
    onLoad: function() {
        var ipay, cpay, beforTax = 0,
            nowTax = 0;
        this.setData({
            wage: app.globalData.wage,
            checked: app.globalData.checked,
            socialSecurity: app.globalData.socialSecurity,
            fund: app.globalData.fund
        });
        this.setData({
            iPension: (this.data.socialSecurity * 0.08).toFixed(2),
            cPension: (this.data.socialSecurity * 0.19).toFixed(2),
            iMedical: (this.data.socialSecurity * 0.02).toFixed(2),
            cMedical: (this.data.socialSecurity * 0.1).toFixed(2),
            iJob: (this.data.socialSecurity * 0.002).toFixed(2),
            cJob: (this.data.socialSecurity * 0.01).toFixed(2),
            cFertility: (this.data.socialSecurity * 0.008).toFixed(2),
            cWork: (this.data.socialSecurity * 0.005).toFixed(2),
        })
        if (this.data.checked) {
            this.setData({
                iFund: (this.data.fund * 0.12).toFixed(2) + '(12%)',
                cFund: (this.data.fund * 0.12).toFixed(2) + '(12%)',
            })
            ipay = (this.data.socialSecurity * (0.08 + 0.02 + 0.002) + this.data.fund * 0.12).toFixed(2);
            cpay = (this.data.socialSecurity * (0.19 + 0.1 + 0.01 + 0.008 + 0.005) + this.data.fund * 0.12).toFixed(2)
        } else {
            ipay = (this.data.socialSecurity * (0.08 + 0.02 + 0.002)).toFixed(2);
            cpay = (this.data.socialSecurity * (0.19 + 0.1 + 0.01 + 0.008 + 0.005)).toFixed(2)
        }
        this.setData({
            iPay: ipay,
            cPay: cpay,
            laveWage: this.data.wage - parseFloat(ipay)
        })
        if (0 < this.data.laveWage - 3500 && this.data.laveWage - 3500 <= 1500) {
            beforTax = (this.data.laveWage - 3500) * 0.03;

        } else if (1500 < this.data.laveWage - 3500 && this.data.laveWage - 3500 <= 4500) {

            beforTax = (this.data.laveWage - 3500) * 0.1 - 105;

        } else if (4500 < this.data.laveWage - 3500 && this.data.laveWage - 3500 <= 9000) {

            beforTax = (this.data.laveWage - 3500) * 0.2 - 555;

        } else if (9000 < this.data.laveWage - 3500 && this.data.laveWage - 3500 <= 35000) {

            beforTax = (this.data.laveWage - 3500) * 0.25 - 1005;

        } else if (35000 < this.data.laveWage - 3500 && this.data.laveWage - 3500 <= 55000) {

            beforTax = (this.data.laveWage - 3500) * 0.3 - 2755;

        } else if (55000 < this.data.laveWage - 3500 && this.data.laveWage - 3500 <= 80000) {

            beforTax = (this.data.laveWage - 3500) * 0.35 - 5505;

        } else if (this.data.laveWage - 3500 > 80000) {

            beforTax = (this.data.laveWage - 3500) * 0.45 - 13505;

        }
        if (0 < this.data.laveWage - 5000 && this.data.laveWage - 5000 <= 3000) {
            nowTax = (this.data.laveWage - 5000) * 0.03;

        } else if (3000 < this.data.laveWage - 5000 && this.data.laveWage - 5000 <= 12000) {
            nowTax = (this.data.laveWage - 5000) * 0.1 - 105;

        } else if (12000 < this.data.laveWage - 5000 && this.data.laveWage - 5000 <= 25000) {
            nowTax = (this.data.laveWage - 5000) * 0.2 - 555;

        } else if (25000 < this.data.laveWage - 5000 && this.data.laveWage - 5000 <= 35000) {
            nowTax = (this.data.laveWage - 5000) * 0.25 - 1005

        } else if (35000 < this.data.laveWage - 5000 && this.data.laveWage - 5000 <= 55000) {
            nowTax = (this.data.laveWage - 5000) * 0.3 - 2755;

        } else if (55000 < this.data.laveWage - 5000 && this.data.laveWage - 5000 <= 80000) {
            nowTax = (this.data.laveWage - 5000) * 0.35 - 5505;

        } else if (this.data.laveWage - 5000 > 80000) {
            nowTax = (this.data.laveWage - 5000) * 0.45 - 13505;

        }
        this.setData({
            beforTax: beforTax ? beforTax.toFixed(2) : beforTax,
            nowTax: nowTax ? nowTax.toFixed(2) : nowTax,
            difference: (beforTax - nowTax).toFixed(2),
            result: (this.data.laveWage - nowTax).toFixed(2)
        })
    },
    onReady: function() {
        // 页面渲染完成  
        //使用wx.createContext获取绘图上下文context  
        var context = wx.createContext();
        // 画饼图  
        //    数据源  
        var array = [parseFloat(this.data.result), parseFloat(this.data.nowTax) + parseFloat(this.data.iPay)];
        var colors = ["#4778bb", "#f6a45a"];
        var total = 0;
        //    计算总量  
        for (var index = 0; index < array.length; index++) {
            total += array[index];
        }
        //    定义圆心坐标  
        var point = { x: 56, y: 56 };
        //    定义半径大小  
        var radius = 50;
        /*    循环遍历所有的pie */
        for (var i = 0; i < array.length; i++) {
            context.beginPath();
            //      起点弧度  
            var start = 45;
            if (i > 0) {
                // 计算开始弧度是前几项的总和，即从之前的基础的上继续作画  
                for (var j = 0; j < i; j++) {
                    start += array[j] / total * 2 * Math.PI;
                }
            }
            //      1.先做第一个pie  
            //      2.画一条弧，并填充成三角饼pie，前2个参数确定圆心，第3参数为半径，第4参数起始旋转弧度数，第5参数本次扫过的弧度数，第6个参数为时针方向-false为顺时针  
            context.arc(point.x, point.y, radius, start, start + array[i] / total * 2 * Math.PI, false);
            //      3.连线回圆心  
            context.lineTo(point.x, point.y);
            //      4.填充样式  
            context.setFillStyle(colors[i]);
            //      5.填充动作  
            context.fill();
            context.closePath();
        }
        //调用wx.drawCanvas，通过canvasId指定在哪张画布上绘制，通过actions指定绘制行为  
        wx.drawCanvas({
            //指定canvasId,canvas 组件的唯一标识符  
            canvasId: 'mypie',
            actions: context.getActions()
        });
    },
    onShareAppMessage: function() {
        return {
            title: '税后工资计算器Pro',
            path: '/pages/index/index'
        }
    }
})