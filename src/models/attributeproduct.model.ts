'use strict';

import { Association, DataTypes, Model } from 'sequelize';
import { Sequelize } from 'sequelize/types';
import { Product } from './product.model';

export interface AttributeProductInterface {
  id?: number;

  productId: Product;
  key: string;
  value: string;

  createdAt?: string;
  updatedAt?: string;
}

export class AttributeProduct extends Model implements AttributeProductInterface {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */

  public id?: number;
  public key!: string;
  public value!: string;
  public readonly productId!: Product;

  public static associations: {
    // define association here
    productId: Association<AttributeProduct, Product>;
  };
}

export function initAttributeProduct(sequelize: Sequelize): void {
  AttributeProduct.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      key: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      value: {
        type: DataTypes.TEXT,
        allowNull: false,
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
      modelName: 'AttributeProduct',
    }
  );
}

export function associateAttributeProduct(): void {
  AttributeProduct.belongsTo(Product, {
    targetKey: 'id',
    foreignKey: 'productId',
    as: 'product',
  });
}
