import { Request, Response } from 'express';
import { Model, ModelCtor } from 'sequelize/types';
import { Op } from 'sequelize';
import { CommonController } from '../class';
import log from '../logger';
import { PurchaseStatusAttribute } from '../models/purchasestatus.model';

export class PurchaseStatus extends CommonController {
  constructor(Db: ModelCtor<Model<any, any>>) {
    super(Db);
  }

  // * @Override CREATE
  public async create(req: Request, res: Response) {
    try {
      const { name, key } = req.body;

      if (!name || !key)
        return res
          .status(404)
          .json({ error: true, message: 'Missing parameter body: [name, key] !!!' });

      const [response, created] = await super.handleFindAndCreate({
        where: {
          name,
          key,
        },
        defaults: { name, key },
      });

      if (!created) return res.status(400).json({ message: 'Row is exist !', error: true });

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
      const { name, key } = req.body;
      const id = parseInt(req.params.id);

      if (!name || !key || !id)
        return res.status(404).json({
          error: true,
          message: 'Missing parameter body or parameter params: [name, key], [id] !!!',
        });

      const findPurchaseStatus: PurchaseStatusAttribute = (
        await super.handleFind({ where: { name, key } })
      )?.get();

      console.log(findPurchaseStatus);

      if (findPurchaseStatus && findPurchaseStatus.id !== id)
        return res
          .status(400)
          .json({ message: `Name and Key were existed with 'ID' difference !`, error: true });

      const response = await super.handleUpdate<PurchaseStatusAttribute>(id, { name, key });

      if (response[0] === 0)
        return res.status(400).json({ message: 'ID was not found !', error: true });

      res.status(200).json({ message: 'Update row succeed.', error: false, data: response[1][0] });
    } catch (error) {
      log.error(error);
      if (error instanceof Error)
        return res.status(500).json({ message: 'ERROR FROM SERVER!!!', error: error.message });
    }
  }

  public async getActions(req: Request, res: Response) {
    try {
      const response = await super.handleGetAll({
        where: {
          key: {
            [Op.or]: [
              'xac-nhan-don-hang',
              'cho-lay-hang',
              'dang-van-chuyen',
              'da-giao',
              'da-nhan',
              'huy-don-hang',
            ],
          },
        },
      });

      res.status(200).json({ message: 'GET ACTIONS SUCCESS', error: false, data: response });
    } catch (error) {
      log.error(error);
      if (error instanceof Error)
        return res.status(500).json({ message: 'ERROR FROM SERVER!!!', error: error.message });
    }
  }

  // * @Override DELETE
}
