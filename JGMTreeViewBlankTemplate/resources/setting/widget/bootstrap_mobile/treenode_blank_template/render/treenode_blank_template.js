/**
 * 控件渲染器
 */
define("./treenode_blank_template", function (require, exports, module) {
	var sandbox, widgetContext, jsonUtil;
	
	exports.initModule = function (sBox) {
		sandbox = sBox;
		widgetContext = sBox.getService("vjs.framework.extension.platform.services.view.widget.common.context.WidgetContext");
		jsonUtil = sandbox.getService("vjs.framework.extension.util.JsonUtil");
	};
	
	function ParentNodeTemplate(treeWidget, htmlTemplate, fieldMappings, backColor){
		this.treeWidget = treeWidget;
		this.htmlTemplate = htmlTemplate;
		this.fieldMappings = fieldMappings;
        this.backColor = backColor;
	};
	
	ParentNodeTemplate.prototype = {
        getBackColor : function(){return this.backColor;},
		createNodeElement : function(rowdata, tablename){
			var trianglediv = $("<div class='"+this.treeWidget.collapseIcon+"'></div>");
			var icondiv = $("<div class='entry_icon'></div>").append(trianglediv);
			var entrydiv = $("<div class='row_entry '></div>").append(icondiv);
			if(this.htmlTemplate && this.fieldMappings){
				var htmlContent = this.treeWidget.evalHtmlTemplate(this.htmlTemplate, rowdata, tablename, this.fieldMappings);
				var namediv = $("<div class='entry_name'></div>").html(htmlContent);
				entrydiv.append(namediv);
			}
			var rowdiv = $("<div class='tree_row row_parent'></div>").append(entrydiv).css("background-color", this.backColor);
			rowdiv.click(this.treeWidget.onExpand);
			return rowdiv;
		}
	};
	
	function ChildNodeTemplate(treeWidget, htmlTemplate, fieldMappings, backColor){
		this.treeWidget = treeWidget;
		this.htmlTemplate = htmlTemplate;
		this.fieldMappings = fieldMappings;
        this.backColor = backColor;
	};
	
	ChildNodeTemplate.prototype = {
        getBackColor : function(){return this.backColor;},
		createNodeElement : function(rowdata, tablename){
			var entrydiv = $("<div class='row_entry'></div>");
			if(this.htmlTemplate && this.fieldMappings){
				var htmlContent = this.treeWidget.evalHtmlTemplate(this.htmlTemplate, rowdata, tablename, this.fieldMappings);
				var namediv = $("<div class='entry_name'></div>").html(htmlContent);
				entrydiv.append(namediv);
			}
			if(this.treeWidget.displayMode=='multi'){
				var icondiv = $("<div class='iconfont icon-round'></div>");
	            var actiondiv = $("<div class='entry_action'></div>").append(icondiv);
	            entrydiv.append(actiondiv);
			}else if(this.treeWidget.displayMode=='single'){
				var actiondiv = $("<div class='entry_action'></div>");
				entrydiv.append(actiondiv);
			}
			var rowdiv = $("<div class='tree_row row_child'></div>").append(entrydiv).css("background-color", this.backColor);
			if(this.treeWidget.displayMode=='normal'){
				rowdiv.click(this.treeWidget.onClick);
			}else{
				rowdiv.click(this.treeWidget.onChildSelect);
			}
			return rowdiv;
		}
	};
	
	/**
	 * 控件UI初始化
	 */
	var init = function (properties) {
		var parentWidgetCode = $("#"+properties.GlobalCode).parent().attr("widgetcode");
		var widget = widgetContext.get(parentWidgetCode, "widgetObj");
		if(widget==null){
			widget = new JGMTree();
			widgetContext.put(parentWidgetCode, "widgetObj", widget);
		}
		var treeNodeTemplate = jsonUtil.json2obj(properties.TreeNodeHTMLTemplate);
        var backColor = "rgb("+properties.BackColor+")";
		if(properties.NodeTemplateType == 'ParentNode'){
			widget.registerParentTemplate(new ParentNodeTemplate(widget, treeNodeTemplate.HTMLTemplate, treeNodeTemplate.fieldMapping, backColor));
		}else{
			widget.registerChildTemplate(new ChildNodeTemplate(widget, treeNodeTemplate.HTMLTemplate, treeNodeTemplate.fieldMapping, backColor));
		}
	};
	
	/**
	 * 在这里实现操作UI的其他方法
	 */
	 
	exports.init = init;
});




