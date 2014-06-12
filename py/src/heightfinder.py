#! /bin/python

from __future__ import division

from uuid import uuid4
from os import path

import numpy
from scipy import stats
from PIL import Image, ImageDraw
from pyproj import Proj, transform
from matplotlib.path import Path as mplPath

from bng import to_osgb36, from_osgb36


wgs84 = Proj("+init=EPSG:4326") # LatLon with WGS84 datum used by GPS units and Google Earth
osgb36 = Proj("+init=EPSG:27700") # OS36 projection

PROJECT_ROOT = path.abspath(path.join(path.dirname(__file__), '..', '..'))
TILE_ROOT = path.join(PROJECT_ROOT, 'lidar')
HEIGHTMAP_CACHE = path.join(PROJECT_ROOT, 'heightmap_cache')
IMG_ROOT = path.join(PROJECT_ROOT, 'py', 'img')

TILE_RESOLUTION = 2
IMG_DEPTH = 512


class HeightFinder:

    def __init__(self, centre, doimage=False):
        self.doimage = doimage
        self.set_centre(centre)

    def set_centre(self, centre):
        lat, lng = centre
        # Point to choose map tile
        in_osgb36 = transform(wgs84, osgb36, lng, lat)
        northings, eastings = in_osgb36

        # Round eastings and northings down to lowest kilometer to find
        # the west and south edges
        self.block_corner_east = int(eastings / 1000.0) * 1000.0
        self.block_corner_north = int(northings / 1000.0) * 1000.0

        # Pixel location of the centre point (provided lat lng)
        #x = (eastings - self.block_corner_east) / TILE_RESOLUTION
        #y = (northings - selblock_corner_north) / TILE_RESOLUTION

        # sets self.heightmap
        self.gr_group, self.gr_tile = self._find_tile(in_osgb36)

        # Get heightmap, from cache or generate from dataset
        self.heightmap = self._generate_heightmap(self.gr_tile, self.gr_group)


    def sample_heightmap_wgs84(self, ll_path):
        """ With the current centre for finding the tile, sample a path
        submitted in lat lng format eg (51.1234, -0.1234)
        """
        en_path = self.convert_path(ll_path)
        return self.sample_heightmap_osgb36(en_path)


    def sample_heightmap_osgb36(self, en_path):
        """ After having offset the paths to be local to the current tile
        sample the height map.
        """
        # Process each path
        height_values = self._sample_heightmap(en_path)

        mean = numpy.mean(height_values)
        median = numpy.median(height_values)
        #mode = stats.mode(map(int, height_values))
        mode = 0

        if self.doimage:
            self._generate_image(en_path)
            self.im.save(path.join(IMG_ROOT, uuid4().hex), 'png')

            self.path_image.save(path.join(IMG_ROOT, uuid4().hex), 'png')

        return mean, median, mode


    def _find_tile(self, osgb_coords):
        # Find Grid codes from the OSGB36 projection
        gr_tile = from_osgb36(osgb_coords, 4)
        gr_group = from_osgb36(osgb_coords, 2)
        print osgb_coords, gr_tile, gr_group
        return gr_group, gr_tile


    def _generate_image(self, en_path):
        """ Render the height map as an image for visual checking
        """
        norm_array = (IMG_DEPTH / self.heightmap.max() * (self.heightmap - self.heightmap.min()))\
                .astype(numpy.uint8)
        self.im = Image.fromarray(norm_array, mode='L')
        self.im = self.im.convert('RGB')
        en_path.append(en_path[-1]) # Close it
        draw = ImageDraw.Draw(self.im)
        draw.line(en_path, fill='#ff00ff')

        # Redraw last item
        draw.line(en_path, fill='#ff0000')
        return self.im


    def _offset_points(self, points):
        lng, lat = points
        northings, eastings = transform(wgs84, osgb36, lng, lat)
        y = 498 - (eastings - self.block_corner_east) / TILE_RESOLUTION
        x = -2 + (northings - self.block_corner_north) / TILE_RESOLUTION
        return (x, y)


    def convert_path(self, feature_path):
        """ Converts a path of wgs84 tuples into local pixel values for
        for the current tile
        """
        return map(self._offset_points, feature_path)


    def _sample_heightmap(self, en_path):
        # Create a fuck tonne of random coordinate tuples to sample
        # for whether they're inside the path
        n_samples = 999

        # Using a building outline (the last one) to make a path object
        ml_path = mplPath(en_path, closed=True)

        # Find extent of the path, inwich to sample height data
        extents = ml_path.get_extents()
        corners = extents.corners()

        x_vals = [x for x, _ in corners]
        y_vals = [y for _, y in corners]
        x1, x2 = min(x_vals), max(x_vals)
        y1, y2 = min(y_vals), max(y_vals)

        random_sample_x = numpy.random.random_integers(x1, x2, n_samples)
        random_sample_y = numpy.random.random_integers(y1, y2, n_samples)

        height_values = [10, ]

        # Make a bitmask of all 1.0s
        bitmask = numpy.ones((500, 500))

        # Many times, access random coords
        # If they're within the building outline, remember the value, and add it to the bitmask
        for sample in xrange(0, n_samples -1):
            coords = x, y = random_sample_x[sample], random_sample_y[sample]

            # Check if sample falls within polygon
            if ml_path.contains_point(coords):
                try:
                    height = self.heightmap[coords]
                except IndexError:
                    continue
                else:
                    bitmask[y, x] = height
                    height_values.append(height)

        if self.doimage:
            self.path_image = self._generate_path_image(bitmask, x1, y1, x2, y2)

        return height_values


    def _generate_path_image(self, bitmask, x1, y1, x2, y2):
        norm_arr = (IMG_DEPTH / bitmask.max() * (bitmask - bitmask.min()))\
                .astype(numpy.uint8)
        im = Image.fromarray(norm_arr, mode='L')
        im = im.convert('RGB')
        draw = ImageDraw.Draw(im)
        # Draw Boundary around samle area
        draw.line(((x1, y1), (x1, y2), (x2, y2), (x2, y1), (x1, y1), ),
                  fill='#ff0000')

        return im


    def _generate_heightmap(self, gr_tile, tile_dir):
        # Numpy array file
        array_cache_filename = '{0}_DSM_2M.npy'.format(gr_tile)
        array_cache_path = path.join(HEIGHTMAP_CACHE, array_cache_filename)

        # ASCI Data file from LIDAR
        tile_group_dir = path.join(TILE_ROOT, tile_dir)
        tile_filename = '{0}_DSM_2M.asc'.format(gr_tile)
        tile_path = path.join(tile_group_dir, 'DSM', tile_filename)

        if path.exists(array_cache_path):
            print 'Cache exists'
            heightmap = numpy.load(array_cache_path)
            return heightmap

        # Generate Array form data file
        print 'Generating Cache'
        with open(tile_path, 'r') as data:
            heightmap = []
            for line in data:
                if not line[0].isdigit():
                    continue
                # For the space-delimited numeric data
                heightmap.append(line.split(' ')[:-1])

            heightmap = numpy.array(heightmap).astype(float)
            array_file = open(array_cache_path, 'w')
            numpy.save(array_file, heightmap)

        return heightmap


def main():
    centre = 51.50857551909176, -0.12643396854400635
    ll_path = [[-0.1254071,51.5080211],[-0.1250479,51.5082805],[-0.1247525,51.5084938],[-0.1243632,51.5082859],[-0.1241161,51.5081428],[-0.1228639,51.5074488],[-0.1228313,51.5074238],[-0.1228249,51.507388],[-0.1228353,51.5073627],[-0.1228783,51.5073069],[-0.1229497,51.507353],[-0.1234963,51.5069922],[-0.1246494,51.5076055]]

    hf = HeightFinder(centre, doimage=True)
    hf.sample_heightmap_wgs84(ll_path)

if '__main__' == __name__:
    main()

