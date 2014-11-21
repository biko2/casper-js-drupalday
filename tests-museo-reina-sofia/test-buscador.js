/**
 * Test del buscador. Revisamos que al buscar Guernica es el primer resultado.
 *
 */
casper.test.begin('Tests search Guernica', 4, function suite(test) {
  casper.start();

  //test sobre la portada de colección
  casper.thenOpen('/coleccion', function() {
    test.assertHttpStatus(200, 'Portadilla colección cargada correctamente.');
    test.assertExists("form#views-exposed-form-buscar-page input[name='keyword']");
    //test.sendKeys("input[name='keyword']", "guernica");
    this.fill('form#views-exposed-form-buscar-page', {
      keyword: "guernica"
    }, false);
    this.click("#edit-submit-buscar");

  });

  //test sobre página de resultados de búsqueda
  casper.then(function () {
    casper.drupalCapture('guernica', true);
    test.assertSelectorHasText("ul#results_list > li .titulo-obra", "Guernica");
    this.click("ul#results_list > li a.imagen");
  });

  //test sobre página de obra
  casper.then(function () {
    test.assertSelectorHasText("h1.page-header", "Guernica");
  });

  casper.run(function() {
    test.done();
  });
});
