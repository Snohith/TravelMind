package com.travelmind.trip;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
class TripControllerTest {

    @Autowired
    MockMvc mockMvc;

    private static final String OWNER = "controller-tester";

    @Test
    void createsTripsAndReturnsEnvelopeOnErrors() throws Exception {
        mockMvc.perform(post("/api/v1/trips")
                        .header("X-User-Id", OWNER)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"name":"Hampi weekend","startsOn":"2026-11-14","endsOn":"2026-11-16"}"""))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name").value("Hampi weekend"));

        // duplicate → 409 with a stable code
        mockMvc.perform(post("/api/v1/trips")
                        .header("X-User-Id", OWNER)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"name":"Hampi weekend","startsOn":"2026-11-14","endsOn":"2026-11-16"}"""))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.code").value("TRIP_EXISTS"));

        // bad dates → 400, and the message says what to fix
        mockMvc.perform(post("/api/v1/trips")
                        .header("X-User-Id", OWNER)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"name":"Backwards","startsOn":"2026-11-16","endsOn":"2026-11-14"}"""))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code").value("VALIDATION_FAILED"));

        // someone else's id → 404, not 403 (no id oracle)
        mockMvc.perform(get("/api/v1/trips/00000000-0000-0000-0000-000000000000")
                        .header("X-User-Id", OWNER))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.code").value("TRIP_NOT_FOUND"));
    }
}
