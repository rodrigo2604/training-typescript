import { CrawlingPage } from '../domain/CrawlingPage.js';
import { CrawlingRepository } from '../domain/CrawlingRepository.js';

export class SearchPage {
  constructor(private crawlingRepository: CrawlingRepository) {}

  async apply(url: string): Promise<CrawlingPage> {
    console.log(`Searching pages with url: ${url}`);

    return this.crawlingRepository.findByURL(url);
  }
}
