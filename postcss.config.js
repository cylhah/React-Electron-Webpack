module.exports = {
  plugins: [
    require('autoprefixer')({
      overrideBrowserslist: ['> 0.1%', 'ios >= 8', 'not ie < 12']
    })
  ]
}