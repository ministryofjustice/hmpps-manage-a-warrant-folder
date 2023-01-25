import WarrantFolderClient from '../api/warrantFolderClient'
import { Remand } from '../@types/warrantFolder/warrantFolderTypes'

export default class WarrantFolderService {
  public async calculateRelevantRemand(nomsId: string, token: string): Promise<Remand[]> {
    return new WarrantFolderClient(token).calculateRelevantRemand(nomsId)
  }
}
