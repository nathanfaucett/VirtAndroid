package com.bakasho.virtandroid;

import org.json.JSONException;
import org.json.JSONObject;

/**
 * Created by nathan on 4/6/15.
 */
public class Id {
    public static String getChildKey(String parentId, JSONObject view, int index) throws JSONException {
        if (view == null) {
            return parentId + "." + Integer.toString(index, 36);
        } else {
            return parentId + "." + Id.getViewKey(view, index);
        }
    }

    public static String getViewKey(JSONObject view, int index) throws JSONException {
        if (view == null) {
            return Integer.toString(index, 36);
        } else {
            if (view.isNull("key")) {
                return Integer.toString(index, 36);
            } else {
                return "$" + escapeKey((String)view.get("key"));
            }
        }
    }

    private static final String reEscape = "[=.:]";

    private static String escapeKey(String key) {
        return key.replaceAll(reEscape, "$");
    }
}
