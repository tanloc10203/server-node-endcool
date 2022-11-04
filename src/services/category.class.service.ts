import { Request, Response } from 'express';
import { Attributes, FindOptions, Model, ModelCtor } from 'sequelize/types';
import { CommonController } from '../class';
import { db } from '../config/db';
import log from '../logger';
import { CategoryAttribute } from '../models/category.model';
import { FilterPayload } from '../utils';

export class Category extends CommonController {
  constructor(Db: ModelCtor<Model<any, any>>) {
    super(Db);
  }

  // @Override
  public async create(
    req: Request,
    res: Response
  ): Promise<Response<any, Record<string, any>> | undefined> {
    try {
      const { name, slug } = req.body;

      const level = parseInt(req.body.level);
      const parentCatId = parseInt(req.body.parentCatId);

      if (!name || !slug)
        return res.status(404).json({ message: 'Missing parameter !', error: true });

      let where: FindOptions<Attributes<Model>>;
      let data: CategoryAttribute;

      if (!level || !parentCatId) {
        where = { where: { name: name, slug: slug } };
        data = {
          name,
          slug,
          level: 1,
          parentCatId: 0,
        };
      } else {
        where = {
          where: { name: name, slug: slug, level: level, parentCatId: parentCatId },
        };
        data = {
          name,
          slug,
          level: level + 1,
          parentCatId,
        };
      }

      const response = await super.handleFind(where);

      if (response) return res.status(400).json({ message: 'Row is exist !', error: true });

      const newResponse = await super.handleCreate<CategoryAttribute>(data);

      res.status(200).json({ message: 'Create row succeed.', error: false, data: newResponse });
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
      const { name, slug } = req.body;
      const id = parseInt(req.params.id);

      if (!name || !slug || !id)
        return res.status(404).json({ message: 'Missing parameter !', error: true });

      const findCat: CategoryAttribute = (await super.handleFind({ where: { name, slug } }))?.get();

      if (findCat && findCat.id !== id)
        return res
          .status(400)
          .json({ message: `Name and Slug were existed with 'ID' difference !`, error: true });

      const response = await super.handleUpdate<CategoryAttribute>(id, { ...req.body });

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
      const _order = req.query._order as 'DESC' | 'ASC';
      const name_query = req.query.name_query as string;
      const name_order = req.query.name_order as string;
      const name_like = req.query.name_like as string;

      const _limit = parseInt(req.query._limit as string);
      let _page = parseInt(req.query._page as string);

      _page = _page < 0 ? (_page = 0) : _page;

      if (!_limit && !_page && !_order && !name_order && !name_like) {
        const response = await super.handleGetAll();
        return res.status(200).json({
          message: 'GET ALL SUCCEED.',
          error: false,
          data: response,
          pagination: {
            _limit: 5,
            _page: 0,
            _totalRows: response.length,
          },
        });
      }

      const filter: FilterPayload = {
        ...req.query,
        _limit,
        _page,
        name_query: name_query || 'name',
        name_order,
        _order,
        name_like,
      };

      const response = await super.handleGetAllAndFilter(filter);

      res.status(200).json({
        message: 'GET ALL SUCCEED',
        error: false,
        data: response.rows,
        pagination: { _limit: _limit, _page: _page, _totalRows: response.count },
      });
    } catch (error) {
      log.error(error);
      if (error instanceof Error)
        return res.status(500).json({ message: 'ERROR FROM SERVER!!!', error: error.message });
    }
  }

  // @Override
  public async getAllTree(
    req: Request,
    res: Response
  ): Promise<Response<any, Record<string, any>> | undefined> {
    try {
      let response = await super.handleGetAll({
        where: { level: 1 },
        include: [
          {
            model: db.Category,
            as: 'children',
          },
        ],
      });

      if (!response) {
        return res.status(404).json({
          message: 'NOT CATEGORY',
          error: false,
          data: [],
        });
      }

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

  public async getProduct(req: Request, res: Response) {
    try {
      const response = await super.handleGetAll({
        where: {
          level: 1,
        },
        attributes: {
          exclude: ['createdAt', 'updatedAt'],
        },

        include: [
          {
            model: db.Category,
            as: 'children',
            include: [
              {
                model: db.Product,
                as: 'products',
                attributes: {
                  exclude: ['createdAt', 'updatedAt'],
                },
                limit: 10,
                include: [
                  {
                    model: db.StatusProduct,
                    as: 'status',
                    attributes: {
                      exclude: ['id', 'createdAt', 'updatedAt'],
                    },
                  },
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
          {
            model: db.Product,
            as: 'products',
            attributes: {
              exclude: ['createdAt', 'updatedAt'],
            },
            limit: 10,
            include: [
              {
                model: db.StatusProduct,
                as: 'status',
                attributes: {
                  exclude: ['id', 'createdAt', 'updatedAt'],
                },
              },
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
      });

      let data: Array<CategoryAttribute>;

      data = response as unknown as Array<CategoryAttribute>;

      data = data.map((item) => {
        const newItem: CategoryAttribute = item.get({ plain: true });

        if (Boolean(newItem?.children) && newItem?.children && newItem.children.length > 0) {
          const obj = newItem.children
            .map((c: CategoryAttribute) => c.products)
            .reduce((t, d) => d, {});

          const check = {
            ...newItem,
            products: [...obj, ...newItem.products],
          };

          const { children, ...result } = check;

          return result;
        }

        const { children, ...result } = newItem;

        return result;
      });

      res.status(200).json({
        message: 'GET ALL SUCCEED.',
        error: false,
        data: data,
      });
    } catch (error) {
      log.error(error);
      if (error instanceof Error)
        return res.status(500).json({ message: 'ERROR FROM SERVER!!!', error: error.message });
    }
  }
}
