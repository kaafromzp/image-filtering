Used to draw resized images with different filtering types.

### Installation

##### Using npm:

```
$ npm install --save image-filtering
```

##### Using github :

```
cd path/to/node_modules
git clone https://github.com/kaafromzp/image-filtering.git
```

### Usage

ES6:

```js
import imageFilteringHelper from 'image-filtering';
// canvas containing resized image
let canvas = imageFilteringHelper.drawImageWithFiltering(
    width,
    height,
    image,
    filteringType
);
```

Browsers:

```html
<script src="path/to/image-filtering.js"></script>
<script>
    let canvas = ImageFilteringHelper.drawImageWithFiltering(
        width,
        height,
        image,
        filteringType
    );
</script>
```

#### Available filter types :

| value                                            | description                                  |
| ------------------------------------------------ | -------------------------------------------- |
| ImageFilteringHelper.types.GL_NEAREST            | Nearest filtration                           |
| ImageFilteringHelper.types.GL_BILINEAR           | Bilinear filtration                          |
| ImageFilteringHelper.types.GL_BICUBIC_TRIANGULAR | Bicubic filtration with Triangular function  |
| ImageFilteringHelper.types.GL_BICUBIC_BELL       | Bicubic filtration with Bell function        |
| ImageFilteringHelper.types.GL_BICUBIC_BSPLINE    | Bicubic filtration with Bspline function     |
| ImageFilteringHelper.types.GL_BICUBIC_CATMULLROM | Bicubic filtration with Catmull-Rom function |
