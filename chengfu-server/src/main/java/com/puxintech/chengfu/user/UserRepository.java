package com.puxintech.chengfu.user;

import java.util.Optional;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import com.puxintech.chengfu.core.jpa.ResourceManagerRepository;

public interface UserRepository extends ResourceManagerRepository<UserEntity, Integer> {

	Optional<UserEntity> findByUserName(String userName);

	@Modifying(clearAutomatically = true)
	@Query("update UserEntity u set u.password = ?2 where u.id = ?1")
	void changePassword(Integer userId, String password);

	@Modifying(clearAutomatically = true)
	@Query("update UserEntity u set u.enabled = ?2 where u.id = ?1")
	void updateEnabled(Integer userId, boolean enabled);

}
