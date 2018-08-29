package com.puxintech.chengfu.core.jpa.support;

import java.util.HashSet;
import java.util.Set;

import javax.persistence.AttributeConverter;
import javax.persistence.Converter;

import org.springframework.util.StringUtils;

import com.puxintech.chengfu.project.model.ProjectType;

@Converter
public class SetProjectTypeConverter implements AttributeConverter<Set<ProjectType>, String>{

	@Override
	public String convertToDatabaseColumn(Set<ProjectType> attribute) {
		return StringUtils.collectionToCommaDelimitedString(attribute);
	}

	@Override
	public Set<ProjectType> convertToEntityAttribute(String dbData) {
		 Set<String> set = StringUtils.commaDelimitedListToSet(dbData);
		 HashSet<ProjectType> types = new HashSet<ProjectType>();
		 for (String str : set) {
			ProjectType type = ProjectType.valueOf(str);
			types.add(type);
		}
		 return types;
	}

}
