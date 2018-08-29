package com.puxintech.chengfu.project.manager;

import org.springframework.data.repository.Repository;

import com.puxintech.chengfu.core.resource.QueryableResourceManager;
import com.puxintech.chengfu.project.model.PurchaseOrder;

public interface PurchaseOrderManager
		extends Repository<PurchaseOrder, Integer>, QueryableResourceManager<PurchaseOrder, Integer> {

}
