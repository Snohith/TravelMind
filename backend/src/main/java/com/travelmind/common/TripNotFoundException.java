package com.travelmind.common;

/** No visible trip for this id. Message stays vague on purpose (see service). */
public class TripNotFoundException extends AppException {

    public TripNotFoundException(String id) {
        super("TRIP_NOT_FOUND", "trip not found");
    }
}
