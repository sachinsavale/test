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
* @date:    19 Apr 2016
* @version: Revised version
* 
* Description: This script is to show a popup. It will say that do you want 
* 			   to change leave accrual start date in employee record.
**************************************************************************/
var fieldChnageReturnVal = 'F';

function showPopup(type,name)
{
	/** On the change of Leave Accrual Start Date **/
	if(name=='custentity_stlms_resumeleaveaccrual')
	{
		var leaveAccrualStartDate = nlapiGetFieldValue('custentity_stlms_leaveaccrualstartdate');
		var isEligibleLeaveAccrual = nlapiGetFieldValue('custentity_stlms_eligibilityforleaveacc');
		var isLeaveAccrualNewJoinee = nlapiGetFieldValue('custentity_stlms_leaveaccrualnewjoinee');
		var isResumeLeaveAccrual = nlapiGetFieldValue('custentity_stlms_resumeleaveaccrual');
		
		if(isEligibleLeaveAccrual=='T' && isLeaveAccrualNewJoinee=='T' && isResumeLeaveAccrual=='T')
		{
			var popupMsg = 'The leave accrual start date is set to '+leaveAccrualStartDate+'. Do you want to proceed?';
			alert(popupMsg);
			fieldChnageReturnVal = 'T';
		}	
	}
}

function onSaveRecord()
{
	/*
	var isResumeLeaveAccrual = nlapiGetFieldValue('custentity_stlms_resumeleaveaccrual');
	if(isResumeLeaveAccrual=='T')
	{
		if(fieldChnageReturnVal==true)
			return true;
		else
		{
			alert('Kindly update leave accrual start date.');
			return false;
		}	
	}
	*/
	return true;
}