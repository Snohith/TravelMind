package com.travelmind.itinerary;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

/**
 * One visit on one day: place + start + how long. Minutes, not an interval —
 * "2h"/"90m" parsing lives in the service so the DB stays dumb.
 */
@Entity
@Table(name = "stops")
public class Stop {

    @Id
    private UUID id = UUID.randomUUID();

    @Column(name = "trip_id", nullable = false)
    private UUID tripId;

    @Column(name = "stop_day", nullable = false)
    private LocalDate day;

    @Column(nullable = false, length = 120)
    private String place;

    @Column(name = "starts_at", nullable = false)
    private LocalTime startsAt;

    @Column(nullable = false)
    private int minutes;

    protected Stop() {
    }

    public Stop(UUID tripId, LocalDate day, String place, LocalTime startsAt, int minutes) {
        this.tripId = tripId;
        this.day = day;
        this.place = place;
        this.startsAt = startsAt;
        this.minutes = minutes;
    }

    public UUID id() {
        return id;
    }

    public UUID tripId() {
        return tripId;
    }

    public LocalDate day() {
        return day;
    }

    public String place() {
        return place;
    }

    public LocalTime startsAt() {
        return startsAt;
    }

    public int minutes() {
        return minutes;
    }

    public LocalTime endsAt() {
        return startsAt.plusMinutes(minutes);
    }
}
