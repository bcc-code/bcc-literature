const path = require("path");
module.exports = {
    chainWebpack: config => {
        config.resolve.alias.set("components", path.resolve(__dirname, "src/components")),
        config.resolve.alias.set("views", path.resolve(__dirname, "src/views")),
        config.resolve.alias.set("router", path.resolve(__dirname, "src/router")),
        config.resolve.alias.set("keys", path.resolve(__dirname, "src/keys.js")),
        config.resolve.alias.set("store", path.resolve(__dirname, "src/store/index.js")),
        config.resolve.alias.set("utils", path.resolve(__dirname, "src/utils"))
    },
    outputDir: "dist",
    devServer: {
        host: "literature.local",
        port: 21535
    },
    pwa: {
    // configure the workbox plugin
        workboxPluginMode: "GenerateSW",
        workboxOptions: {
            cacheId: "bcc-literature",
            swDest: "service-worker.js",
            clientsClaim: true,
            skipWaiting: true,
            exclude: [/\.js$/, /\.css$/, /\.html$/],
            // Define runtime caching rules.
            runtimeCaching: [
                {
                    urlPattern: /\.(?:png|jpg|jpeg|svg|ico)$/,
                    handler: "cacheFirst",
                    options: {
                        cacheName: "images",
                        expiration: {
                            maxEntries: 100
                        }
                    }
                },
                {
                    urlPattern: /\.(?:css|js)$/,
                    handler: "networkFirst",
                    options: {
                        networkTimeoutSeconds: 5,
                        cacheName: "assets",
                        expiration: {
                            maxEntries: 50
                        },
                        broadcastUpdate: {
                            channelName: 'assets-update',
                        },
                    }
                },
                {
                    urlPattern: new RegExp('^(https|http)://(((dev)?literatureapi\\.bcc\\.no)|(localhost:58330))/api/(books|Article|article|authors)'),
                    handler: 'networkFirst',
                    options: {
                        cacheName: "api-calls",
                        cacheableResponse: {
                            statuses: [0, 200]
                        },
                        expiration: {
                            maxEntries: 10,
                        },
                    }
                },
                {
                    urlPattern: new RegExp('^(https|http)://(((dev)?literatureapi\\.bcc\\.no)|(localhost:58330))/api/blobs/image'),
                    handler: 'staleWhileRevalidate',
                    options: {
                        cacheName: "api-images",
                        cacheableResponse: {
                            statuses: [0, 200]
                        },
                        expiration: {
                            maxEntries: 300,
                        },
                    }
                }
            ]
        }
    },
    configureWebpack:{
        devtool:'source-map'
    }    
};
