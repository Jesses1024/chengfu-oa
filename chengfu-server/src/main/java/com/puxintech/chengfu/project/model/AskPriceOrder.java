package com.puxintech.chengfu.project.model;

import java.math.BigDecimal;
import java.util.Date;

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

/**
 * 询价单
 */
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "ask_price")
public class AskPriceOrder extends AuditableEntity{

	@ManyToOne(fetch=FetchType.LAZY)
	@JsonBackReference
	private ProjectEntity project;

    private Date askDate;//询价时间

    private String supplier;//供应商

    private String goodsName;//货物名

    private String modelNumber;//型号规格

    private String goodsUnit;//单位

    private Integer number;//数量

    private BigDecimal price;//价格
    
    private String description;//备注
}
