/**
 * Created by Administrator on 2016/10/28.
 */

function loadAMap(mapContainer_id) {
    document.getElementsByTagName("body").onload = initAMap();
    /**
     * 地图初始化init
     * */
    function initAMap() {
        <!--@initAMap变量-->
        var userMarker = {};     //用户定位标注点
        var markers_bef = [];    //代理商定位标注点
        var isFirstUM = true;    //第一次加载用户标注（初始化）
        var mapZoom = 13;        //地图缩放级别
        var currZoom = null;    //当前地图缩放级别(3-18)
        var circle = null;      //用户区域覆盖圆形
        <!--@map-->
        var map = new AMap.Map(mapContainer_id, {
            zoom: mapZoom,
        });
        <!--@currZoom addListener-->
        AMap.event.addListener(map,'zoomend',function(){
            currZoom = map.getZoom();
        });
        <!--@plugin ToolBar Scale OverView-->
        map.plugin('AMap.ToolBar',function () {
            var ToolBar = new AMap.ToolBar({
                autoPosition:false,
            });
            map.addControl(ToolBar);
        });
        map.plugin(['AMap.Scale','AMap.OverView'],
            function(){
                map.addControl(new AMap.Scale());
                map.addControl(new AMap.OverView({isOpen:true}));
            });
        <!--@获取用户所在城市信息-->
        function showCityInfo() {
            //实例化城市查询类
            var citysearch = new AMap.CitySearch();
            //自动获取用户IP，返回当前城市
            citysearch.getLocalCity(function(status, result) {
                if (status === 'complete' && result.info === 'OK') {
                    if (result && result.city && result.bounds) {
                        var cityinfo = result.city;
                        var citybounds = result.bounds;
//                            document.getElementById('tip').innerHTML = '您当前所在城市：'+cityinfo;
                        //地图显示当前城市
                        map.setBounds(citybounds);
                    }
                } else {
                }
            });
        }
        <!--@-定位-->
        function initGeolocation() {
            map.plugin('AMap.Geolocation', function () {
//                    var contentDiv = "<div style='background-color: aqua;border-radius: 5px;border: 1px solid red'>我的位置</div>";//自定义以marker
                geolocation = new AMap.Geolocation({
                    enableHighAccuracy: false,//是否使用高精度定位，默认:true
                    timeout: 8000,          //超过10秒后停止定位，默认：无穷大
                    buttonOffset: new AMap.Pixel(120, 20),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
                    zoomToAccuracy: true,      //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
                    buttonPosition: 'LB',
                    noIpLocate:false,//定位失败后是否走IP定位，默认值为false
                    maximumAge:60000,
                    panToLocation:true,
                    zoomToAccuracy:true,
//                        draggable:true,
//                        raiseOnDrag:true,
                    animation:"AMAP_ANIMATION_DROP",
                    showCircle:false,
                    showMarker:false,
//                        content:contentDiv,
                    circleOptions:{
                        radius:500,
                        strokeWeight:2,
                        fillOpacity:0.1,
                        strokeOpacity:0.2,
                    },
                    icon: new AMap.Icon({  //复杂图标
                        size: new AMap.Size(27, 36),//图标大小
                        image: "http://webapi.amap.com/images/custom_a_j.png", //大图地址
                        imageOffset: new AMap.Pixel(-28, 0)//相对于大图的取图位置
                    })
                });
                map.addControl(geolocation);
                geolocation.getCurrentPosition();
                AMap.event.addListener(geolocation, 'complete', onComplete);//返回定位信息
                AMap.event.addListener(geolocation, 'error', onError);      //返回定位出错信息
            });
            function onComplete(GeolocationResult) {
//                    console.log(GeolocationResult);
                var userMarkerInfo = {
                    markerid:6,
                    markername:"您的位置",
                    lnglats:[GeolocationResult.position.lng,GeolocationResult.position.lat],
                };
//                    console.log(userMarkerInfo);
                map.setZoom(13);
                map.setCenter(userMarkerInfo.lnglats);
                drawUserMarker(userMarkerInfo);
//                    setTimeout(function () {
//                        var userMarkerInfo = {
//                            markerid:6,
//                            markername:"您的位置",
//                            lnglats:[113.946774,22.536457],
////                        lnglats:[GeolocationResult.position.lng,GeolocationResult.position.lat],
//                        };
//                        drawUserMarker(map,userMarkerInfo);
//                    },2000);

            }
            function onError(GeolocationError) {
                console.log(GeolocationError);
            }
        }
        <!--@用户位置标注-->
        function drawUserMarker (userMarkerParams){
            <!-- 移除上一次的标注点-->
//                mapTarger.remove(userMarker);//删除标注
//                markers_bef.forEach(function (obj) {
//                    obj.setMap(null);//单个删除点
//                });
//                console.log(markersParams);
            var contentDiv = "<div style='background-color: aqua;border-radius: 5px;border: 1px solid red'></div>";//自定义以marker

            if(isFirstUM)
            {
                isFirstUM = false;
                <!--初始化标注-->
                userMarker = new AMap.Marker({
                    extData:userMarkerParams.markerid,
                    title:userMarkerParams.markername,
                    position: userMarkerParams.lnglats,
                    map: map,
                    animation:"AMAP_ANIMATION_NONE",//AMAP_ANIMATION_DROP,AMAP_ANIMATION_BOUNCE,AMAP_ANIMATION_NONE
//                    topWhenClick : false,
//                    topWhenMouseOver:true,
                    draggable:true,
                    raiseOnDrag:true,
//                        showCircle:true,
                    zIndex:999,
                    shape:new AMap.MarkerShape({
                        type:"circle",
                        coords:[10, 10, 100,100],

                    }),//设置Marker的可点击区域，在定义的区域内可触发Marker的鼠标点击事件
                    label:{
                        offset: new AMap.Pixel(-15, -25),//修改label相对于maker的位置
                        content: "您的位置",
                    },
//                        icon:"http://webapi.amap.com/images/car.png",
//                        icon:"http://webapi.amap.com/theme/v1.3/images/newpc/poi-1.png",
//                        content:contentDiv,

                });
                <!--划圆圈-->
                circle = new AMap.Circle({
                    center: new AMap.LngLat(userMarkerParams.lnglats[0], userMarkerParams.lnglats[1]),// 圆心位置
                    radius: 2000, //半径
                    strokeColor: "#F33", //线颜色
                    strokeOpacity: 1, //线透明度
                    strokeWeight: 1, //线粗细度
                    fillColor: "blue", //填充颜色
                    fillOpacity: 0.15//填充透明度
                });
//                     var isCT= circle.contains([]);//判断坐标是否在圆圈内
                circle.setMap(map);
                <!--dragstart响应事件-->
                userMarker.on("dragstart",function (e) {
                    circle.hide();
                });
                <!--dragging响应事件-->
                userMarker.on("dragging",function (e) {
                    var userMKps = userMarker.getPosition();
                    var userMKif = {
                        markerid:6,
                        markername:"您的位置",
                        lnglats:[userMKps.lng,userMKps.lat],
                    };
                    circle.setCenter(userMKif.lnglats);
                    circle.show();
                });
                <!--dragend响应事件-->
                userMarker.on("dragend",function (e) {
                    var userMKps = userMarker.getPosition();
                    var userMKif = {
                        markerid:6,
                        markername:"您的位置",
                        lnglats:[userMKps.lng,userMKps.lat],
                    };
//                        drawUserMarker(mapTarger,userMKif);
//                        mapTarger.setZoom(mapZoom);
                    map.setCenter(userMKif.lnglats);

                });
            }
            else
            {
                userMarker.setPosition(userMarkerParams.lnglats);
                circle.show();
                circle.setCenter(new AMap.LngLat(userMarkerParams.lnglats[0], userMarkerParams.lnglats[1]));
                circle.setMap(mapTarger);
            }
            userMarker.content = '';
        }
        <!--@drawMultiMarker-->

        function drawMultiMarker (markersParams){
            var mapTarger = map;
            <!-- 移除上一次的标注点-->
            mapTarger.remove(markers_bef);//删除所有点
//                markers_bef.forEach(function (obj) {
//                    obj.setMap(null);//逐个删除点
//                });
//         console.log(mapTarger);
//         console.log(markersParams.length);
//         console.log(markers_bef);
            for (var i = 0; i < markersParams.length; i++) {

                var contentDiv = "<div style='background-color: aqua;border-radius: 5px;border: 1px solid red'>"+i+"</div>";//自定义以marker

                var marker = new AMap.Marker({
                    extData:markersParams[i].markerid,
                    title:markersParams[i].markername,
                    position: markersParams[i].lnglats,
                    map: mapTarger,
                    animation:"AMAP_ANIMATION_NONE",//AMAP_ANIMATION_DROP,AMAP_ANIMATION_BOUNCE,AMAP_ANIMATION_NONE
//                    topWhenClick : false,
//                    topWhenMouseOver:true,
                    draggable:false,
                    raiseOnDrag:false,
                    label:{
                        offset: new AMap.Pixel(-15, -25),//修改label相对于maker的位置
                        content: '代理商：'+markersParams[i].markername,
                    },
                    icon:"http://webapi.amap.com/images/car.png",
//                        icon:"http://webapi.amap.com/theme/v1.3/images/newpc/poi-1.png",
//                        content:contentDiv,
                });
                marker.content = '代理商：'+markersParams[i].markername+"<br>"+"距离您的位置："+markersParams[i].distance+"米";
//                    var infoWindow = new AMap.InfoWindow({offset: new AMap.Pixel(0, -30)});
//                    infoWindow.setContent(marker.content);
//                    infoWindow.open(mapTarger, marker.getPosition());
                marker.on('click', markerClick);
//                    marker.emit('click', {target: marker});
                markers_bef.push(marker);
//                    map.setFitView();//使地图自适应显示到合适的范围
            }
            var infoWindow = new AMap.InfoWindow({offset: new AMap.Pixel(0, -30)});
            function markerClick(e) {
                infoWindow.setContent(e.target.content);
                infoWindow.setOffset = new AMap.Pixel(0, -30),
                    infoWindow.open(map, e.target.getPosition());
            }
        }
        <!--@setMapStyle-normal默认样式dark深色样式blue_night夜空蓝样式fresh浅色样式lightosm清新风格样式-->
        map.setMapStyle("normal");
        <!--@向外部提供对象变量和方法-->


        return {
            map: map,
            userMarker:userMarker,
            markers: markers_bef,
            currZoom:currZoom,
            initGeolocation: initGeolocation,
            drawMultiMarker:drawMultiMarker,
            drawUserMarker:drawUserMarker,
        }
    }
    /**
     * ajaxRequest
     * */
    function ajaxRequest() {
        <!--获取代理商坐标-->
        function aGetAgentPs (data){

        }
        return {
            aGetAgentPs:aGetAgentPs,
        }
    }
    /**
     * 测试数据
     * */
    test();
    function test() {
        var amap  = new initAMap();
        amap.initGeolocation();
        var markersParams = [];
        var marker1 = {
            markerid:1,
            markername:"哈鲁",
            distance:350,
            lnglats: [113.960597,22.556908],
        };
        var marker2 = {
            markerid:2,
            markername:"哈哈",
            distance:350,
            lnglats: [113.970897,22.550329],
        };
        var marker3 = {
            markerid:3,
            markername:"哈罗",
            distance:350,
            lnglats: [113.943774,22.536457],
        };
        markersParams.push(marker1);
        markersParams.push(marker2);
        markersParams.push(marker3);
        amap.drawMultiMarker(markersParams);
        setTimeout(function () {
            var markersParams = [];
            var marker1 = {
                markerid:1,
                markername:"哈鲁",
                lnglats: [113.945749,22.547634],
                distance:100,
                extData:1,
            };
            var marker2 = {
                markerid:2,
                markername:"哈哈",
                lnglats: [113.961026,22.535585],
                distance:200,
                extData:2,
            };
            var marker3 = {
                markerid:3,
                markername:"哈罗",
                lnglats: [113.949353,22.543988],
                distance:350,
                extData:3,
            };
            markersParams.push(marker1);
            markersParams.push(marker2);
            markersParams.push(marker3);
            amap.drawMultiMarker(markersParams);
        },3000);
    }


};
window.loadAMap=loadAMap;


