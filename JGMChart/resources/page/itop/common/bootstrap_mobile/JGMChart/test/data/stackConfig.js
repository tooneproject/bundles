var config ={
    "ds":"建设项目信息",
    "PluginID": "FusionChart",
    "PluginName": "Fusion图表",
    "ChartID": "1005",
    "chartName": "竖柱分组堆叠2D",
    "chartType": "Stack",
    "is3D": "false",
    "path": "fusionchart/FusionchartFactory",
    "palette": "1",
    "size": {
        "high": "400",
        "width": "600"
    },
    "title": {
        "font": "黑体",
        "fontSize": "11",
        "fontColor": "#000000",
        "alpha": "0",
        "bgColor": null,
        "bold": "0",
        "italic": "0",
        "strikeout": "0",
        "underline": "0",
        "title": null
    },
    "subtitle": {
        "font": "黑体",
        "fontSize": "10",
        "fontColor": "#000000",
        "alpha": "0",
        "bgColor": null,
        "bold": "0",
        "italic": "0",
        "strikeout": "0",
        "underline": "0",
        "title": null
    },
    "inCanvas": {
        "font": "黑体",
        "fontSize": "9",
        "fontColor": "#000000",
        "alpha": "100",
        "bgColor": null,
        "bold": "0",
        "italic": "0",
        "strikeout": "0",
        "underline": "0"
    },
    "outCanvas": {
        "font": "黑体",
        "fontSize": "9",
        "fontColor": "#000000",
        "alpha": "100",
        "bgColor": null,
        "bold": "0",
        "italic": "0",
        "strikeout": "0",
        "underline": "0"
    },
    "xAxis": {
        "Title": null,
        "font": "黑体",
        "fontSize": "9",
        "fontColor": "#000000",
        "labelDisplay": "WRAP",
        "slantLabels": "1",
        "bold": "0",
        "italic": "0",
        "strikeout": "0",
        "underline": "0"
    },
    "yAxis": {
        "Title": null,
        "font": "黑体",
        "fontSize": "9",
        "fontColor": "#000000",
        "labelDisplay": "WRAP",
        "slantLabels": "0",
        "bold": "0",
        "italic": "0",
        "strikeout": "0",
        "underline": "0"
    },
    "DataInfo": {
        "type": "Entity",
        "name": "tableName",
        "value": "tableName"
    },
    "DataColumns": {
        "value": [
            "tableName.orgName",
            "tableName.theMonth",
            "tableName.plan",
            "tableName.progress"
        ]
    },
    "serie": {
        "isVar": "true",
        "name": "机构名称",
        "value": "orgName"
    },
    "x": {
        "isVar": "true",
        "name": null,
        "value": "period"
    },
    "y": [
        {
            "name": "进度",
            "code": "progress",
            "stack": "false"
        },
        {
            "name": "计划",
            "code": "plan",
            "stack": "false"
        }
    ]
};