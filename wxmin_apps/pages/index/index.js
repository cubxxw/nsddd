//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    markers: [{
      iconPath: "/images/park.png",
      id: 0,
      latitude: 25.0821785206,
      longitude: 102.6569366455,
      width: 40,
      height: 48,
    }, {
      iconPath: "/images/park.png",
      id: 1,
      latitude: 25.0823145601,
      longitude: 102.6563519239,
      width: 40,
      height: 48,
    }, {
      iconPath: "/images/park.png",
      id: 1,
      latitude: 25.0780000901,
      longitude: 102.6586639881,
      width: 40,
      height: 48,
    }, {
      iconPath: "/images/park.png",
      id: 1,
      latitude: 25.0782624609,
      longitude: 102.6556384563,
      width: 40,
      height: 48,
    }],
    polyline: [{
      points: [{
        longitude: 102.6569366455,
        latitude: 25.0821785206
      }, {
        longitude: 102.6569366455,
        latitude: 23.21229
      }],
      color: "#FF0000DD",
      width: 2,
      dottedLine: true
    }]
    // controls: [{
    //   id: 1,
    //   iconPath: '/images/car.png',
    //   position: {
    //     left: app.globalData.windowWidth/2-32,
    //     top: app.globalData.windowHeight/2-84,
    //     width: 64,
    //     height: 64
    //   },
    //   clickable: true
    // }]
  },
  onLoad: function (e) {

  },
  regionchange(e) {
    console.log(e.type)
  },
  markertap(e) {
    console.log(e.markerId)
  },
  controltap(e) {
    console.log(e.controlId)
  },
  bindParkingListItemTap: function () {
    wx.navigateTo({
      url: "../detail/detail"
    })
  },
  openParkingMap: function () {
    wx.navigateTo({
      url: '../parkinglotMap/parkinglotMap',
      success: function (res) {
        // success
      },
      fail: function (res) {
        // fail
      },
      complete: function (res) {
        // complete
      }
    })
  }
})
