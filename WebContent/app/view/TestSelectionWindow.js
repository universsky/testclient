var selectedTestPath='';
var isTestSelected;
var isLbSet;
var isRbSet;

Ext.define('MyApp.view.TestSelectionWindow', {
    extend: 'Ext.window.Window',
    alias: 'widget.TestSelectionWindow',
    id: 'TestSelectionWindow',
    height: 700,
    width: 600,
    layout: {
        type: 'vbox',
        align:'stretch'
	},
    title: '设置',
    modal:true,
    resizable:false,
    initComponent: function() {
        var me = this;
        Ext.applyIf(me, {
	    	items: [
	    	{
	    		xtype: 'treepanel',
	    		title: '选择其它服务接口',
	    		flex: 18,
	    		store: 'TestSelectionTreeStore',
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
	                	if(record.raw.leaf){
	                		isTestSelected = true;
	                		if(isTestSelected && isLbSet && isRbSet){
	                			Ext.getCmp("btnSavePara").disabled=false;
	                			Ext.fly('btnSavePara').setStyle({
	                				background:'green'
	                			});
	                		}
	                	}else{
	                		isTestSelected = false;
                			Ext.getCmp("btnSavePara").disabled=true;
	    	    			Ext.fly('btnSavePara').setStyle({
                				background:'white'
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
							var lm = new Ext.LoadMask(Ext.getCmp('TestSelectionWindow'), { 
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
							    		Ext.getCmp('TestResponseTextArea').setValue(res);
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
				flex: 9,
				title:"响应内容",
				layout: {
			        type: 'fit'
				},
				items:[
					{
						xtype:"textarea",
						id:"TestResponseTextArea"
					}
				]
			},
	    	{
		       	xtype:'panel',
		       	layout: {
		       		type: 'hbox',
		       		align:'stretch'
		       	},
		       	flex:1,
		       	items:[
	    	    {
	    	    	flex: 6,
	    	    	fieldLabel: '左边界',
	    	    	xtype: 'textfield',
	    	    	id: 'leftbound',
	    	    	listeners : {
	    	    		change : function(that, newValue, oldValue, eOpts){
	    	    			if(newValue!=""){
	    	    				isLbSet = true;
	    	    				if(isTestSelected && isLbSet && isRbSet){
		                			Ext.getCmp("btnSavePara").disabled=false;
		                			Ext.fly('btnSavePara').setStyle({
		                				background:'green'
		                			});
		                		}
	    	    			}else{
	    	    				isLbSet = false;
	                			Ext.getCmp("btnSavePara").disabled=true;
		    	    			Ext.fly('btnSavePara').setStyle({
	                				background:'white'
	                			});
	    	    			}
	    	    		}
	    	    	}
	    	    },
	    	    {
	    	    	flex: 6,
	    	    	fieldLabel: '右边界',
	    	    	xtype: 'textfield',
	    	    	id: 'rightbound',
	    	    	listeners : {
	    	    		change : function(that, newValue, oldValue, eOpts){
	    	    			if(newValue!=""){
	    	    				isRbSet = true;
	    	    				if(isTestSelected && isLbSet && isRbSet){
		                			Ext.getCmp("btnSavePara").disabled=false;
		                			Ext.fly('btnSavePara').setStyle({
		                				background:'green'
		                			});
		                		}
	    	    			}else{
	    	    				isRbSet = false;
	                			Ext.getCmp("btnSavePara").disabled=true;
	                			Ext.fly('btnSavePara').setStyle({
	                				background:'white'
	                			});
	    	    			}
	    	    		}
	    	    	}
	    	    },
	    	    {
	    	    	flex: 1,
	    	    	xtype:'button',
	    	    	text:'保存',
	    	    	background:'white',
	    	    	id: 'btnSavePara',
    	    		handler:function(){
	    				var lb=Ext.getCmp("leftbound").getValue();
	    				var rb=Ext.getCmp("rightbound").getValue();
	    				var extraInfo=selectedTestPath+"<EOF>"+lb+"<EOF>"+rb;
	    				if(selectedTestPath!=Ext.getCmp("Base").folderName){
	    					Ext.Ajax.request( {
								url : 'job/setParameterInfo',  
								params : {  
									path : Ext.getCmp("Base").folderName,
									fieldName: Ext.getCmp("Base").fieldNameNeedToBindService,
									info : extraInfo
								},
							    success : function(response, options) {
							    	Ext.getCmp("TestSelectionWindow").close();
							    	Ext.getCmp("ServiceBoundCombo").setValue(extraInfo);
				    				
							    },
							    failure: function(response, opts) {
					             	Ext.Msg.alert("错误","更新parameter信息失败");
					            }
							});
	    				}
	    				else{
	    					Ext.Msg.alert("警告","不能引用自己！");
	    				}
	    			}
	    	    }]
		    }
	    	],
	    	listeners: {
				show: {
                    fn: function(window, eOpts){
                    	
                    },
                    scope: me
                }
			}
        });
        me.callParent(arguments);
        Ext.getCmp("btnSavePara").disabled=true;
        isTestSelected = false;
        isLbSet = false;
        isRbSet = false;
    }
});