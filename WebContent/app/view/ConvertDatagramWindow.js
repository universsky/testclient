Ext.define('MyApp.view.ConvertDatagramWindow', {
    extend: 'Ext.window.Window',
    alias: 'widget.ConvertDatagramWindow',
    height: 400,
    id: 'ConvertDatagramWindow',
    modal:true,
    width: 800,
    layout: {
        type: 'vbox'
    },
    title: '转换数据报文',
    resizable:false,
    initComponent: function() {
        var me = this;
        Ext.applyIf(me, {
            items: [
				{
					xtype:'checkbox',
					boxLabel:'include head',
					anchor:"10% 5%",
					checked:false,
					id:'IncludeHeadCheckbox',
				},
            	{
            		xtype:'label',
            		anchor:"10% 5%",
            		text:'请输入需要转换的数据报文。点击 转换 按钮'
            	},
            	{
            		xtype:'textarea',
            		width:800,
            		id:"ConvertDatagramTextArea",
            		height:300
            	},
            	{
            		xtype:'button',
            		text:'转换',
            		anchor:"10% 5%",
            		handler:function(){
            			var datagram=Ext.getCmp('ConvertDatagramTextArea').value;
        				var datagramVersion=parseInt(Ext.getCmp('DatagramVersionCombobox').getValue());
        				var includeHead=Boolean(Ext.getCmp('IncludeHeadCheckbox').getValue());
            			var lm = new Ext.LoadMask(Ext.getCmp('ConvertDatagramWindow'), { 
		    				msg : 'hold on...', 
		    				removeMask : true
		    			});
            			lm.show();
            			Ext.Ajax.request( {
							url : 'job/convertDatagram',
							params : {  
								'datagram':datagram,
    		    	        	'datagramVersion':datagramVersion,
    		    	        	'includeHead':includeHead
							},
						    success : function(response, options) {
						    	lm.hide();
						    	var obj=Ext.decode(response.responseText).obj;
    		    	        	Ext.getCmp('SocketRequestHeadTextArea').setValue(obj.head);
    	            			Ext.getCmp('SocketRequestBodyTextArea').setValue(obj.body);
    	            			Ext.getCmp('SocketServiceCombo').setValue(obj.code);
    	            			
    	            			Ext.getCmp('ConvertDatagramWindow').close();
						    },
						    failure: function(response, opts) {
						    	lm.hide();
    		    	        	Ext.Msg.alert("Error","ConvertDatagram request failure.");
				            }
						});
//            			Ext.data.JsonP.request({
//    		    	        url:Ext.util.Cookies.get('MobileSvcUrl')+'ConvertDatagram',
//    		    	        callbackKey: 'testclient_callback',
//    		    	        params : {
//    		    	        	'datagram':datagram,
//    		    	        	'datagramVersion':datagramVersion,
//    		    	        	'includeHead':includeHead
//    		    	        },
//    		    	        success: function(response){
//    		    	        	lm.hide();
//    		    	        	Ext.getCmp('SocketRequestHeadTextArea').setValue();
//    	            			Ext.getCmp('SocketRequestBodyTextArea').setValue();
//    	            			Ext.getCmp('ConvertDatagramWindow').close();
//    		    	        },    
//    		    	        failure: function(response){
//    		    	        	lm.hide();
//    		    	        	Ext.Msg.alert("Error","ConvertDatagram request failure.");
//    		    	        },
//    		    	        callback: function(){
//    		    	        }
//    		    		});
            		}
            	}
            ]
        });

        me.callParent(arguments);
    }
});