/**
 * 控件数据同步类
 */
define("./JGMListViewHandler", function(require, exports, module) {
	var sandbox;

	exports.initModule = function(sb) {
		sandbox = sb;
	};
	
	/**
	 * 控件数据同步到前台DB
	 * 
	 * 渲染完成后自动触发，一般这里定义事件响应。包括UI同步到DB等逻辑。
	 */
	exports.init = function(widgetCode) {
		
	};
	
});