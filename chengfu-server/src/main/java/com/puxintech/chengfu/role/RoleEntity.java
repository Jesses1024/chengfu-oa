package com.puxintech.chengfu.role;

import java.util.Set;

import javax.persistence.Column;
import javax.persistence.Convert;
import javax.persistence.Entity;
import javax.persistence.Table;

import com.puxintech.chengfu.core.jpa.support.SetStringConverter;
import com.puxintech.chengfu.core.model.AuditableEntity;
import com.puxintech.chengfu.core.model.DisplayName;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Entity
@Getter
@Setter
@ToString
@Table(name = "roles")
public class RoleEntity extends AuditableEntity implements DisplayName {

	@Column(nullable = false)
	private String name;

	@Convert(converter = SetStringConverter.class)
	@Column(length=2048)
	private Set<String> perms;

	@Column(nullable = false, updatable = false)
	private boolean enabled = true;

	private String description;

	public RoleEntity() {
	}

	public RoleEntity(String name) {
		this.name = name;
	}

	@Override
	public String getDisplayName() {
		return this.name;
	}

}
