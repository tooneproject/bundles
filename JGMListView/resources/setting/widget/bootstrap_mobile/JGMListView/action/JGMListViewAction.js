/**
 * 控件对外接口实现类
 */
define("./JGMListViewAction", function(require, exports, module) {
	
	var sandbox;
	var widgetContext;
	var widgetDatasource;
	var manager;
	var windowVmManager;
	var eventManager;
    var datasourceUtil;

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
        
        var widget = widgetContext.get(widgetCode, "widgetObj");
        widget.appendPageData(datas.datas);
    };
    
	var initUIEvent = function(widgetCode){
    	var widget = widgetContext.get(widgetCode, "widgetObj");
		widget.addOnClickListener(eventManager.fireEvent(widgetCode, "OnClick"));
		widget.addOnDataChangedListener(eventManager.fireEvent(widgetCode, "OnDataChanged"));
		widget.addOnValueLoadedListener(eventManager.fireEvent(widgetCode, "OnValueLoaded"));
		
		widget.setPullDownEventListener(function(){
			var pagingInfo = widget.getPaginationInfo();
			console.log("pageSize is "+pagingInfo.pageSize+" current pageNumber is "+pagingInfo.pageNumber+" (always be 1)");
			//Add refresh logic here...
			
			//Remove below simulate logic
			setTimeout(function () { // <-- Simulate network connection
				dataLoaded(widgetCode);
			}, 1000); // <-- Simulate network connection
		});
		widget.setPullUpEventListener(function(){
			var pagingInfo = widget.getPaginationInfo();
			console.log("pageSize is "+pagingInfo.pageSize+" current pageNumber is "+pagingInfo.pageNumber+" (Will pass in 2 when currently showing first page)");
			//Add paging logic here...
			
			//Remove below simulate logic
			setTimeout(function () { // <-- Simulate network connection
				dataLoaded(widgetCode);
			}, 1000); // <-- Simulate network connection
		});
    };

    var setVisible = function (widgetCode, state) {
        var widget = widgetContext.get(widgetCode, "widgetObj");
        widget.setVisible(state);
    };

    exports.setVisible = setVisible;
	exports.initEvent = initEvent;
});