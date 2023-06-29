import AWS, { DynamoDB } from 'aws-sdk';
import { CrawlingRepository } from '../domain/CrawlingRepository.js';
import { CrawlingPage } from '../domain/CrawlingPage.js';

export class CrawlingRepositoryDynamo implements CrawlingRepository {
  private readonly tableName = 'CRAWLING_PAGES'; // TODO: From a config module
  private readonly db: AWS.DynamoDB;

  constructor() {
    AWS.config.update({ region: 'REGION' });

    this.db = new AWS.DynamoDB({ apiVersion: '2012-08-10' });
  }

  async createTable(): Promise<void> {
    const params: DynamoDB.Types.CreateTableInput = {
      AttributeDefinitions: [
        {
          AttributeName: 'URL',
          AttributeType: 'S',
        },
        {
          AttributeName: 'pageTitle',
          AttributeType: 'S',
        },
        {
          AttributeName: 'content',
          AttributeType: 'S',
        },
        {
          AttributeName: 'wordCount',
          AttributeType: 'N',
        },
        {
          AttributeName: 'tags',
          AttributeType: 'SS',
        },
        {
          AttributeName: 'crawledAt',
          AttributeType: 'N',
        },
      ],
      KeySchema: [
        {
          AttributeName: 'URL',
          KeyType: 'HASH',
        },
        {
          AttributeName: 'crawledAt',
          KeyType: 'RANGE',
        },
      ],
      ProvisionedThroughput: {
        // TODO: check features
        ReadCapacityUnits: 1,
        WriteCapacityUnits: 1,
      },
      TableName: this.tableName,
    };

    return new Promise((resolve, reject) => {
      this.db.createTable(params, (err) => {
        if (err) {
          return reject(
            new Error(
              `Error during Dynamo DB table creation: ${this.tableName}`,
            ),
          );
        }

        return resolve();
      });
    });
  }

  findAllPages(from: Date): Promise<CrawlingPage[]> {
    const params: DynamoDB.Types.QueryInput = {
      TableName: this.tableName,
      KeyConditionExpression: '#timestampAttr > :timestampValue',
      ExpressionAttributeNames: {
        '#timestampAttr': 'crawledAt',
      },
      ProjectionExpression: 'URL, pageTitle, wordCount, tags, crawledAt',
      Limit: 50,
      ExpressionAttributeValues: {
        ':timestampValue': { N: from.getTime().toString() },
      },
      ScanIndexForward: false,
    };

    return new Promise<CrawlingPage[]>((resolve, reject) => {
      this.db.query(params, (err, data) => {
        if (err) {
          return reject(new Error('Error during list crawling pages'));
        }

        resolve(data.Items.map((item) => CrawlingPage.fromPrimitives(item)));
      });
    });
  }

  findByURL(url: string): Promise<CrawlingPage | null> {
    const params: DynamoDB.Types.GetItemInput = {
      Key: {
        URL: {
          S: url,
        },
      },
      TableName: this.tableName,
      ProjectionExpression:
        'URL, pageTitle, content, wordCount, tags, crawledAt',
    };

    return new Promise<CrawlingPage | null>((resolve, reject) => {
      this.db.getItem(params, (err, data) => {
        if (err) {
          return reject(new Error('Error during list crawling pages'));
        }

        resolve(data.Item ? CrawlingPage.fromPrimitives(data.Item): null);
      });
    });
  }

  insert(page: CrawlingPage): Promise<void> {
    const { URL, content, crawledAt, pageTitle, tags, wordCount } =
      page.toPrimitives();
    const params: DynamoDB.Types.PutItemInput = {
      TableName: this.tableName,
      Item: {
        URL: { S: URL },
        content: { S: content },
        crawledAt: { N: crawledAt.toString() },
        pageTitle: { S: pageTitle },
        tags: { SS: tags },
        wordCount: { N: wordCount.toString() },
      },
    };

    return new Promise<void>((resolve, reject) => {
      this.db.putItem(params, (err) => {
        if (err) {
          return reject(new Error('Error during list crawling pages'));
        }

        resolve();
      });
    });
  }
}
