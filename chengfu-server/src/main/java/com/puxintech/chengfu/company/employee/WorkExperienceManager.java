package com.puxintech.chengfu.company.employee;

import org.springframework.data.repository.Repository;

import com.puxintech.chengfu.core.resource.QueryableResourceManager;

public interface WorkExperienceManager extends Repository<WorkExperienceEntity, Integer>, QueryableResourceManager<WorkExperienceEntity, Integer> {

}
