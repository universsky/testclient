Ext.define('MyApp.model.TestItem', {
    extend: 'Ext.data.Model',
    idProperty:'time',
    fields: [
		{
		    name: 'name',
		    type: 'string'
		},
        {
            name: 'time',
            type: 'string'
        },
        {
            name: 'duration',
            type: 'string'
        },
        {
            name: 'status',
            type: 'string'
        }
    ],

    validations: [
        {
            type: 'length',
            field: 'status',
            min: 1
        }     
    ]
});