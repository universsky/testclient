Ext.define('MyApp.model.BatchRun', {
    extend: 'Ext.data.Model',
    idProperty:'time',
    fields: [
        {
            name: 'time',
            type: 'string'
        }
    ]
});