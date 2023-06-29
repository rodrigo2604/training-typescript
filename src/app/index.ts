import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { CrawlingRepositoryInMemory } from '../modules/crawling/infrastructure/CrawlingRepositoryInMemory.js';
import { FetchAllPagesFrom } from '../modules/crawling/application/FetchAllPagesFrom.js';
import {
  CrawlingPage,
  CrawlingPagePrimitives,
} from '../modules/crawling/domain/CrawlingPage.js';
import { AddCrawlingPage } from '../modules/crawling/application/AddCrawlingPage.js';
import { GraphQLScalarType, Kind } from 'graphql';
import { SearchPage } from '../modules/crawling/application/SearchPage.js';

const repoInMemory = new CrawlingRepositoryInMemory();

const typeDefs = `#graphql
  scalar Date

  type CrawlingPage {
    URL: String
    pageTitle: String
    content: String
    wordCount: Int
    tags: [String]
    crawledAt: Date
  }

  type Query {
    pages(from: Date): [CrawlingPage]
    page(url: String): CrawlingPage
  }

  type Mutation {
    addPage(
      URL: String!
      content: String!
      crawledAt: Date!
      wordCount: Int!
      pageTitle: String!
      tags: String
    ): CrawlingPage
  }
`;

const resolvers = {
  Date: new GraphQLScalarType({
    name: 'Date',
    description: 'Date custom scalar type',
    parseValue(value: number) {
      return new Date(value);
    },
    serialize(value: Date) {
      return value.getTime();
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.INT) {
        return new Date(Number(ast.value))
      }
      return null;
    },
  }),
  Query: {
    pages: (_root, args): Promise<CrawlingPage[]> => {
      const { from } = args;
      const fetchAllPagesFrom = new FetchAllPagesFrom(repoInMemory);

      return fetchAllPagesFrom.apply(from);
    },
    page: (_root, args): Promise<CrawlingPage> => {
      const { url } = args;
      const fetchAllPagesFrom = new SearchPage(repoInMemory);

      return fetchAllPagesFrom.apply(url);
    }
  },
  Mutation: {
    addPage: (_root, args): Promise<CrawlingPagePrimitives> => {
      const { URL, content, pageTitle, crawledAt, wordCount, tags = [] } = args;
      const addPage = new AddCrawlingPage(repoInMemory);

      return addPage.apply({
        URL,
        content,
        pageTitle,
        crawledAt,
        wordCount,
        tags,
      });
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const { url } = await startStandaloneServer(server, {
  listen: { port: process.env.PORT ? Number(process.env.PORT) : 4000 },
});

console.log(`🚀  Server ready at: ${url}`);
