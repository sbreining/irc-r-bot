const handleLink = require('./link');
const handleNewest = require('./newest');
const handleTop = require('./top');

const COMMAND_PREFIX = '!bb';

module.exports = {
  COMMAND_PREFIX,
  handleLink,
  handleNewest,
  handleTop,
};
