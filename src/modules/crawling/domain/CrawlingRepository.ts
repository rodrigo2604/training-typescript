import { CrawlingPage } from './CrawlingPage.js';

export interface CrawlingRepository {
  findAllPages(from: Date): Promise<CrawlingPage[]>;
  findByURL(url: string): Promise<CrawlingPage>;
  insert(page: CrawlingPage): Promise<void>;
}
