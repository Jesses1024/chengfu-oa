package com.puxintech.chengfu.project.model;

import java.util.Date;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Lob;
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
 * 特殊需求
 */
@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name="need_record")
public class NeedRecordEntity extends AuditableEntity{

	@ManyToOne(fetch=FetchType.LAZY)
	@JsonBackReference
	private ProjectEntity project;
    
    private Date applyDate;//申请时间

    private String applyReason;//申请原因
    
    @Lob
    private String applyDetail;//详细说明
    
    private AuditStatus auditStatus;//审核状态
    
    private String rejectDescription;//特殊需求 驳回描述

}
