import { CrawlingPage } from './CrawlingPage.js';

export interface CrawlingRepository {
  findAllPages(from: Date): Promise<CrawlingPage[]>;
  findByURL(url: string): Promise<CrawlingPage | null>;
  insert(page: CrawlingPage): Promise<void>;
}
