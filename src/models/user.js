'use strict';
module.exports = function (sequelize, DataTypes) {
  let { INTEGER, CHAR } = DataTypes;  
  return sequelize.define('user', {
    user_id: {
      type: CHAR(32),
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: CHAR(32),
      allowNull: false,
    },
    password: {
      type: CHAR(32),
      allowNull: false,
    },
    real_name: {
      type: CHAR(32),
      allowNull: true,
    },
    user_role: {
      type: INTEGER(8),
      allowNull: true,
    },
    headimg: {
      type: CHAR(32),
      allowNull: true,
    },
    login_time: {
      type: INTEGER(16),
      allowNull: true,
    },
  }, {
    freezeTableName: true,
    tableName: 'user',
    timestamps: false,
  })
}
