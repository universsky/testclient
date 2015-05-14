Ext.define('MyApp.store.FolderStore', {
	extend: 'Ext.data.TreeStore',
	storeId: 'FolderStore',
	root: {
        text: '根节点',
        id: 'root',
        path:'root',
        expanded: true
    }, 
    proxy: {
        type: 'ajax',
        api: {
            read: 'job/getFolderTree'                
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