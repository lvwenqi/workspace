const app = getApp()
Component({
  properties: {
    // 这里定义了innerText属性，属性值可以在组件使用时指定
    innerText: {
      type: String,
      value: 'default value',
    }
  },
  data: {
    // 这里是一些组件内部数据
    road: true,
    roadSeclect: false,
    clock: true,
    clockSeclect: false
  },
  ready:function(){
    this.setData({
      road: app.globalData.road,
      roadSeclect: app.globalData.roadSeclect,
      clock: app.globalData.clock,
      clockSeclect: app.globalData.clockSeclect
    })
  },
  methods: {
    // 这里是一个自定义方法
    toggleGlobalDataClock:function(){
      app.globalData.clock = !app.globalData.clock
      app.globalData.clockSeclect = !app.globalData.clockSeclect
    },
    toggleGlobalDataRoad:function(){
      app.globalData.road = !app.globalData.road
      app.globalData.roadSeclect = !app.globalData.roadSeclect
    },
    setClock: function (event) {
      this.toggleGlobalDataClock()
      this.setData({
        clock: app.globalData.clock,
        clockSeclect: app.globalData.clockSeclect
      })
    },
    offClock: function () {
      this.toggleGlobalDataClock()
      this.setData({
        clock: app.globalData.clock,
        clockSeclect: app.globalData.clockSeclect
      })
    },
    lookRoad: function () {
      this.toggleGlobalDataRoad()
      this.setData({
        road: app.globalData.road,
        roadSeclect: app.globalData.roadSeclect
      })
      console.log(this.data.road, this.data.roadSeclect)
    },
    offRoad: function () {
      this.toggleGlobalDataRoad()
      this.setData({
        road: app.globalData.road,
        roadSeclect: app.globalData.roadSeclect
      })

    }
  }
})