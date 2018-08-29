package com.puxintech.chengfu.company.contact;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.puxintech.chengfu.core.web.QueryParamsController;

@RestController
@RequestMapping("/contact")
public class ContactUnitController extends QueryParamsController<ContactUnitQueryParams, ContactUnitEnity, Integer>{

	public ContactUnitController(ContactUnitManager cm) {
		super(cm);
	}


}
