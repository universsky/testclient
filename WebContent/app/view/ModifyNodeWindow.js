Ext.define('MyApp.view.ModifyNodeWindow', {
    extend: 'Ext.window.Window',
    alias: 'widget.ModifyNodeWindow',
    height: 100,
    id: 'ModifyNodeWindow',
    width: 300,
    layout: {
        type: 'fit'
    },
    title: '修改',
    resizable:false,
    initComponent: function() {
        var me = this;
        Ext.applyIf(me, {
        	items:[
        		{
        			xtype:'form',
        			id:"ModifyNodeForm",
        			items:[
        				{
        					xtype:'textfield',
        					anchor: '100%',
        					fieldLabel: '重命名',
        					allowBlank:false,
        					itemId:'ModifiedNodeTextField',
        					name: 'folderName',
        					regex:/^((?![\/:*?"<>|@']).)*$/,
        			    	regexText:"禁止包含字符\/:*?\"<>|@'",
        				},
                        {
                            xtype: 'button',
                            handler: function(button, event) {
                            	var thestore=Ext.getStore('StandardTreeStore');
                            	var form=Ext.getCmp('ModifyNodeForm').getForm();
                            	if(form.isValid()){
                            		var folder=form.findField('folderName').getValue();
                            		var children=Ext.getCmp('Base').theNode.parentNode.childNodes;
                            		for(var i=0;i<children.length;i++){
                            			if(!children[i].get("leaf")){
                            				if(children[i].get("text").toLowerCase()==folder.toLowerCase()){
                                				Ext.Msg.alert("错误",folder+"名称重复，请重新输入");
                                				return;
                                			}
                            			}else{
                            				var nodeid=children[i].get("id").toLowerCase();
                            				if(children[i].get("text").toLowerCase()==folder.toLowerCase()){
                        						Ext.Msg.alert("错误",folder+"名称重复，请重新输入");
                                				return;
                        					}
                            			}
                            		}
                            		
                            		var oldpath=Ext.getCmp('Base').theNode.raw.folderName;
                                	var sufix="";
                                	if(Ext.String.endsWith(oldpath,"-leaf")){
                                		sufix="-leaf";
                                	}else if(Ext.String.endsWith(oldpath,"-dir")){
                                		sufix="-dir";
                                	}else if(Ext.String.endsWith(oldpath,"-t")){
                                		sufix="-t";
                                	}                            	
                                	var newname = folder;
                                	var folder=oldpath.substring(0,oldpath.lastIndexOf("/")) +"/"+  newname + sufix;
                                	
                                	thestore.proxy.extraParams={
                                		oldFolderName:oldpath,
                                		folderName:folder
                                	};
                                	var oldnode=Ext.getCmp('Base').theNode;
                                	Ext.getCmp('Base').theNode.set("text",newname);
                                	Ext.getCmp('Base').theNode.set("id",folder.replace('/','>'));
                                	Ext.getCmp('Base').theNode.raw.folderName=folder;
                                	//Ext.getCmp('Base').theNode.expand();
                                	me.close();
                                	
                                	thestore.sync({
                                		success:function(betch,options){
//                                			Ext.Ajax.request( {  
//												url : 'job/subscribleQueue',
//											    success : function(response, options) {
//											    },  
//											    failure: function(response, opts) {
//									             	console.log("错误","插入队列失败");
//									            }
//											});
                                		},
                                		failure:function(betch,options){
                                			Ext.Msg.alert("错误","修改节点失败");
                                			thestore.load();
                                		}
                                	});
                            	}
                            },
                            text: '修改'
                        }        				
        			]
        		}
        	],
        	listeners: {
				'show': {
					fn:function(){
						me.onshow();
		    		},
                    scope: me
                }
			}
        });
        me.callParent(arguments);
    },
    onshow:function(){
    	Ext.getCmp('ModifyNodeForm').getForm().findField('folderName').setValue(Ext.getCmp('Base').theNode.raw.text);
    }
});