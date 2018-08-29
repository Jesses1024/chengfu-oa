package com.puxintech.chengfu.core.resource.params.filter;

/**
 * @author yanhai
 */
public enum FilterMode {
	
	/**
	 * 匹配前缀 (like '%' + filter)
	 */
	StartsWith,
	/**
	 * 匹配后缀 (like filter + '%')
	 */
	EndsWith,
	/**
	 * 全匹配 (like '%' + filter + '%')
	 */
	Contains,
}
