import {
  CrawlingPage,
  CrawlingPagePrimitives,
} from '../domain/CrawlingPage.js';
import { CrawlingRepository } from '../domain/CrawlingRepository.js';

export class AddCrawlingPage {
  constructor(private crawlingRepository: CrawlingRepository) {}

  async apply({
    URL,
    content,
    crawledAt,
    pageTitle,
    wordCount,
    tags = [],
  }: CrawlingPagePrimitives): Promise<CrawlingPagePrimitives> {
    const page = new CrawlingPage({
      content,
      crawledAt: new Date(crawledAt),
      pageTitle,
      tags,
      URL,
      wordCount,
    });

    await this.crawlingRepository.insert(page);

    return {
      URL,
      content,
      crawledAt,
      pageTitle,
      tags,
      wordCount,
    };
  }
}
