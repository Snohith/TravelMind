package com.travelmind.trip;

import jakarta.validation.Valid;
import java.net.URI;
import java.util.List;
import java.util.UUID;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Trip endpoints. Owner comes from a header in dev; in front of the real
 * frontend the Next.js server layer sets it from the Supabase session —
 * browsers never mint it directly (that's enforced there, not here).
 */
@RestController
@RequestMapping("/api/v1/trips")
public class TripController {

    private final TripService trips;

    public TripController(TripService trips) {
        this.trips = trips;
    }

    @PostMapping
    public ResponseEntity<TripResponse> create(
            @RequestHeader("X-User-Id") String ownerId,
            @Valid @RequestBody CreateTripRequest body) {
        Trip saved = trips.create(ownerId, body.name(), body.startsOn(), body.endsOn());
        return ResponseEntity.created(URI.create("/api/v1/trips/" + saved.id()))
                .body(TripResponse.from(saved));
    }

    @GetMapping
    public List<TripResponse> list(@RequestHeader("X-User-Id") String ownerId) {
        return trips.list(ownerId).stream().map(TripResponse::from).toList();
    }

    @GetMapping("/{id}")
    public TripResponse get(
            @RequestHeader("X-User-Id") String ownerId,
            @PathVariable UUID id) {
        return TripResponse.from(trips.get(ownerId, id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @RequestHeader("X-User-Id") String ownerId,
            @PathVariable UUID id) {
        trips.delete(ownerId, id);
        return ResponseEntity.noContent().build();
    }
}
