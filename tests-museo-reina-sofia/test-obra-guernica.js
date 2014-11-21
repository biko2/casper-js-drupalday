var phantomcss = require('./../phantomcss.js');

phantomcss.init( {
		libraryRoot: '/Users/davidgil/Sites/museo/test'
	}
);

casper.test.begin('Tests relacionados con obra guernica', 5, function suite(test) {
  casper.viewport(1024, 768);
  casper.start('/coleccion/obra/guernica');

	casper.then(function() {
		test.assertHttpStatus(200, 'Obra localizada correctamente.');
		// Check the presence of the main items in the page.
		test.assertExists('#datos-obra-basicos', 'Bloque de datos básicos existe.');
		test.assertSelectorHasText('#autores-colaboradores', 'Picasso');
	});

	casper.then(function(){
		phantomcss.screenshot('#datos-obra-basicos', 'bloque datos basicos');
	});

	casper.then(function(){
		phantomcss.screenshot('#imagen-obra', 'foto de la obra');
	});

	casper.then( function(){
		// comparamos los pantallazos
		phantomcss.compareAll();
	});

  casper.run(function() {
    test.done();
		phantom.exit(phantomcss.getExitStatus());
  });
});

