
Ext.define('MyApp.view.GenerateParametersWindow', {
    extend: 'Ext.window.Window',
    alias: 'widget.GenerateParametersWindow',
    height: 400,
    id: 'GenerateParametersWindow',
    modal:true,
    width: 400,
    layout: {
        type: 'vbox'
    },
    title: 'Json/Xml字符串转换Parameter',
    resizable:false,
    initComponent: function() {
        var me = this;
        Ext.applyIf(me, {
            items: [
        	{
        		xtype:'label',
        		flex:1,
        		anchor:"10% 5%",
        		text:'请输入json或xml文本，点击“生成”按钮'
        	},
        	{
        		xtype:'textarea',
        		flex:16,
        		anchor:"100% 90%",
        		id:"Text2Parameters",
        		width:400,
        		height:300,
        		autoScroll:true
        	},
        	{
        		xtype:'button',
        		text:'生成',
        		anchor:"10% 5%",
        		handler:function(){
        			var paraminfos=[];
        			var text=Ext.getCmp('Text2Parameters').getValue();
        			if(text.indexOf('{') == 0 && text.indexOf('}') > 0){
        				var json=me.getJson(text);
        				if(json!=null && typeof(json) == "object" && Object.prototype.toString.call(json).toLowerCase() == "[object object]" && !json.length){
        					me.returnParaInfosFromJson(json,paraminfos);
        				}else{
        					Ext.Msg.alert("错误","不是合法的JSON");
        					return;
        				}
        			}else if(text.indexOf('<') != -1 && text.indexOf('>') != -1){
        				var doc=me.getXmlDoc(text);
        				if(doc.firstChild.firstChild!=null){
        					if(doc.firstChild.firstChild.nodeName=="parsererror"){
        						Ext.Msg.alert("错误","不是合法的XML\n"+doc.firstChild.firstChild.innerText);
        						return;
        					}
        					if(doc.firstChild.firstChild.firstChild!=null){
        						if(doc.firstChild.firstChild.firstChild.nodeName=="parsererror"){
                					Ext.Msg.alert("错误","不是合法的XML\n"+doc.firstChild.firstChild.firstChild.innerText);
                					return;
                				}
        					}
        				}
        				me.returnParaInfosFromXml(doc.documentElement,paraminfos);
        			}else{
        				Ext.Msg.alert("错误","请重新输入合法的JSON或XML文本");
        				return;
        			}
        			paraminfos=me.filterDuplicatedElement(paraminfos);
        			Ext.getCmp('ParametersTextArea').setValue(paraminfos.join('\n'));
        			Ext.getCmp('GenerateParametersWindow').close();
        		},
        	}]
        });

        me.callParent(arguments);
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
    },
    returnParaInfosFromJson:function(json,paraInfos){
    	for(var child in json){
    		if(child!="null" && child!=null){
    			if(json[child]!="null" && json[child]!=null){
    				var type=typeof(json[child]);
    				if(type=="object")
    					this.returnParaInfosFromJson(json[child], paraInfos);
    				else
    					paraInfos.push('{"name":"'+child+'","type":"textfield","defaultValue":"'+json[child]+'","text":"'+child+'","extraInfo":""};');
    			}
    		}
    	}
    },
    filterDuplicatedElement:function(arr){
    	var res = [], hash = {};
    	for(var i=0, elem; (elem = arr[i]) != null; i++)  {
            if (!hash[elem])
            {
                res.push(elem);
                hash[elem] = true;
            }
        }
    	return res;
    },
    returnParaInfosFromXml:function(element,paraInfos){
    	if(element.innerHTML.indexOf('>')==-1 && element.innerHTML.indexOf('<')==-1)
    		paraInfos.push('{"name":"'+element.nodeName+'","type":"textfield","defaultValue":"'+element.innerHTML+'","text":"'+element.nodeName+'","extraInfo":""};');
    	var x=element.childNodes;
    	if(x!=undefined){
    		for(var i=0;i<x.length;i++){
    			if(x[i].nodeName!="#text"){
    				this.returnParaInfosFromXml(x[i], paraInfos);
    			}
    		}
    	}
    }
});