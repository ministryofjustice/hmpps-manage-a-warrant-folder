import { type RequestHandler, Router } from 'express'

import asyncMiddleware from '../middleware/asyncMiddleware'
import AdjustmentJourneyRoutes from '../pages/adjustments/routes/adjustmentJourneyRoutes'
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
  const adjustmentRoutes = new AdjustmentRoutes(service.prisonerService, service.adjustmentsService)
  const adjustmentJourneyRoutes = new AdjustmentJourneyRoutes(
    service.prisonerService,
    service.warrantFolderService,
    service.adjustmentsService
  )
  const remandRoutes = new RemandRoutes(
    service.prisonerService,
    service.warrantFolderService,
    service.bulkRemandCalculationService
  )
  const startRoutes = new StartRoute()

  get('/', (req, res, next) => {
    res.render('pages/index')
  })
  get('/start', startRoutes.start)

  get('/remand/bulk', remandRoutes.bulkRemand)
  post('/remand/bulk', remandRoutes.submitBulkRemand)
  get('/remand/:nomsId', remandRoutes.remandDetails)
  post('/remand/:nomsId', remandRoutes.submitRemand)

  get('/courts/:nomsId', courtRoutes.courtDetails)
  post('/courts/:nomsId', courtRoutes.submitCourtDetails)

  get('/charges/:nomsId', chargeRoutes.chargeDetails)
  post('/charges/:nomsId', chargeRoutes.submitChargeDetails)

  get('/sentences/:nomsId', sentenceRoutes.sentenceDetails)
  post('/sentences/:nomsId', sentenceRoutes.submitSentenceDetails)

  get('/adjustments/:nomsId', adjustmentRoutes.list)
  get('/adjustments/:nomsId/create', adjustmentRoutes.create)
  get('/adjustments/:nomsId/edit/:adjustmentId', adjustmentRoutes.update)
  post('/adjustments/:nomsId/create', adjustmentRoutes.submitAdjustment)
  post('/adjustments/:nomsId/edit/:adjustmentId', adjustmentRoutes.submitAdjustment)
  post('/adjustments/:nomsId/delete/:adjustmentId', adjustmentRoutes.deleteAdjustment)

  get('/adjustments', adjustmentJourneyRoutes.entry)
  get('/adjustments/:nomsId/start', adjustmentJourneyRoutes.start)
  get('/adjustments/:nomsId/list', adjustmentJourneyRoutes.list)
  get('/adjustments/:nomsId/remand', adjustmentJourneyRoutes.remand)
  post('/adjustments/:nomsId/remand', adjustmentJourneyRoutes.remandSubmit)

  return router
}
