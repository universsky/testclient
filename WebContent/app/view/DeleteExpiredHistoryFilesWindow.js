Ext.define('MyApp.view.DeleteExpiredHistoryFilesWindow', {
	extend: 'Ext.window.Window',
	id:'DeleteExpiredHistoryFilesWindow',
    alias: 'widget.DeleteExpiredHistoryFilesWindow',
	modal:true,
	width:125,
	height:90,
	collapsible:false,
	resizable:false,
    initComponent: function() {
        var me = this;
        Ext.applyIf(me, {
            items: [
            {
            	xtype: 'form',
            	id:"BatchCopyTestForm",
            	frame:true,
            	labelAlign:"right",
		 		items:[
 		        {
 		        	xtype:'numberfield',
 		        	fieldLabel:'过期天数',
 		        	labelWidth:55,
 		        	maxValue: 30,
 		        	minValue: 1,
 		        	width:100,
 		        	id: 'SpecifiedExpiredDay',
 		        	value:7
 		        },
 		        {
 		        	xtype : "button",
 		        	text : '清理',
 		        	handler : function(){
 		        		var day=Ext.getCmp("SpecifiedExpiredDay").getValue();
 		        		var lm = new Ext.LoadMask(Ext.getCmp('DeleteExpiredHistoryFilesWindow'), { 
							msg : '执行中。。。', 
							removeMask : true
						}); 
						lm.show();
 		        		Ext.Ajax.request( {
							url : 'job/deleteHistoryFiles',  
							params : {
								rootName: Ext.getCmp('Base').RootName,
								expiredDate : getDateStr(1-new Number(day))
							},
						    success : function(response, options) {
						    	lm.hide();
						    	Ext.Msg.alert("","done",function(){
						    		Ext.getCmp("DeleteExpiredHistoryFilesWindow").close();
						    	});
						    },
						    failure: function(response, opts) {
						    	lm.hide();
				             	Ext.Msg.alert("错误","删除执行记录文件失败");
				            }
						});
 		        	}
 		        }]
            }]
        });
        me.callParent(arguments);
    }
});

function getDateStr(dayCount) {
    var date = new Date();
    date.setDate(date.getDate()+dayCount);
    var y = date.getFullYear();
    var m = date.getMonth()+1;
    var d = date.getDate();
    if (m < 10 ) 
		m = "0" + m; 
	if (d < 10 ) 
		d = "0" + d;
    return y+"-"+m+"-"+d;
}