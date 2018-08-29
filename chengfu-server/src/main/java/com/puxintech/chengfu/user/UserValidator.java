package com.puxintech.chengfu.user;

import org.springframework.stereotype.Component;

import com.puxintech.chengfu.core.exception.ValidateException;
import com.puxintech.chengfu.core.util.ValidatorUtils;
import com.puxintech.chengfu.core.validation.Validator;

@Component
public class UserValidator implements Validator<UserEntity> {

	@Override
	public UserEntity validate(UserEntity entity, Mode mode) throws ValidateException {
		ValidatorUtils.requireNonNull(entity.getDisplayName(), "姓名不能为空");
		ValidatorUtils.requireNonNull(entity.getGroup(), "部门不能为空"); // FIXME 部门 不明确

		if (mode == Mode.Create) {
			ValidatorUtils.requireNonNull(entity.getPassword(), "密码不能为空");
		}

		if (!entity.isManager()) {
			ValidatorUtils.requireNonNull(entity.getRole(), "角色不能为空");
		}
		return entity;
	}

}
