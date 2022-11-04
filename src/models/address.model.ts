'use strict';

import { Association, DataTypes, Model } from 'sequelize';
import { Sequelize } from 'sequelize/types';
import { EvaluateProduct } from './evaluateproduct.model';
import { Member } from './member.model';
import { Order } from './order.model';

export interface AddressAttribute {
  id?: number;
  memberId: number;

  provinceCode: string;
  provinceName: string;

  districtCode: string;
  districtName: string;

  wardCode: string;
  wardName: string;

  note: string;
  phoneNumber: string;

  fullName: string;
  isDefault: boolean;

  purchase?: Order;

  createdAt?: string;
  updatedAt?: string;
}

export class Address extends Model implements AddressAttribute {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */

  public id?: number;
  public memberId!: number;

  public provinceCode!: string;
  public provinceName!: string;

  public districtCode!: string;
  public districtName!: string;

  public wardCode!: string;
  public wardName!: string;

  public fullName!: string;

  public note!: string;
  public phoneNumber!: string;

  public isDefault!: boolean;

  public readonly member?: Member;
  public readonly purchase?: Order;
  public readonly evaluateProduct?: EvaluateProduct;

  public static associations: {
    // define association here
    member: Association<Address, Member>;
    purchase: Association<Address, Order>;
    evaluateProduct: Association<Address, EvaluateProduct>;
  };
}

export function initAddress(sequelize: Sequelize): void {
  Address.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      provinceCode: DataTypes.STRING,
      provinceName: DataTypes.STRING,
      districtCode: DataTypes.STRING,
      districtName: DataTypes.STRING,
      wardCode: DataTypes.STRING,
      wardName: DataTypes.STRING,
      fullName: DataTypes.STRING,
      phoneNumber: DataTypes.STRING,
      note: DataTypes.STRING,
      isDefault: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      memberId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
    },
    {
      sequelize,
      modelName: 'Address',
    }
  );
}

export function associateAddress(): void {
  Address.belongsTo(Member, {
    targetKey: 'id',
    foreignKey: 'memberId',
    as: 'member',
  });

  Address.hasOne(Order, {
    sourceKey: 'id',
    foreignKey: 'customerId',
    as: 'purchase',
  });

  Address.hasMany(EvaluateProduct, {
    sourceKey: 'id',
    foreignKey: 'customerId',
    as: 'evaluates',
  });
}
