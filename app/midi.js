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

  function updateDomC(imgNo) {
    const src = domStuff.domC.src
    log('0' + imgNo)
    domStuff.domC.src = [src.slice(0, -6), '0', imgNo, '.png'].join('')
  }

  let filter = 0

  function toggleVideoFilter() {
    filter = filter ? 0 : 1
    domStuff.video.style = `filter: grayscale(${filter});`
    domStuff.video.currentTime = 0
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
          updateDomC(1)
        }
      }
      if (m.data[1] === 94 && m.data[2] === 127) {
        log('<span style="color: lightgreen">PLAY</span>')
        domStuff.video.play()
      }
      if (m.data[1] === 60) {
        updateDomC(1)
        toggleVideoFilter()
      }
      if (m.data[1] === 65) {
        updateDomC(3)
        toggleVideoFilter()
      }
      if (m.data[1] === 71) {
        updateDomC(2)
      }
      if (m.data[1] === 70) {
        updateDomC(4)
      }
      if (m.data[1] === 68) {
        updateDomC(6)
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
