var serverStore=new Ext.data.Store({
	autoLoad:false,
	proxy:{
		type: 'jsonp',
		url:Ext.util.Cookies.get('MobileSvcUrl')+'ServerList',
        callbackKey: 'testclient_callback',
		getMethod: function(){ return 'GET'; },
        reader: {
            type: 'json',
            root: 'items'
        },
        writer: {
            type: 'json',
            allowSingle: false
        },
        afterRequest: function(request, success) {
            if(!success){
                Ext.Msg.alert('错误','serverStore请求失败');
                return;
            }else{
            	var items=serverStore.data.items;
            	var data=[];
            	for(var i=0;i<items.length;i++){
            		items[i].data.value=JSON.stringify(items[i].raw);
            		data.push(items[i]);
        		}
            	serverStore.loadData(data);
            }
        }
	},
	fields:['name','value']
});

var serviceStore=new Ext.data.Store({
	autoLoad:false,
	proxy:{
		type: 'jsonp',
		url:Ext.util.Cookies.get('MobileSvcUrl')+'ServiceList',
        callbackKey: 'testclient_callback',
		getMethod: function(){ return 'GET'; },
        reader: {
            type: 'json',
            root: 'items'
        },
        writer: {
            type: 'json',
            allowSingle: false
        },
        afterRequest: function(request, success) {
            if(!success){
                Ext.Msg.alert('错误','serviceStore请求失败');
                return;
            }else{
            	var items=serviceStore.data.items;
            	var data=[];
            	for(var i=0;i<items.length;i++){
            		var servicename=items[i].raw.name;
            		servicename=servicename.split('.')[servicename.split('.').length-1];
            		items[i].data.name=items[i].raw.code+' - '+servicename;
            		if(Ext.getCmp('FilterText').getValue()){
            			if(!new RegExp(Ext.getCmp('FilterText').getValue()).test(items[i].data.name)){
                			continue;
                		}
            		}
            		data.push(items[i]);
        		}
            	serviceStore.loadData(data);
            	Ext.getCmp('MatchedItemText').setText(data.length+' matched');
            }
        }
	},
	fields:['name','code']
});

