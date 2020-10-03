const router = require('express').Router()

const sc = require('supercolliderjs')

module.exports = router

router.get('/', async (req, res, next) => {
  console.log(req.match, req.params, 'REQ')
  try {
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
          'hedrasnewsynth',
          `
        (
  
          SynthDef.new("hedrasnewsynth", {
           
            var amp2, freq1, freq2, sig1, sig2;
          
            freq1 = LFNoise0.kr(3).exprange(MouseX.kr(0, 40), 40 * 25).round(40);
            freq2 = LFNoise0.kr(2).exprange((MouseY.kr(0, 50)), 40 * 25).round(40);
          
            sig1 = Pulse.ar(freq1, 0.5, MouseButton.kr(0, 0.5));
            sig2 = Pulse.ar(freq2, 0.5, MouseButton.kr(0, 0.5));
            Out.ar(0, sig1);
            Out.ar(1, sig2);
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
          'hedrasnewsynth',
          `
        (
  
          SynthDef.new("hedrasnewsynth", {
           
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
