import { Type } from '@nestjs/common'
import { Field, InputType, Int, ObjectType, registerEnumType } from '@nestjs/graphql'
import { IsInt, IsOptional, Min } from 'class-validator'
import { FilterQuery, Model, Types } from 'mongoose'

export enum SortDirection {
  ASCENDING = 1,
  DESCENDING = -1,
}

registerEnumType(SortDirection, {
  name: 'SortDirection',
})

@InputType()
export abstract class PaginationInput {
  @Field({ nullable: true })
  cursor?: string

  @Field(() => Int)
  @IsInt()
  @Min(1)
  limit: number

  @Field(() => Int, { nullable: true })
  @IsInt()
  @Min(1)
  @IsOptional()
  skip?: number

  @Field(() => SortDirection, { nullable: true })
  sortDirection?: SortDirection
}

export interface IPaginatedType<T> {
  items: T[]
  nextCursor?: string
  totalCount: number
}

export function Paginated<T>(classRef: Type<T>): Type<IPaginatedType<T>> {
  @ObjectType({ isAbstract: true })
  abstract class PaginatedType implements IPaginatedType<T> {
    @Field(() => [classRef], { nullable: false })
    items: T[]

    @Field(() => Int)
    totalCount: number

    @Field({ nullable: true })
    nextCursor?: string
  }
  return PaginatedType as Type<IPaginatedType<T>>
}

type WithId<T> = { _id: Types.ObjectId } & T

interface SearchPaginatedParams<Doc extends WithId<unknown>> {
  model: Model<Doc>
  filter: FilterQuery<Doc>
  input: PaginationInput
}

export async function searchPaginated<
  Doc extends WithId<unknown>,
  Projected extends WithId<unknown> = Doc,
>({ model, filter, input }: SearchPaginatedParams<Doc>): Promise<IPaginatedType<Projected>> {
  const { cursor, sortDirection, limit, skip } = input

  // Count documents matching filter first
  const totalCount = await model.find(filter).countDocuments()

  // If has cursor parameter, add it to filter
  const _filter = { ...filter }
  const _sortDirection = sortDirection ?? SortDirection.DESCENDING
  if (cursor) {
    _filter._id = _sortDirection === SortDirection.DESCENDING ? { $lte: cursor } : { $gte: cursor }
  }
  const sort = { _id: _sortDirection }
  let query = model.find<Projected>(_filter)
  if (skip && !cursor) {
    query = query.skip(skip)
  }
  const items = await query
    .limit(limit + 1)
    .sort(sort)
    .exec()
  const hasMore = items.length > limit
  const nextCursor = hasMore ? items[limit]._id.toString() : undefined

  if (hasMore) {
    items.pop()
  }

  return {
    totalCount,
    items,
    nextCursor,
  }
}
