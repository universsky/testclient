
Ext.define('MyApp.model.TestHistory', {
    extend: 'Ext.data.Model',
    idProperty:'time',
    fields: [
        {
            name: 'time',
            type: 'string'
        },
        {
            name: 'duration',
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
            field: 'result',
            min: 1
        }     
    ]
});