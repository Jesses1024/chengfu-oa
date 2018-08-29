package com.puxintech.chengfu.core.security.filter;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.stream.Collectors;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.io.IOUtils;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationServiceException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.web.authentication.AbstractAuthenticationProcessingFilter;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;

import com.fasterxml.jackson.databind.JsonNode;
import com.puxintech.chengfu.core.util.JsonUtils;

/**
 * @author yanhai
 */
public class JsonUsernamePasswordAuthenticationFilter extends AbstractAuthenticationProcessingFilter {
	
	public JsonUsernamePasswordAuthenticationFilter(AuthenticationManager authenticationManager) {
		super(new AntPathRequestMatcher("/login/account", "POST"));
		super.setAuthenticationSuccessHandler(new SuccessHandler());
		super.setAuthenticationFailureHandler(new FailureHandler());
		super.setAuthenticationManager(authenticationManager);
	}

	@Override
	public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response)
			throws AuthenticationException {
		if (isJsonContentType(request)) {
			try {
				BufferedReader reader = request.getReader();
				String body = IOUtils.toString(reader);
				JsonNode json = JsonUtils.readTree(body);
				String username = JsonUtils.getNodeAsString(json, "username", "");
				String password = JsonUtils.getNodeAsString(json, "password", "");

				UsernamePasswordAuthenticationToken authRequest = new UsernamePasswordAuthenticationToken(username,
						password);

				authRequest.setDetails(authenticationDetailsSource.buildDetails(request));

				return this.getAuthenticationManager().authenticate(authRequest);
			} catch (IOException e) {
				throw new AuthenticationServiceException("授权失败");
			}
		} else {
			throw new AuthenticationServiceException("授权失败");
		}
	}

	private boolean isJsonContentType(HttpServletRequest request) {
		String header = request.getHeader("content-type");
		if (header != null && header.contains("application/json")) {
			return true;
		}
		return false;
	}

	private static class SuccessHandler implements AuthenticationSuccessHandler {

		@Override
		public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
				Authentication authentication) throws IOException, ServletException {
			Map<String, Object> result = new LinkedHashMap<>();
			PrintWriter writer = response.getWriter();
			String currentAuthority = authentication.getAuthorities().stream()
					.map(GrantedAuthority::getAuthority)
					.collect(Collectors.joining(","));

			response.setContentType(MediaType.APPLICATION_JSON_UTF8_VALUE);
			response.setCharacterEncoding("UTF-8");
			response.setStatus(HttpServletResponse.SC_OK);

			result.put("status", "ok");
			result.put("currentAuthority", "," + currentAuthority + ",");

			writer.print(JsonUtils.writeValueAsString(result));
			writer.flush();
		}

	}

	private static class FailureHandler implements AuthenticationFailureHandler {

		@Override
		public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response,
				AuthenticationException exception) throws IOException, ServletException {
			Map<String, Object> result = new LinkedHashMap<>();
			PrintWriter writer = response.getWriter();

			response.setContentType(MediaType.APPLICATION_JSON_UTF8_VALUE);
			response.setCharacterEncoding("UTF-8");
			response.setStatus(HttpServletResponse.SC_OK);

			result.put("status", "error");
			result.put("currentAuthority", ",none,");

			writer.print(JsonUtils.writeValueAsString(result));
			writer.flush();
		}

	}
}
