const Joi = require('joi');

const profileSchema = Joi.object({
  name: Joi.string().required().min(2),
  bio: Joi.string().max(500).allow(''),
  phone: Joi.string().pattern(/^[0-9\-+ ()]{7,20}$/).required(),
  location: Joi.string().required(),
  dateOfBirth: Joi.date().less('now').required(), // Simple check, more complex age check in controller if needed
  socialLinks: Joi.string().uri().allow('')
});

const validateProfile = (data) => {
  return profileSchema.validate(data);
};

module.exports = { validateProfile };
