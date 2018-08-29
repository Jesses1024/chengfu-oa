package com.puxintech.chengfu.company.employee;

/**
 * 员工状态
 * 
 * @author yanhai
 *
 */
public enum EmployeeStatus {

	pending, // 待审批
	accept, // 已通过（已录用）
	reject, // 已驳回
	leaved,//已离职
}
