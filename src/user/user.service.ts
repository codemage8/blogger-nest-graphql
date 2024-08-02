import { HttpException, HttpStatus, Injectable, UnprocessableEntityException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { InjectModel } from '@nestjs/mongoose'
import { FilterQuery, Model, Types } from 'mongoose'
import { title } from 'process'
import { AllConfigType } from '~/config/config.type'
import { SearchUsersInput } from '~/user/dto/search-users.input'
import { SearchUsersResponse } from '~/user/dto/search-users.response'
import { bcryptHash } from '~/utils/bcrypt'
import { searchPaginated } from '~/utils/pagination'
import { CreateUserInput } from './dto/create-user-input'
import { User, UserDocument } from './entities/user.entity'

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private configService: ConfigService<AllConfigType>
  ) {}

  async create(input: CreateUserInput) {
    const _user = await this.userModel.findOne({ email: input.email })
    if (_user) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          email: 'emailAlreadyExists',
        },
      })
    }
    const newUser = new this.userModel({ ...input, password: await bcryptHash(input.password) })
    return newUser.save()
  }

  findById(id: Types.ObjectId) {
    return this.userModel.findById(id)
  }

  findByEmail(email: string) {
    return this.userModel.findOne({ email }).exec()
  }

  async update(id: Types.ObjectId | string, input: CreateUserInput) {
    const newInput = { ...input }

    // Check the password existence
    if (input.password) {
      newInput.password = await bcryptHash(input.password)
    }

    // Check the email
    if (input.email) {
      const _user = await this.userModel.findOne({
        email: input.email,
      })
      if (_user && _user.id !== id) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            email: 'emailAlreadyExists',
          },
        })
      }
    }

    const returned = await this.userModel.findByIdAndUpdate(id, newInput, { new: true })
    if (!returned) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND)
    }
  }

  delete(id: Types.ObjectId) {
    return this.userModel.deleteOne({ _id: id })
  }

  async search(input: SearchUsersInput): Promise<SearchUsersResponse> {
    const { email, isAdmin, limit } = input
    const filter: FilterQuery<User> = {}
    if (email) {
      filter.email = { $regex: title, $options: 'i' }
    }

    if (typeof isAdmin === 'boolean') {
      filter.isAdmin = isAdmin
    }

    return searchPaginated({
      model: this.userModel,
      filter,
      input: {
        ...input,
        limit: Math.min(this.configService.getOrThrow('app.maxPageLimit', { infer: true }), limit),
      },
    })
  }
}
