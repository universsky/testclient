var resultLabelText='';
var isSourceSelected;
var isSqlSetted;
var isSqlServer;
var inputuser="",inputpwd="";
Ext.define('MyApp.view.SqlVerificationSettingWindow', {
    extend: 'Ext.window.Window',
    alias: 'widget.SqlVerificationSettingWindow',
    id: 'SqlVerificationSettingWindow',
    height: 530,
    width: 470,
    title: '数据落库验证设置',
    modal:true,
    resizable:false,
    initComponent: function() {
        var me = this;
        Ext.applyIf(me, {
	    	items: [
	    	{
	    		xtype: 'tabpanel',
	    	   	//id: 'SqlVerificationTabPanel',
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
		    	    		case "验证设置":
		    	    			
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
	    	    		id:'SqlConnectionSettingForm',
	    	    		url:'job/testDBConnection',
	    	    		height: 447,
	    	    		width: 465,
	    	    		items:[
						{
							xtype:'tbseparator',
							height: 30,
						},
						{
				   	    	xtype:'combobox',
				   	    	fieldLabel: '数据源',
				   	    	name: 'source',
				   	    	id:'SqlSourceCombo',
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
			                    				Ext.getCmp("PanelUserNPwdContainsAuthentication").show();
			                    				Ext.getCmp("PanelUserNPwd").hide();
			                    				Ext.ComponentQuery.query('#radiobtnWindowAuth')[0].checked=true;
			                    				Ext.ComponentQuery.query('#SqlUsernameText')[0].setValue('');
												Ext.ComponentQuery.query('#SqlPasswordText')[0].setValue('');
												Ext.ComponentQuery.query('#SqlUsernameText')[0].setDisabled(true);
												Ext.ComponentQuery.query('#SqlPasswordText')[0].setDisabled(true);
												Ext.ComponentQuery.query('#SqlUsernameText')[1].setValue('');
			    	        			    	Ext.ComponentQuery.query('#SqlPasswordText')[1].setValue('');
			                    				isSqlServer=true;
			                    				break;
			                    			case "mysql":
			                    				Ext.getCmp("PanelUserNPwd").show();
			                    				Ext.getCmp("PanelUserNPwdContainsAuthentication").hide();
			                    				Ext.ComponentQuery.query('#SqlUsernameText')[1].setValue('[[username]]');
			    	        			    	Ext.ComponentQuery.query('#SqlPasswordText')[1].setValue('[[password]]');
			    	        			    	Ext.ComponentQuery.query('#SqlUsernameText')[0].setValue('');
			    	        			    	Ext.ComponentQuery.query('#SqlPasswordText')[0].setValue('');
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
									Ext.fly('SaveSqlVerificationSettingBtn').setStyle({
		                				background:color
		                			});
									Ext.getCmp('SaveSqlVerificationSettingBtn').disabled=!(isSourceSelected && isSqlSetted);
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
				   	    	id:'ServerAddressText',
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
				   	    	id:'SqlPortText',
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
					    	id:'PanelUserNPwd',
					    	items:[
							{
								xtype:'textfield',
							   	fieldLabel: 'Username',
							   	name: 'username_mysql',
							   	itemId:'SqlUsernameText',
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
							   	itemId:'SqlPasswordText',
							   	layout : 'auto',
							   	value:'[[password]]'
							}]
					    },
					    {
					    	xtype:'panel',
					    	border:false,
					    	hidden:true,
					    	id:'PanelUserNPwdContainsAuthentication',
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
								    new Ext.form.Radio({boxLabel:'Windows验证',labelSeparator:'', name:'at',inputValue:"0",checked:true,itemId:'radiobtnWindowAuth'}),
								    new Ext.form.Radio({boxLabel:'用户名密码验证',labelSeparator:'', name:'at',inputValue:"1"}),
								    new Ext.form.field.Text({
										fieldLabel: 'Username',
									   	name: 'username_sqlserver',
									   	itemId:'SqlUsernameText',
									   	layout : 'auto',
									}),	
									new Ext.toolbar.Separator({height: 10}),
									new Ext.form.field.Text({
										fieldLabel: 'Password',
										inputType:'password',
									   	name: 'password_sqlserver',
									   	itemId:'SqlPasswordText',
									   	layout : 'auto',
									}),	
								],
								listeners :{
									'change':function(that, newValue, oldValue, eOpts){
										switch (parseInt(newValue.at))
										{
											case 0:
												Ext.ComponentQuery.query('#SqlUsernameText')[0].setDisabled(true);
												Ext.ComponentQuery.query('#SqlPasswordText')[0].setDisabled(true);
												Ext.ComponentQuery.query('#SqlUsernameText')[0].setValue('');
												Ext.ComponentQuery.query('#SqlPasswordText')[0].setValue('');
												break;
											case 1:
												Ext.ComponentQuery.query('#SqlUsernameText')[0].setValue('[[username]]');
												Ext.ComponentQuery.query('#SqlPasswordText')[0].setValue('[[password]]');
												Ext.ComponentQuery.query('#SqlUsernameText')[0].setDisabled(false);
												Ext.ComponentQuery.query('#SqlPasswordText')[0].setDisabled(false);
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
				   	    	id:'SqlDatabaseText',
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
    	   	    	    	//id: 'SqlConnectionTestButton',
    	   	    	    	handler: function(button, event) {
    	   	    	    		Ext.getCmp('SqlConnectionSettingForm').getForm().submit({
    	   	    	    			waitMsg:'执行中...',
                            		success:function(form,action){
                            			if(action.result.success){
                            				Ext.getCmp('TestResultLabel').getEl().setStyle('background','green');
                            				Ext.getCmp('TestResultLabel').getEl().update('Pass');
                            			}
                            			else{
                            				Ext.getCmp('TestResultLabel').getEl().setStyle('background','red');
                            				Ext.getCmp('TestResultLabel').getEl().update('Fail');
                            			}
                            		},
                            		failure:function(form,action){
                            			Ext.getCmp('TestResultLabel').getEl().setStyle('background','red');
                            			Ext.getCmp('TestResultLabel').setText('Fail');
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
	   	    	    		id: 'TestResultLabel',
	   	    	    		height:20,
	   	    	    		width: 40
	   	    	    	}]
					}]
				},
				{
	    	    	title:"验证设置",
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
							id:'VerifiedSqlTextArea',
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
									Ext.fly('SaveSqlVerificationSettingBtn').setStyle({
		                				background:color
		                			});
									Ext.getCmp('SaveSqlVerificationSettingBtn').disabled=!(isSourceSelected && isSqlSetted);
						    	}
							}
						}]
					},
					{
						xtype: 'button',
					    handler: function(button, event) {
					    	if(!isSqlServer){
                    			inputuser=Ext.ComponentQuery.query('#SqlUsernameText')[1].getValue();
                    			inputpwd=Ext.ComponentQuery.query('#SqlPasswordText')[1].getValue();
                    		}else{
                    			inputuser=Ext.ComponentQuery.query('#SqlUsernameText')[0].getValue();
                    			inputpwd=Ext.ComponentQuery.query('#SqlPasswordText')[0].getValue();
                    		}
					    	Ext.Ajax.request( {
								url : 'job/executeSqlQueryAfterResponse',
								params : {
									testPath : Ext.getCmp('Base').folderName,
									source : Ext.getCmp('SqlSourceCombo').getValue(),
									server : Ext.getCmp('ServerAddressText').getValue(),
									port : Ext.getCmp('SqlPortText').getValue(),
									username : inputuser,
									password : inputpwd,
									database : Ext.getCmp('SqlDatabaseText').getValue(),
									sql : Ext.getCmp('VerifiedSqlTextArea').getValue()							  
								},
							    success : function(response, options) {
							    	var obj=JSON.parse(response.responseText).obj;
							    	Ext.getCmp('SqlReturnedTextArea').setValue(obj.displayResultText);
							    	Ext.getStore('SqlVerificationDataItem').removeAll();
							    	Ext.Ajax.request( {
										url : 'job/removeTempSqlVerificationConfigFile',
										params : {
											testPath : Ext.getCmp('Base').folderName,
											timestamp : Ext.getCmp('Base').timeStamp,
										},
									    success : function(response, options) {
									    },
									    failure: function(response, opts) {
							             	Ext.Msg.alert("删除临时文件.sqlverificationdata出错");
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
						height: 170,
						items:[
						{
							xtype:'label',
							text:'返回记录：'
						},
						{
							xtype: 'textarea',
							id:'SqlReturnedTextArea',
							autoScroll:true
						}]
					},
					{
						xtype: 'gridpanel',
						id: 'SqlVerificationDataGrid',
						height: 180,
						mode:'local',
					    autoFill : true,
					    store: 'SqlVerificationDataItem',
					    stripeRows : true,
					    columns: [
						{
						    xtype: 'gridcolumn',
						    flex: 6,
						    dataIndex: 'column',
						    text: '被测字段',
						    editor: {
						    	xtype: 'textfield',
					            allowBlank:false,
						    }
						},
						{
						    xtype: 'gridcolumn',
						    flex: 4,
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
						    xtype: 'gridcolumn',
						    //id:'ComparedTypeCombobox',
							flex:8,
						    dataIndex: 'comparedType',
						    text: '比较类型',
						    editor: {
					            xtype: 'combobox',
					            id:'ComparedTypeCombo',
					            editable:false,
					            allowBlank:false,
					            mode:'local',
					            store: ['equal','contain','pattern','equalFromResponse'],
					            triggerAction:'all',
					            forceSelection:true,
					            listeners :{
					            	'change': function(that, newValue, oldValue, eOpts){
	                            		if(newValue=='equalFromResponse'){
	                            			Ext.widget('ShrinkResponseStringWindow').show();
	                            		}
	                            	}
					            }
					        }
						},
						{
						    xtype: 'gridcolumn',
						    flex: 7,
						    dataIndex: 'expectedValue',
						    text: '预期值',
						    editor: {
						    	xtype: 'textfield',
						    	id:'ExpectedValueToBeChecked',
					            allowBlank:false,
						    },
						    renderer: function(value, metaData, record, rowIndex, colIndex, store, view) {
                            	return value.replace(new RegExp("<","gm"),"&lt;");
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
					                            Ext.getStore('SqlVerificationDataItem').removeAt(rowIndex);
					                            Ext.getStore('SqlVerificationDataItem').sync();
					                        }
					                    }); 
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
					                var store = Ext.getStore('SqlVerificationDataItem');
					                store.insert(0,{});
					                var rowEdit = Ext.getCmp('SqlVerificationDataGrid').getPlugin("SqlVerificationDataItemEditPlugin");
					                rowEdit.startEdit(0,1); 
					            },
					            icon: 'image/add.png',
					            tooltip: '新增数据验证'
					        },
					        {
					            xtype: 'tbseparator'
					        },
					        {
					            xtype: 'button',
					            handler: function(button, event) {
					                Ext.getStore('SqlVerificationDataItem').load();
					            },
					            icon: 'image/refresh.png',
					            tooltip: '刷新'
					        }]
					    }],
					    plugins: [
					        Ext.create('Ext.grid.plugin.RowEditing', {
					            pluginId: 'SqlVerificationDataItemEditPlugin',
					            autoCancel:true,
					            listeners: {
					                edit: {
					                    fn: function(editor, context, eOpts) {
					                        Ext.getStore('SqlVerificationDataItem').sync({
					                            success:function(){
					                                Ext.getStore('SqlVerificationDataItem').load();
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
    	    			id:'SaveSqlVerificationSettingBtn',
                        handler: function(button, event) {
                        	if(Ext.getStore('SqlVerificationDataItem').getTotalCount()>0){
                        		Ext.Ajax.request( {
    								url : 'job/getSqlVerificationDataItemsString',
    								params : {  
    									testPath : Ext.getCmp('Base').folderName,
    									timestamp : Ext.getCmp('Base').timeStamp,
    								},
    							    success : function(response, options) {
    							    	var obj=JSON.parse(response.responseText).obj;
    							    	var setting = Ext.getCmp('SqlSourceCombo').getValue()+"<EOF>";
    							    	setting += Ext.getCmp('ServerAddressText').getValue()+"<EOF>";
    							    	setting += Ext.getCmp('SqlPortText').getValue()+"<EOF>";
    							    	if(!isSqlServer){
    		                    			inputuser=Ext.ComponentQuery.query('#SqlUsernameText')[1].getValue();
    		                    			inputpwd=Ext.ComponentQuery.query('#SqlPasswordText')[1].getValue();
    		                    		}else{
    		                    			inputuser=Ext.ComponentQuery.query('#SqlUsernameText')[0].getValue();
    		                    			inputpwd=Ext.ComponentQuery.query('#SqlPasswordText')[0].getValue();
    		                    		}
    							    	setting += inputuser+"<EOF>";
    							    	setting += inputpwd+"<EOF>";
    							    	setting += Ext.getCmp('SqlDatabaseText').getValue()+"<EOF>";
    							    	setting += Ext.getCmp('VerifiedSqlTextArea').getValue()+"<EOF>";
    							    	setting += obj.toString();
    							    	Ext.getCmp("CheckInfoTextArea").setValue(setting);
    							    	Ext.getCmp("SqlVerificationSettingWindow").close();
    							    	Ext.Ajax.request( {
    										url : 'job/removeTempSqlVerificationConfigFile',
    										params : {  
    											testPath : Ext.getCmp('Base').folderName,
    											timestamp : Ext.getCmp('Base').timeStamp,
    										},
    									    success : function(response, options) {
    									    },
    									    failure: function(response, opts) {
    							             	Ext.Msg.alert("删除临时文件.dbverificationbounddata出错");
    							            }
    									});
    							    },
    							    failure: function(response, opts) {
    					             	Ext.Msg.alert("getSqlVerificationDataItemsString出错");
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
                    	Ext.getStore('SqlVerificationDataItem').proxy.extraParams.testPath=Ext.getCmp('Base').folderName;
                    	Ext.getStore('SqlVerificationDataItem').proxy.extraParams.timestamp=Ext.getCmp('Base').timeStamp;
                    	Ext.getStore('SqlVerificationDataItem').load();
                    	isSourceSelected=true;
                    	isSqlSetted=false;
                    	Ext.getCmp('SaveSqlVerificationSettingBtn').disabled=true;
                    },
                    scope: me
                }
			}
        });
        me.callParent(arguments);
    }
});