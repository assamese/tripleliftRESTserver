	/**
	 * TODO - Reads raw CSV data from a csv file
	 * 	sample CSV file is in the 'data' directory
	 */
	exports.getRawcsv = function() {
		var dataFromcsvFile = 
"Touch_Type,Event_Date,Partner,Media_Source,Channel,Campaign_ID,advertiser_id\n\
click,2016-06-18,Redhook,googleadwords_int,Search,353452564,123\n\
click,2016-06-20,Clarion,supersonicads_int,Search,360993724,234\n\
click,2016-06-20,MyAgency,facebook,Search,373654324,456\n\
impression,2016-06-18,Redhook,googleadwords_int,Search,353452564,123\n\
impression,2016-06-19,Clarion,supersonicads_int,Search,360993724,234\n\
impression,2016-06-18,MyAgency,facebook,Search,373654324,456\n\
click,2016-06-18,Redhook,googleadwords_int,Search,353452564,123\n\
click,2016-06-20,Clarion,supersonicads_int,Search,360993724,234\n\
impression,2016-06-19,Clarion,supersonicads_int,Search,360993724,234\n\
impression,2016-06-18,MyAgency,facebook,Search,373654324,456\n\
"
;		
		return dataFromcsvFile;
	}
