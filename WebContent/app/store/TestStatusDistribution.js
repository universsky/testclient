Ext.define('MyApp.store.TestStatusDistribution', {
    extend: 'Ext.data.Store',

    requires: [
        'MyApp.model.TestStatusDistribution'
    ],

    constructor: function(cfg) {
        var me = this;
        cfg = cfg || {};
        me.callParent([Ext.apply({
            model: 'MyApp.model.TestStatusDistribution',
            storeId: 'TestStatusDistribution',
            //pageSize: 9999,
            proxy: {
                type: 'ajax',
                afterRequest: function(request, success) {
                    if(!success){
                        Ext.Msg.alert('错误','TestStatusDistribution操作失败');
                        return;
                    }
                },
                api: {
                    read: 'job/getTestStatusDistributionByDate',
                },
                extraParams: {
                	dirPath: '',
                	date: currentDate()
                },
                reader: {
                    type: 'json',
                    messageProperty: 'msg',
                    root: 'rows'
                },
                writer: {
                    type: 'json',
                    allowSingle: false
                }
            }
        }, cfg)]);
    }
});

var currentDate=function(){
	var date = new Date(); 
	var y = 0; 
	var m = 0; 
	var d = 0; 
	var today = ""; 
	y= date.getFullYear();
	m= date.getMonth()+1; 
	d = date.getDate(); 
	today += y + "-"; 
	if (m < 10 ) 
		today += "0" + m + "-"; 
	else
		today += m + "-";
	if (d < 10 ) 
		today += "0" + d;
	else
		today += d;
	return today;  
};