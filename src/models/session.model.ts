'use strict';

import { Association, DataTypes, Model } from 'sequelize';
import { Sequelize } from 'sequelize/types';
import { Member } from './member.model';

export interface SessionAttribute {
  id?: number;

  memberId: number;
  token: string;

  createdAt?: string;
  updatedAt?: string;
}

export class Session extends Model implements SessionAttribute {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */

  public id?: number;
  public token!: string;
  public memberId!: number;

  public readonly createdAt?: string | undefined;
  public readonly updatedAt?: string | undefined;

  public readonly member?: Member;

  public static associations: {
    // define association here
    member: Association<Session, Member>;
  };
}

export function initSession(sequelize: Sequelize): void {
  Session.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      token: {
        type: DataTypes.TEXT,
        defaultValue: true,
      },
      memberId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Session',
    }
  );
}

export function associateSession(): void {
  Session.belongsTo(Member, { targetKey: 'id', foreignKey: 'memberId', as: 'member' });
}
