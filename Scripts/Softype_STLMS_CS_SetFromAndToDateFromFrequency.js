/*************************************************************************
 * Copyright (c) 1998-2012 Softype, Inc.                                 
 * Morvi House, 30 Goa Street, Ballard Estate, Mumbai 400 001, India
 * All Rights Reserved.                                                    
 *                                                                        
 * This software is the confidential and proprietary information of          
 * Softype, Inc. ("Confidential Information"). You shall not               
 * disclose such Confidential Information and shall use it only in          
 * accordance with the terms of the license agreement you entered into    
 * with Softype.
 * 
 * @author:  SHYAM SHARMA
 * @date:    14 Mar 2016
 * @version: Revised version
 * 
 **************************************************************************/
///ROUND((MONTHS_BETWEEN({custrecord_stlms_rpla_todate},({custrecord_stlms_rpla_fromdate}-1))),1)

var leaveAccrualFreqncy=0,leaveCalndrStMonth=0,leaveCalndrStMonth1=0,fromDate='',toDate='';
var newFromDate='',newToDate='';
var today = new Date();
var currYear = '';
var runPeriodicStatus = 2;//Completed

function fieldChange_setFromToDate(type, name)
{
	try
	{

//		if(type=='create')
		{

			if(name == 'custrecord_stlms_rpla_employeetype') {

				var empType = nlapiGetFieldValue('custrecord_stlms_rpla_employeetype');

				if(empType != '' && empType != null) {

					//Suitelet call with required parameters to search Leave Management Setup to get Frequency selected for the selected employee type.
					var URL = nlapiResolveURL('SUITELET', 'customscript_stlms_leaveapplicationretur', 'customdeploy_stlms_leaveapplicationretur', true);
					var searchResult = nlapiRequestURL(URL,{action:'searchLeaveMngmntSetup',empType:empType, method:'setup'});

					//Search Leave Management Setup to get Frequency selected for the selected employee type.
					var a = JSON.parse(searchResult.getBody());

					/**Search Leave Management Setup to get frequency and start date and month for the selected employee type.**/
					var setupSearchs = a.getSearch;
					if(setupSearchs == 'T')
					{
						/**Value of frequency to set the to date on the record.**/
						leaveAccrualFreqncy = parseInt(a.frequency);
						var monthToAdd = getMonthFreq(leaveAccrualFreqncy);

						/**Start month to set the from date on accrual record if current is the initial record.**/
						leaveCalndrStMonth  = parseInt(a.calendarStart);
						leaveCalndrStMonth1 = a.calendarStartDate;

						//Suitelet call with required parameters to search on Run Periodic Leave Accrual record to get the latest.
						var URL = nlapiResolveURL('SUITELET', 'customscript_stlms_leaveapplicationretur', 'customdeploy_stlms_leaveapplicationretur', true);
						var searchResult = nlapiRequestURL(URL,{action:'searchRunAccrual',empType:empType, method:'runaccrual'});

						//Search on Run Periodic Leave Accrual record to get the latest.
						var runAccrual = JSON.parse(searchResult.getBody());

						var lastRunPeriodicLeaveAccurl = runAccrual.getSearch;

						if(lastRunPeriodicLeaveAccurl == 'T')
						{

							var fromDate1 = runAccrual.fromDate;
							var toDate1 = runAccrual.toDate;
							var tempid = runAccrual.tempid;

							if(monthToAdd <= 12)
							{
								
								toDate1 = nlapiStringToDate(toDate1)
								var startDate1 = nlapiAddDays(toDate1,1);
								newFromDate = startDate1;
								newFromDate = nlapiDateToString(newFromDate);

								var newYearStartDate = toDate1;
								newYearStartDate = ((nlapiAddMonths(newYearStartDate,Number(monthToAdd))));
//								alert('newYearStartDate '+newYearStartDate+' monthToAdd '+monthToAdd);
								var year = newYearStartDate.getFullYear();
								var month = newYearStartDate.getMonth()+1;
								var day = getDay(month,year);
//								alert('day '+day);
								newYearStartDate.setDate(day);
								var newToDate1 = nlapiDateToString(newYearStartDate);
								
								nlapiSetFieldValue('custrecord_stlms_rpla_fromdate',newFromDate);
								nlapiSetFieldValue('custrecord_stlms_rpla_todate',newToDate1);
							}
							else
							{
								var days = 0;
								var month = ''
								var year = '';
								var finalToDate = '';
								toDate2 = toDate1;

								toDate1 = nlapiStringToDate(toDate1)
								var startDate1 = nlapiAddDays(toDate1,1);
								newFromDate = startDate1;
								newFromDate = nlapiDateToString(newFromDate);
								var newYearStartDate = toDate1;
								newYearStartDate = ((nlapiAddMonths(newYearStartDate,Number(monthToAdd))));
								var newToDate1 = nlapiDateToString(newYearStartDate);
								if(toDate2)
								{
									toDate2 = toDate2.split('/');
									toDate2 = new Date(toDate2[1]+'/'+toDate2[0]+'/'+toDate2[2]);
								}
								var startDate1 = nlapiDateToString(nlapiAddDays(toDate2,1));
								newFromDate = startDate1;

								var toDateToChnage = nlapiDateToString(toDate1);
								var finalToDate='';
								if(toDateToChnage && newFromDate)
								{

									var fromDateNew = newFromDate;
									fromDateNew = fromDateNew.split('/');

									toDateToChnage = toDateToChnage.split('/');
									days = toDateToChnage[0];
									if(days!=15)
									{

										finalToDate = '15'+'/'+fromDateNew[1]+'/'+fromDateNew[2];
									}
									else
									{
										newFromDate = nlapiAddDays(toDate1,1);
										var tempDate = newFromDate;
										newFromDate = nlapiDateToString(newFromDate);

										var year = tempDate.getFullYear();
										var month = tempDate.getMonth()+1;
										var day = getDay(month,year);

										toDate1 = tempDate;
										toDate1.setDate(day);
										finalToDate = nlapiDateToString(toDate1);

									}
								}

								nlapiSetFieldValue('custrecord_stlms_rpla_fromdate',newFromDate);
								nlapiSetFieldValue('custrecord_stlms_rpla_todate',finalToDate);

							}
						}
						//If no records found.
						else
						{

							fromDate = a.calendarStartDate;
							newFromDate = fromDate;
							var toDate1 = newFromDate;
							var finalToDates = '';
							
							if(monthToAdd <= 11)
							{

								fromDate = nlapiStringToDate(fromDate);
								toDate1 = fromDate;
								var year = fromDate.getFullYear();
								var month = fromDate.getMonth()+1;
								var day = getDay(month,year);
								toDate1.setDate(day);
								
								toDate1 = nlapiAddMonths(toDate1, Number(monthToAdd - 1));
								toDate1 = nlapiDateToString(toDate1);

								nlapiSetFieldValue('custrecord_stlms_rpla_fromdate',newFromDate);
								nlapiSetFieldValue('custrecord_stlms_rpla_todate',toDate1);
							}
							else if(monthToAdd == 12)
							{
								var fromDate = a.calendarStartDate;
								var finalToDate = a.calendarEndDate;

								nlapiSetFieldValue('custrecord_stlms_rpla_fromdate',fromDate);
								nlapiSetFieldValue('custrecord_stlms_rpla_todate',finalToDate);
							}
							else
							{
								var days = 0;
								var toDateToChnage = toDate;
								console.log('Nihalxx  toDateToChnage  '+ toDateToChnage);
								if(toDateToChnage)
								{
									toDateToChnage = toDateToChnage.split('/');
									days = toDateToChnage[0];
								}

								if(days!=15)
								{
									console.log('Nihalxx  days not 154 ');
									var newFromDate1 = nlapiStringToDate(newFromDate);
									var tempDate = newFromDate1;
									var year = newFromDate1.getFullYear();
									var month = newFromDate1.getMonth()+1;
									console.log('Nihalxx  month '+month);
									var day = getDay(month);
									console.log('Nihalxx  toDate1 '+toDate1);
									var toDate1 = tempDate;

									console.log('Nihalxx  toDate1 '+toDate1);
									toDate1.setDate(monthToAdd+1);
									var finalToDate = nlapiDateToString(toDate1);
									console.log('Nihalxx  finalToDate '+finalToDate);
									newToDate = finalToDate;

								}

								nlapiSetFieldValue('custrecord_stlms_rpla_fromdate',newFromDate);
								nlapiSetFieldValue('custrecord_stlms_rpla_todate',newToDate);
							}
						}
					}
					else
					{
						alert('No setup found for the selected employee type.');
						nlapiSetFieldValue('custrecord_stlms_rpla_employeetype', '');

					}
				}
				else 
				{
					nlapiSetFieldValue('custrecord_stlms_rpla_fromdate', '');
					nlapiSetFieldValue('custrecord_stlms_rpla_todate', '');
				}
			}
		}
	}
	catch(error)
	{
		if (error.getDetails != undefined)
		{
			nlapiLogExecution('ERROR', 'Process Error', error.getCode() + ': ' + error.getDetails());
			throw error;
		}
		else
		{
			nlapiLogExecution('ERROR', 'Unexpected Error', error.toString());
			throw nlapiCreateError('99999', error.toString());
		}
	}
}
/*
function getLeavMangtSetup(empType)
{
	var sFilt = [];
	var sColm = [];

	sFilt.push(new nlobjSearchFilter('isinactive', null, 'is', 'F'));
	sFilt.push(new nlobjSearchFilter('custrecord_stlms_su_employeetype', null, 'is', empType));

	sColm.push(new nlobjSearchColumn('custrecord_stlms_su_frequencyofaccrual'));
	sColm.push(new nlobjSearchColumn('custrecord_stlms_su_leavecalendarstart'));
	sColm.push(new nlobjSearchColumn('custrecord_stlms_su_calendarstartdate'));
	sColm.push(new nlobjSearchColumn('custrecord_stlms_su_calendarenddate'));

	var srchSetup = nlapiSearchRecord('customrecord_stlms_setups', null, sFilt, sColm);

	return srchSetup;

}
*/
function getLastRunPeriodic(empType)
{
	var sFilt = [];
	var sColm = [];
	var results = '';

	sFilt.push(new nlobjSearchFilter('isinactive', null, 'is', 'F'));
	sFilt.push(new nlobjSearchFilter('custrecord_stlms_rpla_status', null, 'is', runPeriodicStatus));
	sFilt.push(new nlobjSearchFilter('custrecord_stlms_rpla_employeetype', null, 'is', empType));

	sColm.push(new nlobjSearchColumn('custrecord_stlms_rpla_fromdate',null,'max'));
	sColm.push(new nlobjSearchColumn('custrecord_stlms_rpla_todate',null,'max'));

	var runRediodicResults = nlapiSearchRecord('customrecord_stlms_runaccrual', null, sFilt, sColm);

	if(runRediodicResults)
	{
		nlapiLogExecution('DEBUG', '462 runRediodicResults.length = ',runRediodicResults.length);
		for(var ii=0;ii<runRediodicResults.length;ii++)
		{
			var stDate = runRediodicResults[ii].getValue('custrecord_stlms_rpla_fromdate',null,'max');
			var enDate = runRediodicResults[ii].getValue('custrecord_stlms_rpla_todate',null,'max');

			nlapiLogExecution('DEBUG', '469 stDate = ',stDate+'##'+'enDate = '+enDate);
			results = stDate+'@@@'+enDate;

		}
	}

	return results;
}
/*
function getMonthFreq(leaveAccrualFreqncy)
{
	var results = 0;
	switch (leaveAccrualFreqncy) {

	//Monthly
	case 1:
		results = 1;
		break;

		//Quarterly
	case 2:
		results = 3;
		break;

		//Yearly
	case 3:
		results = 12;
		break;

		//Fortnightly
	case 4:
		results = 14;
		break;

		//Half Yearly
	case 5:
		results = 6;
		break;
	}

	return results;
}*/
