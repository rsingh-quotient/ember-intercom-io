import Router from '@ember/routing/router';
import config from './config/environment';

const R = Router.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

R.map(function() {
  this.route('help');
});

export default R;
