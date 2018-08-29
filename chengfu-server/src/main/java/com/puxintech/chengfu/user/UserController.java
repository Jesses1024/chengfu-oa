package com.puxintech.chengfu.user;

import org.hibernate.Hibernate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Order;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.puxintech.chengfu.core.web.QueryParamsController;

@RestController
@RequestMapping("/users")
public class UserController extends QueryParamsController<UserQueryParams, UserEntity, Integer> {

	private final UserManager rm;

	@Autowired
	public UserController(UserManager rm, UserValidator validator) {
		super(rm, validator);
		this.rm = rm;
	}

	@Transactional
	@PutMapping("/{userId}/toggle")
	public ResponseEntity<Object> toggle(@PathVariable Integer userId) {
		return this.rm.findById(userId)
				.map(entity -> {
					entity.setEnabled(!entity.isEnabled());
					this.rm.updateEnabled(userId, entity.isEnabled());
					return new ResponseEntity<>(HttpStatus.OK);
				}).orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
	}

	@Override
	protected UserEntity entityMapper(UserEntity entity) {
		Hibernate.initialize(entity.getGroup());
		Hibernate.initialize(entity.getRole());
		return super.entityMapper(entity);
	}

	@Override
	protected Sort defaultSort() {
		return Sort.by(Order.desc("createdDate"));
	}
}