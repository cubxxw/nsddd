// pages/parkinglotMap/parkinglotMap.js
var app = getApp()
var util = require('../../utils/util.js')
const pMap = wx.createCanvasContext('parking-map')
const directionCanvas = wx.createCanvasContext('direction')
const pMapBeacons = wx.createCanvasContext("parking-map-bluetooth")
const _STARTX = 0
const _STARTY = 0
//页边距
const _PADDING = 50

//车位上下间距
const _SPACING = 40
//车位宽度
const _WIDTH = 40
//车位高度
const _HEIGHT = 55
//过道宽度
const _AISLE = 35
//车库文字偏移量
const _TEXT_OFFSET = 15
//车辆图标偏移量
const _CAR_ICON_OFFSET = 18

//缩放倍数
var zoom = 1
var mapData = {
  elements: {
    "A001": { name: "A001", classify: 1, position: { x: 30, y: 50 }, width: 40, height: 55 },
    "A002": { name: "A002", classify: 1, position: { x: 50, y: 145 }, width: 40, height: 55 },
    "A003": { name: "A003", classify: 1, position: { x: 50, y: 240 }, width: 40, height: 55 },
    "A004": { name: "A004", classify: 1, position: { x: 50, y: 335 }, width: 40, height: 55 },
    "A005": { name: "A005", classify: 1, position: { x: 50, y: 430 }, width: 40, height: 55 },

    "A006": { name: "A006", classify: 1, position: { x: 145, y: 50 }, width: 40, height: 55 },
    "A007": { name: "A007", classify: 1, position: { x: 125, y: 145 }, width: 40, height: 55 },
    "A008": { name: "A008", classify: 1, position: { x: 125, y: 240 }, width: 40, height: 55 },
    "A009": { name: "A009", classify: 1, position: { x: 125, y: 335 }, width: 40, height: 55 },
    "A010": { name: "A010", classify: 1, position: { x: 125, y: 430 }, width: 40, height: 55 },
    "A013": { name: "A013", classify: 1, position: { x: 125, y: 620 }, width: 40, height: 55 },
    "A014": { name: "A014", classify: 1, position: { x: 220, y: 240 }, width: 40, height: 55 },
    "A015": { name: "A015", classify: 1, position: { x: 220, y: 335 }, width: 40, height: 55 },
    "exit1": { name: "", classify: 2, position: { x: 250, y: 50 }, width: 40, height: 55 },
    "lift1": { name: "", classify: 3, position: { x: 250, y: 130 }, width: 40, height: 55 },
  },
  width: 550,
  height: 765,
  textOffset: {
    x: 20,
    y: 70
  },
  carIconOffset: {
    x: 5,
    y: 18
  },
  carPositionNum: "A002",
  area: "A",
  parkingLotCnName: "武汉文理学院001号停车场",
  forwardDirection: 36.23542
}
var beaconSearchInterval
var userDirection = 0
Page({
  data: {
    x: 0,
    y: 0,
    hidden: true,
    width: "0",
    height: "0",
    windowWidth: 0,
    speed: 0,
    mapData: {},
    scanCodeInfo: {
      carPosition1: [3, 5],
      carPosition2: [4, 5]
    }
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var that = this;
    //测试map数据
    //0:无元素 1:车位 2:安全出口 3:升降电梯

    wx.startCompass({
      success: function (res) {
        console.log("开始监听电子罗盘")
      }

    })

    this.setData({
      width: mapData.width + "px",
      height: mapData.height + "px",
      mapData: mapData
    })
    that.drawParkingMap(0)
    wx.onCompassChange(function (res) {
      that.userDirection = res.direction
      console.log("方向改变", res)
    })
  },

  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    var that = this
    wx.startBeaconDiscovery({
      uuids: ['B5B182C7-EAB1-4988-AA99-B5C1517008D9'],
      success: function (res) {
        console.log('startBeaconDiscoverysuccess', res)
        that.searchBeacons();
      },
      fail: function (res) {
        console.log('startBeaconDiscoveryfail', res)
      }
    })
  },
  onUnload: function () {
    wx.stopBeaconDiscovery({
      success: function (res) {
        console.log("停止搜索beacon设备")
        clearInterval(beaconSearchInterval)
      }
    })
    wx.stopCompass({
      success: function (res) {
        console.log("停止监听电子罗盘")
      }
    })
  },
  // 绘图相关
  drawParkingMap: function (direction) {
    var that = this;
    pMap.setFontSize(12)
    pMap.setTextAlign('center')
    pMap.setFillStyle('#62492d')
    for (let key in mapData.elements) {
      let element = mapData.elements[key]
      switch (element.classify) {
        case 1:
          pMap.drawImage("/images/parkingLot_area_yellow.png", element.position.x, element.position.y, element.width, element.height)
          pMap.fillText(element.name, element.position.x + mapData.textOffset.x, element.position.y + mapData.textOffset.y)
          break
        case 2:
          pMap.drawImage("/images/exit.png", element.position.x, element.position.y, element.width, element.height)
          break
        case 3:
          pMap.drawImage("/images/elevator.png", element.position.x, element.position.y, element.width, element.height)
          break
      }
    }

    this.drawCarPosition()
    pMap.draw()
    directionCanvas.draw()
  },

  drawDriverLocation: function (driverLocationPoint) {
    let locationX = driverLocationPoint.x
    let locationY = driverLocationPoint.y
    var w = 31
    var h = 40
    directionCanvas.translate(locationX + w / 2, locationY + h / 2)
    console.log('this.userDirection', this.userDirection)
    directionCanvas.rotate((this.userDirection - 354) * Math.PI / 180)
    directionCanvas.drawImage("/images/direction.png", -w / 2, -h / 2, w, h)
    directionCanvas.draw()
  },

  //绘制车辆
  drawCarPosition: function () {
    let parkingSpaceCoordinate = mapData.elements[mapData.carPositionNum].position
    console.log(parkingSpaceCoordinate)
    var carPositionX = parkingSpaceCoordinate.x + mapData.carIconOffset.x
    var carPositionY = parkingSpaceCoordinate.y + mapData.carIconOffset.y
    pMap.drawImage("/images/car_icon.png", carPositionX, carPositionY, 32, 25)
  },
  //绘制路线
  drawRouteToCar: function (carPosition1, carPosition2, beginPoint) {
    let carLocation = this.data.mapData.carLocation
    let driverLocation = this.getDriverLocationByCarPosition(carPosition1, carPosition2, beginPoint)
    let inflextionPoint = {}
    let endPoint = {}
    if (carPosition1[0] == carPosition2[0]) {
      console.log("==")
      inflextionPoint = this.getDriverLocationByCarPosition([
        carLocation[0] - 1,
        carPosition1[1]
      ], [
          carLocation[0] - 1,
          carPosition2[1]
        ], beginPoint)
      inflextionPoint.x += (_WIDTH + _AISLE) / 2
      endPoint = {
        x: inflextionPoint.x,
        y: beginPoint.y + (carLocation[1] - 1) * (_HEIGHT + _SPACING) + _HEIGHT / 2
      }
    } else {
      console.log("!=")
      inflextionPoint = this.getDriverLocationByCarPosition(
        [carPosition1[0],
        carLocation[1]]
        ,
        [carPosition2[0],
        carLocation[1]]
        , beginPoint)
      inflextionPoint.y += (_HEIGHT + _SPACING) / 2
      endPoint = {
        x: beginPoint.x + carLocation[0] * (_WIDTH + _AISLE) + _WIDTH / 2,
        y: inflextionPoint.y
      }
    }
    pMap.setLineWidth(10)
    pMap.setLineCap('round')
    pMap.setLineJoin('round')
    pMap.setStrokeStyle('#1593ff')
    pMap.moveTo(driverLocation.x, driverLocation.y);
    pMap.lineTo(inflextionPoint.x, inflextionPoint.y);
    console.log("endpoint", endPoint)
    pMap.lineTo(endPoint.x, endPoint.y);
    pMap.stroke();
  },
  searchBeacons: function () {

    var that = this
    beaconSearchInterval = setInterval(function () {

      // wx.startBluetoothDevicesDiscovery({
      //   services: [],
      //   success: function (res) {
      //     console.log('startBluetoothDevicesDiscovery', res)
      //     wx.getBluetoothDevices({
      //       success: function (res) {

      //         res.devices.forEach(function (device, index, array) {
      //           if(device.name=="AprilBeacon"){
      //             let mapElementId=beaconInfo[device.deviceId]
      //             let element=mapData.elements[mapElementId]
      //             pMapBeacons.setGlobalAlpha(0.5)
      //             pMapBeacons.setFillStyle('blue')
      //             pMapBeacons.fillRect(element.position.x,element.position.y,element.width,element.height)
      //             pMapBeacons.setGlobalAlpha(1)
      //             pMapBeacons.setFillStyle('red')
      //             pMapBeacons.fillText(device.RSSI,element.position.x,element.position.y)
      //           }
      //           let iRssi = Math.abs(device.RSSI)
      //           //A - 发射端和接收端相隔1米时的信号强度
      //           let A = 65
      //           //n - 环境衰减因子
      //           let n = 2.0
      //           let power = (iRssi - A) / (10 * n)
      //           device.distance = Math.pow(10, power)
      //         })
      //         console.log('getBluetoothDevices', res)
      //         that.setData({
      //           bluetoothDevice: res.devices
      //         })
      //         pMapBeacons.draw()

      //       }
      //     })
      // })

      wx.getBeacons({
        success: function (res) {
          console.log('getBeacons', res)
          let minBeacons = []
          let indexTemp
          let minDistanceBeacon = {}
          // for (let i = 0; i < 1; i++) {
          let distanceTemp = 1000
          res.beacons.forEach(function (beacon, index, array) {
            if (beacon.accuracy < distanceTemp && beacon.rssi != 0) {
              
              distanceTemp = beacon.accuracy
              minDistanceBeacon = beacon
              indexTemp = index
            }
            console.log("beacon",beacon)
            let mapElementId = beacon.minor > 9 ? "A0" + beacon.minor : "A00" + beacon.minor
            let element = mapData.elements[mapElementId]
            pMapBeacons.setGlobalAlpha(1)
            pMapBeacons.setFillStyle(' blue')
            pMapBeacons.fillText(beacon.accuracy + 'm', element.position.x, element.position.y)
          })
          // res.beacons[indexTemp].accuracy=1000
          // }
          // console.log("minBeacons",minBeacons)
          // minBeacons.forEach(function (beacon) {

          let mapElementId = minDistanceBeacon.minor > 9 ? "A0" + minDistanceBeacon.minor : "A00" + minDistanceBeacon.minor
          let element = mapData.elements[mapElementId]
          pMapBeacons.setGlobalAlpha(0.4)
          pMapBeacons.setFillStyle('green')
          pMapBeacons.fillRect(element.position.x, element.position.y, element.width, element.height)
          pMapBeacons.setGlobalAlpha(1)
          pMapBeacons.setFillStyle('red')
          pMapBeacons.fillText(minDistanceBeacon.accuracy + 'm', element.position.x, element.position.y)
          that.drawDriverLocation(element.position)
          // })
          pMapBeacons.draw()
          var end = new Date().getTime();//接受时间
        }
      })
    }, 100)
  }
})