/**
 * 控件渲染器
 */
define("./listview_row_tempate", function (require, exports, module) {
	var sandbox;
	var widgetContext;
	
	exports.initModule = function (sBox) {
		sandbox = sBox;
		widgetContext = sBox.getService("vjs.framework.extension.platform.services.view.widget.common.context.WidgetContext");
	};
	
	function RowTemplate(){
		var me = this;
		me.createLeftIcon = function(rowData, tablename, field){
			var iconSrc = rowData[tablename + field];
			if(iconSrc){
				return "<img class='row_content_icon' src='"+iconSrc+"'></img>";
			}else{
				return null;
			}
		};
		me.createRightTips = function(rowData, tablename, field){
			var tips = rowData[tablename + field];
			if(tips){
				return "<div class='row_tips'>"+tips+"</div>";
			}else{
				return null;
			}
		};
	}
	
	function DefaultRowTemplate(rowKey, iconKey, tipsKey){
		this.rowKey = rowKey;
		this.iconKey = iconKey;
		this.tipsKey = tipsKey;
		var me = this;
		me.getSelectedRows = function(){
			return $("li.li_row_selected");
		};
		me.createRowElement = function(rowData, tablename){
			var rightTips = this.createRightTips(rowData, tablename, this.tipsKey);
			var rightIcon = "<i class='right_icon icon-right'></i>";
			var rowRight = $("<div class='row_right'></div>");
			if(rightTips!=null)rowRight.append(rightTips);
			rowRight.append(rightIcon);
			
			var leftIcon = this.createLeftIcon(rowData, tablename, this.iconKey);
			var leftText = rowData[tablename + this.rowKey]||"";
			var rowLeft = "<div class='row_content'>"+(leftIcon==null?"":leftIcon)+leftText+"</div>";
			
			var rowLi = $("<li class='li_row'></li>").append(rowRight).append(rowLeft).click(this.onRowClick);
			return rowLi;
		};
		me.onRowClick = function(){
			var li = $(this);
			var checked = li.hasClass("li_row_selected");
			if(checked){
				li.removeClass("li_row_selected");
			}else{
				$("li.li_row_selected").removeClass("li_row_selected");
				li.addClass("li_row_selected");
			}
		};
	}
	
	DefaultRowTemplate.prototype = new RowTemplate();
	
	function MultiSelectRowTemplate(rowKey, iconKey, tipsKey){
		this.rowKey = rowKey;
		this.iconKey = iconKey;
		this.tipsKey = tipsKey;
		var me = this;
		me.getSelectedRows = function(){
			return $("i.right_icon_checked").parent();
		};
		me.createRowElement = function(rowData, tablename){
			var rightTips = this.createRightTips(rowData, tablename, this.tipsKey);
			var rightIcon = "<i class='right_icon right_icon_unchecked icon-round'></i>";
			var rowRight = $("<div class='row_right'></div>");
			if(rightTips!=null)rowRight.append(rightTips);
			rowRight.append(rightIcon);
			
			var leftIcon = this.createLeftIcon(rowData, tablename, this.iconKey);
			var leftText = rowData[tablename + this.rowKey]||"";
			var rowLeft = "<div class='row_content'>"+(leftIcon==null?"":leftIcon)+leftText+"</div>";
			
			var rowLi = $("<li class='li_row'></li>").append(rowRight).append(rowLeft).click(this.onRowClick);
			return rowLi;
		};
		me.onRowClick = function(){
			var div = $(this).find("i");
			var checked = div.hasClass("icon-round");
			if(checked){
				div.removeClass("icon-round").addClass("icon-roundcheckfill");
				div.removeClass("right_icon_unchecked").addClass("right_icon_checked");
			}else{
				div.removeClass("icon-roundcheckfill").addClass("icon-round");
				div.removeClass("right_icon_checked").addClass("right_icon_unchecked");
			}
		};
	}
	
	MultiSelectRowTemplate.prototype = new RowTemplate();
	
	var init = function (properties) {
		var parentWidgetCode = $("#"+properties.GlobalCode).parent().attr("widgetcode");
		var widget = widgetContext.get(parentWidgetCode, "widgetObj");
		if(widget==null){
			widget = new JGMList();
			widgetContext.put(parentWidgetCode, "widgetObj", widget);
		}
		widget.registDefaultRowTemplate(new DefaultRowTemplate(properties.ColumnName, properties.IconColumnName, properties.TipsColumnName));
		widget.registMultiSelRowTemplate(new MultiSelectRowTemplate(properties.ColumnName, properties.IconColumnName, properties.TipsColumnName));
	};
	
	exports.init = init;
});
