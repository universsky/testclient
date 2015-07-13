var isTestSelected;
var selectedTestPath='';

Ext.define('MyApp.view.PreServiceSettingWindow', {
    extend: 'Ext.window.Window',
    alias: 'widget.PreServiceSettingWindow',
    id: 'PreServiceSettingWindow',
    height: 680,
    width: 500,
    layout: {
        type: 'vbox',
        align:'stretch'
	},
    title: '设置',
    modal:true,
    resizable:false,
    initComponent: function() {
        var me = this;
        Ext.applyIf(me, {
	    	items: [
	    	{
	    		xtype: 'treepanel',
	    		id:'PreServiceTree',
	    		title: '选择其它服务接口',
	    		flex: 10,
	    		store: 'PreServiceTreeStore',
	    		animate: true,
	    		frame: true,
	    		autoScroll: true,
	    	    border: false,
	    	    useArrows: true,
	    	    trackMouseOver: false,
	    	    lines: false,
	    	    rootVisible: false,
	    	    containerScroll: true,
	    	    listeners: {
	                itemmousedown : function (that, record, item, index, e, eOpts) {
	                	selectedTestPath = record.raw.folderName;
	                	if(record.raw.leaf){
	                		isTestSelected = true;
	                	}else{
	                		isTestSelected = false;
    	    			}
	                	Ext.getCmp('SavePreServiceSettingBtn').disabled=!isTestSelected;
	                },
	                beforeitemexpand : function ( node, eOpts ){
	                	if(node.childNodes.length==0){
	                		Ext.Ajax.request( {
		                		loadMask: true,
								url : 'job/getTreeChildNodes',
								params : {  
									topPath : Ext.getCmp('Base').RootName,
									node : node.raw.folderName
								},
							    success : function(response, options) {
							    	Ext.get(document.body).unmask(); 
							    	var arr=JSON.parse(response.responseText);
							    	var parts=arr[0].id.split(">");
							    	var id=arr[0].id.replace(">"+parts[parts.length-1],"");
							    	if(id.indexOf(">")>0){
							    		var node=Ext.getStore('PreServiceTreeStore').getNodeById(id);
								    	for(var i=0;i<arr.length;i++){
				                			node.appendChild(arr[i]);
								    	}
							    	}
							    },
							    failure: function(response, opts) {
							    	Ext.get(document.body).unmask(); 
					             	Ext.Msg.alert("获取直接子节点出错");
					            }
							});
	                	}
	                }
	            }
	    	},
	    	{
				text: '测试一下',
				xtype: 'button',
				handler:function(){
					if(Ext.String.endsWith(selectedTestPath,'-leaf') || Ext.String.endsWith(selectedTestPath,'-t')){
						if(selectedTestPath!=Ext.getCmp("Base").folderName){
							var lm = new Ext.LoadMask(Ext.getCmp('PreServiceSettingWindow'), { 
								msg : '执行中。。。', 
								removeMask : true
							}); 
							lm.show(); 
							Ext.Ajax.request( {
								url : 'job/getTestResponse',
								params : {  
									path : selectedTestPath
								},
							    success : function(response, options) {
							    	lm.hide();
							    	var object=JSON.parse(response.responseText);
							    	if(object.success){
							    		var res=object.obj;
								    	Ext.getCmp('ServiceResponseTextArea').setValue(res);
								    	Ext.getStore('ServiceBoundDataItem').removeAll();
								    	Ext.Ajax.request( {
											url : 'job/removeTempServiceBoundConfigFile',
											params : {  
												testPath : Ext.getCmp('Base').folderName,
												timestamp : Ext.getCmp('Base').timeStamp,
											},
										    success : function(response, options) {
										    },
										    failure: function(response, opts) {
								             	Ext.Msg.alert("删除临时文件.servicebounddata出错");
								            }
										});
							    	}else
							    		Ext.Msg.alert("错误",object.msg);
							    },
							    failure: function(response, opts) {
					             	Ext.Msg.alert("错误","获取响应失败");
					            }
							});
						}
						else
							Ext.Msg.alert("警告","不能引用自己！");
					}else
						Ext.Msg.alert("警告","请选择测试节点！");
				}
			},
	    	{	
				xtype:'panel',
				flex: 9,
				title:"响应内容",
				layout: {
			        type: 'fit'
				},
				items:[
					{
						xtype:"textarea",
						id:"ServiceResponseTextArea"
					}
				]
			},
	    	{
				xtype: 'gridpanel',
    			id: 'ServiceBoundDataGrid',
    			mode:'local',
    			flex: 9,
                autoFill : true,
                store: 'ServiceBoundDataItem',
                stripeRows : true,
                columns: [
				{
				    xtype: 'gridcolumn',
					flex:4,
				    dataIndex: 'name',
				    text: '请求参数',
				    editor: {
                        xtype: 'combobox',
                        editable:false,
                        allowBlank:false,
                        store: Ext.getCmp('Base').TestParameterNamesStore
                    }
				},
				{
				    xtype: 'gridcolumn',
				    flex: 5,
				    dataIndex: 'lb',
				    text: '左边界',
				    editor: {
				    	xtype: 'textfield',
                        allowBlank:false
				    },
				    renderer: function(value, metaData, record, rowIndex, colIndex, store, view) {
                    	return value.replace(new RegExp("<","gm"),"&lt;");
                    }
				},
				{
				    xtype: 'gridcolumn',
				    flex: 5,
				    dataIndex: 'rb',
				    text: '右边界',
				    editor: {
				    	xtype: 'textfield',
				    	allowBlank:false
				    },
				    renderer: function(value, metaData, record, rowIndex, colIndex, store, view) {
                    	return value.replace(new RegExp("<","gm"),"&lt;");
                    }
				},
				{
				    xtype: 'gridcolumn',
				    flex: 2,
				    dataIndex: 'times',
				    text: '出现次数',
				    editor: {
				    	xtype: 'textfield',
				    	allowBlank:false,
				    	regex:/^[0-9]*[1-9][0-9]*$/,
				    	regexText:'必须是>=1的数字',
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
                                    Ext.getStore('ServiceBoundDataItem').removeAt(rowIndex);
                                    Ext.getStore('ServiceBoundDataItem').sync();
                                }
                            }
                            ); 
                        },
                        icon: 'image/delete.png',
                        tooltip: 'delete'
                    }]
                }                  
                ],
                dockedItems: [
                {
                    xtype: 'toolbar',
                    dock: 'top',
                    items: [
                    {
                        xtype: 'button',
                        handler: function(button, event) {
                            var store = Ext.getStore('ServiceBoundDataItem');
                            store.insert(0,{});
                            var rowEdit = Ext.getCmp('ServiceBoundDataGrid').getPlugin("ServiceBoundDataItemEditPlugin");
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
                            Ext.getStore('ServiceBoundDataItem').load();
                        },
                        icon: 'image/refresh.png',
                        tooltip: '刷新'
                    }]
                }],
                plugins: [
                    Ext.create('Ext.grid.plugin.RowEditing', {
                        pluginId: 'ServiceBoundDataItemEditPlugin',
                        autoCancel:true,
                        listeners: {
                        	edit: {
			                    fn: function(editor, context, eOpts) {
			                        Ext.getStore('ServiceBoundDataItem').sync({
			                            success:function(){
			                                Ext.getStore('ServiceBoundDataItem').load();
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
    			id:'SavePreServiceSettingBtn',
                handler: function(button, event) {
                	if(Ext.getStore('ServiceBoundDataItem').getTotalCount()>0){
                		Ext.Ajax.request( {
    						url : 'job/getServiceBoundDataItemsString',
    						params : {  
    							testPath : Ext.getCmp('Base').folderName,
    							timestamp : Ext.getCmp('Base').timeStamp,
    						},
    					    success : function(response, options) {
    					    	var obj=JSON.parse(response.responseText).obj;
    					    	var setting = selectedTestPath+"<EOF>";
    					    	setting += obj.toString();
    					    	Ext.getCmp("PreServiceSettingWindow").close();
    					    	Ext.getCmp("SettingStringTextField").setValue(setting);
    					    	Ext.Ajax.request( {
    								url : 'job/removeTempServiceBoundConfigFile',
    								params : {  
    									testPath : Ext.getCmp('Base').folderName,
    									timestamp : Ext.getCmp('Base').timeStamp,
    								},
    							    success : function(response, options) {
    							    },
    							    failure: function(response, opts) {
    					             	Ext.Msg.alert("删除临时文件.servicebounddata出错");
    					            }
    							});
    					    },
    					    failure: function(response, opts) {
    			             	Ext.Msg.alert("getServiceBoundDataItemsString出错");
    			            }
    					});
                	}else
                		Ext.Msg.alert("警告","请添加配置！");
                },
                icon: 'image/save.png',
                tooltip: '保存'
    		}],
	    	listeners: {
				show: {
                    fn: function(window, eOpts){
                    	Ext.getStore('ServiceBoundDataItem').proxy.extraParams.testPath=Ext.getCmp('Base').folderName;
                    	Ext.getStore('ServiceBoundDataItem').proxy.extraParams.timestamp=Ext.getCmp('Base').timeStamp;
                    	Ext.getStore('ServiceBoundDataItem').removeAll();
                    	isTestSelected=false;
                    	Ext.getCmp('SavePreServiceSettingBtn').disabled=true;
                    },
                    scope: me
                }
			}
        });
        me.callParent(arguments);
    },
});
