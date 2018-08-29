package com.puxintech.chengfu.core.resource.params;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;

import org.springframework.data.jpa.domain.Specification;

import com.puxintech.chengfu.core.resource.params.authority.DataAuthoritySpecification;
import com.puxintech.chengfu.core.resource.params.filter.FilterMode;
import com.puxintech.chengfu.core.resource.params.filter.FilterSpecification;
import com.puxintech.chengfu.core.security.AuthUser;
import com.puxintech.chengfu.core.util.SecurityUtils;

/**
 * 查询参数
 * 
 * @author yanhai
 *
 * @param <T>
 */
public interface QueryParams<T> extends Specification<T> {

	/**
	 * 文本过滤条件
	 * 
	 * @param filter
	 *            过滤条件文本
	 * @param filterMode
	 *            过滤模式
	 * @param filterProperties
	 *            过滤字段（多个使用英文逗号隔开)
	 * @return
	 */
	static <T> Predicate filter(Root<T> root, CriteriaQuery<?> query, CriteriaBuilder cb, String filter,
			FilterMode mode, String filterProperties) {
		return new FilterSpecification<T>(filter, mode, filterProperties).toPredicate(root, query, cb);
	}

	/**
	 * 数据权限过滤
	 * 
	 * @param authorityFieldName
	 */
	static <T> Predicate dataAuthority(Root<T> root, CriteriaQuery<?> query, CriteriaBuilder cb,
			String authorityFieldName) {
		return dataAuthority(root, query, cb, SecurityUtils.getAuthUser(), authorityFieldName);
	}

	/**
	 * 数据权限过滤
	 * 
	 * @param authUser
	 * @param authorityFieldName
	 */
	static <T> Predicate dataAuthority(Root<T> root, CriteriaQuery<?> query, CriteriaBuilder cb,
			AuthUser authUser, String authorityFieldName) {
		return new DataAuthoritySpecification<T>(authUser, authorityFieldName).toPredicate(root, query, cb);
	}
}
