import { Request, Response } from 'express';
import { Model, ModelCtor } from 'sequelize/types';
import { CommonController } from '../class';
import log from '../logger';

export class ProductImage extends CommonController {
  constructor(Db: ModelCtor<Model<any, any>>) {
    super(Db);
  }

  // @Override
  public async create(
    req: Request,
    res: Response
  ): Promise<Response<any, Record<string, any>> | undefined> {
    try {
      const { productId, data } = req.body;

      if (!productId) return res.status(404).json({ message: 'Missing parameter !', error: true });

      const response = await super.handleBulkCreate<ProductImage>(data);

      res
        .status(200)
        .json({ message: 'Create row succeed.', error: false, data: response, productId });
    } catch (error) {
      log.error(error);
      if (error instanceof Error)
        return res.status(500).json({ message: 'ERROR FROM SERVER!!!', error: error.message });
    }
  }

  // @Override
  public async getAll(
    req: Request,
    res: Response
  ): Promise<Response<any, Record<string, any>> | undefined> {
    try {
      const productId = req.query.productId;

      if (!productId) {
        return res.status(404).json({ message: 'Missing parameter !', error: true });
      }

      const response = await super.handleGetAll({ where: { productId } });
      res.status(200).json({
        message: 'GET ALL SUCCEED.',
        error: false,
        data: response,
      });
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
      const { productId } = req.body;
      const id = parseInt(req.params.id);

      if (!productId) return res.status(404).json({ message: 'Missing parameter !', error: true });

      const response = await super.handleUpdate<ProductImage>(id, { ...req.body });

      if (response[0] === 0)
        return res.status(400).json({ message: 'ID was not found !', error: true });

      res.status(200).json({ message: 'Update succeed.', error: false });
    } catch (error) {
      log.error(error);
      if (error instanceof Error)
        return res.status(500).json({ message: 'ERROR FROM SERVER!!!', error: error.message });
    }
  }

  // @Override
  public async delete(
    req: Request,
    res: Response
  ): Promise<Response<any, Record<string, any>> | undefined> {
    try {
      const id = parseInt(req.params.id);

      const response = await super.handleDelete(id);

      if (!response) return res.status(400).json({ message: 'ID was not found !', error: true });

      res.status(200).json({ message: `Id '${id}' was deleted`, error: false });
    } catch (error) {
      log.error(error);
      if (error instanceof Error)
        return res.status(500).json({ message: 'ERROR FROM SERVER!!!', error: error.message });
    }
  }
}
