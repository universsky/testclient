
Ext.define('MyApp.store.TestHistory', {
    extend: 'Ext.data.Store',

    requires: [
        'MyApp.model.TestHistory'
    ],

    constructor: function(cfg) {
        var me = this;
        cfg = cfg || {};
        me.callParent([Ext.apply({
            model: 'MyApp.model.TestHistory',
            storeId: 'TestHistory',
            pageSize: 99999,
            proxy: {
                type: 'ajax',
                afterRequest: function(request, success) {
                    if(!success){
                        Ext.Msg.alert('错误','TestHistory操作失败');
                        return;
                    }
                },
                api: {
                    read: 'job/getHistories',
                    destroy: 'job/deleteHistory'
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
                direction: 'DESC',
                property: 'time'
            }
        }, cfg)]);
    }
});