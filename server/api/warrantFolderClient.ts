import config, { ApiConfig } from '../config'
import RestClient from '../data/restClient'
import { Remand } from '../@types/warrantFolder/warrantFolderTypes'

export default class WarrantFolderClient {
  restClient: RestClient

  constructor(token: string) {
    this.restClient = new RestClient('Digital Warrant API', config.apis.warrantFolder as ApiConfig, token)
  }

  async calculateRelevantRemand(nomsId: string): Promise<Remand[]> {
    return this.restClient.post({ path: `/relevant-remand/${nomsId}` }) as Promise<Remand[]>
  }
}
