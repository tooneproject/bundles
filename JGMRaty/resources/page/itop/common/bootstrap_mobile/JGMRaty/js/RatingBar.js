function RatingBar(container_id) {
    var me = this;
    this.containerId = container_id;
    this.stars = [];
    this.valueChangedListeners = [];

    this.reset = function(){
        me.stars = [];
        $("#"+me.containerId+"_bar").empty();
    };

	this.setVal = function(val){
        var oldVal = me.cfg.currVal;
        var isDoubleClickOnFirstStar = me.cfg.currVal == val && me.cfg.starVal == val;
        if(isDoubleClickOnFirstStar){
            me.cfg.currVal = 0;
        }else{
            me.cfg.currVal = val;
        }
        if(oldVal != me.cfg.currVal){
            me.fireValueChangedListeners(oldVal,me.cfg.currVal);
        }
    };
	
    this.parseSettings = function(GraphSettings){
        me.cfg = {
            starVal : Number(GraphSettings.StarVal) || 20,
            starMax : Number(GraphSettings.StarMax) || 5,
            currVal : 70,
            starIcon: GraphSettings.StarIcon||'iconfont icon-favorfill',
            highlightStarIcon : GraphSettings.HighlightStarIcon || GraphSettings.StarIcon||'iconfont icon-favorfill',
			labelText: GraphSettings.LabelText,
			labelDisplay: (GraphSettings.LabelTextVisible=='true' && GraphSettings.LabelText)?'':'none',
            labelPercentWidth: GraphSettings.LabelPercentWidth,
            labelTextAlign: GraphSettings.LabelTextAlign||"left",
            starAlign: GraphSettings.StarAlign||"right",
			readOnly : GraphSettings.ReadOnly=='true'
        };
        var labelWidth = me.cfg.labelDisplay=="none"?0:Number(me.cfg.labelPercentWidth);
        var starWidth = 99.9 - labelWidth;
        $("#"+me.containerId+"_label").css("display", me.cfg.labelDisplay).css("width",labelWidth+"%")
            .css("text-align",me.cfg.labelTextAlign).text(me.cfg.labelText);
        $("#"+me.containerId+"_stars").css("width",starWidth+"%");
        $("#"+me.containerId+"_bar").addClass(me.cfg.starAlign);
    };

    this.updateUI = function(){
        for(var i=0,l=me.cfg.starMax;i<l;i++){
            var delta = me.cfg.currVal - me.cfg.starVal * i;
            var rate = Math.round(delta * 100 / me.cfg.starVal)/100;
            me.stars[i].removeClass("on").removeClass(me.cfg.starIcon).removeClass(me.cfg.highlightStarIcon).children().remove();
            if(rate>=1){
                me.stars[i].addClass(me.cfg.highlightStarIcon).addClass("on");
            }else if(rate>0){
                var width = Math.round(22 * rate);
                var halfdiv = $("<i class='"+me.cfg.highlightStarIcon+" jgmstar half' style='font-size:22px'></i>").css("margin-left","-22px").css("width",width);
                me.stars[i].addClass(me.cfg.highlightStarIcon).append(halfdiv);
            }else{
                me.stars[i].addClass(me.cfg.starIcon);
            }
			
			var starWrap = me.stars[i].parent();
			starWrap.removeClass("hand_cursor");
			if(!me.cfg.readOnly){
				starWrap.addClass("hand_cursor");
			}
			
        }
    };

    this.initStars = function(){
        for(var i=0,l=me.cfg.starMax;i<l;i++){
            var star = $("<i class='"+me.cfg.starIcon+" jgmstar'style='font-size:22px'></i>");
            var starWrap = $("<div id='d"+i+"' class='jgmstar_wrap'></div>")
                //.css("width",(100/me.cfg.starMax)+"%")
                .append(star)
                .click(me.onStarClick);
            $("#"+me.containerId+"_bar").append(starWrap);
            me.stars.push(star);
        }
        $("#"+me.containerId+"_bar").css("width",(30 * me.cfg.starMax - 8)+"px");
    };

    this.onStarClick = function(e){
    	if(me.cfg.readOnly) return;
        var idx = Number(this.id.substr(1));
        var val = me.cfg.starVal * (idx + 1);
        me.setVal(val);
        me.updateUI();
    };

    this.initConfig = function(GraphSettings){
        this.reset();
        this.parseSettings(GraphSettings);
        this.initStars();
    };
	
	this.initCurrVal = function(value){
        me.cfg.currVal = value;
    };

    this.fireValueChangedListeners = function(oldVall,newVal){
        for(var i=0,l=me.valueChangedListeners.length;i<l;i++){
            me.valueChangedListeners[i](oldVall,newVal);
        }
    };
}

RatingBar.prototype.initGraphSettings = function(GraphSettings){
    this.initConfig(GraphSettings);
};
RatingBar.prototype.setValue = function(value){
    this.initCurrVal(value);
};
RatingBar.prototype.refresh = function(){
    this.updateUI();
};

RatingBar.prototype.addValueChangedListeners = function(eventHandler){
    if(this.valueChangedListeners.indexOf(eventHandler)==-1){
        this.valueChangedListeners.push(eventHandler);
    }
};