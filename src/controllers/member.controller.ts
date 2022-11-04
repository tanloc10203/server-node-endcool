import { Request, Response } from 'express';
import { db } from '../config/db';
import { Member } from '../services';

export const memberController = {
  db: new Member(db.Member),

  create(req: Request, res: Response) {
    return memberController.db.create(req, res);
  },

  getAll(req: Request, res: Response) {
    return memberController.db.getAll(req, res);
  },

  update(req: Request, res: Response) {
    return memberController.db.update(req, res);
  },

  getById(req: Request, res: Response) {
    return memberController.db.getById(req, res);
  },

  delete(req: Request, res: Response) {
    return memberController.db.delete(req, res);
  },

  count(req: Request, res: Response) {
    return memberController.db.count(req, res);
  },
};
