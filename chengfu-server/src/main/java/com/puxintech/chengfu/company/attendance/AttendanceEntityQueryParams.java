package com.puxintech.chengfu.company.attendance;

import java.util.List;
import java.util.Set;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Expression;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;

import org.springframework.util.StringUtils;

import com.puxintech.chengfu.core.resource.params.QueryParams;
import com.puxintech.chengfu.core.resource.params.filter.FilterMode;

public class AttendanceEntityQueryParams implements QueryParams<AttendanceEntity>{
	
	private static final long serialVersionUID = 1L;
	private String filter;
	private Set<AttendanceAuditStatus> status;

	@Override
	public Predicate toPredicate(Root<AttendanceEntity> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
		Predicate conjunction = cb.conjunction();
		List<Expression<Boolean>> expressions = conjunction.getExpressions();

		if (StringUtils.hasText(this.filter)) {
			expressions.add(QueryParams.filter(root, query, cb, filter, FilterMode.Contains, "name"));
		}
		if (status!=null && status.size()!=0) {
			expressions.add(root.get("status").in(status));
		}
		query.orderBy(cb.desc(root.get("createdDate")));
		
		return conjunction;
	}

}
