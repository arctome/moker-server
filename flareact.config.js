module.exports = {
    webpack: (config, options) => {
        config.module.rules.push({
            test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
            use: {
                loader: 'url-loader',
                options: {
                    limit: 1000,
                    publicPath: `/_flareact/static`,
                    // outputPath: 'static/'
                }
            }
        });

        return config;
    },
};