#!/usr/bin/env python
# Filename: BNG.py
 
############################################################################
#
#  COPYRIGHT:  (C) 2012 John A Stevenson / @volcan01010
#           Magnus Hagdorn
#  WEBSITE: http://all-geo.org/volcan01010
#
#  This program is free software; you can redistribute it and/or modify
#  it under the terms of the GNU General Public License as published by
#  the Free Software Foundation; either version 3 of the License, or
#  (at your option) any later version.
#
#  This program is distributed in the hope that it will be useful,
#  but WITHOUT ANY WARRANTY; without even the implied warranty of
#  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
#  GNU General Public License for more details.
#
#  http://www.gnu.org/licenses/gpl-3.0.html
#
#############################################################################/
 
__all__ = ['to_osgb36', 'from_osgb36']
 
try:
    import numpy as np
except ImportError:
    print "Numpy not installed.  Numpy comes with most scientific python packages."
 
import re
 
# Region codes for 100 km grid squares.
_regions=[['HL','HM','HN','HO','HP','JL','JM'],
      ['HQ','HR','HS','HT','HU','JQ','JR'],
      ['HV','HW','HX','HY','HZ','JV','JW'],
      ['NA','NB','NC','ND','NE','OA','OB'],
      ['NF','NG','NH','NJ','NK','OF','OG'],
      ['NL','NM','NN','NO','NP','OL','OM'],
      ['NQ','NR','NS','NT','NU','OQ','OR'],
      ['NV','NW','NX','NY','NZ','OV','OW'],
      ['SA','SB','SC','SD','SE','TA','TB'],
      ['SF','SG','SH','SJ','SK','TF','TG'],
      ['SL','SM','SN','SO','SP','TL','TM'],
      ['SQ','SR','SS','ST','SU','TQ','TR'],
      ['SV','SW','SX','SY','SZ','TV','TW']]
# Reshuffle so indices correspond to offsets
_regions=np.array( [ _regions[x] for x in range(12,-1,-1) ] )
_regions=_regions.transpose()
 
#-------------------------------------------------------------------------------
def to_osgb36(coords):
    """Reformat British National Grid references to OSGB36 numeric coordinates.
    Grid references can be 4, 6, 8 or 10 figures.  Returns a tuple of x, y.
 
    Examples:
 
    Single value
    >>> to_osgb36('NT2755072950')
    (327550, 672950)
 
    For multiple values, use the zip function
    >>> gridrefs = ['HU431392', 'SJ637560', 'TV374354']
    >>> xy=to_osgb36(gridrefs)
    >>> x, y = zip(*xy)
    >>> x
    (443100, 363700, 537400)
    >>> y
    (1139200, 356000, 35400)
    """
    #
    # Check for individual coord, or list, tuple or array of coords
    #
    if type(coords)==list:
        return [to_osgb36(c) for c in coords]
    elif type(coords)==tuple:
        return tuple([to_osgb36(c) for c in coords])
    elif type(coords)==type(np.array('string')):
        return np.array([ to_osgb36(str(c))  for c in list(coords) ])
    #
    # Input is grid reference...
    #
    elif type(coords)==str and re.match(r'^[A-Za-z]{2}(\d{6}|\d{8}|\d{10})$', coords):
        region=coords[0:2].upper()
        x_box, y_box = np.where(_regions==region)
        try: # Catch bad region codes
            x_offset = 100000 * x_box[0] # Convert index in 'regions' to offset
            y_offset = 100000 * y_box[0]
        except IndexError:
            raise ValueError('Invalid 100km grid square code')
        nDigits = (len(coords)-2)/2
        factor = 10**(5-nDigits)
        x,y = (int(coords[2:2+nDigits])*factor + x_offset,
               int(coords[2+nDigits:2+2*nDigits])*factor + y_offset)
        return x, y
    #
    # Catch invalid input
    #
    else:
        raise TypeError('Valid inputs are 6,8 or 10-fig references as strings e.g. "NN123321", or lists/tuples/arrays of strings.')
 
#-------------------------------------------------------------------------------
def from_osgb36(coords, nDigits=6):
    """Reformat OSGB36 numeric coordinates to British National Grid references.
    Grid references can be 4, 6, 8 or 10 fig, specified by the nDigits keyword.
 
    Examples:
 
    Single value
    >>> from_osgb36((327550, 672950))
    'NT276730'
 
    For multiple values, use the zip function
    >>> x = [443143, 363723, 537395]
    >>> y = [1139158, 356004, 35394]
    >>> xy = zip(x, y)
    >>> from_osgb36(xy, nDigits=4)
    ['HU4339', 'SJ6456', 'TV3735']
    """
    if (type(coords)==list):
        return [from_osgb36(c, nDigits=nDigits) for c in coords]
    #
    # Input is a tuple of numeric coordinates...
    #
    elif type(coords)==tuple:
        x, y = coords
        x_box=np.floor(x/100000.0)  # Convert offset to index in 'regions'
        y_box=np.floor(y/100000.0)
        x_offset=100000*x_box
        y_offset=100000*y_box
        try: # Catch coordinates outside the region
            region=_regions[x_box, y_box]
        except IndexError:
            raise ValueError('Coordinate location outside UK region')
    #
    # Format the output based on nDigits
    #
        formats={2:'%s%01i%01i', 4:'%s%02i%02i', 6:'%s%03i%03i', 8:'%s%04i%04i', 10:'%s%05i%05i'}
        factors={2: 10000.0, 4:1000.0, 6:100.0, 8:10.0, 10:1.0}
        try: # Catch bad number of figures
            coords=formats[nDigits] % (region, np.floor((x-x_offset)/factors[nDigits]), np.floor((y-y_offset)/factors[nDigits]))
        except KeyError:
            raise ValueError('Valid inputs for nDigits are 2, 4, 6, 8 or 10')
        return coords
    #
    # Catch invalid input
    #
    else:
        raise TypeError('Valid inputs are x, y tuple e.g. (651409, 313177)')

