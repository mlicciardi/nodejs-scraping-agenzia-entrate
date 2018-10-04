const _ = require('lodash');
const casper = require('casper').create({
  pageSettings: {
    loadImages:  false,
  },
  logLevel: "debug",
  verbose: true
});

const uffici = [];

casper.start('https://www1.agenziaentrate.gov.it/servizi/tassazioneattigiudiziari/registrazione.htm', function() {
  this.then(function() {
    if (!this.exists('#ufficio') || !this.exists('#avanti')) {
      this.capture('capture.err.png');
      this.exit();
    }

    _.each(this.evaluate(function() {
      var selector =  document.querySelector('#ufficio');
      if (!selector) return { err: ['#ufficio not found'] };

      var children = selector.children;
      if (!children || !children.length) return { err: ['#ufficio has no children'] };

      return [].map.call(children, function(option) {
        return { id: option.value, name: option.textContent.trim() };
      });
    }), function(data) {
      if (data.id && data.name) {
        uffici.push({
          id: data.id,
          name: data.name,
          enti: [],
        });
      }
    });
  });

  this.then(function() {
    var index = 0;
    this.echo('Item with id: ' + uffici[index].id + ' in position ' + index + ' (Array of ' + uffici.length + ' items)')
    var id = uffici[index].id;

    this.click('#ufficio');
    this.then(function() {
      this.capture('click.png');
    });
    // this.click('#ufficio option:nth-child('+ (index + 2) +')');
    // this.then(function() {
    //   this.capture('capture.png');
    // });

    // this.click('#avanti');
    // this.then(function() {
    //   this.capture('capture.png');
    // });

    // if (this.exists('#gotass')) {
    //   this.click('#gotass');
    //   this.then(function() {
    //     this.echo('#gotass then');
    //     this.capture('capture-gotass.png');
    //   });
    // } else {
    //   this.echo('#gotass not found');
    // }
  });
}).run();

// casper.then(function() {
//   var index = 0;
//   this.repeat(uffici.length, function() {
//     const id = uffici[index].id;
//     if (!id) {
//       ++index;
//     } else {
//       var selector;

//       while(this.evaluate(function () { return document.readyState != 'complete' && document.readyState != 'interactive'; })) {}

//       this.waitForSelector('form[action="/servizi/tassazioneattigiudiziari/registrazione.htm?action=scegliufficio]');
//       this.evaluate(function() {
//         document.querySelector('#ufficio')

//         var selector =  document.querySelector('#ufficio');
//         if (!selector) {
//           uffici[index].err.push('#ufficio not found while trying to iterate #ente');
//         }

//         var children = selector.children;
//         if (!children || !children.length) {
//           uffici[index].err.push('#ufficio has no children while trying to iterate #ente');
//         }

//         $('#ufficio').val(id).change();
//       });

//       this.waitForSelector('#avanti');
//       this.click('#avanti');

//       this.waitForSelector('form[action="/servizi/tassazioneattigiudiziari/registrazione.htm?action=scegliente]');
//       if (!this.exists('#ente') || !this.exists('#gotass')) {
//         this.capture('capture.err._' + index +'_.png');
//         this.exit();
//       }

//       _.each(this.evaluate(function() {
//         var selector =  document.getElementById('ente');
//         if (!selector) return { err: '#ente not found' };

//         var options = selector.children;
//         if (!options || !options.length) return { err: '#ente has no children' };

//         return [].map.call(options, function(option) {
//           return { id: option.value, name: option.textContent.trim() };
//         });
//       }), function(data) {
//         uffici[index].enti.push({
//           id: data.id,
//           name: data.id,
//         });
//       });

//       this.echo(JSON.stringify(uffici[0]));

//       if (++index !== uffici.length) {
//         this.waitForSelector('#gotass');
//         this.click('#gotass');
//       }
//     }
//   });
// });

// casper.then(function() {
//   this.echo(JSON.stringify(uffici));
//   this.echo('Scraped ' + uffici.length + ' items.');
// });
