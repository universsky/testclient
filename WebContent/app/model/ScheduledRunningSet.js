Ext.define('MyApp.model.ScheduledRunningSet', {
    extend: 'Ext.data.Model',
    idProperty:'jobName',
    fields: [
		{
		    name: 'jobName',
		    type: 'string'
		},
        {
            name: 'cronExpression',
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
            field: 'cronExpression',
            min: 1,
        }
    ]
});