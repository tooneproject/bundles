(function (window, document, Math) {

    function JGMMap() {
        var me = this;
        var opts = {};
        var bdmap = {};
        var routingPolicy = {};
        var localSearch = {};
        var geoCoder = {};
        var geoLocation = {};
        var targetLocation = {};
        var currLocation = {};
        var startLocation = {};
        var endLocation = {};
        var infoOverlays = [];
        this.clickEventListeners = [];
        this.dragEventListeners = [];
        this.markerClickEventListeners = [];

        me.init = function(properties){
            opts.globalCode = properties.GlobalCode||"allmap";
            opts.addressColumn = properties.AddressColumn;
            opts.latitudeColumn = properties.LatitudeColumn;
            opts.longitudeColumn = properties.LongitudeColumn;
            opts.readOnly = properties.ReadOnly=="true";
            opts.infoVisible = properties.InfoVisible=="true";
            opts.gpsVisible = properties.GPSVisible=="true";
            opts.zoomVisible = properties.ZoomVisible=="true";
            opts.defaultZoomLevel = 16;                                       // 地图默认缩放级别
            me.el = $('#' + opts.globalCode);
            me.el_input = $("#"+opts.globalCode+"_input");
            me.el_address = $("#"+opts.globalCode+"_address");
            me.bdmapInit();
            me.inputInit();
        };
        me.bdmapInit = function(){
            bdmap = new BMap.Map(opts.globalCode,{enableMapClick: !opts.readOnly});
            bdmap.addEventListener("click", me.fireOnClickListeners);
            bdmap.addEventListener('dragend', me.fireOnDragListeners);

            localSearch = new BMap.LocalSearch(bdmap, {
                renderOptions:{map: bdmap, autoViewport:true}
            });
            geoCoder = new BMap.Geocoder();
            geoLocation = new BMap.Geolocation();

            var renderOpt = {renderOptions: {map: bdmap, autoViewport: true} };
            routingPolicy.transit = new BMap.TransitRoute(bdmap, renderOpt);
            routingPolicy.driving = new BMap.DrivingRoute(bdmap, renderOpt);
            routingPolicy.walking = new BMap.WalkingRoute(bdmap, renderOpt);

            if(opts.readOnly){
                bdmap.disableDragging();
                bdmap.disableScrollWheelZoom();
                bdmap.disableDoubleClickZoom();
                bdmap.disablePinchToZoom();
                me.el.css("border","1px solid #e5e5e5");
                me.el_address.show();
            }else{
                bdmap.enableDragging();
                bdmap.enableScrollWheelZoom();
                bdmap.enableDoubleClickZoom();
                bdmap.enablePinchToZoom();
                if(opts.zoomVisible) me.addZoomCtrl();
                if(opts.gpsVisible) me.addGPSCtrl();
            }
            me.runGPS();
            bdmap.centerAndZoom(new BMap.Point(113.5615, 22.3948), opts.defaultZoomLevel);
        };
        me.addZoomCtrl = function(){
            var navigation = new BMap.NavigationControl({anchor: BMAP_ANCHOR_BOTTOM_RIGHT, type: BMAP_NAVIGATION_CONTROL_ZOOM});
            bdmap.addControl(navigation);
        };
        me.addGPSCtrl = function(){
            var geolocationControl = new BMap.GeolocationControl();
            geolocationControl.addEventListener("locationSuccess", function(e){
                currLocation.lng = e.point.lng;
                currLocation.lat = e.point.lat;
                currLocation.address = me.formatAddressComponent(e.addressComponent);
            });
            bdmap.addControl(geolocationControl);
        };
        me.zoomTo = function(lv){
            bdmap.setZoom(lv);
        };
        me.setCenter = function(location){
            if(!!location.lng && !!location.lat){
                bdmap.setCenter(new BMap.Point(location.lng, location.lat));
            }else if(!!location.address){
                bdmap.setCenter(location.address);
            }
        };
        me.setTargetLocation = function(location){
            targetLocation = location;
            me.setCenter(targetLocation);
        };
        me.getCurrLocation = function(){
        	var center = bdmap.getCenter();
    		currLocation.lng = center.lng;
    		currLocation.lat = center.lat;
            return currLocation;
        };
        me.getBaseLocation = function(){
            if(targetLocation.lng && targetLocation.lat){
                return targetLocation;
            }else if(currLocation.lng && currLocation.lat){
                return currLocation;
            }else{
                return { lng: 113.565, lat: 22.395 , address:"同望"};
            }
        };
        me.addMarkers = function(datas){
        	var tablename = me.detectTablename(datas);
        	var latestLocation;
        	for(var i=0,l=datas.length;i<l;i++){
        		var data = datas[i];
        		var lng = data[tablename + opts.longitudeColumn];
                var lat = data[tablename + opts.latitudeColumn];
                var address = data[tablename + opts.addressColumn];
                var loc = {"lng" : lng, "lat":lat, "address": address};
                if(!!lng && !!lat && !address){
                	me.solveAddress(loc);
                }else if((!lng || !lat) && !!address){
                	me.solveLocation(loc);
                }else if((!lng || !lat) && !address){
                	continue;
                }
                me.createMarkerWithInfo(loc);
                latestLocation = loc;
        	}
        	me.setTargetLocation(latestLocation);
        };
        me.createMarkerWithInfo = function(loc){
        	var marker = new BMap.Marker(new BMap.Point(loc.lng, loc.lat));
            bdmap.addOverlay(marker);

            var myInfo = new InfoOverlay(loc, loc.address, opts.readOnly);
            bdmap.addOverlay(myInfo);
            infoOverlays.push(myInfo);
            if(opts.infoVisible){
            	myInfo.show();
            }else{
            	myInfo.hide();
            }
            
            if(opts.readOnly){
            	me.el_address.text(loc.address);
            }else{
                marker.addEventListener("click", function(e){
                	me.closeAllInfoOverlays();
                    myInfo.show();
                    me.fireOnMarkerClickListeners(e);
					e.domEvent.stopPropagation();
                });
            }
        };
        me.closeAllInfoOverlays = function(){
        	for(var i=0,l=infoOverlays.length;i<l;i++){
        		infoOverlays[i].hide();
        	}
        };
        

        me.solveLocation = function(location){
            geoCoder.getPoint(location.address, function(point){
                if (point) {
                    location.lng = point.lng;
                    location.lat = point.lat;
                }
            }, me.getBaseLocation().address);
        };
        me.solveAddress = function(location){
            var pt = new BMap.Point(location.lng, location.lat);
            geoCoder.getLocation(pt, function(rs){
                location.address = me.formatAddressComponent(rs.addressComponents);
            });
        };
        me.formatAddressComponent = function(addressComponent){
            var address = '';
            if(addressComponent){
                address += addressComponent.province||"";
                address += addressComponent.city||"";
                address += addressComponent.district||"";
                address += addressComponent.street||"";
                address += addressComponent.streetNumber||"";
            }
            //console.log(address);
            return address;
        };


        me.routeSearch = function(start, end, type){
            startLocation.address = start;
            endLocation.address = end;
            me.solveLocation(startLocation);
            me.solveLocation(endLocation);

            var router = routingPolicy[type || 'driving'];
            bdmap.clearOverlays();
            router.search(start, end);
        };

        me.keywordSearch = function(words){
            var baseLoc = me.getBaseLocation();
            var basePoint = new BMap.Point(baseLoc.lng, baseLoc.lat);
            bdmap.setCenter(basePoint);
            localSearch.searchNearby(words, basePoint);
        };

        me.inputInit = function(){
            $(".jgmmap-input-btn").click(function(){
                var start = $.trim($(".jgmmap-input-text").val());
                //if(!start && currLocation.lng && currLocation.lat){
                //    start = currLocation;
                //}
                if(!!start){
                    endLocation = me.el_input.data("endLocation");
                    var end = endLocation.address;
                    var rtty = $(this).attr('data-rttype');
                    me.routeSearch(start, end, rtty);
                    me.el_input.hide();
                }else{
                    $('.jgmmap-input-text').focus();
                }
            });
            $(".jgmmap-input-action").click(function(){
                me.el_input.hide();
            });
        };

        me.runGPS = function(){
            geoLocation.getCurrentPosition(function(r){
                if(this.getStatus() == BMAP_STATUS_SUCCESS){
                    currLocation.lng = r.point.lng;
                    currLocation.lat = r.point.lat;
                    me.solveAddress(currLocation);
                    if(infoOverlays.length==0){
                    	me.setCenter(currLocation);
                    }
                }
                else {
                    console.log('位置信息获取失败,状态码:'+this.getStatus());
                }
            },{enableHighAccuracy: true})
        };

        me.detectTablename= function(dataArray){
            if(dataArray!=null && dataArray.length>0){
                for(var prop in dataArray[0]){
                    return prop.substring(0,prop.lastIndexOf('.')+1);
                }
            }
            return "";
        };

        me.addOnClickListener = function (eventHandler) {
            if (me.clickEventListeners.indexOf(eventHandler) == -1) {
                me.clickEventListeners.push(eventHandler);
            }
        };
        me.addOnDragListener = function (eventHandler) {
            if (me.dragEventListeners.indexOf(eventHandler) == -1) {
                me.dragEventListeners.push(eventHandler);
            }
        };
        me.addOnMarkerClickListener = function (eventHandler) {
            if (me.markerClickEventListeners.indexOf(eventHandler) == -1) {
                me.markerClickEventListeners.push(eventHandler);
            }
        };
        me.fireOnClickListeners = function (e) {
        	//fire click events only when readonly is true
            if(opts.readOnly) {
            	for (var i = 0, l = me.clickEventListeners.length; i < l; i++) {
                    me.clickEventListeners[i](targetLocation);
                }
            }else{
            	me.closeAllInfoOverlays();
            }
        };
        me.fireOnDragListeners = function (e) {
            for (var i = 0, l = me.dragEventListeners.length; i < l; i++) {
                me.dragEventListeners[i](e);
            }
        };
        me.fireOnMarkerClickListeners = function (e) {
            for (var i = 0, l = me.markerClickEventListeners.length; i < l; i++) {
                me.markerClickEventListeners[i](e);
            }
        };

        me.isIOS = function(){
        	var ua = navigator.userAgent.toLowerCase();	
        	if (/iphone|ipad|ipod/.test(ua)) {
        		return true;	
        	} else if (/android/.test(ua)) {
        		return false;
        	}
        	return false;
        };
        
        me.gotoNavigate = function(destLocation){
        	var baseLocation = me.getBaseLocation();
            var url = me.isIOS()?'baidumap://map/direction?':'bdapp://map/direction?';
            var origin = 'latlng:' + baseLocation.lat + ',' + baseLocation.lng + '|name:我的位置';
            var destination = 'latlng:' + destLocation.lat + ',' + destLocation.lng + '|name:目标位置';
            var mode = 'driving';
            window.location.href = url + 'origin=' + origin + '&destination=' + destination + '&mode=' + mode + '&src=JGMMap';
        };
        me.inputStartAddress = function(destLocation){
        	$(".jgmmap-input").data("endLocation", destLocation);
            $(".jgmmap-input").show();
            $('.jgmmap-input-text').focus();
        };
        
        function InfoOverlay(loc, txt, readonly){
            var self = this;
            self.loc = loc;
            self.txt = txt;
            self.width = 340;
            self.readonly = !!readonly;
        }
        InfoOverlay.prototype = new BMap.Overlay();
        InfoOverlay.prototype.initialize = function(map){
            var self = this;
            self.div = document.createElement('div');
            self.div.className = 'jgmmap-ifwd';
            self.div.style.width = self.width + 'px';
            map.getPanes().markerPane.appendChild(self.div);
            $(self.div).on('click mousemove mouseout', function(e){
            	e.stopPropagation();
            });
            return self.div;
        }
        InfoOverlay.prototype.show = function(){
            $(this.div).show();
            bdmap.setCenter(new BMap.Point(this.loc.lng, this.loc.lat));
        };
        InfoOverlay.prototype.hide = function(){
            $(this.div).hide();
        };
        // 实现绘制方法
        InfoOverlay.prototype.draw = function(){
            // 根据地理坐标转换为像素坐标，并设置给容器
            var self = this, $div = $(self.div),
                position = bdmap.pointToOverlayPixel(self.loc);
            
            me.markerInfoExtImpl($div, self.txt, self.loc, self.readonly);
            
            self.dh =  self.dh || $div.outerHeight();
            $div.css({left: position.x - self.width/2 + 'px', top: position.y - self.dh - 30 + 'px'});
        };
        
        //标注信息内容扩展点默认实现
        me.markerInfoExtImpl = function($div, address, location, readonly){
        	$div.html('<div>'+address + '</div><div class="jgmmap-ifwd-arrow"></div>');
            if(!readonly){
                var $coll = $('<div class="jgmmap-ifwd-ctl"></div>'),
                    $go = $('<a href="javascript:;" class="jgmmap-ifwd-ic jgmmap-ifwd-ic-go">去这里</a>'),
                    $nav = $('<a href="javascript:;" target="_blank" class="jgmmap-ifwd-ic jgmmap-ifwd-ic-nav">导航</a>');

                $coll.append($go).append($nav).appendTo($div);

                $div.css('padding-right', '100px');

                $go.off('click.infodraw touchstart.infodraw').on('click.infodraw touchstart.infodraw', function(){
                	me.inputStartAddress(location);
                });
                $nav.off('click.infodraw touchstart.infodraw').on('click.infodraw touchstart.infodraw', function(){
                	me.gotoNavigate(location);
                });
            }
        };

        

        var pubobj = {
            init: me.init,
            addOnClickListener : me.addOnClickListener,
            addOnDragListener : me.addOnDragListener,
            addOnMarkerClickListener : me.addOnMarkerClickListener,
            setTargetLocation: me.setTargetLocation,
            addMarkers: me.addMarkers,
            keywordSearch: me.keywordSearch,
            showRoute: me.routeSearch,
            getStartAddress: function(){ return startLocation.address; },
            getEndAddress: function(){ return endLocation.address; },
            getTargetLocation: function(){ return targetLocation; },
            getCurrLocation: me.getCurrLocation,
            //扩展标注信息接口,只需注入一个负责生成html内容的函数
            setCustomMarkerInfoExtFunction : function(func){ me.markerInfoExtImpl = func;}
        };
		return pubobj;
    };


    if ( typeof module != 'undefined' && module.exports ) {
        module.exports = JGMMap;
    } else {
        window.JGMMap = JGMMap;
    }
})(window, document, Math);
