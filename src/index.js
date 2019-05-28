import ImageFilteringHelper from './ImageFilteringHelper';

class AssetsLoader {
    static loadImage(url, callback) {
        let image = new Image();
        image.src = url;
        image.onload = callback;

        return image;
    }

    static loadImages(urls) {
        let images = [];
        let imagesToLoad = urls.length;

        return new Promise((resolve, reject) => {
            let onImageLoad = () => {
                --imagesToLoad;
                if (imagesToLoad === 0) {
                    resolve(images);
                }
            };

            for (let ii = 0; ii < imagesToLoad; ++ii) {
                let image = this.loadImage(urls[ii], onImageLoad);
                images.push(image);
            }
        });
    }
}

AssetsLoader.loadImages(['../images/1.png']).then((images) => {
    let canvas = ImageFilteringHelper.drawImageWithFiltering(
        384,
        99,
        images[0],
        ImageFilteringHelper.types.GL_NEAREST
    );
    document.body.appendChild(canvas);
    canvas = ImageFilteringHelper.drawImageWithFiltering(
        384,
        99,
        images[0],
        ImageFilteringHelper.types.GL_BILINEAR
    );
    document.body.appendChild(canvas);
    canvas = ImageFilteringHelper.drawImageWithFiltering(
        384,
        99,
        images[0],
        ImageFilteringHelper.types.GL_BICUBIC_TRIANGULAR
    );
    document.body.appendChild(canvas);
    canvas = ImageFilteringHelper.drawImageWithFiltering(
        384,
        99,
        images[0],
        ImageFilteringHelper.types.GL_BICUBIC_BELL
    );
    document.body.appendChild(canvas);
    canvas = ImageFilteringHelper.drawImageWithFiltering(
        384,
        99,
        images[0],
        ImageFilteringHelper.types.GL_BICUBIC_BSPLINE
    );
    document.body.appendChild(canvas);
    canvas = ImageFilteringHelper.drawImageWithFiltering(
        384,
        99,
        images[0],
        ImageFilteringHelper.types.GL_BICUBIC_CATMULLROM
    );
    document.body.appendChild(canvas);
});
