import { GenericObject } from '../types/GenericObject.js';

export function deepCopyList<T extends GenericObject>(list: T[]): T[] {
  return structuredClone(list);
}
