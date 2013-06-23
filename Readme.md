
# scoped-events

  Events object with children that bubble up, applying modifiers

## Installation

    $ component install notablemind/scoped-events

## API

### EventEmitter()

#### .child(options)

If you pass in a function, it's treated as `{all: <fn>}`.

`options` is a hash of `event_type: fn`, where `fn` will be called
when the child emits an event that matches `event_type`. Aserisks in
`event_type` will match anything.


   

## License

  MIT
