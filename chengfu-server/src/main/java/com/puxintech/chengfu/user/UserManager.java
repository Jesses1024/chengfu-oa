package com.puxintech.chengfu.user;

import java.util.Optional;

import com.puxintech.chengfu.core.resource.QueryableResourceManager;

/**
 * @author yanhai
 *
 */
public interface UserManager extends QueryableResourceManager<UserEntity, Integer> {

	Optional<UserEntity> findByUserName(String userName);

	boolean checkPassword(String rawPassword, String encodedPassword);

	void changePassword(Integer userId, String newPassword);

	void updateEnabled(Integer userId, boolean enabled);
}
