Ext.define('MyApp.model.PreConfig', {
    extend: 'Ext.data.Model',
	requires: ['Ext.data.UuidGenerator'],
	idgen: 'uuid',
    fields: [
        {
            name: 'id',
            type: 'string'
        },
        {
            name: 'type',
            type: 'string'
        },
        {
            name: 'setting',
            type: 'string'
        }
    ],

    validations: [
        {
            type: 'length',
            field: 'setting',
            min: 1
        }     
    ]
});