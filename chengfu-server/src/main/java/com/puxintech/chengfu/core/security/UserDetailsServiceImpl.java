package com.puxintech.chengfu.core.security;

import java.util.ArrayList;
import java.util.Collection;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.puxintech.chengfu.group.GroupEntity;
import com.puxintech.chengfu.group.GroupManager;
import com.puxintech.chengfu.role.RoleEntity;
import com.puxintech.chengfu.user.UserEntity;
import com.puxintech.chengfu.user.UserManager;

/**
 * @author yanhai
 *
 */
@Service
public class UserDetailsServiceImpl implements UserDetailsService {

	private static final String MANAGER_AUTHORITY = "manager";

	private static final String USER_AUTHORITY = "user";

	@Autowired
	private UserManager userManager;

	@Autowired
	private GroupManager groupManager;

	@Override
	@Transactional(readOnly = true)
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		Optional<UserEntity> user = userManager.findByUserName(username);

		return user
				.map(this::entityMapper)
				.orElseThrow(() -> new UsernameNotFoundException(username));
	}

	private UserDetails entityMapper(UserEntity u) {
		Integer userId = u.getId();
		String userName = u.getUserName();
		String password = u.getPassword();
		int dataAuthority = u.getDataAuthority();
		Integer groupId = u.getGroupId();
		Set<Integer> subGroupIds = getSubGroupIds(u.getGroup());
		Collection<? extends GrantedAuthority> authorities = u.isManager()
				? getManagerAuthorities()
				: getUserAuthorities();
		boolean enabled = u.isEnabled();

		Collection<? extends GrantedAuthority> userAuthorities = mergeRoleAuthorities(authorities, u.getRole());

		return new AuthUser(userId, userName, password, dataAuthority, groupId, subGroupIds, enabled, userAuthorities);
	}

	private Set<Integer> getSubGroupIds(GroupEntity group) {
		Set<Integer> result = new HashSet<>();

		if (group == null || group.getId() == null) {
			return result;
		}

		List<GroupEntity> groups = groupManager.findByParentId(group.getId());

		return groups.stream()
				.map(GroupEntity::getId)
				.collect(Collectors.toSet());
	}

	private Collection<? extends GrantedAuthority> getManagerAuthorities() {
		return AuthorityUtils.createAuthorityList(MANAGER_AUTHORITY);
	}

	private Collection<? extends GrantedAuthority> getUserAuthorities() {
		return AuthorityUtils.createAuthorityList(USER_AUTHORITY);
	}

	private Collection<? extends GrantedAuthority> mergeRoleAuthorities(
			Collection<? extends GrantedAuthority> authorities,
			RoleEntity role) {
		if (role == null || role.getPerms() == null || role.getPerms().isEmpty()) {
			return authorities;
		}

		List<GrantedAuthority> result = new ArrayList<>(authorities);

		role.getPerms().stream()
				.map(SimpleGrantedAuthority::new)
				.forEach(result::add);

		return result;
	}
}
