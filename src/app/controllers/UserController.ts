import { Request, Response } from 'express';
import { getRepository } from 'typeorm';

import User from '../models/User';

class UserController {
  index(req: Request, res: Response) {
    return res.send({ userId: req.userId });
  }

  async store(req: Request, res: Response) {
    const repository = getRepository(User);

    const { userName, email, password } = req.body;

    const userExists = await repository.findOne({ where: { email } });
    const userNameExists = await repository.findOne({ where: { userName } });

    if (userExists || userNameExists) {
      return res.status(409).json(userExists ? { msg: 'Usuário já cadastrado!' } : { msg: 'Nome de usuário já esta sendo usado!' });
    }

    const user = repository.create({ userName, email, password });
    await repository.save(user);

    return res.status(200).json(user);
  }
}

export default new UserController;