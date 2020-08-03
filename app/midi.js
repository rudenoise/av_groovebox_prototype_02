'use strict'

async function start(kick, snare, domStuff) {
  const access = await navigator.requestMIDIAccess()
  // Get lists of available MIDI controllers
  const inputs = access.inputs.values()
  const outputs = access.outputs.values()
  let kickOn = false
  let snareOn = false
  function log(msg) {
    console.log('logger: ' + msg)
    const existingLogs = domStuff.logger.innerHTML.split('\n')
    console.log('logger: ', existingLogs)
    domStuff.logger.innerHTML = [msg].concat(existingLogs).join('\n')
  }

  function updateDomC() {
    const src = domStuff.domC.src
    let imgNo =  Number(src.slice(-6, -4))
    if (imgNo === 6) {
      imgNo = 1
    } else {
      imgNo += 1
    }
    domStuff.domC.src = [src.slice(0, -6), '0', imgNo, '.png'].join('')
  }

  let filter = 0

  function toggleVideoFilter() {
    filter = filter ? 0 : 1
    domStuff.video.style = `filter: grayscale(${filter});`
  }

  ;[...inputs].forEach((i) => {
    log('input ' + i.name)
    i.onmidimessage = (m) => {
      let msg = ''
      log(
        i.name +
          ' - <span style="color: white">' +
          JSON.stringify(m.data) +
          '</span>'
      )
      if (m.data[1] === 93) {
        if (m.data[2] === 0) {
          log('<span style="color: red">STOP</span>')
          domStuff.video.pause()
        }
      }
      if (m.data[1] === 94 && m.data[2] === 127) {
        log('<span style="color: lightgreen">PLAY</span>')
        domStuff.video.play()
      }
      if (m.data[1] === 36) {
        log(i.name + ' kick ' + m.data.join('-'))
        if (m.data[0] !== 128 && !kickOn) {
          msg =
            'KICK - <span style="color: white">' + m.data.join('-') + '</span>'
          kick.innerHTML = log(msg)
          kickOn = true
          toggleVideoFilter()
          if (domStuff.video.paused) {
            domStuff.video.play()
          }
          //video.pause()
          domStuff.video.currentTime = 0
          //video.load()
          setTimeout(() => {
            msg = 'KICK - OFF'
            kick.innerHTML = msg
            log(msg)
            kickOn = false
          }, 150)
        }
      }
      if (m.data[1] === 38) {
        log(i.name + ' snare ' + m.data.join('-'))
        if (m.data[0] !== 128 && !snareOn) {
          snare.innerHTML = 'SNARE - ' + m.data.join('-')
          snareOn = true
          setTimeout(() => {
            snare.innerHTML = 'SNARE - OFF'
            snareOn = false
          }, 150)
        }
      }
    }
  })
  ;[...outputs].forEach((o) => {
    log('output ' + o.name)
  })

  access.onstatechange = function (e) {
    // Print information about the (dis)connected MIDI controller
    log([e.port.name, e.port.manufacturer, e.port.state])
  }
}

module.exports.start = start
