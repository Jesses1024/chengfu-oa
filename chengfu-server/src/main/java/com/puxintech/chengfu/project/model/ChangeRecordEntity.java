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
 * 变更记录（历史购买项）
 */
@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "change_record")
public class ChangeRecordEntity extends AuditableEntity {

	@ManyToOne(fetch=FetchType.LAZY)
	@JsonBackReference
	private ProjectEntity project;

	private String goodsName;// 变更前货物名

	private String goodsUnit;// 变更前单位

	@Column(columnDefinition = "decimal(10,2) default 0")
	private BigDecimal weight;// 数量

	private Integer batch;// 第n次修改
}
