package com.puxintech.chengfu.project.model;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;

import com.puxintech.chengfu.core.resource.params.QueryParams;

import lombok.Data;

@Data
public class NeedRecordQueryParams implements QueryParams<NeedRecordEntity>{
	private static final long serialVersionUID = 1L;

    @Override
    public Predicate toPredicate(Root<NeedRecordEntity> root, CriteriaQuery<?> query, CriteriaBuilder criteriaBuilder) {
        return null;
    }
}
