package com.bakasho.virtandroid;

import android.os.Bundle;
import android.os.Handler;
import android.os.ResultReceiver;

/**
 * Created by nathan on 4/10/15.
 */
public class VirtWSSSReceiver extends ResultReceiver {
    private Receiver _receiver;

    public VirtWSSSReceiver(Handler handler) {
        super(handler);
    }

    public void setReceiver(Receiver receiver) {
        _receiver = receiver;
    }

    public interface Receiver {
        public void onReceiveResult(int resultCode, Bundle resultData);
    }

    @Override
    protected void onReceiveResult(int resultCode, Bundle resultData) {
        if (_receiver != null) {
            _receiver.onReceiveResult(resultCode, resultData);
        }
    }
}
