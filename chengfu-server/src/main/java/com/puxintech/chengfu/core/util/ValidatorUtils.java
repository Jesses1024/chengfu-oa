package com.puxintech.chengfu.core.util;

import java.util.Collection;

import org.springframework.lang.Nullable;
import org.springframework.util.StringUtils;

import com.puxintech.chengfu.core.exception.ValidateException;
import com.puxintech.chengfu.core.model.Persistable;

/**
 * 验证工具类
 * 
 * @author yanhai
 *
 */
public abstract class ValidatorUtils {

	public static void assertFalse(boolean bool, String msg) throws ValidateException {
		assertTrue(!bool, msg);
	}

	public static void assertTrue(boolean bool, String msg) throws ValidateException {
		if (!bool) {
			throwException(msg);
		}
	}

	public static <T> void max(Comparable<T> max, @Nullable T num, String msg) throws ValidateException {
		if (max.compareTo(num) < 0) {
			throwException(msg);
		}
	}

	public static <T> void min(Comparable<T> min, @Nullable T num, String msg) throws ValidateException {
		if (num == null) {
			return;
		}

		if (min.compareTo(num) > 0) {
			throwException(msg);
		}
	}

	public static void requireNonNull(@Nullable Object obj, String msg) throws ValidateException {
		if (obj == null) {
			throwException(msg);
		} else if (obj instanceof Collection && ((Collection<?>) obj).isEmpty()) {
			throwException(msg);
		} else if (obj instanceof String && !StringUtils.hasText(((String) obj))) {
			throwException(msg);
		} else if (obj instanceof Persistable<?>) {
			requireNonNull(((Persistable<?>) obj).getId(), msg);
		}
	}

	private static void throwException(String msg) throws ValidateException {
		throw new ValidateException(msg);
	}
}
