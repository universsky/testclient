package com.testclient.httpmodel;

import java.util.HashMap;
import java.util.Map;

public class MixActionSettingContainer {
	private Map<String,MixActionSettingInfo> mixActionSettings= new HashMap<String,MixActionSettingInfo>();

	public Map<String,MixActionSettingInfo> getMixActionSettings() {
		return mixActionSettings;
	}

	public void setMixActionSettings(Map<String,MixActionSettingInfo> mixActionSettings) {
		this.mixActionSettings = mixActionSettings;
	}

}
