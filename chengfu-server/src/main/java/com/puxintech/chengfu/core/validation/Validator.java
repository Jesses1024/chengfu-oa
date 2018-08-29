package com.puxintech.chengfu.core.validation;

import com.puxintech.chengfu.core.exception.ValidateException;

/**
 * 验证器
 * 
 * @author yanhai
 *
 * @param <T>
 */
public interface Validator<T> {

	T validate(T entity, Mode mode) throws ValidateException;

	static enum Mode {
		Create, Update
	}

	@SuppressWarnings("rawtypes")
	static final Validator NOOP_VALIDATOR = new NoopValidator<>();

	@SuppressWarnings("unchecked")
	static <T> Validator<T> noop() {
		return (Validator<T>) NOOP_VALIDATOR;
	}
}
