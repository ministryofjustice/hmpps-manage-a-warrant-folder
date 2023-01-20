import { PrisonApiCharge, PrisonApiCourtCase, PrisonApiSentence } from '../@types/prisonApi/prisonClientTypes'

type WarrantFormData = {
  courtCase?: PrisonApiCourtCase
  charge?: PrisonApiCharge
  sentence?: PrisonApiSentence
}

export default WarrantFormData
