Ext.define('MyApp.view.GenerateCheckpointsWindow', {
    extend: 'Ext.window.Window',
    alias: 'widget.GenerateCheckpointsWindow',
    height: 400,
    id: 'GenerateCheckpointsWindow',
    modal:true,
    width: 400,
    layout: {
        type: 'vbox'
    },
    title: '批量生成检查点',
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
            		width:400,
            		id:"Text2Checkpoints",
            		height:300,
            		autoScroll:true
            	},
            	{
            		xtype:'button',
            		flex:1,
            		text:'生成',
            		anchor:"10% 5%",
            		resultStr:"",
            		handler:function(){
            			var checkinfo=[];
            			var text=Ext.getCmp('Text2Checkpoints').getValue();
            			if(text.indexOf('{') == 0 && text.indexOf('}') > 0){
            				var json=me.getJson(text);
            				if(json!=null && typeof(json) == "object" && Object.prototype.toString.call(json).toLowerCase() == "[object object]" && !json.length){
            					me.returnCheckInfoFromJson(json,checkinfo);
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
            				me.returnCheckInfoFromXml(doc.documentElement,checkinfo);
            			}else{
            				Ext.Msg.alert("错误","请重新输入合法的JSON或XML文本");
            				return;
            			}
            			checkinfo=me.filterDuplicatedElement(checkinfo);
            			Ext.Ajax.request( {
							url : 'job/generateCheckpoints',  
							params : {  
								testPath : Ext.getCmp('Base').folderName, 
								checkInfos : checkinfo,
							},
						    success : function(response, options) {
						    	Ext.getCmp('GenerateCheckpointsWindow').close();
						    	Ext.getStore('CheckPoint').load();
						    },
						    failure: function(response, opts) {
				             	Ext.Msg.alert("错误","写历史记录文件失败");
				             	Ext.getCmp('GenerateCheckpointsWindow').close();
				            }
						});
            		}
            	}
            ]
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
    returnCheckInfoFromJson:function(json,checkinfo){
    	for(var child in json){
    		if(child!="null" && child!=null){
    			checkinfo.push(child);
    			if(json[child]!="null" && json[child]!=null){
    				var type=typeof(json[child]);
    				if(type=="object")
    					this.returnCheckInfoFromJson(json[child], checkinfo);
    				else if(type=="number")
    					checkinfo.push('"'+child+'":'+json[child]);
    				else if(type=="string")
    					checkinfo.push('"'+child+'":"'+json[child]+'"');
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
    returnCheckInfoFromXml:function(element,checkinfo){
    	if(element.innerHTML.indexOf('>')>element.innerHTML.indexOf('<')>0)
    		checkinfo.push('<'+element.nodeName+'>');
    	else
    		checkinfo.push(element.outerHTML);
    	var x=element.childNodes;
    	if(x!=undefined){
    		for(var i=0;i<x.length;i++){
    			if(x[i].nodeName!="#text"){
    				this.returnCheckInfoFromXml(x[i], checkinfo);
    			}
    		}
    	}
    }
});