package com.bakasho.virtandroid;

import android.util.Log;
import android.view.View;
import android.view.ViewGroup;

import org.json.JSONException;
import org.json.JSONObject;

/**
 * Created by nathan on 4/6/15.
 */
public class ApplyTransaction {
    public static void call(JSONObject transaction, ViewGroup containerView) throws JSONException {
        ApplyPatches.call((JSONObject)transaction.get("patches"), containerView);
        ApplyEvents.call((JSONObject)transaction.get("events"), false);
        ApplyEvents.call((JSONObject)transaction.get("eventsRemove"), true);
        ApplyPatches.call((JSONObject)transaction.get("removes"), containerView);
    }
}
