package com.travelmind.common;

/** Input failed validation. Message is safe to show the user as-is. */
public class ValidationException extends AppException {

    public ValidationException(String message) {
        super("VALIDATION_FAILED", message);
    }

    public ValidationException(String message, Throwable cause) {
        super("VALIDATION_FAILED", message, cause);
    }
}
