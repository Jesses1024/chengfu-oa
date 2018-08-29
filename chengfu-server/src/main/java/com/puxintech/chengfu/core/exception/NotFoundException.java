package com.puxintech.chengfu.core.exception;

import org.springframework.http.HttpStatus;

public class NotFoundException extends BaseException {
	private static final long serialVersionUID = 1L;

	public NotFoundException(String message) {
		super(message, HttpStatus.INTERNAL_SERVER_ERROR);
	}

}
