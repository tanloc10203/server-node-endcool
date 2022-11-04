'use strict';

import { Association, DataTypes, Model } from 'sequelize';
import { Sequelize } from 'sequelize/types';
import { Product } from './product.model';

export interface ProductQuantityAttribute {
  id?: number;

  sold: number;
  totalQuantity: number;

  orderQuantity: number;
  productId: number;

  isActive?: boolean;

  createdAt?: string;
  updatedAt?: string;
}

export class ProductQuantity extends Model implements ProductQuantityAttribute {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */

  public id?: number;
  public sold!: number;
  public isActive?: boolean;

  public totalQuantity!: number;
  public orderQuantity!: number;
  public productId!: number;

  public readonly createdAt?: string;
  public readonly updatedAt?: string;
  public readonly product?: Product;

  public static associations: {
    // define association here
    product: Association<ProductQuantity, Product>;
  };
}

export function initProductQuantity(sequelize: Sequelize): void {
  ProductQuantity.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      sold: {
        type: DataTypes.INTEGER,
      },
      totalQuantity: {
        type: DataTypes.INTEGER,
      },
      orderQuantity: {
        type: DataTypes.INTEGER,
      },
      productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    },
    {
      sequelize,
      modelName: 'ProductQuantity',
    }
  );
}

export function associateProductQuantity(): void {
  ProductQuantity.belongsTo(Product, { targetKey: 'id', foreignKey: 'productId', as: 'product' });
}
