'use strict';

import { Association, DataTypes, Model } from 'sequelize';
import { Sequelize } from 'sequelize/types';
import { Address, AddressAttribute } from './address.model';
import { Product, ProductAttribute } from './product.model';

export interface EvaluateProductAttribute {
  id?: number;

  rate: number;
  comment: string;

  productId: ProductAttribute;
  customerId: AddressAttribute;

  createdAt?: string;
  updatedAt?: string;

  [key: string]: any;
}

export class EvaluateProduct extends Model implements EvaluateProductAttribute {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */

  public id?: number;
  public rate!: number;
  public comment!: string;

  public readonly productId!: ProductAttribute;
  public readonly customerId!: AddressAttribute;

  public static associations: {
    // define association here
    product: Association<EvaluateProduct, Product>;
    customer: Association<EvaluateProduct, Address>;
  };
}

export function initEvaluateProduct(sequelize: Sequelize): void {
  EvaluateProduct.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      rate: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      comment: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      customerId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
    },
    {
      sequelize,
      modelName: 'EvaluateProduct',
    }
  );
}

export function associateEvaluateProduct(): void {
  EvaluateProduct.belongsTo(Product, {
    targetKey: 'id',
    foreignKey: 'productId',
    as: 'product',
  });

  EvaluateProduct.belongsTo(Address, {
    targetKey: 'id',
    foreignKey: 'customerId',
    as: 'customer',
  });
}
