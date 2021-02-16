import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface TokenPayLoad {
  id: string;
  iat: number;
  exp: number;
}

export default function authMiddleware(
  req: Request, res: Response, next: NextFunction
) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ msg: 'Token não encontrado.' });
  }

  const token = authHeader.replace('Bearer', '').trim();
  // console.log(token);

  try {
    const data = jwt.verify(token, "secret");

    const { id } = data as TokenPayLoad;

    req.userId = id;

    return next();
  } catch {
    return res.status(401).json({ msg: 'Erro' });
  }
}