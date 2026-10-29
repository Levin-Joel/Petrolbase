package com.petrolbase.backend.auth;

import com.petrolbase.backend.account.Account;

public record AccountResponse(Integer id, String name, String email) {
    public static AccountResponse from(Account account) {
        return new AccountResponse(account.getId(), account.getName(), account.getEmail());
    }
}
