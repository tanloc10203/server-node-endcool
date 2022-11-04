import { Request, Response } from 'express';
import { Model, ModelCtor } from 'sequelize/types';
import { CommonController } from '../class';
import log from '../logger';
import { AttributeProductInterface } from '../models/attributeproduct.model';

export class AttributeProduct extends CommonController {
  constructor(Db: ModelCtor<Model<any, any>>) {
    super(Db);
  }

  // @Override
  public async create(
    req: Request,
    res: Response
  ): Promise<Response<any, Record<string, any>> | undefined> {
    try {
      const data: AttributeProductInterface = req.body;

      if (!data.key || !data.value || !data.productId)
        return res
          .status(422)
          .json({ error: true, message: 'Missing parameter key, value, productId' });

      const [response, created] = await super.handleFindAndCreate({
        where: { key: data.key, value: data.value, productId: data.productId },
        defaults: { ...data },
        raw: true,
      });

      if (!created) return res.status(400).json({ message: 'Row is exist !', error: true });

      res.status(200).json({ message: 'Create row succeed.', error: false });
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
      const id = parseInt(req.params.id);
      const data: AttributeProductInterface = req.body;

      if (!id) return res.status(404).json({ message: 'Missing parameter id!', error: true });

      const attribute: AttributeProductInterface = (
        await super.handleFind({
          where: { productId: data.productId, value: data.value, key: data.key },
        })
      )?.get();

      if (attribute && attribute.id !== id)
        return res
          .status(400)
          .json({ message: `Name and Slug were existed with 'ID' difference !`, error: true });

      const response = await super.handleUpdate<AttributeProductInterface>(id, { ...req.body });

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
  public async getAll(
    req: Request,
    res: Response
  ): Promise<Response<any, Record<string, any>> | undefined> {
    try {
      const productId = parseInt(req.params.productId);

      const response = await super.handleGetAll({ where: { productId }, order: ['createdAt'] });

      res.status(200).json({
        message: 'GET ALL SUCCEED',
        error: false,
        data: response,
      });
    } catch (error) {
      log.error(error);
      if (error instanceof Error)
        return res.status(500).json({ message: 'ERROR FROM SERVER!!!', error: error.message });
    }
  }

  public async delete(
    req: Request,
    res: Response
  ): Promise<Response<any, Record<string, any>> | undefined> {
    try {
      const id = parseInt(req.params.id);

      const response = await super.handleDelete(id);

      res.status(200).json({
        message: 'DELETE SUCCEED',
        error: false,
        data: response,
      });
    } catch (error) {
      log.error(error);
      if (error instanceof Error)
        return res.status(500).json({ message: 'ERROR FROM SERVER!!!', error: error.message });
    }
  }
}
