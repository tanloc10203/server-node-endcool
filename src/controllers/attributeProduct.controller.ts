import { Request, Response } from 'express';
import { db } from '../config/db';
import { AttributeProduct } from '../services';

export const attributeProductController = {
  db: new AttributeProduct(db.AttributeProduct),

  create(req: Request, res: Response) {
    return attributeProductController.db.create(req, res);
  },

  getAll(req: Request, res: Response) {
    return attributeProductController.db.getAll(req, res);
  },

  update(req: Request, res: Response) {
    return attributeProductController.db.update(req, res);
  },

  getById(req: Request, res: Response) {
    return attributeProductController.db.getById(req, res);
  },

  delete(req: Request, res: Response) {
    return attributeProductController.db.delete(req, res);
  },

  count(req: Request, res: Response) {
    return attributeProductController.db.count(req, res);
  },
};
