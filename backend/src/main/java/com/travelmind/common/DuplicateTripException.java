package com.travelmind.common;

/** Tried to create/rename to a name that's taken. */
public class DuplicateTripException extends AppException {

    public DuplicateTripException(String name) {
        super("TRIP_EXISTS", "there's already a trip called '" + name + "'");
    }
}
