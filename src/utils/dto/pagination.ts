import { Type } from '@nestjs/common'
import { Field, InputType, Int, ObjectType, registerEnumType } from '@nestjs/graphql'
import { IsInt, IsOptional, Min } from 'class-validator'

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
