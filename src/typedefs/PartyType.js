export type PartyType = {
    name: string,
    description: string,
    logoPath: string,
    answers: Array<{value: -1 | 0 | 1 | null, comment: string}>,
    concordance: number
}
