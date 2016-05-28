(function (window, document, Math) {
    jQuery.fn.reverse = [].reverse;

    function JGMTree() {
        var me = this;
        this.cache = {};
        this.roots = [];
        this.relations = {};

        me.init = function(properties){
            this.container_id = properties.GlobalCode;
            this.idColumn = properties.IDColumn||"id";
            this.pidColumn = properties.PIDColumn;
            this.codeColumn = properties.InnerCodeColumn;
            this.leafColumn = properties.LeafNode;
            this.orderColumn = properties.OrderNoColumn;
            this.collapseIcon = properties.CollapseIcon||"iconfont icon-sanjiao3";
            this.expandIcon = properties.ExpandIcon || "iconfont icon-sanjiao1";
            this.displayMode = properties.DisplayMode;//normal,single, multi
            this.selectedBackgroundColor = "rgb("+properties.SelectedNodeBackColor+")";
            this.cascade = properties.CascadeCheck == "true";
            this.cleanup();
        };

        me.cleanup = function(){
            $("#c_"+this.container_id).empty();
            delete me.roots;
            delete me.nodemap;
            delete me.relations;
            me.cache = {};
            me.roots = [];
            me.relations = {};
        };

        me.addToCache = function(rowData){
            var id = rowData[me.tablename + me.idColumn];
            if(!!me.cache[id]) return;
            me.cache[id] = rowData;
            var pid = rowData[me.tablename + me.pidColumn];
            var isRoot = !pid;
            if(isRoot){
                me.roots.push(id);
            }else{
                var children = me.relations[pid];
                if(!children){
                    children = [];
                    me.relations[pid] = children;
                }
                children.push(id);
            }
        };

        me.appendData = function(dataArray){
            var oldTalbeName = me.tablename;
            me.tablename = me.detectTablename(dataArray);
            if(!!oldTalbeName && oldTalbeName!=me.tablename) console.error("Multiple datasource error: some data from "+oldTalbeName+" and others from "+me.tablename);
            dataArray.sort(me.sortFunction);
            dataArray.forEach(me.addToCache);
            me.roots.forEach(me.loadRowData);
            me.fireOnValueLoadedListeners();
        };

        me.sortFunction = function(row1, row2){
            var orderNo1 = row1[me.tablename + me.orderColumn];
            var orderNo2 = row2[me.tablename + me.orderColumn];
            return orderNo1>orderNo2? 1:-1;
        }

        me.detectTablename= function(dataArray){
            if(dataArray!=null && dataArray.length>0){
                for(var prop in dataArray[0]){
                    return prop.substring(0,prop.lastIndexOf('.')+1);
                }
            }
            return "";
        };

        me.getNode = function(id){
            return $("#c_"+me.container_id).find("#id_"+id);
        };
        me.entryElement = function(node){
            return node.children(".row_entry:first");
        };
        me.iconElement = function(node){
            return node.find(".entry_icon:first");
        };
        me.nameElement = function(node){
            return node.find(".entry_name:first");
        };
        me.addonElement = function(node){
            return node.find(".entry_addon:first");
        };
        me.actionElement = function(node){
            return node.find(".entry_action:first");
        };
        me.updateIndent = function(node){
            var depth = node.data("depth");
            var isLeaf = node.data("isLeaf");
            var indent = depth * 15 - (isLeaf?5:0);
            me.entryElement(node).css("margin-left", indent+"px");
        };
        me.isExpand = function(node){
            var triangle = me.iconElement(node).children(":first");
            return triangle && me.expandIcon.split(" ").every(function(c){
                    return triangle.hasClass(c);
                });
        };
        me.expand = function(node){
            me.iconElement(node).children(":first").removeClass(me.collapseIcon).addClass(me.expandIcon);
        };
        me.collapse = function(node){
            me.iconElement(node).children(":first").removeClass(me.expandIcon).addClass(me.collapseIcon);

            me.getChildren(node).hide();
        };

        me.getChildren = function(parent){
            var id = parent.data("id");
            var children = $("#c_"+me.container_id).children("div[pid='pid_"+id+"']");
            var allChildren = $(children);
            for(var i= 0,l=children.length;i<l;i++){
                var children2 = me.getChildren(children.eq(i));
                allChildren = allChildren.add(children2);
            }
            return allChildren;
        };

        me.getParents = function(node){
            var pid = node.data("pid");
            var parent = $("#c_"+me.container_id).children("div[id='id_"+pid+"']").eq(0);
            if(parent.length>0){
                parent = parent.add(me.getParents(parent));
            }
            return parent;
        };

        me.loadChildren = function(node){
            var id = node.data("id");
            var childrenIds = me.relations[id];
            if(!!childrenIds){
                childrenIds.forEach(me.loadRowData);
            }
        };

        me.loadRowData = function(id){
            if(me.getNode(id).length>0){
            	var rowElement = me.getNode(id).eq(0);
            	rowElement.show();
            	me.iconElement(rowElement).children(":first").removeClass(me.expandIcon).addClass(me.collapseIcon);
            	return;
            }
            var rowData = me.cache[id];
            var pid = rowData[me.tablename + me.pidColumn];
            var isLeaf = !!rowData[me.tablename + me.leafColumn];
            var isRoot = !pid;

            var rowElement = me.getNodeTemplate(isLeaf).createNodeElement(rowData, me.tablename);
            rowElement.attr("id","id_"+id);
            rowElement.attr("pid","pid_"+pid);
            rowElement.data("id", id);
            rowElement.data("pid", pid);
            rowElement.data("isLeaf", isLeaf);
            rowElement.data("data", rowData);

            if(isRoot){
                $("#c_"+me.container_id).append(rowElement);
                rowElement.data("depth", 1);
            }else{
                var parentNode = me.getNode(pid);
                var children = me.getChildren(parentNode);
                if(children && children.length>0){
                    children.last().after(rowElement);
                }else{
                    parentNode.after(rowElement);
                    me.expand(parentNode);
                }
                rowElement.data("depth", parentNode.data("depth")+1);
            }
            me.updateIndent(rowElement);
        };

        me.registerParentTemplate = function(parentTemplate){
            if(!parentTemplate.createNodeElement){
                console.error("Invalid Parent Node Template: please implement createNodeElement function.");
            }else{
                me.parentNodeTemplate = parentTemplate;
            }
        };
        me.registerChildTemplate = function(childTemplate){
            if(!childTemplate.createNodeElement){
                console.error("Invalid Child Node Template: please implement createNodeElement function.");
            }else{
                me.childNodeTemplate = childTemplate;
            }
        };
        me.getNodeTemplate = function(isLeaf){
            return isLeaf?me.childNodeTemplate:me.parentNodeTemplate;
        };
        me.getOriginalBackColor = function(isLeaf){
            return me.getNodeTemplate(isLeaf).getBackColor();
        };
        me.createSingleSelectedIcon = function(){
            return $("<div class='iconfont icon-check'></div>");
        };
        me.createPointIcon = function () {
            return $("<div class='entry_icon_point'></div>");
        };
        me.cleanHighlight = function(){
            $("#c_"+me.container_id).find(".row_click").each(function(){
                var isLeaf = $(this).data("isLeaf");
                $(this).removeClass("row_click").css("background-color", me.getOriginalBackColor(isLeaf));
            });
        };
        me.toggleSingleSelected = function(node){
            $("#c_"+me.container_id).find(".icon-check").remove();
            $("#c_"+me.container_id).find(".row_selected").each(function(){
                var isLeaf = $(this).data("isLeaf");
                $(this).removeClass("row_selected").css("background-color", me.getOriginalBackColor(isLeaf));
            });
            $("#c_"+me.container_id).find(".entry_icon_point").remove();

            me.actionElement(node).append(me.createSingleSelectedIcon());
            node.addClass("row_selected").css("background-color", me.selectedBackgroundColor);
            me.getParents(node).each(function(){
                me.iconElement($(this)).append(me.createPointIcon());
            });
        };
        me.isSelected = function(node){
            return me.actionElement(node).children().first().hasClass("icon-roundcheckfill");
        };
        me.selectNode = function(node){
            node.addClass("row_selected").css("background-color", me.selectedBackgroundColor);
            me.actionElement(node).children().removeClass("icon-round").addClass("icon-roundcheckfill");
        };
        me.unselectNode = function(node){
            var isLeaf = node.data("isLeaf");
            node.removeClass("row_selected").css("background-color", me.getOriginalBackColor(isLeaf));
            me.actionElement(node).children().removeClass("icon-roundcheckfill").addClass("icon-round");
        };
        me.selectParents = function(node){
            var parents = me.getParents(node).reverse();
            parents.each(function(){
                var iconElement = me.iconElement($(this));
                if(iconElement.children(".entry_icon_point").length==0){
                    iconElement.append(me.createPointIcon());
                }
            });
            me.cascade && parents.each(function(){
                if(me.getChildren($(this)).find(".icon-round").length==0){
                    me.selectNode($(this));
                }else{
                    return false;//break
                }
            });
        };
        me.unselectParents = function(node){
            me.getParents(node).reverse().each(function(){
                var children = me.getChildren($(this));
                if(children.find(".icon-roundcheckfill").length==0){
                    me.iconElement($(this)).children(".entry_icon_point").remove();
                }
                if(children.find(".icon-round").length>0){
                    me.unselectNode($(this));
                }
            });
        };
        me.toggleMultiSelected = function(node){
            var isSelected = me.isSelected(node);
            if(isSelected){
                me.unselectNode(node);
                me.iconElement(node).children(".entry_icon_point").remove();
                me.cascade && me.getChildren(node).each(function(){
                    me.unselectNode($(this));
                    me.iconElement($(this)).children(".entry_icon_point").remove();
                });
                me.unselectParents(node);
            }else{
                me.selectNode(node);
                me.cascade && me.getChildren(node).each(function(){
                    me.selectNode($(this));
                });
                me.selectParents(node);
            }
        };

        //{"code":"nodename","fieldValue":"img","DefaultValue":"img"}
        me.evalFieldMappings = function(rowdata, tablename, fieldMappings){
            var result = {};
            for(var i= 0,l=fieldMappings.length;i<l;i++){
                var val = rowdata[tablename + fieldMappings[i].fieldValue];
                val = val || fieldMappings[i].DefaultValue;
                result[fieldMappings[i].code] = val;
            }
            return result;
        };
        me.evalHtmlTemplate = function(htmlTemplate, rowdata, tablename, fieldMappings){
            var evalResult = me.evalFieldMappings(rowdata, tablename, fieldMappings);
            var	varPatten = /<%=\s*(\w+)\s*%>/g;
            return htmlTemplate.replace(varPatten, function(found, varExp){
                return evalResult[varExp];
            });
        };

        this.valueLoadedEventListeners = [];
        this.clickEventListeners = [];
        this.selectionChangedEventListeners = [];
        this.nodeCollapseEventListener = [];
        this.nodeExpandEventListener = [];
        this.parentAddonEventListener = [];
        this.childAddonEventListener = [];

        me.addOnValueLoadedListener = function (eventHandler) {
            if (me.valueLoadedEventListeners.indexOf(eventHandler) == -1) {
                me.valueLoadedEventListeners.push(eventHandler);
            }
        };
        me.addOnClickListener = function (eventHandler) {
            if (me.clickEventListeners.indexOf(eventHandler) == -1) {
                me.clickEventListeners.push(eventHandler);
            }
        };
        me.addOnSelectionChangedListener = function (eventHandler) {
            if (me.selectionChangedEventListeners.indexOf(eventHandler) == -1) {
                me.selectionChangedEventListeners.push(eventHandler);
            }
        };
        me.addNodeCollapseListener = function (eventHandler) {
            if (me.nodeCollapseEventListener.indexOf(eventHandler) == -1) {
                me.nodeCollapseEventListener.push(eventHandler);
            }
        };
        me.addNodeExpandListener = function (eventHandler) {
            if (me.nodeExpandEventListener.indexOf(eventHandler) == -1) {
                me.nodeExpandEventListener.push(eventHandler);
            }
        };
        me.addParentAddonListener = function (eventHandler) {
            if (me.parentAddonEventListener.indexOf(eventHandler) == -1) {
                me.parentAddonEventListener.push(eventHandler);
            }
        };
        me.addChildAddonListener = function (eventHandler) {
            if (me.childAddonEventListener.indexOf(eventHandler) == -1) {
                me.childAddonEventListener.push(eventHandler);
            }
        };

        me.fireOnValueLoadedListeners = function () {
            for (var i = 0, l = me.valueLoadedEventListeners.length; i < l; i++) {
                me.valueLoadedEventListeners[i]();
            }
        };
        me.fireOnClickListeners = function (rowdata) {
            for (var i = 0, l = me.clickEventListeners.length; i < l; i++) {
                me.clickEventListeners[i](rowdata);
            }
        };
        me.fireOnSelectionChangedListeners = function (rowdataArray) {
            for (var i = 0, l = me.selectionChangedEventListeners.length; i < l; i++) {
                me.selectionChangedEventListeners[i](rowdataArray);
            }
        };
        me.fireNodeCollapseListeners = function (rowdata) {
            for (var i = 0, l = me.nodeCollapseEventListener.length; i < l; i++) {
                me.nodeCollapseEventListener[i](rowdata);
            }
        };
        me.fireNodeExpandListeners = function (rowdata) {
            for (var i = 0, l = me.nodeExpandEventListener.length; i < l; i++) {
                me.nodeExpandEventListener[i](rowdata);
            }
        };
        me.fireParentAddonListeners = function (rowdata) {
            for (var i = 0, l = me.parentAddonEventListener.length; i < l; i++) {
                me.parentAddonEventListener[i](rowdata);
            }
        };
        me.fireChildAddonListeners = function (rowdata) {
            for (var i = 0, l = me.childAddonEventListener.length; i < l; i++) {
                me.childAddonEventListener[i](rowdata);
            }
        };

        me.containsSelected = function(node){
            if(me.displayMode=='single'){
                return me.getChildren(node).find(".icon-check").length>0;
            }else{
                return me.getChildren(node).find(".icon-roundcheckfill").length>0;
            }
        };

        me.getSelected = function(){
            if(me.displayMode=='single'){
                return $("#c_"+me.container_id).find(".icon-check").closest(".tree_row");
            }else{
                return $("#c_"+me.container_id).find(".icon-roundcheckfill").closest(".tree_row");
            }
        };

        me.onExpand = function (e) {
            me.cleanHighlight();
            var rowElement = $(e.target).closest(".tree_row");
            if(me.isExpand(rowElement)){
                //if(me.containsSelected(rowElement)){
                //    if(me.displayMode=='single'){
                //        rowElement.addClass("row_click");
                //    }else{
                //        me.onParentSelect(e);
                //    }
                //}else{
                    me.collapse(rowElement);
                    me.fireNodeCollapseListeners(rowElement.data("data"));
                //}
            }else{
                me.expand(rowElement);
                me.loadChildren(rowElement);
                me.fireNodeExpandListeners(rowElement.data("data"));
            }
        };

        me.onParentAddonClick = function(e){
            e.stopPropagation();
            me.cleanHighlight();
            var rowElement = $(e.target).closest(".tree_row");
            me.fireParentAddonListeners(rowElement.data("data"));
        };

        me.onChildAddonClick = function(e){
            e.stopPropagation();
            me.cleanHighlight();
            var rowElement = $(e.target).closest(".tree_row");
            me.fireChildAddonListeners(rowElement.data("data"));
        };

        me.onClick = function(e){
            me.cleanHighlight();
            var rowElement = $(e.target).closest(".tree_row");
            rowElement.addClass("row_click").css("background-color", me.selectedBackgroundColor);;
            me.fireOnClickListeners(rowElement.data("data"));
        };

        me.onParentSelect = function(e){
            if(!me.cascade)return;
            var rowElement = $(e.target).closest(".tree_row");
            if(me.isExpand(rowElement)){
                e.stopPropagation();
                me.cleanHighlight();
                var oldSelected = me.getSelected();
                me.toggleMultiSelected(rowElement);
                var newSelected = me.getSelected();
                if(newSelected.not(oldSelected).length > 0 || oldSelected.not(newSelected).length > 0){
                    me.fireOnSelectionChangedListeners(newSelected.map(function(){
                        return $(this).data("data");
                    }));
                }
            }
        };

        me.onChildSelect = function(e){
            e.stopPropagation();
            me.cleanHighlight();
            var oldSelected = me.getSelected();
            var rowElement = $(e.target).closest(".tree_row");
            if(me.displayMode=='single'){
                me.toggleSingleSelected(rowElement);
            }else if(me.displayMode=='multi'){
                me.toggleMultiSelected(rowElement);
            }
            var newSelected = me.getSelected();
            if(newSelected.not(oldSelected).length > 0 || oldSelected.not(newSelected).length > 0){
                me.fireOnSelectionChangedListeners(newSelected.map(function(){
                    return $(this).data("data");
                }));
            }
        };


    };



    if ( typeof module != 'undefined' && module.exports ) {
        module.exports = JGMTree;
    } else {
        window.JGMTree = JGMTree;
    }

})(window, document, Math);

