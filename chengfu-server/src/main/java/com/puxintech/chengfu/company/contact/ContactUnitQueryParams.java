package com.puxintech.chengfu.company.contact;

import java.util.List;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Expression;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;

import org.springframework.util.StringUtils;

import com.puxintech.chengfu.core.resource.params.QueryParams;
import com.puxintech.chengfu.core.resource.params.filter.FilterMode;

import lombok.Data;

@Data
public class ContactUnitQueryParams implements QueryParams<ContactUnitEnity> {
	
	private static final long serialVersionUID = 1L;
	private String filter;
	private Boolean ifUsing;
	
	private ContractUnitType type;//往来单位类型
	
	@Override
	public Predicate toPredicate(Root<ContactUnitEnity> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
		Predicate conjunction = cb.conjunction();
		List<Expression<Boolean>> expressions = conjunction.getExpressions();
		
		if (StringUtils.hasText(this.filter)) {
			expressions.add(QueryParams.filter(root, query, cb, filter, FilterMode.Contains, "unitName"));
		}
		if (ifUsing!=null) {
			expressions.add(cb.equal(root.get("ifUsing"), ifUsing));
		}
		if (type!=null) {
			expressions.add(cb.equal(root.get("type"), type));
		}
		
		return conjunction;
	}

}
