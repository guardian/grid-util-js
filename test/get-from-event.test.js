import {expect} from 'chai';
import GridHelper from '../src/index.js';

describe('Get from event', function () {
	var helper = new GridHelper();

	describe('Crop', function () {
		var mockEvent = cropData => {
			return {
				dataTransfer: {
					getData(key) {
						if (key === GridHelper.CROPS_DATA_IDENTIFIER) {
							return JSON.stringify(cropData);
						}
					}
				}
			};
		};

		it('from invalid input', function () {
			expect(helper.getCropFromEvent()).to.be.undefined;
			expect(helper.getCropFromEvent({})).to.be.undefined;
			expect(helper.getCropFromEvent(mockEvent())).to.be.undefined;
			expect(helper.getCropFromEvent({
				dataTransfer: {
					getData() {
						return 'invalid JSON';
					}
				}
			})).to.be.undefined;
		});

		it('valid event', function () {
			expect(helper.getCropFromEvent(mockEvent({
				assets: [{ one: 1 }]
			}))).to.deep.equal({
				assets: [{ one: 1 }]
			});
		});
	});

	describe('URI', function () {
		var mockEvent = urlString => {
			return {
				dataTransfer: {
					getData(key) {
						if (key === GridHelper.GRID_URL_DATA_IDENTIFIER) {
							return urlString;
						}
					}
				}
			};
		};

		it('valid event', function () {
			expect(helper.getGridUrlFromEvent(mockEvent('just a string'))).to.be.equal('just a string');
		});
	});
});
