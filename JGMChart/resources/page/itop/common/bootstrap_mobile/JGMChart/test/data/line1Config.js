var config={
    "ds":"建设项目信息",
    "chartID": "001",
    "chartName": "协作单位合同签定情况",
    "chartType": "Line", //图形类型 
		//Line线
		//Bar柱
		//Pie圆
		//Column柱
		//Area区域
		//CombiDY组合双Y
		//Combination组合
		//Dough 汽泡
		//Radar 雷达
		//Scatter 散点
		//Angular 仪表盘
		//StackArea 叠区域
		//StackColumn 叠柱
		//StackBar 叠横柱
		//StackColumnLineDY 叠柱线双Y3D
		//ColumnLineDY 柱线双Y3D
    "size": {
        "high": "400",
        "width": "600"
    },
    "is3D": "false",
    "title": {
        "text": "协作单位合同签定情况",
        "font": "",
        "fontSize": "",
        "fontColor": ""
    },
    "subtitle": {
        "text": "",
        "font": "",
        "fontSize": "",
        "fontColor": ""
    },
    "inCanvas": {  //画布类,即图,必须有该属性
        "bgColor": "",//颜色,可以定义多个hexColor,用逗号间隔
        "alpha": "",//透明度,可以定义多个,用逗号间隔
        "font": "宋体",
        "fontSize": "12",
        "fontColor": "#D94600"
    },
    "outCanvas": { //画布外,即背景,必须有该属性
        "bgColor": "#C4C400",//颜色,可以定义多个hexColor,用逗号间隔
        "alpha": "",  //透明度,可以定义多个,用逗号间隔
        "font": "",
        "fontSize": "",
        "fontColor": ""
    },
    "showValues": "0", //是否在图上显示数值标识
    //"xlabelDisplay": "1", //x轴标题的显示方向[0|1|2]默认横向环绕显示，1斜向，2纵向
    "line": [
        {
            "startvalue": "160", //刻度开始值
            "color": "009933",//颜色
            "displayvalue": "Target", //名称
            "tooltext": "This trend was calculated last year" //提示
        }
    ],
    "toolTip": {
        "isShow": "", //是否显示
        "font": "",
        "fontSize": "",
        "fontColor": "",
        "borderColor": "",
        "bgColor": ""
    },
    "xAxis": {
        "title": "期次",
        "font": "",
        "fontSize": "",
        "fontColor": "",
		"labelDisplay":"Rotate", //WRAP|Rotate
		"slantLabels":"0" //x轴标题的显示方向[0|1|2]默认横向环绕显示，1斜向，2纵向
    },
    "yAxis": {
        "title": "万元",
        "font": "",
        "fontSize": "",
        "fontColor": "",
        "prefix": "$", //前缀
        "suffix": "美元", //后缀
        "isFromat": "",//1|0是否显示千分位分隔符
        "isScale": "",//1|0是否自动转换单位 1000 = 1k;1000k=1M;....
        "thousandSeparator": "",//千分位分隔符
        "decimalSeparator": "" //小数位分隔符
    },
    "yAxis2": {
        "title": "万元",
        "font": "",
        "fontSize": "",
        "fontColor": "",
        "prefix": "",
        "suffix": "",
        "isFromat": "",
        "isScale": "",
        "thousandSeparator": "", 
        "decimalSeparator": ""  
    },
    "palette": "1", //风格 1|2|3|4|5中间选一个
    "serie": {
        "isVar": 1,
        "name": "项目名称",
        "value": "orgName",
        "values": []
    },
    "x": {
        "isVar": 0,
        "name": "期次",
        "value": "period",
        "values": [
            {
                "value": "201101"
            },
            {
                "value": "201102"
            },
            {
                "value": "201103"
            },
            {
                "value": "201104"
            },
            {
                "value": "201105"
            }
        ]
    },
    "y": [
        {
            "name": "计划",
            "code": "plan"
        }
    ],
	"ranges":[{"min":"","max":"","color":""}] //仪表盘区间定义
}