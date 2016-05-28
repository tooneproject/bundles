/**
 * 控件渲染器
 */
define("./JGMListView", function (require, exports, module) {
	var sandbox;
	var widgetContext;
	
	exports.initModule = function (sBox) {
		sandbox = sBox;
		widgetContext = sBox.getService("vjs.framework.extension.platform.services.view.widget.common.context.WidgetContext");
	};
	
	var init = function (properties) {
		var GlobalCode = properties.GlobalCode;
		var IsGroups = properties.IsGroups;
		var IsMultiSelect = properties.IsMultiSelect;
		
		var widget = widgetContext.get(properties.Code, "widgetObj");
		if(widget==null){
			widget = new JGMList();
			widgetContext.put(properties.Code, "widgetObj", widget);
		}
		widget.init(GlobalCode, IsGroups, IsMultiSelect);
	};
	
	exports.init = init;
});
