package com.travelmind.itinerary;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import com.travelmind.common.ValidationException;
import com.travelmind.trip.Trip;
import com.travelmind.trip.TripService;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

@SpringBootTest
@Transactional
class ItineraryServiceTest {

    @Autowired
    ItineraryService itinerary;

    @Autowired
    TripService trips;

    private UUID trip() {
        Trip t = trips.create("snohith", "Hampi weekend", LocalDate.parse("2026-11-14"), LocalDate.parse("2026-11-16"));
        return t.id();
    }

    @Test
    void sortsStopsAndGroupsByDay() {
        UUID id = trip();
        itinerary.addStop("snohith", id, LocalDate.parse("2026-11-14"), "Lunch", LocalTime.parse("13:00"), "1h");
        itinerary.addStop("snohith", id, LocalDate.parse("2026-11-14"), "Temple", LocalTime.parse("09:30"), "2h");

        List<DayResponse> days = itinerary.daysFor("snohith", id);

        assertThat(days).hasSize(1);
        assertThat(days.get(0).stops()).extracting(DayResponse.StopResponse::place)
                .containsExactly("Temple", "Lunch");
    }

    @Test
    void refusesOverlapsAndOutsideDays() {
        UUID id = trip();
        itinerary.addStop("snohith", id, LocalDate.parse("2026-11-14"), "Temple", LocalTime.parse("09:00"), "2h");

        assertThatThrownBy(() -> itinerary.addStop("snohith", id,
                LocalDate.parse("2026-11-14"), "Cafe", LocalTime.parse("10:00"), "1h"))
                .hasMessageContaining("overlaps");
        assertThatThrownBy(() -> itinerary.addStop("snohith", id,
                LocalDate.parse("2026-11-20"), "Nowhere", LocalTime.parse("09:00"), "1h"))
                .hasMessageContaining("outside");
    }

    @Test
    void parsesCommonDurationsAndRejectsAbsurd() {
        assertThat(itinerary.parseLength("2h")).isEqualTo(120);
        assertThat(itinerary.parseLength("1h30m")).isEqualTo(90);
        assertThatThrownBy(() -> itinerary.parseLength("999h")).isInstanceOf(ValidationException.class);
        assertThatThrownBy(() -> itinerary.parseLength("forever")).isInstanceOf(ValidationException.class);
    }
}
