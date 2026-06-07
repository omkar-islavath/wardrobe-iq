import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';
import User from './User.js';

const WardrobeItem = sequelize.define('WardrobeItem', {
  category: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isIn: {
        args: [['shirt', 't-shirt', 'pants', 'jeans', 'shorts', 'jacket', 'shoes', 'accessories', 'top', 'crop top', 'kurti', 'skirt', 'leggings', 'dress', 'saree']],
        msg: 'Please select a valid category'
      }
    }
  },
  color: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  secondaryColor: {
    type: DataTypes.STRING,
    defaultValue: ''
  },
  pattern: {
    type: DataTypes.STRING,
    defaultValue: 'solid'
  },
  style: {
    type: DataTypes.STRING,
    defaultValue: 'casual'
  },
  season: {
    type: DataTypes.STRING,
    defaultValue: 'all',
    validate: {
      isIn: {
        args: [['summer', 'winter', 'rainy', 'spring-fall', 'all']],
        msg: 'Please select a valid season'
      }
    }
  },
  imageUrl: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  brand: {
    type: DataTypes.STRING,
    defaultValue: ''
  },
  tags: {
    type: DataTypes.JSONB,
    defaultValue: []
  }
});

// Relationships
User.hasMany(WardrobeItem, { foreignKey: 'userId', onDelete: 'CASCADE' });
WardrobeItem.belongsTo(User, { foreignKey: 'userId' });

export default WardrobeItem;
