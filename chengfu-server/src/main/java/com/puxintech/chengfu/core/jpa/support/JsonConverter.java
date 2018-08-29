package com.puxintech.chengfu.core.jpa.support;

import java.util.Map;

import javax.persistence.AttributeConverter;
import javax.persistence.Converter;

import com.fasterxml.jackson.core.type.TypeReference;
import com.puxintech.chengfu.core.util.JsonUtils;

/**
 * {@link java.util.Map} 集合转存数据库
 * 
 * @author yanhai
 *
 */
@Converter
public class JsonConverter implements AttributeConverter<Map<String, Object>, String> {

	@Override
	public String convertToDatabaseColumn(Map<String, Object> attribute) {
		if (attribute == null) {
			return null;
		}
		return JsonUtils.writeValueAsString(attribute);
	}

	@Override
	public Map<String, Object> convertToEntityAttribute(String dbData) {
		if (dbData == null) {
			return null;
		}
		return JsonUtils.readValue(dbData, new TypeReference<Map<String, Object>>() {
		});
	}

}
