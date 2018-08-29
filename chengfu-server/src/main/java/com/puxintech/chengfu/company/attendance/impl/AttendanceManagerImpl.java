package com.puxintech.chengfu.company.attendance.impl;

import java.util.Optional;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.puxintech.chengfu.company.attendance.AttendanceAuditStatus;
import com.puxintech.chengfu.company.attendance.AttendanceEntity;
import com.puxintech.chengfu.company.attendance.AttendanceItemEntity;
import com.puxintech.chengfu.company.attendance.AttendanceItemManager;
import com.puxintech.chengfu.company.attendance.AttendanceManager;
import com.puxintech.chengfu.company.attendance.AttendanceRepository;
import com.puxintech.chengfu.core.resource.support.ResourceManagerAdapter;

@Service
public class AttendanceManagerImpl extends ResourceManagerAdapter<AttendanceEntity, Integer>
		implements AttendanceManager {

	private final AttendanceRepository repository;

	@Autowired
	private AttendanceItemManager attendanceItemManager;

	public AttendanceManagerImpl(AttendanceRepository repository) {
		super(repository);
		this.repository = repository;
	}

	@Override
	public <S extends AttendanceEntity> S save(S entity) {
		if (!entity.isNew()) {
			Optional<AttendanceEntity> oldEntity = repository.findById(entity.getId());
			if (oldEntity.isPresent()) {
				AttendanceEntity attendanceEntity = oldEntity.get();

				Set<AttendanceItemEntity> oldItems = attendanceEntity.getItems();
				Set<AttendanceItemEntity> newItems = entity.getItems();
				for (AttendanceItemEntity oldItem : oldItems) {
					if (!newItems.contains(oldItem)) {
						attendanceItemManager.deleteById(oldItem.getId());
					}
				}

				if (attendanceEntity.getStatus() == AttendanceAuditStatus.preAudit
						&& entity.getStatus() == AttendanceAuditStatus.aduited) {
					repository.deleteByAttendanceDateAndStatus(entity.getAttendanceDate(),
							AttendanceAuditStatus.aduited);
				}
			}

		}
		return super.save(entity);
	}
}
