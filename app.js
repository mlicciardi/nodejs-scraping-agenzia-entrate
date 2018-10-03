const casper = require('casper').create();

const uffici = [];

casper.start('https://www1.agenziaentrate.gov.it/servizi/tassazioneattigiudiziari/registrazione.htm');

// casper.then(function() {
//   while(this.evaluate(function () { return document.readyState != 'complete' && document.readyState != 'interactive'; })) {}
// });

casper.then(function() {
  this.waitForSelector('form[action="/servizi/tassazioneattigiudiziari/registrazione.htm?action=scegliufficio"]');
});

casper.then(function() {
  if (!this.exists('#ufficio') || !this.exists('#avanti')) {
    this.capture('capture.err.png');
    this.exit();
  }

  var options =  this.evaluate(function() {
    var select =  document.getElementById('ufficio');
    if (!select) return '#ufficio not found';

    var options = select.children;
    if (!options || !options.length) return '#ufficio has no children';

    return [].map.call(options, function(option) {
      return { id: option.value, name: option.textContent.trim() };
    });
  });

  options.each(function(data) {
    uffici.push({
      id: data.id,
      name: data.id,
      enti: [],
    });
  })
});

casper.run(
  console.log(uffici.length)
);

// const URL = 'https://www1.agenziaentrate.gov.it/servizi/tassazioneattigiudiziari/registrazione.htm';

// casper.start(URL);

// casper.then(function() {
//   this.waitForSelector('form[action="/servizi/tassazioneattigiudiziari/registrazione.htm?action=scegliufficio"]');
//   this.echo(this.getCurrentUrl());
//   this.capture('screenshot.png');

//   this.echo(document.querySelector('#uffici'));
// });

// casper.then(function() {
//   this.click(this.querySelector('#avanti'));
// });

// casper.then(function() {
//   this.waitForSelector('form[action="/servizi/tassazioneattigiudiziari/registrazione.htm?action=scegliente]');
//   this.echo(this.getCurrentUrl());

//   this.echo(this.querySelector('#enti'));
// });

// casper.then(function() {
//   this.click(this.querySelector('#avanti'));
// });

// casper.run();
