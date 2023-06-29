import { CrawlingPage } from '../domain/CrawlingPage.js';
import { CrawlingRepository } from '../domain/CrawlingRepository.js';

export class CrawlingRepositoryInMemory implements CrawlingRepository {
  private defaultList: CrawlingPage[];

  constructor() {
    this.defaultList = [
      new CrawlingPage({
        content: 'content1',
        crawledAt: new Date('2023-04-01'),
        pageTitle: 'Cooking with Typescript',
        tags: ['kitchen', 'recipes'],
        URL: 'https://cooking-with-ts.io',
        wordCount: 5,
      }),
      new CrawlingPage({
        content: 'content2',
        crawledAt: new Date('2023-05-01'),
        pageTitle: 'Building with Typescript',
        tags: ['hammer', 'screwdriver'],
        URL: 'https://tooling-with-ts.io',
        wordCount: 10,
      }),
      new CrawlingPage({
        content: 'content3',
        crawledAt: new Date('2023-06-01'),
        pageTitle: 'Playing with Typescript',
        tags: ['mouse', 'keyboard'],
        URL: 'https://playing-with-ts.io',
        wordCount: 20,
      }),
    ];
  }

  findAllPages(_from: Date): Promise<CrawlingPage[]> {
    return Promise.resolve(this.defaultList);
  }

  findByURL(url: string): Promise<CrawlingPage | null> {
    const found = this.defaultList.find((page) => page.URL === url);

    return Promise.resolve(found ?? null);
  }

  insert(page: CrawlingPage): Promise<void> {
    this.defaultList.push(page);

    return Promise.resolve();
  }
}
