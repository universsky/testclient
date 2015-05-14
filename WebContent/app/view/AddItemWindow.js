Ext.define('MyApp.view.AddItemWindow', {
    extend: 'Ext.window.Window',
    alias: 'widget.AddItemWindow',
    height: 100,
    id: 'AddItemWindow',
    width: 300,
    layout: {
        type: 'fit'
    },
    title: '添加测试',
    resizable:false,
    initComponent: function() {
        var me = this;
        Ext.applyIf(me, {
        	items:[
        		{
        			xtype:'form',
        			id:"AddItemForm",
        			items:[
        				{
        					xtype:'textfield',
        					anchor: '100%',
        					fieldLabel: '测试名',
        					allowBlank:false,
        					name: 'folderName',
        					regex:/^((?![\/:*?"<>|@']).)*$/,
        			    	regexText:"禁止包含字符\/:*?\"<>|@'",
        				},
                        {
                            xtype: 'button',
                            handler: function(button, event) {
                            	var thestore=Ext.getStore('StandardTreeStore');
                            	var form=Ext.getCmp('AddItemForm').getForm();
                            	var folder=form.findField('folderName').getValue();
                            	if(form.isValid()){
                            		var children=Ext.getCmp('AddItemForm').theNode.childNodes;
                            		var ishttp=Ext.getCmp('Base').IsHttpCase;
                            		for(var i=0;i<children.length;i++){
                            			if(children[i].get("leaf")){
                            				var nodeid=children[i].get("id").toLowerCase();
                            				var issametype=ishttp?Ext.String.endsWith(nodeid,"-leaf"):Ext.String.endsWith(nodeid,"-t");
                            				if(issametype && children[i].get("text").toLowerCase()==folder.toLowerCase()){
                        						Ext.Msg.alert("错误",folder+"名称重复，请重新输入");
                                				return;
                        					}
                            			}
                            		}
                            		var suffix=ishttp?"-leaf":"-t";
                            		var path=Ext.getCmp('AddItemForm').theNode.raw.folderName+"/"+folder+suffix;
                                	
                                	var childnode={};
                                	if(suffix=="-t"){
                                		childnode={
                                			id:path.replace('/','>'),
                                		    text:folder,
                                		    leaf:true,
                                		    folderName:path,
                                		    iconCls:'tcpicon',
                                    	};
                                	}else{
                                		childnode={
                                			id:path.replace('/','>'),
                                		    text:folder,
                                		    leaf:true,
                                		    folderName:path,
                                    	};
                                	}
                                	Ext.getCmp('AddItemForm').theNode.insertChild(0,childnode);
                                	Ext.getCmp('AddItemForm').theNode.expand();
                                	me.close();
                                	
//                                	thestore.proxy.extraParams={
//                                    		folderName:path
//                                    	};
//                                	thestore.sync({
//                                		success:function(betch,options){
//                                		},
//                                		failure:function(betch,options){
//                                			Ext.Msg.alert("错误",thestore.getProxy().getReader().rawData.msg);
//                                			thestore.load();
//                                		}
//                                	});
                                	Ext.Ajax.request( {  
										url : 'job/addNode',
										params : {
											folderName : path
										},  
									    success : function(response, options) {
//									    	Ext.Ajax.request( {  
//												url : 'job/subscribleQueue',
//											    success : function(response, options) {
//											    },  
//											    failure: function(response, opts) {
//									             	console.log("错误","插入队列失败");
//									            }
//											});
									    },  
									    failure: function(response, opts) {
							             	Ext.Msg.alert("错误","插入测试失败");
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