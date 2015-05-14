Ext.define('MyApp.model.TestStatusDistribution', {
    extend: 'Ext.data.Model',
//	requires: ['Ext.data.UuidGenerator'],
//	idgen: 'uuid',
    fields: [
        {
            name: 'number',
            type: 'string'
        },
        {
            name: 'status',
            type: 'string'
        }
    ]
});