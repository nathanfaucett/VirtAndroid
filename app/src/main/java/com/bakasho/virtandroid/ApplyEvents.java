package com.bakasho.virtandroid;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

/**
 * Created by nathan on 4/6/15.
 */
public class ApplyEvents {
    public static void call(JSONObject events, boolean remove) throws JSONException {
        JSONArray keys = events.names();

        if (events == null) {
            if (remove == true) {
                ApplyEvents.add(events);
            } else {
                ApplyEvents.remove(events);
            }
        }
    }

    private static void add(JSONObject events) throws JSONException {
        JSONArray keys = events.names();

        for (int i = 0, il = keys.length(); i < il; i++) {
            String id = keys.getString(i);
        }
    }

    private static void remove(JSONObject events) throws JSONException {
        JSONArray keys = events.names();

        for (int i = 0, il = keys.length(); i < il; i++) {
            String id = keys.getString(i);
        }
    }
}
