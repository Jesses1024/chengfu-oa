package com.puxintech.chengfu.core.resource;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.lang.Nullable;

/**
 * @author yanhai
 *
 * @param <T>
 */
public interface Queryable<T> {

	List<T> findAll();

	List<T> findAll(@Nullable Specification<T> spec);

	Page<T> findAll(@Nullable Specification<T> spec, Pageable pageable);

	List<T> findAll(@Nullable Specification<T> spec, Sort sort);

	long count(@Nullable Specification<T> spec);
}
