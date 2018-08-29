package com.puxintech.chengfu.project.manager;

import org.springframework.data.repository.Repository;

import com.puxintech.chengfu.core.resource.QueryableResourceManager;
import com.puxintech.chengfu.project.model.AskPriceOrder;

public interface AskPriceOrderManager
		extends Repository<AskPriceOrder, Integer>, QueryableResourceManager<AskPriceOrder, Integer> {

}
