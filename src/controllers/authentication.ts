import { createUser, getUserByEmail } from "../db/users"
import express from "express"
import { authentication, random } from "../helpers"

export const login = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(400).send({ message: "Missing required fields" })
    }
    const user = await getUserByEmail(email).select(
      "+authentication.salt +authentication.password"
    )
    if (!user) {
      return res.status(400).send({ message: "User does not exist" })
    }

    const expectedHash = authentication(user.authentication.salt, password)
    if (user.authentication.password !== expectedHash.toString()) {
      return res.status(403).send({ message: "Invalid password" })
    }

    const salt = random()

    user.authentication.sessionToken = authentication(
      salt,
      user._id.toString()
    ).toString()

    await user.save()

    res.cookie("ZH-AUTH-GUARD", user.authentication.sessionToken, {
      domain: "localhost",
      path: "/",
    })

    return res.status(200).json(user).end()
  } catch (error) {
    return res.status(500).send({ message: error.message })
  }
}

export const register = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password, name, userName } = req.body
    if (!email || !password || !name) {
      return res.status(400).send({ message: "Missing required fields" })
    }
    const user = await getUserByEmail(email)
    if (user) {
      return res.status(400).send({ message: "User already exists" })
    }
    const salt = random()
    const newUser = await createUser({
      userName,
      email,
      name,
      authentication: {
        password: authentication(salt, password),
        salt,
      },
    })
    return res.status(201).send({ user: newUser }).end()
  } catch (error) {
    return res.status(500).send({ message: error.message })
  }
}
