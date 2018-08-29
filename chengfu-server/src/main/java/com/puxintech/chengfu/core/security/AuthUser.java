package com.puxintech.chengfu.core.security;

import java.util.Collection;
import java.util.Collections;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.User;

import lombok.Getter;

/**
 * @author yanhai
 *
 */
public class AuthUser extends User {

	private static final long serialVersionUID = 1L;

	@Getter
	private final Integer userId;

	@Getter
	private final Integer currentGroupId;

	@Getter
	private final Set<Integer> subGroupIds;

	@Getter
	private final Set<Integer> allGroupIds;

	@Getter
	private final int dataAuthority;

	public AuthUser(Integer userId, String username, String password, int dataAuthority,
			Integer currentGroupId, Set<Integer> subGroupIds, boolean enabled,
			Collection<? extends GrantedAuthority> authorities) {
		super(username, password, enabled, true, true, true, authorities);
		this.userId = Objects.requireNonNull(userId);
		this.currentGroupId = Objects.requireNonNull(currentGroupId);
		this.subGroupIds = subGroupIds == null ? Collections.emptySet() : subGroupIds;
		this.allGroupIds = Collections.unmodifiableSet(concatSet(this.subGroupIds, this.currentGroupId));
		this.dataAuthority = dataAuthority;
	}

	private Set<Integer> concatSet(Set<Integer> set, Integer value) {
		Set<Integer> all = new HashSet<>(set);
		all.add(value);
		return all;
	}

}
