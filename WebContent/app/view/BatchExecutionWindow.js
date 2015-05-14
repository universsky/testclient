var isStart;

Ext.define('MyApp.view.BatchExecutionWindow', {
    extend: 'Ext.window.Window',
    alias: 'widget.BatchExecutionWindow',
    id: 'BatchExecutionWindow',
    height: 700,
    width: 1300,
    modal:true,
    layout: {
        type: 'hbox',
        align:'stretch'
    },
    resizable:false,
    bodyPadding: 6,
    title: '批量执行',
    autoScroll: true,
    collapsible: true,
    
    initComponent: function() {
    	var me = this;
        Ext.applyIf(me, {
        	items:[
			{
				xtype:'panel',
				flex : 1,
			    layout: {
			        type: 'fit',
			        align: 'stretch'
			    },
			    autoscroll: true,
			    items:[
	            {
	            	xtype:'gridpanel',
					title:'测试列表',
					store:'TestItem',
					align: 'fit',
					dockedItems: [
                    {
                        xtype: 'toolbar',
                        dock: 'top',
                        items: [
                            {
                                xtype: 'button',
                                handler: function(button, event) {
                                	isStart=true;
                                	var folder=Ext.getCmp('Base').folderName;
    								Ext.Ajax.request( {
    									url : 'job/executeBatchTest',  
    									params : {  
    										dirPath : folder
    									},
    								    success : function(response, options) {
    								    	Ext.TaskManager.stopAll();
    								    	Ext.Msg.alert("提示","done.",	function(){
    								    		var folder=Ext.getCmp('Base').folderName;
    	        								Ext.Ajax.request( {
    	        									url : 'job/getTestItems',  
    	        									params : {  
    	        										folderName : folder
    	        									},
    	        								    success : function(response, options) {
    	        								    	Ext.getStore('TestItem').reload();
    	        								    	Ext.getStore('TestCaseResult').load();
    	        								    	Ext.getStore('TestStatusDistribution').load();
    	        								    	Ext.getStore('TestPassedRate').load();
    	        								    },
    	        								    failure: function(response, opts) {
    	        						             	Ext.Msg.alert("获取测试结果失败");
    	        						            }
    	        								});
    								    	});
    								    },
    								    failure: function(response, opts) {
    								    	Ext.TaskManager.stopAll();
    						             	Ext.Msg.alert("提示","done.",	function(){
    								    		var folder=Ext.getCmp('Base').folderName;
    	        								Ext.Ajax.request( {
    	        									url : 'job/getTestItems',  
    	        									params : {  
    	        										folderName : folder
    	        									},
    	        								    success : function(response, options) {
    	        								    	Ext.getStore('TestItem').reload();
    	        								    	Ext.getStore('TestCaseResult').load();
    	        								    	Ext.getStore('TestStatusDistribution').load();
    	        								    	Ext.getStore('TestPassedRate').load();
    	        								    },
    	        								    failure: function(response, opts) {
    	        						             	Ext.Msg.alert("获取测试结果失败");
    	        						            }
    	        								});
    								    	});
    						            }
    								});
                                },
                                icon: 'image/execution.png',
                                tooltip: '运行'
                            },
                            {
                                xtype: 'tbseparator'
                            },
                            {
                                xtype: 'button',
                                handler: function(button, event) {
                                	var folder=Ext.getCmp('Base').folderName;
    								Ext.Ajax.request( {
    									url : 'job/getTestItems',  
    									params : {  
    										folderName : folder
    									},
    								    success : function(response, options) {
    								    	Ext.getStore('TestItem').reload();
    								    },
    								    failure: function(response, opts) {
    						             	Ext.Msg.alert("获取测试结果失败");
    						            }
    								});
                                },
                                icon: 'image/refresh.png',
                                tooltip: '刷新'
                            },
                            {
                                xtype: 'tbseparator'
                            }
                        ]
                    }],
					columns:[ 
					{	
						xtype:'gridcolumn',
						dataIndex: 'testpath',
						hidden:true
					},
					{
						xtype: 'gridcolumn',
						flex:8,
						dataIndex: 'name',
						text: '名称',
						renderer: function(value, metaData, record, rowIndex, colIndex, store, view) {
                        	return value.replace(new RegExp("<","gm"),"&lt;");
                        }
					},     
					{
						xtype: 'gridcolumn',
						flex:7,
						dataIndex: 'time',
						text: '开始时间'
					},
					{
						xtype: 'gridcolumn',
						flex:3,
						dataIndex: 'duration',
						text: '持续毫秒'
					},
					{
						xtype: 'gridcolumn',
						flex:1,
						dataIndex: 'status',
						text: '状态',
						renderer: function(value, metaData, record, rowIndex, colIndex, store, view) {	
                            if(value=='p' || value=='P' || value=='pass'){
                                return '<span style="color: #006000;font-size:14px">' + "成功" + '</span>';
                            }else if(value=='f' || value=='F' || value=='fail'){
                                return '<span style="color: #CE0000;font-size:14px">' + "失败" + '</span>';
                            }
                            else if(value=='i' || value=='I' || value=='invalid'){
                                return '<span style="color:gray;font-size:14px">' + "无效" + '</span>';
                            }
                            else if(value=='r' || value=='R' || value=='ready'){
                                return '<span style="color: blue;font-size:14px">' + "待测" + '</span>';
                            }
                            else if(value=='e' || value=='E' || value=='exception'){
                                return '<span style="color: brown;font-size:14px">' + "异常" + '</span>';
                            }
                        }
					}],
					
					listeners: {
						afterrender : {
                            fn: me.updateGridPeriodically,
                            scope: me
                        },
                        itemmouseenter: {
                            fn: me.itemmouseenter,
                            scope: me
                        },
						itemdblclick : function( that, record, item, index, e, eOpts ){
							Ext.Ajax.request( {
								url : 'job/getTestDetailResult',  
								params : {  
									testPath : record.raw.path
								},
							    success : function(response, options) {
							    	var obj=JSON.parse(response.responseText).obj;
							    	if(obj.result!="exception"){
							    		if(obj.result!="ready"){
							    			if(obj.comment==""){
							    				var req=obj.requestInfo;
										    	var res=obj.responseInfo;
										    	Ext.getCmp('RequestJsonTextArea').setValue(req);
										    	Ext.getCmp('ResponseJsonTextArea').setValue(res);
										    	var checkpoints=obj.checkPoint;
										    	Ext.getStore('CheckPointResult').loadData(checkpoints);	
							    			}
							    			//处理历史记录文件被删情况
							    			else{							    				
							    				Ext.MessageBox.confirm(
									                "确认",
									                obj.comment,
									                function(e){
									                    if(e=='yes'){
									                    	Ext.Ajax.request( {  
																url : 'job/deleteTestInfo',
																params : {
																	folder : Ext.getCmp('Base').folderName,
																	time : obj.startTime
																},  
															    success : function(response, options) {
															    	Ext.getStore('TestItem').reload();					    	
															    },  
															    failure: function(response, opts) {
													             	Ext.Msg.alert("错误","删除测试记录信息失败");
													            }
															});
									                    }
									                });
							    			}
							    		}
							    		else
							    			Ext.Msg.alert('待测试项',"尚未执行，请等待。");
							    	}		
							    	else
							    		Ext.Msg.alert('执行异常',obj.comment);
							    },
							    failure: function(response, opts) {
					             	Ext.Msg.alert("获取测试结果失败");
					            }
							});
						}
					}
	            }
				]	
			},
			{
				xtype:'panel',
				flex : 2,
				id:'DetailPanel',
				layout: {
			        type: 'vbox',
			        align:'stretch'
				},
				items:[
					{
						xtype:'container',
						flex:3,
						layout: {
					        type: 'hbox',
					        align:'stretch'								        
						},									
						items:[
							{	
								xtype:'panel',
								flex:2,
								title:"请求报文",
								layout: {
							        type: 'fit'
								},
								items:[
									{
										xtype:"textarea",
										id:"RequestJsonTextArea"
									}
								]
							},
							{	
								xtype:'panel',
								flex:3,
								title:"响应内容",
								layout: {
							        type: 'fit'
								},
								items:[
									{
										xtype:"textarea",
										id:"ResponseJsonTextArea"
									}
								]
							}
						]	
					},
					{
						xtype:'container',
						flex:2,
						layout: {
						    type: 'fit',
						    align:'stretch'
						},
						items:[
							{
								xtype:'gridpanel',
								title:'检查点结果',
								store:'CheckPointResult',
								columns:[
									{
										xtype: 'gridcolumn',
										flex:3,
	            						dataIndex: 'name',
	            						text: '名称',
	            						renderer: function(value, metaData, record, rowIndex, colIndex, store, view) {
	                                    	return value.replace(new RegExp("<","gm"),"&lt;");
	                                    }
									},
									{
										xtype: 'gridcolumn',
										flex:2,
	            						dataIndex: 'type',
	            						text: '类型'												
									},
									{
										xtype: 'gridcolumn',
										flex:6,
	            						dataIndex: 'checkInfo',
	            						text: '检查字符串',
	            						renderer: function(value, metaData, record, rowIndex, colIndex, store, view) {
	                                    	return value.replace(new RegExp("<","gm"),"&lt;");
	                                    }
									},
									{
										xtype: 'gridcolumn',
										flex:1,
	            						dataIndex: 'result',
	            						text: '结果',
			                            renderer: function(value, metaData, record, rowIndex, colIndex, store, view) {
			                                if(value=='pass'){
			                                    return '<span style="color: #006000;font-size:20px">' + value + '</span>';
			                                }else{
			                                    return '<span style="color: #CE0000;font-size:20px">' + value + '</span>';
			                                }
			                            }                           						
									}										
								]
							}
						]
					}
				]
			}],
			listeners: {
				show: {
                    fn: me.onWindowShow,
                    scope: me
                },
                beforeshow: {
                	fn: me.stopGridUpdate
                }
			}
		});
        me.callParent(arguments);
    },
    onWindowShow: function(window, eOpts) {	
    	Ext.getStore('TestItem').proxy.extraParams.folderName=Ext.getCmp('Base').folderName;
		Ext.getStore('TestItem').load();
    },
    updateGridPeriodically: function(){
    	Ext.TaskManager.start({
    		run : function(){
    	    	if(isStart){
    	    		//isStart=true;
    	    		var folder=Ext.getCmp('Base').folderName;
    	    		Ext.Ajax.request( {
    	    			url : 'job/getTestItems',  
    	    			params : {  
    	    				folderName : folder
    	    			},
    	    		    success : function(response, options) {
    	    		    	Ext.getStore('TestItem').reload();
    	    		    },
    	    		    failure: function(response, opts) {
    	                 	Ext.Msg.alert("获取测试结果失败");
    	                }
    	    		});
    	    	}	
    	    },
    		interval : 4000,
    		scope: this
    		});
    },
    itemmouseenter: function( that, record, item, index, e, eOpts ){
    	Ext.create('Ext.tip.ToolTip', {
            width: 500,
            height:80,
    		target:item,
    		html: record.raw.testpath
            //dismissDelay: 15000         //15秒后自动隐藏
        });
    },
    stopGridUpdate: function(){  	
    	isStart=false;
    	Ext.TaskManager.stopAll();
    }
}); 


