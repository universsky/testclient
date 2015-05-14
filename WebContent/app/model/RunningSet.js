Ext.define('MyApp.model.RunningSet', {
    extend: 'Ext.data.Model',
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
            name: 'author',
            type: 'string'
        }
    ]
});