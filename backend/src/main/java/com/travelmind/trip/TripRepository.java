package com.travelmind.trip;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TripRepository extends JpaRepository<Trip, UUID> {

    Optional<Trip> findByIdAndOwnerId(UUID id, String ownerId);

    List<Trip> findByOwnerIdOrderByStartsOnAsc(String ownerId);

    boolean existsByOwnerIdAndName(String ownerId, String name);

    long countByOwnerId(String ownerId);
}
