package com.puxintech.chengfu.company.reimburse.impl;

import java.util.Optional;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.puxintech.chengfu.company.reimburse.ReimburseEntity;
import com.puxintech.chengfu.company.reimburse.ReimburseItemEntity;
import com.puxintech.chengfu.company.reimburse.ReimburseItemEntityManager;
import com.puxintech.chengfu.company.reimburse.ReimburseManager;
import com.puxintech.chengfu.company.reimburse.ReimburseRepository;
import com.puxintech.chengfu.core.resource.support.ResourceManagerAdapter;

@Service
public class ReimburseManagerImpl extends ResourceManagerAdapter<ReimburseEntity, Integer> implements ReimburseManager{
	
	private final ReimburseRepository repository;

	@Autowired
	private ReimburseItemEntityManager reimburseItemManager;

	public ReimburseManagerImpl(ReimburseRepository repository) {
		super(repository);
		this.repository = repository;
	}

	@Override
	public <S extends ReimburseEntity> S save(S entity) {
		if (!entity.isNew()) {
			Optional<ReimburseEntity> oldEntity = repository.findById(entity.getId());
			if (oldEntity.isPresent()) {
				ReimburseEntity reimburseEntity = oldEntity.get();

				Set<ReimburseItemEntity> oldItems = reimburseEntity.getItems();
				Set<ReimburseItemEntity> newItems = entity.getItems();
				for (ReimburseItemEntity oldItem : oldItems) {
					if (!newItems.contains(oldItem)) {
						reimburseItemManager.deleteById(oldItem.getId());
					}
				}
			}
		}
		return super.save(entity);
	}
}
