Ext.define('MyApp.view.MixActionSettingWindow', {
    extend: 'Ext.window.Window',
    alias: 'widget.MixActionSettingWindow',
    id: 'MixActionSettingWindow',
    modal:true,
    height: 360,
    width: 600,
    autoScroll: true,
    resizable:false,
    layout: {
        type: 'fit'
    },
    title: '混合动作设置',

    initComponent: function() {
        var me = this;
        Ext.applyIf(me, {
            items: [
            {
                xtype: 'gridpanel',
                id: 'SettingGrid',
                autoFill : true,
                store: 'MixActionSetting',
                stripeRows : true,
                columns: [
                {
					xtype: 'gridcolumn',
				    dataIndex: 'id',
				    hidden:true
				},
              	{
              		xtype: 'gridcolumn',
 					flex:10,
 				    dataIndex: 'description',
 				    text: '步骤描述',
	 				editor: {
				    	xtype: 'textfield',
				    	allowBlank:false,
	 				}
              	},
				{
				    xtype: 'gridcolumn',
					flex:6,
				    dataIndex: 'type',
				    text: '动作类型',
				    editor: {
                        xtype: 'combobox',
                        editable:false,
                        allowBlank:false,
                        valueField:'name',
                        displayField:'value',
                        store: Ext.create('Ext.data.ArrayStore',{
                        	fields:['name','value'],
                        	data: [['service','service'],['sql','sql']]
                        }),
                        listeners: {
                        	'change': function(that, newValue, oldValue, eOpts){
                        		Ext.getCmp('MainPanel').MixAction=true;
                        		switch(newValue){
	                    			case "service":
	                    				Ext.getStore('ServiceActionTreeStore').proxy.extraParams.topPath=Ext.getCmp('Base').RootName;
		        						Ext.getStore('ServiceActionTreeStore').load();
		        						Ext.widget('ServiceActionWindow').show();	
	                    				break;
	                    			case "sql":
	                    				Ext.widget('SqlActionSettingWindow').show();
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
				    flex: 20,
				    dataIndex: 'setting',
				    text: '设置',
				    editor: {
				    	id:'SettingTextField',
                        xtype: 'textfield',
                        allowBlank:false,
                        height:100
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
                                        Ext.getStore('MixActionSetting').removeAt(rowIndex);
                                        Ext.getStore('MixActionSetting').sync();
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
	                            var store = Ext.getStore('MixActionSetting');
	                            store.insert(0,{});
	                            var rowEdit = Ext.getCmp('SettingGrid').getPlugin("MixSettingPlugin");
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
	                        	Ext.getStore('MixActionSetting').proxy.extraParams.testPath=Ext.getCmp('Base').folderName;
	                        	Ext.getStore('MixActionSetting').proxy.extraParams.action=Ext.getCmp('MainPanel').ActionType=='setup' ? 'init':'end';
	                            Ext.getStore('MixActionSetting').load();
	                        },
	                        icon: 'image/refresh.png',
	                        tooltip: '刷新'
	                    }
	                ]
                }],
                plugins: [
                    Ext.create('Ext.grid.plugin.RowEditing', {
                        pluginId: 'MixSettingPlugin',
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
        Ext.getStore('MixActionSetting').sync({
            success:function(){
                Ext.getStore('MixActionSetting').load();
            }
        });
    },
    
    onWindowShow: function(window, eOpts) {
    	Ext.getStore('MixActionSetting').proxy.extraParams.testPath=Ext.getCmp('Base').folderName;
    	Ext.getStore('MixActionSetting').proxy.extraParams.action=Ext.getCmp('MainPanel').ActionType=='setup' ? 'init':'end';
		Ext.getStore('MixActionSetting').load();
    }
    
});
