
Ext.define('MyApp.store.CheckPointResult', {
    extend: 'Ext.data.Store',

    requires: [
        'MyApp.model.CheckPoint'
    ],

    constructor: function(cfg) {
        var me = this;
        cfg = cfg || {};
        me.callParent([Ext.apply({
            model: 'MyApp.model.CheckPoint',
            storeId: 'CheckPointResult',
            pageSize: 9999,
            data:[],
            reader: {
                type: 'json',
                messageProperty: 'msg',
                root: 'rows'
            },
            writer: {
                type: 'json',
                allowSingle: false
            },            
//            data:[{"name":"检查点2","id":"2","type":"contain","result":"fail","checkInfo":"asdfasfafasdf\nasdfasdfasdfasdf\nasdfasfafasdf\nasdfasdfasdfasdfasdfasfafasdf\nasdfasdfasdfasdfasdfasfafasdf\nasdfasdfasdfasdfasdfasfafasdf\nasdfasdfasdfasdfasdfasfafasdf\nasdfasdfasdfasdfasdfasfafasdf\nasdfasdfasdfasdfasdfasfafasdf\nasdfasdfasdfasdfasdfasfafasdf\nasdfasdfasdfasdfasdfasfafasdf\nasdfasdfasdfasdfasdfasfafasdf\nasdfasdfasdfasdfasdfasfafasdf\nasdfasdfasdfasdfasdfasfafasdf\nasdfasdfasdfasdfasdfasfafasdf\nasdfasdfasdfasdfasdfasfafasdf\nasdfasdfasdfasdfasdfasfafasdf\nasdfasdfasdfasdf"},{"name":"检查点1","id":"1","type":"pattern","result":"fail","checkInfo":"body"}],
            sorters: {
                direction: 'ASC',
                property: 'result'
            }
        }, cfg)]);
    }
});