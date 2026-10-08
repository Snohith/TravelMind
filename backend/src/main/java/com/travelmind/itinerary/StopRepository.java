package com.travelmind.itinerary;

import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StopRepository extends JpaRepository<Stop, UUID> {

    List<Stop> findByTripIdOrderByDayAscStartsAtAsc(UUID tripId);
}
