'use strict';

import { Association, DataTypes, Model } from 'sequelize';
import { Sequelize } from 'sequelize/types';
import { Product } from './product.model';
import { TimeChange } from './timechange.modle';

export interface ProductPriceAttribute {
  id?: number;

  price: number;
  isSale: boolean;
  percentDiscount: number;
  priceDiscount: number;

  productId: number;
  timeChangeId: number;

  createdAt?: string;
  updatedAt?: string;
}

export class ProductPrice extends Model implements ProductPriceAttribute {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */

  public id?: number;
  public price!: number;
  public productId!: number;
  public timeChangeId!: number;
  public percentDiscount!: number;
  public priceDiscount!: number;
  public isSale!: boolean;

  public readonly createdAt?: string | undefined;
  public readonly updatedAt?: string | undefined;

  public readonly product?: Product[];
  public readonly timeChange?: TimeChange;

  public static associations: {
    // define association here
    product: Association<ProductPrice, Product>;
    timeChange: Association<ProductPrice, TimeChange>;
  };
}

export function initProductPrice(sequelize: Sequelize): void {
  ProductPrice.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      price: {
        type: DataTypes.REAL,
      },
      percentDiscount: {
        type: DataTypes.REAL,
      },
      isSale: {
        type: DataTypes.BOOLEAN,
      },
      priceDiscount: {
        type: DataTypes.REAL,
      },
      productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      },
      timeChangeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      },
    },
    {
      sequelize,
      modelName: 'ProductPrice',
    }
  );
}

export function associateProductPrice(): void {
  ProductPrice.belongsTo(Product, { targetKey: 'id', foreignKey: 'productId', as: 'products' });
  ProductPrice.belongsTo(TimeChange, {
    targetKey: 'id',
    foreignKey: 'timeChangeId',
    as: 'timeChange',
  });
}
