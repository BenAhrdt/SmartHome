from PIL import Image, ImageDraw, ImageFont
import os
import sys


WIDTH = 1200
HEIGHT = 1600

BASE_DIR = "/config/www/epaper"
MUELL_DIR = os.path.join(BASE_DIR, "muell")


TONNEN = {
    "bio": {
        "bild": "Bio.png",
        "titel": "BIOTONNE",
        "zeilen": ["BIO", "TONNE"],
    },
    "gelb": {
        "bild": "Gelb.png",
        "titel": "GELBE TONNE",
        "zeilen": ["GELBE", "TONNE"],
    },
    "rest": {
        "bild": "Rest.png",
        "titel": "RESTMUELL",
        "zeilen": ["REST", "MUELL"],
    },
    "blau": {
        "bild": "Blau.png",
        "titel": "ALTPAPIER",
        "zeilen": ["ALT", "PAPIER"],
    },
}


def font(size):
    return ImageFont.load_default(size=size)


def text_center(draw, text, center_x, y, font_obj):
    box = draw.textbbox(
        (0, 0),
        text,
        font=font_obj,
    )

    text_width = box[2] - box[0]

    draw.text(
        (
            center_x - text_width // 2,
            y,
        ),
        text,
        font=font_obj,
        fill="black",
    )


def load_tonne(typ, max_width, max_height):
    path = os.path.join(
        MUELL_DIR,
        TONNEN[typ]["bild"],
    )

    img = Image.open(path).convert("RGBA")

    img.thumbnail(
        (
            max_width,
            max_height,
        ),
        Image.Resampling.LANCZOS,
    )

    return img


def render(typen_text, datum_text, output):
    typen = [
        x.strip().lower()
        for x in typen_text.split(",")
        if x.strip()
    ]

    if not typen:
        raise ValueError(
            "Keine Tonne angegeben"
        )

    for typ in typen:
        if typ not in TONNEN:
            raise ValueError(
                f"Unbekannter Typ: {typ}. "
                "Erlaubt: bio, gelb, rest, blau"
            )

    # Maximal vier Tonnen
    typen = typen[:4]

    canvas = Image.new(
        "RGB",
        (
            WIDTH,
            HEIGHT,
        ),
        "white",
    )

    draw = ImageDraw.Draw(canvas)

    # -----------------------------------------
    # Überschrift
    # -----------------------------------------

    text_center(
        draw,
        "MORGEN",
        WIDTH // 2,
        60,
        font(150),
    )

    # =========================================
    # EINE TONNE
    # =========================================

    if len(typen) == 1:
        typ = typen[0]

        tonne = load_tonne(
            typ,
            700,
            820,
        )

        x = (
            WIDTH - tonne.width
        ) // 2

        y = 300

        canvas.paste(
            tonne,
            (
                x,
                y,
            ),
            tonne,
        )

        text_center(
            draw,
            TONNEN[typ]["titel"],
            WIDTH // 2,
            1200,
            font(120),
        )

    # =========================================
    # ZWEI TONNEN
    # =========================================

    elif len(typen) == 2:
        centers = [
            300,
            900,
        ]

        for typ, center_x in zip(
            typen,
            centers,
        ):
            tonne = load_tonne(
                typ,
                470,
                700,
            )

            x = (
                center_x
                - tonne.width // 2
            )

            y = 350

            canvas.paste(
                tonne,
                (
                    x,
                    y,
                ),
                tonne,
            )

            zeilen = TONNEN[typ]["zeilen"]

            text_center(
                draw,
                zeilen[0],
                center_x,
                1090,
                font(75),
            )

            text_center(
                draw,
                zeilen[1],
                center_x,
                1180,
                font(75),
            )

    # =========================================
    # DREI TONNEN
    # =========================================

    elif len(typen) == 3:
        centers = [
            200,
            600,
            1000,
        ]

        for typ, center_x in zip(
            typen,
            centers,
        ):
            tonne = load_tonne(
                typ,
                330,
                600,
            )

            x = (
                center_x
                - tonne.width // 2
            )

            y = 400

            canvas.paste(
                tonne,
                (
                    x,
                    y,
                ),
                tonne,
            )

            zeilen = TONNEN[typ]["zeilen"]

            text_center(
                draw,
                zeilen[0],
                center_x,
                1080,
                font(55),
            )

            text_center(
                draw,
                zeilen[1],
                center_x,
                1150,
                font(55),
            )

    # =========================================
    # VIER TONNEN
    # =========================================

    else:
        centers = [
            150,
            450,
            750,
            1050,
        ]

        for typ, center_x in zip(
            typen,
            centers,
        ):
            tonne = load_tonne(
                typ,
                250,
                580,
            )

            x = (
                center_x
                - tonne.width // 2
            )

            y = 420

            canvas.paste(
                tonne,
                (
                    x,
                    y,
                ),
                tonne,
            )

            zeilen = TONNEN[typ]["zeilen"]

            text_center(
                draw,
                zeilen[0],
                center_x,
                1080,
                font(48),
            )

            text_center(
                draw,
                zeilen[1],
                center_x,
                1145,
                font(48),
            )

    # -----------------------------------------
    # Datum
    # -----------------------------------------

    text_center(
        draw,
        datum_text,
        WIDTH // 2,
        1420,
        font(58),
    )

    # -----------------------------------------
    # Speichern
    # -----------------------------------------

    canvas.save(
        output,
        "PNG",
        optimize=True,
    )

    print("Muellseite erzeugt:")
    print(output)
    print(
        "Tonnen:",
        ", ".join(typen),
    )


if __name__ == "__main__":
    if len(sys.argv) != 4:
        print(
            "Aufruf:"
        )

        print(
            "python3 render_muell.py "
            "TYPEN DATUM AUSGABE"
        )

        print()
        print("Beispiele:")
        print("bio")
        print("gelb")
        print("rest")
        print("blau")
        print("bio,gelb")
        print("gelb,rest")

        sys.exit(1)

    render(
        sys.argv[1],
        sys.argv[2],
        sys.argv[3],
    )