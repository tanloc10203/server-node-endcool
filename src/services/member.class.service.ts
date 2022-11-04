import { Request, Response } from 'express';
import { Model, ModelCtor } from 'sequelize/types';
import { CommonController } from '../class';
import log from '../logger';
import { MemberAttribute } from '../models/member.model';
import { hashPassword } from './auth.service';

export class Member extends CommonController {
  constructor(Db: ModelCtor<Model<any, any>>) {
    super(Db);
  }

  // * @Override CREATE
  public async create(req: Request, res: Response) {
    try {
      const data: MemberAttribute = req.body;

      if (!data.email || !data.username || !data.password || !data.role) {
        return res
          .status(404)
          .json({ error: true, message: 'Missing parameter email, username, role and password !' });
      }

      const hashPws = await hashPassword(data.password);

      const newData = {
        ...data,
        password: hashPws,
      };

      const [response, created] = await super.handleFindAndCreate({
        where: {
          email: data.email,
          username: data.username,
        },
        defaults: { ...newData },
      });

      if (!created)
        return res.status(400).json({ message: 'Username or email was exist!', error: true });

      res.status(200).json({ message: 'Create row succeed.', error: false });
    } catch (error) {
      log.error(error);
      if (error instanceof Error)
        return res.status(500).json({ message: 'ERROR FROM SERVER!!!', error: error.message });
    }
  }

  // * @Override UPDATE
  public async update(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const data: Member = req.body as Member;

      if (!id) return res.status(404).json({ error: true, message: 'Missing parameter id' });

      await super.handleUpdate(id, data);

      res.status(200).json({ message: 'Row update success', error: false });
    } catch (error) {
      log.error(error);
      if (error instanceof Error)
        return res.status(500).json({ message: 'ERROR FROM SERVER!!!', error: error.message });
    }
  }

  // * @Override DELETE
  public async delete(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);

      if (!id) return res.status(404).json({ error: true, message: 'Missing parameter id' });

      res.status(200).json({ message: `Delete with id ${id} Success`, error: false });
    } catch (error) {
      log.error(error);
      if (error instanceof Error)
        return res.status(500).json({ message: 'ERROR FROM SERVER!!!', error: error.message });
    }
  }
}
