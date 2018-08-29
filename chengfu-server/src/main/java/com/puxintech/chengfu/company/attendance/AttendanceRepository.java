package com.puxintech.chengfu.company.attendance;

import java.util.Date;

import com.puxintech.chengfu.core.jpa.ResourceManagerRepository;

public interface AttendanceRepository extends ResourceManagerRepository<AttendanceEntity, Integer> {

	void deleteByAttendanceDateAndStatus(Date attendanceDate, AttendanceAuditStatus status);
}
