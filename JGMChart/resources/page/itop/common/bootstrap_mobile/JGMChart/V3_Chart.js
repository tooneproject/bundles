function V3Chart(container_id, GraphSettings) {
	this.containerId = container_id;
	this.config = GraphSettings;
	this.clickEventListeners = [];
	var _this = this;
    var FusionCharts = window.FusionCharts;
    var util={}, adapter_xy={},adapter_augular={},adapter_pie={},adapter={}, options = {
        defaultOption : {type:'mscombi2d'},
        typemap: {
            bar: {type: "msbar2d",deftype:"",name:"横柱2D"},
            stackbar: {type: "stackedbar2d",deftype:"",name:"横柱堆叠2D"},
            column: {type: "mscombi2d",deftype:"column",name:"竖柱2D"},
            stackcolumn: {type: "stackedcolumn2d",deftype:"",name:"竖柱堆叠2D"},
            stack: {type: "msstackedcolumn2d",deftype:"column",name:"竖柱分组堆叠2D"},

            line: {type: "mscombi2d",deftype:"line",name:"折线"},

            dough: {type: "doughnut2d",deftype:"",name:"圆环2D"},
            pie: {type: "pie2d",deftype:"pie",name:"饼图2D"},

            bubble: {type: "bubble",deftype:"",name:"气泡2D"},
            scatter: {type: "scatter",deftype:"",name:"散点2D"},

            area: {type: "mscombi2d",deftype:"area",name:"区域"},

            angular: {type: "angulargauge",deftype:"",name:"仪表盘2D"},
            combidy: {type: "mscombidy2d",deftype:"line",name:"双Y轴2D"},
            combination: {type: "mscombi2d",deftype:"line",name:"组合2D"},
            radar: {type: "radar",deftype:"",name:"雷达2D"}
        },
        typemap3d: {
            bar: {type: "msbar3d",deftype:"",name:"横柱3D"},
            stackbar: {type: "stackedbar3d",deftype:"",name:"横柱堆叠3D"},
            column: {type: "mscombi3d",deftype:"column",name:"竖柱3D"},
            stackcolumn: {type: "stackedcolumn3d",deftype:"",name:"竖柱堆叠3D"},

            dough: {type: "doughnut3d",deftype:"",name:"圆环3D"},
            pie: {type: "pie3d",deftype:"pie",name:"饼图3D"},

            combination: {type: "mscombi3d",deftype:"line",name:"组合3D"}
        }
    };

    !(function(util){
        function isTrue(val){
            return val&&(val!='0')&&(val!='false');
        }
        
        function isObject(obj){
        	return obj!=null && typeof obj ==="object";
        }

        function set(to, to_prop, val){
            return (val!=null)&&(val!="") && (to[to_prop]=val);
        }

        function cleanFields(obj){
            for(var p in obj){
                var x = obj[p];
                if(x===null || x==='null' || x === undefined || x ==='undefined'||x===''){
                    delete obj[p];
                }
            }
        }

        function copy(to, to_prop, from,from_prop,defval){
            var val = (from && (from[from_prop]!=null))||defval;
            return val && (to[to_prop]=val);
        }

        function merge(to, from){
        	if(!isObject(to))return;
        	if(!isObject(from))return;
            for (var prop in from) {
                if (Object.prototype.hasOwnProperty.call(from, prop)) {
                	if(isObject(to[prop]) && isObject(from[prop])){
                		merge(to[prop], from[prop]);
                	}else{
                		to[prop] = from[prop];
                	}
                }
            }
        }

        //path is something like "xAxis[0].boundaryGap"
        function setValueByPath(obj, path, val){
            if(val == null)return;
            var idxDot = path.indexOf(".");
            if(idxDot == -1){
                setValueByKey(obj, path, val);
            }else{
                var prop = path.substring(0, idxDot);
                var remainPath = path.substring(idxDot+1);
                var dest = getOrCreateDestination(obj, prop);
                setValueByPath(dest, remainPath, val);
            }
        }

        function setValueByKey(obj, key, val){
            var idxArr = key.indexOf("[");
            if(idxArr == -1){
                obj[key] = val;
            }else{
                var prop = key.substring(0, idxArr);
                var idx = parseInt(key.substring(idxArr+1, key.length-1));
                if(obj[prop] == null){
                    obj[prop] = [];
                }
                obj[prop][idx] = val;
            }
        }

        function getOrCreateDestination(obj, key){
            var idxArr = key.indexOf("[");
            if(idxArr == -1){
                if(obj[key] == null){
                    obj[key]={};
                }
                return obj[key];
            }else{
                var prop = key.substring(0, idxArr);
                var idx = parseInt(key.substring(idxArr+1, key.length-1));
                if(obj[prop] == null){
                    obj[prop] = [];
                }
                if(obj[prop][idx] == null){
                    obj[prop][idx] = {};
                }
                return obj[prop][idx];
            }
        }

        function getValueByPath(obj, path){
            if(obj==null || path==null) return null;
            var keys = path.split(".");
            for (var i= 0,l=keys.length;i<l;i++){
                if(obj==null)return null;
                var key = keys[i];
                var idxArr = key.indexOf("[");
                if(idxArr == -1){
                    obj = obj[key];
                }else{
                    var prop = key.substring(0, idxArr);
                    var idx = parseInt(key.substring(idxArr+1, key.length-1));
                    obj = obj[prop]?obj[prop][idx]:null;
                }
            }
            return obj;
        }

        function addIfNotExisting(val, target){
            if(target && val!=null && target.indexOf(val)==-1){
                target.push(val);
            }
        }

        //values=data.values; seriesKey is cfg.serie.value or null; xKey is cfg.x.value or null
        function indexData(values, seriesKey, xKey, tablename){
            var data = {
                seriesValues:[], xAxisValues:[]
            };;
            for(var i= 0,l=values.length;i<l;i++){
                var vo = values[i];
                var seriesValue = seriesKey? vo[tablename+seriesKey]:"s";
                var seriesData = getOrCreateDestination(data, seriesValue);
                var xValue = xKey? vo[tablename+xKey]:"x";
                seriesData[xValue] = vo;
                addIfNotExisting(seriesKey? vo[tablename+seriesKey]:null, data.seriesValues)
                addIfNotExisting(xKey? vo[tablename+xKey]:null, data.xAxisValues);
            }
            return data;
        }

        function prepareAllSeriesData(isSeriesVar, isXAxisVar, tablename, cfg, dataCache){
            var data = [];
            var xValues = isXAxisVar?dataCache.xAxisValues:['x'];
            var xSize = (isXAxisVar||!cfg.x.values||cfg.x.values.length==0)?1:cfg.x.values.length;
            if(isSeriesVar){
                var z = cfg.z?((cfg.z.length>0)?cfg.z[0]:cfg.z):null;
                data = dataCache.seriesValues.map(function(seriesName){
                    var seriesVO = dataCache[seriesName];
                    return prepareSeriesData(xValues, cfg.y, z,  seriesVO, tablename);
                });
            }else{
                var seriesVO = dataCache['s'];
                for(var s= 0,sl=cfg.serie.values.length;s<sl;s++){
                    var start = s * xSize, end = s*xSize + xSize;
                    var z = cfg.z?((cfg.z.length>0)?(cfg.z.length>s?cfg.z[s]:cfg.z[0]):cfg.z):null;
                    var seriesData = prepareSeriesData(xValues, cfg.y.slice(start,end),z, seriesVO, tablename);
                    data.push(seriesData);
                }
            }
            return data;
        }

        /**
         * xValues = ['A','B','C'] or ['x'];
         * yValues is (part of) cfg.y;
         * z is one of cfg.z
         * seriesVO = dataCache[seriesCode/'s'];
         */
        function prepareSeriesData(xValues, yValues, z, seriesVO, tablename) {
            var rs = [];
            for (var x = 0, xl = xValues.length; x < xl; x++) {
                var xval = xValues[x];
                var xvo = seriesVO[xval];
                if(!xvo)continue;
                rs = rs.concat(yValues.map(function(yval){
                    var obj = {x:xval, y:xvo[tablename + yval.code]};
                    obj.value = obj.y;
                    if(z)obj.z = xvo[tablename + z.code];
                    return obj;
                }));
            }
            return rs;
        }

        function splitArray(array, num){
            var group = [];
            for(var i= 0,l=array.length;i<l;i+=num){
                for(var g=0;g<num;g++){
                    var newarray = group[g];
                    if(!newarray){
                        newarray = [];
                        group[g] = newarray;
                    }
                    newarray.push(array[i+g]);
                }
            }
            return group;
        }

        util.set = set;
        util.getByPath = getValueByPath;
        util.setByPath = setValueByPath;
        util.addIfNotExisting = addIfNotExisting;
        util.indexData = indexData;
        util.prepareAllSeriesData = prepareAllSeriesData;
        util.isTrue = isTrue;
        util.copy = copy;
        util.merge = merge;
        util.cleanFields = cleanFields;
        util.splitArray = splitArray;
        util.applyFilter = function(obj, filter){
            if(obj==null)return false;
            if(filter==null)return true;
            var val = obj[filter.key];
            return val!=null && val==filter.value;
        };
        util.validateConfig = function(cfg){
            if(cfg==null){
                console.error("配置信息错误：缺失配置信息。代码=config");
                return false;
            }
            if(cfg.y==null || cfg.y.length==0){
                console.error("配置信息错误：缺失取值信息。代码=config.y");
                return false;
            }
            return true;
        };
        util.validateData = function(data){
            if(data==null||data.values==null||data.values.length==0){
                return false;
            }
            return true;
        };

        util.buildTextStyle = function(v3style) {
            var style = {
                fontFamily : v3style.font,
                fontSize : v3style.fontSize,
                color : v3style.fontColor,
                fontWeight : (v3style.bold) ? "bold" : "normal",
                fontStyle : (v3style.italic) ? "italic" : "normal"
            };
            cleanFields(style);
            return style;
        };
        util.initContext = function(cfg, data, options, context){
            var ctx = context||{};
            var chartType = cfg.chartType.toLowerCase();
            ctx.typeOption = cfg.is3D=='true'?(options.typemap3d[chartType]||options.typemap[chartType]):options.typemap[chartType];
            ctx.isSeriesVar = cfg.serie && isTrue(cfg.serie.value)&& (typeof cfg.serie.value === 'string');
            ctx.isXAxisVar = cfg.x && isTrue(cfg.x.value && (typeof cfg.x.value === 'string'));
            if(data.values!=null&&data.values.length>0){
                for(var prop in data.values[0]){
                    ctx.tablename = prop.substring(0,prop.lastIndexOf('.')+1);
                    break;
                }
                ctx.dataCache = indexData(data.values, ctx.isSeriesVar?cfg.serie.value:null, ctx.isXAxisVar?cfg.x.value:null, ctx.tablename);
            }
            cfg.y = cfg.y&&(Object.prototype.toString.call(cfg.y) === '[object Array]')?cfg.y:[cfg.y];
            return ctx;
        };
        return util;
    })(util);

    !(function(adapter_xy,  util, options){
        var option,ctx;

        function buildXAxis(cfg){
            var categories = [];
            if(ctx.isXAxisVar){
                categories = ctx.dataCache.xAxisValues.map(function (element) {return {"label":element};});
            }else if(cfg.x && cfg.x.values && cfg.x.values.length>0){
                categories = cfg.x.values.map(function (element) {return {"label":element.value};});
            }else{
                categories.push({});
            }
            option.dataSource.categories = [{category:categories}];
        }

        function buildLegend(cfg){
            var legend;
            if(ctx.isSeriesVar){
                legend = ctx.dataCache.seriesValues;
            }else{
                if(!cfg.serie||!cfg.serie.values||cfg.serie.values.length==0)return;
                legend = [];
                for (var i = 0, l = cfg.serie.values.length; i < l; i++) {
                    util.addIfNotExisting(cfg.serie.values[i].value, legend);
                }
            }
            option.legend = {data:legend};
        }

        function buildSeries(cfg){
            var series = [];
            var seriesDatas = util.prepareAllSeriesData(ctx.isSeriesVar, ctx.isXAxisVar, ctx.tablename, cfg, ctx.dataCache);
            //Transform renderAs to support combination chart
            var seriesTypes = {};
            if(cfg.serie.style){
                for (var i = 0, l = cfg.serie.style.length; i < l; i++) {
                    seriesTypes[cfg.serie.style[i].serieName] = cfg.serie.style[i].renderAs;
                }
            }
            var secondYAxis = [];
            if(cfg.serie.yAxis){
                if(Object.prototype.toString.call(cfg.serie.yAxis) === '[object Array]'){
                    secondYAxis = cfg.serie.yAxis.map(function(element){return element.serieName});
                }else if(cfg.serie.yAxis.serieName){
                    secondYAxis.push(cfg.serie.yAxis.serieName);
                }
            }
            for(var s= 0, sl=option.legend.data.length;s<sl;s++){
                var seriesName = option.legend.data[s];
                var seriesData = seriesDatas[s];
                //seriesData = seriesData.map(function(element){return {value:element};});
                var seriesCfg = {seriesname:seriesName,renderAs:seriesTypes[seriesName]||ctx.typeOption.deftype, data:seriesData};
                if(secondYAxis.indexOf(seriesName)!=-1){
                    seriesCfg.parentYAxis = 'S';
                }
                series.push(seriesCfg);
            }
            option.dataSource.dataset = series;
        }


        function buildTrendLine(cfg){
            if(cfg.line)option.dataSource.trendlines = [{line : cfg.line}];
        }

        function converToMSStackedColumnData(cfg){
            option.dataSource.dataset = option.dataSource.dataset.map(function(series){
                var dataset = [];
                var groupdata = util.splitArray(series.data, cfg.y.length);
                for(var i= 0,l=cfg.y.length;i<l;i++){
                    var yname = cfg.y[i].name;
                    var newSeries = {seriesname: series.seriesname+"("+yname+")", data:groupdata[i]};
                    dataset.push(newSeries);
                }
                return {"dataset":dataset};
            });
        }

        adapter_xy.buildXYChart = function(targetOption,context,cfg){
            option = targetOption;
            ctx = context;
            if(ctx.xType=='category')buildXAxis(cfg);
            buildLegend(cfg);
            buildSeries(cfg);
            buildTrendLine(cfg);
            if(ctx.typeOption.type=='msstackedcolumn2d') converToMSStackedColumnData(cfg);
        };
    })(adapter_xy, util, options);

    !(function(adapter_augular,  util, options){
        var option,ctx;

        function buildBasicOption(cfg){
            util.setByPath(option, 'dataSource.chart.chartBottomMargin',"15");
            util.setByPath(option, 'dataSource.chart.gaugeFillMix',"{dark-30},{light-60},{dark-10}");
            util.setByPath(option, 'dataSource.chart.gaugeFillRatio',"15");
        }
        function buildColorRange(cfg){
            option.dataSource.colorRange = {color : [{minValue:0,maxValue:50,code:"#e44a00"},{minValue:50,maxValue:80,code:"#f8bd19"},{minValue:80,maxValue:100,code:"#6baa01"}]};
            if(cfg.ranges){
                option.dataSource.colorRange.color = cfg.ranges.map(function(element){return {minValue:element.min,maxValue:element.max,code:element.color};});
            }
        }

        function buildDials(cfg){
            if(!cfg.y || cfg.y.length==0)return;
            var dials = [];
            if(ctx.isSeriesVar){
                var yCode = ctx.tablename+cfg.y[0].code;
                dials = ctx.dataCache.seriesValues.map(function (seriesName) {
                    return {"value":ctx.dataCache[seriesName]['x'][yCode], "tooltext":seriesName+": $value"};
                });
            }else{
                if(!cfg.serie||!cfg.serie.values||cfg.serie.values.length==0)return;
                for (var i = 0, l = cfg.serie.values.length; i < l; i++) {
                    var yCode = ctx.tablename+cfg.y[i].code;
                    var seriesName = cfg.serie.values[i].value;
                    dials.push({"value":ctx.dataCache['s']['x'][yCode], "tooltext":seriesName+": $value"});
                }
            }
            option.dataSource.dials = {dial : dials};
        }

        adapter_augular.buildChart = function(targetOption,context,cfg){
            option = targetOption;
            ctx = context;
            buildBasicOption(cfg);
            buildColorRange(cfg);
            buildDials(cfg);
        };
    })(adapter_augular, util, options);

    !(function(adapter_pie, util, options){
        var option,ctx;

        function buildSeries(cfg, data){
            if(!cfg.serie){
                console.error("Missing mandatory field - config.serie");
                return;
            }
            var legend = [];
            var singleSeries = [];
            //X axis is variable then use x.value as series code
            if (ctx.isXAxisVar){
                addDataByCode(legend, singleSeries, cfg.x.value, cfg.y[0].code, data);
            }
            //Series is variable then use serie.value as series code
            else if (ctx.isSeriesVar) {
                addDataByCode(legend, singleSeries, cfg.serie.value, cfg.y[0].code, data);
            }
            //Else use y[].code as series code
            else{
                addDataByYAxis(legend, singleSeries, data);
            }

            option.dataSource.data = singleSeries;
        }

        function addDataByCode(legend, singleSeries, seriesCode, valueCode, data){
            for (var i = 0, l = data.values.length; i < l; i++) {
                var record = data.values[i];
                var seriesName = record[ctx.tablename + seriesCode];
                if (seriesName == null)continue;
                var idx = legend.indexOf(seriesName);
                if (idx == -1) {
                    legend.push(seriesName);
                    singleSeries.push({value:record[ctx.tablename + valueCode],label:seriesName});
                }
            }
        }

        function addDataByYAxis(legend, singleSeries, data){
            for (var i = 0, l = data.values.length; i < l; i++) {
                var record = data.values[i];
                for(var i2= 0,l2=cfg.y.length;i2<l2;i2++){
                    var seriesName = cfg.y[i2].name;
                    legend.push(seriesName);
                    singleSeries.push({value:record[ctx.tablename + cfg.y[i2].code],label:seriesName});
                }
                break;
            }
        }

        adapter_pie.buildPieChart = function(targetOption,context,cfg, data){
            option = targetOption;
            ctx = context;
            buildSeries(cfg, data);
        };
    })(adapter_pie, util, options);

    !(function(adapter, adapter_xy, adapter_augular, adapter_pie, util, options){
        var option = {}, ctx={};

        function initContext(cfg, data){
            util.initContext(cfg, data, options, ctx);
        }

        function buildBasicOption(cfg){
            option.chartID = cfg.chartID;
            option.chartName = cfg.chartName;
            option.type = ctx.typeOption.type;
            option.height = "100%";
            option.width = "100%";
            option.dataFormat = 'json';
            option.dataSource = {};
            var vchart = {
                palette : cfg.palette,
                caption :       util.getByPath(cfg, "title.title")||'',
                captionFont:    util.getByPath(cfg, "title.font"),
                captionFontSize:    util.getByPath(cfg, "title.fontSize"),
                captionFontColor:    util.getByPath(cfg, "title.fontColor"),
                subcaption :    util.getByPath(cfg, "subtitle.title")||'',
                subcaptionFont:    util.getByPath(cfg, "subtitle.font"),
                subcaptionFontSize:    util.getByPath(cfg, "subtitle.fontSize"),
                subcaptionFontColor:    util.getByPath(cfg, "subtitle.fontColor"),
                xAxisName :     util.getByPath(cfg, "xAxis.Title"),
                yAxisName :     util.getByPath(cfg, "yAxis.Title"),
                pYAxisName :     util.getByPath(cfg, "yAxis.Title"),
                bgColor :       util.getByPath(cfg, "outCanvas.bgColor"),
                bgAlpha :       util.getByPath(cfg, "outCanvas.alpha"),
                outCnvbaseFont :     util.getByPath(cfg, "outCanvas.font"),
                outCnvbaseFontSize : util.getByPath(cfg, "outCanvas.fontSize"),
                outCnvbaseFontColor: util.getByPath(cfg, "outCanvas.fontColor"),
                baseFont :      util.getByPath(cfg, "inCanvas.font"),
                baseFontSize :  util.getByPath(cfg, "inCanvas.fontSize"),
                baseFontColor : util.getByPath(cfg, "inCanvas.fontColor"),
                canvasBgColor : util.getByPath(cfg, "inCanvas.bgColor"),
                canvasBgAlpha : util.getByPath(cfg, "inCanvas.alpha"),
                showValues :    cfg.showValues,
                labelDisplay : util.getByPath(cfg, "xAxis.xlabelDisplay"),
                rotateLabels:	(cfg.xAxis&&cfg.xAxis.slantLabels!='0')?1:0,
                slantLabels:    (cfg.xAxis&&cfg.xAxis.slantLabels=='1')?1:0,
                showToolTip :   util.getByPath(cfg, "toolTip.isShow"),
                toolTipBorderColor :    util.getByPath(cfg, "toolTip.borderColor"),
                toolTipBgColor :        util.getByPath(cfg, "toolTip.bgColor"),
                toolTipBgAlpha :        util.getByPath(cfg, "toolTip.alpha"),
                unescapeLinks:  '0',
                showLabels: '1',
                showLegend: '1'
            };
            //util.set(option.title, 'textStyle', util.buildTextStyle(cfg.title));
            //util.set(option.title, 'subtextStyle', util.buildTextStyle(cfg.subtitle));
            //util.set(option.tooltip, 'textStyle', util.buildTextStyle(cfg.toolTip));
            //util.setByPath(xAxis, 'axisLabel.textStyle',util.buildTextStyle(cfg.xAxis));
            util.cleanFields(vchart);
            option.dataSource.chart = vchart;
        }

        function buildChart(cfg, data){
            switch(ctx.typeOption.type){
                case 'msbar2d':
                case 'msbar3d':
                case 'stackedbar2d':
                case 'stackedbar3d':
                case 'mscombi2d':
                case 'mscombi3d':
                case 'stackedcolumn2d':
                case 'stackedcolumn3d':
                case 'radar':
                case 'mscombidy2d':
                case 'msstackedcolumn2d':
                    ctx.xType='category';
                    adapter_xy.buildXYChart(option,ctx, cfg);
                    break;
                case 'bubble':
                case 'scatter':
                    ctx.xType='value';
                    adapter_xy.buildXYChart(option,ctx, cfg);
                    break;
                case 'angulargauge':
                    adapter_augular.buildChart(option, ctx, cfg);
                    break;
                case 'doughnut2d':
                case 'doughnut3d':
                case 'pie2d':
                case 'pie3d':
                    adapter_pie.buildPieChart(option, ctx, cfg, data);
                    break;
            }
        }

        function mergeConfig(fchartconfig){
        	if(fchartconfig){
        		util.merge(option, fchartconfig);
        	}
        }
        
        adapter.getDefaultOption = function () {
            return options.defaultOption;
        }

        adapter.getOption = function(cfg, data){
            if(!util.validateConfig(cfg))return cfg;
            if(!util.validateData(data)){
                return options.defaultOption;
            }
            initContext(cfg,data);
            buildBasicOption(cfg);
            buildChart(cfg, data);
            mergeConfig(cfg.fchartconfig);
            return option;
        };
    })(adapter, adapter_xy, adapter_augular, adapter_pie, util, options);

    var fireOnClickListeners = function(eventObj, argsObj){
        console.log('Chart clicked at ' + argsObj.chartX + ',' + argsObj.chartY);
        for(var i=0,l=_this.clickEventListeners.length;i<l;i++){
            _this.clickEventListeners[i](argsObj);
        }
    };

    this.createChart = function(container_id, config, data){
        var option = adapter.getOption(config ,data);
        option.renderAt = container_id;
        console.log(JSON.stringify(option));
        _this.mychart = new FusionCharts(option);
        _this.mychart.render();
        if(_this.mychart.addEventListener)_this.mychart.addEventListener('chartClick', fireOnClickListeners);
        if(_this.mychart.resize)window.onresize = _this.mychart.resize;
        return _this.mychart;
    };

    this.createChart(this.containerId, this.config, null);
}

V3Chart.prototype.drawchart = function(model){
	if (this.data == model)return;
	this.data = model;
    this.createChart(this.containerId, this.config, this.data);
};

V3Chart.prototype.addOnClickListener = function(eventHandler){
	if(this.clickEventListeners.indexOf(eventHandler)==-1){
        this.clickEventListeners.push(eventHandler);
	}
};
