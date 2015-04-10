package com.bakasho.virtandroid;

import android.app.Activity;
import android.content.Intent;
import android.os.Build;
import android.os.Bundle;
import android.util.Log;
import android.view.ViewGroup;

import com.bakasho.messenger.Callback;
import com.bakasho.messenger.Messenger;

import org.java_websocket.WebSocket;
import org.java_websocket.handshake.ClientHandshake;
import org.java_websocket.server.WebSocketServer;
import org.java_websocket.handshake.ServerHandshake;
import org.json.JSONException;
import org.json.JSONObject;

import java.net.InetSocketAddress;
import java.util.Collection;

public class VirtAndroidActivity extends Activity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        Intent intent = new Intent(this, VirtWSSService.class);
        intent.putExtra(VirtWSSService.START, 8888);

        final ViewGroup containerView = (ViewGroup) findViewById(android.R.id.content);
        setContentView(R.layout.activity_virt_android);

        startService(intent);
    }
}
