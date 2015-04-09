package com.bakasho.virtandroid;

import android.util.Log;
import android.util.Xml;
import android.view.InflateException;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import org.json.JSONException;
import org.json.JSONObject;
import org.xmlpull.v1.XmlPullParser;
import org.xmlpull.v1.XmlPullParserException;

import java.io.StringReader;

/**
 * Created by nathan on 4/6/15.
 */
public class ApplyPatch {
    public static void call(JSONObject patch, String id, ViewGroup containerView) throws JSONException {
        switch ((String)patch.get("type")) {
            case Consts.REMOVE:
                ApplyPatch.remove(patch, id);
                break;
            case Consts.MOUNT:
                ApplyPatch.mount((JSONObject)patch.get("next"), id, containerView);
                break;
            case Consts.UNMOUNT:
                ApplyPatch.unmount(id, containerView);
                break;
            case Consts.INSERT:
                ApplyPatch.insert(patch, id);
                break;
            case Consts.TEXT:
                ApplyPatch.text(patch, id);
                break;
            case Consts.REPLACE:
                ApplyPatch.replace(patch, id);
                break;
            case Consts.ORDER:
                ApplyPatch.order(patch, id);
                break;
            case Consts.PROPS:
                ApplyPatch.props(patch, id);
                break;
        }
    }

    private static void remove(JSONObject patch, String id) {}

    private static void mount(JSONObject next, String id, ViewGroup containerView) throws JSONException {
        View view = Render.call(next, id, containerView.getContext());

        if (view != null) {
            containerView.addView(view);
        }
    }

    private static void unmount(String id, ViewGroup containerView) {}

    private static void insert(JSONObject patch, String id) {}

    private static void text(JSONObject patch, String id) {}

    private static void replace(JSONObject patch, String id) {}

    private static void order(JSONObject patch, String id) {}

    private static void props(JSONObject patch, String id) {}
}
