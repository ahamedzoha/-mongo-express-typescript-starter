import mongoose from "mongoose"

const UserSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  authentication: {
    password: {
      type: String,
      required: true,
      select: false,
    },
    salt: {
      type: String,
      required: true,
      select: false,
    },
    sessionToken: {
      type: String,
      required: false,
      select: false,
    },
  },

  name: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: false,
    default: "user",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

export const UserModel = mongoose.model("User", UserSchema)

export const getUser = () => UserModel.find()
export const getUserByEmail = (email: string) => UserModel.findOne({ email })
export const getUserBySessionToken = (sessionToken: string) =>
  UserModel.findOne({ "authentication.sessionToken": sessionToken })

export const getUserById = (id: string) => UserModel.findById(id)
export const createUser = (user: Record<string, any>) =>
  new UserModel(user).save().then((user) => user.toObject())

export const updateUserById = (id: string, user: Record<string, any>) =>
  UserModel.findByIdAndUpdate(id, user)

export const deleteUser = (id: string) =>
  UserModel.findByIdAndDelete({ _id: id })
