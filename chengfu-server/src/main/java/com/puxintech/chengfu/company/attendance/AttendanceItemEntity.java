package com.puxintech.chengfu.company.attendance;

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
 * 考勤管理明细
 */
@Entity
@Getter
@Setter
@ToString
@Table(name = "attendance_item")
public class AttendanceItemEntity extends AuditableEntity implements DisplayName{
	
	@ManyToOne(fetch=FetchType.LAZY)
	@JsonBackReference
	private AttendanceEntity attendance;
		
	/**员工姓名*/
	private String name;
	
	/**员工工号*/
	private String jobNumber;
	
	/**所属部门*/
	private String deptName;
	
	/**标准工作时数*/
	private String normalWorkHours;
	
	/**实际工作时数*/
	private String actualWorkHours;
	
	/**迟到次数*/
	private Integer lateTimes;
	
	/**迟到时长*/
	private String lateHours;
	
	/**早退次数*/
	private Integer earlyTimes;
	
	/**早退时长*/
	private String earlyHours;
	
	/**正常加班时长*/
	private String normalOverHours;
	
	/**特殊加班时长*/
	private String especialOverHours;
	
	/**标准出勤天数*/
	private String normalOnDutyDays;
	
	/**实际实际天数*/
	private String actualOnDutyDays;
	
	/**出差天数*/
	private String travelDays;
	
	/**旷工天数*/
	private String absenteeismDays;
	
	/**请假天数*/
	private String leaveDays;
	
	@Override
	public String getDisplayName() {
		return this.name;
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = super.hashCode();
		result = prime * result + ((name == null) ? 0 : name.hashCode());
		return result;
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (!super.equals(obj))
			return false;
		if (getClass() != obj.getClass())
			return false;
		AttendanceItemEntity other = (AttendanceItemEntity) obj;
		if (name == null) {
			if (other.name != null)
				return false;
		} else if (!name.equals(other.name))
			return false;
		return true;
	}
	
}
