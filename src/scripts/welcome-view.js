/******************************************************************************\
|                                                                              |
|                                 welcome-view.js                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the initial welcome view of the application.             |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|     Copyright (C) 2023, Data Science Institute, University of Wisconsin      |
\******************************************************************************/

import '../views/layout/welcome-view.js';

export default BaseView.extend({

	//
	// attributes
	//

	regions: {
		'diagram': '.diagram'
	},

	//
	// rendering methods
	//

	onRender: function() {

		// show diagram
		//
		this.showChildView('diagram', new SDG360View());
	}
});
