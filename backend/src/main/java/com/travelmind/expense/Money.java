package com.travelmind.expense;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.travelmind.common.TripLimits;
import com.travelmind.common.ValidationException;
import java.util.Objects;

/**
 * Exact money: minor units (paise/cents) in a long, plus a currency code.
 * Floats can't represent most decimals (`0.1 + 0.2 != 0.3`), so this is the
 * only way money moves around here. See ADR-0002.
 *
 * Serializes as {"amountMinor": 120000, "currency": "INR"}.
 */
public final class Money implements Comparable<Money> {

    private final long amountMinor;
    private final String currency;

    @JsonCreator
    public Money(
            @JsonProperty("amountMinor") long amountMinor,
            @JsonProperty("currency") String currency) {
        if (currency == null || currency.trim().isEmpty()) {
            throw new ValidationException("currency is required, e.g. INR");
        }
        String clean = currency.trim().toUpperCase();
        if (!clean.matches("[A-Z]{3}")) {
            throw new ValidationException("currency must be a 3-letter code, got: " + currency);
        }
        if (Math.abs(amountMinor) > TripLimits.MAX_MONEY_MINOR) {
            throw new ValidationException("amount too large — split it or talk to us");
        }
        this.amountMinor = amountMinor;
        this.currency = clean;
    }

    public static Money ofMinor(long minor, String currency) {
        return new Money(minor, currency);
    }

    /** Parses "1200", "INR 1200", "Rs. 1,200.50" (best effort). Defaults to INR. */
    public static Money parse(String text) {
        if (text == null || text.trim().isEmpty()) {
            throw new ValidationException("amount is required, e.g. 1200 or INR 1200");
        }
        String t = text.trim().toUpperCase()
                .replace("RS.", "")
                .replace("RS", "")
                .replace("₹", "")
                .replace(",", "")
                .trim();
        if (t.startsWith("-") || t.startsWith("+")) {
            throw new ValidationException("amount must be positive, got: " + text);
        }

        String currency = "INR";
        String[] parts = t.split("\\s+");
        if (parts.length == 2 && parts[0].matches("[A-Z]{3}")) {
            currency = parts[0];
            t = parts[1];
        } else if (parts.length == 2 && parts[1].matches("[A-Z]{3}")) {
            t = parts[0];
            currency = parts[1];
        } else if (parts.length > 2) {
            throw new ValidationException(
                    "couldn't understand amount '" + text + "' — try 1200 or INR 1200.50");
        }

        // Strict shape so "12.5.6" or "12." don't silently become something else.
        if (!t.matches("\\d+(\\.\\d{1,2})?")) {
            throw new ValidationException(
                    "couldn't understand amount '" + text + "' — try 1200 or INR 1200.50");
        }
        try {
            long minor;
            if (t.contains(".")) {
                int dot = t.indexOf('.');
                long major = Long.parseLong(t.substring(0, dot));
                String frac = (t.substring(dot + 1) + "00").substring(0, 2);
                minor = Math.addExact(Math.multiplyExact(major, 100), Long.parseLong(frac));
            } else {
                minor = Math.multiplyExact(Long.parseLong(t), 100);
            }
            if (minor <= 0) {
                throw new ValidationException("expense must be positive, got: " + text);
            }
            if (minor > TripLimits.MAX_MONEY_MINOR) {
                throw new ValidationException("amount too large — split it or talk to us");
            }
            return new Money(minor, currency);
        } catch (NumberFormatException | ArithmeticException e) {
            throw new ValidationException(
                    "couldn't understand amount '" + text + "' — try 1200 or INR 1200.50", e);
        }
    }

    public Money plus(Money other) {
        requireSameCurrency(other);
        return new Money(Math.addExact(amountMinor, other.amountMinor), currency);
    }

    public Money minus(Money other) {
        requireSameCurrency(other);
        return new Money(Math.subtractExact(amountMinor, other.amountMinor), currency);
    }

    /** Splits as evenly as possible; leftover paise go to the first shares (matches receipt math). */
    public Money[] split(int ways) {
        if (ways <= 0) {
            throw new ValidationException("split needs at least 1 way, got: " + ways);
        }
        long each = amountMinor / ways;
        long leftover = amountMinor % ways;
        Money[] out = new Money[ways];
        for (int i = 0; i < ways; i++) {
            out[i] = new Money(each + (i < leftover ? 1 : 0), currency);
        }
        return out;
    }

    @JsonProperty("amountMinor")
    public long amountMinor() {
        return amountMinor;
    }

    @JsonProperty("currency")
    public String currency() {
        return currency;
    }

    @JsonIgnore
    public boolean isZero() {
        return amountMinor == 0;
    }

    private void requireSameCurrency(Money other) {
        if (!currency.equals(other.currency)) {
            // No FX yet — group by currency upstream instead of guessing a rate.
            throw new ValidationException("can't mix " + currency + " with " + other.currency);
        }
    }

    @Override
    public int compareTo(Money other) {
        requireSameCurrency(other);
        return Long.compare(amountMinor, other.amountMinor);
    }

    @Override
    public String toString() {
        // Receipts round to the nearest rupee; we print exact so splits add up visibly.
        long abs = Math.abs(amountMinor);
        String body = (abs / 100) + "." + String.format("%02d", abs % 100);
        return currency + " " + (amountMinor < 0 ? "-" : "") + body;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Money other)) {
            return false;
        }
        return amountMinor == other.amountMinor && currency.equals(other.currency);
    }

    @Override
    public int hashCode() {
        return Objects.hash(amountMinor, currency);
    }
}
