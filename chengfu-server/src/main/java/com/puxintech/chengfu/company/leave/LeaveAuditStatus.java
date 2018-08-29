package com.puxintech.chengfu.company.leave;

/**离职审批状态*/
public enum LeaveAuditStatus {
	preReview,
	/**待审核*/
	preAudit,
	/**人事一审通过*/
	hrAudit,
	/**人事驳回*/
	hrReject,
	/**财务二审通过*/
	financeAudit,
	/**财务驳回*/
	financeReject,
	/**领导终审通过*/
	leaderAudit,
	/**领导驳回*/
	leaderReject,
}
