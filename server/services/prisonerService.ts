import type HmppsAuthClient from '../data/hmppsAuthClient'
import PrisonApiClient from '../api/prisonApiClient'
import {
  PrisonApiAdjustment,
  PrisonApiCharge,
  PrisonApiCourtCase,
  PrisonApiPrisoner,
  PrisonApiSentence,
} from '../@types/prisonApi/prisonClientTypes'
import FullPageError from '../model/FullPageError'

export default class PrisonerService {
  constructor(private readonly hmppsAuthClient: HmppsAuthClient) {}

  public async getPrisonerDetail(nomsId: string, userCaseloads: string[], token: string): Promise<PrisonApiPrisoner> {
    try {
      const prisonerDetail = await new PrisonApiClient(token).getPrisonerDetail(nomsId)
      if (userCaseloads.includes(prisonerDetail.agencyId)) {
        return prisonerDetail
      }
      throw FullPageError.notInCaseLoadError()
    } catch (error) {
      if (error?.status === 404) {
        throw FullPageError.notInCaseLoadError()
      } else {
        throw error
      }
    }
  }

  public async createCourtCase(bookingId: number, courtCase: PrisonApiCourtCase, token: string): Promise<number> {
    return new PrisonApiClient(token).createCourtCase(bookingId, courtCase)
  }

  public async createCharge(bookingId: number, courtCase: PrisonApiCharge, token: string): Promise<number> {
    return new PrisonApiClient(token).createCharge(bookingId, courtCase)
  }

  public async createSentence(bookingId: number, courtCase: PrisonApiSentence, token: string): Promise<number> {
    return new PrisonApiClient(token).createSentence(bookingId, courtCase)
  }

  public async createAdjustment(bookingId: number, adjustment: PrisonApiAdjustment, token: string): Promise<number> {
    return new PrisonApiClient(token).createAdjustment(bookingId, adjustment)
  }
}
