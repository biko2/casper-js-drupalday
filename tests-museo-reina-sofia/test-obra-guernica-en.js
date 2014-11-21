casper.test.begin('Tests relacionados con obra guernica en ingles', 5, function suite(test) {
  casper.viewport(1024, 768);
  casper.start('/coleccion/obra/guernica');

	casper.then(function() {
		test.assertHttpStatus(200, 'Obra localizada correctamente.');
		// Check the presence of the main items in the page.
		test.assertExists('#datos-obra-basicos', 'Bloque de datos básicos existe.');
		test.assertSelectorHasText('#autores-colaboradores', 'Picasso');
	});

	//Cambiamos a la obra en ingles
  casper.then(function () {
    //this.click("#block-locale-language a.dropdown-toggle");
    this.click(".block-locale ul > li.en > a");
  });

	casper.then(function(){
		test.assertSelectorHasText('h1', 'Guernica', 'titulo obra es correcto');
		test.assertSelectorHasText('#autores-colaboradores', 'Picasso', 'autor es correcto');
	});


  casper.run(function() {
    test.done();
  });
});
