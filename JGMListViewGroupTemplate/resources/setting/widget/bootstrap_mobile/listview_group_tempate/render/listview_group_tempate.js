/**
 * 控件渲染器
 */
define("./listview_group_tempate", function (require, exports, module) {
	var sandbox;
	var widgetContext;
	
	exports.initModule = function (sBox) {
		sandbox = sBox;
		widgetContext = sBox.getService("vjs.framework.extension.platform.services.view.widget.common.context.WidgetContext");
	};
	
	function DefaultGroupTemplate(groupKey){
		this.groupKey = groupKey;
	}
	
	DefaultGroupTemplate.prototype = {
		getGroupKey : function(){
			return this.groupKey;
		},
		createGroupElement : function(groupName, multiSelect){
			var groupLi = $("<li></li>").text(groupName);
			groupLi.addClass(multiSelect=='true'?'li_group':'li_group_large');
			return groupLi;
		}
	};
	
	var init = function (properties) {
		var parentWidgetCode = $("#"+properties.GlobalCode).parent().attr("widgetcode");
		var widget = widgetContext.get(parentWidgetCode, "widgetObj");
		if(widget==null){
			widget = new JGMList();
			widgetContext.put(parentWidgetCode, "widgetObj", widget);
		}
		//widget.registGroupTemplate(new DefaultGroupTemplate(properties.ColumnName));
	};
	
	exports.init = init;
});
