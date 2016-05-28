/**
 * 控件渲染器
 */
define("./JGMPayPassword", function (require, exports, module) {
	var sandbox, widgetContext, eventManager, widgetDatasource;
	exports.initModule = function (sb) {
		sandbox = sb;
		widgetContext = sb.getService("vjs.framework.extension.platform.services.view.widget.common.context.WidgetContext");
		eventManager = sandbox.getService("vjs.framework.extension.ui.plugin.manager.eventManager");
		widgetDatasource = sandbox.getService("vjs.framework.extension.platform.services.view.widget.common.logic.datasource.WidgetDatasource");
	};
	
	/**
	 * 控件UI初始化
	 */
	var init = function (properties) {
		var GlobalCode = properties.GlobalCode;
		var widget = widgetContext.get(properties.Code, "widgetObj");
		if(widget==null){
			widget = new PayPassword(GlobalCode);
			widgetContext.put(properties.Code, "widgetObj", widget);
		}
		widget.initGraphSettings(properties);
	};
	
	/**
	 * 在这里实现操作UI的其他方法
	 */
	 
	exports.init = init;
});
