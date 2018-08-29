package com.puxintech.chengfu.project.model;

import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Convert;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Lob;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import org.springframework.transaction.annotation.Transactional;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.puxintech.chengfu.core.jpa.support.SetProjectTypeConverter;
import com.puxintech.chengfu.core.jpa.support.SetStringConverter;
import com.puxintech.chengfu.core.model.AuditableEntity;
import com.puxintech.chengfu.core.model.DisplayName;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "projects")
@Transactional
public class ProjectEntity extends AuditableEntity implements DisplayName {

	private String area;// 所在地区

	private String companyName;// 公司名称

	private String industryType;// 行业类型

	private String linkmanName;// 联系人姓名

	private String linkmanJob;// 联系人职务

	private String linkemanContactWay;// 联系人联系方式

	@Convert(converter = SetProjectTypeConverter.class)
	private Set<ProjectType> type;// 项目类型

	private ProjectStatus status;// 项目状态

	@Lob
	private String description;// 项目说明

	private String startDate;// 项目计划启动日期

	private String invaildReason;// 终止原因

	private InvaildType invaildType;// 终止类型

	private AuditStatus contractAuditStatus;// 合同审批状态

	private String contractRejectDescription;// 合同驳回描述

	@OneToMany(fetch = FetchType.LAZY, mappedBy = "project", cascade = CascadeType.ALL)
	@JsonManagedReference
	private Set<PurchaseItemEntity> items;// 项目计划购买项

	@OneToMany(fetch = FetchType.LAZY, mappedBy = "project", cascade = CascadeType.ALL)
	@JsonManagedReference
	private Set<VisitRecordEntity> visitRecords;// 访问记录

	@OneToMany(fetch = FetchType.LAZY, mappedBy = "project", cascade = CascadeType.ALL)
	@JsonManagedReference
	private Set<ChangeRecordEntity> changeRecords;// 变更记录

	@OneToMany(fetch = FetchType.LAZY, mappedBy = "project", cascade = CascadeType.ALL)
	@JsonManagedReference
	private Set<NeedRecordEntity> needRecords;// 特殊需求

	@OneToMany(fetch = FetchType.LAZY, mappedBy = "project", cascade = CascadeType.ALL)
	@JsonManagedReference
	private Set<AskPriceOrder> askPriceOrders;// 询价单

	@OneToMany(fetch = FetchType.LAZY, mappedBy = "project", cascade = CascadeType.ALL)
	@JsonManagedReference
	private Set<PurchaseOrder> purchaseOrders;// 采购单

	private AuditStatus priceAuditStatus;// 报价单审核状态

	private String priceRejectDescription;// 报价驳回描述

	@Convert(converter = SetStringConverter.class)
	private Set<String> attachment;// 附件 含合同

	@Override
	public String getDisplayName() {
		return this.companyName;
	}

}
