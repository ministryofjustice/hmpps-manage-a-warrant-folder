export type AdjustmentType = {
  value: string
  text: string
  url: string
}

const adjustmentTypes: AdjustmentType[] = [
  {
    value: 'REMAND',
    text: 'Remand',
    url: 'remand',
  } as AdjustmentType,
  {
    value: 'TAGGED_BAIL',
    text: 'Tagged bail',
    url: 'tagged-bail',
  } as AdjustmentType,
  {
    value: 'LAWFULLY_AT_LARGE',
    text: 'Lawfully at large',
    url: 'lawfully-at-large',
  } as AdjustmentType,
  {
    value: 'UNLAWFULLY_AT_LARGE',
    text: 'Unlawfully at large',
    url: 'unlawfully-at-large',
  } as AdjustmentType,
  {
    value: 'RESTORED_ADDITIONAL_DAYS_AWARDED',
    text: 'Restored additional days awarded',
    url: 'restored-additional-days',
  } as AdjustmentType,
  {
    value: 'ADDITIONAL_DAYS_AWARDED',
    text: 'Additional days awarded',
    url: 'additional-days',
  } as AdjustmentType,
  {
    value: 'SPECIAL_REMISSION',
    text: 'Special remission',
    url: 'special-remission',
  } as AdjustmentType,
  {
    value: 'TIME_SPENT_IN_CUSTODY_ABROAD',
    text: 'Time spent in custody abroad',
    url: 'spent-abroad',
  } as AdjustmentType,
]

export default adjustmentTypes
