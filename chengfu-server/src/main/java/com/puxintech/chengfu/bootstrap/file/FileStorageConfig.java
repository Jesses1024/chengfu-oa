package com.puxintech.chengfu.bootstrap.file;

import org.springframework.boot.context.properties.ConfigurationProperties;

import lombok.Data;

/**
 * @author yanhai
 *
 */
@Data
@ConfigurationProperties(prefix = "puxintech.file-storage")
public class FileStorageConfig {

	private String location = "upload-dir";

}
