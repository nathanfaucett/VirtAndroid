package com.bakasho.virtandroid;

import android.util.Log;
import android.view.ViewGroup;
import android.widget.LinearLayout;

import java.util.HashMap;

/**
 * Created by nathan on 4/8/15.
 */
public class Params {
    static final HashMap<String, Integer> params = new HashMap<String, Integer>();

    static {
        params.put("match_parent", LinearLayout.LayoutParams.MATCH_PARENT);
        params.put("wrap_content", LinearLayout.LayoutParams.WRAP_CONTENT);
    }

    static int get(String key) {
        if (key != null) {
            if (params.containsKey(key)) {
                return params.get(key);
            } else {
                return Integer.MIN_VALUE;
            }
        } else {
            return Integer.MIN_VALUE;
        }
    }

    static boolean has(String key) {
        return params.containsKey(key);
    }
}
