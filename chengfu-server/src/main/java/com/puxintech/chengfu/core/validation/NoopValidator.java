package com.puxintech.chengfu.core.validation;

public class NoopValidator<T> implements Validator<T> {

	@Override
	public T validate(T entity, Mode mode) {
		return entity;
	}

}
