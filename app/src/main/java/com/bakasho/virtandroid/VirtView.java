package com.bakasho.virtandroid;

import android.content.Context;
import android.util.Log;
import android.view.View;
import android.widget.LinearLayout;

import org.json.JSONObject;

/**
 * Created by nathan on 4/8/15.
 */
public class VirtView extends LinearLayout {

    public VirtView(Context context, String id, JSONObject props) {
        super(context);

        ViewCache.set(id, (View) this);

        setOrientation(LinearLayout.VERTICAL);
        setLayoutParams(new LinearLayout.LayoutParams(LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.WRAP_CONTENT));

        setProps(props);
    }

    public void setProps(JSONObject props) {
        try {
            if (props.has("orientation")) {
                setPropOrientation(props.getString("orientation"));
            }
        } catch (Exception e) {
            Log.e("VirtAndroidActivity", "Exception", e);
        }
    }

    public void setPropOrientation(String orientation) {
        if (orientation != null) {
            if (orientation == "horizontal") {
                setOrientation(LinearLayout.HORIZONTAL);
            } else {
                setOrientation(LinearLayout.VERTICAL);
            }
        }
    }
}
