package com.puxintech.chengfu.core.jpa;

import java.io.Serializable;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.NoRepositoryBean;

/**
 * @author yanhai
 *
 * @param <T> 实体类
 * @param <ID> 主键
 */
@NoRepositoryBean
public interface ResourceManagerRepository<T, ID extends Serializable>
		extends JpaRepository<T, ID>, JpaSpecificationExecutor<T> {

}
