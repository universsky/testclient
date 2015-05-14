Ext.define('MyApp.model.TestCaseResult', {
    extend: 'Ext.data.Model',
	requires: ['Ext.data.UuidGenerator'],
	idgen: 'uuid',
    fields: [
        {
            name: 'id',
            type: 'string'
        },
        {
            name: 'test',
            type: 'string'
        },
        {
            name: 'result',
            type: 'string'
        },
        {
            name: 'total',
            type: 'string'
        },
        {
            name: 'passed',
            type: 'string'
        },
        {
            name: 'failed',
            type: 'string'
        },
        {
            name: 'rate',
            type: 'string'
        }
    ]
});