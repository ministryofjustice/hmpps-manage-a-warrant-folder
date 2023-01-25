import { type RequestHandler, Router } from 'express'

import asyncMiddleware from '../middleware/asyncMiddleware'
import AdjustmentRoutes from '../pages/adjustments/routes/adjustmentRoutes'
import ChargeRoutes from '../pages/charges/routes/chargeRoutes'
import CourtRoutes from '../pages/courts/routes/courtRoutes'
import RemandRoutes from '../pages/remand/routes/remandRoutes'
import SentenceRoutes from '../pages/sentences/routes/sentenceRoutes'
import StartRoute from '../pages/start/startRoute.ts/startRoutes'
import type { Services } from '../services'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function routes(service: Services): Router {
  const router = Router()
  const get = (path: string | string[], handler: RequestHandler) => router.get(path, asyncMiddleware(handler))
  const post = (path: string, handler: RequestHandler) => router.post(path, asyncMiddleware(handler))

  const courtRoutes = new CourtRoutes(service.prisonerService, service.warrantFormDataService)
  const chargeRoutes = new ChargeRoutes(service.prisonerService, service.warrantFormDataService)
  const sentenceRoutes = new SentenceRoutes(service.prisonerService, service.warrantFormDataService)
  const adjustmentRoutes = new AdjustmentRoutes(service.prisonerService)
  const remandRoutes = new RemandRoutes(service.prisonerService, service.warrantFolderService)
  const startRoutes = new StartRoute()

  get('/', (req, res, next) => {
    res.render('pages/index')
  })
  get('/start', startRoutes.start)

  get('/remand/:nomsId', remandRoutes.remandDetails)
  post('/remand/:nomsId', remandRoutes.submitRemand)

  get('/courts/:nomsId', courtRoutes.courtDetails)
  post('/courts/:nomsId', courtRoutes.submitCourtDetails)

  get('/charges/:nomsId', chargeRoutes.chargeDetails)
  post('/charges/:nomsId', chargeRoutes.submitChargeDetails)

  get('/sentences/:nomsId', sentenceRoutes.sentenceDetails)
  post('/sentences/:nomsId', sentenceRoutes.submitSentenceDetails)

  get('/adjustments/:nomsId', adjustmentRoutes.adjustmentDetails)
  post('/adjustments/:nomsId', adjustmentRoutes.submitAdjustment)

  return router
}
