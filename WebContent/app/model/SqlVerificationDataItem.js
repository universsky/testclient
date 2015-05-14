Ext.define('MyApp.model.SqlVerificationDataItem', {
    extend: 'Ext.data.Model',
	requires: ['Ext.data.UuidGenerator'],
	idgen: 'uuid',
    fields: [
        {
            name: 'id',
            type: 'string'
        },
        {
            name: 'column',
            type: 'string'
        },
        {
            name: 'rowIndex',
            type: 'string'
        },
        {
            name: 'comparedType',
            type: 'string'
        },
        {
            name: 'expectedValue',
            type: 'string'
        }
    ]
});