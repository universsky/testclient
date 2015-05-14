Ext.define('MyApp.view.FormatSoa1XmlWindow', {
    extend: 'Ext.window.Window',
    alias: 'widget.FormatSoa1XmlWindow',
    height: 400,
    id: 'FormatSoa1XmlWindow',
    modal:true,
    width: 800,
    layout: {
        type: 'vbox'
    },
    title: '格式化SOA1.0请求报文',
    resizable:false,
    initComponent: function() {
        var me = this;
        Ext.applyIf(me, {
            items: [
            	{
            		xtype:'label',
            		//id:'JsonParameterToolWindowErr',
            		anchor:"10% 5%",
            		text:'请输入需要转换的SOA1.0 XML请求报文。点击 转换 按钮'
            	},
            	{
            		xtype:'label',
            		anchor:"10% 5%",
            		text:'XML'
            	},
            	{
            		xtype:'textarea',
            		width:800,
            		id:"FormatXmlTextArea",
            		height:300
            	},
            	{
            		xtype:'button',
            		text:'转换',
            		anchor:"10% 5%",
            		resultStr:"",
            		handler:function(){
            			var start='<?xml version="1.0"?><soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"><soap:Body><Request xmlns="http://tempuri.org/"><requestXML>';
            			var end='</requestXML></Request></soap:Body></soap:Envelope>';
            			var requestxml = Ext.getCmp('FormatXmlTextArea').value;
            			requestxml = requestxml.replace(new RegExp("&","gm"), "&amp;").replace(new RegExp("<","gm"), "&lt;").replace(new RegExp(">","gm"), "&gt;").replace(new RegExp("'","gm"), "&apos;").replace(new RegExp("\"","gm"), "&quot;");
            			Ext.getCmp('RequestBodyTextArea').setValue(start+requestxml+end);
            			Ext.getCmp('RequestHeadersTextArea').setValue('SOAPAction="http://tempuri.org/Request"\nContent-Type=text/xml; charset=utf-8');
            			Ext.getCmp('FormatSoa1XmlWindow').close();
            		}
            	}
            ]
        });

        me.callParent(arguments);
    }
});