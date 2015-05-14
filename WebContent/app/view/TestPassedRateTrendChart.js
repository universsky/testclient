Ext.require('Ext.chart.*');
Ext.define('MyApp.view.TestPassedRateTrendChart', {
    extend: 'Ext.chart.Chart',
    alias: 'widget.TestPassedRateTrendChart',
    id: 'TestPassedRateTrendChart',
    animate: true,
    shadow: true,
    store: 'TestPassedRate',
    initComponent: function() {
        var me = this;
        Ext.applyIf(me, {
        	axes: [{
                type: 'Numeric',
                minimum: 0,
                position: 'left',
                fields: ['rate'],
                title: false,
                grid: true,
                label: {
                    renderer: Ext.util.Format.numberRenderer('0,0%'),
                    font: '10px Arial'
                }
            }, {
                type: 'Category',
                position: 'bottom',
                fields: ['date'],
                title: false
            }],
            series: [{
                type: 'line',
                axis: 'left',
                gutter: 80,
                xField: 'date',
                yField: ['rate'],
                tips: {
                    trackMouse: true,
                    width: 580,
                    height: 200,
                    layout: 'fit',
                    items: {
                        xtype: 'container',
                        layout: 'fit',
                        items: [
							Ext.create('Ext.chart.Chart', {
							    width: 580,
							    height: 180,
							    animate: false,
							    store: 'TestStatusDistribution',
							    shadow: false,
							    insetPadding: 20,
							    theme: 'Base:gradients',
							    legend: {
	                                position: 'right'
	                            },
							    series: [{
							        type: 'pie',
							        field: 'number',
							        showInLegend: true,
							        label: {
							            field: 'status',
							            display: 'rotate',
							            contrast: true,
							            font: '9px Arial'
							        }
							    }]
							}),
                       ]
                    },
                    renderer: function(klass, item) {
                        var storeItem = item.storeItem;
                        this.setTitle(storeItem.get('date')+" 通过率："+storeItem.get('rate')+"% 结果分布：");
                        Ext.getStore('TestStatusDistribution').proxy.extraParams.date=storeItem.get('date');
                        Ext.getStore('TestStatusDistribution').proxy.extraParams.dirPath=Ext.getCmp('Base').folderName;
                        Ext.getStore('TestStatusDistribution').load();
                    }
                }
            }]
        	
        });
        me.callParent(arguments);
    } 
});