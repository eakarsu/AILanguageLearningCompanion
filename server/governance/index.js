'use strict';
const { createRouter } = require('./router');
const { sequelize: adapt } = require('./store');
const { sequelize } = require('../models');
const auth = require('../middleware/auth');
const { evaluate } = require('./domain');
module.exports = createRouter({ db: adapt(sequelize), auth, evaluate,
  workflow: 'language-learning-path',
  providers: ['content-catalog','dictionary','speech-service','lms','classroom','identity','instructor-portal'],
  approverRoles: ['teacher','curriculum_reviewer','guardian','admin'] });

