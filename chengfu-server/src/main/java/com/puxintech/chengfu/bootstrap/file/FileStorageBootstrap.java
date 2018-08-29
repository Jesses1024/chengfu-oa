package com.puxintech.chengfu.bootstrap.file;

import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;

import com.puxintech.chengfu.file.FileStorageService;
import com.puxintech.chengfu.file.FileSystemStorageService;

@Component
@EnableConfigurationProperties(FileStorageConfig.class)
public class FileStorageBootstrap {

	@Bean
	@ConditionalOnMissingBean
	public FileStorageService fileStorageService(FileStorageConfig config) {
		return new FileSystemStorageService(config);
	}

}
