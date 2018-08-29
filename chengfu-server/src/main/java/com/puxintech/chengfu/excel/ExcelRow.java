package com.puxintech.chengfu.excel;


import java.math.BigDecimal;
import java.text.ParseException;
import java.util.Date;
import java.util.function.Function;

import org.apache.commons.lang3.time.DateFormatUtils;
import org.apache.commons.lang3.time.DateUtils;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.CellType;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.springframework.util.StringUtils;

import com.puxintech.chengfu.exception.ChengfuException;

public class ExcelRow {

	private static final String[] DEFAULT_DATE_PATTERNS = {
			"yyyy-MM-dd",
			"yyyy-MM-dd HH:mm",
			"yyyy.MM.dd",
			"yyyy.MM.dd HH:mm",
			"yyyy/MM/dd",
			"yyyy/MM/dd HH:mm",
	};

	private static final String NIL_STR = "-";

	private static final String NULL_STR = "null";

	private final int rownum;

	private Row row;

	private int markPos;

	private int cellPos;

	public ExcelRow(Sheet sheet, int rownum) {
		Row r = sheet.getRow(rownum);
		this.row = r == null ? sheet.createRow(rownum) : r;
		this.cellPos = 0;
		this.rownum = rownum;
	}

	public int getRownum() {
		return rownum;
	}

	public Row getRow() {
		return row;
	}

	public void addCellValue(Date date, String pattern) {
		this.addCellValue(date, t -> DateFormatUtils.format(t, pattern));
	}

	public void addCellValue(Date date, String pattern, CellStyle style) {
		this.addCellValue(date, t -> DateFormatUtils.format(t, pattern), style);
	}

	public void addCellValue(BigDecimal value) {
		this.addCellValue(value, t -> t.toString());
	}

	public void addCellValue(BigDecimal value, CellStyle style) {
		this.addCellValue(value, t -> t.toString(), style);
	}

	public void addCellValue(Integer value) {
		this.addCellValue(value, t -> t.toString());
	}

	public void addCellValue(Integer value, CellStyle style) {
		this.addCellValue(value, t -> t.toString(), style);
	}

	public <T> void addCellValue(String value) {
		this.addCellValue(value, Function.identity(), null);
	}

	public <T> void addCellValue(String value, CellStyle style) {
		this.addCellValue(value, Function.identity(), style);
	}

	public <T> void addCellValue(T value, Function<T, String> f) {
		this.addCellValue(value, f, null);
	}

	public <T> void addCellValue(T value, Function<T, String> f, CellStyle style) {
		Cell cell = this.row.createCell(this.nextPos());
		cell.setCellValue(value == null ? NIL_STR : f.apply(value));
		cell.setCellStyle(style);
	}

	public Integer getIntegerValue() {
		return this.getIntegerValue(false, null);
	}

	public BigDecimal getBigDecimalValue() {
		return this.getBigDecimalValue(false, null);
	}

	public Date getDateValue() {
		return this.getDateValue(false, null);
	}

	public String getStringValue() {
		return this.getStringValue(false, null);
	}

	public Integer getIntegerValue(boolean required, String errmsg) {
		return this.getCellValue(str -> {
			try {
				return Integer.parseInt(str);
			} catch (NumberFormatException e) {
				throw new ChengfuException(400, this.rownum + "行: 数值格式不正确(不允许小数)");
			}
		}, required, errmsg);
	}

	public BigDecimal getBigDecimalValue(boolean required, String errmsg) {
		return this.getCellValue(str -> {
			try {
				return new BigDecimal(str);
			} catch (NumberFormatException e) {
				throw new ChengfuException(400, this.rownum + "行: 数值格式不正确(允许小数)");
			}
		}, required, errmsg);
	}

	public Date getDateValue(boolean required, String errmsg) {
		Cell cell = nextCell();
		if (cell == null) {
			return null;
		}
		Date result = null;
		try {
			if (cell.getCellTypeEnum() == CellType.NUMERIC) {
				result = cell.getDateCellValue();
				if (required && result == null) {
					throw new ChengfuException(rownum + "行：" + errmsg);
				}
			} else {
				result = getStringCellValue(str -> {
					try {
						return DateUtils.parseDate(str, DEFAULT_DATE_PATTERNS);
					} catch (ParseException e1) {
						throw new ChengfuException(400, this.rownum + "行: 日期格式不正确");
					}
				}, required, errmsg, cell);
			}
		} catch (Exception e) {
		}

		return result;
	}

	public String getStringValue(boolean required, String errmsg) {
		return this.getCellValue(String::new, required, errmsg);
	}

	public <T> T getCellValue(Function<String, T> f) {
		return this.getCellValue(f, false, null);
	}

	public <T> T getCellValue(Function<String, T> f, boolean required, String errmsg) {
		Cell cell = nextCell();
		if (cell == null) {
			return null;
		}
		return getStringCellValue(f, required, errmsg, cell);
	}

	private <T> T getStringCellValue(Function<String, T> f, boolean required, String errmsg, Cell cell) {
		cell.setCellType(CellType.STRING);
		String str = cell.getStringCellValue();
		if (!StringUtils.hasText(str) || NULL_STR.equals(str.trim()) || NIL_STR.equals(str.trim())) {
			if (required) {
				throw new ChengfuException(rownum + "行：" + errmsg);
			}
			return null;
		} else {
			return f.apply(str);
		}
	}

	private Cell nextCell() {
		return this.row.getCell(this.nextPos());
	}

	private int nextPos() {
		this.markPos = this.cellPos;
		this.cellPos = this.cellPos + 1;
		return this.markPos;
	}
}
