Ext.define('MyApp.view.RootPanel', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.RootPanel',
    id: 'RootPanel',
    initComponent: function() {
        var me = this;
        Ext.applyIf(me, {
        	items:[
        		{
        			xtype:'toolbar',
        			items:[

        				{
        					xtype:'button',
        					text:'过期清理',
        					//icon: 'image/clear.png',
                            tooltip: '过期执行记录清理',
        					handler:function(){
        						Ext.widget('PasswordConfirmationForHistoryFileClean').show();
        					}
        				},
        				{
					    	xtype:'tbseparator'
					    }
        			]
        		}
        	]
        });
        me.callParent(arguments);
    } 
});