package com.puxintech.chengfu.project.manager.impl;

import java.util.Optional;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.puxintech.chengfu.core.resource.support.ResourceManagerAdapter;
import com.puxintech.chengfu.project.manager.AskPriceOrderManager;
import com.puxintech.chengfu.project.manager.NeedRecordManager;
import com.puxintech.chengfu.project.manager.ProjectManager;
import com.puxintech.chengfu.project.manager.PurchaseItemManager;
import com.puxintech.chengfu.project.manager.PurchaseOrderManager;
import com.puxintech.chengfu.project.manager.VisitRecordManager;
import com.puxintech.chengfu.project.model.AskPriceOrder;
import com.puxintech.chengfu.project.model.NeedRecordEntity;
import com.puxintech.chengfu.project.model.ProjectEntity;
import com.puxintech.chengfu.project.model.PurchaseItemEntity;
import com.puxintech.chengfu.project.model.PurchaseOrder;
import com.puxintech.chengfu.project.model.VisitRecordEntity;
import com.puxintech.chengfu.project.repository.ProjectRepository;

@Service
public class ProjectManagerImpl extends ResourceManagerAdapter<ProjectEntity, Integer> implements ProjectManager {

	private final ProjectRepository repository;

	@Autowired
	private PurchaseItemManager itemManager;
	
	@Autowired
	private NeedRecordManager needManager;
	
	@Autowired
	private VisitRecordManager visitManager;

	@Autowired
	private AskPriceOrderManager askManager;
	
	@Autowired
	private PurchaseOrderManager purchaseOrderManager;

	public ProjectManagerImpl(ProjectRepository repository) {
		super(repository);
		this.repository = repository;
	}

	@Override
	public <S extends ProjectEntity> S save(S entity) {
		if (!entity.isNew()) {
			Optional<ProjectEntity> oldEntity = repository.findById(entity.getId());
			if (oldEntity.isPresent()) {
				ProjectEntity projectEntity = oldEntity.get();

				Set<PurchaseItemEntity> oldItems = projectEntity.getItems();
				Set<PurchaseItemEntity> newItems = entity.getItems();
				for (PurchaseItemEntity oldItem : oldItems) {
					if (!newItems.contains(oldItem)) {
						itemManager.deleteById(oldItem.getId());
					}
				}
				
				Set<NeedRecordEntity> oldNeedItems = projectEntity.getNeedRecords();
				Set<NeedRecordEntity> newNeedItems = entity.getNeedRecords();
				for (NeedRecordEntity oldItem : oldNeedItems) {
					if (!newNeedItems.contains(oldItem)) {
						needManager.deleteById(oldItem.getId());
					}
				}
				
				Set<VisitRecordEntity> oldVisitItems = projectEntity.getVisitRecords();
				Set<VisitRecordEntity> newVisitItems = entity.getVisitRecords();
				for (VisitRecordEntity oldItem : oldVisitItems) {
					if (!newVisitItems.contains(oldItem)) {
						visitManager.deleteById(oldItem.getId());
					}
				}
				
				Set<AskPriceOrder> oldAskItems = projectEntity.getAskPriceOrders();
				Set<AskPriceOrder> newAskItems = entity.getAskPriceOrders();
				for (AskPriceOrder oldItem : oldAskItems) {
					if (!newAskItems.contains(oldItem)) {
						askManager.deleteById(oldItem.getId());
					}
				}

				Set<PurchaseOrder> oldPurchaseOrder = projectEntity.getPurchaseOrders();
				Set<PurchaseOrder> newPurchaseOrder = entity.getPurchaseOrders();
				for (PurchaseOrder oldOrder : oldPurchaseOrder) {
					if (!newPurchaseOrder.contains(oldOrder)) {
						purchaseOrderManager.deleteById(oldOrder.getId());
					}
				}

			}
		}
		return super.save(entity);
	}
	
}
