package com.travelmind.expense;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/trips/{tripId}")
public class ExpenseController {

    private final ExpenseService expenses;

    public ExpenseController(ExpenseService expenses) {
        this.expenses = expenses;
    }

    @PostMapping("/expenses")
    @ResponseStatus(HttpStatus.CREATED)
    public Map<String, String> addExpense(
            @RequestHeader("X-User-Id") String ownerId,
            @PathVariable UUID tripId,
            @Valid @RequestBody CreateExpenseRequest body) {
        Expense saved = expenses.addExpense(ownerId, tripId, body.paidBy(), body.amount(), body.note());
        return Map.of("id", saved.id().toString(), "amount", saved.amount().toString());
    }

    @GetMapping("/balances")
    public Map<String, String> balances(
            @RequestHeader("X-User-Id") String ownerId,
            @PathVariable UUID tripId) {
        return expenses.balancesFor(ownerId, tripId).entrySet().stream()
                .collect(Collectors.toMap(Map.Entry::getKey, e -> e.getValue().toString(),
                        (a, b) -> a, java.util.LinkedHashMap::new));
    }

    @GetMapping("/settle-up")
    public List<String> settleUp(
            @RequestHeader("X-User-Id") String ownerId,
            @PathVariable UUID tripId) {
        return expenses.settleUp(ownerId, tripId);
    }
}
