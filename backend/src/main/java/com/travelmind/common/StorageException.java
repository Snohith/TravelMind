package com.travelmind.common;

/**
 * Something broke reading/writing trip files. Message stays generic on purpose —
 * the cause has the path details for logs, but callers shouldn't print those to users.
 */
public class StorageException extends AppException {

    public StorageException(String message, Throwable cause) {
        super("STORAGE_ERROR", message, cause);
    }
}
