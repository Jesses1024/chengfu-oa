package com.puxintech.chengfu.group;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.Repository;

import com.puxintech.chengfu.core.resource.QueryableResourceManager;

/**
 * @author yanhai
 *
 */
public interface GroupManager
		extends Repository<GroupEntity, Integer>, QueryableResourceManager<GroupEntity, Integer> {

	Optional<GroupEntity> findByName(String name);

	List<GroupEntity> findByParentId(Integer parentId);

	@Modifying
	@Query("update GroupEntity g set g.enabled = ?2 where g.id = ?1")
	void updateEnabled(Integer groupId, boolean enabled);

	default GroupEntity getByName(String name) {
		Optional<GroupEntity> g = this.findByName(name);
		if (g.isPresent()) {
			return g.get();
		} else {
			return this.save(new GroupEntity(name));
		}
	}
}
