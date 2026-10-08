package com.travelmind.expense;

import com.travelmind.common.TripLimits;
import com.travelmind.common.Validation;
import com.travelmind.common.ValidationException;
import com.travelmind.trip.TripService;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Expense math per trip. Balances are nets: positive means "is owed",
 * negative means "owes". Settlement is greedy — optimal for friends,
 * not for twenty people, and that's fine.
 */
@Service
public class ExpenseService {

    private final TripService trips;
    private final ExpenseRepository expenses;

    public ExpenseService(TripService trips, ExpenseRepository expenses) {
        this.trips = trips;
        this.expenses = expenses;
    }

    @Transactional
    public Expense addExpense(String ownerId, UUID tripId, String paidBy, String amountText, String note) {
        trips.get(ownerId, tripId); // ownership first
        String who = Validation.bounded(paidBy, "paid by", TripLimits.MAX_PAYER);
        if (note != null && note.length() > TripLimits.MAX_NOTE) {
            throw new ValidationException("note too long (max " + TripLimits.MAX_NOTE + " chars)");
        }
        Money amount = Money.parse(amountText); // rejects non-positive already
        return expenses.save(new Expense(tripId, who, amount, note));
    }

    @Transactional(readOnly = true)
    public Map<String, Money> balancesFor(String ownerId, UUID tripId) {
        trips.get(ownerId, tripId);
        List<Expense> all = expenses.findByTripId(tripId);
        String currency = currencyFor(all, tripId);
        Map<String, Long> paid = new LinkedHashMap<>();
        for (Expense e : all) {
            paid.merge(e.paidBy(), e.amount().amountMinor(), Math::addExact);
        }
        if (paid.isEmpty()) {
            return Map.of();
        }
        long total = 0;
        for (long v : paid.values()) {
            total = Math.addExact(total, v);
        }
        // Integer division drops paise; the remainder (< n people) is noise at
        // this scale, and exactness made the demo confusing. Keep it simple.
        long share = total / paid.size();

        Map<String, Money> balances = new LinkedHashMap<>();
        for (Map.Entry<String, Long> e : paid.entrySet()) {
            balances.put(e.getKey(), Money.ofMinor(Math.subtractExact(e.getValue(), share), currency));
        }
        return balances;
    }

    @Transactional(readOnly = true)
    public List<String> settleUp(String ownerId, UUID tripId) {
        Map<String, Money> balances = balancesFor(ownerId, tripId);
        List<Map.Entry<String, Money>> creditors = new ArrayList<>();
        List<Map.Entry<String, Money>> debtors = new ArrayList<>();
        for (Map.Entry<String, Money> e : balances.entrySet()) {
            if (e.getValue().amountMinor() > 0) {
                creditors.add(e);
            } else if (e.getValue().amountMinor() < 0) {
                debtors.add(e);
            }
        }
        creditors.sort((a, b) -> Long.compare(b.getValue().amountMinor(), a.getValue().amountMinor()));
        debtors.sort((a, b) -> Long.compare(a.getValue().amountMinor(), b.getValue().amountMinor()));

        List<String> steps = new ArrayList<>();
        List<Long> creditLeft = new ArrayList<>();
        List<Long> debtLeft = new ArrayList<>();
        for (Map.Entry<String, Money> c : creditors) {
            creditLeft.add(c.getValue().amountMinor());
        }
        for (Map.Entry<String, Money> d : debtors) {
            debtLeft.add(-d.getValue().amountMinor());
        }
        String currency = balances.values().stream().findFirst().map(Money::currency).orElse("INR");
        int i = 0, j = 0;
        while (i < creditors.size() && j < debtors.size()) {
            long move = Math.min(creditLeft.get(i), debtLeft.get(j));
            steps.add(debtors.get(j).getKey() + " owes " + creditors.get(i).getKey() + " "
                    + Money.ofMinor(move, currency));
            creditLeft.set(i, creditLeft.get(i) - move);
            debtLeft.set(j, debtLeft.get(j) - move);
            if (creditLeft.get(i) == 0) {
                i++;
            }
            if (debtLeft.get(j) == 0) {
                j++;
            }
        }
        return steps;
    }

    private String currencyFor(List<Expense> all, UUID tripId) {
        String currency = null;
        for (Expense e : all) {
            if (currency == null) {
                currency = e.amount().currency();
            } else if (!currency.equals(e.amount().currency())) {
                throw new ValidationException(
                        "mixed currencies on this trip — settle " + currency
                                + " and " + e.amount().currency() + " separately for now");
            }
        }
        return currency == null ? "INR" : currency;
    }
}
