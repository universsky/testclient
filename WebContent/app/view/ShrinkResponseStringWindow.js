var isLbSet;
var isRbSet;
var isIndexSet;
Ext.define('MyApp.view.ShrinkResponseStringWindow', {
    extend: 'Ext.window.Window',
    alias: 'widget.ShrinkResponseStringWindow',
    id: 'ShrinkResponseStringWindow',
    height: 520,
    width: 350,
    layout: {
        type: 'vbox',
        align:'stretch'
	},
    title: '截取响应内容字符串',
    modal:true,
    resizable:false,
    initComponent: function() {
        var me = this;
        Ext.applyIf(me, {
	    	items: [
	    	{
	    		xtype: 'textarea',
	    		flex:4,
	    		id: 'ServiceResTextArea',
	    	},
	    	{
		       	xtype:'panel',
		       	layout: {
		       		type: 'vbox',
		       		align:'stretch'
		       	},
		       	flex:1,
		       	items:[
	    	    {
	    	    	fieldLabel: '左边界',
	    	    	xtype: 'textfield',
	    	    	id: 'lb',
	    	    	allowBlank:false,
	    	    	listeners : {
	    	    		change : function(that, newValue, oldValue, eOpts){
	    	    			if(newValue!=""){
	    	    				isLbSet = true;
	    	    				if(isLbSet && isRbSet && isIndexSet){
		                			Ext.getCmp("SaveButton").disabled=false;
		                			Ext.fly('SaveButton').setStyle({
		                				background:'green'
		                			});
		                		}
	    	    			}else{
	    	    				isLbSet = false;
	                			Ext.getCmp("SaveButton").disabled=true;
		    	    			Ext.fly('SaveButton').setStyle({
	                				background:'white'
	                			});
	    	    			}
	    	    		}
	    	    	}
	    	    },
	    	    {
	    	    	fieldLabel: '右边界',
	    	    	xtype: 'textfield',
	    	    	id: 'rb',
	    	    	allowBlank:false,
	    	    	listeners : {
	    	    		change : function(that, newValue, oldValue, eOpts){
	    	    			if(newValue!=""){
	    	    				isRbSet = true;
	    	    				if(isLbSet && isRbSet && isIndexSet){
		                			Ext.getCmp("SaveButton").disabled=false;
		                			Ext.fly('SaveButton').setStyle({
		                				background:'green'
		                			});
		                		}
	    	    			}else{
	    	    				isRbSet = false;
	                			Ext.getCmp("SaveButton").disabled=true;
	                			Ext.fly('SaveButton').setStyle({
	                				background:'white'
	                			});
	    	    			}
	    	    		}
	    	    	}
	    	    },
	    	    {
	    	    	fieldLabel: '出现次数',
	    	    	xtype: 'textfield',
	    	    	id: 'displaytimes',
	    	    	regex:/^[0-9]*[1-9][0-9]*$/,
			    	regexText:'必须是>=1的数字',
	    	    	listeners : {
	    	    		change : function(that, newValue, oldValue, eOpts){
	    	    			if(newValue!=""){
	    	    				isIndexSet = true;
	    	    				if(isLbSet && isRbSet && isIndexSet){
		                			Ext.getCmp("SaveButton").disabled=false;
		                			Ext.fly('SaveButton').setStyle({
		                				background:'green'
		                			});
		                		}
	    	    			}else{
	    	    				isIndexSet = false;
	                			Ext.getCmp("SaveButton").disabled=true;
	                			Ext.fly('SaveButton').setStyle({
	                				background:'white'
	                			});
	    	    			}
	    	    		}
	    	    	}
	    	    }]
		    },
		    {
    	    	xtype:'button',
    	    	background:'white',
    	    	id: 'SaveButton',
	    		handler:function(){
    				var lb=Ext.getCmp("lb").getValue();
    				var rb=Ext.getCmp("rb").getValue();
    				var index=Ext.getCmp("displaytimes").getValue();
    				Ext.getCmp('ExpectedValueToBeChecked').setValue(lb+'_end_'+rb+'_end_'+index);
    				Ext.getCmp('ShrinkResponseStringWindow').close();
    			},
    			icon: 'image/save.png',
                tooltip: '保存'
    	    }],
	    	listeners: {
				show: {
                    fn: function(window, eOpts){
                    	var lm = new Ext.LoadMask(Ext.getCmp('ShrinkResponseStringWindow'), { 
							msg : '执行中。。。', 
							removeMask : true
						}); 
						lm.show();
                    	Ext.Ajax.request( {
							url : 'job/getTestResponse',  
							params : {  
								path : Ext.getCmp('Base').folderName
							},
						    success : function(response, options) {
						    	lm.hide();
						    	var object=JSON.parse(response.responseText);
						    	if(object.success){
						    		var res=object.obj;
							    	Ext.getCmp('ServiceResTextArea').setValue(res);
						    	}else
						    		Ext.Msg.alert("错误",object.msg);
						    },
						    failure: function(response, opts) {
						    	lm.hide();
				             	Ext.Msg.alert("错误","获取响应失败");
				            }
						});
                    },
                    scope: me
                }
			}
        });
        me.callParent(arguments);
        Ext.getCmp("SaveButton").disabled=true;
        isLbSet = false;
        isRbSet = false;
        isIndexSet = false;
    }
});