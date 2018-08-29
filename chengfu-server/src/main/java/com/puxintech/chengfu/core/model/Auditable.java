package com.puxintech.chengfu.core.model;

import org.springframework.lang.Nullable;

/**
 * @author yanhai
 *
 * @param <U>
 * @param <T>
 */
public interface Auditable<U, T> {

	@Nullable
	U getCreatedBy();

	@Nullable
	T getCreatedDate();

	@Nullable
	U getLastModifiedBy();

	@Nullable
	T getLastModifiedDate();

	void setCreatedBy(@Nullable U createdBy);

	void setCreatedDate(@Nullable T createdDate);

	void setLastModifiedBy(@Nullable U lastModifiedBy);

	void setLastModifiedDate(@Nullable T lastModifiedDate);
}
