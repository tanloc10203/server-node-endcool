import { Request, Response } from 'express';
import { Model, ModelCtor } from 'sequelize/types';
import { CommonController } from '../class';
import { db } from '../config/db';
import log from '../logger';
import { PurchaseOrderAttribute } from '../models/purchaseorder.model';

export class PurchaseOrder extends CommonController {
  constructor(Db: ModelCtor<Model<any, any>>) {
    super(Db);
  }

  // * @Override CREATE
  public async create(req: Request, res: Response) {
    try {
      const data: PurchaseOrderAttribute = req.body;

      const { orderId } = data;

      if (!orderId)
        return res
          .status(404)
          .json({ error: true, message: 'Missing parameter body: [statusId, orderId] !!!' });

      const [response, created] = await super.handleFindAndCreate({
        where: {
          orderId,
          statusId: 1,
        },
        defaults: { statusId: 1, orderId },
      });

      if (!created)
        return res.status(200).json({ message: 'Success', error: false, data: response });

      res.status(200).json({ message: 'Create row succeed.', error: false, data: response });
    } catch (error) {
      log.error(error);
      if (error instanceof Error)
        return res.status(500).json({ message: 'ERROR FROM SERVER!!!', error: error.message });
    }
  }

  // * @Override UPDATE
  public async update(req: Request, res: Response) {
    try {
      res.status(200).json({ message: 'Row could not update', error: false });
    } catch (error) {
      log.error(error);
      if (error instanceof Error)
        return res.status(500).json({ message: 'ERROR FROM SERVER!!!', error: error.message });
    }
  }

  // * @Override GetAll
  public async getAll(req: Request, res: Response) {
    try {
      const memberId = req.query.memberId;

      if (!memberId)
        return res.status(404).json({ message: 'Missing parameter memberId', error: true });

      const response = await super.handleGetAll({
        attributes: {
          exclude: ['createdAt', 'updatedAt'],
        },
        include: [
          {
            model: db.Order,
            as: 'order',
            where: {
              memberId,
            },
            attributes: {
              exclude: ['createdAt', 'updatedAt'],
            },

            include: [
              {
                model: db.OrderDetail,
                as: 'orderDetail',
                attributes: {
                  exclude: ['createdAt', 'updatedAt'],
                },
                include: [
                  {
                    model: db.Product,
                    as: 'product',
                    attributes: {
                      exclude: ['createdAt', 'updatedAt'],
                    },
                    include: [
                      {
                        model: db.ProductPrice,
                        as: 'price',
                        attributes: {
                          exclude: ['createdAt', 'updatedAt'],
                        },
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      });

      res.status(200).json({ message: 'GET Success', error: false, data: response });
    } catch (error) {
      log.error(error);
      if (error instanceof Error)
        return res.status(500).json({ message: 'ERROR FROM SERVER!!!', error: error.message });
    }
  }

  // * @Override DELETE
  public async delete(req: Request, res: Response) {
    try {
      await super.handleDeleteAll();
      res.status(200).json({ message: 'Delete All Success', error: false });
    } catch (error) {
      log.error(error);
      if (error instanceof Error)
        return res.status(500).json({ message: 'ERROR FROM SERVER!!!', error: error.message });
    }
  }
}
