package com.puxintech.chengfu.group;

import java.util.List;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Expression;
import javax.persistence.criteria.JoinType;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;

import org.springframework.util.StringUtils;

import com.puxintech.chengfu.core.resource.params.QueryParams;
import com.puxintech.chengfu.core.resource.params.filter.FilterMode;

import lombok.Data;

/**
 * @author yanhai
 *
 */
@Data
public class GroupQueryParams implements QueryParams<GroupEntity> {

	private static final long serialVersionUID = 1L;
	private String filter;
	private Boolean enabled;

	@Override
	public Predicate toPredicate(Root<GroupEntity> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
		Predicate conjunction = cb.conjunction();
		List<Expression<Boolean>> expressions = conjunction.getExpressions();

		if (StringUtils.hasText(this.filter)) {
			expressions.add(QueryParams.filter(root, query, cb, filter, FilterMode.Contains, "name,description"));
		}

		if (enabled != null) {
			expressions.add(cb.equal(root.get("enabled"), enabled));
		}

		root.fetch("parent", JoinType.LEFT);

		return conjunction;
	}

}
