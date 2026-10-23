# Security Policy

## Reporting a vulnerability

Please report security issues privately through GitHub:
**Security → Report a vulnerability** on this repository
(<https://github.com/lucferbux/lucferbux-react/security/advisories/new>).

Do not open a public issue for a vulnerability. You should get a reply within a week.

## Scope

- The site at <https://lucferbux.dev> and the code in this repository.
- The Firestore and Storage security rules (`firestore.rules`, `storage.rules`).

The Firebase web config in the built bundle (API key, project ID, …) is public by design
and is not a vulnerability on its own; access is enforced by the security rules.

## Supported versions

Only the current `main` branch, which is what is deployed.
