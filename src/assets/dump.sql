CREATE TABLE IF NOT EXISTS
PHOTOTABLE
(
  Id            INTEGER PRIMARY KEY AUTOINCREMENT,
  PhotoId       INTEGER NOT NULL,
  FilePath      TEXT NOT NULL,
  WebPath       TEXT NOT NULL,
  Date          DATE NOT NULL,
  Latitude      INTEGER NOT NULL,
  Longitude     INTEGER NOT NULL,
  Species       TEXT,
  Species_Prob  INTEGER,
  Notes         TEXT NOT NULL
);
