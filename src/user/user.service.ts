import { HttpException, HttpStatus, Injectable, UnprocessableEntityException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, ObjectId } from 'mongoose'
import { bcryptHash } from '~/utils/bcrypt'
import { CreateUserInput } from './dto/create-user-input'
import { User, UserDocument } from './entities/user.entity'

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

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

  findById(id: ObjectId) {
    return this.userModel.findById(id)
  }

  findByEmail(email: string) {
    return this.userModel.findOne({ email }).exec()
  }

  async update(id: ObjectId, input: CreateUserInput) {
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

  delete(id: ObjectId) {
    return this.userModel.deleteOne({ _id: id })
  }
}
