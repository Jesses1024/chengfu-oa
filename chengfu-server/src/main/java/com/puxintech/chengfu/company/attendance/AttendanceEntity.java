package com.puxintech.chengfu.company.attendance;

import java.util.Date;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.OneToMany;
import javax.persistence.OrderBy;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.puxintech.chengfu.core.model.AuditableEntity;
import com.puxintech.chengfu.core.model.DisplayName;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/***
 * 考勤管理
 *
 */
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "attendance")
public class AttendanceEntity extends AuditableEntity implements DisplayName {

	private String name;

	private Date attendanceDate;

	@OrderBy("jobNumber ASC")
	@OneToMany(fetch = FetchType.LAZY, mappedBy = "attendance", cascade = CascadeType.ALL)
	@JsonManagedReference
	private Set<AttendanceItemEntity> items;// 考勤明细

	/** 审批状态 */
	private AttendanceAuditStatus status;
	
	/** 是否已删除 */
	@Column(nullable = false)
	private boolean isRemoved = false;

	@Override
	public String getDisplayName() {
		return this.name;
	}

}
