Ext.define('MyApp.view.BatchTestHistoryWindow', {
    extend: 'Ext.window.Window',
    alias: 'widget.BatchTestHistoryWindow',
    id: 'BatchTestHistory',
    height: 700,
    width: 1450,
    modal:true,
    layout: {
        type: 'hbox',
        align:'stretch'
    },
    bodyPadding: 6,
    title: '执行历史记录',
    autoScroll: true,
    collapsible: true,
    resizable:false,
    initComponent: function() {
    	var me = this;
        Ext.applyIf(me, {
        	items:[
			{
				xtype:'panel',
				flex : 3,
			    layout: {
			        type: 'fit',
			        align: 'stretch'
			    },
			    autoscroll: true,
			    items:[
			    {
			    	xtype:'gridpanel',
					id:'BatchHistoryGrid',
					title:'目录运行记录',
					store:'BatchRun',
					align: 'fit',
					columns:[        
						{
							xtype: 'gridcolumn',
							flex:5,
							dataIndex: 'time',
							text: '开始时间'
						},
						{
						    xtype: 'actioncolumn',
						    flex:1,
						    text: '删除',
						    items: [
						        {
						        	handler: function(view, rowIndex, colIndex, item, e, record, row) {
                                        Ext.MessageBox.confirm(
                                        "confirm",
                                        "确认删除？",
                                        function(e){
                                            if(e=='yes'){
                                            	var lm = new Ext.LoadMask(Ext.getCmp('BatchTestHistory'), { 
                                        			msg : '删除中。。。', 
                                        			removeMask : true
                                        		}); 
                                        		lm.show();
                                            	Ext.Ajax.request( {  
													url : 'job/deleteBatchHistory',
													params : {
														batchRunPath : record.raw.path
													},  
												    success : function(response, options) {
												    	lm.hide();
												    	Ext.getStore('BatchRun').reload();
												    	Ext.getStore('TestItem').removeAll();
												    	Ext.getCmp('RequestTA').setValue("");
												    	Ext.getCmp('ResponseTA').setValue("");
												    	Ext.getStore('CheckPointResult').removeAll();
												    },  
												    failure: function(response, opts) {
												    	lm.hide();
										             	Ext.Msg.alert("错误","删除历史记录信息失败");
										            }
												});
                                            }
                                        }
                                        ); 
                                    },
                                    icon: 'image/delete.png',
                                    tooltip: 'delete'
						        }
						    ]
						}
					],
					listeners: {
						itemdblclick : function( that, record, item, index, e, eOpts ){
							Ext.Ajax.request( {  
								url : 'job/getTestRunInfo',
								params : {
									batchRunPath : record.raw.path
								},  
							    success : function(response, options) {
							    	var testhistories=JSON.parse(response.responseText).rows;
							    	Ext.getStore('TestItem').loadData(testhistories);
							    },  
							    failure: function(response, opts) {
					             	Ext.Msg.alert("错误","获取批量测试执行信息失败");
					            }
							});
						}
					}
			    }]	
			},       
			{
				xtype:'panel',
				flex : 7,
			    layout: {
			        type: 'fit',
			        align: 'stretch'
			    },
			    autoscroll: true,
			    items:[
	            {
	            	xtype:'gridpanel',
					id:'TestItemResultGrid',
					title:'测试运行记录',
					store:'TestItem',
					align: 'fit',
					columns:[
					{
						xtype: 'gridcolumn',
						flex:11,
						dataIndex: 'name',
						text: '名称',
						renderer: function(value, metaData, record, rowIndex, colIndex, store, view) {
                        	return value.replace(new RegExp("<","gm"),"&lt;");
                        }
					},     
					{
						xtype: 'gridcolumn',
						flex:12,
						dataIndex: 'time',
						text: '开始时间'
					},
					{
						xtype: 'gridcolumn',
						flex:5,
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
						itemdblclick : function( that, record, item, index, e, eOpts ){
							Ext.Ajax.request( {  
								url : 'job/getTestResultDetailInfo',
								params : {
									testRunPath : record.raw.path
								},  
							    success : function(response, options) {
							    	var json=JSON.parse(response.responseText);
							    	if(json.success){
							    		var obj=json.obj;
							    		if(obj.result!="exception"){
								    		var req=obj.requestInfo;
									    	var res=obj.responseInfo;
									    	Ext.getCmp('RequestTA').setValue(req);
									    	Ext.getCmp('ResponseTA').setValue(res);
									    	var checkpoints=obj.checkPoint;
									    	Ext.getStore('CheckPointResult').loadData(checkpoints);	
								    	}
								    	else
								    		Ext.Msg.alert('执行期异常',obj.comment);
							    	}else{
							    		if(Ext.String.endsWith(json.msg,"不存在或被删除")){
							    			Ext.Msg.alert("提示",json.msg+",将删除该记录？",	function(){
    	        								Ext.Ajax.request( {
    	        									url : 'job/deleteTestResultDetailInfoInBatchHistory',  
    	        									params : {  
    	        										testRunPath : record.raw.path
    	        									},
    	        								    success : function(response, options) {
    	        								    	Ext.Ajax.request( {  
    	        											url : 'job/getTestRunInfo',
    	        											params : {
    	        												batchRunPath : record.raw.path.substring(0,record.raw.path.indexOf(record.raw.name)-1)
    	        											},  
    	        										    success : function(response, options) {
    	        										    	var testhistories=JSON.parse(response.responseText).rows;
    	        										    	Ext.getStore('TestItem').loadData(testhistories);
    	        										    },  
    	        										    failure: function(response, opts) {
    	        								             	Ext.Msg.alert("错误","获取批量测试执行信息失败");
    	        								            }
    	        										});
    	        								    },
    	        								    failure: function(response, opts) {
    	        						             	Ext.Msg.alert("删除执行记录失败");
    	        						            }
    	        								});
    								    	});
							    		}
							    	}
							    },  
							    failure: function(response, opts) {
					             	Ext.Msg.alert("错误","获取测试结果信息失败");
					            }
							});
						}
					}
	            }
				]	
			},
			{
				xtype:'panel',
				flex : 14,
				id:'OutputPanel',
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
								title:"请求内容",
								layout: {
							        type: 'fit'
								},
								items:[
									{
										xtype:"textarea",
										id:"RequestTA"
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
										id:"ResponseTA"
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
								id:'ResultOfCheckPointsGrid',
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
                }
			}
		});
        me.callParent(arguments);
    },
    onWindowShow: function(window, eOpts) {
    	Ext.getStore('BatchRun').proxy.extraParams.folderName=Ext.getCmp('Base').folderName;
		Ext.getStore('BatchRun').load();
    	Ext.getStore('TestItem').removeAll();
    	Ext.getCmp('RequestTA').setValue("");
    	Ext.getCmp('ResponseTA').setValue("");
    	Ext.getStore('CheckPointResult').removeAll();
    	
    }
});    