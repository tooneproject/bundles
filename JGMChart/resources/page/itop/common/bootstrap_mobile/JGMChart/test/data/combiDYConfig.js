var config = {
    "ds":"建设项目信息",
	"chartID" : "001",
	"chartName" : "双Y轴2D",
	"chartType" : "CombiDY",
	"title" : {
		"name" : "建设项目信息",
		"text" : "建设项目信息",
		"Font" : "Font"
	},
		   "size":{"high":"400","width":"600"},
	"subtitle" : {
		"name" : "双Y轴2D",
		"text" : "双Y轴2D",
		"Font" : "Font"
	},
	"xAxis" :  {
		"title" : "月份",
		"titleFont" : "TitleFont"
	},
	"yAxis": {
		"title" : "合同数",
		"TitleFont" : "TitleFont"
	} ,

	"serie" : {
		"isVar" : "true",
		"name" : "项目",
		"value" : "orgName",
		"style":[{"serieName":"京珠高速","renderAs":"Line"},
			{"serieName":"港珠澳大桥","renderAs":"Column"}],
		"yAxis":[{"serieName":"港珠澳大桥","yAxis":"1"}]
	},
	"x" : {
        "isVar": "true",
        "name": null,
        "value": "period"
	},
	"y" : {
        "name": "进度",
        "code": "progress"
    }
};