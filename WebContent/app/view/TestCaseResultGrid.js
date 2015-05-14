var record_start = 0;
Ext.define('MyApp.view.TestCaseResultGrid', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.TestCaseResultGrid',
    id: 'TestCaseResultGrid',
    autoFill : true,
    stripeRows : false,
    store: 'TestCaseResult',
    viewConfig: {
        getRowClass: function(record, index, rowParams, store) {
            if (record.raw.result=='p')
            	return 'x-grid-row-green';
            else if (record.raw.result=='f')
            	return 'x-grid-row-red';
            else if (record.raw.result=='r')
            	return 'x-grid-row-blue';
            else if (record.raw.result=='i')
            	return 'x-grid-row-gray';
            else if (record.raw.result=='e')
            	return 'x-grid-row-brown';
            else
        		return 'x-grid-row-white';
        }
    },
    initComponent: function() {
        var me = this;
        Ext.applyIf(me, {
        	columns: [
      	    new Ext.grid.RowNumberer({
      		   header : "序号",
      		   flex:2,
      		   renderer:function(value,metadata,record,rowIndex){
      			   if(record.raw.result!="")
      				   return record_start + rowIndex;
      			   else
      				   return "";
      		   }
      		}),
      		{
      		    xtype: 'gridcolumn',
      		    dataIndex: 'test',
      		    text: '测试 ',
      		    flex:28
      		},
      		{
      		    xtype: 'gridcolumn',
      		    dataIndex: 'total',
      		    flex:5,
      		    text: '全部检查点',
      		},
      		{
      		    xtype: 'gridcolumn',
      		    dataIndex: 'passed',
      		    flex:6,
      		    text: '通过的检查点',
      		},
      		{
      		    xtype: 'gridcolumn',
      		    dataIndex: 'failed',
      		    flex:6,
      		    text: '失败的检查点',
      		},
      		{
      		    xtype: 'gridcolumn',
      		    dataIndex: 'rate',
      		    flex:5,
      		    text: '通过率 %',
      		},
      		{
      		    xtype: 'gridcolumn',
      		    dataIndex: 'result',
      		    text: '状态',
      		    flex:2,
      		    renderer: function(value, metaData, record, rowIndex, colIndex, store, view) {
      	            if(value=='p'){
      	                return '<span font-size:14px">' + "成功" + '</span>';
      	            }else if(value=='f'){
      	                return '<span font-size:14px">' + "失败" + '</span>';
      	            }else if(value=='r'){
      	                return '<span font-size:14px">' + "待测" + '</span>';
      	            }	                            
      	            else if(value=='i'){
      	                return '<span font-size:14px">' + "无效" + '</span>';
      	            }
      	            else if(value=='e'){
      	                return '<span font-size:14px">' + "异常" + '</span>';
      	            }
      	        }
      		}],
//    		bbar : new Ext.PagingToolbar({
//			store : 'TestCaseResult',
//			pageSize : 16,
//			displayInfo : true,
//			beforePageText:"第",
//			afterPageText:"/ {0}页",
//			firstText:"首页",
//			prevText:"上一页",
//			nextText:"下一页",
//			lastText:"尾页",
//			refreshText:"刷新",
//			displayMsg : "当前显示记录从 {0} - {1} 总 {2} 条记录",
//			emptyMsg : "没有相关记录!",
//			doLoad : function(start){
//				record_start = start;
//				var o = {}, pn = this.paramNames;
//				o[pn.start] = start;
//				o[pn.limit] = this.pageSize;
//				Ext.getStore('TestCaseResult').proxy.extraParams.dirPath=Ext.getCmp('Base').folderName;
//				this.store.load({params:o});
//	   		}
//		}),
      		dockedItems: [
      	    {
      	        xtype: 'toolbar',
      	        dock: 'top',
      	        items: [
                {
                	xtype: 'combobox',
                	width:155,
                	labelWidth:55,
                	fieldLabel: '选择日期',
                	valueField:'name',
                      displayField:'value',
                      store: Ext.create('Ext.data.ArrayStore',{
                      	fields:['value','name'],
                      	data: datestore
                      }),
                      value:'今天',
		   	    	editable:false,
		   	    	listeners :{
						'change':function(that, newValue, oldValue, eOpts){
							if(newValue!=''){
								Ext.getStore('TestCaseResult').proxy.extraParams.date=newValue;
								Ext.getStore('TestCaseResult').load();
							}
				    	}
					}
                }]
      	    }]
        });
        me.callParent(arguments);
    } 
});