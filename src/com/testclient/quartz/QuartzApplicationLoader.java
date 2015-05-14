package com.testclient.quartz;

import org.apache.log4j.Logger;
import org.quartz.Scheduler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationListener;
import org.springframework.context.event.ContextRefreshedEvent;

public class QuartzApplicationLoader implements ApplicationListener<ContextRefreshedEvent> {
	@Autowired
	QuartzScheduleMgrService quartzScheduleMgrService;

	@Override
	public void onApplicationEvent(ContextRefreshedEvent event) {
		quartzScheduleMgrService.onApplicationEvent(event);
	}
}
