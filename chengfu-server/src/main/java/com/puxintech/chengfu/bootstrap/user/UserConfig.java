package com.puxintech.chengfu.bootstrap.user;

import java.util.Map;

import org.springframework.boot.context.properties.ConfigurationProperties;

import lombok.Data;

@Data
@ConfigurationProperties(prefix = "puxintech")
public class UserConfig {

	private Map<String, UserInfo> users;

	@Data
	public static class UserInfo {
		private String password;
		private String displayName;
		private String avatar;
		private String group;
		private boolean override;
	}

}
