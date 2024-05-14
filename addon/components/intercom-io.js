import { inject as service } from '@ember/service';
import Component from '@ember/component';
import { get } from '@ember/object';

export default Component.extend({
  intercom: service(),
  didInsertElement() {
    this._super(...arguments);
    this.intercom.start();
  },
  willDestroyElement() {
    this._super(...arguments);
    this.intercom.stop();
  }
});
