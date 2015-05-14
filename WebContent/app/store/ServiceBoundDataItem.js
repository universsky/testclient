Ext.define('MyApp.store.ServiceBoundDataItem', {
    extend: 'Ext.data.Store',

    requires: [
        'MyApp.model.ServiceBoundDataItem'
    ],

    constructor: function(cfg) {
        var me = this;
        cfg = cfg || {};
        me.callParent([Ext.apply({
            model: 'MyApp.model.ServiceBoundDataItem',
            storeId: 'ServiceBoundDataItem',
            pageSize: 9999,
            proxy: {
                type: 'ajax',
                afterRequest: function(request, success) {
                    if(!success){
                        Ext.Msg.alert('错误','ServiceBoundDataItem操作失败');
                        return;
                    }
                },
                api: {
                    create: 'job/addServiceBoundDataItem',
                    read: 'job/getServiceBoundDataItems',
                    update: 'job/addServiceBoundDataItem',
                    destroy: 'job/deleteServiceBoundDataItem'
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