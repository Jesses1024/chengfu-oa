package com.puxintech.chengfu.company.employee;

import java.util.Date;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.puxintech.chengfu.core.model.AuditableEntity;
import com.puxintech.chengfu.core.model.DisplayName;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Entity
@Getter
@Setter
@ToString
@Table(name = "employee")
public class EmployeeEntity extends AuditableEntity implements DisplayName {

	@Column
	private String name; // 员工姓名

	@Column
	private EmployeeGender gender; // 性别

	@Column
	@Temporal(TemporalType.DATE)
	private Date birthday; // 员工生日

	@Column
	private String birthplace; // 员工出生地

	@Column
	private String address; // 员工住址

	@Column
	private String phoneNumber; // 员工电话

	@Column
	private boolean isAcceptTravel; // 是否接受出差

	@Column
	private boolean isAcceptOvertime; // 是否接受加班

	@Column
	private boolean isAcceptJobTransfer; // 是否接受工作调动

	@Column
	private String education; // 学历

	@Column
	private String graduatedSchool; // 毕业学校

	@Column
	private String profession; // 专业
	
	@Column
	private String description;//备注

	@JsonManagedReference
	@OneToMany(cascade =CascadeType.ALL, fetch = FetchType.LAZY, mappedBy = "employee")
	private Set<WorkExperienceEntity> workExperienceList; // 工作经验

	private EmployeeStatus status; // 员工状态
	
	private boolean isDirectlyJoin;//是否是直接新增的员工
	
	private String jobNumber;//工号
	
	private String deptName;//部门名
	
	private String duties;//职务

	@Column
	private String rejectedDescription;//驳回备注

	@Override
	public String getDisplayName() {
		return this.name;
	}

}
