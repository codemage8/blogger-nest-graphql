import { InputType, OmitType } from '@nestjs/graphql'
import { CreateUserInput } from '~/user/dto/create-user-input'

@InputType()
export class RegisterUserInput extends OmitType(CreateUserInput, ['isAdmin']) {}
