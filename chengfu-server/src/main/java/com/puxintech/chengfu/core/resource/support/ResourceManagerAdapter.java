package com.puxintech.chengfu.core.resource.support;

import java.io.Serializable;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;

import com.puxintech.chengfu.core.jpa.ResourceManagerRepository;
import com.puxintech.chengfu.core.model.Persistable;
import com.puxintech.chengfu.core.resource.QueryableResourceManager;

/**
 * @author yanhai
 *
 * @param <T>
 * @param <ID>
 */
public abstract class ResourceManagerAdapter<T extends Persistable<ID>, ID extends Serializable>
		implements QueryableResourceManager<T, ID> {

	private final ResourceManagerRepository<T, ID> delegate;

	public ResourceManagerAdapter(ResourceManagerRepository<T, ID> delegate) {
		this.delegate = delegate;
	}

	@Override
	public <S extends T> S save(S entity) {
		return delegate.save(entity);
	}

	@Override
	public List<T> findAll() {
		return delegate.findAll();
	}

	@Override
	public List<T> findAll(Specification<T> spec) {
		return delegate.findAll(spec);
	}

	@Override
	public Optional<T> findById(ID id) {
		return delegate.findById(id);
	}

	@Override
	public List<T> findAllById(Iterable<ID> ids) {
		return delegate.findAllById(ids);
	}

	@Override
	public Page<T> findAll(Specification<T> spec, Pageable pageable) {
		return delegate.findAll(spec, pageable);
	}

	@Override
	public boolean existsById(ID id) {
		return delegate.existsById(id);
	}

	@Override
	public List<T> findAll(Specification<T> spec, Sort sort) {
		return delegate.findAll(spec, sort);
	}

	@Override
	public long count(Specification<T> spec) {
		return delegate.count(spec);
	}

	@Override
	public void deleteById(ID id) {
		delegate.deleteById(id);
	}

	@Override
	public void delete(T entity) {
		delegate.delete(entity);
	}

}
