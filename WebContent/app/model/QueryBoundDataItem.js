Ext.define('MyApp.model.QueryBoundDataItem', {
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
            name: 'reference',
            type: 'string'
        },
        {
            name: 'rowIndex',
            type: 'string'
        }
    ],

    validations: [
        {
            type: 'length',
            field: 'name',
            min: 1
        },
        {
            type: 'length',
            field: 'reference',
            min: 1
        }
    ]
});