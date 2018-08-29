package com.puxintech.chengfu.exception;

/**
 * @author yanhai
 */
public class ChengfuException extends RuntimeException {

	private static final long serialVersionUID = 1L;

	public static final int DEFAULT_STATUS_CODE = 500;

	public static final String DEFAULT_MESSAGE = "unknow";

	private int statusCode = DEFAULT_STATUS_CODE;

	private String message = DEFAULT_MESSAGE;

	public ChengfuException() {
	}

	public ChengfuException(int statusCode, String message, Throwable cause) {
		super(message, cause);
		this.statusCode = statusCode;
		this.message = message;
	}

	public ChengfuException(int statusCode, String message) {
		this(statusCode, message, null);
	}

	public ChengfuException(String message) {
		this(DEFAULT_STATUS_CODE, message, null);
	}

	public ChengfuException(String message, Throwable cause) {
		this(DEFAULT_STATUS_CODE, message, cause);
	}

	public ChengfuException(Throwable cause) {
		this(DEFAULT_STATUS_CODE, DEFAULT_MESSAGE, cause);
	}

	public ChengfuException(int statusCode, Throwable cause) {
		this(statusCode, DEFAULT_MESSAGE, cause);
	}

	public int getStatusCode() {
		return statusCode;
	}

	public String getMessage() {
		return message;
	}

}
