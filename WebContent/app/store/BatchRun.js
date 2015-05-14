Ext.define('MyApp.store.BatchRun', {
    extend: 'Ext.data.Store',

    requires: [
        'MyApp.model.BatchRun'
    ],

    constructor: function(cfg) {
        var me = this;
        cfg = cfg || {};
        me.callParent([Ext.apply({
            model: 'MyApp.model.BatchRun',
            storeId: 'BatchRun',
            pageSize: 9999,
            proxy: {
                type: 'ajax',
                afterRequest: function(request, success) {
                    if(!success){
                        Ext.Msg.alert('错误','BatchRun操作失败');
                        return;
                    }
                },
                api: {
                	read: 'job/getBatchHistories',
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