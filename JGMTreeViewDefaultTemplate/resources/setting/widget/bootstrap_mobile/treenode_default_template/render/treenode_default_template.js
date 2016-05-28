/**
 * 控件渲染器
 */
define("./treenode_default_template", function (require, exports, module) {
	var sandbox, widgetContext, jsonUtil;
	
	exports.initModule = function (sBox) {
		sandbox = sBox;
		widgetContext = sBox.getService("vjs.framework.extension.platform.services.view.widget.common.context.WidgetContext");
		jsonUtil = sandbox.getService("vjs.framework.extension.util.JsonUtil");
	};
	
	function ParentNodeTemplate(treeWidget, nameColumn, iconColumn, htmlTemplate, fieldMappings, backColor){
		this.treeWidget = treeWidget;
		this.nameColumn = nameColumn;
		this.iconColumn = iconColumn;
		this.htmlTemplate = htmlTemplate;
		this.fieldMappings = fieldMappings;
        this.backColor = backColor;
	};
	
	ParentNodeTemplate.prototype = {
        getBackColor : function(){return this.backColor;},
		createNodeElement : function(rowdata, tablename){
			var trianglediv = $("<div class='"+this.treeWidget.collapseIcon+"'></div>");
			var icondiv = $("<div class='entry_icon'></div>").append(trianglediv);
			var namediv = $("<div class='entry_name'></div>").text(rowdata[tablename+this.nameColumn]);
			var entrydiv = $("<div class='row_entry'></div>").append(icondiv).append(namediv);
			if(this.treeWidget.displayMode=='normal' && this.htmlTemplate && this.fieldMappings){
				var htmlContent = this.treeWidget.evalHtmlTemplate(this.htmlTemplate, rowdata, tablename, this.fieldMappings);
				var addondiv = $("<div class='entry_addon'></div>").html(htmlContent);
				addondiv.click(this.treeWidget.onParentAddonClick);
				entrydiv.append(addondiv);
			}
			if(this.treeWidget.displayMode=='multi' && this.treeWidget.cascade){
				var icondiv = $("<div class='iconfont icon-round'></div>");
	            var actiondiv = $("<div class='entry_action'></div>").append(icondiv);
	            actiondiv.click(this.treeWidget.onParentSelect);
	            entrydiv.append(actiondiv);
			}
			var rowdiv = $("<div class='tree_row row_parent'></div>").append(entrydiv).css("background-color", this.backColor);
			rowdiv.click(this.treeWidget.onExpand);
			return rowdiv;
		}
	};
	
	function ChildNodeTemplate(treeWidget, nameColumn, iconColumn, htmlTemplate, fieldMappings, backColor){
		this.treeWidget = treeWidget;
		this.nameColumn = nameColumn;
		this.iconColumn = iconColumn;
		this.htmlTemplate = htmlTemplate;
		this.fieldMappings = fieldMappings;
        this.backColor = backColor;
	};
	
	ChildNodeTemplate.prototype = {
        getBackColor : function(){return this.backColor;},
		createNodeElement : function(rowdata, tablename){
			var entrydiv = $("<div class='row_entry'></div>");
			var imgsrc = rowdata[tablename+this.iconColumn];
			if(imgsrc){
				var img = $("<img src='"+imgsrc+"' height='40px' width='40px'></img>");
				var icondiv = $("<div class='entry_icon'></div>").append(img);
				entrydiv.append(icondiv);
			}
			var namediv = $("<div class='entry_name'></div>").text(rowdata[tablename+this.nameColumn]);
			entrydiv.append(namediv);
			if(this.treeWidget.displayMode=='normal' && this.htmlTemplate && this.fieldMappings){
				var htmlContent = this.treeWidget.evalHtmlTemplate(this.htmlTemplate, rowdata, tablename, this.fieldMappings);
				var addondiv = $("<div class='entry_addon'></div>").html(htmlContent);
				addondiv.click(this.treeWidget.onChildAddonClick);
				entrydiv.append(addondiv);
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
		var widgetCode = $("#"+properties.GlobalCode).attr("widgetcode");
		var parentWidgetCode = $("#"+properties.GlobalCode).parent().attr("widgetcode");
		var widget = widgetContext.get(parentWidgetCode, "widgetObj");
		if(widget==null){
			widget = new JGMTree();
			widgetContext.put(parentWidgetCode, "widgetObj", widget);
		}
		widgetContext.put(widgetCode, "widgetObj", widget);
		widgetContext.put(widgetCode, "properties", properties);
		
		var nameColumn = properties.TitleColumnName;
		var iconColumn = properties.TitleIconColumnName;
		var treeNodeTemplate = jsonUtil.json2obj(properties.TreeNodeHTMLTemplate);
        var backColor = "rgb("+properties.BackColor+")";
		if(properties.NodeTemplateType == 'ParentNode'){
			widget.registerParentTemplate(new ParentNodeTemplate(widget, nameColumn, iconColumn, treeNodeTemplate.HTMLTemplate, treeNodeTemplate.fieldMapping, backColor));
		}else{
			widget.registerChildTemplate(new ChildNodeTemplate(widget, nameColumn, iconColumn, treeNodeTemplate.HTMLTemplate, treeNodeTemplate.fieldMapping, backColor));
		}
		
	};
	
	/**
	 * 在这里实现操作UI的其他方法
	 */
	 
	exports.init = init;
});




