package com.puxintech.chengfu.core.resource.params.filter;

import java.util.List;
import java.util.Objects;
import java.util.Set;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Expression;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;

import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

public class FilterSpecification<T> implements Specification<T> {

	private static final long serialVersionUID = 1L;

	private final String filter;
	private final FilterMode mode;
	private final String filterProperties;

	public FilterSpecification(String filter, FilterMode mode, String filterProperties) {
		this.filter = filter;
		this.mode = Objects.requireNonNull(mode);
		this.filterProperties = Objects.requireNonNull(filterProperties);
	}

	@Override
	public Predicate toPredicate(Root<T> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
		String filterPattern = this.filterPattern();

		if (filterPattern == null) {
			return null;
		}

		Predicate result = cb.disjunction();
		if (StringUtils.hasText(filterProperties)) {
			List<Expression<Boolean>> expressions = result.getExpressions();
			Set<String> ps = StringUtils.commaDelimitedListToSet(filterProperties);
			for (String p : ps) {
				expressions.add(cb.like(root.get(p), filterPattern));
			}
		}
		return result;
	}

	private String filterPattern() {
		if (!StringUtils.hasText(filter)) {
			return null;
		}
		final String result;
		switch (mode) {
		case StartsWith:
			result = "%" + filter;
			break;
		case EndsWith:
			result = filter + "%";
			break;
		case Contains:
			result = "%" + filter + "%";
			break;
		default:
			result = null;
			break;
		}
		return result;
	}

}
