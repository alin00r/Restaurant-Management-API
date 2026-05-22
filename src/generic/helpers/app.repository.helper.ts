import { Injectable } from '@nestjs/common';
import { NoValidIdentifierGroupException } from '../exceptions/no-valid-identifier-group.exception';
import { normalizeValue } from '../utils/db.utils';

@Injectable()
export class AppRepositoryHelper {
  constructor(){
    
  }

  /**
   * Checks if all identifiers in the list are present and not null/undefined in the entity
   * @param opts - object containing the entity and the list of identifiers to check
   * @returns true if all identifiers are satisfied, false otherwise
   */
  public isGroupSatisfied<T>(opts: {
    entity: T;
    identifierList: (keyof T)[];
  }): boolean {
    for (const identifier of opts.identifierList) {
      const value = opts.entity[identifier];
      if (value === null || value === undefined) {
        return false;
      }
    }
    return true;
  }

  /**
   * Validates that at least one among the identifier groups is valid
   * @throws {NoValidIdentifierGroupException}
   */
  public validateAtLeastOneIdentifierGroupIsSatisfied<T>(opts: {
    entity: T;
    identifierGroups: (keyof T)[][];
  }): void {
    if (opts.identifierGroups.length === 0) return;
    for (const group of opts.identifierGroups) {
      if (
        this.isGroupSatisfied({
          entity: opts.entity,
          identifierList: group
        })
      ) {
        return;
      }
    }
    throw new NoValidIdentifierGroupException(opts.identifierGroups);
  }

  /**
   * Normalizes the specified attributes of an entity by applying the normalizeValue function to them.
   * @param opts  - object containing the entity and the list of attributes to normalize
   * @returns a new entity object with the specified attributes normalized
   */
  public normalizeIdentifiers<T>(opts: {
    entity: T;
    attributes: (keyof T)[];
  }): T {
    const newEntity = { ...opts.entity };

    for (const identifier of opts.attributes) {
      const value = normalizeValue(opts.entity[identifier]);
      if (value !== null && value !== undefined) {
        newEntity[identifier] = value;
      }
    }

    return newEntity;
  }

}
