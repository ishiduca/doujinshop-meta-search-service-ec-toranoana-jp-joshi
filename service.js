var xtend = require('xtend')
var inherits = require('inherits')
var trumpet = require('trumpet')
var { pipe, duplex, through, concat } = require('mississippi')
var Service = require('doujinshop-meta-search-service')
var ServiceEcToranoanaJp = require('doujinshop-meta-search-service-ec-toranoana-jp')

function ServiceEcToranoanaJpJoshi () {
  if (!(this instanceof ServiceEcToranoanaJpJoshi)) return new ServiceEcToranoanaJpJoshi()
  var { urlencode, backoff, hyperquest } = Service.defaultConfig
  var serviceHome = 'https://ec.toranoana.jp'
  var searchHome = `${serviceHome}/joshi_r/ec/app/catalog/list/`
  var cookie = 'adflg=0'
  var headers = xtend(hyperquest.headers, { cookie })
  var config = {
    url: { serviceHome, searchHome },
    urlencode: xtend(urlencode),
    backoff: xtend(backoff),
    hyperquest: xtend(hyperquest, { headers })
  }
  Service.call(this, config)
}

inherits(ServiceEcToranoanaJpJoshi, Service)
module.exports = ServiceEcToranoanaJpJoshi

var {
  createURI: _createURI,
  createOpts: _createOpts
} = ServiceEcToranoanaJp.prototype

ServiceEcToranoanaJpJoshi.prototype.createURI = _createURI
ServiceEcToranoanaJpJoshi.prototype.createOpts = _createOpts

ServiceEcToranoanaJpJoshi.prototype.scraper = function scraper () {
  var sink = trumpet()
  var source = through.obj()
  var isBingo = false
  var count = 0
  var { serviceHome } = this.config.url
  var selector = (
    '#search-result-container.search-main-contents.pull-right>div.search-result-container>ul.product-list-container>li.product-list-item>div.product-list-item-inn'
  )

  sink.selectAll(selector, div => {
    isBingo = true
    count += 1
    var tr = trumpet()
    var _ = {}
    var links = []

    tr.once('end', () => {
      source.write({ links, ..._ })
      ;(count -= 1) || source.end()
    })

    var selectors = [
      '.product-list-desc section div.product-list-name a',
      '.product-list-desc section ul.product-list-labels li a'
    ].join(',')
    tr.selectAll(selectors, a => {
      var lnk = {}
      pipe(
        a.createReadStream(),
        concat(title => {
          lnk.title = String(title).replace(/<[^>]+?>/g, '')
        }),
        error => {
          if (error) return source.emit('error', error)
          a.getAttribute('href', href => {
            lnk.href = serviceHome + href
            links.push(lnk)
          })
        }
      )
    })

    tr.select('.product-list-img a img', img => {
      img.getAttribute('data-src', src => (_.thumbnail = { src }))
    })

    tr.select('.product-list-desc section h3.product-list-title a', a => {
      pipe(
        a.createReadStream(),
        concat(buf => {
          _.title = String(buf)
            .replace(/\s/g, '').replace(/\r/g, '').replace(/\n/g, '')
        }),
        error => {
          if (error) return source.emit('error', error)
          a.getAttribute('href', href => {
            _.uri = serviceHome + href
          })
        }
      )
    })

    pipe(
      div.createReadStream(),
      tr,
      error => {
        if (error) return sink.emit('error', error)
      }
    )
  })

  sink.once('end', () => (isBingo || source.end()))
  return duplex.obj(sink, source)
}
