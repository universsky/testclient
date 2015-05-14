
Ext.define('MyApp.model.CheckPoint', {
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
            name: 'type',
            type: 'string'
        },
        {
            name: 'checkInfo',
            type: 'string'
        },
        {
            name: 'result',
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
            field: 'type',
            min: 1
        },
        {
            type: 'length',
            field: 'checkInfo',
            min: 1
        }      
    ]
});