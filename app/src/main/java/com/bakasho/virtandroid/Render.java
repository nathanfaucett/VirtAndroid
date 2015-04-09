package com.bakasho.virtandroid;

import android.content.Context;
import android.view.View;
import android.view.ViewGroup;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;

/**
 * Created by nathan on 4/6/15.
 */
public class Render {
    private static final JSONObject emptyProps = new JSONObject();

    public static View call(JSONObject view, String id, Context context) throws JSONException {
        return Render.render(view, emptyProps, id, context);
    }

    public static ArrayList<View> call(JSONArray children, JSONObject parentProps, String id, Context context) throws JSONException {
        ArrayList<View> childrenArray = new ArrayList<View>();

        for (int i = 0, il = children.length(); i < il; i++) {
            Object child = children.get(i);

            if (child instanceof JSONObject) {
                JSONObject view = (JSONObject)child;
                childrenArray.add(Render.render(view, parentProps, Id.getChildKey(id, view, i), context));
            } else if (child instanceof Double) {
                childrenArray.add(new VirtText(context, id, parentProps, Double.toString((Double) child)));
            } else if (child instanceof String) {
                childrenArray.add(new VirtText(context, id, parentProps, (String) child));
            }
        }

        return childrenArray;
    }

    private static View render(JSONObject view, JSONObject parentProps, String id, Context context) throws JSONException {
        String type = (String) view.get("type");
        JSONObject props = (JSONObject) view.get("props");
        JSONArray children = (JSONArray)view.get("children");

        switch (type) {
            case "View":
                return createView(context, id, props, children);
            case "TextView":
                return new VirtText(context, id, props, (String) children.get(0));
            case "Button":
                return new VirtButton(context, id, props, (String) children.get(0));
            case "Input":
                return new VirtInput(context, id, props);
            default:
                throw new JSONException("invalid view type " + type);
        }
    }

    private static ViewGroup createView(Context context, String id, JSONObject props, JSONArray children) throws JSONException {
        ArrayList<View> viewChildren = Render.call(children, props, id, context);

        VirtView view = new VirtView(context, id, props);

        for (int i = 0, il = viewChildren.size(); i < il; i++) {
            view.addView(viewChildren.get(i));
        }

        return view;
    }
}
