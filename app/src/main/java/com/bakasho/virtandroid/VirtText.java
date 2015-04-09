package com.bakasho.virtandroid;

import android.content.Context;
import android.view.View;
import android.widget.LinearLayout;
import android.widget.TextView;

import org.json.JSONObject;

/**
 * Created by nathan on 4/8/15.
 */
public class VirtText extends TextView {

    public VirtText(Context context, String id, JSONObject props, String text) {
        super(context);

        ViewCache.set(id, (View) this);

        setText(text);
        setLayoutParams(new LinearLayout.LayoutParams(LinearLayout.LayoutParams.WRAP_CONTENT, LinearLayout.LayoutParams.WRAP_CONTENT));
    }

    public void setProps(JSONObject props) {

    }
}
