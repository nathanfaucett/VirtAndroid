package com.bakasho.virtandroid;

import android.util.Log;
import android.view.ViewGroup;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

/**
 * Created by nathan on 4/6/15.
 */
public class ApplyPatches {
    public static void call(JSONObject hash, ViewGroup containerView) throws JSONException {
        JSONArray keys = hash.names();

        if (keys != null) {
            for (int i = 0, il = keys.length(); i < il; i++) {
                String id = keys.getString(i);
                ApplyPatches.applyPatchIndices((JSONArray) hash.get(id), id, containerView);
            }
        }
    }

    private static void applyPatchIndices(JSONArray patchArray, String id, ViewGroup containerView) throws JSONException {
        for (int i = 0, il = patchArray.length(); i < il; i++) {
            ApplyPatch.call((JSONObject)patchArray.get(i), id, containerView);
        }
    }
}
