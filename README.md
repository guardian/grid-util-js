# Grid JS Utilities

JavaScript utilities for handling [Grid] URLs and API.

## Installation

Through `npm`

```
npm install --save grid-util-js
```

or `jspm`

```
jspm install npm:grid-util-js
```

## Dependencies

You need a modern browsers implementing `fetch` and `Promise` or you can polyfill those methods.

## Usage

```js
import GridUtils from 'grid-util-js';

var grid = new GridUtils({
	apiBaseUrl: 'http://root.api.of.grid'
});
```

## API

### Extract Grid image ID from any URL

Finds the Grid image ID in an URL. The URL can be anything, the media or crop link, or the link of the public image as long as the media ID is inside the URL.

`grid.excractMediaId('http://deployed.image/12345...abcde')`

Returns and object containing

```
{
	id: 'grid id',
	crop: 'crop id, if present'
}
```

### Get the image data from the Grid

Calls the API to retrieve the image information. It uses hypermedia Grid API.

`grid.getImage('12345...abcde')`

Returns a promise that resolves with the JSON response or rejects in case of error.

### Get the crop from the image data

Get a specified crop from the image API response.

* `grid.filterCrops(apiResponse)` returns all crops
* `grid.filterCrops(apiResponse, 'crop_id')` returns the crop with id `crop_id`
* `grid.filterCrops(apiResponse, filterFunction)` returns all crops matching `filterFunction`.

`filterFunction` receives as only parameter the crop data.

### Get the crop for a drag event

When dragging a crop from the Grid, the crop information is inside the event `dataTransfer`.

`grid.getCropFromEvent(evt)`

Returns a JSON object.

### Get the Grid url from a drag event

When dragging a crop from the Grid, the event `dataTransfer` contains the original image URL in the Grid.

`grid.getGridUrlFromEvent(evt)`

Returns the URL as a string.

