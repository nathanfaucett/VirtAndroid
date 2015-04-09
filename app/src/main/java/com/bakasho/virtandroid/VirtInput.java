package com.bakasho.virtandroid;

import android.content.Context;
import android.view.View;
import android.widget.EditText;
import android.widget.LinearLayout;

import org.json.JSONObject;

/**
 * Created by nathan on 4/8/15.
 */
public class VirtInput extends EditText {

    public VirtInput(Context context, String id, JSONObject props) {
        super(context);

        ViewCache.set(id, (View) this);

        setLayoutParams(new LinearLayout.LayoutParams(LinearLayout.LayoutParams.WRAP_CONTENT, LinearLayout.LayoutParams.WRAP_CONTENT));
    }

    public void setProps(JSONObject props) {

    }
}
