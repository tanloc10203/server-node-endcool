import { Request, Response } from 'express';
import { Model, ModelCtor } from 'sequelize/types';
import { CommonController } from '../class';
import log from '../logger';
import { AddressAttribute } from '../models/address.model';

export class Address extends CommonController {
  constructor(Db: ModelCtor<Model<any, any>>) {
    super(Db);
  }

  public async getIsDefault(req: Request, res: Response) {
    try {
      const memberId = req.query.memberId;

      if (!memberId)
        return res.status(404).json({
          error: true,
          message: 'Missing parameter body: [memberId] !!!',
        });

      const response = await super.handleFind({ where: { memberId, isDefault: true } });

      res.json({ error: false, message: 'Get address success.', data: response });
    } catch (error) {
      log.error(error);
      if (error instanceof Error)
        return res.status(500).json({ message: 'ERROR FROM SERVER!!!', error: error.message });
    }
  }

  // * @Override CREATE
  public async create(req: Request, res: Response) {
    try {
      const data: AddressAttribute = req.body;

      const {
        districtCode,
        districtName,
        wardCode,
        wardName,
        provinceCode,
        provinceName,
        memberId,
        note,
        phoneNumber,
        fullName,
        isDefault,
      } = data;

      if (
        !districtCode ||
        !districtName ||
        !wardCode ||
        !wardName ||
        !provinceCode ||
        !provinceName ||
        !memberId ||
        !note ||
        !phoneNumber ||
        !fullName
      )
        return res.status(404).json({
          error: true,
          message:
            'Missing parameter body: [districtCode | districtName | wardCode | wardName | provinceCode | provinceName| memberId, note, phoneNumber, ...] !!!',
        });

      if (isDefault) {
        const findIsDefault = await super.handleFind({ where: { isDefault: true, memberId } });
        await findIsDefault?.update({ isDefault: false });
      }

      const [response, created] = await super.handleFindAndCreate({
        where: {
          provinceCode,
          districtCode,
          wardCode,
          memberId,
          phoneNumber,
          fullName,
        },
        defaults: { ...data },
      });

      if (!created) return res.status(400).json({ message: 'Row is exist !', error: true });

      res.status(200).json({ message: 'Create row succeed.', error: false, data: response });
    } catch (error) {
      log.error(error);
      if (error instanceof Error)
        return res.status(500).json({ message: 'ERROR FROM SERVER!!!', error: error.message });
    }
  }

  public async getAll(req: Request, res: Response) {
    try {
      const memberId = req.query.memberId;

      if (!memberId)
        return res.status(404).json({ message: 'Missing parameter memberId', error: true });

      const response = await super.handleGetAll({
        where: { memberId },
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        order: ['isDefault'],
      });

      const newResponse = response.sort((a, b) => (a === b ? 0 : a ? -1 : 1));

      res.status(200).json({
        error: false,
        message: 'Get success',
        data: newResponse,
      });
    } catch (error) {
      log.error(error);
      if (error instanceof Error)
        return res.status(500).json({ message: 'ERROR FROM SERVER!!!', error: error.message });
    }
  }

  // * @Override UPDATE
  public async update(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const data: AddressAttribute = req.body;

      if (!id)
        return res.status(404).json({
          error: true,
          message: 'Missing parameter params: [id] !!!',
        });

      if (data.isDefault) {
        const findIsDefault = await super.handleFind({
          where: { isDefault: true, memberId: data.memberId },
        });
        await findIsDefault?.update({ isDefault: false });
      }

      const response = await super.handleUpdate<AddressAttribute>(id, { ...data });

      if (response[0] === 0)
        return res.status(400).json({ message: 'ID was not found !', error: true });

      res.status(200).json({ message: 'Update row succeed.', error: false, data: response[1][0] });
    } catch (error) {
      log.error(error);
      if (error instanceof Error)
        return res.status(500).json({ message: 'ERROR FROM SERVER!!!', error: error.message });
    }
  }

  // * @Override DELETE
  public async delete(req: Request, res: Response) {
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
