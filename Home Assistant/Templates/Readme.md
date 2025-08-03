# Einbindung von Templates in Home Assistant

Um gewisse Funktionen in Home Assistant realisieren zu können,
benötigt man Templates.

Dies kann man bspw. mit dem FiledeFile editor in der configuration.yaml einbinden.
Ich habe mich dazu entschieden einen Ordner "templates" anzulegen und direkt den gesamten Inhalt dieses Ordners in die configuration.yaml zu laden.
<img width="823" height="578" alt="image" src="https://github.com/user-attachments/assets/1a16a651-f0d4-469e-b6e1-722f12df7c5d" />


Das Einbindung erfolgt durch:

```
# Templates aus dem Ordner templates inkludieren
template: !include_dir_merge_list templates/
```
