package com.puxintech.chengfu.company.reimburse;

import org.springframework.data.repository.Repository;

import com.puxintech.chengfu.core.resource.QueryableResourceManager;

public interface ReimburseItemManager extends Repository<ReimburseItemEntity, Integer>, QueryableResourceManager<ReimburseItemEntity, Integer>{

}
