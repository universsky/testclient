var jobs=[];

Ext.define('MyApp.view.CronSettingCombo', {
	extend: 'Ext.form.TriggerField',
	alias: 'widget.CronSettingCombo',
	id: 'CronSettingCombo',
    onTriggerClick: function () {
    	Ext.widget("CronExpressionSettingWindow").show();//this.el, 'tl-bl?');
    }
 });

Ext.define('MyApp.view.ScheduledRunningSetWindow', {
    extend: 'Ext.window.Window',
    alias: 'widget.ScheduledRunningSetWindow',
    id: 'ScheduledRunningSetWindow',
    modal:true,
    height: 260,
    width: 500,
    autoScroll: true,
    layout: {
        type: 'fit'
    },
    title: '测试集合定时回归',
    resizable:false,
    initComponent: function() {
        var me = this;
        Ext.applyIf(me, {
            items: [
            {
                xtype: 'gridpanel',
                id: 'ScheduledJobsGrid',
                title: '',
                autoFill : true,
                store: 'ScheduledRunningSet',
                stripeRows : true,
                selModel:Ext.create('Ext.selection.CheckboxModel',{
                	mode: 'MULTI',
                	checkOnly: true,
                	allowDeselect: true,
                	enableKeyNav: true,
                	listeners: {
                		deselect: function(that, record, index, eOpts) {
                			var removedJob=record.raw.jobName;
                			if(removedJob!=undefined){
                				if(jobs.length>1 && jobs[0]!=""){
                					jobs = jobs.join(',').toString().replace(removedJob+',', '').replace(','+removedJob, '').split(',');
                					if(jobs[jobs.length-1]=="")
                						jobs.remove(jobs.length-1);
                				}
                				else
                					jobs = [];
                    			Ext.getCmp('PauseRSBtn').disabled=true;
                    			Ext.getCmp('ContinueBtn').disabled=true;
                			}	
                		},
                		select: function(that, record, index, eOpts) {
                			var addedJob=record.raw.jobName;
                			if(addedJob!=undefined){
                				if(jobs.length==0 || jobs[0]=="" || jobs.join(',').toString().indexOf(addedJob)==-1){
                    				jobs.push(addedJob);
                    			}
    		                	if(record.raw.status=='active' || record.raw.status=='reactive'){
    		                		Ext.getCmp('PauseRSBtn').disabled=false;
    		                		Ext.getCmp('ContinueBtn').disabled=true;
    		                	}
    		                	else if(record.raw.status=='suspend'){
    		                		Ext.getCmp('ContinueBtn').disabled=false;
    		                		Ext.getCmp('PauseRSBtn').disabled=true;
    		                	}
    		                	else{
    		                		Ext.getCmp('PauseRSBtn').disabled=true;
    		                        Ext.getCmp('ContinueBtn').disabled=true;
    		                	}
                			}
		                }
//	                	selectionchange: function(that, selected, eOpts) {	
//	                	}
	                }
                }
                ),
                columns: [
				{
				    xtype: 'gridcolumn',
				    flex: 6,
				    dataIndex: 'cronExpression',
				    text: '定时设置',
				    editor: Ext.widget('CronSettingCombo')
				},
                {
				    xtype: 'gridcolumn',
				    dataIndex: 'jobName',
				    text: '创建/修改时间',
				    flex: 7
				},
				{
				    xtype: 'gridcolumn',
				    dataIndex: 'status',
				    text: '状态',
				    flex: 6,
				    renderer: function(value, metaData, record, rowIndex, colIndex, store, view) {
				    	if(value.indexOf('expired')!=-1){
				    		if(value.indexOf('executed')==-1){
				    			return '<span style="color: #BDBDBD;font-size:14px">' + "已过期" + '</span>';
				    		}else{
				    			var count = value.replace('executed','').replace('expired','');
				    			return '<span style="color: #BDBDBD;font-size:14px">' + "运行了" + count + "次but过期" + '</span>';
				    		}
				    	}else{
				    		if(value=='active'){
	                            return '<span style="color: blue;font-size:14px">' + "激活" + '</span>';
	                        }else if(value=='suspend'){
	                            return '<span style="color: #FFA500;font-size:14px">' + "暂停" + '</span>';
	                        }
	                        else if(value.indexOf('executed')==0){
	                        	var count = value.replace('executed','');
	                            return '<span style="color:green;font-size:14px">' + "已运行" + count + "次" + '</span>';
	                        }
	                        else if(value=='reactive'){
	                            return '<span style="color: blue;font-size:14px">' + "重新激活" + '</span>';
	                        }
				    	}
                    }
				},
                {
                    xtype: 'actioncolumn',
                    flex:1,
                    items: [
                        {
                            handler: function(view, rowIndex, colIndex, item, e, record, row) {
                                Ext.MessageBox.confirm(
                                "confirm",
                                "确认删除？",
                                function(e){
                                    if(e=='yes'){
                                        Ext.getStore('ScheduledRunningSet').removeAt(rowIndex);
                                        Ext.getStore('ScheduledRunningSet').sync();
                                    }
                                }
                                ); 
                            },
                            icon: 'image/delete.png',
                            tooltip: 'delete'
                        }
                    ]
                }                  
                ],
                dockedItems: [
                    {
                        xtype: 'toolbar',
                        dock: 'top',
                        items: [
                        {
                            xtype: 'button',
                            handler: function(button, event) {
                                var store = Ext.getStore('ScheduledRunningSet');
                                store.insert(0,{});
                                var rowEdit = Ext.getCmp('ScheduledJobsGrid').getPlugin("ScheduledJobEditPlugin");
                                rowEdit.startEdit(0,1); 
                            },
                            icon: 'image/add.png',
                            tooltip: '新增定时设置'
                        },
                        {
                            xtype: 'tbseparator'
                        },
                        {
                            xtype: 'button',
                            handler: function(button, event) {
                                Ext.getStore('ScheduledRunningSet').load();
                            },
                            icon: 'image/refresh.png',
                            tooltip: '刷新'
                        },
                        {
                            xtype: 'tbseparator'
                        },
                        {
                            xtype: 'button',
                            id: 'PauseRSBtn',
                            handler: function(button, event) {
                            	Ext.Ajax.request( {
									url : 'job/pauseScheduledRSJobs',
									params : {  
										jobs : jobs								  
									},
								    success : function(response, options) {
								    	var success=JSON.parse(response.responseText).success;
								    	if(success){
								    		Ext.Ajax.request( {
												url : 'job/setRunningSetStatusSuspend',
												params : { 
													folderName : Ext.getCmp('Base').folderName,
		    										jobs : jobs								  
		    									},
											    success : function(response, options) {	
											    	Ext.getStore('ScheduledRunningSet').reload();
											    },
											    failure: function(response, opts) {
									             	Ext.Msg.alert("设置暂停状态失败");
									            }
											});
								    	}else
								    		Ext.Msg.alert(JSON.parse(response.responseText).msg);
								    },
								    failure: function(response, opts) {
						             	Ext.Msg.alert("错误","暂停任务出错误");
						            }
								});
                            },
                            icon: 'image/pause.png',
                            tooltip: '暂停'
                        },
                        {
                            xtype: 'tbseparator'
                        },
                        {
                            xtype: 'button',
                            id: 'ContinueBtn',
                            handler: function(button, event) {
                            	Ext.Ajax.request( {
									url : 'job/resumeScheduledRSJobs',
									params : {  
										jobs : jobs								  
									},
								    success : function(response, options) {
								    	var success=JSON.parse(response.responseText).success;
								    	if(success){
								    		Ext.Ajax.request( {
												url : 'job/setRunningSetStatusReactive',
												params : {
													folderName : Ext.getCmp('Base').folderName,
		    										jobs : jobs								  
		    									},
											    success : function(response, options) {	
											    	Ext.getStore('ScheduledRunningSet').reload();
											    },
											    failure: function(response, opts) {
									             	Ext.Msg.alert("设置恢复状态失败");
									            }
											});
								    	}else
								    		Ext.Msg.alert(JSON.parse(response.responseText).msg);
								    },
								    failure: function(response, opts) {
						             	Ext.Msg.alert("错误","恢复任务出错误");
						            }
								});
                            },
                            icon: 'image/resume.png',
                            tooltip: '恢复'
                        },
                    ]
                }],
                plugins: [
                    Ext.create('Ext.grid.plugin.RowEditing', {
                        pluginId: 'ScheduledJobEditPlugin',
                        autoCancel:true,
                        listeners: {
                            edit: {
                                fn: me.onJobEdit,
                                scope: me
                            }
                        }
                    })
                ],
                listeners: {
                	itemmouseenter: {
                        fn: me.itemmouseenter,
                        scope: me
                    }
                }
            }],
            listeners: {
            	show: {
                    fn: me.onWindowShow,
                    scope: me
                }
            }
        });
        
        me.callParent(arguments);
    },

    onJobEdit: function(editor, context, eOpts) {
        Ext.getStore('ScheduledRunningSet').sync({
            success:function(){
                Ext.getStore('ScheduledRunningSet').load();
            }
        });
    },
    
    onWindowShow: function(window, eOpts) {
		Ext.getStore('ScheduledRunningSet').load();
		Ext.getCmp('PauseRSBtn').disabled=true;
        Ext.getCmp('ContinueBtn').disabled=true;
    },
    
    itemmouseenter: function( that, record, item, index, e, eOpts ){
    	var expression=record.raw.cronExpression;
    	Ext.create('Ext.tip.ToolTip', {
            width: 170,
            height:175,
    		target:item,
            loader: {
                url: 'job/getCronExpressionSummary', 
                params: {
                	expression : expression
                },
                autoLoad :true,
                loadMask :true
            }
            //dismissDelay: 15000         //15秒后自动隐藏
        });
    }
    
});