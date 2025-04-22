const { composePlugins, withNx } = require('@nx/webpack');
const { join } = require('path');

module.exports = composePlugins(withNx(), (config) => {
    const isProduction = process.env.NODE_ENV === 'production';

    return {
        ...config,
        output: {
            path: join(__dirname, '../../../dist/apps/api/auth'),
        },
        watch: !isProduction,
        watchOptions: {
            poll: 100,
            ignored: /node_modules/
        },
        mode: process.env.NODE_ENV || 'development',
    };
});

