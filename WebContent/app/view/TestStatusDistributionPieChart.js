var donut = false;

Ext.require('Ext.chart.*');

Ext.define('MyApp.view.TestStatusDistributionPieChart', {
    extend: 'Ext.chart.Chart',
    alias: 'widget.TestStatusDistributionPieChart',
    id: 'TestStatusDistributionPieChart',
    animate: true,
    store: 'TestStatusDistribution',
    shadow: true,
    legend: {
        position: 'right'
    },
    insetPadding: 20,
    theme: 'Base:gradients',
    initComponent: function() {
        var me = this;
        Ext.applyIf(me, {
        	series: [{
                type: 'pie',
                field: 'number',
                showInLegend: true,
                donut: donut,
                tips: {
                	trackMouse: true,
                	width: 450,
                	height: 450,
                	renderer: function(storeItem, item) {
                    //calculate percentage.
                		var total = 0;
                		Ext.getStore('TestStatusDistribution').each(function(rec) {
                			total += parseInt(rec.get('number'));
                		});
                		this.setTitle(storeItem.get('status') + '：' + Math.round(storeItem.get('number') / total * 100) + '%');
                		var testnamelist="";
                		var arr=storeItem.raw.test.split('@');
                		for(var i=0;i<arr.length;i++){
                			testnamelist+='"'+arr[i]+'";';
                		}
                		this.update("测试列表："+testnamelist.substring(0, testnamelist.length-1));
                	}
                },
                highlight: {
                	segment: {
                		margin: 20
                	}
                },
                label: {
                    field: 'status',
                    display: 'rotate',
                    contrast: true,
                    font: '18px Arial'
                }
            }]
        });
        me.callParent(arguments);
    } 
});