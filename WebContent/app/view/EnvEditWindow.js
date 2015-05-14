Ext.define('MyApp.view.EnvEditWindow', {
    extend: 'Ext.window.Window',
    alias: 'widget.EnvEditWindow',
    height: 500,
    id: 'EnvEditWindow',
    modal:true,
    width: 400,
    layout: {
        type: 'fit'
    },
    title: '编辑环境变量',
    resizable:false,
    initComponent: function() {
        var me = this;
        Ext.applyIf(me, {
        	items:[
        		{
        			xtype:'form',
        			id:"EnvEditForm",
        			items:[
        				{
        					xtype:'textarea',
        					anchor: '100% 84%',
        					fieldLabel:'变量列表(key=value 每行一组)',
        					name: 'var'
        				},
        				{
	                    	xtype: 'label',
	                    	anchor: '100% 15%',
	                    	html:'引用规则：[[变量名]]<br>适用范围：目录环境变量适用目录下所有测试，测试环境变量只对本测试有效。如在父子节点中均设有同名变量，则取子节点的变量值。',
	                    	style:'color:blue'
        				},
                        {
                            xtype: 'button',
                            anchor: '10% 5%',
                            handler: function(button, event) {
                            	Ext.getCmp('Base').saveEvn();
                            },
                            text: '保存'
                        }
        			]
        		}
        	]
        });
        me.callParent(arguments);
    }
});