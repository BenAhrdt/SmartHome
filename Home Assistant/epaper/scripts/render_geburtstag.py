from PIL import Image, ImageDraw, ImageFont, ImageChops
from pathlib import Path
import sys

# --------------------------------------------------
# Einstellungen
# --------------------------------------------------

BREITE = 1200
HOEHE = 1600

BILD_ORDNER = Path("/config/www/epaper/geburtstag")

TORTE = BILD_ORDNER / "Torte.png"
GESCHENK = BILD_ORDNER / "Geschenk.png"

# Gewünschte maximale Motivfläche
MOTIV_BREITE = 850
MOTIV_HOEHE = 750

# --------------------------------------------------
# Argumente
# --------------------------------------------------

if len(sys.argv) != 5:
    print(
        "Aufruf: render_geburtstag.py "
        "<tage> <text> <geburtsdatum> <ausgabe>"
    )
    sys.exit(1)

try:
    tage = int(sys.argv[1])
except ValueError:
    print("Fehler: Tage muss eine Zahl sein.")
    sys.exit(1)

text = sys.argv[2].strip()
geburtsdatum = sys.argv[3].strip()
ausgabe = Path(sys.argv[4])

# --------------------------------------------------
# Geburtstagsbild auswählen
# --------------------------------------------------

if tage == 0:
    bild_datei = TORTE
else:
    bild_datei = GESCHENK

if not bild_datei.exists():
    print(f"Fehler: Bild nicht gefunden: {bild_datei}")
    sys.exit(1)

# --------------------------------------------------
# Zeichenfläche
# --------------------------------------------------

canvas = Image.new("RGB", (BREITE, HOEHE), "white")
draw = ImageDraw.Draw(canvas)

font_text = ImageFont.load_default(size=90)
font_datum = ImageFont.load_default(size=60)

# --------------------------------------------------
# Text zentrieren
# --------------------------------------------------

def text_zentriert(text, y, font, abstand=20):
    bbox = draw.multiline_textbbox(
        (0, 0),
        text,
        font=font,
        spacing=abstand,
        align="center"
    )

    text_breite = bbox[2] - bbox[0]
    x = (BREITE - text_breite) // 2

    draw.multiline_text(
        (x, y),
        text,
        fill="black",
        font=font,
        spacing=abstand,
        align="center"
    )

    return bbox[3] - bbox[1]


# --------------------------------------------------
# Leeren Rand des Motivs entfernen
# --------------------------------------------------

def bild_zuschneiden(bild):
    # Erst Transparenz berücksichtigen
    if bild.mode == "RGBA":
        alpha = bild.getchannel("A")
        bbox = alpha.getbbox()

        if bbox:
            bild = bild.crop(bbox)

    # Zusätzlich weißen Rand entfernen
    rgb = bild.convert("RGB")

    hintergrund = Image.new(
        "RGB",
        rgb.size,
        (255, 255, 255)
    )

    diff = ImageChops.difference(rgb, hintergrund)
    bbox = diff.getbbox()

    if bbox:
        bild = bild.crop(bbox)

    return bild


# --------------------------------------------------
# Text oben umbrechen
# --------------------------------------------------

woerter = text.split()

zeilen = []
aktuelle_zeile = ""

for wort in woerter:
    test = wort if not aktuelle_zeile else aktuelle_zeile + " " + wort

    bbox = draw.textbbox(
        (0, 0),
        test,
        font=font_text
    )

    text_breite = bbox[2] - bbox[0]

    if text_breite <= 1050:
        aktuelle_zeile = test
    else:
        if aktuelle_zeile:
            zeilen.append(aktuelle_zeile)

        aktuelle_zeile = wort

if aktuelle_zeile:
    zeilen.append(aktuelle_zeile)

text_oben = "\n".join(zeilen)

text_hoehe = text_zentriert(
    text_oben,
    100,
    font_text,
    abstand=25
)

# --------------------------------------------------
# Geburtstagsmotiv laden
# --------------------------------------------------

bild = Image.open(bild_datei).convert("RGBA")

bild = bild_zuschneiden(bild)

original_breite = bild.width
original_hoehe = bild.height

# --------------------------------------------------
# Motiv EXPLIZIT vergrößern
# --------------------------------------------------

faktor_breite = MOTIV_BREITE / bild.width
faktor_hoehe = MOTIV_HOEHE / bild.height

# Seitenverhältnis beibehalten
faktor = min(faktor_breite, faktor_hoehe)

neue_breite = int(bild.width * faktor)
neue_hoehe = int(bild.height * faktor)

bild = bild.resize(
    (neue_breite, neue_hoehe),
    Image.Resampling.LANCZOS
)

# --------------------------------------------------
# Motiv positionieren
# --------------------------------------------------

bild_x = (BREITE - bild.width) // 2

# Bereich zwischen Überschrift und Datum
bereich_oben = 100 + text_hoehe + 60
bereich_unten = 1340

bereich_hoehe = bereich_unten - bereich_oben

bild_y = (
    bereich_oben
    + (bereich_hoehe - bild.height) // 2
)

canvas.paste(
    bild,
    (bild_x, bild_y),
    bild
)

# --------------------------------------------------
# Geburtsdatum
# --------------------------------------------------

datum_bbox = draw.textbbox(
    (0, 0),
    geburtsdatum,
    font=font_datum
)

datum_breite = datum_bbox[2] - datum_bbox[0]

datum_x = (BREITE - datum_breite) // 2

draw.text(
    (datum_x, 1420),
    geburtsdatum,
    fill="black",
    font=font_datum
)

# --------------------------------------------------
# Speichern
# --------------------------------------------------

canvas.save(ausgabe)

print("Geburtstagsseite erzeugt:")
print(ausgabe)
print(f"Tage: {tage}")
print(f"Motiv: {bild_datei.name}")
print(
    f"Motiv: {original_breite}x{original_hoehe} "
    f"-> {neue_breite}x{neue_hoehe}"
)
