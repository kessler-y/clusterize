var klusterize = require('../../lib/clusterize');

klusterize({
	worker: function() {
		console.log(process.env.text);
		setTimeout(function() {			
			process.exit(0);	
		}, 1000)
	},
	master: function() {
		setTimeout(function() {
			process.exit(0)
		}, 6000);
	},
	reforkOnDeath: false,
	env: {
		text: process.argv[2]
	}
});