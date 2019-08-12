var chartData = [];
var chartXAxis = [];

var readChartsYAxis = [];
var writeChartsYAxis = [];

var devFreeChartsYAxis = [];
var devUsedChartsYAxis = [];

var swapFreeChartsYAxis = [];
var swapUsedChartsYAxis = [];

var memoryFreeChartsYAxis = [];
var memoryUsedChartsYAxis = [];

//读写速度
var readV = null;
var writeV = null;
//磁盘
var devTotalSize = null;
var devFreeSize = null;
var devUsedSize = null;
//交换区
var swapTotal = null;
var swapFree = null;
var swapUsed = null;
//虚拟内存
var memoryTotal = null;
var memoryFree = null;
var memoryUsed = null;
function initDialog(chartXAxis_1, chartYAxis_1, chartYAxis_2, name) {
	var colors = ['#5793f3', '#d14a61', '#675bba'];
	option6 = {
	    color: colors,
	    title : {
			text : '最近一天详细情况',
			x : 'left'
		},
	    tooltip: {
	        trigger: 'none',
	        axisPointer: {
	            type: 'cross'
	        }
	    },
	    legend: {
	        data:name
	    },
	    grid: {
	        top: 70,
	        bottom: 50
	    },
	    xAxis: [
	        {
	            type: 'category',
	            axisTick: {
	                alignWithLabel: true
	            },
	            axisLine: {
	                onZero: false,
	                lineStyle: {
	                    color: colors[1]
	                }
	            },
	            axisPointer: {
	                label: {
	                    formatter: function (params) {
	                        return name[0] + '  ' + params.value
	                            + (params.seriesData.length ? '：' + params.seriesData[0].data : '');
	                    }
	                }
	            },
	            data: chartXAxis_1
	        },
	        {
	            type: 'category',
	            axisTick: {
	                alignWithLabel: true
	            },
	            axisLine: {
	                onZero: false,
	                lineStyle: {
	                    color: colors[0]
	                }
	            },
	            axisPointer: {
	                label: {
	                    formatter: function (params) {
	                        return name[1] + '  ' + params.value
	                            + (params.seriesData.length ? '：' + params.seriesData[0].data : '');
	                    }
	                }
	            },
	            data: chartXAxis_1
	        }
	    ],
	    yAxis: [
	        {
	            type: 'value'
	        }
	    ],
	    series: [
	        {
	            name:name[0],
	            type:'line',
	            xAxisIndex: 1,
	            smooth: true,
	            data: chartYAxis_1
	        },
	        {
	            name:name[1],
	            type:'line',
	            smooth: true,
	            data: chartYAxis_2
	        }
	    ]
	};

	var myChart6 = echarts.init(document.getElementById('MemoryDemo1'));
	myChart6.setOption(option6);
}
(function() {
	window.onclick_1 = function (){
		var name = [ '读取速度M/s', '写入速度M/s' ]
		initDialog(chartXAxis, readChartsYAxis, writeChartsYAxis, name);
	}
	
	window.onclick_2 = function (){
		var name = [ '未使用磁盘大小', '已使用磁盘大小' ]
		initDialog(chartXAxis, devFreeChartsYAxis, devUsedChartsYAxis, name);
	}
	
	window.onclick_3 = function (){
		var name = [ '未使用交换区大小', '已使用交换区大小' ]
		initDialog(chartXAxis, swapFreeChartsYAxis, swapUsedChartsYAxis, name);
	}
	
	window.onclick_4 = function (){
		var name = [ '未使用虚拟内存大小', '已使用内存大小' ]
		initDialog(chartXAxis, memoryFreeChartsYAxis, memoryUsedChartsYAxis, name);
	}
})();

