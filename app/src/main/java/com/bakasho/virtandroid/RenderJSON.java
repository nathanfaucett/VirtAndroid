package com.bakasho.virtandroid;

import android.content.Context;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.TextView;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;

/**
 * Created by nathan on 4/6/15.
 */
public class RenderJSON {
    private static final JSONObject emptyProps = new JSONObject();

    public static View call(JSONObject view, String id, Context context) throws JSONException {
        return RenderJSON.render(view, emptyProps, id, context);
    }

    public static ArrayList<View> call(JSONArray children, JSONObject parentProps, String id, Context context) throws JSONException {
        ArrayList<View> childrenArray = new ArrayList<View>();

        for (int i = 0, il = children.length(); i < il; i++) {
            Object child;
            child = children.get(i);

            if (child instanceof JSONObject) {
                JSONObject view = (JSONObject)child;
                childrenArray.add(RenderJSON.render(view, parentProps, Id.getChildKey(id, view, i), context));
            } else if (child instanceof Double) {
                childrenArray.add(RenderJSON.createTextView(Double.toString((Double) child), context));
            } else if (child instanceof String) {
                childrenArray.add(RenderJSON.createTextView((String) child, context));
            }
        }

        return childrenArray;
    }

    private static View render(JSONObject view, JSONObject parentProps, String id, Context context) throws JSONException {
        switch ((String) view.get("type")) {
            case "LinearLayout":
                return createLinearLayout(id, (JSONObject)view.get("props"), (JSONArray)view.get("children"), context);
            case "Button":
                return createButton((String) ((JSONArray) view.get("children")).get(0), context);
            case "EditText":
                return createEditText(context);
            default:
                return createTextView("", context);
        }
    }

    private static TextView createTextView(String text, Context context) {
        TextView textView = new TextView(context);
        textView.setText(text);
        textView.setLayoutParams(new LinearLayout.LayoutParams(LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.WRAP_CONTENT));
        return textView;
    }

    private static Button createButton(String text, Context context) {
        Button button = new Button(context);
        button.setText(text);
        button.setLayoutParams(new LinearLayout.LayoutParams(LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.WRAP_CONTENT));
        return button;
    }

    private static EditText createEditText(Context context) {
        EditText editText = new EditText(context);
        editText.setLayoutParams(new LinearLayout.LayoutParams(LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.WRAP_CONTENT));
        return editText;
    }

    private static ViewGroup createLinearLayout(String id, JSONObject props, JSONArray children, Context context) throws JSONException {
        LinearLayout layout = new LinearLayout(context);

        layout.setLayoutParams(new LinearLayout.LayoutParams(LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.WRAP_CONTENT));
        layout.setOrientation(LinearLayout.VERTICAL);

        ArrayList<View> viewChildren = RenderJSON.call(children, props, id, context);

        for (int i = 0, il = viewChildren.size(); i < il; i++) {
            layout.addView(viewChildren.get(i));
        }

        return layout;
    }
}
