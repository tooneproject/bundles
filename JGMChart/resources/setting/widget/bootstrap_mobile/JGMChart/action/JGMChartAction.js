/**
 * 控件对外接口实现类
 */
define("./JGMChartAction", function(require, exports, module) {
	
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
        	loadData(widgetCode);
        });
        datasourceUtil.addDatasourceInsertEventHandler(datasourceName, function(rd) {
        	loadData(widgetCode);
        });
        datasourceUtil.addDatasourceUpdateEventHandler(datasourceName, function(rd) {
        	loadData(widgetCode);
        });
        datasourceUtil.addDatasourceDeleteEventHandler(datasourceName, function(rd) {
        	loadData(widgetCode);
        });
    };

    var loadData = function(widgetCode){
        var datasourceName = widgetDatasource.getBindDatasourceName(widgetCode);
        var isQuery = windowVmManager.isCustomSqlDataSource({"datasourceName":datasourceName});
        var datasource = manager.lookup({"datasourceName":datasourceName});
        var datas = datasource.getAllRecords();
        var dataMaps = datas.datas;
        var chartdata =  {};
        chartdata["recordCount"]=dataMaps.length;
        chartdata["values"]=dataMaps;

        var widget = widgetContext.get(widgetCode, "widgetObj");
        widget.drawchart(chartdata);
    };
    var initUIEvent = function(widgetCode){
    	var widget = widgetContext.get(widgetCode, "widgetObj");
		widget.addOnClickListener(eventManager.fireEvent(widgetCode, "OnChartClick"));
    };

    var setVisible = function (widgetCode, state) {
        var widget = widgetContext.get(widgetCode, "widgetObj");
        widget.setVisible(state);
    };

    exports.setVisible = setVisible;

	exports.initEvent = initEvent;
});