Ext.define('MyApp.view.SocketTestConfigWindow', {
    extend: 'Ext.window.Window',
    alias: 'widget.SocketTestConfigWindow',
    height: 700,
    id: 'SocketTestConfigWindow',
    width: 900,
    modal:true,
    layout: {
        type: 'fit'
    },
    title: '配置socket测试',
    resizable:false,
    initComponent: function() {
        var me = this;
        Ext.applyIf(me, {
        	items:[
        		{
        			xtype:'form',
        			id:"SocketTestConfigForm",
        			url:'job/saveSocketTestConfig',
        			items:[
						{	
							xtype:'textfield',
							name: 'folderName',
							hidden:true,
							value:Ext.getCmp('Base').folderName
						},
        				{
							xtype:'panel',
							layout:'hbox',
							border:false,
							margin:'5 0 2 0',
							items:[
							   {
						    	   xtype:'combo',
						    	   anchor: '25% 5%',
						    	   labelWidth:100,
						    	   fieldLabel: 'Server',
						    	   name: 'server',
						    	   store: serverStore,
						    	   displayField:'name',                                
						    	   valueField:'value',
						    	   enableKeyEvents:true,
						    	   editable:false,
						    	   listeners: {
						        		change : {
							        		fn: me.getServerInfoByName,
							        		scope: me
							        	}
						    	   }
						       },
						       {
							    	xtype:'tbseparator',
							    	width:20,
							   },
						       {
		        					xtype:'textfield',
		        					anchor: '20% 5%',
		        					labelWidth:30,
		        					fieldLabel: 'IP',
		        					name: 'ip'
		        					//regex:/^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/,
		        			    	//regexText:"IP地址不合法"
						       },
						       {
							    	xtype:'tbseparator',
							    	width:20,
							   },
						       {
		        					xtype:'textfield',
		        					anchor: '15% 5%',
		        					fieldLabel: 'Port',
		        					labelWidth:30,
		        					name: 'port'
		        					//regex:/^[-+]?\d*$/,
		        					//regexText:"必须为数字"
						       },
						       {
							    	xtype:'tbseparator',
							    	width:20,
							   },
						       {
						    	   xtype:'combo',
						    	   anchor: '20% 5%',
						    	   fieldLabel: 'Protocol',
						    	   labelWidth:50,
						    	   store:['TCP','HTTP','SSL'],
						    	   value:'TCP',
						    	   editable:false,
						    	   name: 'protocol'
						       }
							]
						},
						{
							xtype:'panel',
							layout:'vbox',
							border:false,
							margin:'2 0 2 0',
							items:[
								{
								   xtype:'panel',
								   layout:'hbox',
								   width:875,
								   border:false,
								   margin:'2 0 2 0',
								   items:[
								       {
										   xtype:'combo',
										   store:serviceStore,
										   displayField:'name',                                
								    	   valueField:'code',
								    	   enableKeyEvents:true,
										   flex:25,
										   labelWidth:100,
										   editable:false,
								    	   fieldLabel: 'Service',
								    	   id:'SocketServiceCombo',
										   name: 'service',
										   listeners: {
								        		change : {
									        		fn: me.getRequestBodyByService,
									        		scope: me
									        	}
								    	   }
							           },
							           {
									    	xtype:'tbseparator',
									    	width:20,
									   },
							           {
										   xtype:'textfield',
										   id:'FilterText',
										   flex:10,
										   emptyText:'输入过滤正则',
										   listeners: {
								        		change : {
									        		fn: me.filterService,
									        		scope: me
									        	}
								    	   }
							           },
							           {
									    	xtype:'tbseparator',
									    	width:20,
									   },
							           {
										   xtype:'label',
										   id:'MatchedItemText',
										   flex:11,
										   text: '',
										   style: {
									            color: 'blue'
									       }
							           }
								   ]
								},
								{
									xtype:'panel',
									layout:'hbox',
									margin:'2 0 2 0',
									width:875,
									border:false,
									items:[
								       {
								    	   xtype:'combo',
								    	   labelWidth:100,
								    	   id:'DatagramVersionCombobox',
										   fieldLabel: 'Datagram Version',
										   name: 'dataversion',
										   editable:false,
										   value:'5',
										   store:['5','4','3','2']
							           },
							           {
									    	xtype:'tbseparator',
									    	width:20,
									   },
							           {
										   xtype:'checkbox',
										   boxLabel:'返回报文缩进',
										   checked:true,
										   name:'indented',
							           }
								   ]
								}
							]
						},
        				{
        					xtype:'textarea',
        					anchor: '100% 28%',
        					margin:'5 10 5 0',
        					fieldLabel: 'body',
        					name: 'body',
        					id: 'SocketRequestBodyTextArea'
        				},
        				{
        					xtype:'textarea',
        					anchor: '100% 28%',
        					margin:'5 10 5 0',
        					fieldLabel: 'headers',
        					name: 'headers',
        					id: 'SocketRequestHeadTextArea'
        				},
        				{
        					xtype:'textarea',
        					anchor: '100% 26%',
        					margin:'5 10 5 0',
        					fieldLabel: 'parameters',
        					name: 'parameters',
        					id:'SocketParameterTextArea',
        				},        				
                        {
                            xtype: 'button',
                            anchor: '10% 5%',
                            handler: function(button, event) {
                            	var form=Ext.getCmp('SocketTestConfigForm').getForm();
                            	form.submit({
                            		params:{
                            			serviceDescription:Ext.getCmp('SocketServiceCombo').rawValue
                            		},
                            		success:function(form,action){
                            			Ext.getCmp('MainPanel').buildRequestForm(Ext.getCmp('Base').folderName);
                            			me.close();
                            		},
                            		failure:function(form,action){
                            			Ext.Msg.alert('提示','请求失败');
                            			me.close();		
                            		},
                            		waitMsg:'saving...'
                            	});
                            },
                            text: '保存'
                        },
                        {
                            xtype: 'button',
                            anchor: '10% 5%',
                            handler: function(button, event) {
                            	Ext.widget("ConvertDatagramWindow").show();
                            },
                            text: '数据报文转换'
                        }
        			]
        		}
        	],
        	listeners: {
				'show': {
					fn:function(){
		    			var lm = new Ext.LoadMask(Ext.getCmp('SocketTestConfigWindow'), { 
		    				msg : 'hold on...', 
		    				removeMask : true
		    			}); 
		    			me.readSocketDetail(lm);
		    		},
                    scope: me
                }
			}
        });
        me.callParent(arguments);
    },
    readSocketDetail:function(lm){
    	lm.show();
    	Ext.Ajax.request({
			url:"job/getSocketTestConfig",
			params: { 
				folderName: Ext.getCmp('Base').folderName
			},
		    success: function(response, opts) {
		    	lm.hide();
		    	var obj = Ext.decode(response.responseText);
				if(obj.success){
					var record=obj.obj;
					if(record!=null){
						var form=Ext.getCmp('SocketTestConfigForm').getForm();
						form.findField('server').setValue(record.server.name);
						form.findField('ip').setValue(record.server.ip);
						form.findField('port').setValue(record.server.port);
						form.findField('protocol').setValue(record.server.protocol);
						form.findField('dataversion').setValue(record.datagramVersion);
						form.findField('indented').setValue(record.indented);
						form.findField('body').setValue(record.body);
						form.findField('headers').setValue(record.head);
						var map=record.parameters;
						var p='';
						for (var key in map){
							p+=Ext.encode(map[key])+";\r\n";
					    }
						form.findField('parameters').setValue(p);
						form.findField('service').setValue(record.serviceDescription);
					}else{
						Ext.Msg.alert("提示",obj.msg);
					}
		    	}else{
		    		lm.show();
		    		Ext.data.JsonP.request({    
		    	        url:Ext.util.Cookies.get('MobileSvcUrl')+'RequestHead',
		    	        callbackKey: 'testclient_callback',
		    	        success: function(response){
		    	        	lm.hide();
		    	        	var headtext=response.requestHead;
		    	        	var form=Ext.getCmp('SocketTestConfigForm').getForm();
		    	        	form.findField('headers').setValue(headtext);
		    	        },    
		    	        failure: function(response){
		    	        	lm.hide();
		    	        	Ext.Msg.alert("Error","RequestHead request failure.");
		    	        },
		    	        callback: function(){
		    	        }
		    		});
		    	}
         	},
         	failure: function(response, opts) {
         		lm.hide();
         		Ext.Msg.alert('提示','请求失败');
            }
		});
    },
    getServerInfoByName:function( that, newValue, oldValue, eOpts ){
    	if(newValue){
    		try{
        		var serverInfo=Ext.decode(newValue);
            	var form=Ext.getCmp('SocketTestConfigForm').getForm();
            	form.findField('ip').setValue(serverInfo.ip);
            	form.findField('port').setValue(serverInfo.port);
            	form.findField('protocol').setValue(serverInfo.protocol);
        	}catch(e){
        		console.log(e);
        	}
    	}
    },
    getRequestBodyByService:function( that, newValue, oldValue, eOpts ){
    	var code=newValue;
    	if(Ext.getCmp('SocketServiceCombo').rawValue.indexOf(" - ")!=-1 && code!="" && code.indexOf(" - ")==-1){
    		var lm = new Ext.LoadMask(Ext.getCmp('SocketTestConfigForm').getForm().findField('body'), { 
    			msg : 'hold on...', 
    			removeMask : true
    		});
        	lm.show();
        	Ext.data.JsonP.request({    
    	        url:Ext.util.Cookies.get('MobileSvcUrl')+'AutoFill/'+code,
    	        callbackKey: 'testclient_callback',
    	        success: function(response){
    	        	lm.hide();
    	        	var bodytext=response.body;
    	        	var form=Ext.getCmp('SocketTestConfigForm').getForm();
    	        	form.findField('body').setValue(bodytext);
    	        },    
    	        failure: function(response){
    	        	lm.hide();
    	        	Ext.Msg.alert("Error","AutoFill request failure.");
    	        },
    	        callback: function(){
    	        }
    		});
    	}
    },
    filterService:function(that, newValue, oldValue, eOpts){
    	serviceStore.load();
    }
    
});