type AdjustmentType = {
  code: string
  description: string
}

const adjustmentTypes: AdjustmentType[] = [
  {
    code: 'REMAND',
    description: 'Remand',
  } as AdjustmentType,
  {
    code: 'UNUSED_REMAND',
    description: 'Unused remand',
  } as AdjustmentType,
  {
    code: 'RECALL_SENTENCE_TAGGED_BAIL',
    description: 'Recall tagged bail',
  } as AdjustmentType,
  {
    code: 'TAGGED_BAIL',
    description: 'Tagged bail',
  } as AdjustmentType,
  {
    code: 'RECALL_SENTENCE_REMAND',
    description: 'Recall remand',
  } as AdjustmentType,
  {
    code: 'LAWFULLY_AT_LARGE',
    description: 'Lawfully at large',
  } as AdjustmentType,
  {
    code: 'UNLAWFULLY_AT_LARGE',
    description: 'Unlawfully at large',
  } as AdjustmentType,
  {
    code: 'RESTORED_ADDITIONAL_DAYS_AWARDED',
    description: 'Restored additional days awarded',
  } as AdjustmentType,
  {
    code: 'ADDITIONAL_DAYS_AWARDED',
    description: 'Additional days awarded',
  } as AdjustmentType,
  {
    code: 'SPECIAL_REMISSION',
    description: 'Special remission',
  } as AdjustmentType,
]

export default adjustmentTypes
