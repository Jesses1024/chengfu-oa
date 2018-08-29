package com.puxintech.chengfu.core.exception;

import org.springframework.http.HttpStatus;

/**
 * 验证异常
 * 
 * @author yanhai
 *
 */
public class ValidateException extends BaseException {

	private static final long serialVersionUID = 1L;

	public ValidateException(String message) {
		super(message, HttpStatus.BAD_REQUEST);
	}

}
