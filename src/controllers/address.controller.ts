import { Request, Response } from 'express';
import { db } from '../config/db';
import { Address } from '../services';

export const addressController = {
  db: new Address(db.Address),

  create(req: Request, res: Response) {
    return addressController.db.create(req, res);
  },

  getAll(req: Request, res: Response) {
    return addressController.db.getAll(req, res);
  },

  getIsDefault(req: Request, res: Response) {
    return addressController.db.getIsDefault(req, res);
  },

  getById(req: Request, res: Response) {
    return addressController.db.getById(req, res);
  },

  update(req: Request, res: Response) {
    return addressController.db.update(req, res);
  },

  delete(req: Request, res: Response) {
    return addressController.db.delete(req, res);
  },
};
