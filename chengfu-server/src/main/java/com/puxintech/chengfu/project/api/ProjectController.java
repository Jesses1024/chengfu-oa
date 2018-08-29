package com.puxintech.chengfu.project.api;

import java.util.Date;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import javax.transaction.Transactional;

import org.hibernate.Hibernate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.puxintech.chengfu.company.contact.ContactUnitEnity;
import com.puxintech.chengfu.company.contact.ContactUnitManager;
import com.puxintech.chengfu.company.contact.ContractUnitType;
import com.puxintech.chengfu.core.web.QueryParamsController;
import com.puxintech.chengfu.project.manager.AskPriceOrderManager;
import com.puxintech.chengfu.project.manager.NeedRecordManager;
import com.puxintech.chengfu.project.manager.ProjectManager;
import com.puxintech.chengfu.project.manager.PurchaseItemManager;
import com.puxintech.chengfu.project.manager.PurchaseOrderManager;
import com.puxintech.chengfu.project.manager.VisitRecordManager;
import com.puxintech.chengfu.project.model.AskPriceOrder;
import com.puxintech.chengfu.project.model.AuditStatus;
import com.puxintech.chengfu.project.model.AuditType;
import com.puxintech.chengfu.project.model.InvaildType;
import com.puxintech.chengfu.project.model.NeedRecordEntity;
import com.puxintech.chengfu.project.model.ProjectEntity;
import com.puxintech.chengfu.project.model.ProjectQueryParams;
import com.puxintech.chengfu.project.model.ProjectStatus;
import com.puxintech.chengfu.project.model.PurchaseItemEntity;
import com.puxintech.chengfu.project.model.PurchaseOrder;
import com.puxintech.chengfu.project.model.PurchaseStatus;
import com.puxintech.chengfu.project.model.VisitRecordEntity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @author yanhai
 *
 */
@RestController
@RequestMapping("/projects")
public class ProjectController extends QueryParamsController<ProjectQueryParams, ProjectEntity, Integer> {

	private ProjectManager pm;

	private PurchaseItemManager purchaseItemManager;

	private VisitRecordManager visitRecordManager;

	private NeedRecordManager needRecordManager;

	private AskPriceOrderManager askManager;

	private PurchaseOrderManager purchaseOrderManager;

	private ContactUnitManager contactUnitManager;

	public ProjectController(ProjectManager pm, PurchaseItemManager purchaseItemManager,
			VisitRecordManager visitRecordManager, NeedRecordManager needRecordManager, AskPriceOrderManager askManager,
			PurchaseOrderManager purchaseOrderManager, ContactUnitManager contactUnitManager) {
		super(pm);
		this.pm = pm;
		this.purchaseItemManager = purchaseItemManager;
		this.visitRecordManager = visitRecordManager;
		this.needRecordManager = needRecordManager;
		this.askManager = askManager;
		this.purchaseOrderManager = purchaseOrderManager;
		this.contactUnitManager = contactUnitManager;
	}

	@PostMapping
	@Transactional
	@Override
	public ResponseEntity<Object> createOrSave(@RequestBody ProjectEntity body) {
		HttpStatus responseStatus = body.isNew() ? HttpStatus.CREATED : HttpStatus.OK;

		// 往来单位中不存在此公司名 新增此公司名的往来单位
		List<ContactUnitEnity> units = contactUnitManager.findByType(ContractUnitType.customer);
		Set<String> unitsNames = units.stream().map(ContactUnitEnity::getUnitName).collect(Collectors.toSet());
		if (!unitsNames.contains(body.getCompanyName())) {
			ContactUnitEnity contactUnitEnity = new ContactUnitEnity();
			contactUnitEnity.setUnitName(body.getCompanyName());
			contactUnitEnity.setType(ContractUnitType.customer);
			contactUnitEnity.setIfUsing(true);

			contactUnitManager.save(contactUnitEnity);
		}

		ProjectEntity responseBody = pm.save(body);

		return new ResponseEntity<>(responseBody, responseStatus);
	}

