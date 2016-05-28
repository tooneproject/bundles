/**
 * 控件数据同步类
 */
define("./treenode_blank_templateHandler", function(require, exports, module) {
	var sandbox;

	exports.initModule = function(sb) {
		sandbox = sb;
	};
	
	/**
	 * 控件数据同步到前台DB
	 * 
	 * 渲染完成后自动触发，一般这里定义事件响应。包括UI同步到DB等逻辑。
	 */
	exports.init = function(widgetType, element, valueAccessor, widgetCode) {
		
	};
	
	/**
	 * 前台DB数据同步响应方法。
	 * 
	 * 前台DB数据变化后自动触发，一般在这里对UI进行更新操作。
	 */
	exports.update = function(widgetType, element, valueAccessor, widgetCode) {
		
	};
});