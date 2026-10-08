package com.travelmind.common;

import java.time.LocalDate;
import java.time.format.DateTimeParseException;

/** Tiny guards so domain classes don't repeat the same null/blank checks. */
public final class Validation {

    private Validation() {
        // no instances
    }

    public static String notBlank(String value, String field) {
        if (value == null || value.trim().isEmpty()) {
            throw new ValidationException(field + " must not be blank");
        }
        return value.trim();
    }

    public static String bounded(String value, String field, int max) {
        String clean = notBlank(value, field);
        if (clean.length() > max) {
            throw new ValidationException(field + " too long (max " + max + " chars)");
        }
        // Control chars sneak in via copy-paste and break rendered tables + JSON logs.
        for (int i = 0; i < clean.length(); i++) {
            if (Character.isISOControl(clean.charAt(i)) && clean.charAt(i) != '\t') {
                throw new ValidationException(field + " has an odd control character — try retyping it");
            }
        }
        return clean;
    }

    public static LocalDate parseDate(String iso, String field) {
        try {
            return LocalDate.parse(notBlank(iso, field));
        } catch (DateTimeParseException e) {
            throw new ValidationException(field + " must look like 2026-11-14, got: " + iso, e);
        }
    }
}
