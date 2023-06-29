export type CrawlingPagePrimitives = {
  URL: string;
  pageTitle: string;
  content: string;
  wordCount: number;
  tags: string[];
  crawledAt: number;
};

export class CrawlingPage {
  URL: string;
  pageTitle: string;
  content: string;
  wordCount: number;
  tags: string[];
  crawledAt: Date;

  constructor(props: {
    URL: string;
    pageTitle: string;
    content: string;
    wordCount: number;
    crawledAt: Date;
    tags?: string[];
  }) {
    this.URL = props.URL;
    this.pageTitle = props.pageTitle;
    this.content = props.content;
    this.wordCount = props.wordCount;
    this.tags = props.tags || [];
    this.crawledAt = props.crawledAt;
  }

  static fromPrimitives(plainObject: Record<string, unknown>): CrawlingPage {
    // TODO: validate with schema to protect domain
    return new CrawlingPage({
      URL: plainObject.URL as string,
      content: plainObject.content as string,
      crawledAt: new Date(plainObject.crawledAt as number),
      pageTitle: plainObject.pageTitle as string,
      tags: plainObject.tags as string[],
      wordCount: plainObject.wordCount as number,
    });
  }

  toPrimitives(): CrawlingPagePrimitives {
    return {
      URL: this.URL,
      pageTitle: this.pageTitle,
      content: this.content,
      wordCount: this.wordCount,
      tags: this.tags,
      crawledAt: this.crawledAt.getTime(),
    };
  }
}
