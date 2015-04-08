package com.bakasho.virtandroid;

import android.app.Activity;
import android.os.Bundle;
import android.util.Log;
import android.view.ViewGroup;

import com.bakasho.messenger.Callback;

import org.json.JSONObject;

public class VirtAndroidActivity extends Activity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        final ViewGroup containerView = (ViewGroup) findViewById(android.R.id.content);

        VirtWebView webView = new VirtWebView(this);
        webView.messenger.on("__AndroidAdaptor:handleTransaction__", new Callback() {
            @Override
            public void call(JSONObject data, Callback next) {
                try {
                    ApplyTransaction.call(data, containerView);
                } catch (Exception e) {
                    Log.e("VirtAndroidActivity", "Exception", e);
                }
                next.call(null);
            }
        });

        webView.loadUrl("file:///android_asset/index.html");

        setContentView(R.layout.activity_virt_android);
    }
}
