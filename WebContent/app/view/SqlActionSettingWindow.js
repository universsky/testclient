var isSqlServer;

Ext.define('MyApp.view.SqlActionSettingWindow', {
    extend: 'Ext.window.Window',
    alias: 'widget.SqlActionSettingWindow',
    id: 'SqlActionSettingWindow',
    height: 510,
    width: 310,
    title: 'Sql动作设置',
    modal:true,
    resizable:false,
    initComponent: function() {
        var me = this;
        Ext.applyIf(me, {
	    	items: [
			{
					xtype:'form',
					id:'SqlActionSettingForm',
					url:'job/testDBConnection',
					height: 427,
					width: 305,
					items:[
					{
						xtype:'tbseparator',
						height: 10,
					},
					{
			   	    	xtype:'combobox',
			   	    	fieldLabel: '数据源',
			   	    	name: 'source',
			   	    	id:'ComboSource',
			   	    	layout : 'auto',
			   	    	store:['sql server', 'mysql'],
			   	    	editable:false,
			   	    	listeners: {
                        	'change': function(that, newValue, oldValue, eOpts){
	        			    	Ext.getCmp('TextServer').setValue('[[server]]');
	        			    	Ext.getCmp('TextPort').setValue('[[port]]');
	        			    	Ext.getCmp('TextDatabase').setValue('[[database]]');
                        		switch(newValue){
	                    			case "sql server":
	                    				Ext.getCmp("UserPwdContainsAuthenticationPanel").show();
	                    				Ext.getCmp("UserPwdPanel").hide();
	                    				Ext.ComponentQuery.query('#radioWindowAuth')[0].checked=true;
	                    				Ext.ComponentQuery.query('#TextUsername')[0].setValue('');
										Ext.ComponentQuery.query('#TextPassword')[0].setValue('');
										Ext.ComponentQuery.query('#TextUsername')[0].setDisabled(true);
										Ext.ComponentQuery.query('#TextPassword')[0].setDisabled(true);
										Ext.ComponentQuery.query('#TextUsername')[1].setValue('');
	    	        			    	Ext.ComponentQuery.query('#TextPassword')[1].setValue('');
	                    				isSqlServer=true;
	                    				break;
	                    			case "mysql":
	                    				Ext.getCmp("UserPwdPanel").show();
	                    				Ext.getCmp("UserPwdContainsAuthenticationPanel").hide();
	                    				Ext.ComponentQuery.query('#TextUsername')[1].setValue('[[username]]');
	    	        			    	Ext.ComponentQuery.query('#TextPassword')[1].setValue('[[password]]');
	    	        			    	Ext.ComponentQuery.query('#TextUsername')[0].setValue('');
	    	        			    	Ext.ComponentQuery.query('#TextPassword')[0].setValue('');
	                    				isSqlServer=false;
	                    				break;
	                    			default:
	                    				break;
                        		}
                        	}
                        }
			   	    },
			   	    {
				    	xtype:'tbseparator',
				    	height: 10,
				    },
			   	    {
			   	    	xtype:'textfield',
			   	    	fieldLabel: 'Server',
			   	    	name: 'server',
			   	    	id:'TextServer',
			   	    	layout : 'auto',
			   	    },
			   	    {
				    	xtype:'tbseparator',
				    	height: 10,
				    },
			   	    {
			   	    	xtype:'textfield',
			   	    	fieldLabel: 'Port',
			   	    	name: 'port',
			   	    	id:'TextPort',
			   	    	layout : 'auto',
			   	    },
			   	    {
				    	xtype:'tbseparator',
				    	height: 10,
				    },
				    {
				    	xtype:'panel',
				    	border:false,
				    	id:'UserPwdPanel',
				    	items:[
				    	{
					    	xtype:'textfield',
				   	    	fieldLabel: 'Username',
				   	    	name: 'username_mysql',
				   	    	itemId:'TextUsername',
				   	    	layout : 'auto',
					    },
					    {
					    	xtype:'tbseparator',
					    	height: 10,
					    },
					    {
					    	xtype:'textfield',
					    	fieldLabel: 'Password',
			    			inputType:'password',
						   	name: 'password_mysql',
						   	itemId:'TextPassword',
						   	layout : 'auto',
					    }]
				    },
				    {
				    	xtype:'panel',
				    	border:false,
				    	hidden:true,
				    	id:'UserPwdContainsAuthenticationPanel',
				    	items:[
						{
							xtype:'label',
							text:'验证方式：',
							height: 10,
						},
						{
							xtype:'radiogroup',
							id:'AuthenticationType',
							layout:{
						   		type:'vbox'
						   	},
							items:[
							    new Ext.form.Radio({boxLabel:'Windows验证',labelSeparator:'', name:'at',inputValue:"0",checked:true,itemId:'radioWindowAuth'}),
							    new Ext.form.Radio({boxLabel:'用户名密码验证',labelSeparator:'', name:'at',inputValue:"1"}),
							    new Ext.form.field.Text({
									fieldLabel: 'Username',
								   	name: 'username_sqlserver',
								   	itemId:'TextUsername',
								   	layout : 'auto',
								}),	
								new Ext.toolbar.Separator({height: 10}),
								new Ext.form.field.Text({
									fieldLabel: 'Password',
									inputType:'password',
								   	name: 'password_sqlserver',
								   	itemId:'TextPassword',
								   	layout : 'auto',
								}),	
							],
							listeners :{
								'change':function(that, newValue, oldValue, eOpts){
									switch (parseInt(newValue.at))
									{
									case 0:
										Ext.ComponentQuery.query('#TextUsername')[0].setValue('');
										Ext.ComponentQuery.query('#TextPassword')[0].setValue('');
										Ext.ComponentQuery.query('#TextUsername')[0].setDisabled(true);
										Ext.ComponentQuery.query('#TextPassword')[0].setDisabled(true);
										break;
									case 1:
										Ext.ComponentQuery.query('#TextUsername')[0].setDisabled(false);
										Ext.ComponentQuery.query('#TextPassword')[0].setDisabled(false);
										Ext.ComponentQuery.query('#TextUsername')[0].setValue('[[username]]');
										Ext.ComponentQuery.query('#TextPassword')[0].setValue('[[password]]');
										break;
									default:
										break;
									}
						    	}
							}
						}]
				    },			    
			   	    {
				    	xtype:'tbseparator',
				    	height: 10,
				    },
			   	    {
			   	    	xtype:'textfield',
			   	    	fieldLabel: '数据库',
			   	    	name: 'database',
			   	    	id:'TextDatabase',
			   	    	layout : 'auto',
			   	    },
			   	    {
				    	xtype:'tbseparator',
				    	height: 10,
				    },
				    {
						xtype:'label',
						text:'sql 增删改：',
					},
			   	    {
						xtype:'textarea',
						anchor: '100%',
						id:'TextAreaSql',
						height:110,
					},
			   	    {
			   	    	xtype:'textfield',
			    		hidden:true,
			    		value:Ext.getCmp('Base').folderName,
			    		name:'__HiddenView_path'
			   	    }]
			},
		    {
		    	xtype:'panel',
		    	layout:{
		    		type:'hbox'
		    	},
		    	items:[{
		    		xtype:'button',
		    		layout : 'auto',
		    		text: '连接测试',
		   	    	id: 'SqlActionSettingBtn',
		   	    	handler: function(button, event) {
		   	    		Ext.getCmp('SqlActionSettingForm').getForm().submit({
		   	    			waitMsg:'执行中...',
		            		success:function(form,action){
		            			if(action.result.success){
		            				Ext.getCmp('LabelResult').getEl().setStyle('background','green');
		            				Ext.getCmp('LabelResult').getEl().update('Pass');
		            			}
		            			else{
		            				Ext.getCmp('LabelResult').getEl().setStyle('background','red');
		            				Ext.getCmp('LabelResult').getEl().update('Fail');
		            			}
		            		},
		            		failure:function(form,action){
		            			Ext.getCmp('LabelResult').getEl().setStyle('background','red');
		            			Ext.getCmp('LabelResult').setText('Fail');
		            		}
		            	});
		            }
		    	},
		    	{
		    	xtype:'tbseparator',
		    	width: 10,
		    	},
		    	{
		    		xtype:'label',
		    		id: 'LabelResult',
		    		height:14,
		    		width: 30,
		    	}]
			},
			{
				xtype:'panel',
				layout:{
		    		type:'hbox'
		    	},
		    	items:[
    	        {
    	        	xtype: 'button',
	    			//id:'SaveSqlActionBtn',
                    handler: function(button, event) {
                    	var inputuser="",inputpwd="";
                    	if(Ext.getCmp('ComboSource').getValue()==""){
                    		Ext.Msg.alert('提示','数据源不能为空');
                    		return;
                    	}
                    	if(Ext.getCmp('TextServer').getValue()==""){
                    		Ext.Msg.alert('提示','Server不能为空');
                    		return;
                    	}
                    	if(Ext.getCmp('TextPort').getValue()==""){
                    		Ext.Msg.alert('提示','Port不能为空');
                    		return;
                    	}
                    	if(!isSqlServer){
                			inputuser=Ext.ComponentQuery.query('#TextUsername')[1].getValue();
                			inputpwd=Ext.ComponentQuery.query('#TextPassword')[1].getValue();
                		}else{
                			if(!Ext.getCmp('AuthenticationType').items.get(0).getValue()){
                				inputuser=Ext.ComponentQuery.query('#TextUsername')[0].getValue();
                        		if(inputuser==""){
                        			Ext.Msg.alert('提示','Username不能为空');
                        			return;
                        		}
                        		inputpwd=Ext.ComponentQuery.query('#TextPassword')[0].getValue();
            			    	if(inputpwd==""){
            			    		Ext.Msg.alert('提示','Password不能为空');
            			    		return;
            			    	}
                        	}
                		}
                    	if(Ext.getCmp('TextDatabase').getValue()==""){
                    		Ext.Msg.alert('提示','database不能为空');
                    		return;
                    	}
    			    	if(Ext.getCmp('TextAreaSql').getValue()==""){
    			    		Ext.Msg.alert('提示','Sql不能为空');
    			    		return;
    			    	}
    			    	if(Ext.getCmp('TextAreaSql').getValue().toUpperCase().indexOf('SELECT ') != -1){
    			    		Ext.Msg.alert('提示','不能包含查询语句！');
    			    		return;
    			    	}
                    	Ext.Ajax.request({
	        				url:"job/saveTestAction",
	        				params: { 
	        					testPath: Ext.getCmp('Base').folderName,
	        					sqlActionType: Ext.getCmp('MainPanel').ActionType,
	        					source:Ext.getCmp('ComboSource').getValue(),
	        					server:Ext.getCmp('TextServer').getValue(),
	        					port:Ext.getCmp('TextPort').getValue(),
	        					username:inputuser,
	        					password:inputpwd,
	        					database:Ext.getCmp('TextDatabase').getValue(),
	        					sql:Ext.getCmp('TextAreaSql').getValue()
	        				},
	        			    success: function(response, opts) {
	        			    	Ext.getCmp('SqlActionSettingWindow').close();
	        			    },
	        			    failure: function(response, opts) {
	        			    	Ext.Msg.alert('提示','请求失败');
	        			    }
	        			});
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
	    			//id:'CleanSqlActionBtn',
                    handler: function(button, event) {
                    	Ext.Ajax.request({
	        				url:"job/cleanTestAction",
	        				params: { 
	        					testPath: Ext.getCmp('Base').folderName,
	        					sqlActionType: Ext.getCmp('MainPanel').ActionType
	        				},
	        			    success: function(response, opts) {
	        			    	Ext.getCmp('ComboSource').setValue('');
	        			    	Ext.getCmp('TextServer').setValue('');
	        			    	Ext.getCmp('TextPort').setValue('');
	        			    	Ext.ComponentQuery.query('#TextUsername')[0].setValue('');
	        			    	Ext.ComponentQuery.query('#TextPassword')[0].setValue('');
	        			    	Ext.ComponentQuery.query('#TextUsername')[1].setValue('');
	        			    	Ext.ComponentQuery.query('#TextPassword')[1].setValue('');
	        			    	Ext.getCmp('TextDatabase').setValue('');
	        			    	Ext.getCmp('TextAreaSql').setValue('');
	        			    },
	        			    failure: function(response, opts) {
	        			    	Ext.Msg.alert('提示','请求失败');
	        			    }
	        			});
                    },
                    icon: 'image/clean.png',
                    tooltip: '清空'
		    	}]
			}],
	    	listeners: {
				show: {
	                fn: function(window, eOpts){
	                	Ext.Ajax.request({
	        				url:"job/getTestAction",
	        				params: { 
	        					testPath: Ext.getCmp('Base').folderName,
	        					sqlActionType: Ext.getCmp('MainPanel').ActionType
	        				},
	        			    success: function(response, opts) {
	        			    	var obj=JSON.parse(response.responseText).obj;
	        			    	if(obj!=null){
		        			    	Ext.getCmp('ComboSource').setValue(obj.source);
		        			    	Ext.getCmp('TextServer').setValue(obj.server);
		        			    	Ext.getCmp('TextPort').setValue(obj.port);
		        			    	Ext.getCmp('TextDatabase').setValue(obj.database);
		        			    	Ext.getCmp('TextAreaSql').setValue(obj.sql);
		        			    	if(obj.username=='' && obj.password == ""){
		        			    		Ext.getCmp('AuthenticationType').items.get(4).setValue(true)
		        			    	}else{
		        			    		Ext.getCmp('AuthenticationType').items.get(0).setValue(true);
		        			    	}
		        			    	if(obj.source=='mysql'){
		        			    		Ext.ComponentQuery.query('#TextUsername')[1].setValue(obj.username);
			        			    	Ext.ComponentQuery.query('#TextPassword')[1].setValue(obj.password);
		        			    	}else if(obj.source=='sql server'){
		        			    		Ext.ComponentQuery.query('#TextUsername')[0].setValue(obj.username);
			        			    	Ext.ComponentQuery.query('#TextPassword')[0].setValue(obj.password);
		        			    	}
	        			    	}else{
	        			    		Ext.getCmp('ComboSource').setValue('');
		        			    	Ext.getCmp('TextServer').setValue('');
		        			    	Ext.getCmp('TextPort').setValue('');
		        			    	Ext.ComponentQuery.query('#TextUsername')[0].setValue('');
		        			    	Ext.ComponentQuery.query('#TextPassword')[0].setValue('');
		        			    	Ext.ComponentQuery.query('#TextUsername')[1].setValue('');
		        			    	Ext.ComponentQuery.query('#TextPassword')[1].setValue('');
		        			    	Ext.getCmp('TextDatabase').setValue('');
		        			    	Ext.getCmp('TextAreaSql').setValue('');
	        			    	}
	        			    },
	        			    failure: function(response, opts) {
	        			    	Ext.Msg.alert('提示','请求失败');
	        			    }
	        			});
	                },
	                scope: me
	            }
			}
        });
        me.callParent(arguments);
    }
});