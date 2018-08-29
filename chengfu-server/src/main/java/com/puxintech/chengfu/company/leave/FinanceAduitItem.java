package com.puxintech.chengfu.company.leave;

import javax.persistence.Embeddable;

import lombok.Data;

@Embeddable
@Data
public class FinanceAduitItem {
	
	private Boolean isBorrowSettle;//借款结清
	
	private Boolean isSalarySettle;//工资结清

	private String other;//其他
}
