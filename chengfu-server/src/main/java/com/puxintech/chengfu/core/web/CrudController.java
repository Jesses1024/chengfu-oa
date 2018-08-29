package com.puxintech.chengfu.core.web;

import java.io.Serializable;
import java.util.Objects;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.puxintech.chengfu.core.model.Persistable;
import com.puxintech.chengfu.core.resource.ResourceManager;
import com.puxintech.chengfu.core.validation.Validator;
import com.puxintech.chengfu.core.validation.Validator.Mode;

import lombok.Getter;
import lombok.Setter;

/**
 * 增删改查操作
 * 
 * @author yanhai
 *
 * @param <T>
 *            实体类
 * @param <ID>
 *            主键
 */
@Getter
public abstract class CrudController<T extends Persistable<ID>, ID extends Serializable> {

	private final ResourceManager<T, ID> rm;

	private final Validator<T> validator;

	@Setter
	private boolean allowDelete = false;

	public CrudController(ResourceManager<T, ID> rm, Validator<T> validator) {
		this.rm = Objects.requireNonNull(rm, "ResourceManager must not be null");
		this.validator = validator == null ? Validator.noop() : validator;
	}

	public CrudController(ResourceManager<T, ID> rm) {
		this(rm, Validator.noop());
	}

	protected T entityMapper(T entity) {
		return entity;
	}

	@GetMapping("/{id}")
	@Transactional(readOnly = true)
	public ResponseEntity<T> findById(@PathVariable ID id) {
		return rm.findById(id)
				.map(this::entityMapper)
				.map(ResponseEntity::ok)
				.orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
	}

	@PostMapping
	@Transactional
	public ResponseEntity<Object> createOrSave(@RequestBody T body) {
		HttpStatus responseStatus = body.isNew() ? HttpStatus.CREATED : HttpStatus.OK;

		T valid = validator.validate(body, body.isNew() ? Mode.Create : Mode.Update);
		T responseBody = rm.save(valid);

		return new ResponseEntity<>(responseBody, responseStatus);
	}

	@PutMapping("/{id}")
	@Transactional
	public ResponseEntity<Object> update(@PathVariable ID id, @RequestBody T body) {
		final T responseBody;
		final HttpStatus responseStatus;
		if (rm.existsById(id)) {
			body.setId(id);
			T valid = validator.validate(body, Mode.Update);

			responseBody = rm.save(valid);
			responseStatus = HttpStatus.OK;
		} else {
			responseBody = null;
			responseStatus = HttpStatus.NOT_FOUND;
		}
		return new ResponseEntity<>(responseBody, responseStatus);
	}

	@DeleteMapping("/{id}")
	@Transactional
	public ResponseEntity<Object> deleteById(@PathVariable ID id) {
		final HttpStatus responseStatus;
		if (this.allowDelete) {
			responseStatus = HttpStatus.OK;
			rm.deleteById(id);
		} else {
			responseStatus = HttpStatus.METHOD_NOT_ALLOWED;
		}
		return new ResponseEntity<>(responseStatus);
	}

}
