//Ext.define('MyApp.view.SettingCombo', {
//	extend: 'Ext.form.TriggerField',
//	alias: 'widget.SettingCombo',
//	id: 'SettingCombo',
//	queryModel:'local',  
//    forceSelection: true, 
//    editable:true,
//    selectOnFocus:false,  
//    allowBlank:false,  
//    afterLabelTextTpl:'<span style="color:red;font-weight:bold" data-qtip="必填字段">*</span>',
//    onTriggerClick: function () {
//    	switch(selectedtype){
//			case "service":
//				Ext.getCmp('Base').timeStamp=new Date().getTime();
//				Ext.widget("PreServiceSettingWindow").show();
//				break;
//			case "query":
//				Ext.getCmp('Base').timeStamp=new Date().getTime();
//				Ext.widget("PreDBQuerySettingWindow").show();
//				break;
//			default:
//				Ext.Msg.alert('警告','请选择一个类型');
//				break;
// 	    }
//    }
// });

Ext.define('MyApp.view.PreConfigurationWindow', {
    extend: 'Ext.window.Window',
    alias: 'widget.PreConfigurationWindow',
    id: 'PreConfigurationWindow',
    modal:true,
    height: 360,
    width: 450,
    autoScroll: true,
    resizable:false,
    layout: {
        type: 'fit'
    },
    title: '前置数据设置',

    initComponent: function() {
        var me = this;
        Ext.applyIf(me, {
            items: [
            {
                xtype: 'gridpanel',
                id: 'SettingsGrid',
                autoFill : true,
                store: 'PreConfig',
                stripeRows : true,
                columns: [
				{
				    xtype: 'gridcolumn',
					flex:4,
				    dataIndex: 'type',
				    text: '前置类型',
				    editor: {
                        xtype: 'combobox',
                        id: 'PreTypeCombo',
                        editable:false,
                        allowBlank:false,
                        valueField:'name',
                        displayField:'value',
                        store: Ext.create('Ext.data.ArrayStore',{
                        	fields:['name','value'],
                        	data: [['service','其它服务接口'],['query','数据库查询']]
                        }),
                        listeners: {
                        	'change': function(that, newValue, oldValue, eOpts){
                        		Ext.getCmp('Base').timeStamp=new Date().getTime();
                        		switch(newValue){
	                    			case "service":
	                    				Ext.getStore('PreServiceTreeStore').proxy.extraParams.rootName=Ext.getCmp('Base').RootName
	                    				Ext.getStore('PreServiceTreeStore').load();
	                    				Ext.widget("PreServiceSettingWindow").show();
	                    				break;
	                    			case "query":
	                    				Ext.widget("PreDBQuerySettingWindow").show();
	                    				break;
	                    			default:
	                    				Ext.Msg.alert('警告','请选择一个类型');
	                    				break;
                        		}
                        	}
                        }
                    }
				},
				{
				    xtype: 'gridcolumn',
				    flex: 12,
				    dataIndex: 'setting',
				    text: '设置',
				    editor: {
				    	id:'SettingStringTextField',
                        xtype: 'textfield',
                        allowBlank:false,
                    },
                    renderer: function(value, metaData, record, rowIndex, colIndex, store, view) {
                    	return value.replace(new RegExp("<","gm"),"&lt;");
                    }
				    //editor: Ext.widget('SettingCombo')
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
                                        Ext.getStore('PreConfig').removeAt(rowIndex);
                                        Ext.getStore('PreConfig').sync();
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
                            var store = Ext.getStore('PreConfig');
                            store.insert(0,{});
                            var rowEdit = Ext.getCmp('SettingsGrid').getPlugin("SettingEditPlugin");
                            rowEdit.startEdit(0,1); 
                        },
                        icon: 'image/add.png',
                        tooltip: '新增前置设置'
                    },
                    {
                        xtype: 'tbseparator'
                    },
                    {
                        xtype: 'button',
                        handler: function(button, event) {
                            Ext.getStore('PreConfig').load();
                        },
                        icon: 'image/refresh.png',
                        tooltip: '刷新'
                    }
                ]}
                ],
                plugins: [
                    Ext.create('Ext.grid.plugin.RowEditing', {
                        pluginId: 'SettingEditPlugin',
                        autoCancel:true,
                        listeners: {
                            edit: {
                                fn: me.onSettingEdit,
                                scope: me
                            }
                        }
                    })
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

    onSettingEdit: function(editor, context, eOpts) {
        Ext.getStore('PreConfig').sync({
            success:function(){
                Ext.getStore('PreConfig').load();
            }
        });
    },
    
    onWindowShow: function(window, eOpts) {
    	Ext.getStore('PreConfig').proxy.extraParams.testPath=Ext.getCmp('Base').folderName;
		Ext.getStore('PreConfig').load();
		Ext.Ajax.request( {
			url : 'job/getRequestParameterNames',  
			params : {  
				testPath : Ext.getCmp('Base').folderName,  
			},
		    success : function(response, options) {
		    	var json=JSON.parse(response.responseText);
		    	if(json.success){
		    		Ext.getCmp('Base').TestParameterNamesStore=json.obj;
		    	}else
		    		Ext.Msg.alert("错误","获取请求参数出错！");
		    },
		    failure: function(response, opts) {
		    	Ext.Msg.alert("错误","获取请求参数出错！");
            }
		});
    }
    
});