Ext.define('MyApp.store.RunningSet', {
    extend: 'Ext.data.Store',

    requires: [
        'MyApp.model.RunningSet'
    ],

    constructor: function(cfg) {
        var me = this;
        cfg = cfg || {};
        me.callParent([Ext.apply({
            model: 'MyApp.model.RunningSet',
            storeId: 'RunningSet',
            pageSize: 99999,
            proxy: {
                type: 'ajax',
                afterRequest: function(request, success) {
                    if(!success){
                        Ext.Msg.alert('错误','RunningSet操作失败');
                        return;
                    }else{
                    	if(request.action!='read'){
                    		var obj=request.proxy.reader.rawData;
                        	if(obj.success){
                        		switch (request.action)
        	    				{
        		    				case "destroy":
        		    					Ext.Ajax.request( {
        									url : 'job/deleteRunningSet',
        									method:'POST',
    	        							params : {  
    	        								foldername : Ext.getCmp('Base').folderName
    	        							},
        								    success : function(response, options) {
        								    	var json=Ext.decode(response.responseText);
    	        						    	if(json.success){
    	        						    		Ext.getStore("RunningSet").reload();
    	        						    	}else
    	        						    		Ext.Msg.alert("错误",json.msg);
        								    },
        								    failure: function(response, opts) {
        								    	Ext.Msg.alert("错误","删除运行集合失败");
        						            }
        								});
        		    					break;
        		    				default:
        		    					break;
        	    				}
                        	}else{
                        		Ext.Msg.alert('错误',obj.msg);
                        		Ext.getStore("RunningSet").reload();
                        	}
                    	}	
                    }
                },
                api: {
                    read: 'job/getAllRunningSet',
                    destroy: 'job/deleteAllJobsUnderRunningSet'
                },
                reader: {
                    type: 'json',
                    messageProperty: 'msg',
                    root: 'rows'
                },
                writer: {
                    type: 'json',
                    allowSingle: false
                },
                extraParams:{
                	rootName:''
                }
            },
            sorters: {
                direction: 'DESC',
                property: 'time'
            }
        }, cfg)]);
    }
});