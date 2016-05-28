/**
 * 控件对外接口实现类
 */
define("./JGMPayPasswordAction", function(require, exports, module) {
	
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
		var widget = widgetContext.get(widgetCode, "widgetObj");
		widget.setOnFinishedListener(function(pwd){
			widgetDatasource.setSingleValue(widgetCode, pwd);
			var externalOnFinished = eventManager.fireEvent(widgetCode, "OnFinished")
			if(externalOnFinished)externalOnFinished(pwd);
		});
		widget.setMoreActionListener(eventManager.fireEvent(widgetCode, "OnMoreOper"));
	};
	
	var setValidPassword = function(widgetCode, result){
		var widget = widgetContext.get(widgetCode, "widgetObj");
		widget.handleOnFinishedResult(result);
	};
	
	exports.setValidPassword = setValidPassword;
	exports.initEvent = initEvent;
});