package com.travelmind.itinerary;

import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/trips/{tripId}")
public class StopController {

    private final ItineraryService itinerary;

    public StopController(ItineraryService itinerary) {
        this.itinerary = itinerary;
    }

    @PostMapping("/stops")
    @ResponseStatus(HttpStatus.CREATED)
    public DayResponse.StopResponse addStop(
            @RequestHeader("X-User-Id") String ownerId,
            @PathVariable UUID tripId,
            @Valid @RequestBody CreateStopRequest body) {
        Stop saved = itinerary.addStop(ownerId, tripId, body.day(), body.place(), body.startsAt(), body.length());
        return new DayResponse.StopResponse(saved.id(), saved.place(), saved.startsAt(), saved.minutes());
    }

    @GetMapping("/days")
    public List<DayResponse> days(
            @RequestHeader("X-User-Id") String ownerId,
            @PathVariable UUID tripId) {
        return itinerary.daysFor(ownerId, tripId);
    }
}
