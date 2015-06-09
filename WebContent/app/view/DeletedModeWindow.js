Ext.define('MyApp.view.DeletedModeWindow', {
	extend: 'Ext.window.Window',
    alias: 'widget.DeletedModeWindow',
    title:"选择删除模式",
	modal:true,
	width:250,
	height:130,
	collapsible:false,
	resizable:false,
    initComponent: function() {
        var me = this;
        Ext.applyIf(me, {
            items: [
            {
            	xtype: 'form',
            	//autoWidth:true,
            	layout:"form",
            	frame:true,
            	labelAlign:"right",
		 		items:[
 		        {
		    		xtype:'radiogroup',
    	    		itemId:'deletedMode',
    	    		layout: 'vbox',
    	    		items:[
					{
						boxLabel: "逻辑删除（可恢复）", name: 'isSimulation', checked:true
					},  
					{
						boxLabel: "物理删除（不可恢复）", name: 'isSimulation'
					}]
		    	}],
 		        buttons : [
 		        {
 		        	text : '确定',
 		        	handler : function(){
 		        		var isSimulation=Ext.ComponentQuery.query('#deletedMode')[0].items.items[0].checked;
 		        		var node=Ext.getCmp('tree').getSelectionModel().getSelection()[0];
 		        		var target = node.raw.folderName;
 		        		if(isSimulation){
 		        			Ext.Ajax.request( {
								url : 'job/logicalDelNode',
								params : {  
									nodePath : target									  
								},
							    success : function(response, options) {
							    	node.remove();
							    	me.close();
//							    	Ext.Ajax.request( {  
//										url : 'job/subscribleQueue',
//									    success : function(response, options) {
//									    },  
//									    failure: function(response, opts) {
//							             	console.log("错误","插入队列失败");
//							            }
//									});
							    },
							    failure: function(response, opts) {
							    	Ext.Msg.alert("错误",obj.msg);
					            }
							});
 		        		}else{
 		    				if(target.substring(target.length-4)==='-dir'){
 		    					Ext.widget('PasswordConfirmationWindow').show();
 		    				}else{
 		    					Ext.getCmp('Base').checkNotRoot(Ext.getCmp('Base').delNode);
 		    				}
 		    				me.close();
 		        		}
 		        	}
 		        },
 		        {    
 		        	text : '取消',
 		        	handler : function(){
 		        		me.destroy();
 		        	}
 		        }]
            }]
        });
        me.callParent(arguments);
    }
});
