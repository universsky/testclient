Ext.define('MyApp.store.OutputParameterDataItem', {
    extend: 'Ext.data.Store',

    requires: [
        'MyApp.model.ServiceBoundDataItem'
    ],

    constructor: function(cfg) {
        var me = this;
        cfg = cfg || {};
        me.callParent([Ext.apply({
            model: 'MyApp.model.ServiceBoundDataItem',
            storeId: 'OutputParameterDataItem',
            pageSize: 9999,
            proxy: {
                type: 'ajax',
                afterRequest: function(request, success) {
                    if(!success){
                        Ext.Msg.alert('错误','OutputParameterDataItem操作失败');
                        return;
                    }
                },
                api: {
                    create: 'job/addOutputParameterDataItem',
                    read: 'job/getOutputParameterDataItems',
                    update: 'job/addOutputParameterDataItem',
                    destroy: 'job/deleteOutputParameterDataItem'
                },
                extraParams: {
                    testPath: '',
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