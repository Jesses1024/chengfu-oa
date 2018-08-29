package com.puxintech.chengfu.company.employee;

import org.springframework.data.repository.Repository;

import com.puxintech.chengfu.core.resource.QueryableResourceManager;

public interface WorkExperienceEntityManager extends Repository<WorkExperienceEntity, Integer>, QueryableResourceManager<WorkExperienceEntity, Integer> {
}
