Ext.define('MyApp.view.CronExpressionSettingWindow', {
	extend: 'Ext.window.Window',
    alias: 'widget.CronExpressionSettingWindow',
    id: 'CronExpressionSettingWindow',
    height: 360,
    width: 344,
	modal:true,
	layout: 
	{
       type: 'vbox',
       align:'stretch'
	},
	title: '定时设置',
	resizable:false,
	initComponent: function() {
        var me = this;
        Ext.applyIf(me, {
        	items: [
	    	{
	    	   	xtype: 'tabpanel',
	    	   	id: 'cronSettingPanel',
	    	    flex:14,
	    	    activeTab:0,
	    	    items:[
    	    	{
	    	    	title:"时",
	    	    	items:[
	    	    	{
	    	    		xtype:'radiogroup',
	    	    		itemId:'hourType',
	    	    		layout: 'form',
	    	    		items:[
	    	   				new Ext.form.Radio({boxLabel:'每小时',labelSeparator:'', name:'ht',inputValue:"0",checked:true}),                      
	    	   				new Ext.form.Radio({boxLabel:'指定',labelSeparator:'', name:'ht',inputValue:"1",
	    						listeners :{
							    	'change' : function(that, newValue, oldValue, eOpts){
							    		if(!newValue){
							    			Ext.ComponentQuery.query('checkbox[name=cbhour]').forEach(function(item){
	    	    	   	    					item.checked=false;
	    	    	   	    			        item.disabled=true;
	    	    	   	    				});
							    			Ext.getCmp("hourcbg").disabled=true;
							    		}else{
							    			Ext.ComponentQuery.query('checkbox[name=cbhour]').forEach(function(item){
	    	    	   	    			        item.disabled=false;
	    	    	   	    				});
							    			Ext.getCmp("hourcbg").enable(true);
							    		}
	    						    }}
		    					}),
	    					new Ext.panel.Panel({
		    					layout: 'column',
		    					items: [{
									id:'hourcbg',
									vertical: false,
	    					        xtype:'checkboxgroup',
	    					        columns: 10,
	    					        items: [
			    			           { boxLabel: '1', name: 'cbhour', inputValue: '1', xtype: 'checkbox', columnWidth: 30 },
			    					   { boxLabel: '2', name: 'cbhour', inputValue: '2', xtype: 'checkbox', columnWidth: 30 },
			    					   { boxLabel: '3', name: 'cbhour', inputValue: '3', xtype: 'checkbox', columnWidth: 30 },
			    					   { boxLabel: '4', name: 'cbhour', inputValue: '4', xtype: 'checkbox', columnWidth: 30 },
			    					   { boxLabel: '5', name: 'cbhour', inputValue: '5', xtype: 'checkbox', columnWidth: 30 },
			    					   { boxLabel: '6', name: 'cbhour', inputValue: '6', xtype: 'checkbox', columnWidth: 30 },
			    					   { boxLabel: '7', name: 'cbhour', inputValue: '7', xtype: 'checkbox', columnWidth: 30 },
			    					   { boxLabel: '8', name: 'cbhour', inputValue: '8', xtype: 'checkbox', columnWidth: 30 },
			    					   { boxLabel: '9', name: 'cbhour', inputValue: '9', xtype: 'checkbox', columnWidth: 30 },
			    					   { boxLabel: '10', name: 'cbhour',inputValue: '10', xtype: 'checkbox', columnWidth: 30 },
			    					   { boxLabel: '11', name: 'cbhour',inputValue: '11', xtype: 'checkbox', columnWidth: 30},
			    					   { boxLabel: '12', name: 'cbhour',inputValue: '12', xtype: 'checkbox', columnWidth: 30 },
			    					   { boxLabel: '13', name: 'cbhour',inputValue: '13', xtype: 'checkbox', columnWidth: 30 },
			    					   { boxLabel: '14', name: 'cbhour',inputValue: '14', xtype: 'checkbox', columnWidth: 30 },
			    					   { boxLabel: '15', name: 'cbhour',inputValue: '15', xtype: 'checkbox', columnWidth: 30 },
			    					   { boxLabel: '16', name: 'cbhour',inputValue: '16', xtype: 'checkbox', columnWidth: 30 },
			    					   { boxLabel: '17', name: 'cbhour',inputValue: '17', xtype: 'checkbox', columnWidth: 30 },
			    					   { boxLabel: '18', name: 'cbhour',inputValue: '18', xtype: 'checkbox', columnWidth: 30 },
			    					   { boxLabel: '19', name: 'cbhour',inputValue: '19', xtype: 'checkbox', columnWidth: 30 },
			    					   { boxLabel: '20', name: 'cbhour',inputValue: '20', xtype: 'checkbox', columnWidth: 30 },
			    					   { boxLabel: '21', name: 'cbhour',inputValue: '21', xtype: 'checkbox', columnWidth: 30 },
			    					   { boxLabel: '22', name: 'cbhour',inputValue: '22', xtype: 'checkbox', columnWidth: 30 },
			    					   { boxLabel: '23', name: 'cbhour',inputValue: '23', xtype: 'checkbox', columnWidth: 30 },
			    					   { boxLabel: '24', name: 'cbhour',inputValue: '24', xtype: 'checkbox', columnWidth: 30 }
			    					],
			    				    listeners :{
			    				    	'change' : function(that, newValue, oldValue, eOpts){
			    	   						var t=typeof(newValue.cbhour);
			    	   						switch(t)
			    	   	    				{
				    	   	    				case "string":
				    	   	    					var updated=Ext.getCmp("CronExpressionSettingWindow").updateValue(2,newValue.cbhour);
				    		   	    				Ext.getCmp("expression").setValue(updated);
				    	   	    					break;
				    	   	    				case "object":
				    	   	    					var updated=Ext.getCmp("CronExpressionSettingWindow").updateValue(2,newValue.cbhour.join(','));
				    		   	    				Ext.getCmp("expression").setValue(updated);
				    	   	    					break;
				    	   	    				case "undefined":
				    	   	    					var updated=Ext.getCmp("CronExpressionSettingWindow").updateValue(2,'*');
				    	   	    					Ext.getCmp("expression").setValue(updated);
				    	   	    					break;
				    	   	    				default:
				    	   	    					break;
			    	   	    	  	    	 }
			    	       					}
			    					    }
		    					}]
		    				}),
		    				new Ext.form.Radio({boxLabel:'当前小时',labelSeparator:'', name:'ht',inputValue:"2"})
	    	    		],
	    	    		listeners :{    			
	    	    			'change':function(that, newValue, oldValue, eOpts){
	    	    				switch (parseInt(newValue.ht))
	    	    				{
	    	    				case 0:
	    	    					var updated=Ext.getCmp("CronExpressionSettingWindow").updateValue(2,'*');
	    	    					Ext.getCmp("expression").setValue(updated);
	    	    					break;
	    	    				case 2:
	    	    					var myDate = new Date();
	    	    					var y = myDate.getFullYear();
	    	    					var m = myDate.getMonth()+1;
	    	    					var d = myDate.getDate();
	    	    					var h = myDate.getHours();
	    	    					Ext.getCmp("expression").setValue("* * " + h +" " + d + " " + m + " ? " + y);
	    	    					break;
	    	    				default:
	    	    					break;
	    	    	  	    	 }
	    	    				}
	    	    	    	}
	    	    	}]
	    	    },
	    	    {
	    	    	title:"分",
	    	    	items:[
	      	    	{
	      	    		xtype:'radiogroup',
	      	    		itemId:'minuteType',
	      	    		layout: 'form',
	      	    		items:[
	      	   				new Ext.form.Radio({boxLabel:'每分钟',labelSeparator:'', name:'mint',inputValue:"0",checked:true}),                      
	      	   				new Ext.form.Radio({boxLabel:'指定',labelSeparator:'', name:'mint',inputValue:"1",
	    						listeners :{
							    	'change' : function(that, newValue, oldValue, eOpts){
							    		if(!newValue){
							    			Ext.ComponentQuery.query('checkbox[name=cbminute]').forEach(function(item){
	    	    	   	    					item.checked=false;
	    	    	   	    			        item.disabled=true;
	    	    	   	    				});
							    			Ext.getCmp("minutecbg").disabled=true;
							    		}else{
							    			Ext.ComponentQuery.query('checkbox[name=cbminute]').forEach(function(item){
	    	    	   	    			        item.disabled=false;
	    	    	   	    				});
							    			Ext.getCmp("minutecbg").enable(true);
							    		}
	    						    }}
		    					}),
	    					new Ext.panel.Panel({
		    					layout: 'column',
		    					items: [{
									id:'minutecbg',
									vertical: false,
	    					        xtype:'checkboxgroup',
	    					        columns: 10,
	    					        items: [
			      			           { boxLabel: '1', name: 'cbminute', inputValue: '1', xtype: 'checkbox', columnWidth: 30 },
			      					   { boxLabel: '2', name: 'cbminute', inputValue: '2', xtype: 'checkbox', columnWidth: 30 },
			      					   { boxLabel: '3', name: 'cbminute', inputValue: '3', xtype: 'checkbox', columnWidth: 30 },
			      					   { boxLabel: '4', name: 'cbminute', inputValue: '4', xtype: 'checkbox', columnWidth: 30 },
			      					   { boxLabel: '5', name: 'cbminute', inputValue: '5', xtype: 'checkbox', columnWidth: 30 },
			      					   { boxLabel: '6', name: 'cbminute', inputValue: '6', xtype: 'checkbox', columnWidth: 30 },
			      					   { boxLabel: '7', name: 'cbminute', inputValue: '7', xtype: 'checkbox', columnWidth: 30 },
			      					   { boxLabel: '8', name: 'cbminute', inputValue: '8', xtype: 'checkbox', columnWidth: 30 },
			      					   { boxLabel: '9', name: 'cbminute', inputValue: '9', xtype: 'checkbox', columnWidth: 30 },
			      					   { boxLabel: '10', name: 'cbminute',inputValue: '10', xtype: 'checkbox', columnWidth: 30 },
			      					   { boxLabel: '11', name: 'cbminute',inputValue: '11', xtype: 'checkbox', columnWidth: 30},
			      					   { boxLabel: '12', name: 'cbminute',inputValue: '12', xtype: 'checkbox', columnWidth: 30 },
			      					   { boxLabel: '13', name: 'cbminute',inputValue: '13', xtype: 'checkbox', columnWidth: 30 },
			      					   { boxLabel: '14', name: 'cbminute',inputValue: '14', xtype: 'checkbox', columnWidth: 30 },
			      					   { boxLabel: '15', name: 'cbminute',inputValue: '15', xtype: 'checkbox', columnWidth: 30 },
			      					   { boxLabel: '16', name: 'cbminute',inputValue: '16', xtype: 'checkbox', columnWidth: 30 },
			      					   { boxLabel: '17', name: 'cbminute',inputValue: '17', xtype: 'checkbox', columnWidth: 30 },
			      					   { boxLabel: '18', name: 'cbminute',inputValue: '18', xtype: 'checkbox', columnWidth: 30 },
			      					   { boxLabel: '19', name: 'cbminute',inputValue: '19', xtype: 'checkbox', columnWidth: 30 },
			      					   { boxLabel: '20', name: 'cbminute',inputValue: '20', xtype: 'checkbox', columnWidth: 30 },
			      					   { boxLabel: '21', name: 'cbminute',inputValue: '21', xtype: 'checkbox', columnWidth: 30 },
			      					   { boxLabel: '22', name: 'cbminute',inputValue: '22', xtype: 'checkbox', columnWidth: 30 },
			      					   { boxLabel: '23', name: 'cbminute',inputValue: '23', xtype: 'checkbox', columnWidth: 30 },
			      					   { boxLabel: '24', name: 'cbminute',inputValue: '24', xtype: 'checkbox', columnWidth: 30 },
			      					   { boxLabel: '25', name: 'cbminute',inputValue: '25', xtype: 'checkbox', columnWidth: 30 },
			      					   { boxLabel: '26', name: 'cbminute',inputValue: '26', xtype: 'checkbox', columnWidth: 30 },
			      					   { boxLabel: '27', name: 'cbminute',inputValue: '27', xtype: 'checkbox', columnWidth: 30 },
			      					   { boxLabel: '28', name: 'cbminute',inputValue: '28', xtype: 'checkbox', columnWidth: 30 },
			      					   { boxLabel: '29', name: 'cbminute',inputValue: '29', xtype: 'checkbox', columnWidth: 30 },
			      					   { boxLabel: '30', name: 'cbminute',inputValue: '30', xtype: 'checkbox', columnWidth: 30 },
			      					   { boxLabel: '31', name: 'cbminute',inputValue: '31', xtype: 'checkbox', columnWidth: 30},
			      					   { boxLabel: '32', name: 'cbminute',inputValue: '32', xtype: 'checkbox', columnWidth: 30 },
			      					   { boxLabel: '33', name: 'cbminute',inputValue: '33', xtype: 'checkbox', columnWidth: 30 },
			      					   { boxLabel: '34', name: 'cbminute',inputValue: '34', xtype: 'checkbox', columnWidth: 30 },
			      					   { boxLabel: '35', name: 'cbminute',inputValue: '35', xtype: 'checkbox', columnWidth: 30 },
			      					   { boxLabel: '36', name: 'cbminute',inputValue: '36', xtype: 'checkbox', columnWidth: 30 },
			      					   { boxLabel: '37', name: 'cbminute',inputValue: '37', xtype: 'checkbox', columnWidth: 30 },
			      					   { boxLabel: '38', name: 'cbminute',inputValue: '38', xtype: 'checkbox', columnWidth: 30 },
			      					   { boxLabel: '39', name: 'cbminute',inputValue: '39', xtype: 'checkbox', columnWidth: 30 },
			      					   { boxLabel: '40', name: 'cbminute',inputValue: '40', xtype: 'checkbox', columnWidth: 30 },
			      					   { boxLabel: '41', name: 'cbminute',inputValue: '41', xtype: 'checkbox', columnWidth: 30 },
			      					   { boxLabel: '42', name: 'cbminute',inputValue: '42', xtype: 'checkbox', columnWidth: 30 },
			      					   { boxLabel: '43', name: 'cbminute',inputValue: '43', xtype: 'checkbox', columnWidth: 30 },
			      					   { boxLabel: '44', name: 'cbminute',inputValue: '44', xtype: 'checkbox', columnWidth: 30 },
			      					   { boxLabel: '45', name: 'cbminute',inputValue: '45', xtype: 'checkbox', columnWidth: 30 },
			      					   { boxLabel: '46', name: 'cbminute',inputValue: '46', xtype: 'checkbox', columnWidth: 30 },
			      					   { boxLabel: '47', name: 'cbminute',inputValue: '47', xtype: 'checkbox', columnWidth: 30 },
			      					   { boxLabel: '48', name: 'cbminute',inputValue: '48', xtype: 'checkbox', columnWidth: 30 },
			      					   { boxLabel: '49', name: 'cbminute',inputValue: '49', xtype: 'checkbox', columnWidth: 30 },
			      					   { boxLabel: '50', name: 'cbminute',inputValue: '50', xtype: 'checkbox', columnWidth: 30 },
			      					   { boxLabel: '51', name: 'cbminute',inputValue: '51', xtype: 'checkbox', columnWidth: 30 },
			      					   { boxLabel: '52', name: 'cbminute',inputValue: '52', xtype: 'checkbox', columnWidth: 30 },
			      					   { boxLabel: '53', name: 'cbminute',inputValue: '53', xtype: 'checkbox', columnWidth: 30 },
			      					   { boxLabel: '54', name: 'cbminute',inputValue: '54', xtype: 'checkbox', columnWidth: 30 },
			      					   { boxLabel: '55', name: 'cbminute',inputValue: '55', xtype: 'checkbox', columnWidth: 30 },
			      					   { boxLabel: '56', name: 'cbminute',inputValue: '56', xtype: 'checkbox', columnWidth: 30 },
			      					   { boxLabel: '57', name: 'cbminute',inputValue: '57', xtype: 'checkbox', columnWidth: 30 },
			      					   { boxLabel: '58', name: 'cbminute',inputValue: '58', xtype: 'checkbox', columnWidth: 30 },
			      					   { boxLabel: '59', name: 'cbminute',inputValue: '59', xtype: 'checkbox', columnWidth: 30 },
			      					   { boxLabel: '60', name: 'cbminute',inputValue: '60', xtype: 'checkbox', columnWidth: 30 },
			      					],
			      				    listeners :{
			      				    	'change' : function(that, newValue, oldValue, eOpts){
			      	   						var t=typeof(newValue.cbminute);
			      	   						switch(t)
			      	   	    				{
				      	   	    				case "string":
				      	   	    					var updated=Ext.getCmp("CronExpressionSettingWindow").updateValue(1,newValue.cbminute);
				      		   	    				Ext.getCmp("expression").setValue(updated);
				      	   	    					break;
				      	   	    				case "object":
				      	   	    					var updated=Ext.getCmp("CronExpressionSettingWindow").updateValue(1,newValue.cbminute.join(','));
				      		   	    				Ext.getCmp("expression").setValue(updated);
				      	   	    					break;
				      	   	    				case "undefined":
				      	   	    					var updated=Ext.getCmp("CronExpressionSettingWindow").updateValue(1,'*');
				      	   	    					Ext.getCmp("expression").setValue(updated);
				      	   	    					break;
				      	   	    				default:
				      	   	    					break;
			      	   	    	  	    	 }
			      	       				   }
			      					    }
		    					}]
		    				})
	      	    		],
	      	    		listeners :{    			
	      	    			'change':function(that, newValue, oldValue, eOpts){
	      	    				switch (parseInt(newValue.mint)){
		      	    				case 0:
		      	    					var updated=Ext.getCmp("CronExpressionSettingWindow").updateValue(1,'*');
		      	    					Ext.getCmp("expression").setValue(updated);
		      	    					break;
		      	    				default:
		      	    					break;
	      	    	  	    	 }
      	    				}
      	    	    	}
	      	    	}]
	    	    },
	    	    {
	    	    	title:"秒",
	    	    	items:[
	     	    	{
	     	    		xtype:'radiogroup',
	     	    		itemId:'secondType',
	     	    		layout: 'form',
	     	    		items:[
	     	   				new Ext.form.Radio({boxLabel:'每秒',labelSeparator:'', name:'st',inputValue:"0",checked:true}),                      
	     	   				new Ext.form.Radio({boxLabel:'指定',labelSeparator:'', name:'st',inputValue:"1",
	    						listeners :{
							    	'change' : function(that, newValue, oldValue, eOpts){
							    		if(!newValue){
							    			Ext.ComponentQuery.query('checkbox[name=cbsecond]').forEach(function(item){
	    	    	   	    					item.checked=false;
	    	    	   	    			        item.disabled=true;
	    	    	   	    				});
							    			Ext.getCmp("minutecbg").disabled=true;
							    		}else{
							    			Ext.ComponentQuery.query('checkbox[name=cbsecond]').forEach(function(item){
	    	    	   	    			        item.disabled=false;
	    	    	   	    				});
							    			Ext.getCmp("secondcbg").enable(true);
							    		}
	    						    }}
		    					}),
	    					new Ext.panel.Panel({
		    					layout: 'column',
		    					items: [{
									id:'secondcbg',
									vertical: false,
	    					        xtype:'checkboxgroup',
	    					        columns: 10,
	    					        items: [
										{ boxLabel: '1', name: 'cbsecond', inputValue: '1', xtype: 'checkbox', columnWidth: 30 },
										{ boxLabel: '2', name: 'cbsecond', inputValue: '2', xtype: 'checkbox', columnWidth: 30 },
										{ boxLabel: '3', name: 'cbsecond', inputValue: '3', xtype: 'checkbox', columnWidth: 30 },
										{ boxLabel: '4', name: 'cbsecond', inputValue: '4', xtype: 'checkbox', columnWidth: 30 },
										{ boxLabel: '5', name: 'cbsecond', inputValue: '5', xtype: 'checkbox', columnWidth: 30 },
										{ boxLabel: '6', name: 'cbsecond', inputValue: '6', xtype: 'checkbox', columnWidth: 30 },
										{ boxLabel: '7', name: 'cbsecond', inputValue: '7', xtype: 'checkbox', columnWidth: 30 },
										{ boxLabel: '8', name: 'cbsecond', inputValue: '8', xtype: 'checkbox', columnWidth: 30 },
										{ boxLabel: '9', name: 'cbsecond', inputValue: '9', xtype: 'checkbox', columnWidth: 30 },
										{ boxLabel: '10', name: 'cbsecond',inputValue: '10', xtype: 'checkbox', columnWidth: 30 },
										{ boxLabel: '11', name: 'cbsecond',inputValue: '11', xtype: 'checkbox', columnWidth: 30},
										{ boxLabel: '12', name: 'cbsecond',inputValue: '12', xtype: 'checkbox', columnWidth: 30 },
										{ boxLabel: '13', name: 'cbsecond',inputValue: '13', xtype: 'checkbox', columnWidth: 30 },
										{ boxLabel: '14', name: 'cbsecond',inputValue: '14', xtype: 'checkbox', columnWidth: 30 },
										{ boxLabel: '15', name: 'cbsecond',inputValue: '15', xtype: 'checkbox', columnWidth: 30 },
										{ boxLabel: '16', name: 'cbsecond',inputValue: '16', xtype: 'checkbox', columnWidth: 30 },
										{ boxLabel: '17', name: 'cbsecond',inputValue: '17', xtype: 'checkbox', columnWidth: 30 },
										{ boxLabel: '18', name: 'cbsecond',inputValue: '18', xtype: 'checkbox', columnWidth: 30 },
										{ boxLabel: '19', name: 'cbsecond',inputValue: '19', xtype: 'checkbox', columnWidth: 30 },
										{ boxLabel: '20', name: 'cbsecond',inputValue: '20', xtype: 'checkbox', columnWidth: 30 },
										{ boxLabel: '21', name: 'cbsecond',inputValue: '21', xtype: 'checkbox', columnWidth: 30 },
										{ boxLabel: '22', name: 'cbsecond',inputValue: '22', xtype: 'checkbox', columnWidth: 30 },
										{ boxLabel: '23', name: 'cbsecond',inputValue: '23', xtype: 'checkbox', columnWidth: 30 },
										{ boxLabel: '24', name: 'cbsecond',inputValue: '24', xtype: 'checkbox', columnWidth: 30 },
										{ boxLabel: '25', name: 'cbsecond',inputValue: '25', xtype: 'checkbox', columnWidth: 30 },
										{ boxLabel: '26', name: 'cbsecond',inputValue: '26', xtype: 'checkbox', columnWidth: 30 },
										{ boxLabel: '27', name: 'cbsecond',inputValue: '27', xtype: 'checkbox', columnWidth: 30 },
										{ boxLabel: '28', name: 'cbsecond',inputValue: '28', xtype: 'checkbox', columnWidth: 30 },
										{ boxLabel: '29', name: 'cbsecond',inputValue: '29', xtype: 'checkbox', columnWidth: 30 },
										{ boxLabel: '30', name: 'cbsecond',inputValue: '30', xtype: 'checkbox', columnWidth: 30 },
										{ boxLabel: '31', name: 'cbsecond',inputValue: '31', xtype: 'checkbox', columnWidth: 30},
										{ boxLabel: '32', name: 'cbsecond',inputValue: '32', xtype: 'checkbox', columnWidth: 30 },
										{ boxLabel: '33', name: 'cbsecond',inputValue: '33', xtype: 'checkbox', columnWidth: 30 },
										{ boxLabel: '34', name: 'cbsecond',inputValue: '34', xtype: 'checkbox', columnWidth: 30 },
										{ boxLabel: '35', name: 'cbsecond',inputValue: '35', xtype: 'checkbox', columnWidth: 30 },
										{ boxLabel: '36', name: 'cbsecond',inputValue: '36', xtype: 'checkbox', columnWidth: 30 },
										{ boxLabel: '37', name: 'cbsecond',inputValue: '37', xtype: 'checkbox', columnWidth: 30 },
										{ boxLabel: '38', name: 'cbsecond',inputValue: '38', xtype: 'checkbox', columnWidth: 30 },
										{ boxLabel: '39', name: 'cbsecond',inputValue: '39', xtype: 'checkbox', columnWidth: 30 },
										{ boxLabel: '40', name: 'cbsecond',inputValue: '40', xtype: 'checkbox', columnWidth: 30 },
										{ boxLabel: '41', name: 'cbsecond',inputValue: '41', xtype: 'checkbox', columnWidth: 30 },
										{ boxLabel: '42', name: 'cbsecond',inputValue: '42', xtype: 'checkbox', columnWidth: 30 },
										{ boxLabel: '43', name: 'cbsecond',inputValue: '43', xtype: 'checkbox', columnWidth: 30 },
										{ boxLabel: '44', name: 'cbsecond',inputValue: '44', xtype: 'checkbox', columnWidth: 30 },
										{ boxLabel: '45', name: 'cbsecond',inputValue: '45', xtype: 'checkbox', columnWidth: 30 },
										{ boxLabel: '46', name: 'cbsecond',inputValue: '46', xtype: 'checkbox', columnWidth: 30 },
										{ boxLabel: '47', name: 'cbsecond',inputValue: '47', xtype: 'checkbox', columnWidth: 30 },
										{ boxLabel: '48', name: 'cbsecond',inputValue: '48', xtype: 'checkbox', columnWidth: 30 },
										{ boxLabel: '49', name: 'cbsecond',inputValue: '49', xtype: 'checkbox', columnWidth: 30 },
										{ boxLabel: '50', name: 'cbsecond',inputValue: '50', xtype: 'checkbox', columnWidth: 30 },
										{ boxLabel: '51', name: 'cbsecond',inputValue: '51', xtype: 'checkbox', columnWidth: 30 },
										{ boxLabel: '52', name: 'cbsecond',inputValue: '52', xtype: 'checkbox', columnWidth: 30 },
										{ boxLabel: '53', name: 'cbsecond',inputValue: '53', xtype: 'checkbox', columnWidth: 30 },
										{ boxLabel: '54', name: 'cbsecond',inputValue: '54', xtype: 'checkbox', columnWidth: 30 },
										{ boxLabel: '55', name: 'cbsecond',inputValue: '55', xtype: 'checkbox', columnWidth: 30 },
										{ boxLabel: '56', name: 'cbsecond',inputValue: '56', xtype: 'checkbox', columnWidth: 30 },
										{ boxLabel: '57', name: 'cbsecond',inputValue: '57', xtype: 'checkbox', columnWidth: 30 },
										{ boxLabel: '58', name: 'cbsecond',inputValue: '58', xtype: 'checkbox', columnWidth: 30 },
										{ boxLabel: '59', name: 'cbsecond',inputValue: '59', xtype: 'checkbox', columnWidth: 30 },
										{ boxLabel: '60', name: 'cbsecond',inputValue: '60', xtype: 'checkbox', columnWidth: 30 },
			     					],
			     				    listeners :{
			     				    	'change' : function(that, newValue, oldValue, eOpts){
			     	   						var t=typeof(newValue.cbsecond);
			     	   						switch(t){
				     	   	    				case "string":
				     	   	    					var updated=Ext.getCmp("CronExpressionSettingWindow").updateValue(0,newValue.cbsecond);
				     		   	    				Ext.getCmp("expression").setValue(updated);
				     	   	    					break;
				     	   	    				case "object":
				     	   	    					var updated=Ext.getCmp("CronExpressionSettingWindow").updateValue(0,newValue.cbsecond.join(','));
				     		   	    				Ext.getCmp("expression").setValue(updated);
				     	   	    					break;
				     	   	    				case "undefined":
				     	   	    					var updated=Ext.getCmp("CronExpressionSettingWindow").updateValue(0,'*');
				     	   	    					Ext.getCmp("expression").setValue(updated);
				     	   	    					break;
				     	   	    				default:
				     	   	    					break;
			     	   	    	  	    	 }
			     	       					}
			     					    }
		    					}]
		    				})
	     	    		],
	     	    		listeners :{    			
	     	    			'change':function(that, newValue, oldValue, eOpts){
	     	    				switch (parseInt(newValue.st)){
		     	    				case 0:
		     	    					var updated=Ext.getCmp("CronExpressionSettingWindow").updateValue(0,'*');
		     	    					Ext.getCmp("expression").setValue(updated);
		     	    					break;
		     	    				default:
		     	    					break;
	     	    	  	    	 }
     	    				}
     	    	    	}
	     	    	}]
	    	    },
	    	    {
	    	    	title:"日",
	    	    	items:[
	     	    	{
	     	    		xtype:'radiogroup',
	     	    		itemId:'dayType',
	     	    		layout: 'form',
	     	    		items:[
	    			    new Ext.form.Radio({boxLabel:'不指定',labelSeparator:'', name:'dt',inputValue:"0"}),
	    				new Ext.form.Radio({boxLabel:'每天',labelSeparator:'', name:'dt',inputValue:"1",checked:true}),                      
	    				new Ext.form.Radio({boxLabel:'指定',labelSeparator:'', name:'dt',inputValue:"2",
    						listeners :{
						    	'change' : function(that, newValue, oldValue, eOpts){
						    		if(!newValue){
						    			Ext.ComponentQuery.query('checkbox[name=cbday]').forEach(function(item){
    	    	   	    					item.checked=false;
    	    	   	    			        item.disabled=true;
    	    	   	    				});
						    			Ext.getCmp("daycbg").disabled=true;
						    		}else{
						    			Ext.ComponentQuery.query('checkbox[name=cbday]').forEach(function(item){
    	    	   	    			        item.disabled=false;
    	    	   	    				});
						    			Ext.getCmp("daycbg").enable(true);
						    		}
    						    }
    						}
	    				}),
    					new Ext.panel.Panel({
	    					layout: 'column',
	    					items: [{
								id:'daycbg',
								vertical: false,
    					        xtype:'checkboxgroup',
    					        columns: 10,
    					        items: [
						           { boxLabel: '1', name: 'cbday', inputValue: '1', xtype: 'checkbox', columnWidth: 30 },
								   { boxLabel: '2', name: 'cbday', inputValue: '2', xtype: 'checkbox', columnWidth: 30 },
								   { boxLabel: '3', name: 'cbday', inputValue: '3', xtype: 'checkbox', columnWidth: 30 },
								   { boxLabel: '4', name: 'cbday', inputValue: '4', xtype: 'checkbox', columnWidth: 30 },
								   { boxLabel: '5', name: 'cbday', inputValue: '5', xtype: 'checkbox', columnWidth: 30 },
								   { boxLabel: '6', name: 'cbday', inputValue: '6', xtype: 'checkbox', columnWidth: 30 },
								   { boxLabel: '7', name: 'cbday', inputValue: '7', xtype: 'checkbox', columnWidth: 30 },
								   { boxLabel: '8', name: 'cbday', inputValue: '8', xtype: 'checkbox', columnWidth: 30 },
								   { boxLabel: '9', name: 'cbday', inputValue: '9', xtype: 'checkbox', columnWidth: 30 },
								   { boxLabel: '10', name: 'cbday', inputValue: '10', xtype: 'checkbox', columnWidth: 30 },
								   { boxLabel: '11', name: 'cbday', inputValue: '11', xtype: 'checkbox', columnWidth: 30},
								   { boxLabel: '12', name: 'cbday', inputValue: '12', xtype: 'checkbox', columnWidth: 30 },
								   { boxLabel: '13', name: 'cbday', inputValue: '13', xtype: 'checkbox', columnWidth: 30 },
								   { boxLabel: '14', name: 'cbday', inputValue: '14', xtype: 'checkbox', columnWidth: 30 },
								   { boxLabel: '15', name: 'cbday', inputValue: '15', xtype: 'checkbox', columnWidth: 30 },
								   { boxLabel: '16', name: 'cbday', inputValue: '16', xtype: 'checkbox', columnWidth: 30 },
								   { boxLabel: '17', name: 'cbday', inputValue: '17', xtype: 'checkbox', columnWidth: 30 },
								   { boxLabel: '18', name: 'cbday', inputValue: '18', xtype: 'checkbox', columnWidth: 30 },
								   { boxLabel: '19', name: 'cbday', inputValue: '19', xtype: 'checkbox', columnWidth: 30 },
								   { boxLabel: '20', name: 'cbday', inputValue: '20', xtype: 'checkbox', columnWidth: 30 },
								   { boxLabel: '21', name: 'cbday', inputValue: '21', xtype: 'checkbox', columnWidth: 30 },
								   { boxLabel: '22', name: 'cbday', inputValue: '22', xtype: 'checkbox', columnWidth: 30 },
								   { boxLabel: '23', name: 'cbday', inputValue: '23', xtype: 'checkbox', columnWidth: 30 },
								   { boxLabel: '24', name: 'cbday', inputValue: '24', xtype: 'checkbox', columnWidth: 30 },
								   { boxLabel: '25', name: 'cbday', inputValue: '25', xtype: 'checkbox', columnWidth: 30 },
								   { boxLabel: '26', name: 'cbday', inputValue: '26', xtype: 'checkbox', columnWidth: 30 },
								   { boxLabel: '27', name: 'cbday', inputValue: '27', xtype: 'checkbox', columnWidth: 30 },
								   { boxLabel: '28', name: 'cbday', inputValue: '28', xtype: 'checkbox', columnWidth: 30 },
								   { boxLabel: '29', name: 'cbday', inputValue: '29', xtype: 'checkbox', columnWidth: 30 },
								   { boxLabel: '30', name: 'cbday', inputValue: '30', xtype: 'checkbox', columnWidth: 30 },
								   { boxLabel: '31', name: 'cbday', inputValue: '31', xtype: 'checkbox', columnWidth: 30 }
								],
							    listeners :{
							    	'change' : function(that, newValue, oldValue, eOpts){
			       						var t=typeof(newValue.cbday);
			       						switch(t)
			   	   	    				{
				   	   	    				case "string":
				   	   	    					var updated=Ext.getCmp("CronExpressionSettingWindow").updateValue(3,newValue.cbday);
				   		   	    				Ext.getCmp("expression").setValue(updated);
				   	   	    					break;
				   	   	    				case "object":
				   	   	    					var updated=Ext.getCmp("CronExpressionSettingWindow").updateValue(3,newValue.cbday.join(','));
				   		   	    				Ext.getCmp("expression").setValue(updated);
				   	   	    					break;
				   	   	    				case "undefined":
				   	   	    					var updated=Ext.getCmp("CronExpressionSettingWindow").updateValue(3,'*');
				   	   	    					Ext.getCmp("expression").setValue(updated);
				   	   	    					break;
				   	   	    				default:
				   	   	    					break;
			   	   	    	  	    	 }
							    	}
							    }
	    					}]
	    				}),
	    				new Ext.form.Radio({boxLabel:'本月最后一天',labelSeparator:'', name:'dt',inputValue:"3"}),
	    				new Ext.form.Radio({boxLabel:'当日',labelSeparator:'', name:'dt',inputValue:"4"})
	     	    		],
	     	    		listeners :{    			
	     	    			'change':function(that, newValue, oldValue, eOpts){
	     	    				switch (parseInt(newValue.dt))
	     	    				{
	     	    				case 0:
	     	    					var updated=Ext.getCmp("CronExpressionSettingWindow").updateValue(3,'?');
	     	    					Ext.getCmp("expression").setValue(updated);
	     	    					break;
	     	    				case 1:
	     	    					var updated=Ext.getCmp("CronExpressionSettingWindow").updateValue(3,'*');
	     	    					Ext.getCmp("expression").setValue(updated);
	     	    					break;
	     	    				case 3:
	     	    					var updated=Ext.getCmp("CronExpressionSettingWindow").updateValue(3,'L');
	     	    					Ext.getCmp("expression").setValue(updated);
	     	    					break;
	     	    				case 4:
	     	    					var myDate = new Date();
	    	    					var y = myDate.getFullYear();
	    	    					var m = myDate.getMonth()+1;
	    	    					var d = myDate.getDate();
	    	    					Ext.getCmp("expression").setValue("* * * " + d + " " + m + " ? " + y);
	     	    					break;
	     	    				default:
	     	    					break;
	     	    	  	    	 }
     	    				}
     	    	    	}
	     	    	}]
	    	    },
	    	    {
	    	    	title:"月",
	    	    	items:[
	      	    	{
	      	    		xtype:'radiogroup',
	      	    		itemId:'monthType',
	      	    		layout: 'form',
	      	    		items:[
	    				    new Ext.form.Radio({boxLabel:'不指定',labelSeparator:'', name:'mt',inputValue:"0"}),
	    					new Ext.form.Radio({boxLabel:'每月',labelSeparator:'', name:'mt',inputValue:"1",checked:true}),                      
	    					new Ext.form.Radio({boxLabel:'指定',labelSeparator:'', name:'mt',inputValue:"2",
	    						listeners :{
    						    	'change' : function(that, newValue, oldValue, eOpts){
    						    		if(!newValue){
    						    			Ext.ComponentQuery.query('checkbox[name=cbmonth]').forEach(function(item){
        	    	   	    					item.checked=false;
        	    	   	    			        item.disabled=true;
        	    	   	    				});
    						    			Ext.getCmp("monthcbg").disabled=true;
    						    		}else{
    						    			Ext.ComponentQuery.query('checkbox[name=cbmonth]').forEach(function(item){
        	    	   	    			        item.disabled=false;
        	    	   	    				});
    						    			Ext.getCmp("monthcbg").enable(true);
    						    		}
	    						    }}
		    					}),
	    					new Ext.panel.Panel({
		    					layout: 'column',
		    					items: [{
									id:'monthcbg',
	    					        xtype:'checkboxgroup',
	    					        vertical: false,
	    					        columns: 6,
	    					        items: [
	    							{	boxLabel:"一月",xtype:"checkbox",name:"cbmonth",columnWidth:70,inputValue:"1" }, 
	    							{	boxLabel:"二月",xtype:"checkbox",name:"cbmonth",columnWidth:70,inputValue:"2" },	
	    							{	boxLabel:"三月",xtype:"checkbox",name:"cbmonth",columnWidth:70,inputValue:"3" },
	    							{	boxLabel:"四月",xtype:"checkbox",name:"cbmonth",columnWidth:70,inputValue:"4" },
	    							{	boxLabel:"五月",xtype:"checkbox",name:"cbmonth",columnWidth:70,inputValue:"5" },
	    							{	boxLabel:"六月",xtype:"checkbox",name:"cbmonth",columnWidth:70,inputValue:"6" },
	    							{	boxLabel:"七月",xtype:"checkbox",name:"cbmonth",columnWidth:70,inputValue:"7" },
	    							{	boxLabel:"八月",xtype:"checkbox",name:"cbmonth",columnWidth:70,inputValue:"8" },
	    							{	boxLabel:"九月",xtype:"checkbox",name:"cbmonth",columnWidth:70,inputValue:"9" },
	    							{	boxLabel:"十月",xtype:"checkbox",name:"cbmonth",columnWidth:70,inputValue:"10" },
	    							{	boxLabel:"十一",xtype:"checkbox",name:"cbmonth",columnWidth:70,inputValue:"11" },
	    							{	boxLabel:"十二",xtype:"checkbox",name:"cbmonth",columnWidth:70,inputValue:"12" }
	    					        ],
	    						    listeners :{
	    						    	'change' : function(that, newValue, oldValue, eOpts){
	    	        						var t=typeof(newValue.cbmonth);
	    	        						switch(t)
	    	    	   	    				{
	    	    	   	    				case "string":
	    	    	   	    					var updated=Ext.getCmp("CronExpressionSettingWindow").updateValue(4,newValue.cbmonth);
	    	    		   	    				Ext.getCmp("expression").setValue(updated);
	    	    	   	    					break;
	    	    	   	    				case "object":
	    	    	   	    					var updated=Ext.getCmp("CronExpressionSettingWindow").updateValue(4,newValue.cbmonth.join(','));
	    	    		   	    				Ext.getCmp("expression").setValue(updated);
	    	    	   	    					break;
	    	    	   	    				case "undefined":
	    	    	   	    					var updated=Ext.getCmp("CronExpressionSettingWindow").updateValue(4,'*');
	    	    	   	    					Ext.getCmp("expression").setValue(updated);
	    	    	   	    					break;
	    	    	   	    				default:
	    	    	   	    					break;
	    	    	   	    	  	    	 }
	    	        					}
	    						    }
		    					}]
		    				})	
	      	    		],
	      	    		listeners :{    			
	      	    			'change':function(that, newValue, oldValue, eOpts){
	      	    				switch (parseInt(newValue.mt))
	      	    				{
	      	    				case 0:
	      	    					var updated=Ext.getCmp("CronExpressionSettingWindow").updateValue(4,'?');
	    	   	    				Ext.getCmp("expression").setValue(updated);
	      	    					break;
	      	    				case 1:
	      	    					var updated=Ext.getCmp("CronExpressionSettingWindow").updateValue(4,'*');
	    	   	    				Ext.getCmp("expression").setValue(updated);
	      	    					break;
	      	    				default:
	      	    					break;
	      	    	  	    	 }
	      	    				}
	      	    	    	}
	      	    	}]
	    	    },
	    	    {
	    	    	title:"周",
	    	    	items:[
	     	    	{
	     	    		xtype:'radiogroup',
	     	    		itemId:'weekType',
	     	    		layout: 'form',
	     	    		items:[
	    			    new Ext.form.Radio({boxLabel:'不指定',labelSeparator:'', name:'wt',inputValue:"0"}),
	    				new Ext.form.Radio({boxLabel:'每周',labelSeparator:'', name:'wt',inputValue:"1",checked:true}),
	    				new Ext.form.Radio({boxLabel:'指定',labelSeparator:'', name:'wt',inputValue:"2",
    						listeners :{
						    	'change' : function(that, newValue, oldValue, eOpts){
						    		if(!newValue){
						    			Ext.ComponentQuery.query('checkbox[name=cbweek]').forEach(function(item){
    	    	   	    					item.checked=false;
    	    	   	    			        item.disabled=true;
    	    	   	    				});
						    			Ext.getCmp("weekcbg1").disabled=true;
						    		}else{
						    			Ext.ComponentQuery.query('checkbox[name=cbweek]').forEach(function(item){
    	    	   	    			        item.disabled=false;
    	    	   	    				});
						    			Ext.getCmp("weekcbg1").enable(true);
						    		}
    						    }}
	    					}),
	    				new Ext.panel.Panel({
	    					layout: 'column',
	    					items: [{
								id:'weekcbg1',
								vertical: false,
    					        xtype:'checkboxgroup',
    					        columns: 7,
    					        items: [
						        {	boxLabel:"周日",xtype:"checkbox",columnWidth:70,name:"cbweek",inputValue:"1" },
								{	boxLabel:"周一",xtype:"checkbox",columnWidth:70,name:"cbweek",inputValue:"2" }, 
								{	boxLabel:"周二",xtype:"checkbox",columnWidth:70,name:"cbweek",inputValue:"3" },	
								{	boxLabel:"周三",xtype:"checkbox",columnWidth:70,name:"cbweek",inputValue:"4" },
								{	boxLabel:"周四",xtype:"checkbox",columnWidth:70,name:"cbweek",inputValue:"5" },
								{	boxLabel:"周五",xtype:"checkbox",columnWidth:70,name:"cbweek",inputValue:"6" },
								{	boxLabel:"周六",xtype:"checkbox",columnWidth:70,name:"cbweek",inputValue:"7" }
						        ],
							    listeners :{
							    	'change' : function(that, newValue, oldValue, eOpts){
			       						var t=typeof(newValue.cbweek);
			       						switch(t)
			   	   	    				{
				   	   	    				case "string":
				   	   	    					var updated=Ext.getCmp("CronExpressionSettingWindow").updateValue(5,newValue.cbweek);
				   		   	    				Ext.getCmp("expression").setValue(updated);
				   	   	    					break;
				   	   	    				case "object":
				   	   	    					var updated=Ext.getCmp("CronExpressionSettingWindow").updateValue(5,newValue.cbweek.join(','));
				   		   	    				Ext.getCmp("expression").setValue(updated);
				   	   	    					break;
				   	   	    				case "undefined":
				   	   	    					var updated=Ext.getCmp("CronExpressionSettingWindow").updateValue(5,'*');
				   	   	    					Ext.getCmp("expression").setValue(updated);
				   	   	    					break;
				   	   	    				default:
				   	   	    					break;
			   	   	    	  	    	 }
			       					}
	    					    }
	    					}]
	    				}),
	    				new Ext.form.Radio({boxLabel:'本月最后一个星期几',labelSeparator:'', name:'wt',inputValue:"3",
    						listeners :{
						    	'change' : function(that, newValue, oldValue, eOpts){
						    		if(!newValue){
						    			Ext.ComponentQuery.query('checkbox[name=rweek]').forEach(function(item){
    	    	   	    			        item.disabled=true;
    	    	   	    				});
						    			Ext.getCmp("weekcbg2").disabled=true;
						    		}else{
						    			Ext.ComponentQuery.query('checkbox[name=rweek]').forEach(function(item){
    	    	   	    			        item.disabled=false;
    	    	   	    				});
						    			Ext.getCmp("weekcbg2").enable(true);
						    		}
    						    }}
	    					}),
	    				new Ext.panel.Panel({
	    					layout: 'column',
	    					items: [{
								id:'weekcbg2',
								vertical: false,
    					        xtype:'checkboxgroup',
    					        columns: 7,
    					        items: [
	    				        {	boxLabel:"周日",xtype:"radio",columnWidth:70,name:"rweek",inputValue:"1L" },
	    						{	boxLabel:"周一",xtype:"radio",columnWidth:70,name:"rweek",inputValue:"2L" }, 
	    						{	boxLabel:"周二",xtype:"radio",columnWidth:70,name:"rweek",inputValue:"3L" },	
	    						{	boxLabel:"周三",xtype:"radio",columnWidth:70,name:"rweek",inputValue:"4L" },
	    						{	boxLabel:"周四",xtype:"radio",columnWidth:70,name:"rweek",inputValue:"5L" },
	    						{	boxLabel:"周五",xtype:"radio",columnWidth:70,name:"rweek",inputValue:"6L" },
	    						{	boxLabel:"周六",xtype:"radio",columnWidth:70,name:"rweek",inputValue:"7L" }
	    				        ],
	    					    listeners :{
	    					    	'change' : function(that, newValue, oldValue, eOpts){
		           						var updated=Ext.getCmp("CronExpressionSettingWindow").updateValue(5,newValue.rweek);
		    		   	    				Ext.getCmp("expression").setValue(updated);
	    					    	}
	    					    }
	    					}]
	    				})
	     	    		],
	     	    		listeners :{    			
	     	    			'change':function(that, newValue, oldValue, eOpts){
	     	    				switch (parseInt(newValue.wt))
	      	    				{
	      	    				case 0:
	      	    					var updated=Ext.getCmp("CronExpressionSettingWindow").updateValue(5,'?');
	    	   	    				Ext.getCmp("expression").setValue(updated);
	      	    					break;
	      	    				case 1:
	      	    					var updated=Ext.getCmp("CronExpressionSettingWindow").updateValue(5,'*');
	    	   	    				Ext.getCmp("expression").setValue(updated);
	      	    					break;
	      	    				default:
	      	    					break;
	      	    	  	    	 }
	     	    				}
	     	    	    	}
	     	    	}]
	    	    },
		    	{
	    	    	title:"年",
	    	    	items:[
	    	    	{
	    	    		xtype:'radiogroup',
	    	    		itemId:'yearType',
	    	    		layout: 'form',
	    	    		items:[
	    	    		    new Ext.form.Radio({boxLabel:'不指定',labelSeparator:'', name:'yt',inputValue:"0"}),
	    					new Ext.form.Radio({boxLabel:'每年',labelSeparator:'', name:'yt',inputValue:"1",checked:true}),                      
	    					new Ext.form.Radio({boxLabel:'今年',labelSeparator:'', name:'yt',inputValue:"2"}),                      
	    					new Ext.form.Radio({boxLabel:'明年',labelSeparator:'', name:'yt',inputValue:"3"})
	    	    		],
	    	    		listeners :{
	    	    			'change':function(that, newValue, oldValue, eOpts){
	    	    				var year = new Date();
	    	    				var y=year.getFullYear();
	    	    				switch (parseInt(newValue.yt))
	    	    				{
	    	    				case 0:
	    	    					y='';
	    	    					break;
	    	    				case 1:
	    	    					y='*';
	    	    					break;
	    	    				case 2:
	    	    					break;
	    	    				default:
	    	    					y=y+1;
	    	    				}
	    	    				var updated=Ext.getCmp("CronExpressionSettingWindow").updateValue(6,y);
	    	    				Ext.getCmp("expression").setValue(updated);
	    	    	    	}
	    	    		}
	    	    	}]
	    	    }
	    	    ],
	    	    listeners:{
	      		 'tabchange':function( tabPanel, newCard, oldCard, eOpts ){
	      			var tabName = newCard.title;
	      			switch(tabName)
    				{
	    				case "月":
	    					var isZhiDingCheck=Ext.ComponentQuery.query('#monthType')[0].items.items[2].checked;
	   	    				if(!isZhiDingCheck){	
	   	    					Ext.ComponentQuery.query('checkbox[name=cbmonth]').forEach(function(item){
    	   	    					item.checked=false;
    	   	    			        item.disabled=true;
    	   	    				});
	   	    					Ext.getCmp("monthcbg").disabled=true;
	   	    				}
	    					break;
	    				case "周":
	    					//选周则不指定日
	    					var updated=Ext.getCmp("CronExpressionSettingWindow").updateValue(3,'?');
	   	    				Ext.getCmp("expression").setValue(updated);
	   	    				updated=Ext.getCmp("CronExpressionSettingWindow").updateValue(5,'*');
	   	    				Ext.getCmp("expression").setValue(updated);
	    					var isZhiDing1Check=Ext.ComponentQuery.query('#weekType')[0].items.items[2].checked;
	    					var isZhiDing2Check=Ext.ComponentQuery.query('#weekType')[0].items.items[3].checked;
	   	    				if(!isZhiDing1Check){
	   	    					Ext.ComponentQuery.query('checkbox[name=cbweek]').forEach(function(item){
    	   	    					item.checked=false;
    	   	    			        item.disabled=true;
    	   	    				});
	   	    					Ext.getCmp("weekcbg1").disabled=true;
	   	    				}
	   	    				if(!isZhiDing2Check){
	   	    					Ext.ComponentQuery.query('checkbox[name=rweek]').forEach(function(item){
    	   	    			        item.disabled=true;
    	   	    				});
	   	    					Ext.getCmp("weekcbg2").disabled=true;
	   	    				}
	    					break;
	    				case "日":
	    					//选日则不指定周
	    					var updated=Ext.getCmp("CronExpressionSettingWindow").updateValue(5,'?');
	   	    				Ext.getCmp("expression").setValue(updated);
	   	    				updated=Ext.getCmp("CronExpressionSettingWindow").updateValue(3,'*');
	   	    				Ext.getCmp("expression").setValue(updated);
	    					var isZhiDingCheck=Ext.ComponentQuery.query('#dayType')[0].items.items[2].checked;
	   	    				if(!isZhiDingCheck)
	   	    					Ext.ComponentQuery.query('checkbox[name=cbday]').forEach(function(item){
    	   	    					item.checked=false;
    	   	    			        item.disabled=true;
    	   	    				});
	   	    					Ext.getCmp("daycbg").disabled=true;
	    					break;
	    				case "时":
	    					var isZhiDingCheck=Ext.ComponentQuery.query('#hourType')[0].items.items[1].checked;
	   	    				if(!isZhiDingCheck)
	   	    					Ext.ComponentQuery.query('checkbox[name=cbhour]').forEach(function(item){
    	   	    					item.checked=false;
    	   	    			        item.disabled=true;
    	   	    				});
	   	    					Ext.getCmp("hourcbg").disabled=true;
	    					break;
	    				case "分":
	    					var isZhiDingCheck=Ext.ComponentQuery.query('#minuteType')[0].items.items[1].checked;
	   	    				if(!isZhiDingCheck)
	   	    					Ext.ComponentQuery.query('checkbox[name=cbminute]').forEach(function(item){
    	   	    					item.checked=false;
    	   	    			        item.disabled=true;
    	   	    				});
	   	    					Ext.getCmp("minutecbg").disabled=true;
	    					break;
	    				case "秒":
	    					var isZhiDingCheck=Ext.ComponentQuery.query('#secondType')[0].items.items[1].checked;
	   	    				if(!isZhiDingCheck)
	   	    					Ext.ComponentQuery.query('checkbox[name=cbsecond]').forEach(function(item){
    	   	    					item.checked=false;
    	   	    			        item.disabled=true;
    	   	    				});
	   	    					Ext.getCmp("secondcbg").disabled=true;
	    					break;
	    				default:
	    					break;
    	  	    	 }
	     	      	}
	    	    }
	       },
	       {
	       	xtype:'panel',
	       	layout: {
	               type: 'hbox',
	               align:'stretch'
	       	 },
	       	id: 'cronExpressionPanel',
	       	flex:1,
	       	items:[
	    	    {
	    	    	flex: 9,
	    	    	fieldLabel: 'Cron表达式',
	    	    	xtype: 'textfield',
	    	    	id: 'expression'
	    	    },
	    	    {
	    	    	flex: 1,
	    	    	xtype:'button',
	    	    	text:'确定',
	    	    	id: 'btnCopyExpression',
    	    		handler:function(){
	    				var val=Ext.getCmp("expression").getValue();
	    				Ext.getCmp("CronSettingCombo").setValue(val);
	    				Ext.getCmp("CronExpressionSettingWindow").close();
	    			}
	    	    }]
	       }
	       ],
	        listeners: {
	       	 	'activate': function( that, eOpts ){
	       	 		Ext.getCmp("expression").setValue("* * * * * * *");
	       	 	}
	        },
	        //index: start from 0
	        updateValue:function(index,newvalue){
	        	var express=Ext.getCmp("expression").getValue();
	        	var count=0;
	        	var a=new Array();
	        	for (var i = 0; i<express.split(' ').length ;i++){
	    			if(i != index){
	    				a.push(express.split(' ')[i]);
	    			}else{
	    				a.push(newvalue);
	    			}
	        	}
	    		return a.join(' '); 
	    	}
        });
        me.callParent(arguments);
    }
});