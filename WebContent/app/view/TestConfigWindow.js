Ext.define('MyApp.view.TestConfigWindow', {
    extend: 'Ext.window.Window',
    alias: 'widget.TestConfigWindow',
    height: 700,
    id: 'TestConfigWindow',
    width: 900,
    modal:true,
    layout: {
        type: 'fit'
    },
    resizable:false,
    title: '配置http(s)测试',
    initComponent: function() {
        var me = this;
        Ext.applyIf(me, {
        	items:[
        		{
        			xtype:'form',
        			id:"TestConfigForm",
        			url:'job/saveConfig',
        			items:[
        				{	
        					xtype:'textfield',
        					name: 'folderName',
        					hidden:true,
        					value:Ext.getCmp('Base').folderName
        				},		
        				{
        					xtype:'textfield',
        					anchor: '100% 5%',
        					margin:'5 10 5 0',
        					fieldLabel: 'url',
        					value:'[[url]]',
        					name: 'path'
        				},
        				{
        					xtype:'combo',
        					anchor: '100% 5%',
        					margin:'5 10 5 0',
        					fieldLabel: 'method',
        					value: 'default',
        					store:['default','PUT','DELETE'],
        					name: 'method',
        					editable:false
        				},
        				{
        					xtype:'textarea',
        					anchor: '100% 40%',
        					margin:'5 10 5 0',
        					fieldLabel: 'body',
        					name: 'body',
        					id: 'RequestBodyTextArea'
        				},
        				{
        					xtype:'textarea',
        					anchor: '100% 16%',
        					margin:'5 10 5 0',
        					fieldLabel: 'headers',
        					name: 'headers',
        					id: 'RequestHeadersTextArea'
        				},
        				{
        					xtype:'textarea',
        					anchor: '100% 30%',
        					margin:'5 10 5 0',
        					fieldLabel: 'parameters',
        					name: 'parameters',
        					id:'ParametersTextArea',
        				},        				
                        {
                            xtype: 'button',
                            anchor: '10% 5%',
                            handler: function(button, event) {
                            	var form=Ext.getCmp('TestConfigForm').getForm();
                            	form.submit({
                            		success:function(form,action){
                            			Ext.getCmp('MainPanel').buildRequestForm(Ext.getCmp('Base').folderName);
                            			me.close();
                            		},
                            		failure:function(form,action){
                            			Ext.Msg.alert('提示','请求失败');
                            			me.close();		
                            		}
                            	
                            	});
                            },
                            text: '保存'
                        },
						{
                            xtype: 'button',
                            anchor: '15% 5%',
                            handler: function(button, event) {
                            	Ext.widget("GenerateParametersWindow").show();
                            },
                            text: '生成Parameter工具'
                        },
                        {
                            xtype: 'button',
                            anchor: '15% 5%',
                            handler: function(button, event) {
                            	Ext.widget("FormatSoa1XmlWindow").show();
                            },
                            text: 'FormatSOA1.0Xml'
                        }
        			]
        		}
        	]
        });
        me.callParent(arguments);
    },
    listeners:{
    	'show':{
    		fn:function(){
    			Ext.Ajax.request({
    				url:"job/getConfig",
    				params: { folderName: Ext.getCmp('Base').folderName },
    			    success: function(response, opts) {
                     var obj = Ext.decode(response.responseText);
					if(obj.success){
						var record=obj.obj;
						if(record!=null){
							var form=Ext.getCmp('TestConfigForm').getForm();
							form.findField('body').setValue(record.body);
							form.findField('folderName').setValue(record.folderName);
							form.findField('headers').setValue(record.headers);
							form.findField('parameters').setValue(record.parameters);
							form.findField('path').setValue(record.path);
							if(record.method){
								form.findField('method').setValue(record.method);
							}
						}
						else{
							Ext.Msg.alert("提示",obj.msg);
						}
					}
                 },
                 failure: function(response, opts) {
                     Ext.Msg.alert('提示','请求失败');
                 }
    			});
    		},
    		scope:this
    	}
    }
    
});
