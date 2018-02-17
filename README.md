# DSOMask
PixInsight PSJR script for creating target masks of various types.

A utility script to create a mask to protect background and stars allowing
structures to be targeted for further processing.

The script is designed to process non-linear images. For a linear image, first
duplicate and then apply ScreenTransferFunction to duplicate. Run this script
on the duplicate stretched image.

This script uses some basic practices thare are well documented on the
PixInsight forums as well as other internet forums.

The base image for the mask can be one of two types. 1) A range mask of the
source image or 2) a gray scale copy of the original image with stars
(first layer) removed using ATrousWaveletTransform.

Either version of the base image above can be converted to a gray mask for
more protection of the image target.

Additionally, one can add star protection to the mask. A star mask can be
created either using the technique implemented in Utilities -> ClassicStarMask
or using the standard StarMask process.

Finally, one can use a series of range masks to isolate and protect larger
stars not covered by the chosen star mask technique.

The mask is constructed as follows:

   + Base image is either a range mask or star less gray scale image.
     Let's call this DSO.

   + If star protection is chosen then the selected technique will
     create a star mask. Let's call this STARS.

   + If large star protection is chosen then range masks will create
     a large star mask. Let's call this LSTARS.

   + If a gray percentage is chosen that is greater than "0 (zero) then
     a solid image will be created with it's pixel values all set to the
     level of gray percentage. Let's call this GRAY.

   + If a gray mask is being created (gray percentage > 0) then it's
     MIN( (GRAY-(STARS+LSTARS)), DSO ).

   + Otherwise it's (DSO-(STARS+LSTARS)).

   + In both cases STARS and LSTARS are optional, with the exception
     being that LSTARS is only possible if STARS is present.
