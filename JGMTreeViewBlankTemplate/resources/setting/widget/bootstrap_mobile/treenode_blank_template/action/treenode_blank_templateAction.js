/**
 * 控件对外接口实现类
 */
define("./treenode_blank_templateAction", function(require, exports, module) {
	
	var viewModel, sandbox, innerSandBox;

	exports.initModule = function(sb) {
		sandbox = sb;
	};
	
	/**
	 * 初始化控件事件。
	 * 
	 * 渲染完成后触发，一般在这里进行ui的事件监听和事件绑定。
	 */
	var initEvent = function(widgetCode) {
		
	};

	exports.initEvent = initEvent;
});