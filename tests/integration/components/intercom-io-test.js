import { run } from '@ember/runloop';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

let intercomCommandArgs = {};

let intercomStub = function(command, arg) {
  if (!intercomCommandArgs[command]) {
    intercomCommandArgs[command] = [];
  }
  intercomCommandArgs[command].push(arg || null);
};

const mockConfig = {
  intercom: {
    userProperties: {
      nameProp: 'name',
      emailProp: 'email',
      createdAtProp: 'createdAt',
      customProp: 'custom'
    },
    appId: '1'
  }
};

module('Integration | Component | intercom io', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    this.owner.register('service:config', mockConfig, { instantiate: false });
    this.intercom = this.owner.lookup('service:intercom');
    this.set('intercom.api', intercomStub);
  });

  test('it renders', async function(assert) {
    assert.expect(2);
    let oldStartCount = (intercomCommandArgs.boot || []).length;
    await render(hbs`{{intercom-io}}`);

    assert.equal(this.element.textContent.trim(), '');
    run.next(() => {
      assert.equal(intercomCommandArgs.boot.length - oldStartCount, 1, 'Intercom service "start" was invoked');
    });

  });
});
