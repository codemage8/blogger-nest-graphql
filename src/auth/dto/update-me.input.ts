import { InputType } from '@nestjs/graphql'
import { CreateUserInput } from '~/user/dto/create-user-input'

@InputType()
export class UpdateMeInput extends CreateUserInput {}
