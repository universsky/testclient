Ext.define('MyApp.store.TestSelectionTreeStore', {
	extend: 'Ext.data.TreeStore',
	storeId:"TestSelectionTreeStore",
    root: {
        text: '根节点',
        id: 'root',
        path:'root',
        expanded: true
    }, 
    proxy: {
        type: 'ajax',
        api: {
            read: 'job/gettree'                
        },
        reader: {
            type: 'json',
            messageProperty: 'msg'
        },
        extraParams:{
        	rootName:''
        }
    }
});