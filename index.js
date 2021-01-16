var HID = require('node-hid');
var devices = HID.devices();
var device = new HID.HID(devices.find(x=> x.product === 'Logitech Dual Action').path);
var five = require("johnny-five");
var keypress = require('keypress');
const { debounce, throttle } = require('lodash');

var board = new five.Board();

board.on("ready", function() {
    //creating the servos
    var servo = {
        small: new five.Servo({
            pin: 11, 
            range: [10, 180]
        }),
        med: new five.Servo({
            pin: 10, 
            range: [10, 150]
        }),
        large: new five.Servo({
            pin: 9, 
            range: [0, 180],
        })
    }
    
    // make `process.stdin` begin emitting "keypress" events
    keypress(process.stdin);

    var position = {
        small: 95,
        med: 80,
        large: 100
    }

    var state = {
        small: 0,
        med: 0,
        large: 0
    }

    const CLOSE_DIFF = 0.5
    const close = () => {
        if (position.small < 180) {
            console.log('close', position.small)
            position.small += CLOSE_DIFF
            servo.small.to(position.small)
        }
    }

    const open = () => {
        if (0 < position.small) {
            console.log('open', position.small)
            position.small -= CLOSE_DIFF
            servo.small.to(position.small)
        }
    }

    const LARGE_DIFF = 0.5
    const left = () => {
        if (position.large < 180) {
            console.log('left', position.large)
            position.large += LARGE_DIFF
            servo.large.to(position.large)
        }
    }

    const right = () => {
        if (0 < position.large) {
            console.log('right', position.large)
            position.large -= LARGE_DIFF
            servo.large.to(position.large)
        }
    }

    const MID_DIFF = 0.5
    const up = () => {
        if (position.med < 180) {
            console.log('up', position.med)
            position.med += MID_DIFF
            servo.med.to(position.med)
        }
    }

    const down = () => {
        if (0 < position.med) {
            console.log('down', position.med)
            position.med -= MID_DIFF
            servo.med.to(position.med)
        }
    }

    var throttled = false
    const throttle = (f, duration) => {
        var recent = f
        if (!throttled) {
            f()
            throttled = true
            setTimeout(() => {
                throttled = false
                recent()
            }, duration)   
        } 
    }

    // listen for the "keypress" event
    process.stdin.on('keypress', function (ch, key) {
        // console.log('got "keypress"', key);
        if (!key) {
            return
        }

        switch(key.name) {
            case 'c':
                close()
                break;
            case 'o':
                open()
                break;
            case 'up':
                up()
                break;
            case 'down':
                down()
                break;
            case 'left':
                left()
                break;
            case 'right':
                right()
                break;
        }
    });

    process.stdin.setRawMode(true);
    process.stdin.resume();

    device.on("data", (data) =>{
        var logs = Array.from(data)
        console.log(logs)
        if (logs[4] == 72) {
            state.small = -1
        } else if (logs[4] == 40) {
            state.small = 1
        } else {
            state.small = 0
        }
        
        if (logs[1] > 150) {
            state.med = -1
        } else if (logs[1] < 100) {
            state.med = 1
        } else {
            state.med = 0
        }
        
        
        if (logs[2] > 150) {
            console.log('crayon')
            state.large = -1
        } else if (logs[2] < 100) {
            console.log('pencil')
            state.large = 1
        } else {
            console.log('marker')
            state.large = 0
        }
    })

    setInterval(() => {
        if (state.small == -1) {
            close()
        } else if (state.small == 1) {
            open()
        }
        
        if (state.med == -1) {
            down()
        } else if (state.med == 1) {
            up()
        }
    
        if (state.large == -1) {
            right()
        } else if (state.large == 1) {
            left()
        }
    }, 5);
});