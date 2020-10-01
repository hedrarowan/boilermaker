const router = require('express').Router()
const {User} = require('../db/models')
const sc = require('supercolliderjs')

module.exports = router

router.get('/', async (req, res, next) => {
  try {
    console.log('HERE IS THE SC')
    sc.server.boot().then(server => {
      let def = server.synthDef(
        'bubbles',
        `
      SynthDef("bubbles", { arg out=0, wobble=0.9, innerWobble=8, releaseTime=2;
        var f, zout;
        f = LFSaw.kr(MouseX.kr(0, 100), 0, 24, LFSaw.kr(innerWobble, 0, 3, 80)).midicps;
        zout = SinOsc.ar(f, 0, 0.04);
        zout = zout * EnvGen.kr(Env.linen(releaseTime: releaseTime), doneAction: 2);
        Out.ar(out, zout);
      });
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
