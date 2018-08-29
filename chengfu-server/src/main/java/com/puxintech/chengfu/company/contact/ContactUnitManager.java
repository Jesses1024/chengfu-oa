package com.puxintech.chengfu.company.contact;

import java.util.List;

import org.springframework.data.repository.Repository;

import com.puxintech.chengfu.core.resource.QueryableResourceManager;

public interface ContactUnitManager extends Repository<ContactUnitEnity, Integer>, QueryableResourceManager<ContactUnitEnity, Integer>{
	List<ContactUnitEnity> findByType(ContractUnitType type);
}
