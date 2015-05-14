Ext.define('MyApp.model.TestPassedRate', {
    extend: 'Ext.data.Model',
//	requires: ['Ext.data.UuidGenerator'],
//	idgen: 'uuid',
    fields: [
        {
            name: 'date',
            type: 'string'
        },
        {
            name: 'rate',
            type: 'double'
        }
    ]
});