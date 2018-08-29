package com.puxintech.chengfu.company.leave;

import javax.persistence.Embeddable;

import lombok.Data;

/***/
@Embeddable
@Data
public class HrAduitItem {

	private Boolean isKey;// 钥匙、门禁 是否交还

	private Boolean isComputer;// 电脑是否交还

	private Boolean isFile;// 资料是否移交

	private String otherThings;// 其他物品

}
