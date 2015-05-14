Ext.define('MyApp.view.PasswordConfirmationWindow', {
	extend: 'Ext.window.Window',
    alias: 'widget.PasswordConfirmationWindow',
    title:"密码",
	modal:true,
	width:250,
	height:115,
	collapsible:false,
	resizable:false,
    initComponent: function() {
        var me = this;
        Ext.applyIf(me, {
            items: [
            {
            	xtype: 'form',
            	//autoWidth:true,
            	layout:"form",
            	frame:true,
            	labelAlign:"right",
		 		items:[
 		        {
 		        	xtype:"label",
 		        	height : 20,
 		        	text :"请输入密码:"
 		        },
 		        {
 		        	xtype : "textfield",
 		        	inputType : 'password',
 		        	allowBlank:false,
 		        	maxLength:255,
 		        	height : 20,
 		        	width:228,
 		        	id: 'pwd',
 		        }],
 		        buttons : [
 		        {
 		        	text : '确定',
 		        	handler : function(){
 		        		var pwd=Ext.getCmp("pwd").getValue();
 		        		if(pwd==='!qazxsw@'){
 		        			var basewin=Ext.getCmp('Base');
 		        			basewin.checkNotRoot(basewin.delNode);
 		        			me.close();
 		        		}
 		        		else
 		        			Ext.Msg.alert("密码错误","密码错了啦，请联系管理员");
 		        	}
 		        },
 		        {    
 		        	text : '取消',
 		        	handler : function(){
 		        		me.destroy();
 		        	}
 		        }]
            }]
        });
        me.callParent(arguments);
    }
});