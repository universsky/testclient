var JsExpressionStore=new Ext.data.Store({
	model: 'testmocker.model.Parameter',
    storeId: 'JsExpressionStore',
    pageSize: 9999,
    proxy:{
		type:"memory",
		reader:{
			type:"json",
			root:'jsexp',
		}
	},
	fields:[
        {
        	name: 'expression',
        	type: 'string'
        }
    ],
	data:[]
});

Ext.define('MyApp.view.JsExpressionCheckpointSettingWindow', {
    extend: 'Ext.window.Window',
    alias: 'widget.JsExpressionCheckpointSettingWindow',
    id: 'JsExpressionCheckpointSettingWindow',
    modal:true,
    height: 650,
    width: 950,
    layout: {
        type: 'border'
    },
    resizable:false,
    title: 'Javascript表达式验证',

    initComponent: function() {
        var me = this;
        Ext.applyIf(me, {
            items: [
                {
                	xtype:'panel',
                	title:'response text',
                	width:450,
                	height: 650,
                	region:'west',
                	layout: 'vbox',
                	items:[
					{
						xtype:'textarea',
						width:450,
						id:"ResText",
						flex:22,
						autoScroll:true
					},
					{
						xtype:'textfield',
						id:"JsExpLBound",
						labelWidth:50,
						width:445,
						flex:1,
						fieldLabel:'左边界'
					},
			        {
			        	xtype:'textfield',
			        	id:"JsExpRBound",
			        	labelWidth:50,
			        	width:445,
			        	flex:1,
			        	fieldLabel:'右边界'
			        }]
                },
            	{
            		xtype:'panel',
            		region:'east',
            		width:480,
            		height: 650,
            		layout:'vbox',
            		items:[
						{
							xtype:'label',
							id:"JsObjDefText",
							flex:1,
							width:480,
						},
						{
							xtype:'gridpanel',
							flex:22,
							width:480,
							id: 'JsExpressionGrid',
        					title: 'javascript条件表达式',
        					mode:'local',
        	                autoFill : true,
        					store: JsExpressionStore,
        	                dockedItems: [
        	                {
        	                    xtype: 'toolbar',
        	                    dock: 'top',
        	                    items: [
        	                    {
        	                        xtype: 'button',
        	                        handler: function(button, event) {
        	                        	JsExpressionStore.insert(0,{});
        	                            var rowEdit = Ext.getCmp('JsExpressionGrid').getPlugin("JsExpEditPlugin");
        	                            rowEdit.startEdit(0,1); 
        	                        },
        	                        icon: 'image/add.png',
        	                        tooltip: '新增表达式'
        	                    }]
        	                }],
        	                plugins: [
        	                    Ext.create('Ext.grid.plugin.RowEditing', {
        	                        pluginId: 'JsExpEditPlugin',
        	                        autoCancel:true,
        	                        listeners: {
        	                        	edit: {
        				                    fn: function(editor, context, eOpts) {
        				                    },
        				                    scope: me
        	                        	}
        	                        }
        	                    })
        	                ],
        					columns:[
								{
									header:"条件表达式",
									flex:11,
									dataIndex:"expression",
									editor: {
        						    	xtype: 'textfield',
        		                        allowBlank:false
        						    }
								},
        						{
								    xtype: 'actioncolumn',
								    header:"测试",
								    flex:1,
								    items: [
								    {
								        handler: function(view, rowIndex, colIndex, item, e, record, row) {
								        	var text=me.getObjectText();
								        	if(text.indexOf("ERR:没找到")!=0){
								        		if(me.isValid(text)){
								        			var definition=Ext.getCmp('JsObjDefText').text;
								        			text='"'+text.replace(new RegExp("\"","gm"),"\\\"")+'"';
								        			definition=definition.replace('objtext',text);
								        			try{
								        				var bool=eval(definition+record.data.expression);
								        				if(bool){
								        					row.childNodes[2].firstChild.style.background="green";
								        					row.childNodes[2].firstChild.firstChild.nodeValue='Pass.';
								        				}else{
								        					row.childNodes[2].firstChild.style.background="red";
								        					row.childNodes[2].firstChild.firstChild.nodeValue='Fail.';
								        				}
								        			}catch(e){
								        				row.childNodes[2].firstChild.style.background="red";
								        				row.childNodes[2].firstChild.firstChild.nodeValue=e.message;
								        			}
								        		}else{
								        			Ext.Msg.alert("错误","不是合法的JSON或XML文本");
								        		}
								        	}else{
								        		Ext.Msg.alert("错误",text);
								        	}
								        },
								        icon: 'image/execution.png',
								        tooltip: '测试'
								    }]
								},
								{
									header:"测试结果",
									flex:4,
								},
								{
								    xtype: 'actioncolumn',
								    header:"删除",
								    flex:1,
								    items: [
								    {
								        handler: function(view, rowIndex, colIndex, item, e, record, row) {
								        	Ext.MessageBox.confirm("confirm","确认删除？",
									            function(e){
									                if(e=='yes'){
									                	JsExpressionStore.removeAt(rowIndex);
									                	JsExpressionStore.sync();
									                }
									            }
								            );
								        },
								        icon: 'image/delete.png',
								        tooltip: '删除'
								    }]
								}
        					]
						},
						{
	                   		xtype:'button',
	                   		flex:1,
	                   		text:'保存',
	                   		anchor:"10% 5%",
	                   		handler:function(){
	                   			var text=me.getObjectText();
	                   			if(text.indexOf("ERR:没找到")!=0){
        		    			   if(me.isValid(text)){
        		    				   var lb=Ext.getCmp('JsExpLBound').getValue();
        		    				   var rb=Ext.getCmp('JsExpRBound').getValue();
        		    				   var exps="";
        		    				   JsExpressionStore.data.items.forEach(function(item){
	                            			if(item.data.expression){
	                            				exps=exps+item.data.expression+"`";
	                            			}
	                            		});
        		    				   Ext.getCmp("CheckInfoTextArea").setValue(lb+'<EOF>'+rb+'<EOF>'+exps.substring(0,exps.length-1));
        		    				   Ext.getCmp("JsExpressionCheckpointSettingWindow").close();
            		    		   }else{
            		    			   Ext.Msg.alert("错误","不是合法的JSON或XML文本");
            		    		   }
        		    		   }else{
        		    			   Ext.Msg.alert("错误",text);
        		    		   }
		                   	}
	                   	}
            		]
            	}
            ],
            listeners: {
	    		show: {
                    fn: function(window, eOpts){
                    	var lm = new Ext.LoadMask(Ext.getCmp('JsExpressionCheckpointSettingWindow'), { 
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
						    		Ext.getCmp('ResText').setValue(res);
						    		var labeltext='';
						    		if(res.indexOf('{') >= 0 && res.indexOf('}') > res.indexOf('{')){
						    			labeltext='var obj=JSON.parse(objtext);';
						    		}else if(res.indexOf('<') >= 0 && res.indexOf('>') > res.indexOf('<')){
						    			labeltext='var obj=new DOMParser().parseFromString(objtext,"text/xml");';
						    		}
						    		Ext.getCmp('JsObjDefText').setText(labeltext);
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
    },
    getObjectText:function(){
    	var lb=Ext.getCmp('JsExpLBound').getValue();
    	var rb=Ext.getCmp('JsExpRBound').getValue();
    	var res=Ext.getCmp('ResText').getValue().replace(new RegExp("\n","gm"),"").replace(new RegExp("\r","gm"),"");
    	if(res.indexOf("{")>-1 && res.indexOf("{")<res.indexOf("}")){
    		res=res.replace(new RegExp(" ","gm"),"");
    		lb=lb.replace(new RegExp(" ","gm"),"");
    		rb=rb.replace(new RegExp(" ","gm"),"");
    	}
    	if(lb){
    		var spos=res.indexOf(lb);
    		if(spos!=-1){
    			spos+=lb.length;
    			res=res.substr(spos);
    		}else{
    			return "ERR:没找到"+lb;
    		}
    	}
    	if(rb){
    		var epos=res.indexOf(rb);
    		if(epos!=-1){
    			return res.substring(0,epos);
    		}else{
    			return "ERR:没找到"+rb;
    		}
    	}
    	return res;
    },
    isValid:function(text){
		if(text.indexOf('{') == 0 && text.indexOf('}') > 0){
			var json=this.getJson(text);
			if(json!=null && typeof(json) == "object" && Object.prototype.toString.call(json).toLowerCase() == "[object object]" && !json.length){
				return true;
			}else{
				return false;
			}
		}else if(text.indexOf('<') != -1 && text.indexOf('>') != -1){
			var doc=this.getXmlDoc(text);
			if(doc.firstChild.firstChild!=null){
				if(doc.firstChild.firstChild.nodeName=="parsererror"){
					return false;
				}
				if(doc.firstChild.firstChild.firstChild!=null){
					if(doc.firstChild.firstChild.firstChild.nodeName=="parsererror"){
						return false;
    				}
				}
			}
			return true;
		}else{
			return false;
		}
    },
    getXmlDoc:function(xmlString){
        var xmlDoc=null;
        //IE浏览器 
        if(!window.DOMParser && window.ActiveXObject){   //window.DOMParser 判断是否是非ie浏览器
            var xmlDomVersions = ['MSXML.2.DOMDocument.6.0','MSXML.2.DOMDocument.3.0','Microsoft.XMLDOM'];
            for(var i=0;i<xmlDomVersions.length;i++){
                try{
                    xmlDoc = new ActiveXObject(xmlDomVersions[i]);
                    xmlDoc.async = false;
                    xmlDoc.loadXML(xmlString); //loadXML方法载入xml字符串
                    break;
                }catch(e){
                }
            }
        }
        //Mozilla浏览器
        else if(window.DOMParser && document.implementation && document.implementation.createDocument){
            try{
                /* DOMParser 对象解析 XML 文本并返回一个 XML Document 对象。
                 * 要使用 DOMParser，使用不带参数的构造函数来实例化它，然后调用其 parseFromString() 方法
                 * parseFromString(text, contentType) 参数text:要解析的 XML 标记 参数contentType文本的内容类型
                 * 可能是 "text/xml" 、"application/xml" 或 "application/xhtml+xml" 中的一个。注意，不支持 "text/html"。
                 */
                domParser = new  DOMParser();
                xmlDoc = domParser.parseFromString(xmlString, 'text/xml');
            }catch(e){
            }
        }
        else{
            return null;
        }
        return xmlDoc;
    },
    getJson:function(obj){
    	try{
    		obj=Ext.decode(obj);
    	}catch(e){
    		obj=null;
    	}
    	return obj; 
    }
});