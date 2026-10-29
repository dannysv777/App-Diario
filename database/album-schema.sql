-- Proposal for MySQL 8+. Not applied automatically.
CREATE TABLE album_accounts (
  id CHAR(36) PRIMARY KEY,
  email VARCHAR(254) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE albums (
  id CHAR(36) PRIMARY KEY,
  title VARCHAR(160) NOT NULL,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE album_members (
  album_id CHAR(36) NOT NULL,
  account_id CHAR(36) NOT NULL,
  PRIMARY KEY (album_id, account_id),
  FOREIGN KEY (album_id) REFERENCES albums(id),
  FOREIGN KEY (account_id) REFERENCES album_accounts(id)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE album_photos (
  id CHAR(36) PRIMARY KEY,
  album_id CHAR(36) NOT NULL,
  uploaded_by CHAR(36) NOT NULL,
  storage_key VARCHAR(255) NOT NULL UNIQUE,
  mime_type VARCHAR(40) NOT NULL,
  byte_size BIGINT UNSIGNED NOT NULL,
  width INT UNSIGNED NOT NULL,
  height INT UNSIGNED NOT NULL,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  UNIQUE KEY photo_album (id, album_id),
  FOREIGN KEY (album_id, uploaded_by) REFERENCES album_members(album_id, account_id)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE album_entries (
  id CHAR(36) PRIMARY KEY,
  album_id CHAR(36) NOT NULL,
  author_id CHAR(36) NOT NULL,
  photo_id CHAR(36),
  title VARCHAR(160) NOT NULL,
  message TEXT NOT NULL,
  display_date VARCHAR(80),
  version INT UNSIGNED NOT NULL DEFAULT 1,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  INDEX album_chronology (album_id, created_at),
  FOREIGN KEY (album_id, author_id) REFERENCES album_members(album_id, account_id),
  FOREIGN KEY (photo_id, album_id) REFERENCES album_photos(id, album_id)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
