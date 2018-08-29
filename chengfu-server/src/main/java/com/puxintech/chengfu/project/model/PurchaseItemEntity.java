package com.puxintech.chengfu.project.model;

import java.math.BigDecimal;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.puxintech.chengfu.core.model.AuditableEntity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

/**
 * 项目计划购买项
 *
 */
@Setter
@Getter
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name="purchase_items")
public class PurchaseItemEntity extends AuditableEntity{

	@ManyToOne(fetch=FetchType.LAZY)
	@JsonBackReference
	private ProjectEntity project;
	
	private String goodsName;//货物名
	
	private String goodsUnit;//单位

	private Integer number;//数量

    @Column(columnDefinition = "decimal(10,2) default 0")
    private BigDecimal onePrice;//报价-单价

    @Column(columnDefinition = "decimal(10,2) default 0")
    private BigDecimal subtotalPrice;//报价-小计

}
