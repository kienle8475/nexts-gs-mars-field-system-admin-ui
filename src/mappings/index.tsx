import { Brand, GameMode, GameResult, GameStatus, PackType, PurchasesProduct } from "@/enums/model";


type Mapping<T extends string> = Record<T, { label: string }>;

type ColorMapping<T extends string> = Record<T, { label: string, color: string }>;

type ExportTemplateMapping<T extends string> = Record<T, { fileUrl: string, fileName: string, sheetName: string }>;


export const gameStatusMapping: Mapping<GameStatus> = {
  COMPLETED: {
    label: "Complete",
  },
  UNCOMPLETED: {
    label: "Unknown",
  },
};

export const gameResultMapping: Mapping<GameResult> = {
  UNKNOWN: {
    label: "Unknown"
  },
  WIN: {
    label: "Win"
  },
  LOST: {
    label: "Lost"
  },
};

export const gameModeMapping: Mapping<GameMode> = {
  UNKNOWN: { label: "Unknown" },
  AR: { label: "AR" },
  NON_AR: { label: "Non AR" },
  AR_TRACK: { label: "AR Tracking" },
}

export const purchaseProductMapping: Mapping<PurchasesProduct> = {
  HEINEKEN_00: { label: 'Heineken 0.0' },
  HEINEKEN_SLIVER: { label: 'Heineken Silver' },
  STRONGBOW_ORIGIN: { label: 'Strongbow nguyên bản' },
  HEINEKEN_FAMILY: { label: 'Heineken Family' },
  TIGER_FAMILY: { label: 'Tiger Family' },
  STRONGBOW_FAMILY: { label: 'Strongbow Family' },
  SNOW_BEER_EDELWEISS: { label: 'Bia Tuyết Edelweiss' },
  BEER_VIET: { label: 'Bia Việt' },
  LARUE_FAMILY: { label: 'Larue Family' },
  DEFAULT: { label: 'Không xác định' }
}

export const packTypeMapping: Mapping<PackType> = {
  PACK_6: { label: 'Pack 6' },
  CASE: { label: 'Thùng' },
  PACK: { label: 'Lốc' },
  CAN: { label: 'Lon' },
  DEFAULT: { label: 'Không xác định' }
}

export const brandMapping: ColorMapping<Brand> = {
  HEINEKEN: { label: 'Heineken', color: '#008200' },
  TIGER: { label: 'Tiger', color: '#2237a4' },
  DEFAULT: { label: 'Không xác định', color: '#000000' }
}

export const exportTemplateMapping: ExportTemplateMapping<Brand> = {
  HEINEKEN: {
    fileUrl: 'templates/heineken_hunter_game_export_data_template.xlsx',
    fileName: 'Heineken Hunter Game Customer Data',
    sheetName: 'Heineken'
  },
  TIGER: {
    fileUrl: 'templates/tiger_hunter_game_export_data_template.xlsx',
    fileName: 'Tiger Hunter Game Customer Data',
    sheetName: 'Tiger'
  },
  DEFAULT: {
    fileUrl: 'templates/heineken_hunter_game_export_data_template.xlsx',
    fileName: 'Hunter Game Customer Data',
    sheetName: 'Heineken'
  },
}