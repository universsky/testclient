Ext.define('MyApp.view.AddFolderWindow', {
    extend: 'Ext.window.Window',
    alias: 'widget.AddFolderWindow',
    height: 100,
    id: 'AddFolderWindow',
    width: 300,
    layout: {
        type: 'fit'
    },
    title: '添加目录',
    resizable:false,
    initComponent: function() {
        var me = this;
        Ext.applyIf(me, {
        	items:[
        		{
        			xtype:'form',
        			id:"AddFolderForm",
        			items:[
        				{
        					xtype:'textfield',
        					anchor: '100%',
        					fieldLabel: '目录名',
        					allowBlank:false,
        					name: 'folderName',
        					regex:/^((?![\/:*?"<>|@']).)*$/,
        			    	regexText:"禁止包含字符\/:*?\"<>|@'",
        				},
                        {
                            xtype: 'button',
                            handler: function(button, event) {
                            	var thestore=Ext.getStore('StandardTreeStore');
                            	var form=Ext.getCmp('AddFolderForm').getForm();
                            	if(form.isValid()){
                            		var folder=form.findField('folderName').getValue();
                            		var path=Ext.getCmp('AddFolderForm').theNode.raw.folderName+"/"+folder+"-dir";
                            		Ext.Ajax.request( {  
										url : 'job/addNode',
										params : {
											folderName : path
										},  
									    success : function(response, options) {
									    	var json=JSON.parse(response.responseText);
									    	if(json.success){
									    		var childnode={
		                                			id:folder.replace('/','>'),
		                                		    text:folder,
		                                		    leaf:false,
		                                		    folderName:path,
		                                		    root:false,
		                                		    allowDrag: true,
		                                		    allowDrop: true,
		                                		    expandable: false
			                                	};
			                                	Ext.getCmp('AddFolderForm').theNode.insertChild(0,childnode);
			                                	Ext.getCmp('AddFolderForm').theNode.expand();
			                                	me.close();
									    	}else{
									    		Ext.Msg.alert("错误",json.msg);
									    	}
									    },  
									    failure: function(response, opts) {
							             	Ext.Msg.alert("错误","插入目录失败");
							            }
									});
                            	}
                            },
                            text: '新建'
                        }        				
        			]
        		}
        	]
        });
        me.callParent(arguments);
    }
});
