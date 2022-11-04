'use strict';

import { Association, DataTypes, Model } from 'sequelize';
import { Sequelize } from 'sequelize/types';
import { Product } from './product.model';

export interface CategoryAttribute {
  id?: number;
  name: string;
  slug: string;
  children?: Array<CategoryAttribute> | null;
  parentCatId: number;
  level: number;
  image?: string;
  createdAt?: string;
  updatedAt?: string;

  [key: string]: any;
}

export class Category extends Model implements CategoryAttribute {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */

  public id?: number;
  public name!: string;
  public slug!: string;
  public children?: CategoryAttribute[] | null;
  public parentCatId!: number;
  public level!: number;
  public image!: string;

  public readonly createdAt?: string | undefined;
  public readonly updatedAt?: string | undefined;

  public readonly products?: Product[];

  public static associations: {
    // define association here
    products: Association<Category, Product>;
  };
}

export function initCategory(sequelize: Sequelize): void {
  Category.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      name: DataTypes.STRING,
      slug: DataTypes.STRING,
      parentCatId: { type: DataTypes.INTEGER },
      level: DataTypes.INTEGER,
      image: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Category',
    }
  );
}

export function associateCategory(): void {
  Category.hasMany(Product, {
    sourceKey: 'id',
    foreignKey: 'categoryId',
    as: 'products',
  });

  Category.hasMany(Category, {
    onDelete: 'CASCADE',
    foreignKey: 'parentCatId',
    as: 'children',
  });
}
