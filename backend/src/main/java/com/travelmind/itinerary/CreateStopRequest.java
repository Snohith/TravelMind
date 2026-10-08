package com.travelmind.itinerary;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

/** Frontend sends dates/times as strings; the service parses them strictly. */
public record CreateStopRequest(
        @NotNull(message = "is required") java.time.LocalDate day,
        @NotBlank(message = "must not be blank") @Size(max = 120, message = "too long (max 120 chars)") String place,
        @NotNull(message = "is required") java.time.LocalTime startsAt,
        @NotBlank(message = "is required, e.g. 2h or 90m")
        @Pattern(regexp = ".{1,16}", message = "too long")
        String length) {
}
