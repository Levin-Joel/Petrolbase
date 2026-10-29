package com.petrolbase.backend.account;

import com.petrolbase.backend.auth.AccountResponse;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.Locale;

@Service
public class AccountService {
    private final AccountRepository accountRepository;
    private final PasswordEncoder passwordEncoder;

    public AccountService(AccountRepository accountRepository, PasswordEncoder passwordEncoder) {
        this.accountRepository = accountRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public AccountResponse register(String name, String email, String password) {
        String normalizedEmail = normalizeEmail(email);
        if (accountRepository.existsByEmailIgnoreCase(normalizedEmail)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "E-Mail existiert bereits!");
        }

        Account account = accountRepository.save(
                new Account(
                        Math.addExact(accountRepository.findMaxId(), 1),
                        name.trim(),
                        normalizedEmail,
                        passwordEncoder.encode(password)));
        return AccountResponse.from(account);
    }

    @Transactional(readOnly = true)
    public AccountResponse getByEmail(String email) {
        return accountRepository.findByEmailIgnoreCase(email)
                .map(AccountResponse::from)
                .orElseThrow(() -> new BadCredentialsException("Anmeldung fehlgeschlagen."));
    }

    @Transactional
    public void changePassword(String email, String currentPassword, String newPassword) {
        Account account = accountRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new BadCredentialsException("E-Mail oder aktuelles Passwort ist falsch."));
        if (!passwordEncoder.matches(currentPassword, account.getPasswordHash())) {
            throw new BadCredentialsException("E-Mail oder aktuelles Passwort ist falsch.");
        }

        account.setPasswordHash(passwordEncoder.encode(newPassword));
    }

    @Transactional
    public void deleteByEmail(String email) {
        Account account = accountRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new BadCredentialsException("Account nicht gefunden."));
        accountRepository.delete(account);
    }

    private String normalizeEmail(String email) {
        return email.trim().toLowerCase(Locale.ROOT);
    }
}
