Ext.define('MyApp.view.RunningSetSettingWindow', {
    extend: 'Ext.window.Window',
    alias: 'widget.RunningSetSettingWindow',
    id: 'RunningSetSettingWindow',
    height: 800,
    width: 600,
    layout: {
        type: 'vbox',
        align:'stretch'
	},
    title: '配置运行集合',
    modal:true,
    resizable:false,
    initComponent: function() {
        var me = this;
        Ext.applyIf(me, {
        	items:[
			{
				xtype: 'textfield',
				id:'RunningSetName',
				flex: 1,
				fieldLabel: '集合名称',
				labelWidth:65,
				allowBlank:false,
				regex:/^((?![\/:*?"<>|@']).)*$/,
			    regexText:"禁止包含字符\/:*?\"<>|@'",
			},
			{
				xtype: 'treepanel',
				id:'TestSelectedTree',
				title:'选择测试',
				flex: 30,
				store: 'SelectingTreeStore',
				useArrows:true,
				autoScroll:true,
				animate:true,
				enableDD:true,
				containerScroll: true,
				frame: true,
			    border: false,
			    trackMouseOver: false,
			    lines: false,
			    rootVisible: false,
			    listeners: {
			    	checkchange: {
			    		fn : me.checkchange,
			        	scope : me
			    	}
			    }
			},
			{
				xtype: 'button',
				flex: 1,
				id:'SaveRunningSetBtn',
			    handler: function(button, event) {
			    	var name=Ext.getCmp('RunningSetName').getValue();
			    	if(name==""){
			    		Ext.Msg.alert("警告","集合名称不能为空");
			    		return;
			    	}
			    	if(name.indexOf('@')!=-1 ||
			    	   name.indexOf('\\') > -1 ||
	    			   name.indexOf('/') > -1 ||
	    			   name.indexOf(':') > -1 ||
	    			   name.indexOf('*') > -1 ||
	    			   name.indexOf('?') > -1 ||
	    			   name.indexOf('"') > -1 ||
	    			   name.indexOf('<') > -1 ||
	    			   name.indexOf('>') > -1 ||
	    			   name.indexOf('|') > -1){
                  		Ext.Msg.alert("错误",'不能包含英文输入法字符\\/:*?"<>|@');
                  		return;
                  	}
			    	var arr=Ext.getCmp('TestSelectedTree').getChecked();
			    	var tests=[];
			    	for(var i=0;i<arr.length;i++){
			    		var path=arr[i].raw.folderName;
			    		if(Ext.String.endsWith(path,'-leaf') || Ext.String.endsWith(path,'-t'))
			    			tests.push(path);
			    	}
			    	if(arr.length>0 && tests.length>0){
			    		Ext.Ajax.request( {
							url : 'job/addRunningSet',
							params : {  
								rootName: Ext.getCmp('Base').RootName,
								name : name,
								tests : tests
							},
						    success : function(response, options) {
						    	Ext.getCmp('RunningSetSettingWindow').close();
						    	Ext.getStore('RunningSet').load();
				    			Ext.getCmp('MainContainer').removeAll(false);
						    },
						    failure: function(response, opts) {
						    	Ext.Msg.alert("错误","添加运行集合失败");
				            }
						});
			    	}else
			    		Ext.Msg.alert("警告","请选择至少一个测试节点");
               	},
			    icon: 'image/save.png',
			    tooltip: '保存'
			}]
        });
        me.callParent(arguments);
    },
    checkchange : function(node, checked, eOpts) {
    	node.set('checked',checked);
		if(node.childNodes.length>0){
			node.expand();
			for(var i=0; node.childNodes.length>i; i++){
				this.checkchange(node.childNodes[i], checked, eOpts);
			}
		}
	}
});