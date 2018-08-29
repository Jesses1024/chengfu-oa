package com.puxintech.chengfu.company.attendance;

import java.util.HashSet;
import java.util.Set;

import javax.transaction.Transactional;

import org.apache.commons.lang3.StringUtils;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.usermodel.WorkbookFactory;
import org.hibernate.Hibernate;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.puxintech.chengfu.core.exception.BaseException;
import com.puxintech.chengfu.core.exception.NotFoundException;
import com.puxintech.chengfu.core.web.QueryParamsController;
import com.puxintech.chengfu.excel.ExcelRow;

@RestController
@RequestMapping("/attendance")
public class AttendanceController
		extends QueryParamsController<AttendanceEntityQueryParams, AttendanceEntity, Integer> {

	private AttendanceManager am;

	private AttendanceItemManager im;

	public AttendanceController(AttendanceManager am, AttendanceItemManager im) {
		super(am);
		super.setAllowDelete(true);
		this.am = am;
		this.im = im;
	}

	@Override
	protected AttendanceEntity entityMapper(AttendanceEntity entity) {
		Hibernate.initialize(entity.getItems());
		return super.entityMapper(entity);
	}

	@Transactional
	@PostMapping("/{attendanceId}/excel")
	public void importExcel(@PathVariable Integer attendanceId, @RequestParam("file") MultipartFile file) {
		AttendanceEntity attendance = am.findById(attendanceId).get();
		System.out.println(attendance);

		Workbook workbook;
		String fileName = file.getOriginalFilename();

		try {
			if (fileName.endsWith(".xlsx")) {
				workbook = WorkbookFactory.create(file.getInputStream());
			} else if (fileName.endsWith(".xls")) {
				workbook = new HSSFWorkbook(file.getInputStream());
			} else {
				throw new NotFoundException("上传的文件不合法, 只支持上传xls或xlsx结尾的表格文件");
			}

			Set<AttendanceItemEntity> items = readItems(workbook, attendance);

			handleUpdateItems(items, attendance.getItems());

		} catch (Exception e) {
			throw new BaseException("上传失败", HttpStatus.INTERNAL_SERVER_ERROR, e);
		}

	}

	private void handleUpdateItems(Set<AttendanceItemEntity> items, Set<AttendanceItemEntity> savedItems) {
		if (savedItems == null) {
			return;
		}

		Set<AttendanceItemEntity> set = new HashSet<>();
		for (AttendanceItemEntity saveItem : savedItems) {
			set.add(saveItem);
		}
		for (AttendanceItemEntity newItem : items) {
			set.add(newItem);
		}

		for (AttendanceItemEntity item : set) {
			im.save(item);
		}

	}

	private Set<AttendanceItemEntity> readItems(Workbook workbook, AttendanceEntity attendance) {

		Sheet sheet = workbook.getSheet("考勤汇总");
		Set<AttendanceItemEntity> items = new HashSet<>();

		int lastRowNum = sheet.getLastRowNum();
		for (int rownum = 4; rownum <= lastRowNum; rownum++) {
			ExcelRow row = new ExcelRow(sheet, rownum);
			String jobNumber = row.getStringValue();
			String name = row.getStringValue();

			if (name == null || name.equals("")) {
				continue;
			}

			AttendanceItemEntity item = new AttendanceItemEntity();
			item.setAttendance(attendance);
			item.setJobNumber(jobNumber);
			item.setName(name);
			item.setDeptName(row.getStringValue());// 所属部门
			item.setNormalWorkHours(row.getStringValue());// 标准工作时数
			item.setActualWorkHours(row.getStringValue());// 实际工作时数
			item.setLateTimes(row.getIntegerValue());
			item.setLateHours(String.valueOf((row.getIntegerValue() / 60)));
			item.setEarlyTimes(row.getIntegerValue());
			item.setEarlyHours(String.valueOf(row.getIntegerValue() / 60));
			item.setNormalOverHours(row.getStringValue());// 正常加班时数
			item.setEspecialOverHours(row.getStringValue());// 特殊加班时数
			String onDuty = row.getStringValue();
			String[] strArry = StringUtils.split(onDuty, "/");
			item.setNormalOnDutyDays(strArry[0]);// 标准出勤天数
			item.setActualOnDutyDays(strArry[1]);// 实际出清天数
			item.setTravelDays(row.getStringValue());
			item.setAbsenteeismDays(row.getStringValue());
			item.setLeaveDays(row.getStringValue());

			items.add(item);
		}

		return items;
	}

}