import { Request, Response } from 'express';
import { Model, ModelCtor } from 'sequelize/types';
import { CommonController } from '../class';
import { db } from '../config/db';
import log from '../logger';
import { EvaluateProductAttribute } from '../models/evaluateproduct.model';
import { OrderAttribute } from '../models/order.model';

export class EvaluateProduct extends CommonController {
  constructor(Db: ModelCtor<Model<any, any>>) {
    super(Db);
  }

  // * @Override CREATE
  public async create(req: Request, res: Response) {
    try {
      const orderId = parseInt(req.params.orderId);
      const data: EvaluateProductAttribute = req.body;

      if (!data.rate || !data.comment || !data.productId || !data.customerId) {
        return res.status(404).json({
          error: true,
          message: 'Missing parameter rate, productId, customerId, comment !',
        });
      }

      await db.Order.update({ isEvaluate: true }, { where: { id: orderId } });
      await super.handleCreate<EvaluateProductAttribute>(data);

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
      res.status(200).json({ message: 'Row update success', error: false });
    } catch (error) {
      log.error(error);
      if (error instanceof Error)
        return res.status(500).json({ message: 'ERROR FROM SERVER!!!', error: error.message });
    }
  }

  public async getAll(req: Request, res: Response) {
    try {
      const productId = req.params.productId;

      if (!productId)
        return res.status(400).json({ message: 'missing parameter productId', error: true });

      const response = await super.handleGetAll({
        where: { productId: productId },
        include: [{ model: db.Address, as: 'customer' }],
      });

      res.json({ error: false, message: 'Get Evaluate Product success', data: response });
    } catch (error) {
      log.error(error);
      if (error instanceof Error)
        return res.status(500).json({ message: 'ERROR FROM SERVER!!!', error: error.message });
    }
  }
}
