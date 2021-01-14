var five = require("johnny-five");
var keypress = require('keypress');

var board = new five.Board();

board.on("ready", function() {
    // Create an Led on pin 13
    var led = new five.Led(13);

    //creating the servos
    var servo = {
        small: new five.Servo({
                pin: 11, 
                type: "continuous"
                }),
        med: new five.Servo({
                pin: 10, 
                type: "continuous"
                }),
        large: new five.Servo({
            pin: 9, 
            type: "continuous"
            })
    }
    
    // make `process.stdin` begin emitting "keypress" events
    keypress(process.stdin);

    var position = {
        small: 0,
        med: 0,
        large: 0
    }

    // listen for the "keypress" event
    process.stdin.on('keypress', function (ch, key) {
        console.log('got "keypress"', key);
        if (!key) {
            return
        }

        switch(key.name) {
            case 'c':
                console.log('close')
                position.small += 0.05
                servo.small.cw(position.small)
                break;
            case 'o':
                console.log('open')
                position.small -= 0.05
                servo.small.cw(position.small)
                break;
            case 'up':
                console.log('up')
                position.med += 0.05
                servo.med.cw(position.med)
                break;
            case 'down':
                console.log('down')
                position.med -= 0.05
                servo.med.cw(position.med)
                break;
            case 'left':
                console.log('left')
                position.large += 0.1
                servo.large.cw(position.large)
                break;
            case 'right':
                console.log('right')
                position.large -= 0.1
                servo.large.cw(position.large)
                break;
        }
    });
    
    process.stdin.setRawMode(true);
    process.stdin.resume();
});
