import { run } from '@ember/runloop';
import { set } from '@ember/object';
import { module } from 'qunit';
import { setupTest } from 'ember-qunit';
import test from 'dummy/tests/ember-sinon-qunit/test';
import sinon from 'sinon';

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

let intercomStub = null;

module('Unit | Service | intercom', function(hooks) {
  setupTest(hooks);

  hooks.beforeEach(function() {
    this.owner.register('service:config', mockConfig, { instantiate: false });

    intercomStub = sinon.stub();

    this.owner.lookup('service:intercom').set('api', intercomStub);
    this.owner.lookup('service:intercom').set('config', mockConfig.intercom);
  });

  test('it adds the correct user context to the boot config', function(assert) {
    let actualUser = {
      name: 'foo',
      email: 'foo@foo.com',
      createdAt: new Date(),
      custom: 'my-custom-property'
    };

    let service = this.owner.lookup('service:intercom');

    set(service.user, 'email', actualUser.email);
    set(service.user, 'name', actualUser.name);
    set(service.user, 'createdAt', actualUser.createdAt);
    set(service.user, 'custom', actualUser.custom);

    run(() => service.start({
      custom: actualUser.custom
    }));

    // jscs:disable requireCamelCaseOrUpperCaseIdentifiers
    let expectedBootConfig = {
      app_id: mockConfig.intercom.appId,
      name: actualUser.name,
      email: actualUser.email,
      createdAt: actualUser.createdAt,
      custom: actualUser.custom
    };
    // jscs:enable requireCamelCaseOrUpperCaseIdentifiers

    assert.equal(!!intercomStub.calledOnce, true, 'it called the intercom module');
    sinon.assert.calledWith(intercomStub, 'boot', expectedBootConfig);
  });
});
