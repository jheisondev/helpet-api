import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import User from '../models/User';

class AuthController {
  async authenticate(req: Request, res: Response) {
    const repository = getRepository(User);

    const { userValue, password } = req.body;
    let user;

    if (userValue.indexOf('.com') !== -1) {
      const email = userValue;
      user = await repository.findOne({ where: { email } });
    } else {
      const userName = userValue;
      user = await repository.findOne({ where: { userName } });
    }

    if (!user) {
      return res.status(404).json({ msg: 'Usuário não encontrado, cadastre-se!' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(404).json({ msg: 'Senha incorreta!' });
    }

    const token = jwt.sign({ id: user.id }, "secret", { expiresIn: '1m' });
    const { id, userName, email } = user;

    return res.status(200).json({
      id,
      userName,
      email,
      token,
    })
  }
}

export default new AuthController;