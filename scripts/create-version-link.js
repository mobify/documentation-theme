var fs = require('fs-extra');
var path = require('path');

const symlink = (target, dir, version, callback) => {
    const linkPath = path.resolve(dir, version);
    console.log('linkpath', linkPath);
    fs.symlink(target, linkPath, 'dir', function(err) {
        if (err) {
            console.error('Failed to create symlink', err);
            process.exit(1);
        }

        console.log('Symlink creation successful.');
        callback();
    });
}

module.exports = symlink
