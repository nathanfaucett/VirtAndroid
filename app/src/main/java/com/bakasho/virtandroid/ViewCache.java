package com.bakasho.virtandroid;

import android.util.Log;
import android.view.View;

import java.util.HashMap;
import java.util.Map;

/**
 * Created by nathan on 4/6/15.
 */
public class ViewCache {
    private static final Map<String, View> _views = new HashMap<>();

    public static View get(String id) {
        if (_views.containsKey(id)) {
            return _views.get(id);
        } else {
            return null;
        }
    }

    public static View set(String id, View view) {
        return _views.put(id, view);
    }
}
