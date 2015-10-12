var extractId = /[0-9a-f]{40}/i;
var extractCrop = /[?&]crop=([^&]+)/i;
var fetchImpl = Symbol();

export default class Grid {
	static get CROPS_DATA_IDENTIFIER() {
		return 'application/vnd.mediaservice.crops+json';
	}
	static get GRID_URL_DATA_IDENTIFIER() {
		return 'application/vnd.mediaservice.kahuna.uri';
	}

	constructor({
		apiBaseUrl,
		fetch = window.fetch,
		fetchInit = {
			credentials: 'include'
		}
	} = {}) {
		this.apiBaseUrl = apiBaseUrl;
		this[fetchImpl] = fetch ? (url) => {
			return fetch(url, fetchInit).then(response => {
				if (response.status >= 200 && response.status < 300) {
					return response.json();
				} else {
					var error = new Error('Error when requesting \`' + url + '\`, status ' + response.status + '.');
					error.response = response;
					throw error;
				}
			});
		} : () => {
			return Promise.reject(new Error('Invalid fetch implementation. Please use a polyfill or provide your custom implementation.'));
		};
	}

	excractMediaId(path) {
		if (path) {
			var link = document.createElement('a');
			link.href = path;

			var {pathname, search} = link,
				match = pathname.match(extractId);

			if (match) {
				var crop = search.match(extractCrop);

				return crop ? {
					id: match[0],
					crop: crop[1]
				} : {
					id: match[0]
				};
			}
		}
	}

	getImage(id) {
		if (!id) {
			return Promise.reject(new TypeError('Missing image ID'));
		} else if (!this.apiBaseUrl) {
			return Promise.reject(new TypeError('Invalid API base URL. Please provide a valid `apiBaseUrl` to the helper\'s constructor.'));
		} else {
			return this[fetchImpl](this.apiBaseUrl)
				.then(followLink('image', { id }))
				.then(this[fetchImpl]);
		}
	}

	filterCrops(imageJson, cropIdOrFilter) {
		if (!imageJson || !imageJson.data) {
			throw new TypeError('Invalid image format.');
		}
		var crops = imageJson.data.exports || [];
		if (cropIdOrFilter) {
			let filterFunction = typeof cropIdOrFilter === 'function' ?
				cropIdOrFilter :
				crop => crop.id === cropIdOrFilter;
			return crops.filter(filterFunction);
		} else {
			return crops.slice();
		}
	}

	getCropFromEvent(evt) {
		var cropData = getData(evt, Grid.CROPS_DATA_IDENTIFIER);
		if (cropData) {
			try {
				return JSON.parse(cropData);
			} catch (ex) {
				return;
			}
		}
	}

	getGridUrlFromEvent(evt) {
		return getData(evt, Grid.GRID_URL_DATA_IDENTIFIER);
	}
}

function followLink (rel, data) {
	return function (root) {
		var links = root.links;
		for (var i = 0, len = links.length; i < len; i += 1) {
			if (links[i].rel === rel) {
				return replace(links[i].href, data);
			}
		}
	};
}

function replace (href, data) {
	return href.replace(/\{([^\}]+)\}/g, function (match, key) {
		return data[key];
	});
}

function getData (evt = {}, identifier) {
	var dataTransfer = evt.nativeEvent ? evt.nativeEvent.dataTransfer : evt.dataTransfer;
	if (dataTransfer && dataTransfer.getData) {
		return dataTransfer.getData(identifier);
	}
}
