
exports.DATABASE_URL = process.env.DATABASE_URL ||
                       global.DATABASE_URL ||
	                     'mongodb://localhost/shul-app';
exports.TEST_DATABASE_URL = (
	process.env.TEST_DATABASE_URL ||
	'mongodb://localhost/shul-app');
	// 'mongodb://localhost/test-shul-app';
  // 'mongodb://dwolff:mongo@613@ds133856.mlab.com:33856/shul-app';
exports.PORT = process.env.PORT || 8080;
