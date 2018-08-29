package com.puxintech.chengfu.core.exception;

import org.springframework.http.HttpStatus;

/**
 * 业务异常
 * 
 * @author yanhai
 *
 */
public class ServiceException extends BaseException {

	private static final long serialVersionUID = 1L;

	public ServiceException(String message) {
		super(message, HttpStatus.BAD_REQUEST);
	}

}
