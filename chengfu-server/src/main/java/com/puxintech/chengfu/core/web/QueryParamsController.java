package com.puxintech.chengfu.core.web;

import java.io.Serializable;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;

import com.puxintech.chengfu.core.model.Persistable;
import com.puxintech.chengfu.core.resource.QueryableResourceManager;
import com.puxintech.chengfu.core.resource.params.QueryParams;
import com.puxintech.chengfu.core.validation.Validator;

import lombok.Getter;
import lombok.extern.slf4j.Slf4j;

/**
 * 增删改查操作，附带查询功能
 * 
 * @author yanhai
 *
 * @param <Q>
 *            查询参数
 * @param <T>
 *            实体类
 * @param <ID>
 *            主键
 */
@Slf4j
@Getter
public abstract class QueryParamsController<Q extends QueryParams<T>, T extends Persistable<ID>, ID extends Serializable>
		extends CrudController<T, ID> {

	private final QueryableResourceManager<T, ID> rm;

	public QueryParamsController(QueryableResourceManager<T, ID> rm, Validator<T> validator) {
		super(rm, validator);
		this.rm = rm;
	}

	public QueryParamsController(QueryableResourceManager<T, ID> rm) {
		this(rm, Validator.noop());
	}

	@GetMapping("/query")
	@Transactional(readOnly = true)
	public Page<T> query(Q params, @PageableDefault(page = 0, size = 10) Pageable pageable) {
		if (pageable.getSort() == null || pageable.getSort().isUnsorted()) {
			pageable = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), this.defaultSort());
		}
		log.debug("query by params: {}", params);
		return rm.findAll(params, pageable);
	}

	protected Sort defaultSort() {
		return Sort.unsorted();
	}
}
