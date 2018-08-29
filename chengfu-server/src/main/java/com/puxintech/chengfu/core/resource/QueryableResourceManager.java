package com.puxintech.chengfu.core.resource;

import java.io.Serializable;

import com.puxintech.chengfu.core.model.Persistable;

/**
 * @author yanhai
 *
 * @param <T>
 * @param <ID>
 */
public interface QueryableResourceManager<T extends Persistable<ID>, ID extends Serializable>
		extends Queryable<T>, ResourceManager<T, ID> {

}
