package com.puxintech.chengfu.group;

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
@RequestMapping("/groups")
public class GroupController extends QueryParamsController<GroupQueryParams, GroupEntity, Integer> {

	private final GroupManager rm;

	@Autowired
	public GroupController(GroupManager rm) {
		super(rm);
		this.rm = rm;
	}

	@Transactional
	@PutMapping("/{groupId}/toggle")
	public ResponseEntity<Object> toggle(@PathVariable Integer groupId) {
		return this.rm.findById(groupId)
				.map(entity -> {
					entity.setEnabled(!entity.isEnabled());
					this.rm.updateEnabled(groupId, entity.isEnabled());
					return new ResponseEntity<>(HttpStatus.OK);
				}).orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
	}

	@Override
	protected Sort defaultSort() {
		return Sort.by(Order.desc("createdDate"));
	}

	@Override
	protected GroupEntity entityMapper(GroupEntity entity) {
		Hibernate.initialize(entity.getParent());
		return entity;
	}
}
