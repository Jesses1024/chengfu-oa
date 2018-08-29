package com.puxintech.chengfu.user;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.puxintech.chengfu.core.util.ValidatorUtils;

import lombok.Data;

@RestController
@RequestMapping("/currentUser")
public class CurrentUserController {

	@Autowired
	private UserManager userManager;

	@GetMapping
	public ResponseEntity<?> getCurrentUser() {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		if (authentication != null) {
			return new ResponseEntity<>(authentication.getPrincipal(), HttpStatus.OK);
		}
		return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
	}

	@Transactional
	@PutMapping("/password")
	public ResponseEntity<?> changePassword(@RequestBody ChangePassword change) {
		ValidatorUtils.requireNonNull(change.getPassword(), "原密码不能为空");
		ValidatorUtils.requireNonNull(change.getNewPassword(), "新密码不能为空");
		ValidatorUtils.assertTrue(change.getNewPassword().equals(change.getConfirmPassword()), "两次密码不一致");

		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		if (authentication != null) {
			String userName = authentication.getName();
			Optional<UserEntity> user = userManager.findByUserName(userName);

			return user.map(u -> {
				ValidatorUtils.assertTrue(userManager.checkPassword(change.getPassword(), u.getPassword()), "密码错误");

				userManager.changePassword(u.getId(), change.getNewPassword());

				return new ResponseEntity<>(HttpStatus.OK);
			}).orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
		}

		return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
	}

	@Data
	public static class ChangePassword {

		private String password;

		private String newPassword;

		private String confirmPassword;
	}
}
