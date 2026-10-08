package com.travelmind.expense;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.util.UUID;

/**
 * Who paid how much for what, on a trip. Payer is a plain name for now —
 * the frontend has real users, but splitting by display name is what groups
 * of friends actually do, so we keep it.
 */
@Entity
@Table(name = "expenses")
public class Expense {

    @Id
    private UUID id = UUID.randomUUID();

    @Column(name = "trip_id", nullable = false)
    private UUID tripId;

    @Column(name = "paid_by", nullable = false, length = 60)
    private String paidBy;

    @Column(name = "amount_minor", nullable = false)
    private long amountMinor;

    @Column(nullable = false, length = 3)
    private String currency;

    @Column(length = 280)
    private String note = "";

    protected Expense() {
    }

    public Expense(UUID tripId, String paidBy, Money amount, String note) {
        this.tripId = tripId;
        this.paidBy = paidBy;
        this.amountMinor = amount.amountMinor();
        this.currency = amount.currency();
        this.note = note == null ? "" : note;
    }

    public UUID id() {
        return id;
    }

    public UUID tripId() {
        return tripId;
    }

    public String paidBy() {
        return paidBy;
    }

    public Money amount() {
        return Money.ofMinor(amountMinor, currency);
    }

    public String note() {
        return note;
    }
}
