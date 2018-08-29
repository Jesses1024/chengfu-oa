package com.puxintech.chengfu.file;

import java.io.IOException;
import java.io.InputStream;
import java.io.UnsupportedEncodingException;
import java.util.Collections;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.puxintech.chengfu.core.exception.BaseException;


@RestController
public class FileUploadController {

	@Autowired
	private FileStorageService storageService;

	@GetMapping("/upload/{filename:.+}")
	public ResponseEntity<Resource> serveFile(@PathVariable String filename) {
		Resource file = storageService.loadAsResource(filename);
		String encodeFilename;
		try {
			encodeFilename = new String(file.getFilename().getBytes(), "ISO-8859-1");
		} catch (UnsupportedEncodingException e) {
			throw new BaseException("数据导出异常");
		}

		return ResponseEntity.ok()
				.header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + encodeFilename + "\"")
				.body(file);
	}

	@PostMapping("/upload")
	public Map<String, Object> handleFileUpload(@RequestParam(name = "file") MultipartFile file) {
		try (InputStream inputStream = file.getInputStream()) {
			String filename = storageService.store(file);
			return Collections.singletonMap("filename", filename);
		} catch (IOException e) {
			throw new BaseException("上传文件失败");
		}
	}

}
