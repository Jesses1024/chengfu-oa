package com.puxintech.chengfu.project.manager;

import org.springframework.data.repository.Repository;

import com.puxintech.chengfu.core.resource.QueryableResourceManager;
import com.puxintech.chengfu.project.model.NeedRecordEntity;

public interface NeedRecordManager
		extends Repository<NeedRecordEntity, Integer>, QueryableResourceManager<NeedRecordEntity, Integer> {
}
