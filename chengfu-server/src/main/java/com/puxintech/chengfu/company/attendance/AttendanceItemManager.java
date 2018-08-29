package com.puxintech.chengfu.company.attendance;

import org.springframework.data.repository.Repository;

import com.puxintech.chengfu.core.resource.QueryableResourceManager;

public interface AttendanceItemManager extends Repository<AttendanceItemEntity, Integer>, QueryableResourceManager<AttendanceItemEntity, Integer>{

}
