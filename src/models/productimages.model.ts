'use strict';

import { Association, DataTypes, Model } from 'sequelize';
import { Sequelize } from 'sequelize/types';
import { Product, ProductAttribute } from './product.model';

export interface ProductImagesAttribute {
  id?: number;

  urlImg: string;
  productId: number;

  createdAt?: string;
  updatedAt?: string;
}

export class ProductImages extends Model implements ProductImagesAttribute {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */

  public id?: number;
  public productId!: number;
  public urlImg!: string;

  public readonly createdAt?: string | undefined;
  public readonly updatedAt?: string | undefined;

  public static associations: {
    // define association here
    product: Association<ProductImages, Product>;
  };
}

export function initProductImages(sequelize: Sequelize): void {
  ProductImages.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      urlImg: {
        type: DataTypes.STRING,
      },
      productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
    },
    {
      sequelize,
      modelName: 'ProductImages',
    }
  );
}

export function associateProductImages(): void {
  ProductImages.belongsTo(Product, { targetKey: 'id', foreignKey: 'productId', as: 'product' });
}
