const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    open: process.platform === 'darwin',
    host: '192.168.0.74',
    port: 8080, // CHANGE YOUR PORT HERE!
    https: true,
  },
})
