/**
 * 控件渲染器
 */
define("./JGMChart", function (require, exports, module) {
	var sandbox;
	var widgetContext;

	exports.initModule = function (sBox) {
		sandbox = sBox;
		widgetContext = sBox.getService("vjs.framework.extension.platform.services.view.widget.common.context.WidgetContext");
	};
	
	/**
	 * 控件UI初始化
	 */
	var init = function (properties) {
		var GlobalCode = properties.GlobalCode;
		var GraphSettings = properties.GraphSettings;
		if (typeof GraphSettings === 'string') {
			GraphSettings = eval("(" + GraphSettings + ")");
		}
		
		if(GraphSettings.size && GraphSettings.size.high){
			$("#" + GlobalCode).css("height", GraphSettings.size.high + "px");
		}else{
			console.error("配置信息错误，缺失高度配置信息。");
		}
		
		var widget = new V3Chart(GlobalCode, GraphSettings);
		widgetContext.put(properties.Code, "widgetObj", widget);
	};
	
	/**
	 * 在这里实现操作UI的其他方法
	 */
	 
	exports.init = init;
});
