import { Request, Response } from 'express';
import { db } from '../config/db';
import { EvaluateProduct } from '../services/evaluateProduct.service';

export const evaluateProduct = {
  db: new EvaluateProduct(db.EvaluateProduct),

  create(req: Request, res: Response) {
    return evaluateProduct.db.create(req, res);
  },

  getAll(req: Request, res: Response) {
    return evaluateProduct.db.getAll(req, res);
  },

  update(req: Request, res: Response) {
    return evaluateProduct.db.update(req, res);
  },

  getById(req: Request, res: Response) {
    return evaluateProduct.db.getById(req, res);
  },

  delete(req: Request, res: Response) {
    return evaluateProduct.db.delete(req, res);
  },

  count(req: Request, res: Response) {
    return evaluateProduct.db.count(req, res);
  },
};
