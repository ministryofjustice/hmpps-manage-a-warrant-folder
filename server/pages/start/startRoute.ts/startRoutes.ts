import { RequestHandler } from 'express'

export default class StartRoute {
  public start: RequestHandler = async (req, res): Promise<void> => {
    if (req.query.remand) {
      const prisonerId = req.query['remand-prisoner']
      return res.redirect(`/remand/${prisonerId}`)
    }
    if (req.query.warrant) {
      const prisonerId = req.query['warrant-prisoner']
      return res.redirect(`/courts/${prisonerId}`)
    }
    if (req.query.adjustments) {
      const prisonerId = req.query['adjustments-prisoner']
      return res.redirect(`/adjustments/${prisonerId}`)
    }
    return res.redirect('/')
  }
}
