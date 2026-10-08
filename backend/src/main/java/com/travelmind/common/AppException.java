package com.travelmind.common;

/**
 * Base for request failures with a stable machine-readable code.
 * The handler maps by code(), not by class, so messages stay safe
 * to show while causes stay in the logs.
 */
public class AppException extends RuntimeException {

    private final String code;

    protected AppException(String code, String message) {
        super(message);
        this.code = code;
    }

    protected AppException(String code, String message, Throwable cause) {
        super(message, cause);
        this.code = code;
    }

    public String code() {
        return code;
    }
}
