package com.puxintech.chengfu.company.reimburse;

import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Convert;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.puxintech.chengfu.core.jpa.support.SetPaidTypeConverter;
import com.puxintech.chengfu.core.model.AuditableEntity;
import com.puxintech.chengfu.core.model.DisplayName;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * 报销申请
 *
 */
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "reimburse")
public class ReimburseEntity extends AuditableEntity implements DisplayName {

	private String receiveName;// 付与姓名

	private String bankName;// 银行名

	private String applyName;// 申请报销人姓名

	private String bankNumber;// 银行账号

	@OneToMany(fetch = FetchType.LAZY, mappedBy = "reimburse", cascade =CascadeType.ALL)
	@JsonManagedReference
	private Set<ReimburseItemEntity> items;// 报销明细

	private String description;// 摘要说明

	@Convert(converter = SetPaidTypeConverter.class)
	private Set<PaidType> paidType;// 付款用途

	private ReimburseAuditStatus auditStatus;// 审核状态

	private String rejectDescription;// 驳回原因

	@Override
	public String getDisplayName() {
		return receiveName;
	}

}
