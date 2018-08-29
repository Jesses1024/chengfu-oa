package com.puxintech.chengfu.project.model;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;

import com.puxintech.chengfu.core.resource.params.QueryParams;

public class VisitRecordQueryParams implements QueryParams<VisitRecordEntity>{

	private static final long serialVersionUID = 1L;

	@Override
	public Predicate toPredicate(Root<VisitRecordEntity> root, CriteriaQuery<?> query,
			CriteriaBuilder criteriaBuilder) {
		// TODO Auto-generated method stub
		return null;
	}


}
