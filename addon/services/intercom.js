import { merge } from '@ember/polyfills';
import Service from '@ember/service';
import { computed, get } from '@ember/object';
import { assert } from '@ember/debug';
import { scheduleOnce } from '@ember/runloop';
import intercom from 'intercom';

export default Service.extend({
  api: intercom,

  _userNameProp: computed('config.userProperties.nameProp', function() {
    return get(this, `user.${get(this, 'config.userProperties.nameProp')}`);
  }),

  _userEmailProp: computed('config.userProperties.emailProp', function() {
    return get(this, `user.${get(this, 'config.userProperties.emailProp')}`);
  }),

  _userCreatedAtProp: computed('config.userProperties.createdAtProp', function() {
    return get(this, `user.${get(this, 'config.userProperties.createdAtProp')}`);
  }),

  user: {
    name: null,
    email: null
  },

  _hasUserContext: computed('user', '_userNameProp', '_userEmailProp', '_userCreatedAtProp', function() {
    return !!this.user &&
           !!this._userNameProp &&
           !!this._userEmailProp;
  }),

  _intercomBootConfig: computed('_hasUserContext', function() {
    let appId = get(this, 'config.appId');
    assert('You must supply an "ENV.intercom.appId" in your "config/environment.js" file.', appId);

    // jscs:disable requireCamelCaseOrUpperCaseIdentifiers
    let obj = {
      app_id: appId
    };

    if (this._hasUserContext) {
      let userProperties = get(this, 'config.userProperties');
      let keys = Object.keys(userProperties);

      for (let i = 0; i < keys.length; i++) {
        let property = get(this, `config.userProperties.${keys[i]}`).toString();

        if (this.user[property]) {
          obj[get(userProperties, keys[i])] = this.user[property];
        }
      }
    }
    // jscs:enable requireCamelCaseOrUpperCaseIdentifiers

    return obj;
  }),

  start(bootConfig = {}) {
    let _bootConfig = merge(this._intercomBootConfig, bootConfig);
    scheduleOnce('afterRender', () => this.api('boot', _bootConfig));
  },

  stop() {
    scheduleOnce('afterRender', () => this.api('shutdown'));
  },

  update(properties = {}) {
    scheduleOnce('afterRender', () => this.api('update', properties));
  }
});
