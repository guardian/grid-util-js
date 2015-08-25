import {expect, default as chai} from 'chai';
import chaiPromise from 'chai-as-promised';
import GridHelper from '../src/index.js';
chai.use(chaiPromise);

describe('Get image', function () {
	it('rejects when fetch is missing', function () {
		var helper = new GridHelper({
			apiBaseUrl: 'http://api.com/',
			fetch: false
		});
		return expect(helper.getImage('123')).to.be.rejectedWith(/invalid fetch implementation/i);
	});

	it('rejects when missing base URL', function () {
		var helper = new GridHelper();
		return expect(helper.getImage('123')).to.be.rejectedWith(/invalid api base url/i);
	});

	it('rejects when missing image ID', function () {
		var helper = new GridHelper({
			apiBaseUrl: 'http://api.com/'
		});
		return expect(helper.getImage()).to.be.rejectedWith(/missing image id/i);
	});

	it('rejects in case of network issues', function () {
		var helper = new GridHelper({
			apiBaseUrl: 'http://api.com/',
			fetch: fetchMock
		});
		return expect(helper.getImage('error')).to.be.rejectedWith(/rejected by fetch/);
	});

	it('rejects in case of roor rejection', function () {
		var helper = new GridHelper({
			apiBaseUrl: 'http://api.com/',
			fetch: () => {
				return Promise.reject(new Error('root failed'));
			}
		});
		return expect(helper.getImage('error')).to.be.rejectedWith(/root failed/);
	});

	it('rejects in case of error status codes', function () {
		var helper = new GridHelper({
			apiBaseUrl: 'http://api.com/',
			fetch: fetchMock
		});
		return expect(helper.getImage('404')).to.be.rejectedWith(/status 404/);
	});

	it('rejects in case of grid error', function () {
		var helper = new GridHelper({
			apiBaseUrl: 'http://api.com/',
			fetch: fetchMock
		});
		return expect(helper.getImage('session-expired')).to.be.rejectedWith(/status 401/);
	});

	it('rejects in case of image not found', function () {
		var helper = new GridHelper({
			apiBaseUrl: 'http://api.com/',
			fetch: fetchMock
		});
		return expect(helper.getImage('image-not-found')).to.be.rejectedWith(/status 404/);
	});

	it('works otherwise', function () {
		var helper = new GridHelper({
			apiBaseUrl: 'http://api.com/',
			fetch: fetchMock
		});
		return expect(helper.getImage('valid')).to.eventually.deep.equal({
			data: {
				from: 'the grid'
			}
		});
	});
});

function fetchMock (url) {
	switch(url.substring(url.lastIndexOf('/') + 1)) {
		case 'error':
			return Promise.reject(new Error('rejected by fetch'));
		case '404':
			return Promise.resolve({
				status: 404
			});
		case 'session-expired':
			return Promise.resolve({
				status: 401,
				statusText: 'Session expired'
			});
		case 'image-not-found':
			return Promise.resolve({
				status: 404,
				statusText: 'image-not-found'
			});
		case 'valid':
			return Promise.resolve({
				status: 200,
				json: function () {
					return Promise.resolve({
						data: {
							from: 'the grid'
						}
					});
				}
			});
		default:
			return Promise.resolve({
				status: 200,
				json: function () {
					return Promise.resolve({
						links: [{
							rel: 'image',
							href: 'http://somewhere/{id}'
						}]
					});
				}
			});
	}
}
