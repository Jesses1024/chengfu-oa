package com.puxintech.chengfu.company.reimburse;

import java.math.BigDecimal;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.puxintech.chengfu.core.model.AuditableEntity;
import com.puxintech.chengfu.core.model.DisplayName;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * 报销明细
 * @author Administrator
 *
 */
@Entity
@Getter
@Setter
@ToString
@Table(name = "reimburse_item")
public class ReimburseItemEntity extends AuditableEntity implements DisplayName{
	
	private String contentName;//报销内容名称
	
	@ManyToOne(fetch=FetchType.LAZY)
	@JsonBackReference
	private ReimburseEntity reimburse;
	
	private ReimburseType reimburseType;//报销类型
	
	private Integer number;//报销数量
	
	private BigDecimal price;//报销金额
	
	private String description;//报销备注

	@Override
	public String getDisplayName() {
		return this.contentName;
	}
	
}
