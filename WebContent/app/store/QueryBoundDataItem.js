Ext.define('MyApp.store.QueryBoundDataItem', {
    extend: 'Ext.data.Store',

    requires: [
        'MyApp.model.QueryBoundDataItem'
    ],

    constructor: function(cfg) {
        var me = this;
        cfg = cfg || {};
        me.callParent([Ext.apply({
            model: 'MyApp.model.QueryBoundDataItem',
            storeId: 'QueryBoundDataItem',
            pageSize: 9999,
            proxy: {
                type: 'ajax',
                afterRequest: function(request, success) {
                    if(!success){
                        Ext.Msg.alert('错误','QueryBoundDataItem操作失败');
                        return;
                    }
                },
                api: {
                    create: 'job/addQueryBoundDataItem',
                    read: 'job/getQueryBoundDataItems',
                    update: 'job/addQueryBoundDataItem',
                    destroy: 'job/deleteQueryBoundDataItem'
                },
                extraParams: {
                    testPath: '',
                    timestamp:'',
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
                property: 'id'
            }
        }, cfg)]);
    }
});