package com.puxintech.chengfu.config;

import java.io.IOException;
import java.util.Set;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.BeanDescription;
import com.fasterxml.jackson.databind.JavaType;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.Module;
import com.fasterxml.jackson.databind.SerializationConfig;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.module.SimpleModule;
import com.fasterxml.jackson.databind.ser.BeanPropertyWriter;
import com.fasterxml.jackson.databind.ser.BeanSerializer;
import com.fasterxml.jackson.databind.ser.BeanSerializerBuilder;
import com.fasterxml.jackson.databind.ser.BeanSerializerModifier;
import com.fasterxml.jackson.databind.ser.impl.ObjectIdWriter;
import com.fasterxml.jackson.databind.ser.std.BeanSerializerBase;
import com.fasterxml.jackson.datatype.hibernate5.Hibernate5Module;
import com.puxintech.chengfu.core.model.DisplayName;

@Configuration
public class JacksonConfig {

	@Bean
	public Module hibernateModule() {
		return new Hibernate5Module();
	}

	@Bean
	public Module customSerializerModule() {
		SimpleModule module = new SimpleModule("custom_serializer");
		module.setSerializerModifier(new BeanSerializerModifier() {
			@Override
			public JsonSerializer<?> modifySerializer(SerializationConfig config, BeanDescription beanDesc,
					JsonSerializer<?> serializer) {
				if (serializer instanceof BeanSerializer) {
					return new DisplayNameSerializer((BeanSerializer) serializer);
				}

				return super.modifySerializer(config, beanDesc, serializer);
			}
		});
		return module;
	}

	private static class DisplayNameSerializer extends BeanSerializer {

		private static final long serialVersionUID = 1L;

		public DisplayNameSerializer(BeanSerializerBase src, ObjectIdWriter objectIdWriter, Object filterId) {
			super(src, objectIdWriter, filterId);
		}

		public DisplayNameSerializer(BeanSerializerBase src, ObjectIdWriter objectIdWriter) {
			super(src, objectIdWriter);
		}

		public DisplayNameSerializer(BeanSerializerBase src, Set<String> toIgnore) {
			super(src, toIgnore);
		}

		public DisplayNameSerializer(BeanSerializerBase src) {
			super(src);
		}

		public DisplayNameSerializer(JavaType type, BeanSerializerBuilder builder, BeanPropertyWriter[] properties,
				BeanPropertyWriter[] filteredProperties) {
			super(type, builder, properties, filteredProperties);
		}

		@Override
		protected void serializeFields(Object bean, JsonGenerator gen, SerializerProvider provider) throws IOException {
			super.serializeFields(bean, gen, provider);

			if (bean != null) {
//				if (Persistable.class.isAssignableFrom(bean.getClass())) {
//					Persistable<Integer> p = (Persistable<Integer>) bean;
//					gen.writeNumberField("key",  p.getId());
////					gen.writeStringField("key", p.getId().toString());
//				}

				if (DisplayName.class.isAssignableFrom(bean.getClass())) {
					DisplayName d = (DisplayName) bean;
					gen.writeStringField("label", d.getDisplayName());
				}
			}
		}
	}
}
