package com.puxintech.chengfu.company.employee;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.puxintech.chengfu.core.model.AutoIncrementEntity;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * 工作经验
 * 
 * @author yanhai
 *
 */
@Entity
@Getter
@Setter
@ToString
@Table(name = "employee_work_experience")
public class WorkExperienceEntity extends AutoIncrementEntity {

	@JsonBackReference
	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	private EmployeeEntity employee;

	@Column
	private Date startDate;

	@Column
	private Date endDate;

	@Column
	private String workUnit;// 工作单位

	@Column
	private String description;// 职务及职责

}
