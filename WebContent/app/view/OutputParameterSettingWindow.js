Ext.define('MyApp.view.OutputParameterSettingWindow', {
    extend: 'Ext.window.Window',
    alias: 'widget.OutputParameterSettingWindow',
    id: 'OutputParameterSettingWindow',
    height: 550,
    width: 380,
    layout: {
        type: 'vbox',
        align:'stretch'
	},
    title: '输出变量设置',
    modal:true,
    resizable:false,
    initComponent: function() {
        var me = this;
        Ext.applyIf(me, {
	    	items: [
	    	{
	    		xtype: 'textarea',
	    		flex:10,
	    		id: 'RespondServiceTextArea',
	    	},
	    	{
				xtype: 'gridpanel',
    			id: 'OutParaDataGrid',
    			mode:'local',
    			flex: 6,
                autoFill : true,
                store: 'OutputParameterDataItem',
                stripeRows : true,
                columns: [
				{
				    xtype: 'gridcolumn',
					flex:3,
				    dataIndex: 'name',
				    text: '变量命名',
				    editor: {
                        xtype: 'textfield',
                        allowBlank:false,
                    }
				},
				{
				    xtype: 'gridcolumn',
				    flex: 4,
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
				    flex: 4,
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
				    flex: 3,
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
                                    Ext.getStore('OutputParameterDataItem').removeAt(rowIndex);
                                    Ext.getStore('OutputParameterDataItem').sync();
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
                            var store = Ext.getStore('OutputParameterDataItem');
                            store.insert(0,{});
                            var rowEdit = Ext.getCmp('OutParaDataGrid').getPlugin("OutputParameterDataItemEditPlugin");
                            rowEdit.startEdit(0,1); 
                        },
                        icon: 'image/add.png',
                        tooltip: '新增输出变量'
                    },
                    {
                        xtype: 'tbseparator'
                    },
                    {
                        xtype: 'button',
                        handler: function(button, event) {
                            Ext.getStore('OutputParameterDataItem').load();
                        },
                        icon: 'image/refresh.png',
                        tooltip: '刷新'
                    }]
                }],
                plugins: [
                    Ext.create('Ext.grid.plugin.RowEditing', {
                        pluginId: 'OutputParameterDataItemEditPlugin',
                        autoCancel:true,
                        listeners: {
                        	edit: {
			                    fn: function(editor, context, eOpts) {
			                        Ext.getStore('OutputParameterDataItem').sync({
			                            success:function(){
			                                Ext.getStore('OutputParameterDataItem').load();
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
                xtype: 'label',
                flex: 1,
                html:'引用规则：{{变量名}}<br>适用范围：本测试的后置sql动作或sql检查点中',
                style:'color:blue'
            }],
	    	listeners: {
	    		show: {
                    fn: function(window, eOpts){
                    	Ext.getStore('OutputParameterDataItem').proxy.extraParams.testPath=Ext.getCmp('Base').folderName;
                		Ext.getStore('OutputParameterDataItem').load();
                    	var lm = new Ext.LoadMask(Ext.getCmp('OutputParameterSettingWindow'), { 
							msg : '执行中。。。', 
							removeMask : true
						}); 
						lm.show();
                    	Ext.Ajax.request( {
							url : 'job/getTestResponse',  
							params : {  
								path : Ext.getCmp('Base').folderName
							},
						    success : function(response, options) {
						    	lm.hide();
						    	var object=JSON.parse(response.responseText);
						    	if(object.success){
						    		var res=object.obj;
							    	Ext.getCmp('RespondServiceTextArea').setValue(res);
						    	}else
						    		Ext.Msg.alert("错误",object.msg);
						    },
						    failure: function(response, opts) {
						    	lm.hide();
				             	Ext.Msg.alert("错误","获取响应失败");
				            }
						});
                    },
                    scope: me
                }
			}
        });
        me.callParent(arguments);
    }
});