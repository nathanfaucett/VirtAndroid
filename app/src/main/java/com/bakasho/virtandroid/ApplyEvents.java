package com.bakasho.virtandroid;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

/**
 * Created by nathan on 4/6/15.
 */
public class ApplyEvents {
    public static void call(JSONObject events, boolean remove) throws JSONException {
        if (events != null) {
            JSONArray keys = events.names();

            if (keys != null) {
                if (remove == true) {
                    ApplyEvents.add(keys, events);
                } else {
                    ApplyEvents.remove(keys, events);
                }
            }
        }
    }

    private static void add(JSONArray keys, JSONObject events) throws JSONException {
        for (int i = 0, il = keys.length(); i < il; i++) {
            String id = keys.getString(i);
        }
    }

    private static void remove(JSONArray keys, JSONObject events) throws JSONException {
        for (int i = 0, il = keys.length(); i < il; i++) {
            String id = keys.getString(i);
        }
    }
}
