function getDateStr(dayCount) {
    var date = new Date();
    date.setDate(date.getDate()+dayCount);
    var y = date.getFullYear();
    var m = date.getMonth()+1;
    var d = date.getDate();
    if (m < 10 ) 
		m = "0" + m; 
	if (d < 10 ) 
		d = "0" + d;
    return y+"-"+m+"-"+d;
}

var datestore=[['今天',getDateStr(0)],['昨天',getDateStr(-1)],['前天',getDateStr(-2)],[getDateStr(-3),getDateStr(-3)],
               [getDateStr(-4),getDateStr(-4)],[getDateStr(-5),getDateStr(-5)],[getDateStr(-6),getDateStr(-6)]];
Ext.require(['Ext.layout.container.Fit', 'Ext.window.MessageBox']);

Ext.define('MyApp.view.FolderPanel', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.FolderPanel',
    id: 'FolderPanel',
    initComponent: function() {
        var me = this;
        Ext.applyIf(me, {
        	items:[
    		{
    			xtype:'toolbar',
    			items:[
    				{
    					xtype:'button',
    					text:'配置环境变量',
    					handler:function(){
    						Ext.widget('EnvEditWindow').show();
    						Ext.getCmp('Base').showEvn();
    					}
    				},
    				{
		    			xtype:'tbseparator'
		    		},
    				{
    					xtype:'button',
    					text:'批量执行',
    					handler:function(){
    						Ext.widget('BatchExecutionWindow').show();
    					}
    				},
    				{
		    			xtype:'tbseparator'
		    		},
		    		{
    					xtype:'button',
    					text:'批量执行记录',
    					handler:function(){
    						Ext.widget('BatchTestHistoryWindow').show();
    					}
    				}
    			]
    		},
    		{
    			xtype:'container',
//    			width:1300,
//    			height:870,
    			renderTo: Ext.getBody(),
    			layout: 'column',
//    			layout:"table",
//    			bodyStyle:'padding:10 10 10 0',
//    			layoutConfig:{
//    				columns:2
//    			},
    		    defaults: { 
//    		    	height:500,
//    				width:500,
    		    	frame: true
    		    },
    			items:[
				{
				    title: '测试结果汇总表格',
				    id:'TestCaseStatisticsPanel',
				    collapsed: true,
				    collapsible: true,
//				    rowspan: 1,
//				    colspan: 1,
				    columnWidth: 193 / 293,
//				    style:'padding:20px 10px 20px 0px', 
//				    width: 850,
				    height:500,
				    autoScroll: true,
				    listeners: {
				    	expand: {
		                    fn: function(p, eOpts){
		                    	Ext.getCmp('TestCaseStatisticsPanel').removeAll(true);
		                    	Ext.getCmp('TestCaseStatisticsPanel').add(Ext.widget('TestCaseResultGrid'));
		                    	Ext.getStore('TestCaseResult').load();
		                    },
		                    scope: me
		                },
		                collapse: {
		                	fn: function( p, eOpts ){
		                		Ext.getCmp('TestCaseStatisticsPanel').removeAll(true);
		                	}
		                }
					}
				},
				{
				    title: '测试结果分布饼图',
				    id:'TestStatusDistributionPanel',
				    collapsed: true,
				    collapsible: true,
//				    rowspan: 1,
//				    colspan: 1,
				    columnWidth: 100 / 293,
//				    style:'padding:20px 10px 20px 10px', 
//				    width: 450,
				    height:500,
				    layout: 'fit',
		            tbar: [
					{
						xtype: 'combobox',
						width:155,
						labelWidth:55,
						fieldLabel: '选择日期',
						valueField:'name',
					    displayField:'value',
					    store: Ext.create('Ext.data.ArrayStore',{
					    	fields:['value','name'],
					    	data: datestore
					    }),
					    value:'今天',
					   	editable:false,
					   	listeners :{
							'change':function(that, newValue, oldValue, eOpts){
								if(newValue!=''){
									Ext.getStore('TestStatusDistribution').proxy.extraParams.date=newValue;
									Ext.getStore('TestStatusDistribution').load();
								}
					    	}
						}
					},
					{
					    xtype: 'tbseparator'
					},
					{
						
						icon: 'image/download.png',
		               tooltip: '下载',
			            handler: function() {
			                Ext.MessageBox.confirm('下载确认', '将饼图另存为图片?', function(choice){
			                    if(choice == 'yes'){
			                    	Ext.getCmp('TestStatusDistributionPieChart').save({
			                            type: 'image/png'
			                        });
			                    }
			                });
			            }
			        },
//					        {
//							    xtype: 'tbseparator'
//							},
//					        {
//					            text: '重新加载',
//					            handler: function() {
//					                // Add a short delay to prevent fast sequential clicks
//					                window.loadTask.delay(100, function() {
//					                	Ext.getStore('TestStatusDistribution').load();
//					                });
//					            }
//					        },
			        {
					    xtype: 'tbseparator'
					},
			        {
			            enableToggle: true,
			            pressed: false,
			            icon: 'image/transform.png',
		               tooltip: '变形',
			            toggleHandler: function(btn, pressed) {
			            	Ext.getCmp('TestStatusDistributionPieChart').series.first().donut = pressed ? 35 : false;
			            	Ext.getCmp('TestStatusDistributionPieChart').refresh();
			            }
			        }],
				    listeners: {
				    	expand: {
		                    fn: function(p, eOpts){
		                    	Ext.getCmp('TestStatusDistributionPanel').removeAll(true);
		                    	Ext.getCmp('TestStatusDistributionPanel').add(Ext.widget('TestStatusDistributionPieChart'));
		                    	Ext.getStore('TestStatusDistribution').load();
		                    },
		                    scope: me
		                },
		                collapse: {
		                	fn: function( p, eOpts ){
		                		Ext.getCmp('TestStatusDistributionPanel').removeAll(true);
		                	}
		                }
					}
				},
				{
				    title: '测试通过率趋势图（一周）',
				    id:'TestPassedRateTrendPanel',
				    collapsed: true,
				    collapsible: true,
//				    rowspan: 1,
//				    colspan: 2,
				    columnWidth: 293 / 293,
//				    style:'padding:0px 10px 20px 0px', 
//				    width: 1320,
				    height:370,
				    layout: 'fit',
			        tbar: [{
			        	icon: 'image/download.png',
                        tooltip: '下载',
			            handler: function(){
			            	Ext.MessageBox.confirm('下载确认', '将趋势图另存为图片?', function(choice){
			                    if(choice == 'yes'){
			                    	Ext.getCmp('TestPassedRateTrendChart').save({
			                            type: 'image/png'
			                        });
			                    }
			                });
			            }
			        }],
				    listeners: {
				    	expand: {
		                    fn: function(p, eOpts){
		                    	Ext.getCmp('TestPassedRateTrendPanel').removeAll(true);
		                    	Ext.getCmp('TestPassedRateTrendPanel').add(Ext.widget('TestPassedRateTrendChart'));
		                    	Ext.getStore('TestPassedRate').load();
		                    },
		                    scope: me
		                },
		                collapse: {
		                	fn: function( p, eOpts ){
		                		Ext.getCmp('TestPassedRateTrendPanel').removeAll(true);
		                	}
		                }
					}
				}]
    		}],
    		listeners: {
    			resize: {
    				fn: function(that, width, height, eOpts){
    					Ext.getCmp('TestCaseStatisticsPanel').setHeight(height*50/87);
						Ext.getCmp('TestStatusDistributionPanel').setHeight(height*50/87);
						Ext.getCmp('TestPassedRateTrendPanel').setHeight(height*32/87);
    				},
	                scope: me
				}
    		}
        });
        me.callParent(arguments);
        Ext.getStore('TestCaseResult').proxy.extraParams.dirPath=Ext.getCmp('Base').folderName;
        Ext.getStore('TestStatusDistribution').proxy.extraParams.dirPath=Ext.getCmp('Base').folderName;
        Ext.getStore('TestPassedRate').proxy.extraParams.dirPath=Ext.getCmp('Base').folderName;
    }
});