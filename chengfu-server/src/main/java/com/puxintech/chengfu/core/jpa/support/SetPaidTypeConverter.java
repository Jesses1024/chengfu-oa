package com.puxintech.chengfu.core.jpa.support;

import java.util.HashSet;
import java.util.Set;

import javax.persistence.AttributeConverter;
import javax.persistence.Converter;

import org.springframework.util.StringUtils;

import com.puxintech.chengfu.company.reimburse.PaidType;

@Converter
public class SetPaidTypeConverter implements AttributeConverter<Set<PaidType>, String>{

	@Override
	public String convertToDatabaseColumn(Set<PaidType> attribute) {
		return StringUtils.collectionToCommaDelimitedString(attribute);
	}

	@Override
	public Set<PaidType> convertToEntityAttribute(String dbData) {
		 Set<String> set = StringUtils.commaDelimitedListToSet(dbData);
		 HashSet<PaidType> types = new HashSet<PaidType>();
		 for (String str : set) {
			 PaidType type = PaidType.valueOf(str);
			types.add(type);
		}
		 return types;
	}

}
