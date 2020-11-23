#!/usr/bin/env node
var alias = { c: 'category' }
var _default = { category: 'mak' }
var defaultConfig = { alias, 'default': _default }
var { category, _ } = require('minimist')(process.argv.slice(2), defaultConfig)
var value = _.join(' ')
var params = { category, value }

var yo = require('yo-yo')
var Service = require('./service')
var hook = f => g => (e, d) => e ? f(e) : g(d)
var h = hook(error => console.log(String(yo`<p>${String(error)})</p>`)))
var link = (href, content) => yo`<a href=${href} target="_blank">${content}</a>`
var img = ({ src }) => yo`<img src=${src} />`

var client = new Service()
client.request(params, h(results => (
  console.log(String(yo`<main>${results.map(article)}</main>`))
)))

function article ({ uri, title, thumbnail, links }) {
  return yo`<article>
  <section>
    <p>
      <cite>${link(uri, title)}</cite>
    </p>
    <figure>
      ${link(uri, img(thumbnail))}
    </figure>
  </section>
  <aside>
    <ul>
    ${links.map(({ href, title }) => yo`<li>${link(href, title)}</li>`)}
    </ul>
  </aside>
</article>`
}
