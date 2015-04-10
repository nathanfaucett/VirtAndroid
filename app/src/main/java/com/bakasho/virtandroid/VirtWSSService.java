package com.bakasho.virtandroid;

import android.app.IntentService;
import android.content.Intent;
import android.support.v4.content.LocalBroadcastManager;
import android.util.Log;

import org.java_websocket.WebSocket;
import org.java_websocket.handshake.ClientHandshake;
import org.java_websocket.server.WebSocketServer;

import java.net.InetSocketAddress;
import java.util.Collection;

/**
 * Created by nathan on 4/10/15.
 */
public class VirtWSSService extends IntentService {
    public static final String ON_MESSAGE = "com.bakasho.virtandroid.VirtWSSService.ON_MESSAGE";
    public static final String START = "com.bakasho.virtandroid.VirtWSSService.START";
    public static final String DATA = "com.bakasho.virtandroid.VirtWSSService.DATA";

    private WebSocketServer _webSocketServer;

    public VirtWSSService() {
        super(VirtWSSService.class.getName());
    }

    @Override
    protected void onHandleIntent(Intent intent) {
        String data = intent.getDataString();

        Collection<WebSocket> con = _webSocketServer.connections();
        synchronized (con) {
            for (WebSocket c : con) {
                c.send(data);
            }
        }
    }

    public void openWebSocket(int port, String host) {
        if (_webSocketServer == null) {
            final VirtWSSService _this = this;

            _webSocketServer = new WebSocketServer(new InetSocketAddress(host, port)) {
                @Override
                public void onOpen(WebSocket webSocket, ClientHandshake clientHandshake) {
                    Log.i("VirtAndroidActivity", "Opened");
                }

                @Override
                public void onClose(WebSocket webSocket, int i, String s, boolean b) {
                    Log.i("VirtAndroidActivity", "Close " + Integer.toString(i) + " " + s + " " + Boolean.toString(b));
                }

                @Override
                public void onMessage(WebSocket webSocket, String s) {
                    Intent intent = new Intent(ON_MESSAGE);
                    intent.putExtra(DATA, s);
                    LocalBroadcastManager.getInstance(_this).sendBroadcast(intent);
                }

                @Override
                public void onError(WebSocket webSocket, Exception e) {
                    Log.e("VirtAndroidActivity", "Exception", e);
                }
            };

            _webSocketServer.run();
        }
    }

    public void openWebSocket(int port) {
        openWebSocket(port, "127.0.0.1");
    }
}
