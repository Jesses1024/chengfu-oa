package com.puxintech.chengfu.company.attendance;

/**考勤审批状态*/
public enum AttendanceAuditStatus {
	/**预览*/
	preview,
	/**待审批*/
	preAudit,
	/**已通过*/
	aduited,
	/**已驳回*/
	rejected,
}
