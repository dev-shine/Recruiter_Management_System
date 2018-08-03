var Service = require('node-windows').Service;

// Create a new service object
var svc = new Service({
  name:'Hey World',
  description: 'The nodejs.org example web server.',
  script: 'E:\\Final\\Source-X-1.0 15042017\\Source-X-1.0\\Server\\Server.js'
});

// Listen for the "install" event, which indicates the
// process is available as a service.
svc.on('install',function(){
  svc.start();
});

svc.install();
