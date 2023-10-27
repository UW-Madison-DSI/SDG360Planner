/******************************************************************************\
|                                                                              |
|                                sdg360-view.js                                |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is an interactive graphic of a sustainable development           |
|        goal wheel / pie chart.                                               |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|     Copyright (C) 2023, Data Science Institute, University of Wisconsin      |
\******************************************************************************/

import BaseView from '../views/base-view.js';

export default BaseView.extend({

	//
	// attributes
	//

	className: 'sdg360',

	template: _.template(`
		<svg width="500" height="500">
			<defs>
				<filter x="-.05" y="0.15" width="1.1" height="0.75" id="white-background">
					<feFlood flood-color="white"/>
					<feComposite in="SourceGraphic"/>
				</filter>
			</defs>
		</svg>
		<img class="icon" style="display:none">
	`),

	categories: [
		"No Poverty",
		"Zero Hunger",
		"Good Health and Well Being",
		"Quality Education",
		"Gender Equality",
		"Clean Water and Sanitation",
		"Affordable and Clean Energy",
		"Decent World and Economic Growth",
		"Industry, Innovation and Infrastructure",
		"Reduced Inequalities",
		"Sustainable Cities and Communities",
		"Responsible Consumption and Production",
		"Climate Action",
		"Life Below Water",
		"Life on Land",
		"Peace, Justic, and Strong Institutions",
		"Partnerships for the Goals"
	],

	colors: [
		'#ea1d2d',	// red
		'#d19f2a',	// maize
		'#2d9a47',	// medium green
		'#c22033',	// brick red
		'#ef412a',	// tangerine
		'#00add8',	// cyan
		'#fdb714',	// yellow
		'#8f1838', 	// marroon
		'#f36e24',	// orange
		'#e01a83',	// pink
		'#f99d25',	// light orange
		'#cd8b2a', 	// tan
		'#48773c',	// dark green
		'#007dbb', 	// blue
		'#40ae49', 	// light green
		'#00558a', 	// dark cyan
		'#1a3668', 	// dark blue
	],

	events: {
		'mouseover .wedge': 'onMouseOverWedge',
		'mouseleave .wedge': 'onMouseLeaveWedge',
		'click .wedge': 'onClickWedge'
	},

	//
	// constructor
	//

	initialize: function() {

		// preload images
		//
		for (let i = 0; i < this.categories.length; i++) {
			let img = new Image();
			let index = i + 1;
			let id = index < 10? '0' + index : index;
			let filename = 'Goal-' + id + '.png';
			let filepath = 'images/sdg360/' + filename;
			img.src = filepath;
		}
	},

	//
	// rendering methods
	//

	onAttach: function() {
		this.$el.find('svg').append(this.toSVG(250, 250, 200));
	},

	//
	// svg rendering methods
	//

	toWedge(r1, r2, rotation, category, color, sweep, label) {
		let el = document.createElementNS('http://www.w3.org/2000/svg', 'g');
		$(el).attr({
			class: 'wedge'
		});

		// compute start and end angles in radians
		//
		let theta1 = rotation * Math.PI / 180;
		let theta2 = theta1 + (sweep * Math.PI / 180);
		let a = .03;
		let b = .05;

		let vertices = [{
			x: Math.round(Math.cos(theta1 + b) * r2),
			y: Math.round(Math.sin(theta1 + b) * r2)
		}, {
			x: Math.round(Math.cos(theta1 + a) * r1),
			y: Math.round(Math.sin(theta1 + a) * r1)
		}, {
			x: Math.round(Math.cos(theta2 - a) * r1),
			y: Math.round(Math.sin(theta2 - a) * r1)
		}, {
			x: Math.round(Math.cos(theta2 - b) * r2),
			y: Math.round(Math.sin(theta2 - b) * r2)
		}];

		// compute center of wedge
		//
		let cx = 0, cy = 0;
		for (let i = 0; i < vertices.length; i++) {
			cx += vertices[i].x;
			cy += vertices[i].y;
		}
		cx /= vertices.length;
		cy /= vertices.length;

		// start at inner radius
		//
		let d = 'M ' + vertices[0].x + ' ' + vertices[0].y;

		// add bottom line
		//
		d += ' L ' + vertices[1].x + ' ' + vertices[1].y;

		// add outer edge
		//
		// d += ' L ' + vertices[2].x + ' ' + vertices[2].y;
		let dx = vertices[2].x - vertices[1].x;
		let dy = vertices[2].y - vertices[1].y;
		d += ' A ' + r1 + ' ' + r1 + ' 0 0 1 ' + vertices[1].x + ' ' + vertices[1].y;
		d += ' a ' + r1 + ' ' + r1 + ' 0 0 1 ' + dx + ' ' + dy;

		// add top line
		//
		d += ' L ' + vertices[3].x + ' ' + vertices[3].y;

		// connect to start
		//
		// d += ' L ' + vertices[0].x + ' ' + vertices[0].y;
		dx = vertices[0].x - vertices[3].x;
		dy = vertices[0].y - vertices[3].y;
		d += ' A ' + r2 + ' ' + r2 + ' 0 0 0 ' + vertices[3].x + ' ' + vertices[3].y;
		d += ' a ' + r2 + ' ' + r2 + ' 0 0 0 ' + dx + ' ' + dy;

		// create path
		//
		let path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
		$(path).attr({
			d: d,
			id: label
		});
		el.appendChild(path);

		// add label
		//
		if (label != undefined) {
			let text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
			$(text).attr({
				x: cx,
				y: cy
			});
			$(text).html(label);
			el.appendChild(text);
		}

		return el;
	},

	toSVG(x, y, radius) {
		let el = document.createElementNS('http://www.w3.org/2000/svg', 'g');
		let sweep = 360 / this.categories.length;

		for (let i = 0; i < this.categories.length; i++) {
			let category = this.categories[i];
			let color = this.colors[i];
			let rotation = i * sweep - 90;
			let wedge = this.toWedge(radius, radius / 2, rotation, category, color, sweep, (i + 1), radius);

			// set wedge colors
			//
			$(wedge).attr('fill', color);
			$(wedge).attr('stroke', color);

			el.appendChild(wedge);
		}

		// add category display
		//
		let text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
		$(text).attr({
			class: 'category',
			y: 230
		});
		el.appendChild(text);

		// set center
		//
		let translate = 'translate(' + x + ', ' + y + ')';
		$(el).attr('transform', translate);

		return el;
	},

	onMouseOverWedge: function(event) {
		let $el = $(event.target);
		let index = parseInt($el.attr('id'));
		let $icon = this.$el.find('.icon');
		let $category = this.$el.find('.category');

		// show category
		//
		$category.html(this.categories[index - 1]);

		// show icon
		//
		let id = index < 10? '0' + index : index;
		let filename = 'Goal-' + id + '.png';
		let filepath = 'images/sdg360/' + filename;
		$icon.attr('src', filepath).show();

		// add bouncing animation
		//
		$icon.addClass('growing-bounce');
		window.setTimeout(() => {
			$icon.removeClass('growing-bounce');
		}, 300);

		// play tick sound
		//
		// application.play('tick.mp3');
	},

	onMouseLeaveWedge: function(event) {
		let $icon = this.$el.find('.icon');
		let $category = this.$el.find('.category');

		// $icon.attr('src', 'images/sdg360/UN-emblem.svg');
		// $category.html('');
		$icon.hide();

		// add bouncing animation
		//
		$icon.addClass('growing-bounce');
		window.setTimeout(() => {
			$icon.removeClass('growing-bounce');
		}, 300);
	},

	onClickWedge: function(event) {
		let $el = $(event.target);
		let index = parseInt($el.attr('id'));

		// show page
		//
		let id = index < 10? '0' + index : index;
		let path = '#goals/goal-' + id;

		application.navigate(path, {
			trigger: true
		});
	}
});