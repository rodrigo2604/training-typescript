import { CrawlingPage } from '../domain/CrawlingPage.js';
import { CrawlingRepository } from '../domain/CrawlingRepository.js';

export class FetchAllPagesFrom {
  constructor(private crawlingRepository: CrawlingRepository) {}

  async apply(from: number): Promise<CrawlingPage[]> {
    const fromDate = new Date(from);
    console.log(`Fetching pages from: ${fromDate}`);

    return this.crawlingRepository.findAllPages(fromDate);
  }
}
