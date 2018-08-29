package com.puxintech.chengfu.core.model;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.EntityListeners;
import javax.persistence.MappedSuperclass;

import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import org.springframework.lang.Nullable;

/**
 * @author yanhai
 *
 */
@MappedSuperclass
@EntityListeners(AuditingEntityListener.class)
public abstract class AuditableEntity extends AutoIncrementEntity implements Auditable<String, Date> {

	@Column(updatable = false)
	@CreatedBy
	private @Nullable String createdBy;

	@Column(updatable = false)
	@CreatedDate
	private @Nullable Date createdDate;

	@Column
	@LastModifiedBy
	private @Nullable String lastModifiedBy;

	@Column
	@LastModifiedDate
	private @Nullable Date lastModifiedDate;

	public @Nullable String getCreatedBy() {
		return this.createdBy;
	}

	public void setCreatedBy(@Nullable String createdBy) {
		this.createdBy = createdBy;
	}

	public @Nullable String getLastModifiedBy() {
		return this.lastModifiedBy;
	}

	public void setCreatedDate(@Nullable Date createdDate) {
		this.createdDate = createdDate;
	}

	public @Nullable Date getCreatedDate() {
		return this.createdDate;
	}

	public void setLastModifiedBy(@Nullable String lastModifiedBy) {
		this.lastModifiedBy = lastModifiedBy;
	}

	public @Nullable Date getLastModifiedDate() {
		return this.lastModifiedDate;
	}

	public void setLastModifiedDate(@Nullable Date lastModifiedDate) {
		this.lastModifiedDate = lastModifiedDate;
	}

}
