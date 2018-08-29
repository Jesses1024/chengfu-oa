package com.puxintech.chengfu.core.model;

import java.io.Serializable;

import javax.persistence.Transient;

import org.springframework.lang.Nullable;

/**
 * @author yanhai
 *
 * @param <ID>
 */
public interface Persistable<ID extends Serializable> {

	@Nullable
	ID getId();

	void setId(@Nullable ID id);

	@Transient
	default boolean isNew() {
		return this.getId() == null;
	};
}
