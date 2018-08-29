package com.puxintech.chengfu.project.manager;

import org.springframework.data.repository.Repository;

import com.puxintech.chengfu.core.resource.QueryableResourceManager;
import com.puxintech.chengfu.project.model.PurchaseItemEntity;

public interface PurchaseItemManager
		extends Repository<PurchaseItemEntity, Integer>, QueryableResourceManager<PurchaseItemEntity, Integer> {
}
