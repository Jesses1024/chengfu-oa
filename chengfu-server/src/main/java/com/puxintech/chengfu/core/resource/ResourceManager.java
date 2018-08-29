package com.puxintech.chengfu.core.resource;

import java.io.Serializable;
import java.util.List;
import java.util.Optional;

import com.puxintech.chengfu.core.model.Persistable;

/**
 * @author yanhai
 *
 * @param <T>
 * @param <ID>
 */
public interface ResourceManager<T extends Persistable<ID>, ID extends Serializable> {

	Optional<T> findById(ID id);

	List<T> findAllById(Iterable<ID> ids);

	boolean existsById(ID id);

	<S extends T> S save(S entity);

	void deleteById(ID id);

	void delete(T entity);

}
