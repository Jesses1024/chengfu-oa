package com.puxintech.chengfu.company.employee;

import org.hibernate.Hibernate;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.puxintech.chengfu.core.web.QueryParamsController;

@RestController
@RequestMapping("/employees")
public class EmployeeController extends QueryParamsController<EmployeeQueryParams, EmployeeEntity, Integer> {
	
	public EmployeeController(EmployeeManager em) {
		super(em);
	}

	@Override
	protected EmployeeEntity entityMapper(EmployeeEntity entity) {
		Hibernate.initialize(entity.getWorkExperienceList());
		return super.entityMapper(entity);
	}
	
}
