# Skrivebeskyttelse af @apps-vue/**

Denne dokument beskriver, hvordan du nemt kan skrivebeskytte alle filer i `@apps-vue/**` og hvordan du nemt kan ophæve skrivebeskyttelsen igen.

## Formål

At skrivebeskytte filerne i `@apps-vue/**` gør det sværere at utilsigtet at ændre i disse kritiske filer. Det er nyttigt under udvikling, hvor du arbejder med en ny implementering og ikke ønsker at ændre på eksisterende funktionalitet.

## Skrivebeskyt (read-only)

For at gøre alle filer i `@apps-vue/**` skrivebeskyttede (read-only), brug følgende kommando:

```bash
chmod -R 444 /home/lpm/REPO/loke/loke-cards/apps-vue/**
```

Dette gør alle filer i `@apps-vue/**` læsebare, men ikke skrivebare.

Alternativt kan du bruge denne kommando, som specifikt fjerner skriverettigheder fra alle filer:

```bash
find /home/lpm/REPO/loke/loke-cards/apps-vue -type f -exec chmod 444 {} \;
```

For mapper, brug:

```bash
find /home/lpm/REPO/loke/loke-cards/apps-vue -type d -exec chmod 555 {} \;
```

## Ophæv skrivebeskyttelse (giv skriverettigheder igen)

For at ophæve skrivebeskyttelsen og gøre filerne redigérbare igen, brug følgende kommando:

```bash
chmod -R 644 /home/lpm/REPO/loke/loke-cards/apps-vue/**
```

Eller mere specifikt:

For filer:
```bash
find /home/lpm/REPO/loke/loke-cards/apps-vue -type f -exec chmod 644 {} \;
```

For mapper:
```bash
find /home/lpm/REPO/loke/loke-cards/apps-vue -type d -exec chmod 755 {} \;
```

## Script til nem håndtering

Du kan også oprette simple scripts til at gøre det nemt at skifte mellem tilstande:

### Skrivebeskyt script (`protect-apps-vue.sh`):
```bash
#!/bin/bash
find /home/lpm/REPO/loke/loke-cards/apps-vue -type f -exec chmod 444 {} \;
find /home/lpm/REPO/loke/loke-cards/apps-vue -type d -exec chmod 555 {} \;
echo "Apps-vue er nu skrivebeskyttet"
```

### Ophæv beskyttelse script (`unprotect-apps-vue.sh`):
```bash
#!/bin/bash
find /home/lpm/REPO/loke/loke-cards/apps-vue -type f -exec chmod 644 {} \;
find /home/lpm/REPO/loke/loke-cards/apps-vue -type d -exec chmod 755 {} \;
echo "Skrivebeskyttelse af apps-vue er ophævet"
```

Giv scripts eksekverbar rettighed med `chmod +x scriptnavn.sh`.

## Bemærkninger

- Husk at du stadig vil kunne ophæve beskyttelsen med ovenstående kommandoer
- Hvis du er på Windows med Git Bash eller lignende, fungerer kommandoerne på samme måde
- Det er altid en god idé at tage backup før du ændrer filrettigheder på store dele af projektet