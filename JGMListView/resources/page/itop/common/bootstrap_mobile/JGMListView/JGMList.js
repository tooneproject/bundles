(function (window, document, Math) {

function JGMList() {
	this.pageSize = 10;
	this.pageNumber = 0;
	this.rowmap = {};
	this.cleanupFlag = false;
	
	this.clickEventListeners = [];
	this.dataChangedEventListeners = [];
	this.valueLoadedEventListeners = [];
	this.pullUpEventListener = null;
	this.pullDownEventListener = null;
	
	var me = this;
	me.getPaginationInfo = function(){
		return {pageSize:this.pageSize, pageNumber:this.pageNumber+1};
	};
	me.pullDownAction = function(theScroller) {
		me.pageNumber = 0;
		me.cleanupFlag = true;//will cleanup data when new data arrived.
		if(me.pullDownEventListener)me.pullDownEventListener();
	};
	me.pullUpAction = function(theScroller) {
		if(me.pullUpEventListener)me.pullUpEventListener();
	};
	me.init = function(container_id, showGroups, multiSelect){
		this.container_id = container_id;
		this.showGroups = showGroups;
		this.multiSelect = multiSelect;
		this.myScroll = new IScrollPullUpDown(container_id, {
			probeType : 2,
			bounceTime : 250,
			bounceEasing : 'quadratic',
			mouseWheel : false,
			scrollbars : true,
			fadeScrollbars : true,
			interactiveScrollbars : false
		}, this.pullDownAction, this.pullUpAction);
	};
	me.registGroupTemplate = function(groupTemplate){
		if(!groupTemplate.getGroupKey){
			console.error("Invalid Group Template: please implement getGroupKey function.");
		}else if(!groupTemplate.createGroupElement){
			console.error("Invalid Group Template: please implement createGroupElement function.");
		}else{
			this.groupTemplate = groupTemplate;
		}
	};
	me.registDefaultRowTemplate = function(rowTemplate){
		if(!rowTemplate.getSelectedRows){
			console.error("Invalid Row Template: please implement getSelectedRows function.");
		}else if(!rowTemplate.createRowElement){
			console.error("Invalid Row Template: please implement createRowElement function.");
		}else{
			this.defaultRowTemplate = rowTemplate;
		}
	};
	me.registMultiSelRowTemplate = function(rowTemplate){
		if(!rowTemplate.getSelectedRows){
			console.error("Invalid Row Template: please implement getSelectedRows function.");
		}else if(!rowTemplate.createRowElement){
			console.error("Invalid Row Template: please implement createRowElement function.");
		}else{
			this.msRowTemplate = rowTemplate;
		}
	};
	me.getRowTemplate = function(){
		return this.multiSelect=="true"?this.msRowTemplate:this.defaultRowTemplate;
	};
	me.cleanup = function(){
		$("#ul_"+this.container_id).empty();
		this.rowmap = {};
		this.cleanupFlag = false;
	};
	me.appendPageData = function(pageData){
		if(this.cleanupFlag) this.cleanup();
		var reachEnd = pageData==null || pageData.length==0;
		if(!reachEnd){
			this.tablename = this.detectTablename(pageData);
			for(var i=0,l=pageData.length;i<l;i++){
				var rowData = pageData[i];
				this.loadRowData(rowData);
			}
			this.pageNumber++;
			this.onValueLoaded();
		}else{
			$(".pullUpLabel").text("没有更多数据");
		}
		if(this.myScroll.iScroll)this.myScroll.iScroll.refresh();
	};
	me.loadRowData = function(rowData){
		var groupKey = this.groupTemplate&&this.groupTemplate.getGroupKey();
		var groupValue = rowData[this.tablename + groupKey];
		var groupArray = this.getOrCreateGroupArray(groupValue);
		var rowElement = this.getRowTemplate().createRowElement(rowData, this.tablename);
		rowElement.data("data", rowData);
		rowElement.click(this.onClick);
		if(groupArray.length==0){
			$("#ul_"+this.container_id).append(rowElement);
		}else{
			groupArray[groupArray.length-1].after(rowElement);
		}
		groupArray.push(rowElement);
	};
	me.getOrCreateGroupArray= function(groupValue){
		if(groupValue && this.showGroups=='true'){
			var groupArray = this.rowmap[groupValue];
			if(groupArray==null){
				var groupElement = this.groupTemplate.createGroupElement(groupValue, this.multiSelect);
				$("#ul_"+this.container_id).append(groupElement);
				groupArray = [groupElement];
				this.rowmap[groupValue] = groupArray;
			}
			return groupArray;
		}else{
			var groupArray = this.rowmap["default"];
			if(groupArray==null){
				groupArray = [];
				this.rowmap[groupValue] = groupArray;
			}
			return groupArray;
		}
	};
	me.detectTablename= function(dataArray){
		if(dataArray!=null && dataArray.length>0){
            for(var prop in dataArray[0]){
                return prop.substring(0,prop.lastIndexOf('.')+1);
            }
		}
		return null;
	};
	me.addOnClickListener= function(eventHandler){
		if(this.clickEventListeners.indexOf(eventHandler)==-1){
	        this.clickEventListeners.push(eventHandler);
		}
	};
	me.addOnDataChangedListener = function(eventHandler){
		if(this.dataChangedEventListeners.indexOf(eventHandler)==-1){
	        this.dataChangedEventListeners.push(eventHandler);
		}
	};
	me.addOnValueLoadedListener = function(eventHandler){
		if(this.valueLoadedEventListeners.indexOf(eventHandler)==-1){
	        this.valueLoadedEventListeners.push(eventHandler);
		}
	};
	me.setPullDownEventListener = function(eventHandler){
		this.pullDownEventListener = eventHandler;
	};
	me.setPullUpEventListener = function(eventHandler){
		this.pullUpEventListener = eventHandler;
	};
	me.onClick = function(eventObj){
		//fire onClickEventListeners
        for(var i=0,l=me.clickEventListeners.length;i<l;i++){
            me.clickEventListeners[i]($(this).data("data"));
        }
        //fire dataChangedEventListeners
        var selectedRows = me.getRowTemplate().getSelectedRows();
        var selectedData = selectedRows.map(me.elementToData);
        for(var i=0,l=me.dataChangedEventListeners.length;i<l;i++){
        	me.dataChangedEventListeners[i](selectedData);
        }
	};
	me.onValueLoaded = function(data){
        for(var i=0,l=me.valueLoadedEventListeners.length;i<l;i++){
        	me.valueLoadedEventListeners[i](data);
        }
	};
	me.elementToData = function(idx, el){
		return $(el).data("data");
	};
};

var IScrollPullUpDown = function (wrapperName, iScrollConfig, pullDownActionHandler, pullUpActionHandler) {
	var iScrollConfig,
	pullDownActionHandler,
	pullUpActionHandler,
	pullDownEl,
	pullDownOffset,
	pullUpEl,
	scrollStartPos;
	var pullThreshold = 5;
	var me = this;

	function showPullDownElNow(className) {
		// Shows pullDownEl with a given className
		pullDownEl.style.transitionDuration = '';
		pullDownEl.style.marginTop = '';
		pullDownEl.className = 'pullDown ' + className;
	}
	var hidePullDownEl = function (time, refresh) {
		// Hides pullDownEl
		pullDownEl.style.transitionDuration = (time > 0 ? time + 'ms' : '');
		pullDownEl.style.marginTop = '';
		pullDownEl.className = 'pullDown scrolledUp';

		// If refresh==true, refresh again after time+10 ms to update iScroll's "scroller.offsetHeight" after the pull-down-bar is really hidden...
		// Don't refresh when the user is still dragging, as this will cause the content to jump (i.e. don't refresh while dragging)
		if (refresh)
			setTimeout(function () {
				me.iScroll.refresh();
			}, time + 10);
	}

	function init() {
		var wrapperObj = document.querySelector('#' + wrapperName);
		var scrollerObj = wrapperObj.children[0];

		if (pullDownActionHandler) {
			// If a pullDownActionHandler-function is supplied, add a pull-down bar at the top and enable pull-down-to-refresh.
			// (if pullDownActionHandler==null this iScroll will have no pull-down-functionality)
			pullDownEl = document.createElement('div');
			pullDownEl.className = 'pullDown scrolledUp';
			pullDownEl.innerHTML = '<span class="pullDownIcon"></span><span class="pullDownLabel">下拉刷新...</span>';
			scrollerObj.insertBefore(pullDownEl, scrollerObj.firstChild);
			pullDownOffset = pullDownEl.offsetHeight;
		}
		if (pullUpActionHandler) {
			// If a pullUpActionHandler-function is supplied, add a pull-up bar in the bottom and enable pull-up-to-load.
			// (if pullUpActionHandler==null this iScroll will have no pull-up-functionality)
			pullUpEl = document.createElement('div');
			pullUpEl.className = 'pullUp';
			pullUpEl.innerHTML = '<span class="pullUpIcon"></span><span class="pullUpLabel">上拉加载更多...</span>';
			scrollerObj.appendChild(pullUpEl);
		}

		me.iScroll = new IScroll(wrapperObj, iScrollConfig);

		me.iScroll.on('refresh', function () {
			if ((pullDownEl) && (pullDownEl.className.match('loading'))) {
				pullDownEl.querySelector('.pullDownLabel').innerHTML = '下拉刷新...';
				if (this.y >= 0) {
					// The pull-down-bar is fully visible:
					// Hide it with a simple 250ms animation
					hidePullDownEl(250, true);

				} else if (this.y > -pullDownOffset) {
					// The pull-down-bar is PARTLY visible:
					// Set up a shorter animation to hide it

					// Firt calculate a new margin-top for pullDownEl that matches the current scroll position
					pullDownEl.style.marginTop = this.y + 'px';

					// CSS-trick to force webkit to render/update any CSS-changes immediately: Access the offsetHeight property...
					pullDownEl.offsetHeight;

					// Calculate the animation time (shorter, dependant on the new distance to animate) from here to completely 'scrolledUp' (hidden)
					// Needs to be done before adjusting the scroll-positon (if we want to read this.y)
					var animTime = (250 * (pullDownOffset + this.y) / pullDownOffset);

					// Set scroll positon to top
					// (this is the same as adjusting the scroll postition to match the exact movement pullDownEl made due to the change of margin-top above, so the content will not "jump")
					this.scrollTo(0, 0, 0);

					// Hide pullDownEl with the new (shorter) animation (and reset the inline style again).
					setTimeout(function () { // Do this in a new thread to avoid glitches in iOS webkit (will make sure the immediate margin-top change above is rendered)...
						hidePullDownEl(animTime, true);
					}, 0);

				} else {
					// The pull-down-bar is completely off screen:
					// Hide it immediately
					hidePullDownEl(0, true);
					// And adjust the scroll postition to match the exact movement pullDownEl made due to change of margin-top above, so the content will not "jump"
					this.scrollBy(0, pullDownOffset, 0);
				}
			}
			if ((pullUpEl) && (pullUpEl.className.match('loading'))) {
				pullUpEl.className = 'pullUp';
				pullUpEl.querySelector('.pullUpLabel').innerHTML = '上拉加载更多...';
			}
		});

		me.iScroll.on('scrollStart', function () {
			scrollStartPos = this.y; // Store the scroll starting point to be able to track movement in 'scroll' below
		});

		me.iScroll.on('scroll', function () {
			if (pullDownEl || pullUpEl) {
				if ((scrollStartPos == 0) && (this.y == 0)) {
					// 'scroll' called, but scroller is not moving!
					// Probably because the content inside wrapper is small and fits the screen, so drag/scroll is disabled by iScroll

					// Fix this by a hack: Setting "myScroll.hasVerticalScroll=true" tricks iScroll to believe
					// that there is a vertical scrollbar, and iScroll will enable dragging/scrolling again...
					this.hasVerticalScroll = true;

					// Set scrollStartPos to -1000 to be able to detect this state later...
					scrollStartPos = -1000;
				} else if ((scrollStartPos == -1000) &&
					(((!pullUpEl) && (!pullDownEl.className.match('flip')) && (this.y < 0)) ||
						((!pullDownEl) && (!pullUpEl.className.match('flip')) && (this.y > 0)))) {
					// Scroller was not moving at first (and the trick above was applied), but now it's moving in the wrong direction.
					// I.e. the user is either scrolling up while having no "pull-up-bar",
					// or scrolling down while having no "pull-down-bar" => Disable the trick again and reset values...
					this.hasVerticalScroll = false;
					scrollStartPos = 0;
					this.scrollBy(0, -this.y, 0); // Adjust scrolling position to undo this "invalid" movement
				}
			}

			if (pullDownEl) {
				if (this.y > pullDownOffset + pullThreshold && !pullDownEl.className.match('flip')) {
					showPullDownElNow('flip');
					this.scrollBy(0, -pullDownOffset, 0); // Adjust scrolling position to match the change in pullDownEl's margin-top
					pullDownEl.querySelector('.pullDownLabel').innerHTML = '释放刷新...';
				} else if (this.y < 0 && pullDownEl.className.match('flip')) { // User changes his mind...
					hidePullDownEl(0, false);
					this.scrollBy(0, pullDownOffset, 0); // Adjust scrolling position to match the change in pullDownEl's margin-top
					pullDownEl.querySelector('.pullDownLabel').innerHTML = '释放刷新...';
				}
			}
			if (pullUpEl) {
				if (this.y < (this.maxScrollY - pullThreshold) && !pullUpEl.className.match('flip')) {
					pullUpEl.className = 'pullUp flip';
					pullUpEl.querySelector('.pullUpLabel').innerHTML = '释放加载更多...';
				} else if (this.y > (this.maxScrollY + pullThreshold) && pullUpEl.className.match('flip')) {
					pullUpEl.className = 'pullUp';
					pullUpEl.querySelector('.pullUpLabel').innerHTML = '释放加载更多...';
				}
			}
		});

		me.iScroll.on('scrollEnd', function () {
			if ((pullDownEl) && (pullDownEl.className.match('flip'))) {
				showPullDownElNow('loading');
				pullDownEl.querySelector('.pullDownLabel').innerHTML = '加载中...';
				pullDownActionHandler(this); // Execute custom function (ajax call?)
			}
			if ((pullUpEl) && (pullUpEl.className.match('flip'))) {
				pullUpEl.className = 'pullUp loading';
				pullUpEl.querySelector('.pullUpLabel').innerHTML = '加载中...';
				pullUpActionHandler(this); // Execute custom function (ajax call?)
			}
			if (scrollStartPos = -1000) {
				// If scrollStartPos=-1000: Recalculate the true value of "hasVerticalScroll" as it may have been
				// altered in 'scroll' to enable pull-to-refresh/load when the content fits the screen...
				this.hasVerticalScroll = this.options.scrollY && this.maxScrollY < 0;
			}
		});

	}
	window.addEventListener('load', function () {init()}, false);
};

if ( typeof module != 'undefined' && module.exports ) {
	module.exports = JGMList;
} else {
	window.JGMList = JGMList;
}

})(window, document, Math);

