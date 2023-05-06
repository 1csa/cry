module.exports = {
  start: () => require('elastic-apm-node').start({
    serviceName: 'zeus',
    usePathAsTransactionName: true,
    serverUrl: 'http://10.126.154.122:8200',
  })
}