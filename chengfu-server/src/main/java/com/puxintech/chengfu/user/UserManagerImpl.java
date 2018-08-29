package com.puxintech.chengfu.user;

import java.util.Optional;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.puxintech.chengfu.core.resource.support.ResourceManagerAdapter;

@Service
public class UserManagerImpl extends ResourceManagerAdapter<UserEntity, Integer>
		implements UserManager {

	private final UserRepository repository;
	private final PasswordEncoder passwordEncoder;

	public UserManagerImpl(UserRepository repository, PasswordEncoder passwordEncoder) {
		super(repository);
		this.repository = repository;
		this.passwordEncoder = passwordEncoder;
	}

	@Override
	public Optional<UserEntity> findByUserName(String userName) {
		return this.repository.findByUserName(userName);
	}

	@Override
	@Transactional
	public <S extends UserEntity> S save(S entity) {
		if (entity.isNew()) {
			String rawPassword = entity.getPassword();
			entity.setPassword(passwordEncoder.encode(rawPassword));
		} else {
			if (entity.getPassword() != null) {
				this.changePassword(entity.getId(), entity.getPassword());
			}
		}

		return super.save(entity);
	}

	@Override
	public boolean checkPassword(String rawPassword, String encodedPassword) {
		return passwordEncoder.matches(rawPassword, encodedPassword);
	}

	@Override
	@Transactional
	public void changePassword(Integer userId, String newPassword) {
		String encodedPassword = passwordEncoder.encode(newPassword);
		this.repository.changePassword(userId, encodedPassword);
	}

	@Override
	@Transactional
	public void updateEnabled(Integer userId, boolean enabled) {
		this.repository.updateEnabled(userId, enabled);
	}

}
