Ext.define('MyApp.view.RunningSetUpdateWindow', {
    extend: 'Ext.window.Window',
    alias: 'widget.RunningSetUpdateWindow',
    id: 'RunningSetUpdateWindow',
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
	    	items: [
	        {
	        	xtype: 'textfield',
	        	id:'RunningSetUpdatedName',
	        	flex: 1,
	        	fieldLabel: '集合名称',
	        	labelWidth:65,
	        	allowBlank:false,
				regex:/^((?![\/:*?"<>|@']).)*$/,
			    regexText:"禁止包含字符\/:*?\"<>|@'"
	        },
	    	{
	    		xtype: 'treepanel',
	    		id:'UpdatedTestTree',
	    		title:'选择测试',
	    		flex: 30,
	    		store: 'SelectedTreeStore',
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
    			id:'SaveUpdatedRunningSetBtn',
                handler: function(button, event) {
                	var name=Ext.getCmp('RunningSetUpdatedName').getValue();
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
                	var arr=Ext.getCmp('UpdatedTestTree').getChecked();
                	var updatedtests=[];
                	for(var i=0;i<arr.length;i++){
                		var path=arr[i].raw.folderName;
                		if(Ext.String.endsWith(path,'-leaf') || Ext.String.endsWith(path,'-t'))
                			updatedtests.push(path);
                	}
                	if(arr.length>0 && updatedtests.length>0){
                		if(!me.isElementsEqualBetween2Array(Ext.getCmp('Base').SelectedTests, updatedtests)){
                			Ext.MessageBox.confirm('确认', '由于测试集有变动，是否删除之前的运行记录？', function (opt) {
                                var doesDelete;
                				if (opt == 'yes')
                					doesDelete=true;
                				else if (opt == 'no')
                					doesDelete=false;
                                Ext.Ajax.request( {
    								url : 'job/updateRunningSet',
    								params : {
    									runningset : Ext.getCmp('Base').folderName,
    									updatedname : name,
    									updatedtests : updatedtests,
    									deletehistory : doesDelete
    								},
    							    success : function(response, options) {
    							    	var json=Ext.decode(response.responseText);
    							    	if(json.success){
    							    		Ext.getCmp('RunningSetUpdateWindow').close();
    							    		Ext.getStore('RunningSet').load();
    						    			Ext.getCmp('MainContainer').removeAll(false);
    							    	}else
    							    		Ext.Msg.alert("错误",json.msg);
    							    },
    							    failure: function(response, opts) {
    							    	Ext.Msg.alert("错误","添加运行集合失败");
    					            }
    							});
                            });
                    	}else{
                    		Ext.Ajax.request( {
								url : 'job/renameRunningSet',
								params : {
									runningset : Ext.getCmp('Base').folderName,
									updatedname : name,
								},
							    success : function(response, options) {
							    	var json=Ext.decode(response.responseText);
							    	if(json.success){
							    		Ext.getCmp('RunningSetUpdateWindow').close();
							    		Ext.getStore('RunningSet').load();
							    	}else
							    		Ext.Msg.alert("错误","重命名目录失败");
							    },
							    failure: function(response, opts) {
							    	Ext.Msg.alert("错误","添加运行集合失败");
					            }
							});
                    	}
                	}else
                		Ext.Msg.alert("警告","请选择至少一个测试节点");                	
                },
                icon: 'image/save.png',
                tooltip: '保存'
	    	}],
	    	listeners: {
				show: {
                    fn: function(window, eOpts){
                    	var name=Ext.getCmp('Base').folderName.split('@')[0];
                    	if(name.split('/').length>1){
                    		name=name.split('/')[name.split('/').length-1];
                    	}
                    	Ext.getCmp('RunningSetUpdatedName').setValue(name);
                    },
                    scope: me
                }
			}
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
	},
	isElementsEqualBetween2Array: function(arr1,arr2){
		if(arr1.length==arr2.length){
			var arr2str=arr2.join('\n');
			for (var i=0; i<arr1.length; i++){
				if (arr2str.indexOf(arr1[i])==-1){
                    return false;
                }
	        }
			return true;
		}
		return false;
	}
});