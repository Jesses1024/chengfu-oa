package com.puxintech.chengfu.company.leave;

import org.springframework.data.repository.Repository;

import com.puxintech.chengfu.core.resource.QueryableResourceManager;

public interface LeaveManager extends Repository<LeaveEntity, Integer>, QueryableResourceManager<LeaveEntity, Integer>{

}
