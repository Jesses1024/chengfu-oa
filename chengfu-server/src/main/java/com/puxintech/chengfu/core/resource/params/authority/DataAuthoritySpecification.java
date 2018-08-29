package com.puxintech.chengfu.core.resource.params.authority;

import java.util.Objects;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Path;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;

import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

import com.puxintech.chengfu.core.model.DataAuthority;
import com.puxintech.chengfu.core.security.AuthUser;

public class DataAuthoritySpecification<T> implements Specification<T> {

	private static final long serialVersionUID = 1L;

	private final AuthUser authUser;
	private final String authorityFieldName;

	public DataAuthoritySpecification(AuthUser authUser, String authorityFieldName) {
		this.authUser = Objects.requireNonNull(authUser);
		this.authorityFieldName = Objects.requireNonNull(authorityFieldName);
	}

	@Override
	public Predicate toPredicate(Root<T> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
		int aataAuthority = authUser.getDataAuthority();

		String[] fieldPath = StringUtils.delimitedListToStringArray(authorityFieldName, ".");

		Path<?> path = root.get(fieldPath[0]);

		for (int i = 1; i < fieldPath.length; i++) {
			path = path.get(fieldPath[i]);
		}

		switch (aataAuthority) {
		case DataAuthority.current:
			return cb.equal(path, authUser.getCurrentGroupId());
		case DataAuthority.current_and_sub_groups:
			return path.in(authUser.getAllGroupIds());
		default:
			return null;
		}
	}

}
