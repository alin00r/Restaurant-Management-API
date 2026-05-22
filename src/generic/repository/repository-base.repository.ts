import { Logger } from '@nestjs/common';
import { FilterQuery,Model,SortOrder } from 'mongoose';
import { EntityOmited } from '../types/entity-omited-fields.type';
import { AppRepositoryHelper } from '../helpers/app.repository.helper';
import { normalizeValue } from '../utils/db.utils';

export class AppBaseRepository<T> {
    protected normalizedAttributes: (keyof EntityOmited<T>)[];

  constructor(
    protected model: Model<T>,
    protected identifiersGroups: (keyof EntityOmited<T>)[][],
    protected repoHelper: AppRepositoryHelper,
    protected logger: Logger,
    protected additionalNormalizedAttributes: (keyof EntityOmited<T>)[] = [],
    protected config: {
      defaultSelect?: string
    } = {}
  ) {
     const allNormalizedAttributesSet = new Set([
      ...identifiersGroups.flat(),
      ...additionalNormalizedAttributes
    ]);
    this.normalizedAttributes = [...allNormalizedAttributesSet];

  }

  public async create(entity: EntityOmited<T>): Promise<T> {
    this.repoHelper.validateAtLeastOneIdentifierGroupIsSatisfied<
      EntityOmited<T>
    >({
      entity: entity,
      identifierGroups: this.identifiersGroups
    });
    const normalized = this.repoHelper.normalizeIdentifiers({
      entity: entity,
      attributes: this.normalizedAttributes
    });
    const created = await this.model.create(normalized as any);
    return (typeof (created as any).toObject === 'function')
      ? (created as any).toObject() as T
      : (created as any) as T;
  }

  public async findOneByIdentifier(identifier: string): Promise<T | null> {
    const normalizedIdentifier = normalizeValue(identifier);

    if (/^[0-9a-fA-F]{24}$/.test(normalizedIdentifier)) {
      const foundById = await this.model.findById(normalizedIdentifier).lean().exec();
      if (foundById) {
        return foundById as T;
      }
    }

    for (const group of this.identifiersGroups) {
      if (group.length !== 1) {
        continue;
      }

      const [key] = group;
      const found = await this.model
        .findOne({ [key]: normalizedIdentifier } as any)
        .lean()
        .exec();

      if (found) {
        return found as T;
      }
    }

    return null;
  }

  public findAll() {
    return this.model.find({}).exec();
  }

  public findAllSorted(sort: Record<string, SortOrder>) {
    return this.model.find({}).sort(sort).exec();
  }

  private toSelect(select?: string): string | undefined {
    if (select === null || select === undefined) return this.config.defaultSelect;
    return select;
  }

  public findManyByCondition(args: {
    condition: FilterQuery<T>;
    select?: string;
    skip?: number;
    limit?: number;
    sort?: Record<string, SortOrder>;
  }): Promise<T[]> {
    const normalizedCondition = this.normalizeCondition(args.condition);
    const select = this.toSelect(args.select);
    let query = this.model.find(normalizedCondition);
    if (select) query = query.select(select);
    if (args.skip) query = query.skip(args.skip);
    if (args.limit) query = query.limit(args.limit);
    if (args.sort) query = query.sort(args.sort);
    return query.exec();
  }

  public normalizeCondition(condition: FilterQuery<T>): FilterQuery<T> {
    return this.repoHelper.normalizeIdentifiers<FilterQuery<T>>({
      entity: condition,
      attributes: this.normalizedAttributes
    });
  }

}
