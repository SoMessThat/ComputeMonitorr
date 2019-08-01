
// 对Date的扩展，将 Date 转化为指定格式的String
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符， 
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字) 
// 例子： 
// (new Date()).format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423 
// (new Date()).format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18 
Date.prototype.format = function (fmt) { //author: meizz 
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

String.prototype.trim = function (){return this.replace(/\s/g, '');}

var G = {
	/**
	 * 发送get请求。
	 * 
	 * success(响应数据, 状态字符串);
	 * error(XMLHttpRequest对象, 错误信息, （可选）捕获的异常对象);
	 * callback(无论成功失败，都要执行)
	 */
	get : function(url, data, success, error, callback) {
		return G.ajax("GET", url, "application/x-www-form-urlencoded", data, success, error, callback);
	},
	/**
	 * 发送post请求。
	 * 
	 * success(响应数据, 状态字符串);
	 * error(XMLHttpRequest对象, 错误信息, （可选）捕获的异常对象);
	 */
	post : function(url, data, success, error, callback) {
		return G.ajax("POST", url, "application/json", JSON.stringify(data), success, error, callback);
	},
	/**
	 * 发送ajax请求。
	 * 
	 * success(响应数据, 状态字符串);
	 * error(XMLHttpRequest对象, 错误信息, （可选）捕获的异常对象);
	 */
	ajax : function(method, url, contentType, data, success, error, callback) {
		return $.ajax({
		    type: 'POST',
		    url: url,
		    data: data,
		    dataType: "json", 
		    contentType: contentType + "; charset=utf-8", 
		    success: function(result, status) {
		    	if (result) {
		    		if (success) {
				    	success(result, status);
		    		}
		    	} else {
	    			/*var errMsg = result.resultMessage;
	    			if (errMsg.length > 100) {
	    				var iLength = errMsg.indexOf("\n");
	    				if (iLength == -1) {
	    					iLength = 100;
	    				}
	    				errMsg = errMsg.substring(0, iLength);
	    			}
	    			G.alert(errMsg);*/
		    	}
		    	if (callback) {
		    		callback();
		    	}
		    }, 
		    error: function(xhr, msg, ex) {
	    		if (error) {
	    			error(xhr, msg, ex);
	    		} else {
	    			G.alert(msg);
	    		}
		    	if (callback) {
		    		callback();
		    	}
		    }
		});
	},
	/**
	 * 页面跳转（对url进行编码）。
	 * 
	 * @param url 跳转页面地址
	 */
	toPage : function(url) {
		self.location = encodeURI(url);
	},
	/**
	 * 显示“正在加载”遮罩层。
	 * 
	 * @returns 遮罩层的index
	 */
	showLoadingLayer : function() {
		return layer.load(1, {shade: [0.5, '#000']});
	},
	/**
	 * 关闭“正在加载”遮罩层。
	 * 
	 * @param loadingLayerIndex 遮罩层的index
	 */
	closeLoadingLayer : function(loadingLayerIndex) {
		layer.close(loadingLayerIndex);
	},
	/**
	 * 弹出警告框。
	 * 
	 * @param message 警告消息内容
	 */
	alert : function(message) {
		if ("undefined" != typeof layer && layer.alert) {
			layer.alert(message);
		} else {
			alert(message);
		}
	},
	/**
	 * 弹出框。
	 * 
	 * @param oDialog 弹出框元素
	 * @param x 横坐标
	 * @param y 纵坐标
	 */
	showDialog : function(oElement, oDialog) {
		oDialog.show();
		oDialog.css("position", "absolute");
		/*oDialog.css("top", oElement.offset().top);
		oDialog.css("left", oElement.offset().left - oDialog.width());*/
//		oDialog.css("left", event.clientX - 100);
//		oDialog.css("top", event.clientY);
		oDialog.css("z-index", 100);
	}, 
	/**
	 * 向顶部滚动。
	 * 
	 * @param offset 往回滚动的距离
	 */
	scrollUp : function(offset) {
		G.scrollVertical(true, offset);
	},
	/**
	 * 向底部滚动。
	 * 
	 * @param offset 往回滚动的距离
	 */
	scrollDown : function(offset) {
		G.scrollVertical(false, offset);
	},
	/**
	 * 向上或向下滚动。
	 * 
	 * @param isUp           是否向上滚动
	 * @param additionOffset 往回滚一点
	 */
	scrollVertical: function(isUp, additionOffset) {
		var pos = $(document).scrollTop();
		var offset = $(window).height() - 100;
		if (additionOffset) {
			offset -= additionOffset;
		}
		if (isUp) {
			pos -= offset;
		} else {
			pos += offset;
		}
		$(document).scrollTop(pos);
	},
	/**
	 * 向顶部滚动。
	 * 
	 * @param oDiv   滚动DIV元素
	 * @param offset 往回滚动的距离
	 */
	scrollDivUp : function(oDiv, offset) {
		G.scrollDivVertical(oDiv, true, offset);
	},
	/**
	 * 向底部滚动。
	 * 
	 * @param oDiv   滚动DIV元素
	 * @param offset 往回滚动的距离
	 */
	scrollDivDown : function(oDiv, offset) {
		G.scrollDivVertical(oDiv, false, offset);
	},
	/**
	 * 向上或向下滚动。
	 * 
	 * @param oDiv           滚动DIV元素
	 * @param isUp           是否向上滚动
	 * @param additionOffset 往回滚一点
	 */
	scrollDivVertical: function(oDiv, isUp, additionOffset) {
		var pos = oDiv.scrollTop();
		var offset = oDiv.height() - 100;
		if (additionOffset) {
			offset -= additionOffset;
		}
		if (isUp) {
			pos -= offset;
		} else {
			pos += offset;
		}
		oDiv.scrollTop(pos);
	},
	getUrlParams: function() {
		var location = window.location || { search: "", protocol: "file:" },
			params = location.search.slice( 1 ).split( "&" ),
			length = params.length,
			urlParams = {},
			current;
	
		if ( params[ 0 ] ) {
			for ( var i = 0; i < length; i++ ) {
				current = params[ i ].split( "=" );
				current[ 0 ] = decodeURIComponent( current[ 0 ] );
				current[ 1 ] = decodeURIComponent( current[ 1 ] );
				// allow just a key to turn on a flag, e.g., test.html?noglobals
				//current[ 1 ] = current[ 1 ] ? decodeURIComponent( current[ 1 ] ) : true;
				urlParams[ current[ 0 ] ] = current[ 1 ];
			}
		}
		return urlParams;
	}
};
