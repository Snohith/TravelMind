package com.travelmind.trip;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import com.travelmind.common.DuplicateTripException;
import com.travelmind.common.TripNotFoundException;
import com.travelmind.common.ValidationException;
import java.time.LocalDate;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.context.annotation.Import;

@DataJpaTest
@Import(TripService.class)
class TripServiceTest {

    @Autowired
    TripService trips;

    private static final String OWNER = "tester";

    @Test
    void createsAndListsInDateOrder() {
        trips.create(OWNER, "Goa slow week", LocalDate.parse("2026-12-20"), LocalDate.parse("2026-12-27"));
        trips.create(OWNER, "Hampi weekend", LocalDate.parse("2026-11-14"), LocalDate.parse("2026-11-16"));

        assertThat(trips.list(OWNER)).extracting(Trip::name)
                .containsExactly("Hampi weekend", "Goa slow week");
    }

    @Test
    void rejectsEndBeforeStart() {
        assertThatThrownBy(() -> trips.create(OWNER, "Backwards",
                LocalDate.parse("2026-11-16"), LocalDate.parse("2026-11-14")))
                .isInstanceOf(ValidationException.class)
                .hasMessageContaining("before");
    }

    @Test
    void rejectsDuplicateNamesPerOwner() {
        trips.create(OWNER, "Hampi weekend", LocalDate.parse("2026-11-14"), LocalDate.parse("2026-11-16"));

        assertThatThrownBy(() -> trips.create(OWNER, "Hampi weekend",
                LocalDate.parse("2026-11-14"), LocalDate.parse("2026-11-16")))
                .isInstanceOf(DuplicateTripException.class);
    }

    @Test
    void hidesOtherOwnersTrips() {
        Trip saved = trips.create("someone-else", "Secret", LocalDate.parse("2026-11-14"), LocalDate.parse("2026-11-16"));

        assertThatThrownBy(() -> trips.get(OWNER, saved.id())).isInstanceOf(TripNotFoundException.class);
        assertThat(trips.list(OWNER)).isEmpty();
    }

    @Test
    void deletes() {
        UUID id = trips.create(OWNER, "Temp", LocalDate.parse("2026-11-14"), LocalDate.parse("2026-11-16")).id();
        trips.delete(OWNER, id);

        assertThat(trips.list(OWNER)).isEmpty();
    }
}
