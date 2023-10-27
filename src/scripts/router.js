/******************************************************************************\
|                                                                              |
|                                  router.js                                   |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the url routing that's used for this application.        |
|                                                                              |
|******************************************************************************|
|     Copyright (C) 2023, Data Science Institute, University of Wisconsin      |
\******************************************************************************/

import BaseView from './views/base-view.js';

export default Backbone.Router.extend({

	//
	// attributes
	//

	templates: 'templates',

	//
	// route definitions
	//

	routes: {

		// main routes
		//
		'': 'showWelcome',

		// info routes
		//
		'contact': 'showContact',
		'*address': 'showInfo'
	},

	//
	// main route handlers
	//

	showWelcome: function() {
		this.fetchTemplate('welcome', (text) => {
			import(
				'./views/welcome-view.js'
			).then((WelcomeView) => {

				// show home view
				//
				application.show(new WelcomeView.default({
					template: template(text)
				}), {
					full_width: true,
					nav: 'welcome'
				});
			});
		});
	},

	//
	// info page route handlers
	//

	showContact: function() {
		import(
			'./views/info/contact-view.js'
		).then((ContactView) => {

			// show contact view
			//
			application.show(new ContactView.default(), {
				nav: 'contact'
			});
		});
	},

	showInfo: function(address) {
		this.fetchTemplate(address, (text) => {

			// show info page
			//
			application.show(new BaseView({
				template: template(text)
			}), {
				nav: address.contains('/')? address.split('/')[0] : address
			});
		});
	},

	//
	// error route handlers
	//

	showNotFound: function(options) {
		import(
			'./views/not-found-view.js'
		).then((NotFoundView) => {

			// show not found page
			//
			application.show(new NotFoundView.default(options));
		});
	},

	//
	// utility methods
	//

	fetchTemplate(address, callback) {
		fetch(this.templates + '/' + address + '.tpl').then(response => {
			if (!response.ok) {
				throw response;
			}
			return response.text();
		}).then(template => {
			callback(template);
			return;
		}).catch(error => {

			// show 404 page
			//
			this.showNotFound({
				title: "Page Not Found",
				message: "The page that you are looking for could not be found: " + address,
				error: error
			});
		});
	}
});