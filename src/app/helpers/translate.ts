export const translate = (isin: string) => {
    const table: any = {
      ja: 'yes',
      belangstelling: 'maybe',
      nee: 'no',
      onbekend: 'unknown',
      yes: 'ja',
      maybe: 'belangstelling',
      no: 'nee',
      unknown: 'onbekend'
    }
    return table[isin];
  }