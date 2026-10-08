package com.travelmind.trip;

import com.travelmind.common.DuplicateTripException;
import com.travelmind.common.TripLimits;
import com.travelmind.common.TripNotFoundException;
import com.travelmind.common.Validation;
import com.travelmind.common.ValidationException;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Trip rules live here; the repository just stores. Single class on purpose —
 * splitting into interface+impl buys nothing with one caller per method
 * (see the Spring structure guide in docs/style-guide.md).
 */
@Service
public class TripService {

    private final TripRepository trips;

    public TripService(TripRepository trips) {
        this.trips = trips;
    }

    @Transactional
    public Trip create(String ownerId, String name, LocalDate startsOn, LocalDate endsOn) {
        String cleanName = Validation.bounded(name, "trip name", TripLimits.MAX_TRIP_NAME);
        if (startsOn == null || endsOn == null) {
            throw new ValidationException("trip needs both a start and end date");
        }
        if (endsOn.isBefore(startsOn)) {
            throw new ValidationException("end date can't be before start date");
        }
        // Usually a typo (2026 vs 2062). Still allowed via raw SQL, just not via API.
        if (startsOn.plusYears(2).isBefore(endsOn)) {
            throw new ValidationException("trip longer than 2 years — check the years?");
        }
        if (trips.countByOwnerId(ownerId) >= TripLimits.MAX_SAVED_TRIPS_PER_USER) {
            throw new ValidationException(
                    "you've reached your limit of " + TripLimits.MAX_SAVED_TRIPS_PER_USER + " saved trips");
        }
        if (trips.existsByOwnerIdAndName(ownerId, cleanName)) {
            throw new DuplicateTripException(cleanName);
        }
        return trips.save(new Trip(ownerId, cleanName, startsOn, endsOn));
    }

    @Transactional(readOnly = true)
    public List<Trip> list(String ownerId) {
        return trips.findByOwnerIdOrderByStartsOnAsc(ownerId);
    }

    @Transactional(readOnly = true)
    public Trip get(String ownerId, UUID id) {
        // Same error for missing vs someone else's — don't leak which ids exist.
        return trips.findByIdAndOwnerId(id, ownerId).orElseThrow(() -> new TripNotFoundException(id.toString()));
    }

    @Transactional
    public void delete(String ownerId, UUID id) {
        Trip trip = get(ownerId, id);
        trips.delete(trip);
    }
}
