import { Adjustment } from '../../../@types/adjustments/adjustmentsTypes'
import { PrisonApiPrisoner } from '../../../@types/prisonApi/prisonClientTypes'
import { Remand } from '../../../@types/warrantFolder/warrantFolderTypes'
import adjustmentTypes, { AdjustmentType } from './adjustmentTypes'

export default class AdjustmentsListViewModel {
  public adjustmentTypes = adjustmentTypes

  constructor(
    public prisonerDetail: PrisonApiPrisoner,
    public adjustments: Adjustment[],
    public relevantRemand: Remand[]
  ) {}

  public deductions(): AdjustmentType[] {
    return this.adjustmentTypes.filter(it =>
      [
        'REMAND',
        'TAGGED_BAIL',
        'LAWFULLY_AT_LARGE',
        'RESTORED_ADDITIONAL_DAYS_AWARDED',
        'SPECIAL_REMISSION',
        'TIME_SPENT_IN_CUSTODY_ABROAD',
      ].includes(it.value)
    )
  }

  public additions(): AdjustmentType[] {
    return this.adjustmentTypes.filter(it => ['UNLAWFULLY_AT_LARGE', 'ADDITIONAL_DAYS_AWARDED'].includes(it.value))
  }

  public getTotalDays(adjustmentType: AdjustmentType) {
    return this.adjustments
      .filter(it => it.adjustment.adjustmentType === adjustmentType.value)
      .map(a => a.adjustment.days)
      .reduce((sum, current) => sum + current, 0)
  }

  public getTotalDaysRelevantRemand() {
    return this.relevantRemand.map(a => a.days).reduce((sum, current) => sum + current, 0)
  }
}
