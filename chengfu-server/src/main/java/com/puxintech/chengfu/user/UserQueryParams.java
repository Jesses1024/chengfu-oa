package com.puxintech.chengfu.user;

import java.util.List;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Expression;
import javax.persistence.criteria.JoinType;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;

import org.springframework.util.StringUtils;

import com.puxintech.chengfu.core.model.DataAuthority;
import com.puxintech.chengfu.core.resource.params.QueryParams;
import com.puxintech.chengfu.core.resource.params.filter.FilterMode;
import com.puxintech.chengfu.core.util.SecurityUtils;

import lombok.Data;

/**
 * @author yanhai
 *
 */
@Data
public class UserQueryParams implements QueryParams<UserEntity> {

	private static final long serialVersionUID = 1L;
	private String filter;
	private Boolean enabled;

	@Override
	public Predicate toPredicate(Root<UserEntity> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
		Predicate conjunction = cb.conjunction();
		List<Expression<Boolean>> expressions = conjunction.getExpressions();

		if (SecurityUtils.noDataAuthority(DataAuthority.all)) {
			expressions.add(QueryParams.dataAuthority(root, query, cb, "group.id"));
		}

		if (StringUtils.hasText(filter)) {
			expressions.add(QueryParams.filter(root, query, cb, filter, FilterMode.Contains, "displayName,userName"));
		}

		if (enabled != null) {
			expressions.add(cb.equal(root.get("enabled"), enabled));
		}
		
		root.fetch("group", JoinType.LEFT);
		root.fetch("role", JoinType.LEFT);

		return conjunction;
	}

}
