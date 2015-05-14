Ext.define('MyApp.store.CheckPoint', {
    extend: 'Ext.data.Store',

    requires: [
        'MyApp.model.CheckPoint'
    ],

    constructor: function(cfg) {
        var me = this;
        cfg = cfg || {};
        me.callParent([Ext.apply({
            model: 'MyApp.model.CheckPoint',
            storeId: 'CheckPoint',
            pageSize: 9999,
            proxy: {
                type: 'ajax',
                afterRequest: function(request, success) {
                    if(!success){
                        Ext.Msg.alert('错误','checkpoint操作失败');
                        return;
                    }
                },
                api: {
                    create: 'job/addCheckPoint',
                    read: 'job/getCheckPoint',
                    update: 'job/addCheckPoint',
                    destroy: 'job/deleteCheckPoint'
                },
                extraParams: {
                    folderName: ''
                },
                reader: {
                    type: 'json',
                    messageProperty: 'msg',
                    root: 'rows'
                },
                writer: {
                    type: 'json',
                    allowSingle: false
                }
            },
            sorters: {
                direction: 'ASC',
                property: 'name'
            }
        }, cfg)]);
    }
});