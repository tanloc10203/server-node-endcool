import { Request, Response } from 'express';
import { db } from '../config/db';
import { Category } from '../services';

export const categoryController = {
  db: new Category(db.Category),

  create(req: Request, res: Response) {
    return categoryController.db.create(req, res);
  },

  getAll(req: Request, res: Response) {
    return categoryController.db.getAll(req, res);
  },

  getAllTree(req: Request, res: Response) {
    return categoryController.db.getAllTree(req, res);
  },

  update(req: Request, res: Response) {
    return categoryController.db.update(req, res);
  },

  getById(req: Request, res: Response) {
    return categoryController.db.getById(req, res);
  },

  getProduct(req: Request, res: Response) {
    return categoryController.db.getProduct(req, res);
  },

  delete(req: Request, res: Response) {
    return categoryController.db.delete(req, res);
  },

  count(req: Request, res: Response) {
    return categoryController.db.count(req, res);
  },
};
