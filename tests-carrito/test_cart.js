/**
 * Prueba que el carrito funciona correctamente.
 *
 */
casper.test.begin("Test sobre funcionalidad de compra.", 9, function suite(test) {
  var email = new Date().getTime() + "@test.com";
  var cart_url_regex = /es\/checkout\/([0-9]+)/i;
  var order_id = 0;
  var total_pedido = 0;

  casper.viewport(1024, 768);
  casper.start();
  casper.setHttpAuth('xxx', 'xxx');

  //TESTs sobre ficha de curso y añadir al carrito
  casper.thenOpen('/es/c/curso-seo-mobile', function() {
    this.echo("Usuario con el que realizamos la compra:  " + email);
    test.assertHttpStatus(200, 'Ficha de curso cargada correctamente.');
    test.assertExists("button#edit-submit", 'botón de añadir al carrito existe');
    this.fill('form.commerce-add-to-cart', {}, true);
  });

  //TESTs sobre página de confirmación de compra
  casper.then(function () {
    var matches = cart_url_regex.exec(this.getCurrentUrl());
    test.assertTruthy(matches[1], "Carrito creado con ID: " + matches[1]);
    order_id = matches[1];

    test.assertSelectorHasText("h1.page-header", "Confirma tu compra");

    this.fill('form#commerce-checkout-form-checkout', {
      'account[login][mail]': email
    }, false);
    this.wait(2000, function() {
      this.echo("Esperando AJAX...");
    });
    this.sendKeys("input[name='commerce_user_profile_pane[field_account_name][und][0][value]']", "TestName");
    this.sendKeys("input[name='commerce_user_profile_pane[field_account_surname][und][0][value]']", "TestSurname");
    this.sendKeys("input[name='commerce_user_profile_pane[field_account_phone][und][0][value]']", "555555555");
    this.click("#edit-commerce-user-profile-pane-field-account-terminos-und");
    this.click("#edit-commerce-payment-payment-method-bank-transfercommerce-payment-bank-transfer");
    this.wait(2000, function() {
      this.echo("Esperando AJAX...");
    });

    total_pedido = this.fetchText('.component-total');
    this.echo("Importe total del pedido: " + total_pedido);
    casper.drupalCapture('cart1', true);  //utilidad para pegar pantallazos. util en debug de los test
  });
  casper.thenClick('#edit-continue');

  //TESTs sobre la página de gracias
  casper.then(function() {
    test.assertSelectorHasText("h1", "Gracias", "Compra realizada correctamente en el front.");

    this.echo("La compra debería estar grabada.");
  });

  casper.drupalBeginSession('admin');
  casper.thenOpen('/es/admin/commerce/orders', function() {
    this.echo("Vamos con la verificación en backend.");
    test.assertHttpStatus(200, 'El listado de pedidos responde bien.');

    this.fill('#views-exposed-form-commerce-backoffice-orders-admin-page', {
      'combine': order_id
    }, false);

    this.wait(2000, function() {
      this.echo("Esperando AJAX...");
    });

    //obtenemos la fila del backend que tiene el pedido y lanzamos test
    test.assertExists('.item-' + order_id, 'Existe el pedido en el backend');
    test.assertSelectorHasText('.item-' + order_id, total_pedido, "Importe del pedido correcto.");
    test.assertSelectorHasText('.item-' + order_id, "Compra: Completo", "Estado del pedido correcto.");
  });
  casper.drupalEndSession();

  casper.run(function() {
    test.done();
  });
});