var firstCheck=true;
Ext.define('MyApp.store.TestItem', {
    extend: 'Ext.data.Store',

    requires: [
        'MyApp.model.TestItem'
    ],

    constructor: function(cfg) {
        var me = this;
        cfg = cfg || {};
        me.callParent([Ext.apply({
            model: 'MyApp.model.TestItem',
            storeId: 'TestItem',
            pageSize: 99999,
            proxy: {
                type: 'ajax',
                afterRequest: function(request, success) {
                    if(!success){
                        Ext.Msg.alert('错误','TestItem操作失败');
                        return;
                    }else{
                    	if(request.action=='read'){
                    		var runningSet=Ext.getCmp('Base').folderName;
                    		if(runningSet.indexOf('@')!=-1 && firstCheck){
                    			Ext.Ajax.request( {
									url : 'job/checkAllTestPathExist',
									params : {
										runningSet : runningSet
									},
								    success : function(response, options) {
								    	var json=JSON.parse(response.responseText);
								    	if(!json.success){
								    		var testpaths=json.obj;
								    		if(testpaths.length>0){
								    			Ext.Msg.alert("数据同步检查",testpaths.join(' ')+"\n被删除或移除，将同步数据",function(){
									    			Ext.Ajax.request( {
				    									url : 'job/syncTestUnderRunningSet',
				    									params : {
				    										runningSet : runningSet,
				    										removedTests : testpaths
				    									},
				    								    success : function(response, options) {
				    								    	firstCheck=false;
				    								    	Ext.getStore('TestItem').reload();
				    								    },
				    								    failure: function(response, opts) {
				    								    	Ext.Msg.alert("错误","测试同步失败"+json.msg);
				    						            }
				    								});
									    		});
								    		}
								    	}
								    },
								    failure: function(response, opts) {
								    	Ext.Msg.alert("错误","检查测试同步失败"+json.msg);
						            }
								});
                    		}
                    	}
                    }
                },
                api: {
                    read: 'job/getTestItems',
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
                property: 'time'
            }
        }, cfg)]);
    }
});