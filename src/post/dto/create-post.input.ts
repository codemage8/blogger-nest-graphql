import { Field, InputType } from '@nestjs/graphql'
import { IsOptional, IsString } from 'class-validator'

@InputType()
export class CreatePostInput {
  @Field()
  @IsString()
  title: string

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  content?: string
}
