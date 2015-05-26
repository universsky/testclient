Ext.define('MyApp.store.PreServiceTreeStore', {
	extend: 'Ext.data.TreeStore',
	constructor: function(cfg) {
        var me = this;
        cfg = cfg || {};
        me.callParent([Ext.apply({
        	storeId:'PreServiceTreeStore',
            root: {
                text: '根节点',
                id: 'root',
                path:'root',
                expanded: true
            }, 
            proxy: {
                type: 'ajax',
                api: {
                    read: 'job/getTreeChildNodes'                
                },
                reader: {
                    type: 'json',
                    messageProperty: 'msg'
                },
                extraParams:{
                	topPath:''
                }
            },
            autoLoad:false,
            autoSync:false,
            clearOnLoad : true,
            clearRemovedOnLoad:true,
            buffered: true,
        }, cfg)]);
    }
});
