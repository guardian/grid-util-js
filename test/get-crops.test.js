import {expect} from 'chai';
import GridHelper from '../src/index.js';

describe('Get crops', function () {
	var helper = new GridHelper();

	it('from invalid input', function () {
		expect(helper.filterCrops).to.throw(TypeError, /invalid image format/i);
		expect(helper.filterCrops.bind(helper, {})).to.throw(TypeError, /invalid image format/i);
	});

	describe('missing crop id', function () {
		it('empty exports', function () {
			expect(helper.filterCrops({
				data: {}
			})).to.deep.equal([]);
			expect(helper.filterCrops({
				data: {
					exports: []
				}
			})).to.deep.equal([]);
		});

		it('single export', function () {
			expect(helper.filterCrops({
				data: {
					exports: [{
						anything: 'here'
					}]
				}
			})).to.deep.equal([{
				anything: 'here'
			}]);
		});

		it('multiple exports', function () {
			expect(helper.filterCrops({
				data: {
					exports: [
						{ one: 1 },
						{ two: 2 }
					]
				}
			})).to.deep.equal([
				{ one: 1 },
				{ two: 2 }
			]);
		});
	});

	describe('specified crop id', function () {
		it('empty exports', function () {
			expect(helper.filterCrops({
				data: {}
			}, 'crop_id')).to.deep.equal([]);
			expect(helper.filterCrops({
				data: {
					exports: []
				}
			}, 'crop_id')).to.deep.equal([]);
		});

		it('invalid match', function () {
			expect(helper.filterCrops({
				data: {
					exports: [{
						id: 'another_id'
					}]
				}
			}, 'crop_id')).to.deep.equal([]);
		});

		it('valid single match', function () {
			expect(helper.filterCrops({
				data: {
					exports: [
						{ id: 'another_id' },
						{ id: 'crop_id' }
					]
				}
			}, 'crop_id')).to.deep.equal([{
				id: 'crop_id'
			}]);
		});

		it('valid multiple matches', function () {
			expect(helper.filterCrops({
				data: {
					exports: [
						{ id: 'crop_id', value: 1 },
						{ id: 'another_id' },
						{ id: 'crop_id', value: 2 }
					]
				}
			}, 'crop_id')).to.deep.equal([
				{ id: 'crop_id', value: 1 },
				{ id: 'crop_id', value: 2 }
			]);
		});
	});

	describe('filter function', function () {
		it('invalid match', function () {
			var matcher = function (image) {
				return image.id === '500_500';
			};

			expect(helper.filterCrops({
				data: {
					exports: [
						{ id: 'another_id' },
						{ id: 'something' }
					]
				}
			}, matcher)).to.deep.equal([]);
		});

		it('valid match', function () {
			var matcher = function (image) {
				return image.id.indexOf('500') > -1;
			};

			expect(helper.filterCrops({
				data: {
					exports: [
						{ id: 'another_id' },
						{ id: '500_100' },
						{ id: 'something' },
						{ id: '500_600' }
					]
				}
			}, matcher)).to.deep.equal([
				{ id: '500_100' },
				{ id: '500_600' }
			]);
		});
	});
});
