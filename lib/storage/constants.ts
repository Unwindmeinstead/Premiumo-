/**
 * Storage keys and schema version for P+.
 * Bump STORAGE_VERSION when changing payload shape; migrate in persist layer.
 */
export const STORAGE_KEYS = {
  TRADES: 'premiumo-plus-trades',
  TRADES_BACKUP: 'premiumo-plus-trades-backup',
} as const

export const STORAGE_VERSION = 1
