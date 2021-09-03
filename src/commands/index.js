const handleHottest = require('./hot');
const handleLink = require('./link');
const handleNewest = require('./newest');
const handleTop = require('./top');

const COMMAND_PREFIX = '!bb';

module.exports = {
  COMMAND_PREFIX,
  handleHottest,
  handleLink,
  handleNewest,
  handleTop,
};
