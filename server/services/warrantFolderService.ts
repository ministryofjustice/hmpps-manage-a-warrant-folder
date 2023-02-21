import WarrantFolderClient from '../api/warrantFolderClient'
import { RemandResult } from '../@types/warrantFolder/warrantFolderTypes'

export default class WarrantFolderService {
  public async calculateRelevantRemand(nomsId: string, token: string): Promise<RemandResult> {
    return new WarrantFolderClient(token).calculateRelevantRemand(nomsId)
  }
}
