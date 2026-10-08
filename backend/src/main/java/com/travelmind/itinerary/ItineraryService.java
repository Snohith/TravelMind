package com.travelmind.itinerary;

import com.travelmind.common.TripLimits;
import com.travelmind.common.Validation;
import com.travelmind.common.ValidationException;
import com.travelmind.trip.Trip;
import com.travelmind.trip.TripService;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Day-by-day view plus the fiddly bits (duration parsing, overlap checks).
 * Duration caps at 24h per stop; overnight legs still sit on the start day
 * until we model legs properly — same wart as ever, tracked in the glossary.
 */
@Service
public class ItineraryService {

    private static final Logger log = LoggerFactory.getLogger(ItineraryService.class);

    // Day view scrolls badly past ~12 stops on a phone (checked on a Pixel 6a).
    static final int MAX_STOPS_PER_DAY = 12;

    private final TripService trips;
    private final StopRepository stops;

    public ItineraryService(TripService trips, StopRepository stops) {
        this.trips = trips;
        this.stops = stops;
    }

    @Transactional
    public Stop addStop(String ownerId, UUID tripId, LocalDate day, String place, LocalTime startsAt, String lengthText) {
        Trip trip = trips.get(ownerId, tripId);
        int minutes = parseLength(lengthText);
        String cleanPlace = Validation.bounded(place, "place", TripLimits.MAX_PLACE);

        if (day.isBefore(trip.startsOn()) || day.isAfter(trip.endsOn())) {
            throw new ValidationException(
                    day + " is outside " + trip.name() + " (" + trip.startsOn() + " to " + trip.endsOn() + ")");
        }

        List<Stop> existing = stopsOn(tripId, day);
        LocalTime endsAt = startsAt.plusMinutes(minutes);
        for (Stop s : existing) {
            if (s.startsAt().isBefore(endsAt) && startsAt.isBefore(s.endsAt())) {
                throw new ValidationException(
                        "'" + cleanPlace + "' overlaps '" + s.place() + "' (" + s.startsAt() + "-" + s.endsAt() + ")");
            }
        }
        if (existing.size() + 1 > MAX_STOPS_PER_DAY) {
            // Warn, don't block — a wedding itinerary once had 15 stops and they were right.
            log.info("trip '{}' has {} stops on {} (over soft limit {})",
                    trip.name(), existing.size() + 1, day, MAX_STOPS_PER_DAY);
        }
        return stops.save(new Stop(tripId, day, cleanPlace, startsAt, minutes));
    }

    @Transactional(readOnly = true)
    public List<DayResponse> daysFor(String ownerId, UUID tripId) {
        trips.get(ownerId, tripId); // ownership check first so ids don't leak
        Map<LocalDate, List<Stop>> byDay = new TreeMap<>();
        for (Stop s : stops.findByTripIdOrderByDayAscStartsAtAsc(tripId)) {
            byDay.computeIfAbsent(s.day(), d -> new ArrayList<>()).add(s);
        }
        List<DayResponse> days = new ArrayList<>();
        for (Map.Entry<LocalDate, List<Stop>> e : byDay.entrySet()) {
            List<DayResponse.StopResponse> out = e.getValue().stream()
                    .sorted(Comparator.comparing(Stop::startsAt))
                    .map(s -> new DayResponse.StopResponse(s.id(), s.place(), s.startsAt(), s.minutes()))
                    .toList();
            int total = out.stream().mapToInt(DayResponse.StopResponse::minutes).sum();
            days.add(new DayResponse(e.getKey(), out, total));
        }
        return days;
    }

    private List<Stop> stopsOn(UUID tripId, LocalDate day) {
        List<Stop> out = new ArrayList<>();
        for (Stop s : stops.findByTripIdOrderByDayAscStartsAtAsc(tripId)) {
            if (s.day().equals(day)) {
                out.add(s);
            }
        }
        return out;
    }

    /** Accepts "2h", "90m", "1h30m". Permissive on purpose — people type fast on phones. */
    int parseLength(String text) {
        if (text == null) {
            throw new ValidationException("duration is required, e.g. 2h or 90m");
        }
        String t = text.trim().toLowerCase();
        if (t.isEmpty() || t.length() > 16) {
            throw new ValidationException("couldn't understand duration '" + text + "' — try 2h, 90m, or 1h30m");
        }
        try {
            long total;
            if (t.endsWith("h") && !t.contains("m")) {
                total = Math.multiplyExact(Long.parseLong(t.substring(0, t.length() - 1).trim()), 60);
            } else {
                total = 0;
                int hIndex = t.indexOf('h');
                int mIndex = t.indexOf('m');
                if (hIndex < 0 && mIndex < 0) {
                    throw new ValidationException("couldn't understand duration '" + text + "' — try 2h, 90m, or 1h30m");
                }
                if (hIndex > 0) {
                    total = Math.addExact(total, Math.multiplyExact(Long.parseLong(t.substring(0, hIndex).trim()), 60));
                } else if (hIndex == 0) {
                    throw new ValidationException("couldn't understand duration '" + text + "' — try 2h, 90m, or 1h30m");
                }
                if (mIndex > 0) {
                    String mins = t.substring(hIndex > 0 ? hIndex + 1 : 0, mIndex).trim();
                    if (!mins.isEmpty()) {
                        total = Math.addExact(total, Long.parseLong(mins));
                    }
                }
            }
            if (total <= 0 || total > TripLimits.MAX_MINUTES_PER_STOP) {
                throw new ValidationException("duration must be 1m–24h, got: " + text);
            }
            return (int) total;
        } catch (NumberFormatException | ArithmeticException e) {
            throw new ValidationException("couldn't understand duration '" + text + "' — try 2h, 90m, or 1h30m", e);
        }
    }
}
