import { Field, InputType } from '@nestjs/graphql'
import { IsBoolean, IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator'

@InputType()
export class CreateUserInput {
  @Field()
  @IsEmail()
  email: string

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  firstName?: string

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  lastName?: string

  @Field()
  @IsString()
  @IsNotEmpty()
  password: string

  @Field()
  @IsBoolean()
  isAdmin: boolean
}
