Ext.define('MyApp.view.TestHistoryWindow', {
    extend: 'Ext.window.Window',
    alias: 'widget.TestHistoryWindow',
    id: 'TestHistoryWindow',
    height: 666,
    width: 1200,
    modal:true,
    resizable:false,
    layout: {
        type: 'hbox',
        align:'stretch'
    },
    bodyPadding: 6,
    title: '执行历史记录',
    autoScroll: true,
    collapsible: true,
    
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
					id:'TestHistoryGrid',
					title:'历史记录',
					store:'TestHistory',
					align: 'fit',
					columns:[        
						{
							xtype: 'gridcolumn',
							flex:7,
							dataIndex: 'time',
							text: '开始时间',
							renderer: function(value, metaData, record, rowIndex, colIndex, store, view) {
							    	if(value!=""){
							    		var time=value.split(" ")[1];
							    		value=value.split(" ")[0]+' '+time.substring(0,2)+':'+time.substring(3,5)+':'+time.substring(6,8)+' '+value.split(" ")[2];
							    	}
							    	return value;
					    		}
						},
						{
							xtype: 'gridcolumn',
							flex:3,
							dataIndex: 'duration',
							text: '持续毫秒'
						},
						{
							xtype: 'gridcolumn',
							flex:2,
							dataIndex: 'result',
							text: '结果',
							renderer: function(value, metaData, record, rowIndex, colIndex, store, view) {
	                            if(value=='p' || value=='P' || value=='pass'){
	                                return '<span style="color: #006000;font-size:14px">' + "成功" + '</span>';
	                            }else if(value=='f' || value=='F' || value=='fail'){
	                                return '<span style="color: #CE0000;font-size:14px">' + "失败" + '</span>';
	                            }
	                            else if(value=='i' || value=='I' || value=='invalid'){
	                                return '<span style="color:gray;font-size:14px">' + "无效" + '</span>';
	                            }
	                            else if(value=='e' || value=='E' || value=='exception'){
	                                return '<span style="color:brown;font-size:14px">' + "异常" + '</span>';
	                            }
	                        }
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
						                    	Ext.Ajax.request( {  
													url : 'job/deleteHistory',
													params : {
														folderName : Ext.getCmp('Base').folderName,
														time : record.raw.time
													},  
												    success : function(response, options) {
												    	Ext.getStore('TestHistory').reload();
												    	Ext.getCmp('ReqJsonTextArea').setValue("");
												    	Ext.getCmp('ResJsonTextArea').setValue("");
												    	Ext.getStore('CheckPointResult').removeAll();
												    },  
												    failure: function(response, opts) {
										             	Ext.Msg.alert("错误","删除历史记录信息失败");
										            }
												});
						                    }
						                }
						                ); 
						            },
						            icon: 'image/delete.png',
						            tooltip: '删除'
						        }
						    ]
						}
					],
					listeners: {
						itemdblclick : function( that, record, item, index, e, eOpts ){
							Ext.Ajax.request( {  
								url : 'job/getHistoryDetail',
								params : {
									folderName : Ext.getCmp('Base').folderName,
									time : record.raw.time
								},  
							    success : function(response, options) {
							    	var obj=JSON.parse(response.responseText).obj;
							    	if(obj.result!="exception"){
							    		var req=obj.requestInfo;
								    	var res=obj.responseInfo;
								    	Ext.getCmp('ReqJsonTextArea').setValue(req);
								    	Ext.getCmp('ResJsonTextArea').setValue(res);
								    	var checkpoints=obj.checkPoint;
								    	Ext.getStore('CheckPointResult').loadData(checkpoints);	
							    	}
							    	else
							    		Ext.Msg.alert('执行期异常',obj.comment);
							    },
							    failure: function(response, opts) {
					             	Ext.Msg.alert("错误","获取历史记录信息失败");
					            }
							});
						}
					}
	            }]	
			},
			{
				xtype:'panel',
				flex : 8,
				id:'ResPanel',
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
										id:"ReqJsonTextArea"
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
										id:"ResJsonTextArea"
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
								id:'CheckPointsResultGrid',
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
    	Ext.getStore('TestHistory').proxy.extraParams.folderName=Ext.getCmp('Base').folderName;
		Ext.getStore('TestHistory').load();
		Ext.getStore('CheckPointResult').removeAll();
    }
});    
