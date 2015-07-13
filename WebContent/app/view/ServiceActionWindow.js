var selectedTestPath='';

Ext.define('MyApp.view.ServiceActionWindow', {
    extend: 'Ext.window.Window',
    alias: 'widget.ServiceActionWindow',
    id: 'ServiceActionWindow',
    height: 700,
    width: 450,
    layout: {
        type: 'vbox',
        align:'stretch'
	},
    title: 'service动作设置',
    modal:true,
    resizable:false,
    initComponent: function() {
        var me = this;
        Ext.applyIf(me, {
	    	items: [
	    	{
	    		xtype: 'treepanel',
	    		title: '选择其它服务接口',
	    		flex: 13,
	    		store: 'ServiceActionTreeStore',
	    		animate: true,
	    		frame: true,
	    		autoScroll: true,
	    	    border: false,
	    	    useArrows: true,
	    	    trackMouseOver: false,
	    	    lines: false,
	    	    rootVisible: false,
	    	    containerScroll: true,
	    	    listeners: {
	                itemmousedown : function (that, record, item, index, e, eOpts) {
	                	selectedTestPath = record.raw.folderName;
                        Ext.getCmp("SaveServiceActionBtn").disabled=false;
                        Ext.fly('SaveServiceActionBtn').setStyle({
                			background:'green'
                		});
	                },
	                beforeitemexpand : function ( node, eOpts ){
	                	if(node.childNodes.length==0){
	                		Ext.Ajax.request( {
		                		loadMask: true,
								url : 'job/getTreeChildNodes',
								params : {  
									topPath : Ext.getCmp('Base').RootName,
									node : node.raw.folderName
								},
							    success : function(response, options) {
							    	Ext.get(document.body).unmask(); 
							    	var arr=JSON.parse(response.responseText);
							    	var parts=arr[0].id.split(">");
							    	var id=arr[0].id.replace(">"+parts[parts.length-1],"");
							    	if(id.indexOf(">")>0){
							    		var node=Ext.getStore('ServiceActionTreeStore').getNodeById(id);
								    	for(var i=0;i<arr.length;i++){
				                			node.appendChild(arr[i]);
								    	}
							    	}
							    },
							    failure: function(response, opts) {
							    	Ext.get(document.body).unmask(); 
					             	Ext.Msg.alert("获取直接子节点出错");
					            }
							});
	                	}
	                }
	            }
	    	},
	    	{
				flex: 1,
				text: '测试一下',
				xtype: 'button',
				handler:function(){
					if(Ext.String.endsWith(selectedTestPath,'-leaf') || Ext.String.endsWith(selectedTestPath,'-t')){
						if(selectedTestPath!=Ext.getCmp("Base").folderName){
							var lm = new Ext.LoadMask(Ext.getCmp('ServiceActionWindow'), { 
								msg : '执行中。。。', 
								removeMask : true
							}); 
							lm.show();
							Ext.Ajax.request( {
								url : 'job/getTestResponse',  
								params : {  
									path : selectedTestPath
								},
							    success : function(response, options) {
							    	lm.hide();
							    	var object=JSON.parse(response.responseText);
							    	if(object.success){
							    		var res=object.obj;
							    		Ext.getCmp('SrvResTextArea').setValue(res);
							    	}else
							    		Ext.Msg.alert("错误",object.msg);
							    },
							    failure: function(response, opts) {
							    	lm.hide();
					             	Ext.Msg.alert("错误","获取响应失败");
					            }
							});
						}
						else
							Ext.Msg.alert("警告","不能引用自己！");
					}else
						Ext.Msg.alert("警告","请选择测试节点！");
				}
			},
	    	{	
				xtype:'panel',
				flex: 12,
				title:"响应内容",
				layout: {
			        type: 'fit'
				},
				items:[
					{
						xtype:"textarea",
						id:"SrvResTextArea"
					}
				]
			},
			{
				xtype:'panel',
				flex: 1,
				layout:{
		    		type:'hbox'
		    	},
		    	items:[
    	        {
    	        	xtype:'label',
    	    		text:'调用接口：'
    	        },
    	        {
    	        	xtype:'label',
    	        	draggable:true,
    	    		id:'ServiceBeCalledLabel'
    	        }]
			},
			{
				xtype:'panel',
				flex: 1,
				layout:{
		    		type:'hbox'
		    	},
		    	items:[
    	        {
    	        	xtype: 'button',
    	        	id:'SaveServiceActionBtn',
                    handler: function(button, event) {
                    	if(Ext.String.endsWith(selectedTestPath,'-leaf') || Ext.String.endsWith(selectedTestPath,'-t')){
                    		if(selectedTestPath!=Ext.getCmp("Base").folderName){
                    			if(Ext.getCmp('MainPanel').MixAction){
                    				Ext.getCmp('SettingTextField').setValue(selectedTestPath);
                    				Ext.getCmp('ServiceActionWindow').close();
                    			}else{
	                        		Ext.Ajax.request({
	        	        				url:"job/saveServiceAction",
	        	        				params: {
	        	        					testPath:Ext.getCmp('Base').folderName,
	        	        					serviceCalled:selectedTestPath,
	        	        					srvActionType: Ext.getCmp('MainPanel').ActionType
	        	        				},
	        	        			    success: function(response, opts) {
	        	        			    	Ext.getCmp('ServiceActionWindow').close();
	        	        			    },
	        	        			    failure: function(response, opts) {
	        	        			    	Ext.Msg.alert('提示','请求失败');
	        	        			    }
	        	        			});
                    			}
                        	}else{
                        		Ext.Msg.alert("警告","不能引用自己！");
                        	}
                    	}else{
                    		Ext.Msg.alert("警告","请选择测试节点！");
                    	}
                    },
                    icon: 'image/save.png',
                    tooltip: '保存'
		    	},
		    	{
			    	xtype:'tbseparator',
			    	width: 20,
			    },
		    	{
    	        	xtype: 'button',
                    handler: function(button, event) {
                    	if(Ext.getCmp('ServiceBeCalledLabel').getEl().dom.innerText!=""){
                    		if(!Ext.getCmp('MainPanel').MixAction){
                    			Ext.Ajax.request({
        	        				url:"job/cleanServiceAction",
        	        				params: { 
        	        					testPath: Ext.getCmp('Base').folderName,
        	        					srvActionType: Ext.getCmp('MainPanel').ActionType
        	        				},
        	        			    success: function(response, opts) {
        	        			    	Ext.getCmp('ServiceBeCalledLabel').getEl().update('');
        	        			    },
        	        			    failure: function(response, opts) {
        	        			    	Ext.Msg.alert('提示','请求失败');
        	        			    }
        	        			});
                    		}
                    	}
                    	Ext.getCmp('ServiceActionWindow').close();
                    },
                    icon: 'image/clean.png',
                    tooltip: '清空'
		    	}]
			}],
	    	listeners: {
				show: {
                    fn: function(window, eOpts){
                    	Ext.getCmp("SaveServiceActionBtn").disabled=true;
                        Ext.fly('SaveServiceActionBtn').setStyle({
                			background:'white'
                		});
                        if(!Ext.getCmp('MainPanel').MixAction){
                        	Ext.Ajax.request({
    	        				url:"job/getServiceAction",
    	        				params: { 
    	        					testPath: Ext.getCmp('Base').folderName,
    	        					srvActionType: Ext.getCmp('MainPanel').ActionType
    	        				},
    	        			    success: function(response, opts) {
    	        			    	var obj=JSON.parse(response.responseText).obj;
    	        			    	if(obj!=null){
    	        			    		Ext.getCmp('ServiceBeCalledLabel').getEl().update(obj);
    	        			    	}
    	        			    },
    	        			    failure: function(response, opts) {
    	        			    	Ext.Msg.alert('提示','请求失败');
    	        			    }
    	        			});
                        }
                    },
                    scope: me
                }
			}
        });
        me.callParent(arguments);
    }
});
