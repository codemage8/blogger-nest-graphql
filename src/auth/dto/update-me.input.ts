import { InputType, OmitType } from '@nestjs/graphql'
import { CreateUserInput } from '~/user/dto/create-user-input'

@InputType()
export class UpdateMeInput extends OmitType(CreateUserInput, ['isAdmin']) {}
