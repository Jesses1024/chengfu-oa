package com.puxintech.chengfu.project.manager;

import org.springframework.data.repository.Repository;

import com.puxintech.chengfu.core.resource.QueryableResourceManager;
import com.puxintech.chengfu.project.model.VisitRecordEntity;

public interface VisitRecordManager
		extends Repository<VisitRecordEntity, Integer>, QueryableResourceManager<VisitRecordEntity, Integer> {
}
