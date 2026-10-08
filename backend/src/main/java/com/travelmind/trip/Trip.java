package com.travelmind.trip;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import java.time.LocalDate;
import java.util.UUID;

/**
 * A trip is the whole journey: name + date range. Stops and expenses hang off
 * it via trip_id (separate tables so one fat trip doesn't drag the list view).
 * Owner is a plain id for now — in prod it's the Supabase user id passed by
 * the frontend's server layer, not something clients can mint (see controller).
 */
@Entity
@Table(name = "trips", uniqueConstraints = @UniqueConstraint(columnNames = {"owner_id", "name"}))
public class Trip {

    @Id
    private UUID id = UUID.randomUUID();

    @Column(name = "owner_id", nullable = false)
    private String ownerId;

    @Column(nullable = false, length = 80)
    private String name;

    @Column(name = "starts_on", nullable = false)
    private LocalDate startsOn;

    @Column(name = "ends_on", nullable = false)
    private LocalDate endsOn;

    protected Trip() {
        // jpa
    }

    public Trip(String ownerId, String name, LocalDate startsOn, LocalDate endsOn) {
        this.ownerId = ownerId;
        this.name = name;
        this.startsOn = startsOn;
        this.endsOn = endsOn;
    }

    public UUID id() {
        return id;
    }

    public String ownerId() {
        return ownerId;
    }

    public String name() {
        return name;
    }

    public LocalDate startsOn() {
        return startsOn;
    }

    public LocalDate endsOn() {
        return endsOn;
    }

    public void rename(String name) {
        this.name = name;
    }
}
