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
                        	console.log(treeNode.model);
                        	
                        }
                	}
                }
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