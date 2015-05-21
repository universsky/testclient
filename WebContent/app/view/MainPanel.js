var fieldName;
Ext.define('MyApp.view.MainPanel', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.MainPanel',
    id: 'MainPanel',
    initComponent: function() {
        var me = this;
        Ext.applyIf(me, {
        	items:[
        		{
        			xtype:'toolbar',
        			items:[
        				{
        					xtype:'button',
        					text:'执行',
        					handler:function(){
        						Ext.getCmp('InputPanel').getForm().submit({
        							waitMsg:'执行中...', 
        							success:function(form,action){
        								console.log(action.result.success);
        								var resultlist=action.result.obj;
        								var displayitemindex=resultlist.length-1;
        								for(var i=0;i<=displayitemindex;i++){
        									if(resultlist[i].result=='fail'){
        										displayitemindex=i;
        										break;
        									}
        								}
        								var responsebody=resultlist[displayitemindex].responseInfo;
        								var requestbody=resultlist[displayitemindex].requestInfo;
        								Ext.getCmp('ResponseTextArea').setValue(responsebody);
        								Ext.getCmp('requestTextArea').setValue(requestbody);
        								
        								var checkpoint=resultlist[displayitemindex].checkPoint;
        								console.log(checkpoint);
        								Ext.getStore('CheckPointResult').loadData(checkpoint);
        								console.log(Ext.getStore('CheckPointResult').data);
        								
        								var callbacks=resultlist[displayitemindex].callback;
        								if(callbacks.length!=0){
	        								for(var callbackstr in callbacks){
	        									console.log("call back is:");
	        									console.log(callbacks[callbackstr]);
	        									eval(callbacks[callbackstr]);
	        								}
        								}
        								var foldername=Ext.getCmp('Base').folderName;
        								Ext.Ajax.request( {
        									url : 'job/generateHistoryFile',  
        									params : {  
        										foldername : foldername, 
        										reqstate: 'success',
        										testresultitemcollectionjson : Ext.encode(resultlist)
        									},
        								    success : function(response, options) {
        								    	if(options.params.testresult.result=="invalid"){
        								    		Ext.Msg.alert("警告","无效测试。请设检查点。");
        								    	}
        								    },
        								    failure: function(response, opts) {
        						             	Ext.Msg.alert("错误","写历史记录文件失败");
        						            }
        								});
        							},
        							failure:function(form,action){
        								var obj={};
        								if(action.response.status!=0){
        									obj.comment=action.result.msg;
        								}else{
        									obj.comment=action.response.statusText;	
        								};
        								obj.result="exception";
        								Ext.Msg.alert('错误',obj.comment,function(btn){
	        								Ext.Ajax.request( {
	        									url : 'job/generateHistoryFile',  
	        									params : {  
	        										foldername : Ext.getCmp('Base').folderName, 
	        										obj : Ext.encode(obj),
	        										reqstate: 'failure'
	        									},
	        								    success : function(response, options) {
	        								    },
	        								    failure: function(response, opts) {
	        						             	Ext.Msg.alert("错误","写历史记录文件失败");
	        						            }
	        								});
        								});
        							}
        						});
        					}
        				},
					    {
					    	xtype:'tbseparator'
					    },        			
        				{
        					xtype:'button',
        					text:'配置测试',
        					handler:function(){
        						if(Ext.getCmp('Base').IsHttpCase)
        							Ext.widget('TestConfigWindow').show();
        						else
        							Ext.widget('SocketTestConfigWindow').show();
        					}
        				},
					    {
					    	xtype:'tbseparator'
					    },        				
        				{
        					xtype:'button',
        					text:'配置环境变量',
        					handler:function(){
        						Ext.widget('EnvEditWindow').show();
        						Ext.getCmp('Base').showEvn();
        					}
        				}, 
        				{
					    	xtype:'tbseparator'
					    },        				
        				{
        					xtype:'button',
        					text:'配置前置数据',
        					handler:function(){
        						Ext.widget('PreConfigurationWindow').show();
        					}
        				}, 
					    {
					    	xtype:'tbseparator'
					    },
        				{
        					xtype:'button',
        					text:'添加检查点',
        					handler:function(){
        						Ext.widget('AddCheckPointWindow').show();	
        					}
        				},
        				{
					    	xtype:'tbseparator'
					    },
        				{
        					text:'前置动作设置',
        					menu:new Ext.menu.Menu({
        						plain: true,
        	                    items:[  
    	                        {  
    	                            text:'sql action',  
    	                            handler: function(){
		        						Ext.getCmp('MainPanel').ActionType='setup';
		        						Ext.widget('SqlActionSettingWindow').show();	
		        					}  
    	                        },
    	                        {  
    	                            text:'service action',  
    	                            handler: function(){
		        						Ext.getCmp('MainPanel').ActionType='setup';
		        						Ext.getStore('ServiceActionTreeStore').proxy.extraParams.rootName=Ext.getCmp('Base').RootName;
		        						Ext.getStore('ServiceActionTreeStore').load();
		        						Ext.widget('ServiceActionWindow').show();	
		        					}
    	                        }]  
        	                }) 
        				},
        				{
					    	xtype:'tbseparator'
					    },
        				{
        					text:'后置动作设置',
        					menu:new Ext.menu.Menu({
        						plain: true,
        	                    items:[  
    	                        {  
    	                            text:'sql action',  
    	                            handler:function(){
    	        						Ext.getCmp('MainPanel').ActionType='teardown';
    	        						Ext.widget('SqlActionSettingWindow').show();	
    	        					}
    	                        },
    	                        {  
    	                            text:'service action',  
    	                            handler: function(){
		        						Ext.getCmp('MainPanel').ActionType='teardown';
		        						Ext.getStore('ServiceActionTreeStore').proxy.extraParams.rootName=Ext.getCmp('Base').RootName;
		        						Ext.getStore('ServiceActionTreeStore').load();
		        						Ext.widget('ServiceActionWindow').show();	
		        					}
    	                        }]  
        	                }) 
        				},
        				{
					    	xtype:'tbseparator'
					    },
					    {
        					xtype:'button',
        					text:'输出变量设置',
        					handler:function(){
        						Ext.widget('OutputParameterSettingWindow').show();	
        					}
        				},
					    {
					    	xtype:'tbseparator'
					    },
        				{
        					xtype:'button',
        					text:'执行记录',
        					handler:function(){
        						Ext.widget('TestHistoryWindow').show();	
        					}
        				}      				
        			]
        		},
        		{
        			xtype:'panel',
				    layout: {
				        type: 'hbox',
				        pack:'top',
				        align:'stretch'	
				    },
        			items:[
        				{
        					xtype:'form',
        					title:'输入参数',
        					id:'InputPanel',
        					autoScroll:true,
        					height:866,
        					url:'job/executeTest',
        					flex:1,
						    listeners: {
				                'added': {
				                    fn:function(){
				                    	me.buildRequestForm(Ext.getCmp('Base').folderName);
				                    },
				                    scope: me
				                }              
				            }
        				},
        				{
        					xtype:'panel',
        					id:'ResponsePanel',
        					flex:2,
        					height:866,
        					layout: {
						        type: 'vbox',
						        pack:'start',
						        align:'stretch'
							},
							items:[
								{
									xtype:'container',
									flex:3,
		        					layout: {
								        type: 'hbox',
								        pack:'top',
								        align:'stretch'				        
									},									
									items:[
										{	
											xtype:'panel',
											flex:1,
											title:"请求内容",
											layout: {
										        type: 'fit'
											},
											items:[
												{
													xtype:"textarea",
													id:"requestTextArea"
												}
											]
										},
										{	
											xtype:'panel',
											flex:1,
											title:"响应内容",
											layout: {
										        type: 'fit'
											},
											items:[
												{
													xtype:"textarea",
													id:"ResponseTextArea"
												}
											]
										}
									]
								},
								{
									xtype:'container',
									flex:2,
//									layout: {
//									    type: 'fit'
//									},
									items:[
										{
											xtype:'gridpanel',
											id:'CheckPointResultGrid',
											title:'检查点结果',
											store:'CheckPointResult',
											scroll:'both ',
											columns:[
												{
													xtype: 'gridcolumn',
													flex:4,
                            						dataIndex: 'name',
                            						text: '名称',
                            						renderer: function(value, metaData, record, rowIndex, colIndex, store, view) {
                                                    	return value.replace(new RegExp("<","gm"),"&lt;");
                                                    }
												},
												{
													xtype: 'gridcolumn',
													flex:1,
                            						dataIndex: 'type',
                            						text: '类型'												
												},
												{
													xtype: 'gridcolumn',
													flex:7,
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
        				}
        			]
        		}
        	]
        });
        me.callParent(arguments);
    },
    
 	buildRequestForm:function(foldername){
         Ext.Ajax.request({
         	url:'job/buildRequestForm/',
         	params: { folderName: foldername } ,
            success: function(response, opts) {
            	Ext.getCmp('InputPanel').removeAll(false);
            	var theresponse = Ext.decode(response.responseText);
            	var theparameters=theresponse.obj;
            	
            	Ext.getCmp('InputPanel').add({
				    xtype:'textfield',
	        		anchor: '100%',
	        		hidden:true,
	        		value:Ext.getCmp('Base').folderName,
	        		name:'__HiddenView_path'
				});
            	
            	for(var key in theparameters){
            		if(theparameters[key].type=='textfield'){
	            		Ext.getCmp('InputPanel').add({
					    xtype:'textfield',
					    labelWidth: 150,
					    resizable:true,
	        			fieldLabel: theparameters[key].text,
	        			value:theparameters[key].defaultValue,
	        			name:theparameters[key].name
					    });
            		}else if(theparameters[key].type=='combo'){
            			Ext.getCmp('InputPanel').add({
					    xtype:'combo',
	        			labelWidth: 150,
	        			fieldLabel:theparameters[key].text,
	        			store:Ext.decode(theparameters[key].extraInfo),
	        			value:theparameters[key].defaultValue,
	        			name:theparameters[key].name
					    });
            		}else if(theparameters[key].type=='service'){
            			fieldName=key;
            			Ext.getCmp('InputPanel').add(
        					new Ext.create('Ext.form.field.ComboBox', {
        						id: 'ServiceBoundCombo',
        						editable:false,
        						labelWidth: 150,
        						fieldLabel:theparameters[key].text,
        						name:theparameters[key].name,
        						value:theparameters[key].extraInfo,
        						triggerAction:'all',
        						selectedClass:'',
        						onSelect:Ext.emptyFn,
        					    onTriggerClick: function () {
        					    	Ext.getCmp("Base").fieldNameNeedToBindService=fieldName;
        					    	Ext.getStore('TestSelectionTreeStore').proxy.extraParams.rootName=Ext.getCmp('Base').RootName;
        					    	Ext.getStore('TestSelectionTreeStore').load();
        					    	Ext.widget("TestSelectionWindow").show();
        					    }
        					})
        				);
            		}else if(theparameters[key].type.indexOf('label')==0){
            			fieldName=key;
            			var len=theparameters[key].extraInfo.indexOf('+');
            			Ext.getCmp('InputPanel').add({
            				xtype:'label',
//            				border: 1,
//            				style: {
//            				    borderColor: 'blue',
//            				    borderStyle: 'solid'
//            				},
            				html: '<p><font color="blue">'+theparameters[key].text+"：</font>"+theparameters[key].extraInfo.substr(0,len).replace('+','')
            			});
            		}else if(theparameters[key].type=='loop'){
            			Ext.getCmp('InputPanel').add({
					    xtype:'textfield',
					    labelWidth: 150,
					    fieldLabel: '循环次数',
	        			value: theparameters[key].defaultValue,
	        			name: '__CYCLES__'
					    });
            		}else if(theparameters[key].type=='hidden'){
            			Ext.getCmp('InputPanel').add({
					    xtype:'textfield',
	        			anchor: '100%',
	        			hidden:true,
	        			value:theparameters[key].defaultValue,
	        			name:theparameters[key].name
					    });
            		}
            	}
            },
            failure: function(response, opts) {
            	Ext.Msg.alert("错误","表单内容请求失败");
             	console.log(response.responseText);
            }
         });
    }    
});
