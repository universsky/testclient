Ext.define('MyApp.store.TestPassedRate', {
    extend: 'Ext.data.Store',

    requires: [
        'MyApp.model.TestPassedRate'
    ],

    constructor: function(cfg) {
        var me = this;
        cfg = cfg || {};
        me.callParent([Ext.apply({
            model: 'MyApp.model.TestPassedRate',
            storeId: 'TestPassedRate',
            //pageSize: 9999,
            proxy: {
                type: 'ajax',
                afterRequest: function(request, success) {
                    if(!success){
                        Ext.Msg.alert('错误','TestPassedRate操作失败');
                        return;
                    }
                },
                api: {
                    read: 'job/getTestPassedRateInAWeek',
                },
                extraParams: {
                	dirPath: '',
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
            }
        }, cfg)]);
    }
});
