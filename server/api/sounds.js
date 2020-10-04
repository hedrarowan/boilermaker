const router = require('express').Router()

const sc = require('supercolliderjs')

module.exports = router

router.get('/', async (req, res, next) => {
  console.log(req.match, req.params, 'REQ')
  try {
    sc.server.boot().then(server => {
      let def = server.synthDef(
        'level0',
        `
  
        (

          SynthDef.new("level0", {

            var amp2, freq1, freq2, sig1, sig2;

            freq1 = LFNoise0.kr(3).exprange(MouseX.kr(0, 40), 40 * 25).round(40);
            freq2 = LFNoise0.kr(2).exprange((MouseY.kr(0, 50)), 40 * 25).round(40);

            sig1 = SinOsc.ar(freq1, 0.5, MouseButton.kr(0, 0.5));
            sig2 = SinOsc.ar(freq2, 0.5, MouseButton.kr(0, 0.5));
            Out.ar(0, sig1);
            Out.ar(1, sig2);
          }).add;


          )
    `
      )


      const spawn = () => {
        server.synth(
          def,
         
          
        )
      }

      spawn()
      res.status(200).end()
    })
  } catch (err) {
    next(err)
  }
})

router.put('/', async (req, res, next) => {
  console.log(req.body)
  try {
    if (req.body.level === 1) {
      sc.server.boot().then(server => {
        let def = server.synthDef(
          'level1',
          `
          (

            SynthDef.new("level1", {
  
              var amp2, freq1, freq2, sig1, sig2;
  
              freq1 = LFNoise0.kr(3).exprange(MouseX.kr(0, 40), 40 * 25).round(40);
              freq2 = LFNoise0.kr(2).exprange((MouseY.kr(0, 50)), 40 * 25).round(40);
      sig1 = Formant.ar(MouseX.kr(0, 660), MouseY.kr(0, 3000), 880.0, MouseButton.kr(0, 0.5), add: 0.0);
      sig2 = Formant.ar(MouseY.kr(0, 660), MouseX.kr(0, 3000), 880.0, MouseButton.kr(0, 0.5), add: 0.0);
  
      Out.ar(0, FreeVerb.ar(sig1, 0.4, 0.7, 0.2));
              Out.ar(1, FreeVerb.ar(sig2, 0.4, 0.7, 0.2));
            }).add;
  
  
            )
      `
        )
        const spawn = () => {
          server.synth(def)
        }

        spawn()
        res.status(200).end()
      })
    } else if (req.body.level === 2) {
      sc.server.boot().then(server => {
        let def = server.synthDef(
          'level2',
          `
          (

            SynthDef.new("level2", {
  
              var amp2, freq1, freq2, sig1, sig2;
  
      freq1 = LFNoise0.kr(MouseX.kr(0, 40).exprange(MouseX.kr(0, 40), 40 * 60).round(40));
      freq2 = LFNoise0.kr(MouseY.kr(40, 0).exprange((MouseY.kr(0, 50)), 40 * 60).round(40));
  
              sig1 = Saw.ar(freq1, MouseButton.kr(0, 0.5));
              sig2 = Saw.ar(freq2, MouseButton.kr(0, 0.5));
          Out.ar(0, FreeVerb.ar(sig1, 0.4, 0.9, 0.2));
        Out.ar(1, FreeVerb.ar(sig2, 0.4, 0.9, 0.2));
            }).add;
  
  
            )
      `
        )
        const spawn = () => {
          server.synth(def)
        }

        spawn()
        res.status(200).end()
      })
    }
  } catch (err) {
    console.log(err)
  }
})

router.delete('/', async (req, res, next) => {
  try {
    sc.lang.boot({debug: false}).then(function async(sclang) {
      sclang
        .interpret('Server.killAll')
        .then(function(answer) {
          console.log('1 + 1 = ' + answer)
        }, console.error)
        .then(function() {
          sclang.quit()
        })
    })

    res
      .status(201)
      .send('done')
      .end()
  } catch (error) {
    console.log(error)
  }
})
