export interface FeatureCollection { features: any[], type: string }
export interface Feature { type: string, geometry: any, properties: { GM_CODE: string, GM_NAAM: string, AANT_INW: number } }
export interface MunicipalityData { MUN_CODE: string, MUN_NAME: string, ISIN: string }