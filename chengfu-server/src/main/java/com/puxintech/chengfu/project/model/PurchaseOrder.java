package com.puxintech.chengfu.project.model;

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
 * 采购单
 * @author Administrator
 *
 */
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "purchase_order")
public class PurchaseOrder extends AuditableEntity {
	
	@ManyToOne(fetch=FetchType.LAZY)
	@JsonBackReference
	private ProjectEntity project;
	
	private String goodsName;//货物
	
    private String modelNumber;//型号规格
    
    private String goodsUnit;//单位
        
    private Integer number;//数量
    
    private String supplier;//供应商
    
    private String description;//备注

    private Date applyPurchaseDate;//请购日期 从询价单进采购单的时间
    
    private Date needDate;//需求日期
    
    private Date expectArriveDate;//预计到货时间
    
    private Date actualArriveDate;//实际到货时间
    
    private AuditStatus auditStatus;//审核状态

    private PurchaseStatus purchaseStatus;//采购单到货状态 
    
    private String purchaseRejectDescription;//采购单驳回描述
    
    private String purchaseInvaildDescription;//采购单作废备注
}
