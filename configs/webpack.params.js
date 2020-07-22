const os = require('os').platform();

module.exports = {
    require_path : os === 'linux' ? '/usr/local/lib/node_modules/' : '',
    encode : 'utf-8',
	localHost: 'http://localhost:3004/'
}