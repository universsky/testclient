Ext.define('MyApp.model.ServiceBoundDataItem', {
    extend: 'Ext.data.Model',
	requires: ['Ext.data.UuidGenerator'],
	idgen: 'uuid',
    fields: [
        {
            name: 'id',
            type: 'string'
        },
        {
            name: 'name',
            type: 'string'
        },
        {
            name: 'lb',
            type: 'string'
        },
        {
            name: 'rb',
            type: 'string'
        },
        {
            name: 'times',
            type: 'string'
        }
    ]
});