	@PutMapping("/{id}")
	@Transactional
	@Override
	public ResponseEntity<Object> update(@PathVariable Integer id, @RequestBody ProjectEntity body) {
		final ProjectEntity responseBody;
		final HttpStatus responseStatus;
		if (pm.existsById(id)) {

			// 往来单位中不存在此公司名 新增此公司名的往来单位
			List<ContactUnitEnity> units = contactUnitManager.findByType(ContractUnitType.customer);
			Set<String> unitsNames = units.stream().map(ContactUnitEnity::getUnitName).collect(Collectors.toSet());
			if (!unitsNames.contains(body.getCompanyName())) {
				ContactUnitEnity contactUnitEnity = new ContactUnitEnity();
				contactUnitEnity.setUnitName(body.getCompanyName());
				contactUnitEnity.setType(ContractUnitType.customer);
				contactUnitEnity.setIfUsing(true);

				contactUnitManager.save(contactUnitEnity);
			}

			body.setId(id);
			responseBody = pm.save(body);
			responseStatus = HttpStatus.OK;
		} else {
			responseBody = null;
			responseStatus = HttpStatus.NOT_FOUND;
		}
		return new ResponseEntity<Object>(responseBody, responseStatus);
	}

	@PutMapping("/updateStatus")
	public void updateStatus(@RequestBody StatusDTO statusDTO) {
		ProjectEntity result = pm.findById(statusDTO.getId()).orElseGet(null);

		ProjectStatus status = ProjectStatus.valueOf(statusDTO.getStatus());
		if (status == ProjectStatus.stoped) {
			result.setInvaildReason(statusDTO.getInvaildReason());
			result.setInvaildType(statusDTO.getInvaildType());
		}
		result.setStatus(status);
		pm.save(result);
	}

	@Data
	@NoArgsConstructor
	@AllArgsConstructor
	public static class StatusDTO {
		private Integer id;
		private String status;
		private String invaildReason;
		private InvaildType invaildType;
	}

	// TODO 更新项目购买项后，将旧购买项记录至变更记录。购买项单价的总计价格回填至主表。

	@PostMapping("/purchase/item/{projectId}")
	public void create(@PathVariable("projectId") Integer projectId, @RequestBody PurchaseItemEntity entity) {
		ProjectEntity projectEntity = pm.findById(projectId).get();

		entity.setProject(projectEntity);
		purchaseItemManager.save(entity);
	}

	@PostMapping("/visit/item/{projectId}")
	public void create(@PathVariable("projectId") Integer projectId, @RequestBody VisitRecordEntity entity) {
		ProjectEntity projectEntity = pm.findById(projectId).get();
		entity.setProject(projectEntity);
		visitRecordManager.save(entity);
	}

	@PostMapping("/need/item/{projectId}")
	public void create(@PathVariable("projectId") Integer projectId, @RequestBody NeedRecordEntity entity) {
		ProjectEntity projectEntity = pm.findById(projectId).get();
		entity.setProject(projectEntity);
		needRecordManager.save(entity);
	}

	@PostMapping("/ask/item/{projectId}")
	public void create(@PathVariable("projectId") Integer projectId, @RequestBody AskPriceOrder entity) {
		ProjectEntity projectEntity = pm.findById(projectId).get();
		entity.setProject(projectEntity);
		askManager.save(entity);
	}

	@PostMapping("/purchase/order/{projectId}")
	public void create(@PathVariable("projectId") Integer projectId, @RequestBody PurchaseOrder entity) {
		ProjectEntity projectEntity = pm.findById(projectId).get();
		entity.setProject(projectEntity);

		// 是否存在此往来单位 否则新增
		List<ContactUnitEnity> units = contactUnitManager.findByType(ContractUnitType.supplier);
		Set<String> unitsNames = units.stream().map(ContactUnitEnity::getUnitName).collect(Collectors.toSet());
		if (!unitsNames.contains(entity.getSupplier())) {
			ContactUnitEnity contactUnitEnity = new ContactUnitEnity();
			contactUnitEnity.setUnitName(entity.getSupplier());
			contactUnitEnity.setType(ContractUnitType.supplier);
			contactUnitEnity.setIfUsing(true);

			contactUnitManager.save(contactUnitEnity);
		}

		purchaseOrderManager.save(entity);
	}

