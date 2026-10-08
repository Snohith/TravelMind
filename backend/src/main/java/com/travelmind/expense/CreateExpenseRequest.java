package com.travelmind.expense;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/** Amount stays a string ("1200", "INR 1200.50") — Money.parse owns that grammar. */
public record CreateExpenseRequest(
        @NotBlank(message = "must not be blank") @Size(max = 60, message = "too long") String paidBy,
        @NotBlank(message = "is required, e.g. 1200 or INR 1200.50") String amount,
        @Size(max = 280, message = "too long (max 280 chars)") String note) {
}
