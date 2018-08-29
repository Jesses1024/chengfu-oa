package com.puxintech.chengfu.company.employee.impl;

import java.util.Optional;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.puxintech.chengfu.company.employee.EmployeeEntity;
import com.puxintech.chengfu.company.employee.EmployeeManager;
import com.puxintech.chengfu.company.employee.EmployeeRepository;
import com.puxintech.chengfu.company.employee.WorkExperienceEntity;
import com.puxintech.chengfu.company.employee.WorkExperienceEntityManager;
import com.puxintech.chengfu.core.resource.support.ResourceManagerAdapter;

@Service
public class EmployeeManagerImpl extends ResourceManagerAdapter<EmployeeEntity, Integer> implements EmployeeManager {

	private final EmployeeRepository repository;

	@Autowired
	private WorkExperienceEntityManager workExperienceEntityManager;

	public EmployeeManagerImpl(EmployeeRepository repository) {
		super(repository);
		this.repository = repository;
	}

	@Override
	public <S extends EmployeeEntity> S save(S entity) {
		if (!entity.isNew()) {
			Optional<EmployeeEntity> oldEntity = repository.findById(entity.getId());
			if (oldEntity.isPresent()) {
				EmployeeEntity employeeEntity = oldEntity.get();

				Set<WorkExperienceEntity> oldItems = employeeEntity.getWorkExperienceList();
				Set<WorkExperienceEntity> newItems = entity.getWorkExperienceList();
				for (WorkExperienceEntity oldItem : oldItems) {
					if (!newItems.contains(oldItem)) {
						workExperienceEntityManager.deleteById(oldItem.getId());
					}
				}
			}
		}
		return super.save(entity);
	}
}
