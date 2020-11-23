var test = require('tape')
var fs = require('fs')
var url = require('url')
var path = require('path')
var { pipe, through } = require('mississippi')
var Service = require('./service')

test('', t => {
  t.plan(1)
  t.ok(Service)
})

test('var instance = new Constructor()', t => {
  t.test('client = new Service()', t => {
    t.plan(1)
    var s = new Service()
    t.ok(s instanceof Service)
  })
  t.test('client = Service()', t => {
    t.plan(1)
    var s = Service()
    t.ok(s instanceof Service)
  })
})

test('client.config = { urlencode, url, backoff, hyperquest }', t => {
  var s = new Service()
  t.test('client.config.urlencode has a "charset" prop', t => {
    t.plan(1)
    var charset = 'utf8'
    t.is(s.config.urlencode.charset, charset, `charset "${charset}"`)
  })
  t.test('client.config.url has "searchHome", "serviceHome" props', t => {
    t.plan(2)
    var serviceHome = 'https://ec.toranoana.jp'
    var searchHome = 'https://ec.toranoana.jp/joshi_r/ec/app/catalog/list/'
    t.is(s.config.url.serviceHome, serviceHome, `serviceHome is "${serviceHome}"`)
    t.is(s.config.url.searchHome, searchHome, `searchHome is "${searchHome}"`)
  })
  t.test('client.config.backoff has a "failAfter" prop', t => {
    t.plan(1)
    var failAfter = 10
    t.is(s.config.backoff.failAfter, failAfter, `failAfter is ${failAfter}`)
  })
  t.test('client.config.hyperquest has "method", "headers" props', t => {
    t.plan(2)
    var method = 'GET'
    var cookie = 'adflg=0'
    var userAgent = 'hyperquest/2.13'
    var headers = { cookie, 'user-agent': userAgent }
    t.is(s.config.hyperquest.method, method, `method eq "${method}"`)
    t.deepEqual(s.config.hyperquest.headers, headers, `headers eq "${JSON.stringify(headers)}"`)
  })
  t.end()
})

