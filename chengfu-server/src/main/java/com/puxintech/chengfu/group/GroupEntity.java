package com.puxintech.chengfu.group;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.puxintech.chengfu.core.model.AuditableEntity;
import com.puxintech.chengfu.core.model.DisplayName;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Entity
@Getter
@Setter
@ToString
@Table(name = "groups")
public class GroupEntity extends AuditableEntity implements DisplayName {

	@Column(nullable = false)
	private String name;

	@ManyToOne(fetch = FetchType.LAZY)
	private GroupEntity parent;

	@Column(nullable = false, updatable = false)
	private boolean enabled = true;

	private String description;

	public GroupEntity() {
	}

	public GroupEntity(String name) {
		this.name = name;
	}

	@Override
	public String getDisplayName() {
		return this.name;
	}
}
