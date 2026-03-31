-- Scope change: no PRACTICE_ADMIN role — treat legacy rows as doctors at the same practice.
UPDATE "User" SET role = 'DOCTOR' WHERE role = 'PRACTICE_ADMIN';