$.get('http://www.bemess.xyz:12222/computer/data/getComputerHisData', function (data) {
	$('#computername').text(data[0].computername);
	$('#username').text(data[0].username);
	$('#osname').text(data[0].osname);
	$('#osarch').text(data[0].osarch);
	$('#javavendor').text(data[0].javavendor);
	$('#javaversion').text(data[0].javaversion);
	$('#computerip').text(data[0].computerip);
	$('#availableprocessors').text(data[0].availableprocessors);
	$('#devtotalsize').text(data[0].devtotalsize);
	$('#memorytotal').text(data[0].memorytotal);
	$('#swaptotal').text(data[0].swaptotal);
	$('#totalmemory').text(data[0].totalmemory);
	
	//读写速度
	readV = data[data.length-1].avgdiskreads;
	writeV = data[data.length-1].avgdiskwrites;
	//磁盘
	devTotalSize = data[data.length-1].devtotalsize;
	devFreeSize = data[data.length-1].devfreesize;
	devUsedSize = data[data.length-1].devusedsize;
	//交换区
	swapTotal = data[data.length-1].swaptotal;
	swapFree = data[data.length-1].swapfree;
	swapUsed = data[data.length-1].swapused;
	//虚拟内存
	memoryTotal = data[data.length-1].memorytotal;
	memoryFree = data[data.length-1].memoryfree;
	memoryUsed = data[data.length-1].memoryused;
	for (var x in data){
		var obj = {name: null, value: null };
		obj.name = data[x].time;
		obj.value = data[x].cpucombined;
		chartData.push(obj);
		
		chartXAxis.push(data[x].time);
		
		readChartsYAxis.push(data[x].avgdiskreads);
		writeChartsYAxis.push(data[x].avgdiskwrites);
		
		devFreeChartsYAxis.push(data[x].devfreesize);
		devUsedChartsYAxis.push(data[x].devusedsize);

		swapFreeChartsYAxis.push(data[x].swapfree);
		swapUsedChartsYAxis.push(data[x].swapused);

		memoryFreeChartsYAxis.push(data[x].memoryfree);
		memoryUsedChartsYAxis.push(data[x].memoryused);
	}
	var myChart = echarts.init(document.getElementById('CPUdemo'));
    myChart.setOption({
        title: {
            text: 'CPU占用率',
            x : 'center'
        },
        tooltip: {
            trigger: 'axis'
        },
        xAxis: {
            data: chartData.map(function (item) {
                return item.name;
            })
        },
        yAxis: {
            splitLine: {
                show: false
            }
        },
        toolbox: {
            left: 'right',
            feature: {
                dataZoom: {
                    yAxisIndex: 'none'
                },
                restore: {},
                saveAsImage: {}
            }
        },
        dataZoom: [{
            startValue: '2019-07-29'
        }, {
            type: 'inside'
        }],
        visualMap: {
            top: 10,
            left: 10,
            pieces: [{
                gt: 0,
                lte: 60,
                color: '#096'
            }, {
                gt: 60,
                lte: 70,
                color: '#ffde33'
            }, {
                gt: 70,
                lte: 80,
                color: '#ff9933'
            }, {
                gt: 80,
                lte: 100,
                color: '#cc0033'
            }],
            outOfRange: {
                color: '#999'
            }
        },
        series: {
            name: 'CPU占用率',
            type: 'line',
            data: chartData,
//             	data.map(function (item) {
//                 return item;
//             }),
            markLine: {
                silent: true,
                data: [{
                    yAxis: 60
                }, {
                    yAxis: 70
                }, {
                    yAxis: 80
                }, {
                    yAxis: 100
                }]
            }
        }
    });
    var myChart2 = echarts.init(document.getElementById('DevGuageDemo'));
    myChart2.setOption({
    	title : {
			text : '磁盘读写速度',
			x : 'center'
		},
	    tooltip : {
	        formatter: "{a} <br/>{c} {b}"
	    },
	    series : [
	        {
	            name: '读取速度',
	            type: 'gauge',
	            center: ['75%', '65%'],
	            z: 3,
	            min: 0,
	            max: 2048,
	            splitNumber: 4,
	            radius: '85%',
	            axisLine: {            // 坐标轴线
	                lineStyle: {       // 属性lineStyle控制线条样式
	                    width: 10
	                }
	            },
	            axisTick: {            // 坐标轴小标记
	                length: 20,        // 属性length控制线长
	                lineStyle: {       // 属性lineStyle控制线条样式
	                    color: 'auto'
	                }
	            },
	            splitLine: {           // 分隔线
	                length: 30,         // 属性length控制线长
	                lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
	                    color: 'auto'
	                }
	            },
	            axisLabel: {
	                backgroundColor: 'auto',
	                borderRadius: 2,
	                color: '#eee',
	                padding: 3,
	                textShadowBlur: 2,
	                textShadowOffsetX: 1,
	                textShadowOffsetY: 1,
	                textShadowColor: '#222'
	            },
	            title : {
	                // 其余属性默认使用全局文本样式，详见TEXTSTYLE
	                fontWeight: 'bolder',
	                fontSize: 20,
	                fontStyle: 'italic'
	            },
	            detail : {
	                // 其余属性默认使用全局文本样式，详见TEXTSTYLE
	                formatter: readV,
	                fontWeight: 'bolder',
	                borderRadius: 3,
	                backgroundColor: '#444',
	                borderColor: '#aaa',
	                shadowBlur: 5,
	                shadowColor: '#333',
	                shadowOffsetX: 0,
	                shadowOffsetY: 3,
	                borderWidth: 2,
	                textBorderColor: '#000',
	                textBorderWidth: 2,
	                textShadowBlur: 2,
	                textShadowColor: '#fff',
	                textShadowOffsetX: 0,
	                textShadowOffsetY: 0,
	                fontFamily: 'Arial',
	                width: 100,
	                color: '#eee',
	                rich: {}
	            },
	            data:[{value: readV, name: '读取速度  M/s'}]
	        },
	        {
	            name: '写入速度',
	            type: 'gauge',
	            center: ['25%', '65%'],
	            z: 3,
	            min: 0,
	            max: 2048,
	            splitNumber: 4,
	            radius: '85%',
	            axisLine: {            // 坐标轴线
	                lineStyle: {       // 属性lineStyle控制线条样式
	                    width: 10
	                }
	            },
	            axisTick: {            // 坐标轴小标记
	                length: 20,        // 属性length控制线长
	                lineStyle: {       // 属性lineStyle控制线条样式
	                    color: 'auto'
	                }
	            },
	            splitLine: {           // 分隔线
	                length: 30,         // 属性length控制线长
	                lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
	                    color: 'auto'
	                }
	            },
	            axisLabel: {
	                backgroundColor: 'auto',
	                borderRadius: 2,
	                color: '#eee',
	                padding: 3,
	                textShadowBlur: 2,
	                textShadowOffsetX: 1,
	                textShadowOffsetY: 1,
	                textShadowColor: '#222'
	            },
	            title : {
	                // 其余属性默认使用全局文本样式，详见TEXTSTYLE
	                fontWeight: 'bolder',
	                fontSize: 20,
	                fontStyle: 'italic'
	            },
	            detail : {
	                // 其余属性默认使用全局文本样式，详见TEXTSTYLE
	                formatter: writeV,
	                fontWeight: 'bolder',
	                borderRadius: 3,
	                backgroundColor: '#444',
	                borderColor: '#aaa',
	                shadowBlur: 5,
	                shadowColor: '#333',
	                shadowOffsetX: 0,
	                shadowOffsetY: 3,
	                borderWidth: 2,
	                textBorderColor: '#000',
	                textBorderWidth: 2,
	                textShadowBlur: 2,
	                textShadowColor: '#fff',
	                textShadowOffsetX: 0,
	                textShadowOffsetY: 0,
	                fontFamily: 'Arial',
	                width: 100,
	                color: '#eee',
	                rich: {}
	            },
	            data:[{value: writeV, name: '写入速度  M/s'}]
	        }
	    ]
	});

	var myChart3 = echarts.init(document.getElementById('DevSizeDemo'));
	myChart3.setOption({
		title : {
			text : '磁盘使用情况',
			x : 'center'
		},
		tooltip : {
			trigger : 'item',
			formatter : "{a} <br/>{b} : {c} ({d}%)"
		},
		series : [ {
			name : '磁盘总大小' + devTotalSize + 'G',
			type : 'pie',
			radius : '70%',
			center : [ '50%', '50%' ],
			data : [ {
				value : devFreeSize,
				name : '可用空间'
			}, {
				value : devUsedSize,
				name : '已用空间'
			} ],
			itemStyle : {
				emphasis : {
					shadowBlur : 10,
					shadowOffsetX : 0,
					shadowColor : 'rgba(0, 0, 0, 0.5)'
				},
				normal:{
                    color:function(params) {
                    //自定义颜色
                    var colorList = [          
                            '#0BB951', '#BCBCBC', '#c23531'
                        ];
                        return colorList[params.dataIndex]
                     }
                }
			}
		} ]
	});
		
	var myChart4 = echarts.init(document.getElementById('SwapDemo'));
	myChart4.setOption({
		title : {
			text : '交换区使用情况',
			x : 'center'
		},
		tooltip : {
			trigger : 'item',
			formatter : "{a} <br/>{b} : {c} ({d}%)"
		},
		series : [ {
			name : '交换区总大小' + swapTotal + 'G',
			type : 'pie',
			radius : '70%',
// 			center : [ '50%', '50%' ],
			data : [ {
				value : swapFree,
				name : '未使用'
			}, {
				value : swapUsed,
				name : '已使用'
			} ],
			itemStyle : {
				emphasis : {
					shadowBlur : 10,
					shadowOffsetX : 0,
					shadowColor : 'rgba(0, 0, 0, 0.5)'
				},
				normal:{
                    color:function(params) {
                    //自定义颜色
                    var colorList = [          
                            '#0BB951', '#BCBCBC', '#c23531'
                        ];
                        return colorList[params.dataIndex]
                     }
                }
			}
		} ]
	});
	
	
	var myChart5 = echarts.init(document.getElementById('MemoryDemo'));
	myChart5.setOption({
		title : {
			text : '虚拟内存使用情况',
			x : 'center'
		},
		tooltip : {
			trigger : 'item',
			formatter : "{a} <br/>{b} : {c} ({d}%)"
		},
		series : [ {
			name : '虚拟内存总大小' + memoryTotal + 'G',
			type : 'pie',
			radius : '70%',
			center : [ '50%', '50%' ],
			data : [ {
				value : memoryFree,
				name : '未使用'
			}, {
				value : memoryUsed,
				name : '已使用'
			} ],
			itemStyle : {
				emphasis : {
					shadowBlur : 10,
					shadowOffsetX : 0,
					shadowColor : 'rgba(0, 0, 0, 0.5)'
				},
				normal:{
                    color:function(params) {
                    //自定义颜色
                    var colorList = [          
                            '#0BB951', '#BCBCBC', '#c23531'
                        ];
                        return colorList[params.dataIndex]
                     }
                }
			}
		} ]
	});
	
});