/**
 * 控件对外接口实现类
 */
define("./JGMRatyAction", function(require, exports, module) {
	
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
		var dsNames = windowVmManager.getDatasourceNamesByWidgetCode({
			"widgetCode" : widgetCode
		});
		var fields = windowVmManager.getFieldCodesByWidgetCode({
			"widgetCode" : widgetCode
		});
		var Observer = sandbox.getService("vjs.framework.extension.platform.interface.observer.CurrentRecordObserver");
		var dsName = dsNames[0];
		var observer = new Observer(dsName, widgetCode, null, fields);
		var globalCode = widgetContext.get(widgetCode, "GlobalCode");
		observer.setWidgetValueHandler(function(rd) {
			var value = rd.get(fields[0]);
			setValue(widgetCode, value);
		});
		observer.clearWidgetValueHandler(function() {
			setValue(widgetCode, 0);
		});
		var observerManager = sandbox.getService("vjs.framework.extension.platform.services.observer.manager.DatasourceObserverManager");
		observerManager.addObserver({
			"observer" : observer
		});
	};
	
    var setValue = function(widgetCode, value){
    	var widget = widgetContext.get(widgetCode, "widgetObj");
    	widget.setValue(value);
    	widget.refresh();
    };
    
    var initUIEvent = function(widgetCode){
    	var widget = widgetContext.get(widgetCode, "widgetObj");
    	widget.addValueChangedListeners(function(oldVall,newVal){
			widgetDatasource.setSingleValue(widgetCode, newVal);
		});
    }
    var setVisible = function(widgetCode, state) {
		globalCode = widgetContext.get(widgetCode, "GlobalCode");
		if (state) {
			$("#" + globalCode + "Container").show();
		} else {
			$("#" + globalCode + "Container").hide();
		}
	};

	exports.setVisible = setVisible;
	exports.setValue = setValue;
	exports.initEvent = initEvent;
});