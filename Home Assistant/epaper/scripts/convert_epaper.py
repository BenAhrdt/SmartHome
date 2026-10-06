from PIL import Image, ImageOps
import sys
import os

WIDTH = 1200
HEIGHT = 1600

# Farben für die Bild-Quantisierung
COLORS = [
    (0, 0, 0),        # 0 Schwarz
    (255, 255, 255),  # 1 Weiß
    (255, 0, 0),      # 2 Rot
    (0, 255, 0),      # 3 Grün
    (0, 0, 255),      # 4 Blau
    (255, 255, 0),    # 5 Gelb
]

# Native 4-Bit-Farbcodes des E1004 / T133A01
EINK = [
    0xF,  # Schwarz
    0x0,  # Weiß
    0x6,  # Rot
    0x2,  # Grün
    0xD,  # Blau
    0xB,  # Gelb
]

PALETTE = []
for color in COLORS:
    PALETTE.extend(color)

PALETTE += [0, 0, 0] * (256 - len(COLORS))


def convert(source, preview_file, raw_file):
    print("Lade:", source)

    img = Image.open(source).convert("RGB")
    print("Original:", img.size)

    # Auf exakt 1200 x 1600 bringen.
    # Seitenverhältnis bleibt erhalten; Überstand wird abgeschnitten.
    img = ImageOps.fit(
        img,
        (WIDTH, HEIGHT),
        method=Image.Resampling.LANCZOS,
        centering=(0.5, 0.5)
    )

    print("Zielgroesse:", img.size)

    # Pillow-Palettenbild mit unseren sechs Farben
    palette_img = Image.new("P", (1, 1))
    palette_img.putpalette(PALETTE)

    print("Erzeuge 6-Farb-Dithering ...")

    indexed = img.quantize(
        palette=palette_img,
        dither=Image.Dither.FLOYDSTEINBERG
    )

    # Vorschau speichern
    preview = indexed.convert("RGB")
    preview.save(
        preview_file,
        format="PNG",
        optimize=True
    )

    print("Erzeuge natives E1004 RAW ...")

    pixels = indexed.load()

    with open(raw_file, "wb") as f:
        for y in range(HEIGHT):
            row = bytearray(WIDTH // 2)

            for x in range(0, WIDTH, 2):
                index1 = pixels[x, y]
                index2 = pixels[x + 1, y]

                color1 = EINK[index1]
                color2 = EINK[index2]

                # Pixel x     = oberes Nibble
                # Pixel x + 1 = unteres Nibble
                row[x // 2] = (color1 << 4) | color2

            f.write(row)

    raw_size = os.path.getsize(raw_file)

    print()
    print("================================")
    print("FERTIG")
    print("================================")
    print("Vorschau:", preview_file)
    print("RAW:", raw_file)
    print("RAW-Groesse:", raw_size, "Bytes")

    if raw_size == 960000:
        print("RAW-GROESSE IST KORREKT!")
    else:
        print("FEHLER!")
        print("Erwartet: 960000 Bytes")


if __name__ == "__main__":
    if len(sys.argv) != 4:
        print(
            "Aufruf: python3 convert_epaper.py "
            "QUELLE VORSCHAU RAW"
        )
        sys.exit(1)

    convert(
        sys.argv[1],
        sys.argv[2],
        sys.argv[3]
    )
