package com.puxintech.chengfu.company.contact;

import javax.persistence.Entity;
import javax.persistence.Table;

import com.puxintech.chengfu.core.model.AuditableEntity;
import com.puxintech.chengfu.core.model.DisplayName;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

/**
 * 往来单位
 * @author Administrator
 *
 */
@Entity
@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Table(name="contract_unit")
public class ContactUnitEnity extends AuditableEntity implements DisplayName{
	
	
	private String unitName;//往来单位名称
	
	private ContractUnitType type;//往来单位类型
	
	private String area;//所在地区
	
	private String industry;//所属行业
	
	private String linkmanName;//联系人姓名
	
	private String job;//职务
	
	private String contactWay;//联系方式
	
	private String description;//备注说明
	
	private Boolean ifUsing;// 启用/禁用
	
	@Override
	public String getDisplayName() {
		
		return this.unitName;
	}
}
