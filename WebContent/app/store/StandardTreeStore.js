Ext.define('MyApp.store.StandardTreeStore', {
	extend: 'Ext.data.TreeStore',
	storeId: 'StandardTreeStore',
    root: {
        text: '根节点',
        id: 'root',
        folderName:'root',
        expanded: true
    },
    proxy: {
        type: 'ajax',
        api: {
            //create: 'job/addNode',
            read: 'job/getTreeChildNodes',
            update: 'job/modifyNode',
            destroy: 'job/delNode'                
        },
        reader: {
            type: 'json',
            messageProperty: 'msg'
        },
        extraParams: {
            topPath: 'root'
        },
        afterRequest: function(request, success) {
            if(!success){
            	Console.log('错误',request.action+'操作失败');
                return;
            }
            else{
            	if(Ext.getCmp('Base').RootName && request.action=='read'){
            		var root=Ext.getStore('StandardTreeStore').getRootNode();
            		root.data.id=Ext.getCmp('Base').RootName;
            		root.data.text="根节点";
            		root.raw.id=Ext.getCmp('Base').RootName;
            		root.raw.folderName=Ext.getCmp('Base').RootName;
            		Ext.getStore('StandardTreeStore').setRootNode(root);
            	}	
            }
        }
    }
});
