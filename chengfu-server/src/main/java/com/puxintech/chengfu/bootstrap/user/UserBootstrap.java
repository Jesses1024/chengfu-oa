package com.puxintech.chengfu.bootstrap.user;

import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.InitializingBean;
import org.springframework.transaction.annotation.Transactional;

import com.puxintech.chengfu.bootstrap.user.UserConfig.UserInfo;
import com.puxintech.chengfu.group.GroupEntity;
import com.puxintech.chengfu.group.GroupManager;
import com.puxintech.chengfu.user.UserEntity;
import com.puxintech.chengfu.user.UserManager;

public class UserBootstrap implements InitializingBean {

	private final UserManager userManager;

	private final GroupManager groupManager;

	private final UserConfig userConfig;

	public UserBootstrap(UserManager userManager, GroupManager groupManager, UserConfig userConfig) {
		this.userManager = userManager;
		this.groupManager = groupManager;
		this.userConfig = userConfig;
	}

	@Override
	@Transactional
	public void afterPropertiesSet() throws Exception {
		initUsers();
	}

	private void initUsers() {
		Map<String, UserInfo> users = userConfig.getUsers();
		for (Map.Entry<String, UserInfo> entry : users.entrySet()) {
			UserInfo info = entry.getValue();
			String userName = entry.getKey();
			String password = info.getPassword();

			Optional<UserEntity> u = userManager.findByUserName(userName);

			if (!u.isPresent()) {
				UserEntity user = new UserEntity(userName, password);
				user.setPassword(password);
				user.setEnabled(true);
				user.setManager(true);
				user.setDisplayName(info.getDisplayName());
				user.setAvatar(info.getAvatar());

				GroupEntity group = this.getGroup(info.getGroup());
				user.setGroup(group);

				user = userManager.save(user);
			} else if (info.isOverride()) {
				UserEntity user = u.get();
				user.setDisplayName(info.getDisplayName());
				user.setAvatar(info.getAvatar());

				GroupEntity group = this.getGroup(info.getGroup());
				user.setGroup(group);

				userManager.changePassword(user.getId(), password);
			}
		}
	}

	private GroupEntity getGroup(String name) {
		String[] names = name.split("[|]");

		GroupEntity pGroup = null;
		for (int i = 0; i < names.length - 1; i++) {
			String gName = names[i];
			GroupEntity g = groupManager.getByName(gName);

			if (pGroup != null) {
				g.setParent(pGroup);
				g = groupManager.save(g);
			}
			pGroup = g;
		}

		String gName = names[names.length - 1];
		GroupEntity result = groupManager.getByName(gName);

		if (pGroup != null) {
			result.setParent(pGroup);
			return groupManager.save(result);
		}

		return result;
	}

}
