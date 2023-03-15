type AdjustmentType = {
  value: string
  text: string
}

const adjustmentTypes: AdjustmentType[] = [
  {
    value: 'REMAND',
    text: 'Remand',
  } as AdjustmentType,
  {
    value: 'TAGGED_BAIL',
    text: 'Tagged bail',
  } as AdjustmentType,
  {
    value: 'LAWFULLY_AT_LARGE',
    text: 'Lawfully at large',
  } as AdjustmentType,
  {
    value: 'UNLAWFULLY_AT_LARGE',
    text: 'Unlawfully at large',
  } as AdjustmentType,
  {
    value: 'RESTORED_ADDITIONAL_DAYS_AWARDED',
    text: 'Restored additional days awarded',
  } as AdjustmentType,
  {
    value: 'ADDITIONAL_DAYS_AWARDED',
    text: 'Additional days awarded',
  } as AdjustmentType,
  {
    value: 'SPECIAL_REMISSION',
    text: 'Special remission',
  } as AdjustmentType,
]

export default adjustmentTypes
