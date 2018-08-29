package com.puxintech.chengfu.role;

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
@RequestMapping("/roles")
public class RoleController extends QueryParamsController<RoleQueryParams, RoleEntity, Integer> {

	private final RoleManager rm;

	@Autowired
	public RoleController(RoleManager rm) {
		super(rm);
		this.rm = rm;
	}

	@Transactional
	@PutMapping("/{roleId}/toggle")
	public ResponseEntity<Object> toggle(@PathVariable Integer roleId) {
		return this.rm.findById(roleId)
				.map(entity -> {
					entity.setEnabled(!entity.isEnabled());
					this.rm.updateEnabled(roleId, entity.isEnabled());
					return new ResponseEntity<>(HttpStatus.OK);
				}).orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
	}

	@Override
	protected Sort defaultSort() {
		return Sort.by(Order.desc("createdDate"));
	}
}
