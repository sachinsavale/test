/* ************************************************************************************  
 ** Copyright (coffee) 1998-2012 Softype, Inc.                                 
 ** Morvi House, 30 Goa Street, Ballard Estate, Mumbai 400 001, India
 ** All Rights Reserved.                                                    
 **                                                                         
 ** This software is the confidential and proprietary information of          
 ** Softype, Inc.("Confidential Information"). You shall not disclose              
 ** such Confidential Information and shall use it only in accordance         
 ** with the terms of the license agreement you entered into with Softype.
 ** @version: Revised version               
 **                       
 ** @author: Rutika More   
 ** @dated: 
 ** @Description:
 ************************************************************************************ */
var emp;
var leaveType;
var startMonth, endMonth, todayMonth, startYear, endYear, todayYear;
var startDate, endDate;
var getDay;
var totalLeaves = 0;
var leavePeriod, firstHalf, secondHalf;
var completeStartDate, completeEndDate;

function fieldChange_calculateLeaves(type, name) {

	if (name != 'custrecord_stlms_la_leavetype' && name != 'custrecord_stlms_la_startdate' && name != 'custrecord_stlms_la_enddate' && name != 'custrecord_stlms_la_deductfrom' && name != 'custrecord_stlms_la_employeename')
	{
		//DO NOTHING
		return true;
	}

	//Field change will trigger only on change of leave typ, start date and end date
	if(name == 'custrecord_stlms_la_leavetype' || name == 'custrecord_stlms_la_startdate' || name == 'custrecord_stlms_la_enddate' || name == 'custrecord_stlms_la_deductfrom' || name == 'custrecord_stlms_la_employeename') {

		emp = nlapiGetFieldValue('custrecord_stlms_la_employeename');
		leaveType = nlapiGetFieldValue('custrecord_stlms_la_leavetype');
		var leaveTypeConsider = nlapiGetFieldValue('custrecord_stlms_la_deductfrom');

		if(name == 'custrecord_stlms_la_employeename' && leaveType != '' && leaveTypeConsider != '') {

			nlapiSetFieldValue('custrecord_stlms_la_leavetype', '');
			nlapiSetFieldValue('custrecord_stlms_la_deductfrom', '');
			nlapiSetFieldValue('custrecord_stlms_la_leavebalance', '');
			nlapiSetFieldValue('custrecord_stlms_la_carriedforwardbalanc', '');

		}

		if(leaveType != '' && leaveType != null && leaveTypeConsider != '' && leaveTypeConsider != null)
		{
//			var empType = nlapiLookupField('employee', emp, 'employeetype');
			
			var URL = nlapiResolveURL('SUITELET', 'customscript_stlms_leaveapplicationretur', 'customdeploy_stlms_leaveapplicationretur', true);
			var searchResult = nlapiRequestURL(URL,{action:'checkBalanceLine',emp:emp, leaveType:leaveType, leaveTypeConsider:leaveTypeConsider});

			//Calculated leave period.
			var a = JSON.parse(searchResult.getBody());
//			alert('Total Leaves --> '+Number(a.totalLeaves));
			 
			
//			alert('a.leaveBalance '+a.leaveBalance+' a.carryForward '+a.carryForward+' a.totalLeaves '+a.totalLeaves+' a.giveAlert '+a.giveAlert);

//			//Search Leave Balance Line to get Leave Balance and Carry Forward Leave Balance for the emp and selected leave type
//			var filter = new Array();
//			filter.push(new nlobjSearchFilter('isinactive', null, 'is', 'F'));
//			filter.push(new nlobjSearchFilter('custrecord_stlms_lbm_employeename', 'custrecord_stlms_lbline_parent', 'is', emp));
//
//			if(leaveType == leaveTypeConsider) {
//				filter.push(new nlobjSearchFilter('custrecord_stlms_lbline_leavetype', null, 'is', leaveType));
//			}
//			else if(leaveType != leaveTypeConsider) {
//				filter.push(new nlobjSearchFilter('custrecord_stlms_lbline_leavetype', null, 'is', leaveTypeConsider));
//			}
//
//			var column = new Array();
//			column.push(new nlobjSearchColumn('custrecord_stlms_lbline_leavebalance'));
//			column.push(new nlobjSearchColumn('custrecord_stlms_lbline_carriedforward'));
//
//			var search = nlapiSearchRecord('customrecord_stlms_leavebalancemasterlin', null, filter, column);
//
//			//If search set the received values
			
//			if(a.giveAlert == 'T') {
//				
//				alert('Not Allowed');
//			}
			
			if(a.getSearch == 'T') {
				
				totalLeaves = Number(a.totalLeaves);

				nlapiSetFieldValue('custrecord_stlms_la_leavebalance', a.leaveBalance);
				nlapiSetFieldValue('custrecord_stlms_la_carriedforwardbalanc', a.carryForward);
			}

			//If no results found set leave balance to zero.
			else if(a.getSearch == 'F') {

				if(leaveType == leaveTypeConsider) {
					nlapiSetFieldValue('custrecord_stlms_la_leavebalance', 0);
					nlapiSetFieldValue('custrecord_stlms_la_carriedforwardbalanc', 0);
				}
				else if(leaveType != leaveTypeConsider) {
					alert('There is no balance for the selected Leave to be deducted from field. Kindly update the field.');
					nlapiSetFieldValue('custrecord_stlms_la_deductfrom', '');
					nlapiSetFieldValue('custrecord_stlms_la_leavebalance', '');
					nlapiSetFieldValue('custrecord_stlms_la_carriedforwardbalanc', '');
				}
			}

			//Based on the leave selected search carry forward check-box and show and hide field accordingly.
//			var getLeaveTypeSetupValue = getLeaveTypeSetup(leaveType);
//			if(getLeaveTypeSetupValue) {
//			var carryForwardCheckbox = getLeaveTypeSetupValue[0].getValue('custrecord_stlms_ltsetup_carryforward');

//			if(carryForwardCheckbox == 'T') {

//			var getField = nlapiGetField('custrecord_stlms_la_carriedforwardbalanc');
//			getField.setDisplayType('hidden');
//			}
//			}

			startDate = nlapiGetFieldValue('custrecord_stlms_la_startdate');
			endDate = nlapiGetFieldValue('custrecord_stlms_la_enddate');

			if(startDate != '' && startDate != null || endDate != '' && endDate != null) {

				completeStartDate = startDate;
				startDate = nlapiStringToDate(startDate);
//				startYear = startDate.getFullYear(startDate);
//				getDay = startDate.getDay();
//				startMonth = startDate.getMonth() + Number(1);
//				startDate = startDate.getDate(startDate);
//				alert('Start Month '+startDate);
				var todaysDate = new Date();
				todayYear = todaysDate.getFullYear(todaysDate);
				todayMonth = todaysDate.getMonth() + Number(1);
				todaysDate = todaysDate.getDate(todaysDate);

				if(endDate != '' && endDate != null){

					completeEndDate = endDate;
					endDate = nlapiStringToDate(endDate);
//					endYear = endDate.getFullYear(endDate);
//					endMonth = endDate.getMonth() + Number(1);
//					endDate = endDate.getDate(endDate);
//					alert('End Month '+endDate);// && endMonth <= startMonth && endYear <= startYear
					if(endDate < startDate) {

						alert('End date should be on or after the start date');
						nlapiSetFieldValue('custrecord_stlms_la_enddate', '');
						return true;
					}
				}
			}
		}
	}
}

