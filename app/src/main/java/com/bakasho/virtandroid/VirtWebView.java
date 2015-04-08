package com.bakasho.virtandroid;

import android.app.Activity;
import android.content.Context;
import android.util.AttributeSet;
import android.util.Log;
import android.webkit.JavascriptInterface;
import android.webkit.WebView;

import com.bakasho.messenger.Messenger;

import org.json.JSONException;

/**
 * Created by nathan on 4/8/15.
 */
public class VirtWebView extends WebView {
    private Activity _activity;

    final public Messenger messenger = new Messenger() {
        @Override
        public void postMessage(String data) {
            final String finalData = data;

            _activity.runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    loadUrl("javascript:(__onAndroidMessage__('" + finalData + "'))");
                }
            });
        }
    };

    public VirtWebView(Activity activity) {
        super((Context) activity);
        _onCreate(activity);
    }
    public VirtWebView(Activity activity, AttributeSet attrs) {
        super((Context) activity, attrs);
        _onCreate(activity);
    }
    public VirtWebView(Activity activity, AttributeSet attrs, int style) {
        super((Context) activity, attrs, style);
        _onCreate(activity);
    }
    public VirtWebView(Activity activity, AttributeSet attrs, int style, boolean privateBrowsing) {
        super((Context) activity, attrs, style, privateBrowsing);
        _onCreate(activity);
    }

    private void _onCreate(Activity activity) {
        _activity = activity;
        getSettings().setJavaScriptEnabled(true);
        addJavascriptInterface(new JSInterface(), "__android__");
    }

    private class JSInterface {
        @JavascriptInterface
        public void postMessage(String data) {
            final String finalData = data;

            _activity.runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    try {
                        messenger.onMessage(finalData);
                    } catch (Exception e) {
                        Log.e(_activity.getClass().getSimpleName(), "Exception", e);
                    }
                }
            });
        }
    }
}
