var Service = require('../service')
var client = new Service()
var category = 'act'
var value = '桐下悠司'
var params = { category, value }
var hook = a => b => (e, d) => e ? a(e) : b(d)
var h = hook(error => console.error(error))
client.makeRequest(params, h(response => response.pipe(process.stdout, { end: false })))
