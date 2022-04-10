// used for running jest only
module.exports = {
    presets: [
        ['@babel/preset-env', {
            targets: { node: 'current' },
        }],
        '@babel/preset-typescript',
    ],
};
