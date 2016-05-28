var config = {
    "ds":"各区域数据",
	"chartID" : "001",
	"chartName" : "协作单位合同签定情况",
	"chartType" : "Combination",
	"title" : {
		"name" : "协作单位合同签定情况",
		"text" : "协作单位合同签定情况",
		"Font" : "Font"
	},
		   "size":{"high":"400","width":"600"},
	"subtitle" : {
		"name" : "",
		"text" : "Text",
		"Font" : "Font"
	},
	"xAxis" :  {
		"title" : "合同类型",
		"titleFont" : "TitleFont"
	},
	"yAxis": {
		"title" : "合同数",
		"TitleFont" : "TitleFont"
	} ,

	"serie" : {
		"isVar" : 1,
		"name" : "区域",
		"value" : "organ",
		"style":[{"serieName":"华北区","renderAs":"Line"},
			{"serieName":"华南区","renderAs":"Area"},
			{"serieName":"华东区","renderAs":"Column"}]
	},
	"x" : {
		"isVar" : "0",
		"name" : "合同类型",
		"value" : "",
		"values" : [ {
			"value" : "工程合同"
		}, {
			"value" : "劳务合同"
		}, {
			"value" : "材料合同"
		}, {
			"value" : "运输合同"
		}, {
			"value" : "机械租赁合同"
		} ]
	},
	"y" : [ {
		"name" : "工程合同",
		"code" : "gc",
		"Prefix" : "Prefix",
		"Suffix" : "Suffix",
		"decimalPrecision" : "decimalPrecision",
		"format" : "format"
	}, {
		"name" : "劳务合同",
		"code" : "lw",
		"Prefix" : "Prefix",
		"Suffix" : "Suffix",
		"decimalPrecision" : "decimalPrecision",
		"format" : "format"
	}, {
		"name" : "材料合同",
		"code" : "cl",
		"Prefix" : "Prefix",
		"Suffix" : "Suffix",
		"decimalPrecision" : "decimalPrecision",
		"format" : "format"
	}, {
		"name" : "运输合同",
		"code" : "ys",
		"Prefix" : "Prefix",
		"Suffix" : "Suffix",
		"decimalPrecision" : "decimalPrecision",
		"format" : "format"
	}, {
		"name" : "机械租赁合同",
		"code" : "zl",
		"Prefix" : "Prefix",
		"Suffix" : "Suffix",
		"decimalPrecision" : "decimalPrecision",
		"format" : "format"
	} ]
};