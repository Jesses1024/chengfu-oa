package com.puxintech.chengfu.company.reimburse;

/**报销审批流程*/
public enum ReimburseAuditStatus {
	/**待预览*/
	preReview,
	/**待审批*/
	preAudit,
	/**部门负责人审批通过*/
	deptLeaderAudit,
	/**部门负责人审批驳回*/
	deptLeaderReject,
	/**财务审批通过*/
	financeAudit,
	/**财务审批驳回*/
	financeReject,
	/**总经理审批通过*/
	leaderAudit,
	/**总经理审批驳回*/
	leaderReject,
	/**待付款*/
	prepaid,
	/**付讫*/
	paided,
	
}
