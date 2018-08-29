package com.puxintech.chengfu.company.leave;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.puxintech.chengfu.core.web.QueryParamsController;

@RestController
@RequestMapping("/leave")
public class LeaveController extends QueryParamsController<LeaveEntityQueryParams, LeaveEntity, Integer> {
	
	public LeaveController(LeaveManager rm) {
		super(rm);
	}

}
