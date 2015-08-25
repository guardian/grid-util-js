import {expect} from 'chai';
import GridHelper from '../src/index.js';

describe('Extract grid ID', function () {
	var helper = new GridHelper();

	it('from invalid input', function () {
		expect(helper.excractMediaId()).to.be.undefined;
		expect(helper.excractMediaId('')).to.be.undefined;
	});

	it('from URLs that don\'t contain it', function () {
		expect(helper.excractMediaId('//anywhere')).to.be.undefined;
	});

	it('from URLs with ID only', function () {
		expect(helper.excractMediaId(
			'https://anywhere/1234567890abcdef1234567890fedcba09876543')
		).to.deep.equal({
			id: '1234567890abcdef1234567890fedcba09876543'
		});

		expect(helper.excractMediaId(
			'http://slash/1234567890abcdef1234567890fedcba09876543/')
		).to.deep.equal({
			id: '1234567890abcdef1234567890fedcba09876543'
		});

		expect(helper.excractMediaId(
			'https://sub/path/1234567890abcdef1234567890fedcba09876543/something')
		).to.deep.equal({
			id: '1234567890abcdef1234567890fedcba09876543'
		});

		expect(helper.excractMediaId(
			'/query/1234567890ABCDEF1234567890fedcba09876543?query=something')
		).to.deep.equal({
			id: '1234567890ABCDEF1234567890fedcba09876543'
		});
	});

	it('pick only the first value', function () {
		expect(helper.excractMediaId(
			'https://repeat/1234567890abcdef1234567890fedcba09876543/another/0986543211234567890abcdefabcde1234567890'
		)).to.deep.equal({
			id: '1234567890abcdef1234567890fedcba09876543'
		});
	});

	it('ignores query params', function () {
		expect(helper.excractMediaId(
			'https://repeat/?grid_id=1234567890abcdef1234567890fedcba09876543'
		)).to.be.undefined;
	});

	it('from URLs with ID and crop', function () {
		expect(helper.excractMediaId(
			'https://anywhere/1234567890abcdef1234567890fedcba09876543?crop=1_2_3_4')
		).to.deep.equal({
			id: '1234567890abcdef1234567890fedcba09876543',
			crop: '1_2_3_4'
		});

		expect(helper.excractMediaId(
			'https://slash/1234567890abcdef1234567890fedcba09876543/?direction=landscape&crop=1_2_3_4')
		).to.deep.equal({
			id: '1234567890abcdef1234567890fedcba09876543',
			crop: '1_2_3_4'
		});

		expect(helper.excractMediaId(
			'https://slash/1234567890abcdef1234567890fedcba09876543/?direction=landscape&crop=anythig_really')
		).to.deep.equal({
			id: '1234567890abcdef1234567890fedcba09876543',
			crop: 'anythig_really'
		});

		expect(helper.excractMediaId(
			'https://not-last/1234567890abcdef1234567890fedcba09876543/?crop=anythig_really&direction=landscape')
		).to.deep.equal({
			id: '1234567890abcdef1234567890fedcba09876543',
			crop: 'anythig_really'
		});
	});
});
