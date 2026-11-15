# OHZ Lubiana — Żywienie

## Zawartość

```
index.html          cała aplikacja (HTML + CSS + JS, bez bundlera)
sw.js               service worker (praca offline)
manifest.json       manifest PWA
firestore.rules     reguły bezpieczeństwa bazy — do wklejenia w konsoli Firebase
ikony               ikony PWA (192, 512, maskable, apple-touch)
```

## Logowanie i dostęp (od wersji 1.6.0)

Każda osoba ma **własny login i hasło**. Nie ma już haseł wspólnych dla ról.

- **Twórca** zarządza dostępem w zakładce **👥 Dostęp** (wzorowanej na GR Formela):
  dodaje osoby, ustawia, które zakładki widzą i czy mogą coś zmieniać, blokuje,
  nadaje nowe hasło, usuwa.
- Na każdej karcie dotknij „pigułki” zakładki, żeby wybrać: nie widzi / podgląd /
  tylko wpis kg i niedojadów / może zmieniać.
- Zmiany działają od razu, także na tabletach, na których ktoś jest już zalogowany.
  Zablokowana osoba zostaje od razu wylogowana.
- Każdy może sam zmienić swoje hasło: ⓘ → **Zmień moje hasło**.
- Zapomniane hasło: Twórca → Dostęp → **Nowe hasło**.
- Dane są chronione przez **reguły bazy**, nie tylko przez ekran logowania. Bez konta
  założonego przez Twórcę nie da się odczytać ani zmienić żadnych danych.

Haseł nie ma w kodzie ani w bazie — przechowuje je Firebase Authentication.

## Przejście ze starej wersji (jednorazowo, ok. 10 minut)

Dane (surowce, dawki, grupy, żywienie, paszowozy, raporty) **zostają bez zmian**.
Zmienia się tylko sposób logowania. Kolejność ma znaczenie:

1. **Kopia zapasowa:** w starej aplikacji kliknij ⬇ → *Eksportuj JSON*. Zachowaj plik.
2. **Firebase Console → Authentication → Sign-in method → Email/Password → Włącz**
   (tylko pierwszą opcję „Email/Password”; „Email link” zostaw wyłączony).
3. **Firebase Console → Firestore Database → Reguły:** wklej całą zawartość
   `firestore.rules` z tego repozytorium → *Opublikuj*.
   Od tej chwili stara wersja aplikacji przestaje mieć dostęp do danych — dlatego
   krok 4 zrób zaraz po nim.
4. **Opublikuj nową wersję aplikacji** (wgraj pliki na hosting / scal zmiany w GitHubie).
5. **Otwórz aplikację → „Pierwsze uruchomienie — załóż konto Twórcy”.**
   Wpisz swoje imię, login i hasło (min. 8 znaków). Ten przycisk działa tylko raz —
   zrób to od razu po kroku 3, zanim ktokolwiek inny otworzy stronę.
   Aplikacja sama usunie z bazy stary dokument ze wspólnymi hasłami.
6. **Zakładka 👥 Dostęp → Dodaj osobę** dla każdego pracownika. Pole „Kto to jest”
   podpowiada zakładki według dawnych ról (hodowca, zootechnik, operator, mieszalnia);
   potem możesz je zmienić pigułkami. Hasła przekaż osobiście.
7. **Firebase Console → Authentication → Sign-in method → Anonymous → Wyłącz.**
   Logowanie anonimowe nie jest już potrzebne.

Jeśli w kroku 5 pojawi się „Konto Twórcy już istnieje”, a to nie Ty je zakładałeś:
w konsoli Firebase → Firestore usuń dokument `publiczne/start` i spróbuj ponownie,
a w Authentication usuń nieznane konta.

## Ochrona danych przy aktualizacjach

- **Stara karta nie zapisuje po aktualizacji.** Gdy na jakimkolwiek urządzeniu uruchomi
  się nowsza wersja, urządzenia ze starszą wersją pokazują „Jest nowa wersja aplikacji —
  odśwież” i niczego nie zapisują, dopóki się nie odświeżą. Przy każdej aktualizacji,
  która zmienia sposób zapisu danych, zwiększ `WERSJA_KODU` w `index.html`
  i `WERSJA` w `sw.js`.
- **Dane przykładowe nigdy nie nadpisują istniejących** (przyciski 🌱 w ⓘ tylko dopisują
  brakujące).
- **Plan paszowozu** zapisuje się na najnowszym stanie z serwera — dwa tablety pracujące
  jednocześnie nie kasują sobie wpisów.
- **Wpis dnia** (kg, niedojady) wysyła tylko zmienioną grupę.
- **Zaplanowana zmiana dawek** („od jutra”, „za 3 dni”) zmienia w dniu wejścia w życie
  tylko te dawki, które faktycznie zaplanowano — nie cofa zmian zrobionych w międzyczasie.
- **Kopia dnia** (snapshot) nie zapisze się z niepełnych danych urządzenia.
- **Wylogowanie** usuwa z urządzenia kopię danych; jeśli są niewysłane zmiany (brak
  zasięgu), aplikacja ostrzeże i nie wyloguje.

Mimo to: **raz w tygodniu pobieraj kopię JSON** (aplikacja przypomina Twórcy).

## Uwagi techniczne

- Konto Firebase wymaga adresu e-mail — aplikacja tworzy techniczny adres
  `login.xxxxxx@ohz-lubiana-po-app.firebaseapp.com`. Nikt na niego nic nie wysyła.
- „Nowe hasło” zakłada dla osoby nowe konto pod tym samym loginem i przenosi uprawnienia;
  stare konto traci dostęp. W *Authentication* mogą zostawać nieużywane stare konta —
  można je tam usunąć, nie są potrzebne.
- Reguły bazy pilnują, kto jest zalogowany, kto jest zablokowany, kto jest Twórcą
  i kto ma *jakiekolwiek* prawo zmian. Podział na konkretne zakładki (np. operator
  zmienia tylko Nadarzyn) pilnuje aplikacja.
- **Kolejność kolekcji do backupu** jest w stałej `KOLEKCJE`.
- Ceny trzymane są jako `cenaTona` (zł/t); przeliczenie na zł/kg robi widok.
