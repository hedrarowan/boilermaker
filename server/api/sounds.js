const router = require('express').Router()

const sc = require('supercolliderjs')

module.exports = router

router.get('/', async (req, res, next) => {
  try {
    // console.log(req.params, "REQQQQ")
    sc.server.boot().then(server => {
      let def = server.synthDef(
        'hedrasnewsynth',
        `
      (

        SynthDef.new("hedrasnewsynth", {
         
          var amp2, freq1, freq2, sig1, sig2;
        
          freq1 = LFNoise0.kr(MouseX.kr(0.1, 10)).exprange(40, 40 * 25).round(40);
          freq2 = LFNoise0.kr(MouseY.kr(0.1, 12)).exprange(40, 40 * 25).round(40);
        
          sig1 = Pulse.ar(freq1, 0.5, MouseButton.kr(0, 0.5));
          sig2 = Pulse.ar(freq2, 0.5, MouseButton.kr(0, 0.5));
          Out.ar(0, sig1);
          Out.ar(1, sig2);
        }).add;
        
        
        )
    `
      )

      const group = server.group()

      const spawn = () => {
        server.synth(
          def,
          {
            // spawn each synth into the same group
          },
          group
        )
      }
      // const next = Math.random() * 0.25;

      // Schedule this function again:
      // setTimeout(() => spawn(next), next * 1000);
      spawn()
    })
  } catch (err) {
    next(err)
  }
})

router.delete('/', async (req, res, next) => {
  try {
    await sc.server.msg.quit()
    // await sc.server.msg.quit()
  } catch (error) {
    console.log(error)
  }
})
