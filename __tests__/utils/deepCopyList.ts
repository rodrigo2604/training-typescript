import { deepCopyList } from '../../src/utils/deepCopyList.js';

test('should deep copy a list of plain objects', () => {
  const fakeList = [
    {
      name: 'Alice',
      age: 30,
    },
    {
      name: 'Bob',
      age: 30,
    },
    {
      name: 'Charlie',
      age: 30,
    },
  ];
  const result = deepCopyList(fakeList);

  expect(result).toEqual(fakeList);

  result.at(0).age += 1;

  expect(result.at(0)).not.toEqual(fakeList.at(0));
});

test('should deep copy a list of nested objects', () => {
  const fakeList = [
    {
      name: 'Alice',
      age: 30,
      address: {
        city: 'Porto',
        zipCode: 111,
      },
    },
    {
      name: 'Bob',
      age: 30,
      address: {
        city: 'Barcelona',
        zipCode: 222,
      },
    },
    {
      name: 'Charlie',
      age: 30,
      address: {
        city: 'Paris',
        zipCode: 333,
      },
    },
  ];
  const result = deepCopyList(fakeList);

  expect(result).toEqual(fakeList);

  result.at(0).address.city = 'Madrid';

  expect(result.at(0).address).not.toEqual(fakeList.at(0).address);
});

test('should deep copy a list of nested objects with arrays', () => {
  const fakeList = [
    {
      name: 'Alice',
      age: 30,
      contact: {
        city: 'Porto',
        zipCode: 111,
        phones: ['1', '2', '3'],
      },
    },
    {
      name: 'Bob',
      age: 30,
      contact: {
        city: 'Barcelona',
        zipCode: 222,
        phones: ['4', '5', '6'],
      },
    },
    {
      name: 'Charlie',
      age: 30,
      contact: {
        city: 'Paris',
        zipCode: 333,
        phones: ['7', '8', '9'],
      },
    },
  ];
  const result = deepCopyList(fakeList);

  expect(result).toEqual(fakeList);

  result.at(0).contact.phones.push('10');

  expect(result.at(0).contact.phones).not.toEqual(
    fakeList.at(0).contact.phones,
  );
});
