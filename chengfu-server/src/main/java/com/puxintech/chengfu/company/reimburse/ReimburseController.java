package com.puxintech.chengfu.company.reimburse;

import org.hibernate.Hibernate;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.puxintech.chengfu.core.web.QueryParamsController;

@RestController
@RequestMapping("/reimburse")
public class ReimburseController extends QueryParamsController<ReimburseEntityQueryParams, ReimburseEntity, Integer>  {
	
	public ReimburseController(ReimburseManager rm) {
		super(rm);
	}

	@Override
	protected ReimburseEntity entityMapper(ReimburseEntity entity) {
		Hibernate.initialize(entity.getItems());
		return super.entityMapper(entity);
	}

}
