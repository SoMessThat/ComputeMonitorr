$(function(){
	var zTreeNodes;
	var url="/FindProjectInfo?username=test";
	var data=[];
	var success= function(result, status) {
        var level1=result['project'];
		for(var i=0;i<result['project'].length;i++){
			level1[i].level1="project";
			level1[i].isParent=false;
        }
        zTreeNodes=level1;
		var setting={   
			view: {
				addDiyDom: addDiyDom
			},
			callback :{
                onClick : function(event, treeId, treeNode, clickFlag) {
                	if(treeNode.isParent == false){
                		var level1=treeNode.level1;
                		if(level1=="resource"){
                        	var	url2="/FindModelInfo?pid="+treeNode.id;
    	                    var	data2=[];
    	                    var error2 = function(xhr, msg, ex) {//请求失败处理函数
    	                            alert('请求失败');
    	                    };
    	                    var success2= function(result, status) { 
                            	var level3={};
                        		level3.level1="model";
                        		level3.name=result['Model'][0]['AssociationTable'];
                        		level3.model=result['Model'];
                        		var jsondata=[];
                        		jsondata[0]=level3;
                                    if(jsondata == null || jsondata == ""){
                                        //末节点的数据为空   所以不再添加节点  这里可以根据业务需求自己写
                                        //$("#treeFrame").attr("src",treeNode.url);
                                        }
                                    else{
                                        var treeObj = $.fn.zTree.getZTreeObj("tree");
                                            //treeNode.halfCheck = false;
                                            var parentZNode = treeObj.getNodeByParam("id", treeNode.id, null);//获取指定父节点
                                            newNode = treeObj.addNodes(parentZNode,jsondata, false);
                                        }
                                }
                        	G.get(url2,data2,success2,error2);
                        }else if(level1 == "project"){ 
                        	var url1="/FindResourceInfo?pid="+treeNode.id;
                            var	data1=[];
                            var error1 = function(xhr, msg, ex) {//请求失败处理函数
                                    alert('请求失败');
                            };
                            var success1= function(result, status) { //添加子节点到指定的父节点
                            	var level2=result['resource'];
                        		for(var i=0;i<result['resource'].length;i++){
                        			level2[i].level1="resource";
                                }
                        		var jsondata=level2;
                                if(jsondata == null || jsondata == ""){
                                    //末节点的数据为空   所以不再添加节点  这里可以根据业务需求自己写
                                    //$("#treeFrame").attr("src",treeNode.url);
                                    }
                                else{
                                    var treeObj = $.fn.zTree.getZTreeObj("tree");
                                    //treeNode.halfCheck = false;
                                    var parentZNode = treeObj.getNodeByParam("id", treeNode.id, null);//获取指定父节点
                                    newNode = treeObj.addNodes(parentZNode,jsondata, false);
                                }
                            }
                        	G.get(url1,data1,success1,error1);
                        }else if(level1 =="model"){
                        	var json={};
                        	var json1=new Array();
                        	//var jsonstr="[";
							var str=new Array();
							var str1=new Array();
                        	for(var i=0;i<treeNode.model.length;i++){
    							str1=treeNode.model[i]['MetaElement'];
    							str.push(str1);
    							/*json['database']="demo";
    							json['MetaElement']=treeNode.model[i]['MetaElement'];
    							json['FromTable']=treeNode.model[i]['FromTable'];
    							json['AssociationTable']=treeNode.model[i]['AssociationTable'];
    							json1[i]=json;*/
    							/*jsonstr=jsonstr+"{'database':'demo','MetaElement':["+treeNode.model[i]['MetaElement']+"],'FromTable':'"+treeNode.model[i]['FromTable']+"','AssociationTable':'"+treeNode.model[i]['AssociationTable']+"'}";
    							if(i<treeNode.model.length-1){
    								jsonstr=jsonstr+",";
    							}*/
                        	}
                        	/*var json2={};
                        	json2.metadataJson=treeNode.model;
                        	jsonstr=jsonstr+"]";*/
                        	jsonstr1 =JSON.stringify(treeNode.model);
                        	//console.log(json1);
                        	for(var a=0;a<str.length;a++){
                        		for(var b=a+1;b<str.length;b++){
                        			for(var c=0;c<str[a].length;c++){
                            			for(var d=0;d<str[b].length;d++){
	                        				if(str[a][c]==str[b][d]){
	                            				str[b].splice(d,1);
	                            			}
                            			}
                        			}
                        		}
                        	}
                        	console.log(JSON.stringify(str));
                        	var url3="/FindTableData";
                        	var data3={metadataJson:jsonstr1};//'metadataJson:'+jsonstr;
                        	var error3= function(xhr, msg, ex) {//请求失败处理函数
                                    alert('请求失败');
                            };
                            var success3= function(result, status) { //添加子节点到指定的父节点
                            	var datalist=new Array();
                        		for(var l=0;l<result['tableData'][0].length;l++){
                            		var datalist1={};
	                            	for(var i=0;i<str.length;i++){
	                                	for(var j=0;j<str[i].length;j++){
                                    		datalist1[str[i][j]]=result['tableData'][i][l][str[i][j]];
                                		}
                                	}
                        			datalist.push(datalist1);
                            	}
                            	console.log(datalist);
                            	var tableinner;
                            	tableinner="<table border='2px' cellpadding='5px' width='100%'><tr>";
                            	for (var a=0;a<str.length;a++){
                            		for(var b=0;b<str[a].length;b++){
                            			tableinner=tableinner+"<td>"+str[a][b]+"</td>";
                            		}
                            	}
                            	tableinner=tableinner+"</tr>";
                            	for(var c=0;c<datalist.length;c++){
                            		tableinner=tableinner+"<tr>";
                            		for (var a=0;a<str.length;a++){
                                		for(var b=0;b<str[a].length;b++){
                                			tableinner=tableinner+"<td>"+datalist[c][str[a][b]]+"</td>";
                                		}
                                	}
                            		ableinner=tableinner+"</tr>";
                            	}
                            	tableinner=tableinner+"</table>";
                            	$(".main-body-right").html(tableinner);
							}
                        	G.get(url3,data3,success3,error3);
                        }
                	}
                }
			}
		};
		function addDiyDom(treeId, treeNode) {
			var spaceWidth = 5;
			var switchObj = $("#" + treeNode.tId + "_switch"),
			icoObj = $("#" + treeNode.tId + "_ico");
			switchObj.remove();
			icoObj.before(switchObj);

			if (treeNode.level > 1) {
				var spaceStr = "<span style='display: inline-block;width:" + (spaceWidth * treeNode.level)+ "px'></span>";
				switchObj.before(spaceStr);
			}
		};
		var city = $.fn.zTree.init($("#tree"), setting, zTreeNodes);    
		//第一个参数为zTree的DOM容器，第二个为zTree设置详情可见官网api,第三个为zTree的节点数据 
	};
	var error = function(xhr, msg, ex) {
		alert("xinxicuowu");
	}
	G.get(url,data,success,error);
}); 

//注意：导航 依赖 element 模块，否则无法进行功能性操作
layui.use('element', function(){
  var element = layui.element;
});