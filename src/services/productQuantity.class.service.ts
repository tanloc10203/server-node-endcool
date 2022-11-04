import { Request, Response } from 'express';
import { Model, ModelCtor } from 'sequelize/types';
import { CommonController } from '../class';
import log from '../logger';

export class ProductQuantity extends CommonController {
  constructor(Db: ModelCtor<Model<any, any>>) {
    super(Db);
  }

  // @Override
  public async create(
    req: Request,
    res: Response
  ): Promise<Response<any, Record<string, any>> | undefined> {
    try {
      const { totalQuantity, productId } = req.body;

      if (!totalQuantity || !productId)
        return res
          .status(404)
          .json({ message: 'Missing parameter body: [productId, totalQuantity]!', error: true });

      const response = await super.handleCreate(req.body);

      res.status(200).json({ message: 'Create row succeed.', error: false, data: response });
    } catch (error) {
      log.error(error);
      if (error instanceof Error)
        return res.status(500).json({ message: 'ERROR FROM SERVER!!!', error: error.message });
    }
  }

  // @Override
  public async update(
    req: Request,
    res: Response
  ): Promise<Response<any, Record<string, any>> | undefined> {
    try {
      const { productId, totalQuantity } = req.body;
      const id = parseInt(req.params.id);

      if (!productId || !totalQuantity || !id)
        return res.status(404).json({
          message: 'Missing parameter body and parameter params: [productId, totalQuantity], [id]!',
          error: true,
        });

      const response = await super.handleUpdate(id, { ...req.body });

      if (response[0] === 0)
        return res.status(400).json({ message: 'ID was not found !', error: true });

      res.status(200).json({ message: 'Update succeed.', error: false, data: response[1][0] });
    } catch (error) {
      log.error(error);
      if (error instanceof Error)
        return res.status(500).json({ message: 'ERROR FROM SERVER!!!', error: error.message });
    }
  }
}
