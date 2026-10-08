package com.travelmind.trip;

import java.time.LocalDate;
import java.util.UUID;

/** What the API sends back. No owner internals, no JPA proxies. */
public record TripResponse(UUID id, String name, LocalDate startsOn, LocalDate endsOn) {

    public static TripResponse from(Trip trip) {
        return new TripResponse(trip.id(), trip.name(), trip.startsOn(), trip.endsOn());
    }
}
