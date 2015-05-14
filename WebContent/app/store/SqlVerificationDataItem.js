Ext.define('MyApp.store.SqlVerificationDataItem', {
    extend: 'Ext.data.Store',

    requires: [
        'MyApp.model.SqlVerificationDataItem'
    ],

    constructor: function(cfg) {
        var me = this;
        cfg = cfg || {};
        me.callParent([Ext.apply({
            model: 'MyApp.model.SqlVerificationDataItem',
            storeId: 'SqlVerificationDataItem',
            pageSize: 9999,
            proxy: {
                type: 'ajax',
                afterRequest: function(request, success) {
                    if(!success){
                        Ext.Msg.alert('错误','SqlVerificationDataItem操作失败');
                        return;
                    }
                },
                api: {
                    create: 'job/addSqlVerificationDataItem',
                    read: 'job/getSqlVerificationDataItems',
                    update: 'job/addSqlVerificationDataItem',
                    destroy: 'job/deleteSqlVerificationDataItem'
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