	@PostMapping("/purchase/order/{projectId}/build/{askId}")
	public void build(@PathVariable("askId") Integer askId, @PathVariable("projectId") Integer projectId) {
		ProjectEntity projectEntity = pm.findById(projectId).get();
		AskPriceOrder ask = askManager.findById(askId).get();
		PurchaseOrder purchaseOrder = new PurchaseOrder();
		purchaseOrder.setProject(projectEntity);
		purchaseOrder.setGoodsName(ask.getGoodsName());
		purchaseOrder.setModelNumber(ask.getModelNumber());
		purchaseOrder.setGoodsUnit(ask.getGoodsUnit());
		purchaseOrder.setNumber(ask.getNumber());
		purchaseOrder.setSupplier(ask.getSupplier());
		purchaseOrder.setApplyPurchaseDate(new Date());
		purchaseOrder.setAuditStatus(AuditStatus.preAudit);
		purchaseOrder.setPurchaseStatus(PurchaseStatus.unArrive);

		// 往来单位中不存在此公司名 新增此公司名的往来单位
		List<ContactUnitEnity> units = contactUnitManager.findByType(ContractUnitType.customer);
		Set<String> unitsNames = units.stream().map(ContactUnitEnity::getUnitName).collect(Collectors.toSet());
		if (!unitsNames.contains(purchaseOrder.getSupplier())) {
			ContactUnitEnity contactUnitEnity = new ContactUnitEnity();
			contactUnitEnity.setUnitName(purchaseOrder.getSupplier());
			contactUnitEnity.setType(ContractUnitType.customer);
			contactUnitEnity.setIfUsing(true);

			contactUnitManager.save(contactUnitEnity);
		}

		purchaseOrderManager.save(purchaseOrder);
	}

	@Override
	protected ProjectEntity entityMapper(ProjectEntity entity) {
		Hibernate.initialize(entity.getItems());
		Hibernate.initialize(entity.getVisitRecords());
		Hibernate.initialize(entity.getChangeRecords());
		Hibernate.initialize(entity.getNeedRecords());
		Hibernate.initialize(entity.getAskPriceOrders());
		Hibernate.initialize(entity.getPurchaseOrders());
		return super.entityMapper(entity);
	}

	@PutMapping("/audit")
	public void audit(@RequestBody AuditDTO auditDTO) {
		AuditType type = AuditType.valueOf(auditDTO.getAuditType());
		Integer id = auditDTO.getId();
		AuditStatus status = AuditStatus.valueOf(auditDTO.getAuditStatus());
		if (type == AuditType.price) {
			ProjectEntity projectEntity = pm.findById(id).get();
			if (projectEntity != null) {
				projectEntity.setPriceRejectDescription(auditDTO.getRejectDescription());
				projectEntity.setPriceAuditStatus(status);
				pm.save(projectEntity);
			}
		} else if (type == AuditType.contract) {
			ProjectEntity projectEntity = pm.findById(id).get();
			if (projectEntity != null) {
				projectEntity.setContractRejectDescription(auditDTO.getRejectDescription());
				projectEntity.setContractAuditStatus(status);
				pm.save(projectEntity);
			}
		} else if (type == AuditType.need) {
			NeedRecordEntity needRecordEntity = needRecordManager.findById(id).get();
			if (needRecordEntity != null) {
				needRecordEntity.setRejectDescription(auditDTO.getRejectDescription());
				needRecordEntity.setAuditStatus(status);
				needRecordManager.save(needRecordEntity);
			}
		} else if (type == AuditType.purchase) {
			PurchaseOrder purchaseOrder = purchaseOrderManager.findById(id).get();
			if (purchaseOrder != null) {
				purchaseOrder.setPurchaseRejectDescription(auditDTO.getRejectDescription());
				purchaseOrder.setAuditStatus(status);
				purchaseOrderManager.save(purchaseOrder);
			}
		}

	}

	@Data
	public static class AuditDTO {
		private Integer id;

		private String auditType;// 审核类型

		private String auditStatus;// 审核状态

		private String rejectDescription;// 驳回描述
	}
}
