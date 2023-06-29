# Training Dynamo DB and GraphQL with Typescript

## Deep clone utility
It has been used the `structuredClone` utility included in NodeJS >17. Tests are provided at `__tests__` root folder

## Dynamo DB Crawling implementation
The implementation of crawling repository for DynamoDB is included at `src/modules/crawling/infrastructure/CrawlingRepositoryDynamo.ts`.

On the other hand, a implementation in memory has been developed in order to test GraphQL queries.

## Example queries for GraphQL API

- Fetch all pages ordered by `crawledAt`
  ```txt
  query GetPages {
    pages(from: 12334) {
      URL
      content
    }
  }
  ```

- Add a new crawled page
  
  ```txt
  mutation AddPage {
    addPage(
      URL: "https://crawling-with-ts.io"
      content: "content4"
      crawledAt: 1688063755733
      pageTitle: "Crawling with TS"
      wordCount: 45
    ) {
      URL
      content
      crawledAt
    }
  }
  ```

- Search a page by its URL
  ```txt
  query SearchPage {
    page(url: "https://cooking-with-ts.io") {
      URL
      content
      crawledAt
    }
  }
  ```

  To test the GraphQL API,
  ```sh
  npm run build && npm start
  ```