test('requestURI = client.createURI({ category, value, opts = {} )', t => {
  var s = new Service()
  t.test('category "mak"', t => {
    var category = 'mak'
    var value = '犬メリー'
    var params = { category, value }
    var _expected = 'https://ec.toranoana.jp/joshi_r/ec/app/catalog/list/?searchCategoryCode=04&searchMaker=%E7%8A%AC%E3%83%A1%E3%83%AA%E3%83%BC&searchBackorderFlg=0&searchUsedItemFlg=1&searchDisplay=12&detailSearch=true'
    var _result = s.createURI(params)
    var expected = url.parse(_expected, true)
    var result = url.parse(_result, true)
    t.is(expected.protocol, result.protocol, `protocol "${result.protocol}"`)
    t.is(expected.host, result.host, `host "${result.host}"`)
    t.is(expected.hostname, result.hostname, `hostname "${result.hostname}"`)
    t.is(expected.port, result.port, `port "${result.port}"`)
    t.is(expected.pathname, result.pathname, `pathname "${result.pathname}"`)
    t.deepEqual(expected.query, result.query, `requestURI.query = ${JSON.stringify(result.query)}`)
    t.end()
  })
  t.test('category "nam"', t => {
    var category = 'nam'
    var value = '娼年'
    var params = { category, value }
    var _expected = 'https://ec.toranoana.jp/joshi_r/ec/app/catalog/list/?searchCategoryCode=04&searchCommodityName=%E5%A8%BC%E5%B9%B4&searchBackorderFlg=0&searchUsedItemFlg=1&searchDisplay=12&detailSearch=true'
    var _result = s.createURI(params)
    var expected = url.parse(_expected, true)
    var result = url.parse(_result, true)
    t.deepEqual(expected.query, result.query, `requestURI.query = ${JSON.stringify(result.query)}`)
    t.end()
  })
  t.test('category "act"', t => {
    var category = 'act'
    var value = '池咲ミサ'
    var params = { category, value }
    var _expected = 'https://ec.toranoana.jp/joshi_r/ec/app/catalog/list/?searchCategoryCode=04&searchActor=%E6%B1%A0%E5%92%B2%E3%83%9F%E3%82%B5&searchBackorderFlg=0&searchUsedItemFlg=1&searchDisplay=12&detailSearch=true'
    var _result = s.createURI(params)
    var expected = url.parse(_expected, true)
    var result = url.parse(_result, true)
    t.deepEqual(expected.query, result.query, `requestURI.query = ${JSON.stringify(result.query)}`)
    t.end()
  })
  t.test('category "mch"', t => {
    var category = 'mch'
    var value = 'アルスラーン'
    var params = { category, value }
    var _expected = 'https://ec.toranoana.jp/joshi_r/ec/app/catalog/list/?searchCategoryCode=04&searchChara=%E3%82%A2%E3%83%AB%E3%82%B9%E3%83%A9%E3%83%BC%E3%83%B3&searchBackorderFlg=0&searchUsedItemFlg=1&searchDisplay=12&detailSearch=true'
    var _result = s.createURI(params)
    var expected = url.parse(_expected, true)
    var result = url.parse(_result, true)
    t.deepEqual(expected.query, result.query, `requestURI.query = ${JSON.stringify(result.query)}`)
    t.end()
  })
  t.test('category "gnr"', t => {
    var category = 'gnr'
    var value = 'FGO'
    var params = { category, value }
    var _expected = 'https://ec.toranoana.jp/joshi_r/ec/app/catalog/list/?searchCategoryCode=04&searchWord=FGO&searchBackorderFlg=0&searchUsedItemFlg=1&searchDisplay=12&detailSearch=true'
    var _result = s.createURI(params)
    var expected = url.parse(_expected, true)
    var result = url.parse(_result, true)
    t.deepEqual(expected.query, result.query, `requestURI.query = ${JSON.stringify(result.query)}`)
    t.end()
  })
  t.test('category "kyw"', t => {
    var category = 'kyw'
    var value = '種付けおじさん'
    var params = { category, value }
    var _expected = 'https://ec.toranoana.jp/joshi_r/ec/app/catalog/list/?searchCategoryCode=04&searchWord=%E7%A8%AE%E4%BB%98%E3%81%91%E3%81%8A%E3%81%98%E3%81%95%E3%82%93&searchBackorderFlg=0&searchUsedItemFlg=1&searchDisplay=12&detailSearch=true'
    var _result = s.createURI(params)
    var expected = url.parse(_expected, true)
    var result = url.parse(_result, true)
    t.deepEqual(expected.query, result.query, `requestURI.query = ${JSON.stringify(result.query)}`)
    t.end()
  })
  t.test('category "com"', t => {
    var category = 'com'
    var value = 'メスイキ'
    var params = { category, value }
    var _expected = 'https://ec.toranoana.jp/joshi_r/ec/app/catalog/list/?searchCategoryCode=04&searchWord=%E3%83%A1%E3%82%B9%E3%82%A4%E3%82%AD&searchBackorderFlg=0&searchUsedItemFlg=1&searchDisplay=12&detailSearch=true'
    var _result = s.createURI(params)
    var expected = url.parse(_expected, true)
    var result = url.parse(_result, true)
    t.deepEqual(expected.query, result.query, `requestURI.query = ${JSON.stringify(result.query)}`)
    t.end()
  })
  t.end()
})

test('requestOpts = client.createOpts({ category, value, opts = {} })', t => {
  var s = new Service()
  var category = 'act'
  var value = '桐下悠司'
  var params = { category, value }
  var requestOpts = s.createOpts(params)
  var expected = {
    method: 'GET',
    headers: {
      'user-agent': 'hyperquest/2.13',
      cookie: 'adflg=0'
    }
  }
  t.deepEqual(requestOpts, expected, `requestOpts "${JSON.stringify(requestOpts)}"`)
  t.end()
})

var valid = require('is-my-json-valid')
var schema = require('doujinshop-meta-search-service/schema-results')

test('duplexStream = client.scraper()', t => {
  var s = new Service()
  var html = path.join(__dirname, 'data/result.html')
  var spy = []
  var v = valid(schema)
  pipe(
    fs.createReadStream(html),
    s.scraper(),
    through.obj((article, _, done) => {
      t.ok(v(article), `valid result ${JSON.stringify(article)}`)
      spy.push(article)
      done()
    }),
    error => {
      t.error(error, 'no error')
      t.is(spy.length, 29, 'results of scrape is 29')
      t.end()
    }
  )
})
