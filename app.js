const _ = require('lodash');
const c = require('casper').create();

const uffici = [];

c.start('https://www1.agenziaentrate.gov.it/servizi/tassazioneattigiudiziari/registrazione.htm');

c.then(function() {
  this.waitForSelector('form[action="/servizi/tassazioneattigiudiziari/registrazione.htm?action=scegliufficio"]');
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
    uffici.push({
      id: data.id,
      name: data.id,
      enti: [],
    });
  });
});

c.then(function() {
  var index = 0;
  this.repeat(uffici.length, function() {
    const id = uffici[index].id;
    if (!id) {
      ++index;
    } else {
      this.waitForSelector('form[action="/servizi/tassazioneattigiudiziari/registrazione.htm?action=scegliufficio]');

      this.evaluate(function() {
        document.querySelector('#ufficio')

        var selector =  document.querySelector('#ufficio');
        if (!selector) {
          uffici[index].err.push('#ufficio not found while trying to iterate #ente');
        }

        var children = selector.children;
        if (!children || !children.length) {
          uffici[index].err.push('#ufficio has no children while trying to iterate #ente');
        }

        $('#ufficio').val(id).change();
      });

      this.click(document.querySelector('#avanti'));

      this.waitForSelector('form[action="/servizi/tassazioneattigiudiziari/registrazione.htm?action=scegliente]');
      if (!this.exists('#ente') || !this.exists('#avanti') || !this.exists('#gotass')) {
        this.capture('capture.err._' + index +'_.png');
        this.exit();
      }

      _.each(this.evaluate(function() {
        var selector =  document.getElementById('ente');
        if (!selector) return { err: '#ente not found' };

        var options = selector.children;
        if (!options || !options.length) return { err: '#ente has no children' };

        return [].map.call(options, function(option) {
          return { id: option.value, name: option.textContent.trim() };
        });
      }), function(data) {
        uffici[index].enti.push({
          id: data.id,
          name: data.id,
        });
      });

      if (++index !== uffici.length) {
        this.click(this.querySelector('#gotass'));
      }
    }
  });
});

c.then(function() {
  this.echo(JSON.stringify(uffici));
  this.echo('Scraped ' + uffici.length + ' items.');
});

c.run();
