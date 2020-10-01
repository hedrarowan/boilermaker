const router = require('express').Router()

const sc = require('supercolliderjs')

module.exports = router

router.get('/', async (req, res, next) => {
  try {
    console.log('HERE IS THE SC')
    sc.server.boot().then(server => {
      let def = server.synthDef(
        'bubbles',
        `
  

      (

        SynthDef.new("hedrasnewsynth", {
          var amp2, freq1, freq2, sig1, sig2;
        
          freq1 = LFNoise0.kr(3).exprange(40, 40 * 25).round(40);
          freq2 = LFNoise0.kr(2).exprange(40, 40 * 25).round(40);
        
          sig1 = Pulse.ar(freq1, 0.5, 0.5);
          sig2 = Pulse.ar(freq2, 0.5, 0.5);
          Out.ar(0, sig1);
          Out.ar(1, sig2);
        }).add;
        
        
        )
    `
      )

      setInterval(() => {
        server.synth(def, {
          wobble: 2,
          innerWobble: 2,
          releaseTime: 2
        })
      }, 1000)
    })
  } catch (err) {
    next(err)
  }
})

router.delete('/', async (req, res, next) => {
  try {
    console.log(sc.server.msg.status)
    await sc.server.msg.status()
  } catch (error) {
    console.log(error)
  }
})
