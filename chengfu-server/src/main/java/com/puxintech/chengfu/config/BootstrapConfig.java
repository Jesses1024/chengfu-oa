package com.puxintech.chengfu.config;

import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.puxintech.chengfu.bootstrap.user.UserBootstrap;
import com.puxintech.chengfu.bootstrap.user.UserConfig;
import com.puxintech.chengfu.group.GroupManager;
import com.puxintech.chengfu.user.UserManager;

@Configuration
@EnableConfigurationProperties(UserConfig.class)
public class BootstrapConfig {

	@Bean
	@ConditionalOnMissingBean
	public UserBootstrap userBootstrap(UserManager userManager, GroupManager groupManager, UserConfig userConfig) {
		return new UserBootstrap(userManager, groupManager, userConfig);
	}

}
