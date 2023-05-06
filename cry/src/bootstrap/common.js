//console.log('common js');

think.app.on('appReady', () => {
  if (think.app.server) {
    think.app.server.keepAliveTimeout = 61 * 1000
    think.app.server.headersTimeout = 65 * 1000
  }
  // console.log(think.app.server)
})