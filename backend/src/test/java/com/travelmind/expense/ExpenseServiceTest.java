package com.travelmind.expense;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import com.travelmind.common.ValidationException;
import com.travelmind.trip.Trip;
import com.travelmind.trip.TripService;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

@SpringBootTest
@Transactional
class ExpenseServiceTest {

    @Autowired
    ExpenseService expenses;

    @Autowired
    TripService trips;

    private UUID trip() {
        Trip t = trips.create("snohith", "Hampi weekend", LocalDate.parse("2026-11-14"), LocalDate.parse("2026-11-16"));
        return t.id();
    }

    @Test
    void splitsEvenlyAndSettles() {
        UUID id = trip();
        expenses.addExpense("snohith", id, "Snohith", "1200", "cottages");
        expenses.addExpense("snohith", id, "Anu", "600", "food");

        // 1800 across 2 → 900 each. Snohith +300, Anu −300.
        Map<String, Money> balances = expenses.balancesFor("snohith", id);
        assertThat(balances.get("Snohith")).isEqualTo(Money.ofMinor(30000, "INR"));
        assertThat(balances.get("Anu")).isEqualTo(Money.ofMinor(-30000, "INR"));

        List<String> steps = expenses.settleUp("snohith", id);
        assertThat(steps).hasSize(1);
        assertThat(steps.get(0)).contains("Anu owes Snohith");
    }

    @Test
    void moneyNeverUsesDouble() {
        // 0.1 + 0.2 drift is why Money is a long. See docs/decisions on money.
        assertThat(Money.parse("0.10").plus(Money.parse("0.20"))).isEqualTo(Money.parse("0.30"));
    }

    @Test
    void parsesCommasAndRejectsGarbage() {
        assertThat(Money.parse("12,500")).isEqualTo(Money.ofMinor(1_250_000, "INR"));
        assertThatThrownBy(() -> Money.parse("12.5.6")).isInstanceOf(ValidationException.class);
        assertThatThrownBy(() -> Money.parse("-100")).isInstanceOf(ValidationException.class);
    }

    @Test
    void refusesMixedCurrencies() {
        UUID id = trip();
        expenses.addExpense("snohith", id, "Snohith", "INR 100", "");
        expenses.addExpense("snohith", id, "Anu", "USD 10", "");

        assertThatThrownBy(() -> expenses.balancesFor("snohith", id)).hasMessageContaining("mixed currencies");
    }
}
