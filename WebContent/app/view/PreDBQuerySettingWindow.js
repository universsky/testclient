var resultLabelText='';
var isSourceSelected;
var isSqlSetted;
var isSqlServer;
var inputuser="",inputpwd="";
Ext.define('MyApp.view.PreDBQuerySettingWindow', {
    extend: 'Ext.window.Window',
    alias: 'widget.PreDBQuerySettingWindow',
    id: 'PreDBQuerySettingWindow',
    height: 510,
    width: 430,
    title: '数据库查询设置',
    modal:true,
    resizable:false,
    initComponent: function() {
        var me = this;
        Ext.applyIf(me, {
	    	items: [
	    	{
	    		xtype: 'tabpanel',
	    	   	id: 'PreDBQueryTabPanel',
	    	   	layout:{
    	    		type:'fit'
	    	    },
	    	    listeners:{
	    	    	'tabchange':function( tabPanel, newCard, oldCard, eOpts ){
	    	    		var tabName = newCard.title;
	    	    		switch(tabName)
	    	    		{
	    	    		case "连接设置":
	    	    			
	    	    			break;
	    	    		case "绑定设置":
	    	    			
	    	    			break;
	    	    		}
	    	    	}
	    	    },
	    	    activeTab:1,
	    	    items:[
	    	    {
					title:"连接设置",
					layout:{
   	    	    		type:'vbox'
   	    	    	},
					items:[
					{
						xtype:'form',
	    	    		id:'ConnectionSettingForm',
	    	    		url:'job/testDBConnection',
	    	    		height: 427,
	    	    		width: 425,
	    	    		items:[
						{
							xtype:'tbseparator',
							height: 30,
						},
						{
				   	    	xtype:'combobox',
				   	    	fieldLabel: '数据源',
				   	    	name: 'source',
				   	    	id:'SourceCombo',
				   	    	layout : 'auto',
				   	    	store:['sql server','mysql'],
				   	    	value:'[[source]]',
				   	    	editable:false,
				   	    	listeners :{
								'change':function(that, newValue, oldValue, eOpts){
									if(newValue!=''){
										isSourceSelected=true;
										switch(newValue){
			                    			case "sql server":
			                    				Ext.getCmp("PanelUserPwdContainsAuthentication").show();
			                    				Ext.getCmp("PanelUserPwd").hide();
			                    				Ext.ComponentQuery.query('#radioWinAuth')[0].checked=true;
			                    				Ext.ComponentQuery.query('#UsernameText')[0].setValue('');
												Ext.ComponentQuery.query('#PasswordText')[0].setValue('');
												Ext.ComponentQuery.query('#UsernameText')[0].setDisabled(true);
												Ext.ComponentQuery.query('#PasswordText')[0].setDisabled(true);
												Ext.ComponentQuery.query('#UsernameText')[1].setValue('');
			    	        			    	Ext.ComponentQuery.query('#PasswordText')[1].setValue('');
			                    				isSqlServer=true;
			                    				break;
			                    			case "mysql":
			                    				Ext.getCmp("PanelUserPwd").show();
			                    				Ext.getCmp("PanelUserPwdContainsAuthentication").hide();
			                    				Ext.ComponentQuery.query('#UsernameText')[1].setValue('[[username]]');
			    	        			    	Ext.ComponentQuery.query('#PasswordText')[1].setValue('[[password]]');
			    	        			    	Ext.ComponentQuery.query('#UsernameText')[0].setValue('');
			    	        			    	Ext.ComponentQuery.query('#PasswordText')[0].setValue('');
			                    				isSqlServer=false;
			                    				break;
			                    			default:
			                    				break;
		                        		}
									}else{
										isSourceSelected=false;
									}
									var color;
									if((isSourceSelected && isSqlSetted))
										color='green';
									else
										color='white';
									Ext.fly('SavePreDBQuerySettingBtn').setStyle({
		                				background:color
		                			});
									Ext.getCmp('SavePreDBQuerySettingBtn').disabled=!(isSourceSelected && isSqlSetted);
						    	}
							}
				   	    },
				   	    {
					    	xtype:'tbseparator',
					    	height: 20,
					    },
				   	    {
				   	    	xtype:'textfield',
				   	    	fieldLabel: 'Server',
				   	    	name: 'server',
				   	    	id:'ServerText',
				   	    	layout : 'auto',
				   	    	value:'[[server]]'
				   	    },
				   	    {
					    	xtype:'tbseparator',
					    	height: 20,
					    },
				   	    {
				   	    	xtype:'textfield',
				   	    	fieldLabel: 'Port',
				   	    	name: 'port',
				   	    	id:'PortText',
				   	    	layout : 'auto',
				   	    	value:'[[port]]',
				   	    },
				   	    {
					    	xtype:'tbseparator',
					    	height: 20,
					    },
					    {
					    	xtype:'panel',
					    	border:false,
					    	id:'PanelUserPwd',
					    	items:[
							{
								xtype:'textfield',
							   	fieldLabel: 'Username',
							   	name: 'username_mysql',
							   	itemId:'UsernameText',
							   	layout : 'auto',
							   	value:'[[username]]'
							},
							{
								xtype:'tbseparator',
								height: 10,
							},
							{
								xtype:'textfield',
								fieldLabel: 'Password',
								inputType:'password',
							   	name: 'password_mysql',
							   	itemId:'PasswordText',
							   	layout : 'auto',
							   	value:'[[password]]'
							}]
					    },
					    {
					    	xtype:'panel',
					    	border:false,
					    	hidden:true,
					    	id:'PanelUserPwdContainsAuthentication',
					    	items:[
							{
								xtype:'label',
								text:'验证方式：',
								height: 10,
							},
							{
								xtype:'radiogroup',
								layout:{
							   		type:'vbox'
							   	},
								items:[
								    new Ext.form.Radio({boxLabel:'Windows验证',labelSeparator:'', name:'at',inputValue:"0",checked:true,itemId:'radioWinAuth'}),
								    new Ext.form.Radio({boxLabel:'用户名密码验证',labelSeparator:'', name:'at',inputValue:"1"}),
								    new Ext.form.field.Text({
										fieldLabel: 'Username',
									   	name: 'username_sqlserver',
									   	itemId:'UsernameText',
									   	layout : 'auto',
									}),	
									new Ext.toolbar.Separator({height: 10}),
									new Ext.form.field.Text({
										fieldLabel: 'Password',
										inputType:'password',
									   	name: 'password_sqlserver',
									   	itemId:'PasswordText',
									   	layout : 'auto',
									}),	
								    
								],
								listeners :{
									'change':function(that, newValue, oldValue, eOpts){
										switch (parseInt(newValue.at))
										{
											case 0:
												Ext.ComponentQuery.query('#UsernameText')[0].setDisabled(true);
												Ext.ComponentQuery.query('#PasswordText')[0].setDisabled(true);
												Ext.ComponentQuery.query('#UsernameText')[0].setValue('');
												Ext.ComponentQuery.query('#PasswordText')[0].setValue('');
												break;
											case 1:
												Ext.ComponentQuery.query('#UsernameText')[0].setValue('[[username]]');
												Ext.ComponentQuery.query('#PasswordText')[0].setValue('[[password]]');
												Ext.ComponentQuery.query('#UsernameText')[0].setDisabled(false);
												Ext.ComponentQuery.query('#PasswordText')[0].setDisabled(false);
												break;
											default:
												break;
										}
							    	}
								}
							}]
					    },
				   	    {
					    	xtype:'tbseparator',
					    	height: 20,
					    },
				   	    {
				   	    	xtype:'textfield',
				   	    	fieldLabel: '数据库',
				   	    	name: 'database',
				   	    	id:'DatabaseText',
				   	    	layout : 'auto',
				   	    	value:'[[database]]'
				   	    },
				   	    {
				   	    	xtype:'textfield',
			        		hidden:true,
			        		value:Ext.getCmp('Base').folderName,
			        		name:'__HiddenView_path'
				   	    }]
					},  
	   	    	    {
	   	    	    	xtype:'panel',
	   	    	    	layout:{
	   	    	    		type:'hbox'
	   	    	    	},
	   	    	    	items:[{
	   	    	    		xtype:'button',
	   	    	    		layout : 'auto',
	   	    	    		text: '连接测试',
    	   	    	    	//id: 'TestConnectionButton',
    	   	    	    	handler: function(button, event) {
    	   	    	    		Ext.getCmp('ConnectionSettingForm').getForm().submit({
    	   	    	    			waitMsg:'执行中...',
                            		success:function(form,action){
                            			if(action.result.success){
                            				Ext.getCmp('ResultLabel').getEl().setStyle('background','green');
                            				Ext.getCmp('ResultLabel').getEl().update('Pass');
                            			}
                            			else{
                            				Ext.getCmp('ResultLabel').getEl().setStyle('background','red');
                            				Ext.getCmp('ResultLabel').getEl().update('Fail');
                            			}
                            		},
                            		failure:function(form,action){
                            			Ext.getCmp('ResultLabel').getEl().setStyle('background','red');
                            			Ext.getCmp('ResultLabel').setText('Fail');
                            		}
                            	});
                            }	
	   	    	    	},
	   	    	    	{
					    	xtype:'tbseparator',
					    	width: 20,
					    },
	   	    	    	{
	   	    	    		xtype:'label',
	   	    	    		id: 'ResultLabel',
	   	    	    		height:20,
	   	    	    		width: 40
	   	    	    	}]
					}]
				},
				{
	    	    	title:"绑定设置",
	    			items:[
					{
						xtype:'panel',
						height: 80,
						layout:{
	   	    	    		type:'fit'
	   	    	    	},
						items:[
						{
							xtype:'label',
							text:'sql query：',
						},    
						{
							xtype:'textarea',
							anchor: '100%',
							id:'SqlTextArea',
							listeners :{
								'change':function(that, newValue, oldValue, eOpts){
									if(newValue!=''){
										isSqlSetted=true;
									}else{
										isSqlSetted=false;
									}
									var color;
									if((isSourceSelected && isSqlSetted))
										color='green';
									else
										color='white';
									Ext.fly('SavePreDBQuerySettingBtn').setStyle({
		                				background:color
		                			});
									Ext.getCmp('SavePreDBQuerySettingBtn').disabled=!(isSourceSelected && isSqlSetted);
						    	}
							}
						}]
					},
					{
						xtype: 'button',
					    handler: function(button, event) {
					    	if(!isSqlServer){
                    			inputuser=Ext.ComponentQuery.query('#UsernameText')[1].getValue();
                    			inputpwd=Ext.ComponentQuery.query('#PasswordText')[1].getValue();
                    		}else{
                    			inputuser=Ext.ComponentQuery.query('#UsernameText')[0].getValue();
                    			inputpwd=Ext.ComponentQuery.query('#PasswordText')[0].getValue();
                    		}
					    	Ext.Ajax.request( {
								url : 'job/executeSqlQuery',
								params : {
									testPath : Ext.getCmp('Base').folderName,
									source : Ext.getCmp('SourceCombo').getValue(),
									server : Ext.getCmp('ServerText').getValue(),
									port : Ext.getCmp('PortText').getValue(),
									username : inputuser,
									password : inputpwd,
									database : Ext.getCmp('DatabaseText').getValue(),
									sql : Ext.getCmp('SqlTextArea').getValue()							  
								},
							    success : function(response, options) {
							    	var obj=JSON.parse(response.responseText).obj;
							    	Ext.getCmp('SqlReturnedRecordTextArea').setValue(obj.displayResultText);
							    	Ext.getStore('QueryBoundDataItem').removeAll();
							    	Ext.Ajax.request( {
										url : 'job/removeTempQueryBoundConfigFile',
										params : {  
											testPath : Ext.getCmp('Base').folderName,
											timestamp : Ext.getCmp('Base').timeStamp,
										},
									    success : function(response, options) {
									    },
									    failure: function(response, opts) {
							             	Ext.Msg.alert("删除临时文件.sqlquerybounddata出错");
							            }
									});
							    },
							    failure: function(response, opts) {
					             	Ext.Msg.alert("执行sql出错误");
					            }
							});
					    },
					    icon: 'image/execution.png',
					    tooltip: '执行'
					},
					{
						xtype:'panel',
						layout: {
					        type: 'fit'
						},
						height: 150,
						items:[
						{
							xtype:'label',
							text:'返回记录：',
						},
						{
							xtype: 'textarea',
							//anchor: '100%',
							id:'SqlReturnedRecordTextArea',
							//autoScroll:true
						}]
					},
					{
						xtype: 'gridpanel',
						id: 'QueryBoundDataGrid',
						height: 180,
						mode:'local',
					    autoFill : true,
					    store: 'QueryBoundDataItem',
					    stripeRows : true,
					    columns: [
						{ 
						    xtype: 'gridcolumn',
						    //id:'ParameterNamesCombo',
							flex:4,
						    dataIndex: 'name',
						    text: '请求参数',
						    editor: {
					            xtype: 'combobox',
					            id:'ParameterNameCombo',
					            editable:false,
					            allowBlank:false,
					            mode:'local',
					            store: Ext.getCmp('Base').TestParameterNamesStore,
					            triggerAction:'all',
					            forceSelection:true,
					            listeners: {
					            	expand: function(window, eOpts){
					            		Ext.getCmp('ParameterNameCombo').getStore().reload();
						            }
							    }
					        }
						},
						{
						    xtype: 'gridcolumn',
						    flex: 4,
						    dataIndex: 'reference',
						    text: '返回字段',
						    editor: {
						    	xtype: 'textfield',
					            allowBlank:false,
						    }
						},
						{
						    xtype: 'gridcolumn',
						    flex: 2,
						    dataIndex: 'rowIndex',
						    text: '行索引',
						    editor: {
						    	xtype: 'textfield',
						    	allowBlank:false,
						    	regex:/^[0-9]*[1-9][0-9]*$/,
						    	regexText:'行索引必须是>=1的数字',
						    }
						},
					    {
					        xtype: 'actioncolumn',
					        flex:1,
					        items: [
					            {
					                handler: function(view, rowIndex, colIndex, item, e, record, row) {
					                    Ext.MessageBox.confirm(
					                    "confirm",
					                    "确认删除？",
					                    function(e){
					                        if(e=='yes'){
					                            Ext.getStore('QueryBoundDataItem').removeAt(rowIndex);
					                            Ext.getStore('QueryBoundDataItem').sync();
					                        }
					                    }
					                    ); 
					                },
					                icon: 'image/delete.png',
					                tooltip: 'delete'
					            }
					        ]
					    }],
					    dockedItems: [
					    {
					        xtype: 'toolbar',
					        dock: 'top',
					        items: [
					        {
					            xtype: 'button',
					            handler: function(button, event) {
					                var store = Ext.getStore('QueryBoundDataItem');
					                store.insert(0,{});
					                var rowEdit = Ext.getCmp('QueryBoundDataGrid').getPlugin("QueryBoundDataItemEditPlugin");
					                rowEdit.startEdit(0,1); 
					            },
					            icon: 'image/add.png',
					            tooltip: '新增参数绑定'
					        },
					        {
					            xtype: 'tbseparator'
					        },
					        {
					            xtype: 'button',
					            handler: function(button, event) {
					                Ext.getStore('QueryBoundDataItem').load();
					            },
					            icon: 'image/refresh.png',
					            tooltip: '刷新'
					        }]
					    }],
					    plugins: [
					        Ext.create('Ext.grid.plugin.RowEditing', {
					            pluginId: 'QueryBoundDataItemEditPlugin',
					            autoCancel:true,
					            listeners: {
					                edit: {
					                    fn: function(editor, context, eOpts) {
					                        Ext.getStore('QueryBoundDataItem').sync({
					                            success:function(){
					                                Ext.getStore('QueryBoundDataItem').load();
					                            }
					                        });
					                    },
					                scope: me
					                }
					            }
					        })
					    ]
					},
					{
    	    			xtype: 'button',
    	    			id:'SavePreDBQuerySettingBtn',
                        handler: function(button, event) {
                        	if(Ext.getStore('QueryBoundDataItem').getTotalCount()>0){
                        		Ext.Ajax.request( {
    								url : 'job/getQueryBoundDataItemsString',
    								params : {  
    									testPath : Ext.getCmp('Base').folderName,
    									timestamp : Ext.getCmp('Base').timeStamp,
    								},
    							    success : function(response, options) {
    							    	var obj=JSON.parse(response.responseText).obj;
    							    	var setting = Ext.getCmp('SourceCombo').getValue()+"<EOF>";
    							    	setting += Ext.getCmp('ServerText').getValue()+"<EOF>";
    							    	setting += Ext.getCmp('PortText').getValue()+"<EOF>";
    							    	setting += inputuser+"<EOF>";
    							    	setting += inputpwd+"<EOF>";
    							    	setting += Ext.getCmp('DatabaseText').getValue()+"<EOF>";
    							    	setting += Ext.getCmp('SqlTextArea').getValue().replace(new RegExp("\n","gm"), " ")+"<EOF>";
    							    	setting += obj.toString();
    							    	Ext.getCmp("PreDBQuerySettingWindow").close();
    							    	Ext.getCmp("SettingStringTextField").setValue(setting);
    							    	Ext.Ajax.request( {
    										url : 'job/removeTempQueryBoundConfigFile',
    										params : {  
    											testPath : Ext.getCmp('Base').folderName,
    											timestamp : Ext.getCmp('Base').timeStamp,
    										},
    									    success : function(response, options) {
    									    },
    									    failure: function(response, opts) {
    							             	Ext.Msg.alert("删除临时文件.sqlquerybounddata出错");
    							            }
    									});
    							    },
    							    failure: function(response, opts) {
    					             	Ext.Msg.alert("getQueryBoundDataItemsString出错");
    					            }
    							});
                        	}else
                        		Ext.Msg.alert("警告","请添加配置！");
                        },
                        icon: 'image/save.png',
                        tooltip: '保存'
    	    		}]
	    	    }]
	    	}],
	    	listeners: {
				show: {
                    fn: function(window, eOpts){
                    	Ext.getStore('QueryBoundDataItem').proxy.extraParams.testPath=Ext.getCmp('Base').folderName;
                    	Ext.getStore('QueryBoundDataItem').proxy.extraParams.timestamp=Ext.getCmp('Base').timeStamp;
                    	Ext.getStore('QueryBoundDataItem').removeAll();
                    	isSourceSelected=true;
                    	isSqlSetted=false;
                    	Ext.getCmp('SavePreDBQuerySettingBtn').disabled=true;
                    },
                    scope: me
                }
			}
        });
        me.callParent(arguments);
    }
});