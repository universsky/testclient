package com.testclient.utils;

import java.net.URI;

import org.apache.http.client.methods.HttpEntityEnclosingRequestBase;

public class HttpDeleteEntityEnclosingRequest extends HttpEntityEnclosingRequestBase {

    public static final String METHOD_NAME = "DELETE";

    public String getMethod() {
        return METHOD_NAME;
    }

    public HttpDeleteEntityEnclosingRequest(final String uri) {
        super();
        setURI(URI.create(uri));
    }

    public HttpDeleteEntityEnclosingRequest(final URI uri) {
        super();
        setURI(uri);
    }

    public HttpDeleteEntityEnclosingRequest() {
        super();
    }


}
