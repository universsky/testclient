Ext.define('MyApp.store.SelectedTreeStore', {
    extend: 'Ext.data.TreeStore',

    constructor: function(cfg) {
        var me = this;
        cfg = cfg || {};
        me.callParent([Ext.apply({
            storeId: 'SelectedTreeStore',
            clearOnLoad : true,
            clearRemovedOnLoad:true,
            buffered: false,
            root: {
                text: '根节点',
                id: 'root',
                folderName:'root',
                draggable: false, 
            },
            proxy: {
            	type: 'ajax',
                api: {
                    read: 'job/getSelectedTree'                
                },
                reader: {
                    type: 'json',
                    messageProperty: 'msg'
                },
                extraParams:{
                	rootName:'',
                	testset:[]
                }
            }
        }, cfg)]);
    }
});