Ext.define('MyApp.store.PreConfig', {
    extend: 'Ext.data.Store',

    requires: [
        'MyApp.model.PreConfig'
    ],

    constructor: function(cfg) {
        var me = this;
        cfg = cfg || {};
        me.callParent([Ext.apply({
            model: 'MyApp.model.PreConfig',
            storeId: 'PreConfig',
            pageSize: 9999,
            proxy: {
                type: 'ajax',
                afterRequest: function(request, success) {
                	if(!success){
                    	Ext.Msg.alert('错误','PreConfig任务操作失败');
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
    										url : 'job/markParameter',
    										params : {  
    											testPath : Ext.getCmp('Base').folderName
    										},
    									    success : function(response, options) {
    									    	Ext.getCmp('MainPanel').buildRequestForm(Ext.getCmp('Base').folderName);
    									    },
    									    failure: function(response, opts) {
    									    	Ext.Msg.alert("错误","标记请求参数失败"+obj.msg);
    							            }
    									});
        		    					break;
        		    				case "destroy":
        		    					Ext.Ajax.request( {
        									url : 'job/recoveryParameter',
        									params : {  
        										testPath : Ext.getCmp('Base').folderName									  
        									},
        								    success : function(response, options) {
        								    	Ext.getCmp('MainPanel').buildRequestForm(Ext.getCmp('Base').folderName);
        								    },
        								    failure: function(response, opts) {
        								    	Ext.Msg.alert("错误",obj.msg);
        						            }
        								});
        		    					break;
        		    				case "update":
        		    					Ext.Ajax.request( {
    										url : 'job/markParameter',
    										params : {  
    											testPath : Ext.getCmp('Base').folderName
    										},
    									    success : function(response, options) {
    									    	Ext.getCmp('MainPanel').buildRequestForm(Ext.getCmp('Base').folderName);
    									    },
    									    failure: function(response, opts) {
    									    	Ext.Msg.alert("错误","标记请求参数失败");
    							            }
    									});
        		    					break;
        		    				default:
        		    					break;
        	    				}
                        	}else{
                        		Ext.Msg.alert('错误',obj.msg);
                        		Ext.getStore("PreConfig").reload();
                        	}
                    	}	
                    }
                },
                api: {
                    create: 'job/addPreConfigItem',
                    read: 'job/getPreConfigItems',
                    update: 'job/addPreConfigItem',
                    destroy: 'job/deletePreConfigItem'
                },
                extraParams: {
                    testPath: ''
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
                property: 'type'
            }
        }, cfg)]);
    }
});