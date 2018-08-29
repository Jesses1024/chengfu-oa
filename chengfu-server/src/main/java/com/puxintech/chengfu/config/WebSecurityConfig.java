package com.puxintech.chengfu.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;

import com.puxintech.chengfu.core.security.filter.JsonUsernamePasswordAuthenticationFilter;

/**
 * @author yanhai
 *
 */
@EnableWebSecurity
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {

	@Autowired
	private UserDetailsService userDetailsService;

	@Autowired
	private PasswordEncoder passwordEncoder;

	@Override
	protected void configure(AuthenticationManagerBuilder auth) throws Exception {
		auth.userDetailsService(userDetailsService)
				.passwordEncoder(passwordEncoder);
	}

	@Override
	protected void configure(HttpSecurity http) throws Exception {
		http.addFilterBefore(accountLoginFilter(), BasicAuthenticationFilter.class);

		http.authorizeRequests()
				.anyRequest().authenticated()
			.and()
				.formLogin().disable()
				.logout().permitAll()
			.and()
				.csrf().disable();
	}

	private JsonUsernamePasswordAuthenticationFilter accountLoginFilter() throws Exception {
		AuthenticationManager authenticationManager = this.authenticationManagerBean();
		return new JsonUsernamePasswordAuthenticationFilter(authenticationManager);
	}

}
