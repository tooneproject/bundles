/**
 * 控件对外接口实现类
 */
define("./JGMTreeViewAction", function(require, exports, module) {
	
	var sandbox, widgetContext, widgetDatasource, manager, windowVmManager, eventManager, datasourceUtil;

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
        widget.appendData(datas.datas);
    };
    
	var initUIEvent = function(widgetCode){
    	var widget = widgetContext.get(widgetCode, "widgetObj");
    	widget.addOnValueLoadedListener(eventManager.fireEvent(widgetCode, "OnValueLoaded"));
    	widget.addOnClickListener(eventManager.fireEvent(widgetCode, "OnClick"));
    	widget.addNodeCollapseListener(eventManager.fireEvent(widgetCode, "NodeCollapseEvent"));
    	widget.addNodeExpandListener(eventManager.fireEvent(widgetCode, "NodeExpandEvent"));
    	widget.addOnSelectionChangedListener(eventManager.fireEvent(widgetCode, "OnSelectionChanged"));
	};

	exports.initEvent = initEvent;
});