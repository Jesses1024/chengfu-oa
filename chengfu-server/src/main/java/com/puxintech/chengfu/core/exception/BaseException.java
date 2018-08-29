package com.puxintech.chengfu.core.exception;

import org.springframework.http.HttpStatus;

import lombok.Getter;

/**
 * 基础异常
 * 
 * @author yanhai
 *
 */
@Getter
public class BaseException extends RuntimeException {

	private static final long serialVersionUID = 1L;

	private static final String DEFAULT_MESSAGE = "服务器内部错误";
	private static final HttpStatus DEFAULT_STATUS = HttpStatus.INTERNAL_SERVER_ERROR;

	private final HttpStatus status;

	public BaseException() {
		this(DEFAULT_MESSAGE, DEFAULT_STATUS, null);
	}

	public BaseException(String message, HttpStatus status, Throwable cause) {
		super(message, cause);
		this.status = status;
	}

	public BaseException(String message, HttpStatus status) {
		this(message, status, null);
	}

	public BaseException(String message) {
		this(message, DEFAULT_STATUS, null);
	}

	public BaseException(Throwable cause) {
		this(DEFAULT_MESSAGE, DEFAULT_STATUS, cause);
	}

}
