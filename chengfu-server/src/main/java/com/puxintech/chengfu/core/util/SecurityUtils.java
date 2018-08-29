package com.puxintech.chengfu.core.util;

import org.springframework.lang.Nullable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import com.puxintech.chengfu.core.security.AuthUser;

/**
 * @author yanhai
 *
 */
public abstract class SecurityUtils {

	private SecurityUtils() {
	}

	public static boolean isDataAuthority(AuthUser authUser, int authority) {
		if (authUser != null) {
			return authUser.getDataAuthority() == authority;
		}

		return false;
	}

	public static boolean noDataAuthority(AuthUser authUser, int authority) {
		return !isDataAuthority(authUser, authority);
	}

	public static boolean noDataAuthority(int authority) {
		return !isDataAuthority(getAuthUser(), authority);
	}

	public static boolean isDataAuthority(int authority) {
		return isDataAuthority(getAuthUser(), authority);
	}

	public static @Nullable AuthUser getAuthUser() {
		Authentication a = SecurityContextHolder.getContext().getAuthentication();
		if (a == null || a.getPrincipal() == null) {
			return null;
		}

		if (a.getPrincipal() instanceof AuthUser) {

			return (AuthUser) a.getPrincipal();
		}

		return null;
	}

}
