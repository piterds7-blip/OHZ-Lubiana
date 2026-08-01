# OHZ Lubiana — Żywienie · moduł 1–2

## Zawartość paczki

```
index.html          cała aplikacja (HTML + CSS + JS, bez bundlera)
sw.js               service worker (offline)
manifest.json       manifest PWA
firestore.rules     reguły bezpieczeństwa do wklejenia w konsoli Firebase
ikony/              ikony PWA wygenerowane z logo (192, 512, maskable, apple-touch)
```

## Uruchomienie w 5 krokach

1. **Nowy projekt Firebase** (osobny, nie ten z innymi aplikacjami).
   Firestore → *Utwórz bazę danych* → tryb produkcyjny → region `eur3` lub `europe-central2`.
2. **Authentication → Sign-in method → Anonymous → włącz.**
   Bez tego reguły z `request.auth != null` odetną aplikację.
3. **Firestore → Rules** → wklej zawartość `firestore.rules` → *Publish*.
4. **Project settings → Your apps → Web app** → skopiuj `firebaseConfig`
   i wklej w `index.html` w miejscu oznaczonym:
   ```
   ###  KONFIGURACJA FIREBASE — WSTAW TUTAJ SWOJE DANE  ###
   ```
5. **GitHub Pages**: wrzuć wszystkie pliki do korzenia repozytorium →
   Settings → Pages → Deploy from branch → `main` / `(root)`.
   Wszystkie ścieżki są względne, więc nazwa repozytorium nie ma znaczenia.

Bez kroku 4 aplikacja i tak wystartuje — w **trybie lokalnym** (żółty pasek u góry),
z danymi tylko w tej jednej przeglądarce. Wygodne do obejrzenia interfejsu przed konfiguracją.

## Hasła startowe

Przy pierwszym uruchomieniu aplikacja zasiewa je do `/config/passwords` jako skróty SHA-256:

| Rola | Hasło startowe |
|---|---|
| Twórca | `lubiana-t` |
| Główny hodowca | `lubiana-h` |
| Zootechnik Nadarzyn | `nadarzyn-z` |
| Zootechnik Boguszyn | `boguszyn-z` |
| Operator Nadarzyn | `nadarzyn-o` |
| Operator Boguszyn | `boguszyn-o` |
| Mieszalnia | `mieszalnia-m` |

**Zmień je od razu**: zaloguj się jako Twórca → ⚙ Ustawienia → sekcja *Hasła ról*.
Hasła są wczytywane na ekranie startowym, **zanim** pojawi się formularz logowania —
zmiana hasła propaguje się na wszystkie urządzenia natychmiast.

Uczciwie: hash chroni przed podejrzeniem hasła w konsoli Firestore, nie przed kimś,
kto ma dostęp do projektu Firebase. Prawdziwą kontrolę dostępu da dopiero Firebase Auth
z rolami w custom claims (etap 2 w `firestore.rules`).

## Co działa w tym module

- Splash z preloadem konfiguracji → logowanie hasłem → role i widoczność zakładek
- Nagłówek: nazwa, rola, wskaźnik synchronizacji, odśwież, ustawienia, backup, info, wyloguj
- Zmiana koloru akcentu przy przejściu na Nadarzyn (niebieski) / Boguszyn (pomarańczowy)
- Eksport i import pełnej kopii JSON
- PWA: instalacja na tablecie, praca offline, cache Firestore + localStorage
- **Surowce**: dodawanie, edycja inline, usuwanie z ostrzeżeniem o użyciu,
  sortowanie po kolumnach, kolejność własna ze strzałkami, filtr kategorii, wyszukiwarka,
  cena w zł/t z podglądem zł/kg, data ostatniej zmiany ceny, rozwijany skład mieszanek własnych

## Uwagi techniczne

- **Sesja** trzyma się 30 dni w `localStorage` — operator nie loguje się codziennie.
- **Kolejność kolekcji do backupu** jest w stałej `KOLEKCJE` — przy kolejnych modułach
  dojdą tam `grupyTech` i `zywienie` (zagnieżdżone, obsłużę je osobno).
- Ceny trzymam w bazie jako `cenaTona` (zł/t). Przeliczenie na zł/kg robi funkcja widoku —
  jedno źródło prawdy, żaden moduł nie zgubi tysiąca.
