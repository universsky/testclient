Ext.define('MyApp.store.SelectingTreeStore', {
	extend: 'Ext.data.TreeStore',
	storeId:'SelectingTreeStore',
    root: {
        text: '根节点',
        id: 'root',
        folderName:'root',
        draggable: false, 
    },
    proxy: {
        type: 'ajax',
        api: {
            read: 'job/getSelectingTree',
        },
        reader: {
            type: 'json',
            messageProperty: 'msg'
        },
        extraParams: {
            rootName: ''
        }
    }
});