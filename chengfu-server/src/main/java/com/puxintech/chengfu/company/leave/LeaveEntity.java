package com.puxintech.chengfu.company.leave;

import java.util.Date;

import javax.persistence.Embedded;
import javax.persistence.Entity;
import javax.persistence.Table;

import com.puxintech.chengfu.core.model.AuditableEntity;
import com.puxintech.chengfu.core.model.DisplayName;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * 人事离职
 */
@Entity
@Getter
@Setter
@ToString
@Table(name = "tb_leave")
public class LeaveEntity extends AuditableEntity implements DisplayName {
	
	private String name;//员工姓名
	
	private String deptName;//部门名
	
	private String leaveReason;//离职原因
	
	private Date leaveDate;//离职日期
	
	private String deptLeaderOpinion;//部门主管意见
	
	private LeaveAuditStatus leaveAuditStatus;//离职审批状态
	
	private String rejectDescription;//驳回备注
	
	private boolean isRejected;//是否已审批
	
	@Embedded
	private HrAduitItem hrItem=new HrAduitItem();//人事审批详情
	
	@Embedded
	private FinanceAduitItem financeItem=new FinanceAduitItem();//财务审批详情
	
	@Embedded
	private LeaderItem leaderItem=new LeaderItem();//领导审批详情
	
	@Override
	public String getDisplayName() {
		return this.name;
	}

}
