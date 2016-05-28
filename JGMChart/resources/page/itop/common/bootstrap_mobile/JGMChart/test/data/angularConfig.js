var config = {
    "ds":"建设项目信息",
    "PluginID": "FusionChart",
    "PluginName": "Fusion图表",
    "ChartID": "1018",
    "chartName": "仪表盘2D",
    "chartType": "Angular",
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
        "title": "建设项目信息"
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
        "name": "projects",
        "value": "projects"
    },
    "DataColumns": {
        "value": [
            "orgName",
            "theMonth",
            "plan",
            "progress"
        ]
    },
    "serie": {
        "isVar": "true",
        "name": "进度",
        "value": "orgName"
    },
    "x": {
        "isVar": "false",
        "name": null,
        "value": null
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
    ],
    "ranges": [
        {
            "name": "数值1",
            "min": "0",
            "max": "150",
            "color": "#F66666"
        },
        {
            "name": "数值2",
            "min": "150",
            "max": "250",
            "color": "#FFFF00"
        },
        {
            "name": "数值3",
            "min": "250",
            "max": "300",
            "color": "#006400"
        }
    ]
};
