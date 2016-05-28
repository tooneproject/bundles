/**
 * 控件渲染器
 */
define("./JGMMap", function (require, exports, module) {
	var sandbox, widgetContext;
	exports.initModule = function (sb) {
		sandbox = sb;
		widgetContext = sandbox.getService("vjs.framework.extension.platform.services.view.widget.common.context.WidgetContext");
	};
	
	/**
	 * 控件UI初始化
	 */
	var init = function (properties) {
		//console.log(properties);
		var widget = widgetContext.get(properties.Code, "widgetObj");
		if(widget==null){
			widget = new JGMMap();
			widgetContext.put(properties.Code, "widgetObj", widget);
		}
		var height = properties.HeightPercent? (window.innerHeight * properties.HeightPercent / 100 + "px"):"180px";
		$("#"+properties.GlobalCode+"_parent").css("height", height);
		widget.init(properties);
	};
	
	/**
	 * 在这里实现操作UI的其他方法
	 */
	 
	exports.init = init;
});
