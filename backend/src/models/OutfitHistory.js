import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';
import User from './User.js';

const OutfitHistory = sequelize.define('OutfitHistory', {
  outfitItems: {
    type: DataTypes.JSONB,
    allowNull: false,
    defaultValue: [] // Array of WardrobeItem IDs (strings/integers)
  },
  occasion: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isIn: {
        args: [['college', 'office', 'placement interview', 'casual outing', 'date', 'wedding', 'party', 'travel', 'festival']],
        msg: 'Please select a valid occasion'
      }
    }
  },
  dateGenerated: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  dateWorn: {
    type: DataTypes.DATE,
    allowNull: true
  },
  score: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 0,
      max: 100
    }
  },
  scoreBreakdown: {
    type: DataTypes.JSONB,
    defaultValue: {
      colorCompatibility: 0,
      occasionMatch: 0,
      weatherMatch: 0,
      userPreferenceMatch: 0,
      freshness: 0
    }
  },
  isFavorite: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
});

// Relationships
User.hasMany(OutfitHistory, { foreignKey: 'userId', onDelete: 'CASCADE' });
OutfitHistory.belongsTo(User, { foreignKey: 'userId' });

export default OutfitHistory;
