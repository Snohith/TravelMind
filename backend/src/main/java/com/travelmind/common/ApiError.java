package com.travelmind.common;

import java.time.Instant;

/**
 * What the API sends back on errors. Code is stable (TRIP_NOT_FOUND),
 * message is human, never a stack trace or absolute path.
 */
public record ApiError(String code, String message, String path, Instant timestamp) {

    public static ApiError of(String code, String message, String path) {
        return new ApiError(code, message, path, Instant.now());
    }
}
