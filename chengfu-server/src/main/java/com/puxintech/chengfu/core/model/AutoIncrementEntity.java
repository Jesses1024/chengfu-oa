package com.puxintech.chengfu.core.model;

import com.fasterxml.jackson.annotation.JsonAlias;
import org.springframework.data.util.ProxyUtils;
import org.springframework.lang.Nullable;

import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.MappedSuperclass;

/**
 * 自增主键实体类
 * 
 * @author yanhai
 *
 */
@MappedSuperclass
public abstract class AutoIncrementEntity implements Persistable<Integer> {

	@Id
	@JsonAlias({ "id", "key" })
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	protected @Nullable Integer id;

	public @Nullable Integer getId() {
		return this.id;
	}

	public void setId(@Nullable Integer id) {
		this.id = id;
	}

	public Integer getKey() {
		return this.getId();
	}

	@Override
	public boolean equals(Object obj) {
		if (null == obj) {
			return false;
		}

		if (this == obj) {
			return true;
		}

		if (!getClass().equals(ProxyUtils.getUserClass(obj))) {
			return false;
		}

		AutoIncrementEntity that = (AutoIncrementEntity) obj;

		return null == this.getId() ? false : this.getId().equals(that.getId());
	}

	@Override
	public int hashCode() {

		int hashCode = 17;

		hashCode += null == getId() ? 0 : getId().hashCode() * 31;

		return hashCode;
	}
}
