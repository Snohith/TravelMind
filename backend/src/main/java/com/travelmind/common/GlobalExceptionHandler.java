package com.travelmind.common;

import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

/**
 * One place for error shape + status mapping. Bean-validation failures and
 * domain errors both land here as JSON with a stable code.
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(AppException.class)
    public ResponseEntity<ApiError> handleApp(AppException e, HttpServletRequest req) {
        HttpStatus status = switch (e.code()) {
            case "TRIP_NOT_FOUND" -> HttpStatus.NOT_FOUND;
            case "TRIP_EXISTS" -> HttpStatus.CONFLICT;
            case "STORAGE_ERROR" -> HttpStatus.INTERNAL_SERVER_ERROR;
            default -> HttpStatus.BAD_REQUEST;
        };
        if (status.is5xxServerError()) {
            log.error("request failed {}: {}", req.getRequestURI(), e.code(), e);
            return ResponseEntity.status(status)
                    .body(ApiError.of(e.code(), "something broke on our side", req.getRequestURI()));
        }
        return ResponseEntity.status(status)
                .body(ApiError.of(e.code(), e.getMessage(), req.getRequestURI()));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiError> handleValidation(MethodArgumentNotValidException e, HttpServletRequest req) {
        String first = e.getBindingResult().getFieldErrors().stream()
                .findFirst()
                .map(f -> f.getField() + " " + f.getDefaultMessage())
                .orElse("invalid request");
        return ResponseEntity.badRequest()
                .body(ApiError.of("VALIDATION_FAILED", first, req.getRequestURI()));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiError> handleUnexpected(Exception e, HttpServletRequest req) {
        log.error("unexpected error on {}", req.getRequestURI(), e);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiError.of("INTERNAL_ERROR", "something broke on our side", req.getRequestURI()));
    }
}
