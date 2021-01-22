# Toonify

A cartoon image filtering tool ran completely in-browser, accelerated using [Web Workers](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API) and [Web Assembly](https://webassembly.org/).

![Toonify Screenshot](https://github.com/hyrumcoop/toonify/blob/master/public/images/screenshot.png?raw=true)

## How to Use It

1. Choose an image either by uploading from your local filesystem or by entering its URL.
2. As the filter completes each step, the step result will appear in the bar at the bottom of the page. Click on a step result in the bottom bar to magnify it in the center of the screen.
3. Once the filter is complete, download the processed image by selecting it in the bottom bar, hovering over the magnified image in the center of the screen, and clicking the download icon button at the center of the image.

### Adjust Filter Settings

Not all images perform well with the default filter settings and may need to be adjusted accordingly. Use the sliders in the configuration sidebar to adjust the following settings:

- Edges - The edge detection threshold. A higher value will produce an image with more edges and a smaller value will produce an image with fewer edges.
- Blur - Adjusts the number of iterations of the bilateral filter on the colors portion of the image.
- Quantization - The factor that the colors in the image are reduced by. A large factor will replace large areas of similar colors with a single color, while a small factor will leave the original colors mostly intact.

## How it Works

This tool implements the [Dade Toonify Algorithm](https://stacks.stanford.edu/file/druid:yt916dh6570/Dade_Toonify.pdf) using [OpenCV.js](https://docs.opencv.org/3.4/df/d0a/tutorial_js_intro.html), a [Web Assembly](https://webassembly.org/) binding for [OpenCV](https://github.com/opencv/opencv). The algorithm is divided into two branches: edge detection and color processing, and are combined at the end to produce the final result. 

### Edge Detection

1. Apply a median filter to reduce noise
2. [Canny edge detection](https://en.wikipedia.org/wiki/Canny_edge_detector)
3. Apply a 2x2 morphological operation to bolden and smooth the edges
4. The original algorithm includes a fourth "edge filter" step to reduce small line clutter but is not included in this tool yet.

### Color Processing

1. Apply a bilateral filter between 8-20 times (depends on user configuration) to blur the colors.
2. Re-quantize the color palette by dividing number of colors by a quantization factor (24 is the default setting)

### Recombination

Overlay the edges onto the color image. The edges are currently drawn in black, but will eventually be configurable by the user.

## Results

TODO: showcase successfully processed images