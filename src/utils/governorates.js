import governoratesData from '../data/governorates.json';

/**
 * Get all Egyptian governorates
 * @returns {Array} Array of governorate objects with id, name, and name_en
 */
export const getGovernorates = () => {
  return governoratesData;
};

/**
 * Get governorate by ID
 * @param {number} id - Governorate ID
 * @returns {Object|null} Governorate object or null if not found
 */
export const getGovernorateById = (id) => {
  return governoratesData.find(gov => gov.id === parseInt(id)) || null;
};

/**
 * Get governorate by name
 * @param {string} name - Governorate name in Arabic
 * @returns {Object|null} Governorate object or null if not found
 */
export const getGovernorateByName = (name) => {
  return governoratesData.find(gov => gov.name === name) || null;
};

/**
 * Get governorates as options for select elements
 * @returns {Array} Array of objects with value and label properties
 */
export const getGovernorateOptions = () => {
  return governoratesData.map(gov => ({
    value: gov.id,
    label: gov.name
  }));
};
