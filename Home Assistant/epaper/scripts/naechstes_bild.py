from pathlib import Path

BILDER_ORDNER = Path("/config/www/epaper/bilder")
STATUS_DATEI = Path("/config/www/epaper/letztes_bild.txt")

ERLAUBTE_ENDUNGEN = {".png", ".jpg", ".jpeg"}


def bilder_laden():
    bilder = [
        datei.name
        for datei in BILDER_ORDNER.iterdir()
        if datei.is_file()
        and datei.suffix.lower() in ERLAUBTE_ENDUNGEN
    ]

    return sorted(bilder, key=str.lower)


def letztes_bild_laden():
    if not STATUS_DATEI.exists():
        return None

    return STATUS_DATEI.read_text(encoding="utf-8").strip()


def naechstes_bild(bilder, letztes_bild):
    if not bilder:
        raise RuntimeError("Keine Bilder im Bilderordner gefunden.")

    if letztes_bild not in bilder:
        return bilder[0]

    position = bilder.index(letztes_bild)
    return bilder[(position + 1) % len(bilder)]


def main():
    bilder = bilder_laden()
    letztes_bild = letztes_bild_laden()
    bild = naechstes_bild(bilder, letztes_bild)

    STATUS_DATEI.write_text(bild, encoding="utf-8")

    print(bild)


if __name__ == "__main__":
    main()
