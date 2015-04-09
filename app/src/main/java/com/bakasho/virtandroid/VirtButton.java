package com.bakasho.virtandroid;

import android.content.Context;
import android.view.View;
import android.widget.Button;
import android.widget.LinearLayout;

import org.json.JSONObject;

/**
 * Created by nathan on 4/8/15.
 */
public class VirtButton extends Button {

    public VirtButton(Context context, String id, JSONObject props, String text) {
        super(context);

        ViewCache.set(id, (View) this);

        setText(text);
        setLayoutParams(new LinearLayout.LayoutParams(LinearLayout.LayoutParams.WRAP_CONTENT, LinearLayout.LayoutParams.WRAP_CONTENT));
    }

    public void setProps(JSONObject props) {

    }
}
