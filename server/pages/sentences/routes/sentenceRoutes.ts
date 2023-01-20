import { RequestHandler } from 'express'
import PrisonerService from '../../../services/prisonerService'
import WarrantFormDataService from '../../../services/warrantFormDataService'

export default class SentenceRoutes {
  constructor(
    private readonly prisonerService: PrisonerService,
    private readonly warrantFormDataService: WarrantFormDataService
  ) {}

  public sentenceDetails: RequestHandler = async (req, res): Promise<void> => {
    const { caseloads, token } = res.locals.user
    const { nomsId } = req.params

    const prisonerDetail = await this.prisonerService.getPrisonerDetail(nomsId, caseloads, token)

    return res.render('pages/sentences/form', {
      model: {
        prisonerDetail,
      },
    })
  }

  public submitSentenceDetails: RequestHandler = async (req, res): Promise<void> => {
    const { caseloads, token } = res.locals.user
    const { nomsId } = req.params

    const data = this.warrantFormDataService.getData(req, nomsId)

    data.sentence = {
      sentenceType: req.body['sentence-type'],
      sentenceCategory: '2003',
      sentenceDate: `${req.body['sentence-start-year']}-${req.body['sentence-start-month']}-${req.body['sentence-start-day']}`,
      years: req.body['sentence-length-years'],
      months: req.body['sentence-length-months'],
      weeks: req.body['sentence-length-weeks'],
      days: req.body['sentence-length-days'],
    }

    this.warrantFormDataService.setData(req, nomsId, data)

    this.warrantFormDataService.pushToNomis(req, nomsId, caseloads, token)

    return res.redirect('/')
  }
}
