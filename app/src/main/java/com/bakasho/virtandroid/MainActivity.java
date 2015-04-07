package com.bakasho.virtandroid;

import android.app.Activity;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.view.ViewGroup;
import android.webkit.JavascriptInterface;
import android.webkit.WebView;
import android.webkit.WebSettings;

import org.json.JSONException;
import org.json.JSONObject;


public class MainActivity extends Activity {

    private Messenger _messenger;
    private WebView _webView;

    private class _WebViewInterface {
        @JavascriptInterface
        public void postMessage(String data) throws JSONException {
            _messenger.onMessage(data);
        }

        @JavascriptInterface
        public void onMessage(String data) {}
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        final Activity _this = this;
        final ViewGroup containerView = (ViewGroup)findViewById(android.R.id.content);

        _webView = new WebView(this);
        _webView.addJavascriptInterface(new _WebViewInterface(), "android");

        _messenger = new Messenger() {
            @Override
            public void postMessage(String data) {
                final String finalData = data;

                _this.runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        _webView.loadUrl("javascript:(__onAndroidInterfaceMessage__('"+ finalData +"'));");
                    }
                });
            }
        };

        _messenger.on("__AndroidAdaptor:handleTransaction__", new Messenger.Callback() {
            @Override
            public void call(JSONObject data) {
                final JSONObject finalData = data;

                _this.runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        try {
                            ApplyTransaction.call(finalData, containerView);
                        } catch(Exception e) {
                            Log.e("MainActivity", "Exception", e);
                        }
                    }
                });
            }
        });

        WebSettings webSettings = _webView.getSettings();
        webSettings.setJavaScriptEnabled(true);
        _webView.clearHistory();
        _webView.clearFormData();
        _webView.clearCache(true);

        _webView.loadUrl("file:///android_asset/index.html");

        setContentView(R.layout.activity_main);
    }
}
