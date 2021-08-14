package com.immortalcrab.warriors.applications;

import io.vertx.ext.web.Route;

public class DocumentFinder {

    public static void hello(Route router) {

        router.handler(req -> {
            req.response()
                    .putHeader("content-type", "text/plain")
                    .end("Hello road warriors from vert.x!!!");
        });
    }

}
