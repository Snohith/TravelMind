package com.travelmind.common;

/**
 * Guard rails so one bad request can't blow up storage or logs.
 * The frontend form validates to these same numbers; the backend re-checks
 * because clients lie.
 */
public final class TripLimits {

    private TripLimits() {
    }

    public static final int MAX_TRIP_NAME = 80;
    public static final int MAX_PLACE = 120;
    public static final int MAX_PAYER = 60;
    public static final int MAX_NOTE = 280;
    public static final int MAX_MINUTES_PER_STOP = 24 * 60;
    public static final long MAX_MONEY_MINOR = 1_000_000_000_00L;
    public static final int MAX_SAVED_TRIPS_PER_USER = 50;
}
