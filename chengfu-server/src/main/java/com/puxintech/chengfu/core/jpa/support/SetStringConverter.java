package com.puxintech.chengfu.core.jpa.support;

import java.util.Set;

import javax.persistence.AttributeConverter;
import javax.persistence.Converter;

import org.springframework.util.StringUtils;

/**
 * {@link Set} 集合转存数据库
 * 
 * @author yanhai
 *
 */
@Converter
public class SetStringConverter implements AttributeConverter<Set<String>, String> {

	@Override
	public String convertToDatabaseColumn(Set<String> attribute) {
		return StringUtils.collectionToCommaDelimitedString(attribute);
	}

	@Override
	public Set<String> convertToEntityAttribute(String dbData) {
		return StringUtils.commaDelimitedListToSet(dbData);
	}

}
