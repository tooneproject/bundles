/**
 * 控件对外接口实现类
 */
define("./JGMMapAction", function(require, exports, module) {
	
	var sandbox, widgetContext, widgetDatasource, manager, windowVmManager, eventManager, datasourceUtil;
	var startAddress,endAddress, targetLng, targetLat, targetAddress;
	exports.initModule = function(sb) {
		sandbox = sb;
		widgetContext = sandbox.getService("vjs.framework.extension.platform.services.view.widget.common.context.WidgetContext");
		widgetDatasource = sandbox.getService("vjs.framework.extension.platform.services.view.widget.common.logic.datasource.WidgetDatasource");
		manager = sandbox.getService("vjs.framework.extension.platform.services.model.manager.datasource.DatasourceManager");
		datasourceUtil = sandbox.getService("vjs.framework.extension.platform.services.view.logic.datasource.DatasourceUtil");
		windowVmManager = sandbox.getService("vjs.framework.extension.platform.services.vmmapping.manager.WindowVMMappingManager");
		eventManager = sandbox.getService("vjs.framework.extension.platform.services.view.event.EventManager");
	};
	
	/**
	 * 初始化控件事件。
	 * 
	 * 渲染完成后触发，一般在这里进行ui的事件监听和事件绑定。
	 */
	var initEvent = function(widgetCode) {
		initBindData(widgetCode);
		initUIEvent(widgetCode);
	};
	
	var initBindData = function(widgetCode){
		var datasourceName = widgetDatasource.getBindDatasourceName(widgetCode);
        datasourceUtil.addDatasourceLoadEventHandler(datasourceName, function(rd) {
        	dataLoaded(widgetCode);
        });
	};
	var dataLoaded = function(widgetCode){
		var datasourceName = widgetDatasource.getBindDatasourceName(widgetCode);
        var isQuery = windowVmManager.isCustomSqlDataSource({"datasourceName":datasourceName});
        var datasource = manager.lookup({"datasourceName":datasourceName});
        var datas = datasource.getAllRecords();
        
        if(!!datas && !!datas.datas && !!datas.datas.length){
        	var widget = widgetContext.get(widgetCode, "widgetObj");
        	widget.addMarkers(datas.datas);
        }
    };
    
	var initUIEvent = function(widgetCode){
    	var widget = widgetContext.get(widgetCode, "widgetObj");
    	widget.addOnClickListener(eventManager.fireEvent(widgetCode, "OnClick"));
    	widget.addOnMarkerClickListener(eventManager.fireEvent(widgetCode, "OnMarkerClick"));
    	widget.addOnDragListener(eventManager.fireEvent(widgetCode, "OnDrag"));
//    	widget.addValueChangedListeners(function(oldVall,newVal){
//			widgetDatasource.setSingleValue(widgetCode, newVal);
//		});
	};
	
	var getVisible = function(widgetCode){
		return $("#" + globalCode + "Parent").css("display")!="none";
	};
	var setVisible = function(widgetCode, state) {
		var globalCode = widgetContext.get(widgetCode, "GlobalCode");
		if (state) {
			$("#" + globalCode + "_parent").show();
		} else {
			$("#" + globalCode + "_parent").hide();
		}
	};

	var getStartAddress = function(widgetCode){
		var widget = widgetContext.get(widgetCode, "widgetObj");
		return widget.getStartAddress();
	};
	var getEndAddress = function(widgetCode){
		var widget = widgetContext.get(widgetCode, "widgetObj");
		return widget.getEndAddress();
	};
	var setStartAddress = function(widgetCode, address){
		startAddress = address;
		tryToShowRoute(widgetCode);
	};
	var setEndAddress = function(widgetCode, address){
		endAddress = address;
		tryToShowRoute(widgetCode);
	};
	var tryToShowRoute = function(widgetCode){
		if(!!startAddress && !!endAddress){
			var widget = widgetContext.get(widgetCode, "widgetObj");
			widget.showRoute(startAddress, endAddress);
		}
	};
	
	var getTargetLng = function(widgetCode){
		var widget = widgetContext.get(widgetCode, "widgetObj");
		return widget.getTargetLocation().lng;
	};
	var getTargetLat = function(widgetCode){
		var widget = widgetContext.get(widgetCode, "widgetObj");
		return widget.getTargetLocation().lat;
	};
	var getTargetAddress = function(widgetCode){
		var widget = widgetContext.get(widgetCode, "widgetObj");
		return widget.getTargetLocation().address;
	};
	var setTargetLng = function(widgetCode, lng){
		targetLng = lng;
		tryToSetTargetLocation(widgetCode);
	};
	var setTargetLat = function(widgetCode, lat){
		targetLat = lat;
		tryToSetTargetLocation(widgetCode);
	};
	var setTargetAddress = function(widgetCode, address){
		targetAddress = address;
		tryToSetTargetLocation(widgetCode);
	};
	var tryToSetTargetLocation = function(widgetCode){
		if((!!targetLng && !!targetLat) || !!targetAddress){
			var widget = widgetContext.get(widgetCode, "widgetObj");
			widget.setTargetLocation({lng:targetLng, lat:targetLat, address:targetAddress});
		}
	};
	
	var getCurrentLng = function(widgetCode){
		var widget = widgetContext.get(widgetCode, "widgetObj");
		return widget.getCurrLocation().lng;
	};
	var getCurrentLat = function(widgetCode){
		var widget = widgetContext.get(widgetCode, "widgetObj");
		return widget.getCurrLocation().lat;
	};
	
	var setKeyword = function(widgetCode, keyword){
		var widget = widgetContext.get(widgetCode, "widgetObj");
		widget.keywordSearch(keyword);
	};
	
	var setGPSVisible = function(widgetCode, state){
		var widget = widgetContext.get(widgetCode, "widgetObj");
		widget.setGPSVisible(state);
	};
	var getGPSVisible = function(wigetCode){
		var widget = widgetContext.get(widgetCode, "widgetObj");
		return widget.getGPSVisible();
	};
	
	exports.initEvent = initEvent;
	exports.getVisible = getVisible;
	exports.setVisible = setVisible;
	
	exports.getStartAddress = getStartAddress;
	exports.getEndAddress = getEndAddress;
	exports.setStartAddress = setStartAddress;
	exports.setEndAddress = setEndAddress;
	
	exports.getTargetLng = getTargetLng;
	exports.getTargetLat = getTargetLat;
	exports.getTargetAddress = getTargetAddress;
	exports.setTargetLng = setTargetLng;
	exports.setTargetLat = setTargetLat;
	exports.setTargetAddress = setTargetAddress;
	
	exports.getCurrentLng = getCurrentLng;
	exports.getCurrentLat = getCurrentLat;
	
	exports.setKeyword = setKeyword;
});