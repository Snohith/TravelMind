package com.travelmind.trip;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;

/** What the frontend sends to create a trip. Dates as ISO strings map here. */
public record CreateTripRequest(
        @NotBlank(message = "must not be blank") @Size(max = 80, message = "too long (max 80 chars)") String name,
        @NotNull(message = "is required") LocalDate startsOn,
        @NotNull(message = "is required") LocalDate endsOn) {
}
