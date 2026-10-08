package com.travelmind.itinerary;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;

/** One date plus its stops in time order. Derived for the response, not stored. */
public record DayResponse(LocalDate date, List<StopResponse> stops, int totalMinutes) {

    public record StopResponse(UUID id, String place, LocalTime startsAt, int minutes) {
    }
}
