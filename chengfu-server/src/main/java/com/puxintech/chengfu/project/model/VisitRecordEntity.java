package com.puxintech.chengfu.project.model;

import java.util.Date;
import java.util.Set;

import javax.persistence.Convert;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Lob;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.puxintech.chengfu.core.jpa.support.SetStringConverter;
import com.puxintech.chengfu.core.model.AuditableEntity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

/**
 * 拜访记录
 */
@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "visit_records")
public class VisitRecordEntity extends AuditableEntity{

	@ManyToOne(fetch=FetchType.LAZY)
	@JsonBackReference
	private ProjectEntity project;
    
    private Date startDate;//拜访开始时间

    private Date endDate;//拜访结束时间
    
	@Convert(converter = SetStringConverter.class)
    private Set<String> followUser;//随行员工

	@Lob
    private String visitDetail;//拜访详情
    
	@Convert(converter = SetStringConverter.class)
    private Set<String> attachment;//附件

}
