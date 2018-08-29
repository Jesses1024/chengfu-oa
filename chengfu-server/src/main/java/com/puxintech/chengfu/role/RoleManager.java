package com.puxintech.chengfu.role;

import java.util.Optional;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.Repository;

import com.puxintech.chengfu.core.resource.QueryableResourceManager;

public interface RoleManager
		extends Repository<RoleEntity, Integer>, QueryableResourceManager<RoleEntity, Integer> {

	Optional<RoleEntity> findByName(String name);

	@Modifying
	@Query("update RoleEntity r set r.enabled = ?2 where r.id = ?1")
	void updateEnabled(Integer roleId, boolean enabled);

}
