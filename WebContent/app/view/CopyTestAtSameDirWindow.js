Ext.define('MyApp.view.CopyTestAtSameDirWindow', {
	extend: 'Ext.window.Window',
	id:'CopyTestAtSameDirWindow',
    alias: 'widget.CopyTestAtSameDirWindow',
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
 		        	fieldLabel:'复制条数',
 		        	labelWidth:55,
 		        	maxValue: 99,
 		        	minValue: 1,
 		        	width:100,
 		        	id: 'CopiedTestAmmount',
 		        	value:1
 		        },
 		        {
 		        	xtype : "button",
 		        	text : '复制',
 		        	handler : function(){
 		        		var number=Ext.getCmp("CopiedTestAmmount").getValue();
 		        		var test=Ext.getCmp('BatchCopyTestForm').theLeafNode.raw.folderName;
 		        		var lm = new Ext.LoadMask(Ext.getCmp('CopyTestAtSameDirWindow'), { 
							msg : '执行中。。。', 
							removeMask : true
						}); 
						lm.show();
 		        		Ext.Ajax.request( {
							url : 'job/batchCopyTest',  
							params : {
								testPath : test,
								number : number
							},
						    success : function(response, options) {
						    	lm.hide();
						    	Ext.Msg.alert("","done",function(){
						    		Ext.getCmp("CopyTestAtSameDirWindow").close();
						    		Ext.getStore('StandardTreeStore').load();
						    	});
						    },
						    failure: function(response, opts) {
						    	lm.hide();
				             	Ext.Msg.alert("错误","批量复制测试失败");
				            }
						});
 		        	}
 		        }]
            }]
        });
        me.callParent(arguments);
    }
});