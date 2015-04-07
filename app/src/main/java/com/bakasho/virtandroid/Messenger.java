package com.bakasho.virtandroid;

import android.webkit.JavascriptInterface;
import android.webkit.WebView;

import org.json.JSONException;
import org.json.JSONObject;
import org.json.JSONStringer;

import java.util.ArrayList;
import java.util.HashMap;

/**
 * Created by nathan on 4/6/15.
 */
public class Messenger {
    public interface Callback{
        public void call(JSONObject data);
    }

    private int _MESSAGE_ID = 0;
    private HashMap<Integer, Callback> _callbacks;
    private HashMap<String, ArrayList<Callback>> _listeners;

    public Messenger() {
        _callbacks = new HashMap<Integer, Callback>();
        _listeners = new HashMap<String, ArrayList<Callback>>();
    }

    public void postMessage(String data) {}

    public void onMessage(String data) throws JSONException {
        JSONObject message = new JSONObject(data);
        int id = (int) message.get("id");

        if (message.isNull("name")) {
            if (_callbacks.containsKey(id)) {
                _callbacks.get(id).call((JSONObject) message.get("data"));
                _callbacks.remove(id);
            }
        } else {
            String name = (String) message.get("name");

            if (_listeners.containsKey(name)) {
                JSONObject json = _emit((JSONObject) message.get("data"), _listeners.get(name));

                postMessage(
                    "{" +
                        "\"id\": "+ id +"," +
                        "\"data\": "+ json.toString() +
                    "}"
                );
            }
        }
    }

    public void emit(String name, JSONObject data, Callback callback) throws JSONException {
        Integer id = new Integer(_MESSAGE_ID++);

        if (callback != null) {
            _callbacks.put(id, callback);
        }

        postMessage(
            "{" +
                "\"id\": "+ id +"," +
                "\"name\": \""+ name +"\"," +
                "\"data\": "+ data.toString() +
            "}"
        );
    }

    public void on(String name, Callback callback) {
        if (callback != null) {
            ArrayList<Callback> listenerCallbacks;

            if (_listeners.containsKey(name) == false) {
                listenerCallbacks = new ArrayList<Callback>();
                _listeners.put(name, listenerCallbacks);
            } else {
                listenerCallbacks = _listeners.get(name);
            }

            listenerCallbacks.add(callback);
        }
    }

    public void off(String name, Callback callback) {
        if (callback != null) {
            ArrayList<Callback> listenerCallbacks;

            if (_listeners.containsKey(name) != false) {
                listenerCallbacks = _listeners.get(name);
                int i = listenerCallbacks.size();

                while (i-- != 0) {
                    if (listenerCallbacks.get(i) == callback) {
                        listenerCallbacks.remove(i);
                    }
                }
            }
        }
    }

    private JSONObject _emit(JSONObject data, ArrayList<Callback> listenerCallbacks) {
        JSONObject newData = data;
        Callback listenerCallback;

        for (int i = 0, il = listenerCallbacks.size(); i < il; i++) {
            listenerCallbacks.get(i).call(newData);
        }

        return newData;
    }
}
