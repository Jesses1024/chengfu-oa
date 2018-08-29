package com.puxintech.chengfu.core.web.exception;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.dao.DuplicateKeyException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.validation.ObjectError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.puxintech.chengfu.core.exception.BaseException;

/**
 * rest controller 统一异常拦截处理
 * 
 * @author yanhai
 *
 */
@RestControllerAdvice(basePackages = "com.puxintech", annotations = RestController.class)
public class RestControllerExceptionHandler {

	@ExceptionHandler(Exception.class)
	public ResponseEntity<Map<String, Object>> handleException(Exception exception) {
		final HttpStatus status;
		final String message;
		final Map<String, Object> result = new HashMap<>();

		if (exception instanceof BaseException) {
			BaseException base = ((BaseException) exception);
			status = base.getStatus();
			message = base.getMessage();
		} else if (exception instanceof DuplicateKeyException) {
			status = HttpStatus.CONFLICT;
			message = exception.getMessage();
		} else if (exception instanceof MethodArgumentNotValidException) {
			status = HttpStatus.BAD_REQUEST;
			message = getFirstErrorMessage(((MethodArgumentNotValidException) exception).getBindingResult());
		} else {
			message = "服务器内部错误";
			status = HttpStatus.INTERNAL_SERVER_ERROR;
		}

		result.put("error", status.getReasonPhrase());
		result.put("message", message);
		result.put("timestamp", System.currentTimeMillis());

		return new ResponseEntity<Map<String, Object>>(result, status);
	}

	private String getFirstErrorMessage(BindingResult bindingResult) {
		List<FieldError> fieldErrors = bindingResult.getFieldErrors();
		if (fieldErrors != null && !fieldErrors.isEmpty()) {
			return fieldErrors.get(0).getDefaultMessage();
		}
		List<ObjectError> allErrors = bindingResult.getAllErrors();
		if (allErrors != null && !allErrors.isEmpty()) {
			return allErrors.get(0).getDefaultMessage();
		}

		return null;
	}
}
