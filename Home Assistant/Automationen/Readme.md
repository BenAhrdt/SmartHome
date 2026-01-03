# ToIob.yaml
In dieser Automation, wird Homeassistant Seite aus bei Zustandsänderung einer ENtität, welche mit dem Label ToIob versehen ist ein entsprechender State, channel und ein Device auf der IoBroker Seite erstellt.
Es können auch komplette Geräte mit Label versehen werden.

# FromIob.yaml
In dieser Automation, wird ein eingehendes MQTT Topic analysiert und es wird eine entsprechende Entität geschrieben

# Periodic.yaml
In dieser Automation, wird periodisch (standard jede min) eine discovery der mit Label versehenen Entitäten gesendet.
Wurde ein Label entfernt, so wird diese Entität nicht mehr erkannt (unterschied zum letzten Zustand) und der IoBroker State wird gelöscht.
