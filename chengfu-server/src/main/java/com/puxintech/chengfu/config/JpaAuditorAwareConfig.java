package com.puxintech.chengfu.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.domain.AuditorAware;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Optional;

@Configuration
@EnableJpaAuditing(auditorAwareRef = "springSecurityAuditorAware")
public class JpaAuditorAwareConfig {

	@Bean
	public SpringSecurityAuditorAware springSecurityAuditorAware() {
		return new SpringSecurityAuditorAware();
	}

	public static class SpringSecurityAuditorAware implements AuditorAware<String> {

		public Optional<String> getCurrentAuditor() {

			Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

			if (authentication == null || !authentication.isAuthenticated()) {
				return Optional.empty();
			}

			return Optional.ofNullable(authentication.getName());
		}
	}
}
