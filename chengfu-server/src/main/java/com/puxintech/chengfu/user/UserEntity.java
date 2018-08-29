package com.puxintech.chengfu.user;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Index;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import org.springframework.lang.NonNull;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonProperty.Access;
import com.puxintech.chengfu.core.model.AuditableEntity;
import com.puxintech.chengfu.core.model.DataAuthority;
import com.puxintech.chengfu.core.model.DisplayName;
import com.puxintech.chengfu.group.GroupEntity;
import com.puxintech.chengfu.role.RoleEntity;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Entity
@Getter
@Setter
@ToString
@Table(name = "users", indexes = {
		@Index(name = "index_users_user_name", columnList = "user_name", unique = true)
})
public class UserEntity extends AuditableEntity implements DisplayName {

	@Column(nullable = false)
	private String displayName;

	@Column(name = "user_name", updatable = false, nullable = false)
	private String userName;

	@Column(updatable = false)
	@JsonProperty(access = Access.WRITE_ONLY)
	private String password;

	@Column(nullable = false, updatable = false)
	private boolean enabled = true;

	@Column(nullable = false)
	private boolean manager = false;

	@Column(nullable = false)
	private int dataAuthority = DataAuthority.current_and_sub_groups;

	@Column
	private String avatar;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	private GroupEntity group;

	@ManyToOne(fetch = FetchType.LAZY, optional = true)
	private RoleEntity role;

	private String description;

	public UserEntity() {
	}

	public UserEntity(@NonNull String userName, @NonNull String password) {
		this.userName = userName;
		this.password = password;
	}

	public Integer getGroupId() {
		if (this.group == null) {
			return null;
		}
		return this.group.getId();
	}
}