var arrayValues = {};
var escalationDay;
var escalationDate;
function saveRecord_confirmValidate() {
	
	/*
	 *match Gender of employee with leave type and check if he is applicable ot that leave
	 * 
	 * */
	 var employeeId = nlapiGetFieldValue('custrecord_stlms_la_employeename');
	 var gender = nlapiLookupField('employee',employeeId,'custentity_stlms_employee_gender');  // 10 units
	 var leaveType = nlapiGetFieldValue('custrecord_stlms_la_leavetype');
	 if(leaveType){
		 var leaveTypeField = nlapiLookupField('customrecord_stlms_leavetypes',leaveType,['custrecord_stlms_leavetype_applicableto','custrecord_stlms_leavetype_maximumdays','custrecord_stlms_leavetype_markholiday','custrecord_stlms_approvalmat_nopreferenc']);  // 10 units
		 
	 }else{
		 alert('Please Select Leave Type');
		 return;
	 }
	
	 var eligibleGender = leaveTypeField.custrecord_stlms_leavetype_applicableto;
	 var maxLeaveAllowed = leaveTypeField.custrecord_stlms_leavetype_maximumdays;
	 var markHoliday = leaveTypeField.custrecord_stlms_approvalmat_nopreferenc;
	// alert('Mark Holiday-->'+markHoliday);
	 if(eligibleGender && gender != eligibleGender){
		 
		 alert('Selected leave type is not applicable to your gender');
		 nlapiSetFieldValue('custrecord_stlms_la_leavetype','');
		 return false;
	 }
	 
	 
	 
	 


		 
	 
	 

//	if(startDate == '' && startDate == null && endDate == '' && endDate == null) {

	startDate = nlapiGetFieldValue('custrecord_stlms_la_startdate');
	endDate = nlapiGetFieldValue('custrecord_stlms_la_enddate');
	if(!endDate){
		
		alert('Please Enter End Date');
		return false;
		
	}

	emp = nlapiGetFieldValue('custrecord_stlms_la_employeename');
	leaveType = nlapiGetFieldValue('custrecord_stlms_la_deductfrom');

	completeStartDate = startDate;
	startDate = nlapiStringToDate(startDate);
	startYear = startDate.getFullYear(startDate);
	getDay = startDate.getDay();
	startMonth = startDate.getMonth() + Number(1);
	startDate = startDate.getDate(startDate);

	var todaysDate = new Date();
	todayYear = todaysDate.getFullYear(todaysDate);
	todayMonth = todaysDate.getMonth() + Number(1);
	todaysDate = todaysDate.getDate(todaysDate);

	completeEndDate = endDate;
	
	endDate = nlapiStringToDate(endDate);
	endYear = endDate.getFullYear(endDate);
	endMonth = endDate.getMonth() + Number(1);
	endDate = endDate.getDate(endDate);

//	}


	if(startDate != '' && startDate != null && endDate != '' && endDate != null) {

		if(endMonth != startMonth) {

			//Leave Period for the selected date range without considering the work-calendar.
			leavePeriod = monthDiff(completeStartDate, completeEndDate);
//			alert('Inside month not equal '+leavePeriod);
			leavePeriod = Number(leavePeriod) + Number(1);
//			alert('Inside month not equal '+leavePeriod);
		}
		else if(endMonth == startMonth){

			//Leave Period for the selected date range without considering the work-calendar.
			leavePeriod = monthDiff(completeStartDate, completeEndDate);
//			alert('Inside month equal '+leavePeriod);
			leavePeriod = Number(leavePeriod) + Number(1);
//			alert('Inside month equal '+leavePeriod);
		}
		//To get emp type and work-calendar selected on emp.
		var empType = nlapiLookupField('employee', emp, 'employeetype');
//		var workCalendar = lookup.workcalendar;
//		var empType = lookup.employeetype;

//		//Search Setup to get values required to calculate leave period.
//		var filter = new Array();
//		filter.push(new nlobjSearchFilter('isinactive', null, 'is', 'F'));
//		filter.push(new nlobjSearchFilter('custrecord_stlms_su_employeetype', null, 'is', empType));
//
//		var column = new Array();
//		column.push(new nlobjSearchColumn('custrecord_stlms_su_publicholidayasleave'));
//		column.push(new nlobjSearchColumn('custrecord_stlms_su_weeklyoffasleave'));
//		column.push(new nlobjSearchColumn('custrecord_stlms_su_daysforescalation'));
//
//		var search = nlapiSearchRecord('customrecord_stlms_setups', null, filter, column);
//
//		if(search) {
//
//			var publicHolidays = search[0].getValue('custrecord_stlms_su_publicholidayasleave');
//			var weekOffHolidays = search[0].getValue('custrecord_stlms_su_weeklyoffasleave');

			var todaysDate = new Date();
			todaysDate = nlapiDateToString(todaysDate);
			if(maxLeaveAllowed && leavePeriod > maxLeaveAllowed )
			 {
				 alert('Maximum Allowed Leaves is '+maxLeaveAllowed+' for the selected leave type');
				 nlapiSetFieldValue('custrecord_stlms_la_enddate','');
				 return false;
			 
			 }

//			escalationDay = search[0].getValue('custrecord_stlms_su_daysforescalation');

			//Suitelet call with required parameters to calculate leave period of the selected date range
			var URL = nlapiResolveURL('SUITELET', 'customscript_stlms_leaveapplicationretur', 'customdeploy_stlms_leaveapplicationretur', true);
			if(markHoliday == "F"){

				var searchResult = nlapiRequestURL(URL,{action:'calculateLeavePeriod',empType:empType, leavePeriod:leavePeriod, startYear:startYear, startMonth:startMonth, startDate:startDate, getDay:getDay});

			}else{
					
					// alert(leavePeriod);
					var searchResult = nlapiRequestURL(URL,{action:'ignoreHolidayCalLeavePeriod',empType:empType, leavePeriod:leavePeriod, startYear:startYear, startMonth:startMonth, startDate:startDate, getDay:getDay});


			}
			
			//, weekOffHolidays:weekOffHolidays, publicHolidays:publicHolidays

			//Calculated leave period.
			var a = JSON.parse(searchResult.getBody());
			leavePeriod = a.calculatedLeave;
		//	alert('Calculated Leave-->'+leavePeriod);
			escalationDay = a.escalationDay;
//			alert('escalationDay '+escalationDay);
			//Add the days of escalation to the current date and set on leave application record
			escalationDate = nlapiAddDays(nlapiStringToDate(todaysDate), escalationDay);
			escalationDate = nlapiDateToString(escalationDate);

//		}
	}

	nlapiSetFieldValue('custrecord_stlms_la_dateofescalation', escalationDate);
	nlapiSetFieldValue('custrecord_stlms_la_leaveperiod', leavePeriod);

	var leaveBlncToConsider = nlapiGetFieldValue('custrecord_stlms_la_leavebalance');
	var carryForwardToConsider = nlapiGetFieldValue('custrecord_stlms_la_carriedforwardbalanc');
	totalLeaves = Number(leaveBlncToConsider) + Number(carryForwardToConsider);
//	alert('Total Leaves-->'+totalLeaves);
//	alert('after totalLeaves '+totalLeaves);

	//If the leave balance is less than the leave period.
	if(totalLeaves < leavePeriod) {

		var res = confirm('Leave balance is less than the leave period, Do you want to continue?');

		if(res == false) {

			nlapiSetFieldValue('custrecord_stlms_la_leaveperiod', '');
			nlapiSetFieldValue('custrecord_stlms_la_enddate', '');

		}
	}
	return true;
}

function monthDiff(d1, d2)
{
	var months = '';

	if(d1)
	{
		d1 = d1.split('/');
		d1 = new Date(d1[2],d1[1]-1,d1[0]);
	}
	if(d2)
	{
		d2 = d2.split('/');
		d2 = new Date(d2[2],d2[1]-1,d2[0]);
	}

	var one_day = 1000*60*60*24;
	var date1 = d1;//new Date('4/19/2016');//mm/dd/yyyy
	var date2 = d2;//new Date('2/28/2017');//mm/dd/yyyy

	var date1_ms = date1.getTime();
	var date2_ms = date2.getTime();

	var difference_ms = date2_ms - date1_ms;

	var results = Math.round(difference_ms/one_day);

	return results;
} 