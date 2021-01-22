import helpers from './helpers'
import toonify from './toonify'

const CVService = function() {}

CVService.prototype.load = async function() {
  if (this.loaded) return

  self.importScripts('js/opencv.js') // load OpenCV wasm

  this._cv = await self.cv()
  this._helpers = new helpers(this._cv)
  this._toonify = new toonify(this._cv)

  this.loaded = true
}

CVService.prototype.toonify = function(payload) {
  if (!this.loaded) throw Error('OpenCV has not been loaded yet.') // TODO: instead of throwing error, add it to an onload queue and give a warning

  return this._toonify(payload)
}

export default new CVService()