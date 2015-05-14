Ext.define('MyApp.store.ScheduledRunningSet', {
    extend: 'Ext.data.Store',

    requires: [
        'MyApp.model.ScheduledRunningSet'
    ],

    constructor: function(cfg) {
        var me = this;
        cfg = cfg || {};
        me.callParent([Ext.apply({
            model: 'MyApp.model.ScheduledRunningSet',
            storeId: 'ScheduledRunningSet',
            pageSize: 99999,
            proxy: {
                type: 'ajax',
                afterRequest: function(request, success) {
                    if(!success){
                    	Ext.Msg.alert('错误','任务操作失败');
                        return;
                    }
                    else{
                    	if(request.action!='read'){
                    		var obj=request.proxy.reader.rawData;
                        	if(obj.success){
                        		switch (request.action)
        	    				{
        		    				case "create":
    		    						Ext.Ajax.request( {
    										url : 'job/addScheduledRunningSet',
    										params : { 
    											folderName : Ext.getCmp('Base').folderName,
    											jobName : obj.obj.jobName,
    											expression : obj.obj.cronExpression
    										},
    									    success : function(response, options) {
    									    	Ext.getStore("ScheduledRunningSet").reload();
    									    },
    									    failure: function(response, opts) {
    									    	Ext.Msg.alert("错误","新增定时设置失败");
    							             	Ext.getStore("ScheduledRunningSet").reload();
    							            }
    									});
        		    					break;
        		    				case "destroy":
        		    					Ext.Ajax.request( {
        									url : 'job/deleteScheduledRunningSet',
        									params : {  
        										folderName : Ext.getCmp('Base').folderName,
        										jobName : request.jsonData[0].jobName										  
        									},
        								    success : function(response, options) {
        								    	Ext.getStore("ScheduledRunningSet").reload();
        								    },
        								    failure: function(response, opts) {
        								    	Ext.Msg.alert("错误",obj.msg);
        						            }
        								});
        		    					break;
        		    				case "update":
        		    					Ext.Ajax.request( {
    										url : 'job/updateScheduledRunningSet',
    										params : { 
    											folderName : Ext.getCmp('Base').folderName,
    											jobName : obj.obj.jobName,
    											expression : obj.obj.cronExpression
    										},
    									    success : function(response, options) {
    									    	Ext.getStore("ScheduledRunningSet").reload();
    									    },
    									    failure: function(response, opts) {
    									    	Ext.Msg.alert("错误","更改定时设置失败");
    							             	Ext.getStore("ScheduledRunningSet").reload();
    							            }
    									});
        		    					break;
        		    				default:
        		    					break;
        	    				}
                        	}else{
                        		Ext.Msg.alert('错误',obj.msg);
                        		Ext.getStore("ScheduledRunningSet").reload();
                        	}
                    	}	
                    }
                },
                api: {
                	create: 'job/addScheduledRSJob',
                    read: 'job/getAllScheduledRunningSet',
                    update: 'job/updateScheduledRSJob',
                    destroy: 'job/deleteScheduledRSJob'
                },
                extraParams: {
                	folderName: ''
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
            },
            sorters: {
                direction: 'DESC',
                property: 'jobName'
            }
        }, cfg)]);
    }
});