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

Ext.define('MyApp.view.RunningSetPanel', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.RunningSetPanel',
    id: 'RunningSetPanel',
    initComponent: function() {
        var me = this;
        Ext.applyIf(me, {
        	items:[
    		{
    			xtype:'toolbar',
    			items:[
				{
					xtype:'button',
					text:'运行集合',
                    tooltip: '批量运行测试集',
					handler:function(){
						Ext.widget('BatchExecutionWindow').show();
					}
				},
				{
			    	xtype:'tbseparator'
			    },
				{
					xtype:'button',
					text:'定时回归',
                    tooltip: '定时运行集合',
					handler:function(){
						if(Ext.getCmp('Base').RootName=='root'){
							Ext.getStore('ScheduledRunningSet').proxy.extraParams.folderName=Ext.getCmp('Base').folderName;
							Ext.getStore('ScheduledRunningSet').load();
							Ext.widget('ScheduledRunningSetWindow').show();
						}else{
							Ext.Msg.alert("Info","该功能暂不支持私人工作区设置定时");
						}
					}
				},
				{
			    	xtype:'tbseparator'
			    },
				{
					xtype:'button',
					text:'历史记录',
                    tooltip: '运行历史记录',
					handler:function(){
						Ext.widget('BatchTestHistoryWindow').show();
					}
				}]
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
				    id:'RunningSetStatisticsPanel',
//				    rowspan: 1,
//				    colspan: 1,
				    columnWidth: 193 / 293,
//				    style:'padding:20px 10px 20px 0px', 
//				    width: 850,
				    height:500,
				    autoScroll: true,
				},
				{
				    title: '测试结果分布饼图',
				    id:'RunningSetStatusDistributionPanel',
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
				},
				{
				    title: '测试通过率趋势图（一周）',
				    id:'RunningSetPassedRateTrendPanel',
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
				}]
    		}],
    		listeners: {
    			resize: {
    				fn: function(that, width, height, eOpts){
    					Ext.getCmp('RunningSetStatisticsPanel').setHeight(height*50/87);
						Ext.getCmp('RunningSetStatusDistributionPanel').setHeight(height*50/87);
						Ext.getCmp('RunningSetPassedRateTrendPanel').setHeight(height*32/87);
    				},
	                scope: me
				}
    		}
        });
        me.callParent(arguments);
    } 
});