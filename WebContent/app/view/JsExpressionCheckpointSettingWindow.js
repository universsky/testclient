Ext.define('MyApp.view.JsExpressionCheckpointSettingWindow', {
    extend: 'Ext.window.Window',
    alias: 'widget.JsExpressionCheckpointSettingWindow',
    height: 700,
    id: 'JsExpressionCheckpointSettingWindow',
    modal:true,
    width: 500,
    layout: {
        type: 'vbox'
    },
    resizable:false,
    title: 'Javascript表达式验证',

    initComponent: function() {
        var me = this;
        Ext.applyIf(me, {
            items: [
                {
                	xtype:'label',
                	text:'response text：'
                },
            	{
            		xtype:'textarea',
            		flex:16,
            		anchor:"100% 90%",
            		width:500,
            		id:"ResText",
            		height:600,
            		autoScroll:true
            	},
            	{
            		xtype:'panel',
            		layout:'hbox',
            		items:[
        		       {
        		    	   xtype:'textfield',
        		    	   id:"JsExpLBound",
        		    	   labelWidth:50,
        		    	   width:250,
        		    	   fieldLabel:'左边界'
        		       },
        		       {
        		    	   xtype:'textfield',
        		    	   id:"JsExpRBound",
        		    	   labelWidth:50,
        		    	   width:250,
        		    	   fieldLabel:'右边界'
        		       }
            		]
            	},
            	{
            		xtype:'panel',
            		width:500,
            		layout:'hbox',
            		items:[
						{
							xtype:'label',
							id:'JsExpPrefix',
						},
						{
							xtype:'textfield',
							id:'JavascriptExpression'
						}
            		]
            	},
            	{
            		xtype:'panel',
            		layout:'hbox',
            		items:[
        		       {
        		    	   xtype:'button',
        		    	   flex:1,
        		    	   text:'测试一下',
        		    	   anchor:"10% 5%",
        		    	   handler:function(){
        		    		   var text=me.getObjectText();
        		    		   if(text.indexOf("ERR:没找到")!=0){
        		    			   if(me.isValid(text)){
            		    			   var exp=Ext.getCmp('JavascriptExpression').getValue();
            		    			   text='"'+text.replace(new RegExp("\"","gm"),"\\\"")+'"';
            		    			   var pre=Ext.getCmp('JsExpPrefix').text.replace('objtext',text);
            		    			   try{
            		    				   var bool=eval(pre+exp);
                		    			   if(bool){
                		    				   Ext.getCmp('JsExpTestResult').getEl().setStyle('background','green');
                		    				   Ext.getCmp('JsExpTestResult').setText('Pass');
                		    			   }else{
                		    				   Ext.getCmp('JsExpTestResult').getEl().setStyle('background','red');
                		    				   Ext.getCmp('JsExpTestResult').setText('Fail.');
                		    			   }
            		    			   }catch(e){
            		    				   Ext.getCmp('JsExpTestResult').getEl().setStyle('background','red');
            		    				   Ext.getCmp('JsExpTestResult').setText(e.message);
            		    			   }
            		    		   }else{
            		    			   Ext.Msg.alert("错误","不是合法的JSON或XML文本");
            		    		   }
        		    		   }else{
        		    			   Ext.Msg.alert("错误",text);
        		    		   }
        		    	   }
        		       },
        		       {
        		    	   id:'JsExpTestResult',
        		    	   width:390,
        		    	   xtype:'label'
        		       },
        		       {
							xtype:'tbseparator'
        		       },
        		       {
	                   		xtype:'button',
	                   		arrowAlign:'right',
	                   		flex:1,
	                   		text:'保存',
	                   		anchor:"10% 5%",
	                   		resultStr:"",
	                   		handler:function(){
	                   			var text=me.getObjectText();
	                   			if(text.indexOf("ERR:没找到")!=0){
        		    			   if(me.isValid(text)){
        		    				   var lb=Ext.getCmp('JsExpLBound').getValue();
        		    				   var rb=Ext.getCmp('JsExpRBound').getValue();
            		    			   var exp=Ext.getCmp('JsExpPrefix').text+Ext.getCmp('JavascriptExpression').getValue();
        		    				   Ext.getCmp("CheckInfoTextArea").setValue(lb+'<EOF>'+rb+'<EOF>'+exp);
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
						    			Ext.getCmp('JavascriptExpression').setWidth(395);
						    			labeltext='JSON.parse(objtext).';
						    		}else if(res.indexOf('<') >= 0 && res.indexOf('>') > res.indexOf('<')){
						    			Ext.getCmp('JavascriptExpression').setWidth(195);
						    			labeltext='new DOMParser().parseFromString(objtext,"text/xml").';
						    		}
						    		Ext.getCmp('JsExpPrefix').setText(labeltext);
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
    	var res=Ext.getCmp('ResText').getValue().replace(new RegExp("\n","gm"),"").replace(new RegExp("\r","gm"),"");
    	var lb=Ext.getCmp('JsExpLBound').getValue();
    	var rb=Ext.getCmp('JsExpRBound').getValue();
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
    			return res.substring(0,epos+1);
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