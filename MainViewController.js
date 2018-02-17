
function MainController(model, isViewTarget) {
   this.view = null;

   this.isViewTarget = isViewTarget;

   this.help = new String("<p>A utility script to create a mask to protect " +
      "background and stars allowing structures to be targeted " +
      "for further processing.</p>" +

      "<p>The script is designed to process non-linear images. " +
      "For a linear image, first duplicate and then apply " +
      "ScreenTransferFunction to duplicate. Run this script " +
      "on the duplicate stretched image.</p>" +

      "<p>This script uses some basic practices thare are " +
      "well documented on the PixInsight forums as well as other " +
      "internet forums.</p>" +

      "<p>The base image for the mask can be one of two types. " +
      "1) A range mask of the source image or 2) a gray scale copy " +
      "of the original image with stars (first layer) removed using " +
      "ATrousWaveletTransform.</p>" +

      "<p>Either version of the base image above can be converted to " +
      "a gray mask for more protection of the image target</p>" +

      "<p>Additionally, one can add star protection to the mask. " +
      "A star mask can be created either using the technique " +
      "implemented in Utilities -> ClassicStarMask or using " +
      "the standard StarMask process.</p>" +

      "<p>Finally, one can use a series of range masks " +
      "to isolate and protect larger stars not covered by the " +
      "chosen star mask technique.</p>" +

      "<p>The mask is constructed as follows:</p>" +

      "<p>Base image is either a range mask or star less gray " +
      "scale image. Let's call this <b>DSO</b></p>" +

      "<p>If star protection is chosen then the selected " +
      "technique will create a star mask. Let's call this <b>STARS</b></p>" +

      "<p>If large star protection is chosen then range masks " +
      "will create a large star mask. Let's call this <b>LSTARS</b></p>" +

      "<p>If a gray percentage is chosen that is greater than " +
      "0 (zero) then a solid image will be created with it's pixel " +
      "values all set to the level of gray percentage. Let's call " +
      "this <b>GRAY</b></p>" +

      "<p>If a gray mask is being created (gray percentage > 0) " +
      "then it's <b>MIN( (GRAY-(STARS+LSTARS)), DSO )</b></p>" +

      "<p>Other wise it's <b>(DSO-(STARS+LSTARS))</b></p>" +

      "<p>In both cases <b>STARS</b> and <b>LSTARS</b> are optional, with the " +
      "exception being that <b>LSTARS</b> is only possible if <b>STARS</b> is " +
      "present.</p>");

   this.setView = function(view) {
      this.view = view;
   };

   this.showHelp = function() {
         (new MessageBox(
         this.help.toString(),
         TITLE,
         StdIcon_Warning,
         StdButton_Ok
         )).execute();
   }

   this.setImageView = function(view) {
      if (view != null && view.isView) {
         model.imageView = view;
         this.view.imageViewList.currentView = model.imageView;
      }
      else {
         model.imageView = null;
         this.view.imageViewList.currentView = this.view.imageViewListNull;
      }

      this.enableControls();
   };

   this.execute = function() {
      this.enableControls();
      if (isViewTarget) {
         if (this.view.makeMaskeButton.enabled) {
            this.makeMask();
         }
         else {
            console.criticalln();
            console.criticalln(format(
               "<b>Error</b>: Cannot make mask: view: " + model.imageViewFormat,
               model.imageView.fullId
            ));
            console.flush();
         }

      }
      else {
         this.view.execute();
      }
   };

   this.reset = function() {
      model.imageView = null;
      this.view.imageViewList.currentView = this.view.imageViewListNull;

      model.grayPercent = model.defGrayPercent;
      this.view.grayPercentNumericControl.setValue(model.grayPercent);

      model.protectStars = model.defProtectStars;
      this.view.protectStarsCheckBox.checked = model.protectStars;

      model.keepMasksOpen = model.defKeepMasksOpen;
      this.view.keepMasksOpenCheckBox.checked = model.keepMasksOpen;

      model.useClassicStarMask = model.defUseClassicStarMask
      this.view.useClassicStarMaskCheckBox.checked = model.useClassicStarMask;

      model.useHDRMForStarMask = model.defUseHDRMForStarMask
      this.view.useHDRMCheckBox.checked = model.useHDRMForStarMask;

      model.starMaskThreshold = model.defStarMaskThreshold;
      this.view.starMaskThresholdNumericControl.setValue(model.starMaskThreshold);

      model.starMaskScale = model.defStarMaskScale;
      this.view.starMaskScaleSpinBox.value = model.starMaskScale;

      model.starMaskLargeScale = model.defStarMaskLargeScale;
      this.view.starMaskLargeScaleSpinBox.value = model.starMaskLargeScale;

      model.starMaskSmallScale = model.defStarMaskSmallScale;
      this.view.starMaskSmallScaleSpinBox.value = model.starMaskSmallScale;

      model.starMaskCompensation = model.defStarMaskCompensation;
      this.view.starMaskCompensationSpinBox.value = model.starMaskCompensation;

      model.starMaskSmoothness = model.defStarMaskSmoothness;
      this.view.starMaskSmoothnessSpinBox.value = model.starMaskSmoothness;

      model.rangeSelectionForBaseLowerLimit = model.defRangeSelectionForBaseLowerLimit;
      this.view.rangeSelectionForBaseLowerLimitNumericControl.setValue(model.rangeSelectionForBaseLowerLimit);

      model.rangeSelectionForBaseUpperLimit = model.defRangeSelectionForBaseUpperLimit;
      this.view.rangeSelectionForBaseUpperLimitNumericControl.setValue(model.rangeSelectionForBaseUpperLimit);

      model.rangeSelectionForBaseFuzziness = model.defRangeSelectionForBaseFuzziness;
      this.view.rangeSelectionForBaseFuzzinessNumericControl.setValue(model.rangeSelectionForBaseFuzziness);

      model.rangeSelectionForBaseSmoothness = model.defRangeSelectionForBaseSmoothness;
      this.view.rangeSelectionForBaseSmoothnessNumericControl.setValue(model.rangeSelectionForBaseSmoothness);

      model.useRangeSelectionsForLargeStars = model.defUseRangeSelectionsForLargeStars;
      this.view.useRangeSelectionsForLargeStarsCheckBox.checked = model.useRangeSelectionsForLargeStars;

      for (var i = 0; i < model.totalRangeSelections; i++ )
      {
         var treeBoxNode = this.view.rangeSelectionsTreeBox.child(i);
         with (treeBoxNode) {
            checked = model.defRangeSelectionsUsed[i];
            selected = false;
            for (var j = 0; j != model.rangeSelectionColumnNames.length; ++j) {
               setText(
                  j,
                  [
                     format("%d ", i + 1),
                     model.defRangeSelectionLowerLimits[i].toPrecision(5),
                     model.defRangeSelectionUpperLimits[i].toPrecision(5),
                     model.defRangeSelectionFuzziness[i].toPrecision(5),
                     model.defRangeSelectionSmoothness[i].toPrecision(5)
                  ][j]
               );
               this.view.rangeSelectionsTreeBox.adjustColumnWidthToContents(j);
            }
         }
         model.rangeSelectionsUsed[i] = model.defRangeSelectionsUsed[i];
         model.rangeSelectionLowerLimits[i] = model.defRangeSelectionLowerLimits[i];
         model.rangeSelectionUpperLimits[i] = model.defRangeSelectionUpperLimits[i];
         model.rangeSelectionFuzziness[i] = model.defRangeSelectionFuzziness[i];
         model.rangeSelectionSmoothness[i] = model.defRangeSelectionSmoothness[i];
      }
      this.enableControls();
   };

   this.disableControls = function() {
      this.view.imageViewList.enabled = false;

      this.view.grayPercentNumericControl.enabled = false;
      this.view.protectStarsCheckBox.enabled = false;
      this.view.keepMasksOpenCheckBox.enabled = false;

      this.view.useClassicStarMaskCheckBox.enabled = false;
      this.view.useHDRMCheckBox.enabled = false;
      this.view.previewStarMaskButton.enabled = false;
      this.view.closeStarMaskPreviewButton.enabled = false;
      this.view.starMaskThresholdNumericControl.enabled = false;
      this.view.starMaskScaleSpinBox.enabled = false;
      this.view.starMaskLargeScaleSpinBox.enabled = false;
      this.view.starMaskSmallScaleSpinBox.enabled = false;
      this.view.starMaskCompensationSpinBox.enabled = false;
      this.view.starMaskSmoothnessSpinBox.enabled = false;

      this.view.newInstanceButton.enabled = false;
      this.view.browseDocumentationButton.enabled = false;
      this.view.resetButton.enabled = false;

      this.view.useRangeSelectionForBaseCheckBox.enabled = false;
      this.view.previewBaseRangeMaskButton.enabled = false;
      this.view.closeBaseRangeMaskPreviewButton.enabled = false;
      this.view.rangeSelectionForBaseLowerLimitNumericControl.enabled = false;
      this.view.rangeSelectionForBaseUpperLimitNumericControl.enabled = false;
      this.view.rangeSelectionForBaseFuzzinessNumericControl.enabled = false;
      this.view.rangeSelectionForBaseSmoothnessNumericControl.enabled = false;

      this.view.useRangeSelectionsForLargeStarsCheckBox.enabled = false;
      this.view.rangeSelectionLowerLimitNumericControl.enabled = false;
      this.view.rangeSelectionUpperLimitNumericControl.enabled = false;
      this.view.rangeSelectionFuzzinessNumericControl.enabled = false;
      this.view.rangeSelectionSmoothnessNumericControl.enabled = false;
      this.view.previewLargeStarMaskButton.enabled = false;
      this.view.closeLargeStarMaskPreviewButton.enabled = false;

      this.view.rangeSelectionsTreeBox.child(0).enabled = false;
      this.view.rangeSelectionsTreeBox.child(1).enabled = false;
      this.view.rangeSelectionsTreeBox.child(2).enabled = false;

      this.view.makeMaskButton.enabled = false;
      this.view.dismissButton.enabled = false;
   };

   this.enableControls = function() {

      this.view.imageViewList.enabled = true;

      this.view.grayPercentNumericControl.enabled = true;
      this.view.protectStarsCheckBox.enabled = true;
      this.view.keepMasksOpenCheckBox.enabled = true;

      if ( model.protectStars )
      {
         this.view.useClassicStarMaskCheckBox.enabled = true;
         this.view.useHDRMCheckBox.enabled = true;
         if ( model.imageView != null )
         {
            this.view.previewStarMaskButton.enabled = true;
         }
         else {
            this.view.previewStarMaskButton.enabled = false;
         }
         this.view.closeStarMaskPreviewButton.enabled = false;

      }
      else
      {
         this.view.useClassicStarMaskCheckBox.enabled = false;
         this.view.useHDRMCheckBox.enabled = false;
         this.view.previewStarMaskButton.enabled = false;
         this.view.closeStarMaskPreviewButton.enabled = false;
      }

      if ( (!model.protectStars) || model.useClassicStarMask )
      {
         this.view.starMaskThresholdNumericControl.enabled = false;
         this.view.starMaskScaleSpinBox.enabled = false;
         this.view.starMaskLargeScaleSpinBox.enabled = false;
         this.view.starMaskSmallScaleSpinBox.enabled = false;
         this.view.starMaskCompensationSpinBox.enabled = false;
         this.view.starMaskSmoothnessSpinBox.enabled = false;
      }
      else
      {
         this.view.starMaskThresholdNumericControl.enabled = true;
         this.view.starMaskScaleSpinBox.enabled = true;
         this.view.starMaskLargeScaleSpinBox.enabled = true;
         this.view.starMaskSmallScaleSpinBox.enabled = true;
         this.view.starMaskCompensationSpinBox.enabled = true;
         this.view.starMaskSmoothnessSpinBox.enabled = true;
      }

      this.view.useRangeSelectionForBaseCheckBox.enabled = true;
      if ( model.useRangeSelectionForBase ) {
         this.view.rangeSelectionForBaseLowerLimitNumericControl.enabled = true;
         this.view.rangeSelectionForBaseUpperLimitNumericControl.enabled = true;
         this.view.rangeSelectionForBaseFuzzinessNumericControl.enabled = true;
         this.view.rangeSelectionForBaseSmoothnessNumericControl.enabled = true;
         if ( model.imageView != null )
         {
            this.view.previewBaseRangeMaskButton.enabled = true;
         }
         else {
            this.view.previewBaseRangeMaskButton.enabled = false;
         }
         this.view.closeBaseRangeMaskPreviewButton.enabled = false;
      }
      else
      {
         this.view.rangeSelectionForBaseLowerLimitNumericControl.enabled = false;
         this.view.rangeSelectionForBaseUpperLimitNumericControl.enabled = false;
         this.view.rangeSelectionForBaseFuzzinessNumericControl.enabled = false;
         this.view.rangeSelectionForBaseSmoothnessNumericControl.enabled = false;
         this.view.previewBaseRangeMaskButton.enabled = false;
         this.view.closeBaseRangeMaskPreviewButton.enabled = false;
      }

      if ( model.protectStars )
      {
         this.view.useRangeSelectionsForLargeStarsCheckBox.enabled = true;

         if ( model.useRangeSelectionsForLargeStars )
         {
            if ( model.imageView != null )
            {
               this.view.previewLargeStarMaskButton.enabled = true;
            }
            else
            {
               this.view.previewLargeStarMaskButton.enabled = false;
            }
            this.view.closeLargeStarMaskPreviewButton.enabled = false;
         }
         else
         {
            this.view.previewLargeStarMaskButton.enabled = false;
            this.view.closeLargeStarMaskPreviewButton.enabled = false;
         }
         this.view.rangeSelectionLowerLimitNumericControl.enabled = model.useRangeSelectionsForLargeStars;
         this.view.rangeSelectionUpperLimitNumericControl.enabled = model.useRangeSelectionsForLargeStars;
         this.view.rangeSelectionFuzzinessNumericControl.enabled = model.useRangeSelectionsForLargeStars;
         this.view.rangeSelectionSmoothnessNumericControl.enabled = model.useRangeSelectionsForLargeStars;

         this.view.rangeSelectionsTreeBox.child(0).enabled = model.useRangeSelectionsForLargeStars;
         this.view.rangeSelectionsTreeBox.child(1).enabled = model.useRangeSelectionsForLargeStars;
         this.view.rangeSelectionsTreeBox.child(2).enabled = model.useRangeSelectionsForLargeStars;
      }
      else
      {
         this.view.useRangeSelectionsForLargeStarsCheckBox.enabled = false;

         this.view.rangeSelectionLowerLimitNumericControl.enabled = false;
         this.view.rangeSelectionUpperLimitNumericControl.enabled = false;
         this.view.rangeSelectionFuzzinessNumericControl.enabled = false;
         this.view.rangeSelectionSmoothnessNumericControl.enabled = false;

         this.view.previewLargeStarMaskButton.enabled = false;
         this.view.closeLargeStarMaskPreviewButton.enabled = false;

         this.view.rangeSelectionsTreeBox.child(0).enabled = false;
         this.view.rangeSelectionsTreeBox.child(1).enabled = false;
         this.view.rangeSelectionsTreeBox.child(2).enabled = false;
      }

      this.view.newInstanceButton.enabled = true;
      this.view.browseDocumentationButton.enabled = true;
      this.view.resetButton.enabled = true;

      if (model.imageView != null )
      {
         this.view.makeMaskButton.enabled = true;
         this.view.makeMaskButton.toolTip = "<p>Create Mask.</p>";
      }
      else
      {
         this.view.makeMaskButton.enabled = false;
         this.view.makeMaskButton.toolTip = "<p>Create Mask.</p><p>Image must be selected</p>";
      }
      this.view.dismissButton.enabled = true;
   };

   this.imageViewOnViewSelected = function(view) {
      if (view.isNull) {
         model.imageView = null;
      }
      else {
         model.imageView = view;
      }
      this.enableControls();
   };

   this.grayPercentNumericControlUpdate = function(value) {
      model.grayPercent = value;
      this.enableControls();
   };

   this.protectStarsCheck = function(checked) {
      model.protectStars = checked;
      this.enableControls();
   };

   this.keepMasksOpenCheck = function(checked) {
      model.keepMasksOpen = checked;
      this.enableControls();
   };

   this.useClassicStarMaskCheck = function(checked) {
      model.useClassicStarMask = checked;
      this.enableControls();
   };

   this.useHDRMCheck = function(checked) {
      model.useHDRMForStarMask = checked;
      this.enableControls();
   };

   this.useRangeSelectionForBaseCheck = function(checked) {
      model.useRangeSelectionForBase = checked;
      this.enableControls();
   };

   this.rangeSelectionForBaseLowerLimitNumericControlUpdate = function(value) {
      model.rangeSelectionForBaseLowerLimit = value;
   }
   this.rangeSelectionForBaseUpperLimitNumericControlUpdate = function(value) {
      model.rangeSelectionForBaseUpperLimit = value;
   }
   this.rangeSelectionForBaseFuzzinessNumericControlUpdate = function(value) {
      model.rangeSelectionForBaseFuzziness = value;
   }
   this.rangeSelectionForBaseSmoothnessNumericControlUpdate = function(value) {
      model.rangeSelectionForBaseSmoothness = value;
   }

   this.starMaskThresholdNumericControlUpdate = function(value) {
      model.starMaskThreshold = value;
      this.enableControls();
   };

   this.starMaskScaleSpinBoxUpdate = function(value) {
      model.starMaskScale = value;
      this.enableControls();
   };

   this.starMaskLargeScaleSpinBoxUpdate = function(value) {
      model.starMaskLargeScale = value;
      this.enableControls();
   };

   this.starMaskSmallScaleSpinBoxUpdate = function(value) {
      model.starMaskSmallScale = value;
      this.enableControls();
   }

   this.starMaskCompensationSpinBoxUpdate = function(value) {
      model.starMaskCompensation = value;
      this.enableControls();
   };

   this.starMaskSmoothnessSpinBoxUpdate = function(value) {
      model.starMaskSmoothness = value;
      this.enableControls();
   };

   this.useRangeSelectionsForLargeStarsCheck = function(checked) {
      model.useRangeSelectionsForLargeStars = checked;
      this.enableControls();
   }

   this.rangeSelectionsTreeBoxNodeClicked = function(node, col) {
      this.view.rangeSelectionLowerLimitNumericControl.setValue(node.text(1).toFloat());
      this.view.rangeSelectionUpperLimitNumericControl.setValue(node.text(2).toFloat());
      this.view.rangeSelectionFuzzinessNumericControl.setValue(node.text(3).toFloat());
      this.view.rangeSelectionSmoothnessNumericControl.setValue(node.text(4).toFloat());
      var index = node.text(0).toInt() - 1;

      if ( index == 0 ) {
         var checked = node.checked;
         model.rangeSelectionsUsed[index] = true;
         this.view.rangeSelectionsTreeBox.child(index).checked = true;
         if ( ! checked ) {
         {
            for (var i = index+1; i < model.totalRangeSelections; i++) {
               model.rangeSelectionsUsed[i] = node.checked;
               if (this.view.rangeSelectionsTreeBox.child(i).checked)
                  this.view.rangeSelectionsTreeBox.child(i).checked = false;
               }
            }
         }
      }
      else
      {
         model.rangeSelectionsUsed[index] = node.checked;
         if (node.checked) { // Make sure all previous nodes are set same as current node
            for (var i = index-1; i >= 1; i--) {
               model.rangeSelectionsUsed[i] = node.checked;
               this.view.rangeSelectionsTreeBox.child(i).checked = node.checked;
            }
         }
         else { // Make sure all following nodes are set same as current node
            for (var i = index+1; i < model.totalRangeSelections; i++) {
               model.rangeSelectionsUsed[i] = node.checked;
               this.view.rangeSelectionsTreeBox.child(i).checked = node.checked;
            }
         }
      }

   }

   this.rangeSelectionLowerLimitNumericControlUpdate = function(value) {
      this.view.rangeSelectionsTreeBox.currentNode.setText(1,value.toPrecision(5));
      var index = this.view.rangeSelectionsTreeBox.currentNode.text(0).toInt();
      model.rangeSelectionLowerLimits[index-1] = value;
   }
   this.rangeSelectionUpperLimitNumericControlUpdate = function(value) {
      this.view.rangeSelectionsTreeBox.currentNode.setText(2,value.toPrecision(5));
      var index = this.view.rangeSelectionsTreeBox.currentNode.text(0).toInt();
      model.rangeSelectionUpperLimits[index-1] = value;
   }
   this.rangeSelectionFuzzinessNumericControlUpdate = function(value) {
      this.view.rangeSelectionsTreeBox.currentNode.setText(3,value.toPrecision(5));
      var index = this.view.rangeSelectionsTreeBox.currentNode.text(0).toInt();
      model.rangeSelectionFuzziness[index-1] = value;
   }
   this.rangeSelectionSmoothnessNumericControlUpdate = function(value) {
      this.view.rangeSelectionsTreeBox.currentNode.setText(4, value.toPrecision(5));
      var index = this.view.rangeSelectionsTreeBox.currentNode.text(0).toInt();
      model.rangeSelectionSmoothness[index-1] = value;
   }

   this.logParameters = function() {
      console.writeln();
      console.writeln("<b>Parameters:</b>");

      console.writeln(format(
         "Image: " + model.imageViewFormat,
         model.imageView.fullId
      ));

      console.writeln(format(
         "Gray percent: " +
         model.grayPercent
      ));
      console.writeln(format(
         "Protect stars: " +
         (model.protectStars ? "true" : "false")
      ));
      console.writeln(format(
         "Keep masks open: " +
         (model.keepsMasksOpen ? "true" : "false")
      ));

      console.writeln(format(
         "Use classic star mask: " +
         (model.useClassicStarMask ? "true" : "false")
      ));

      console.writeln(format(
         "Use HDR for star mask: " +
         (model.useHDRMforStarMask ? "true" : "false")
      ));

      console.writeln(format(
         "SM threshold: " +
         model.starMaskThreshold
      ));
      console.writeln(format(
         "SM scale: " +
         model.starMaskScale
      ));
      console.writeln(format(
         "SM large scale: " +
         model.starMaskLargeScale
      ));
      console.writeln(format(
         "SM small scale: " +
         model.starMaskSmallScale
      ));
      console.writeln(format(
         "SM compensation: " +
         model.starMaskCompensation
      ));
      console.writeln(format(
         "SM smoothness: " +
         model.starMaskSmoothness
      ));

      console.writeln(format(
         "Use range selections for base: " +
         model.useRangeSelectionForBase
      ));

      console.writeln("Use RS for base lower limit: " + model.rangeSelectionForBaseLowerLimit);
      console.writeln("Use RS for base upper limit: " + model.rangeSelectionForBaseUpperLimit);
      console.writeln("Use RS for base fuzziness: " + model.rangeSelectionForBaseFuzziness);
      console.writeln("Use RS for base smoothness: " + model.rangeSelectionSmoothness);

      console.writeln(format(
         "Use range selections for large stars: " +
         model.useRangeSelectionsForLargeStars
      ));

      for (var i = 0; i < model.totalRangeSelections; i++) {
         console.writeln(format("RS: " + (i+1) + " " +
            model.rangeSelectionLowerLimits[i] + " " +
            model.rangeSelectionUpperLimits[i] + " " +
            model.rangeSelectionFuzziness[i] + " " +
            model.rangeSelectionSmoothness[i]));
      }

      console.flush();
   };

   this.previewBaseRangeMask = function() {
      this.disableControls();
      this.view.previewBaseRangeMaskButton.enabled = false;
      this.view.closeBaseRangeMaskPreviewButton.enabled = true;

      console.show();
      console.flush();

      console.beginLog();
      console.writeln();
      console.writeln("<b>" + TITLE + " Version " + VERSION + "</b>");
      console.flush();

      this.logParameters();

      var time = -(new Date()).getTime();

      (new MaskGenerator(model, this.view)).previewBaseRangeMask();

      time += (new Date()).getTime();
      console.writeln(format("%.03f s", 0.001 * time));
      console.flush();

      console.flush();
      console.hide();
      gc();

   };

   this.previewStarMask = function() {
      this.disableControls();
      this.view.previewStarMaskButton.enabled = false;
      this.view.closeStarMaskPreviewButton.enabled = true;

      console.show();
      console.flush();

      console.beginLog();
      console.writeln();
      console.writeln("<b>" + TITLE + " Version " + VERSION + "</b>");
      console.flush();

      this.logParameters();

      var time = -(new Date()).getTime();

      (new MaskGenerator(model, this.view)).previewStarMask();

      time += (new Date()).getTime();
      console.writeln(format("%.03f s", 0.001 * time));
      console.flush();

      console.flush();
      console.hide();
      gc();

   };


   this.previewLargeStarRangeMask = function() {
      this.disableControls();
      this.view.previewLargeStarMaskButton.enabled = false;
      this.view.closeLargeStarMaskPreviewButton.enabled = true;

      console.show();
      console.flush();

      console.beginLog();
      console.writeln();
      console.writeln("<b>" + TITLE + " Version " + VERSION + "</b>");
      console.flush();

      this.logParameters();

      var time = -(new Date()).getTime();

      (new MaskGenerator(model, this.view)).previewLargeStarRangeMask();

      time += (new Date()).getTime();
      console.writeln(format("%.03f s", 0.001 * time));
      console.flush();

      console.flush();
      console.hide();
      gc();

   };

   this.closePreview = function() {
      //this.view.previewBaseRangeMaskButton.enabled = true;
      //this.view.closeBaseRangeMaskPreviewButton.enabled = false;
      if ( model.maskPreview != null ) {
         model.maskPreview.forceClose();
         model.maskPreview = null;
      }
      this.enableControls();
   }

   this.makeMask = function() {
      this.disableControls();
      console.show();
      console.flush();

      console.beginLog();
      console.writeln();
      console.writeln("<b>" + TITLE + " Version " + VERSION + "</b>");
      console.flush();

      this.logParameters();

      var time = -(new Date()).getTime();

      (new MaskGenerator(model, this.view)).createMask();

      time += (new Date()).getTime();
      console.writeln(format("%.03f s", 0.001 * time));
      console.flush();

      console.flush();
      console.hide();
      gc();
      this.enableControls();
   };

   this.dismiss = function() {
      this.view.ok();
   };

   this.newInstance = function() {
      model.storeParameters();
   };

   this.browseDocumentation = function() {
      if (!Dialog.browseScriptDocumentation(TITLE)) {
         (new MessageBox(
            "<p>Documentation has not been installed.</p>",
            TITLE,
            StdIcon_Warning,
            StdButton_Ok
         )).execute();
      }
   };
}

function MainView(model, controller) {
   this.__base__ = Dialog;
   this.__base__();

   this.addGroupBox = function(title) {
      var groupBox = new GroupBox(this);
      this.sizer.add(groupBox);

      groupBox.sizer = new VerticalSizer;
      groupBox.sizer.margin = 6;
      groupBox.sizer.spacing = 6;
      groupBox.title = title;
      groupBox.styleSheet = "*{}";

#ifeq __PI_PLATFORM__ MACOSX
      if (coreVersionBuild < 1168) {
         groupBox.sizer.addSpacing(-6);
      }
#endif

      return groupBox;
   };

   this.addSectionBar = function(title) {
      var sectionBar = new SectionBar(this);
      this.sizer.add(sectionBar);

      sectionBar.setTitle("Settings");
//      sectionBar.sizer = new VerticalSizer;
//      sectionBar.sizer.margin = 6;
//      sectionBar.sizer.spacing = 6;

      return sectionBar;
   };
   this.addSection = function(bar) {
      var ctrl = new Control(this);
      ctrl.sizer = new VerticalSizer;
      ctrl.sizer.margin = 6;
      ctrl.sizer.spacing = 6;
      return ctrl;
   };
   this.addPane = function(group) {
      var buttonPane = new HorizontalSizer;
      buttonPane.spacing = 6;
      group.sizer.add(buttonPane);

      return buttonPane;
   };

   this.addHorizontalSizer = function(sizer) {
      var hz = new HorizontalSizer;
      hz.spacing = 6;
      sizer.add(hz);

      return hz;
   };

   this.addViewList = function(pane, view, onViewSelected) {
      var viewList = new ViewList(this);
      pane.add(viewList);

      viewList.getAll();
      if (view != null && view.isView) {
         viewList.currentView = view;
      }
      viewList.onViewSelected = onViewSelected;

      return viewList;
   }

   this.addLabel = function(pane, text, toolTip) {
      var label = new Label(this);
      pane.add(label);

      label.setFixedWidth(this.labelWidth);
      label.text = text;
      label.toolTip = toolTip;
      label.textAlignment = TextAlign_Right | TextAlign_VertCenter;

      return label;
   };

   this.addPushButton = function(pane, text, toolTip, onClick) {
      var pushButton = new PushButton(this);
      pane.add(pushButton);

      pushButton.text = text;
      pushButton.toolTip = toolTip;
      pushButton.onClick = onClick;

      return pushButton;
   };

   this.addToolButtonMousePress = function(pane, icon, toolTip, onMousePress) {
      var toolButton = new ToolButton(this);
      pane.add(toolButton);

      toolButton.icon = this.scaledResource(icon);
      toolButton.setScaledFixedSize(20, 20);
      toolButton.toolTip = toolTip;
      toolButton.onMousePress = onMousePress;

      return toolButton;
   };

   this.addToolButton = function(pane, icon, toolTip, onClick) {
      var toolButton = new ToolButton(this);
      pane.add(toolButton);

      toolButton.icon = this.scaledResource(icon);
      toolButton.setScaledFixedSize(20, 20);
      toolButton.toolTip = toolTip.toString();
      toolButton.onClick = onClick;

      return toolButton;
   };

   this.addCheckBox = function(pane, text, checked, toolTip, onCheck) {
      var checkBox = new CheckBox(this);
      pane.add(checkBox);

      checkBox.text = text;
      checkBox.checked = checked;
      checkBox.onCheck = onCheck;
      checkBox.toolTip = toolTip;
      pane.add(checkBox);

      return checkBox;
   };

   this.addTreeBox = function(pane, columns, onClicked) {
      var treeBox = new TreeBox(this);
      pane.add(treeBox)

      with (treeBox)
      {
         alternateRowColor = false;
         headerVisible = true;
         indentSize = 0;
         multipleSelection = false;
         numberOfColumns = model.rangeSelectionColumnNames.length;
         var padString = "MMMMM";
         for (var i = 0; i != model.rangeSelectionColumnNames.length; ++i) {
            setHeaderText(i, model.rangeSelectionColumnNames[i]);
            setHeaderAlignment(i, Align_Left | TextAlign_VertCenter);
            setColumnWidth(i, this.displayPixelRatio * (treeBox.font.width(headerText(i) + padString)));
         }
         var treeBoxRows = 1;
         setMinHeight(
            this.displayPixelRatio * treeBoxRows * (font.lineSpacing + 6) +
            borderWidth
         );
         treeBoxRows = 4.5;
         setMaxHeight(
            this.displayPixelRatio * treeBoxRows * (font.lineSpacing + 6) +
            borderWidth
         );
         onNodeClicked = onClicked;
         setMinWidth(350);
         adjustToContents();
      }

      return treeBox;
   };

   this.addNumericControl = function(pane, text, val, rmin, rmax, srmin, srmax, width, step, prec, onUpdate)
   {
      var numericControl = new NumericControl (this);
      pane.add(numericControl);

      with ( numericControl ) {
         label.text = text;
         label.minWidth = this.labelWidth;
         setRange (rmin, rmax);
         slider.setRange (srmin, srmax);
         slider.maxWidth = width;
         slider.stepSize = step;
         setPrecision (prec);
         setValue(val);
         onValueUpdated = onUpdate;
      }
      return numericControl;
   };

   this.addSpinBox = function(pane, val, min, max, onUpdate)
   {
      var spinBox = new SpinBox(this);
      pane.add(spinBox);
      with ( spinBox ) {
         setRange(min, max);
         value = val;
         onValueUpdated = onUpdate;
      }
      return spinBox;
   };

   this.sizer = new VerticalSizer;
   this.sizer.margin = 6;
   this.sizer.spacing = 6;

   this.labelWidth = this.font.width("Compensation:")

   {
      this.imageGroupBox = this.addGroupBox("Image");

      {
         this.imageViewPane = this.addPane(this.imageGroupBox);

         this.imageViewList = this.addViewList(
            this.imageViewPane,
            null,
            function(view) {
               controller.imageViewOnViewSelected(view);
            }
         );
         this.imageViewListNull = this.imageViewList.currentView;

         this.imageViewHelpButton = this.addToolButton(
            this.imageViewPane,
            ":/icons/comment.png",
            controller.help.toString(),
            function() {
               controller.showHelp();
            }
         );

      }
   }

   { // Settings Group
      this.settingsSection = this.addGroupBox("Settings");
      {
         {
            this.useRangeSelectionForBasePane = this.addPane(this.settingsSection);

            this.useRangeSelectionForBasePane.addUnscaledSpacing(this.labelWidth);

            this.useRangeSelectionForBasePane.addSpacing(
               this.useRangeSelectionForBasePane.spacing
            );

            this.useRangeSelectionForBaseCheckBox = this.addCheckBox(
               this.useRangeSelectionForBasePane,
               "Use range mask for base image",
               model.useRangeSelectionForBase,
               "<p>If checked, a range mask created from RangeSelection will " +
               "be used for the base image of the mask.</p>" +
               "<p>If not checked, then the base image for the mask " +
               "will be created from the source image after stars are " +
               "removed using ATrousWaveletTransform.</p>",
               function(checked) {
                  controller.UseRangeSelectionForBaseCheck(checked);
               }
            );

            this.useRangeSelectionForBasePane.addStretch();
         }

         {
            this.grayPercentPane = this.addPane(this.settingsSection);

            this.grayPercentNumericControl = this.addNumericControl(
                  this.grayPercentPane,
                     "Percent gray:",
                     model.grayPercent,
                     0, 1,
                     0, 100,
                     50,
                     10,
                     5,
                     function (value) {
                        controller.grayPercentNumericControlUpdate(value);
                        }
            );
            this.grayPercentNumericControl.toolTip = "<p>Percentage of gray for creating base gray mask.</p>" +
                     "<p>If set to 0, then the DSO is isolated based on " +
                     "it's own signal.</p>";
         }

         {
            this.protectStarsPane = this.addPane(this.settingsSection);

            this.protectStarsPane.addUnscaledSpacing(this.labelWidth);

            this.protectStarsPane.addSpacing(
               this.protectStarsPane.spacing
            );

            this.protectStarsCheckBox = this.addCheckBox(
               this.protectStarsPane,
               "Protect stars",
               model.protectStars,
               "<p>Add star protection to final mask.</p>",
               function(checked) {
                  controller.protectStarsCheck(checked);
               }
            );
            this.protectStarsPane.addStretch();
         }

         {
            this.keepMasksOpenPane = this.addPane(this.settingsSection);

            this.keepMasksOpenPane.addUnscaledSpacing(this.labelWidth);

            this.keepMasksOpenPane.addSpacing(
               this.keepMasksOpenPane.spacing
            );

            this.keepMasksOpenCheckBox = this.addCheckBox(
               this.keepMasksOpenPane,
               "Keep masks open",
               model.keepMasksOpen,
               "<p>If checked, then DSO mask and " +
               "(if applicable) star masks, range masks, etc. will not be closed.</p>",
               function(checked) {
                  controller.keepMasksOpenCheck(checked);
               }
            );

            this.keepMasksOpenPane.addStretch();
         }
      }
   }

   { // Range Selection Group
      this.rangeSelectionGroupBox = this.addGroupBox("Base Image Range Selection");

      {

         {
            this.previewBaseRangeMaskButtonPane = this.addPane(this.rangeSelectionGroupBox);

            this.previewBaseRangeMaskButton = this.addPushButton(
               this.previewBaseRangeMaskButtonPane,
               "Preview",
               "<p>Preview base range mask.</p>",
               function() {
                  controller.previewBaseRangeMask();
               }
            );

            this.closeBaseRangeMaskPreviewButton = this.addPushButton(
               this.previewBaseRangeMaskButtonPane,
               "Close Preview",
               "<p>Close the range mask preview.</p>",
               function() {
                  controller.closePreview();
               }
            );
         }

         {
            this.rangeSelectionForBaseLowerLimitPane = this.addPane(this.rangeSelectionGroupBox);

            this.rangeSelectionForBaseLowerLimitNumericControl = this.addNumericControl(
                  this.rangeSelectionForBaseLowerLimitPane,
                     "Lower limit:",
                     model.rangeSelectionForBaseLowerLimit,
                     0.0, 1.0,
                     0, 100,
                     50,
                     10,
                     5,
                     function (value) {
                        controller.rangeSelectionForBaseLowerLimitNumericControlUpdate(value);
                        }
            );
            this.rangeSelectionForBaseLowerLimitNumericControl.toolTip = "<p>Range selection lower limit.</p>";
         }

         {
            this.rangeSelectionForBaseUpperLimitPane = this.addPane(this.rangeSelectionGroupBox);

            this.rangeSelectionForBaseUpperLimitNumericControl = this.addNumericControl(
                  this.rangeSelectionForBaseUpperLimitPane,
                     "Upper limit:",
                     model.rangeSelectionForBaseUpperLimit,
                     0.0, 1.0,
                     0, 100,
                     50,
                     10,
                     5,
                     function (value) {
                        controller.rangeSelectionForBaseUpperLimitNumericControlUpdate(value);
                        }
            );
            this.rangeSelectionForBaseUpperLimitNumericControl.toolTip = "<p>Range selection upper limit.</p>";

         }

         {
            this.rangeSelectionForBaseFuzzinessPane = this.addPane(this.rangeSelectionGroupBox);

            this.rangeSelectionForBaseFuzzinessNumericControl = this.addNumericControl(
                  this.rangeSelectionForBaseFuzzinessPane,
                     "Fuzziness:",
                     model.rangeSelectionForBaseFuzziness,
                     0.0, 1.0,
                     0, 100,
                     50,
                     10,
                     5,
                     function (value) {
                        controller.rangeSelectionForBaseFuzzinessNumericControlUpdate(value);
                        }
            );
            this.rangeSelectionForBaseFuzzinessNumericControl.toolTip = "<p>Range selection fuzziness.</p>";

         }

         {
            this.rangeSelectionForBaseSmoothnessPane = this.addPane(this.rangeSelectionGroupBox);

            this.rangeSelectionForBaseSmoothnessNumericControl = this.addNumericControl(
                  this.rangeSelectionForBaseSmoothnessPane,
                     "Smoothness:",
                     model.rangeSelectionForBaseSmoothness,
                     0.0, 100.0,
                     0, 100,
                     50,
                     10,
                     5,
                     function (value) {
                        controller.rangeSelectionForBaseSmoothnessNumericControlUpdate(value);
                        }
            );
            this.rangeSelectionForBaseSmoothnessNumericControl.toolTip = "<p>Range selection smoothness.</p>";

         }
      }
   }

   { // Star Mask Group
      this.starMaskGroupBox = this.addGroupBox("Star Mask");

      {
         {
            this.previewStarMaskButtonPane = this.addPane(this.starMaskGroupBox);

            this.previewStarMaskButton = this.addPushButton(
               this.previewStarMaskButtonPane,
               "Preview",
               "<p>Preview star mask.</p>",
               function() {
                  controller.previewStarMask();
               }
            );

            this.closeStarMaskPreviewButton = this.addPushButton(
               this.previewStarMaskButtonPane,
               "Close Preview",
               "<p>Close the star mask preview.</p>",
               function() {
                  controller.closePreview();
               }
            );
         }

         {
            this.useClassicStarMaskPane = this.addPane(this.starMaskGroupBox);

            this.useClassicStarMaskPane.addUnscaledSpacing(this.labelWidth);

            this.useClassicStarMaskPane.addSpacing(
               this.useClassicStarMaskPane.spacing
            );

            this.useClassicStarMaskCheckBox = this.addCheckBox(
               this.useClassicStarMaskPane,
               "Use classic star mask",
               model.useClassicStarMask,
               "<p>Use classic approach to star mask generation " +
               "based on ClassicStarMask script.</p>" +
               "<p>If not checked, the StarMask Process will be used " +
               "to create a star mask for protecting stars in " +
               "the final mask.</p>",
               function(checked) {
                  controller.useClassicStarMaskCheck(checked);
               }
            );

            this.useClassicStarMaskPane.addStretch();
         }

         {
            this.useHDRMPane = this.addPane(this.starMaskGroupBox);

            this.useHDRMPane.addUnscaledSpacing(this.labelWidth);

            this.useHDRMPane.addSpacing(
               this.useHDRMPane.spacing
            );

            this.useHDRMCheckBox = this.addCheckBox(
               this.useHDRMPane,
               "Use HDRM for star mask",
               model.useHDRMForStarMask,
               "<p>Apply HDRMultiscaleTransform to source image prior to star mask creation.</p>",
               function(checked) {
                  controller.useHDRMCheck(checked);
               }
            );

            this.useHDRMPane.addStretch();
         }

         {
            this.starMaskThresholdPane = this.addPane(this.starMaskGroupBox);

            this.starMaskThresholdNumericControl = this.addNumericControl(
                  this.starMaskThresholdPane,
                     "Threshold:",
                     model.starMaskThreshold,
                     0.0, 1.0,
                     0, 100,
                     50,
                     10,
                     5,
                     function (value) {
                        controller.starMaskThresholdNumericControlUpdate(value);
                        }
            );
            this.starMaskThresholdNumericControl.toolTip = "<p>Threshold to use with StarMask process.</p>";
         }

         {
            this.starMaskScalePane = this.addPane(this.starMaskGroupBox);
            this.starMaskThresholdLabel = this.addLabel(
                  this.starMaskScalePane,
                  "Scale:",
                  "<p>Scale to use with StarMask process.</p>"
            );

            this.starMaskScaleSpinBox = this.addSpinBox(
                  this.starMaskScalePane,
                     model.starMaskScale,
                     2, 12.0,
                     function (value) {
                        controller.starMaskScaleSpinBoxUpdate(value);
                        }
            );
            this.starMaskScaleSpinBox.toolTip = "<p>Scale to use with StarMask process.</p>",\

            this.starMaskScalePane.addStretch();

         }

         {
            this.smPane1 = this.addPane(this.starMaskGroupBox);
            {
               this.starMaskLargeScalePane = this.addHorizontalSizer(this.smPane1);
               this.starMaskLargeScaleLabel = this.addLabel(
                     this.starMaskLargeScalePane,
                     "Large-scale:",
                     "<p>Large-scale to use with StarMask process.</p>"
               );

               this.starMaskLargeScaleSpinBox = this.addSpinBox(
                     this.starMaskLargeScalePane,
                        model.starMaskLargeScale,
                        0, 15,
                        function (value) {
                           controller.starMaskLargeScaleSpinBoxUpdate(value);
                           }
               );
               this.starMaskLargeScaleSpinBox.toolTip = "<p>Large-scale to use with StarMask process.</p>";
//               this.starMaskLargeScalePane.addStretch();
            }
            {
               this.starMaskCompensationPane = this.addHorizontalSizer(this.smPane1);
               this.starMaskCompensationLabel = this.addLabel(
                     this.starMaskCompensationPane,
                     "Compensation:",
                     "<p>Compensation to use with StarMask process.</p>"
               );

               this.starMaskCompensationSpinBox = this.addSpinBox(
                     this.starMaskCompensationPane,
                        model.starMaskCompensation,
                        1, 4,
                        function (value) {
                           controller.starMaskCompensationSpinBoxUpdate(value);
                           }
               );
               this.starMaskCompensationSpinBox.toolTip = "<p>Compensation to use with StarMask process.</p>";
//               this.starMaskCompensationPane.addStretch();
            }
            this.smPane1.addStretch();
         }

         {
            this.smPane2 = this.addPane(this.starMaskGroupBox);
            {
               this.starMaskSmallScalePane = this.addHorizontalSizer(this.smPane2);
               this.starMaskSmallScaleLabel = this.addLabel(
                     this.starMaskSmallScalePane,
                     "Small-scale:",
                     "<p>Small-scale to use with StarMask process.</p>"
               );

               this.starMaskSmallScaleSpinBox = this.addSpinBox(
                     this.starMaskSmallScalePane,
                        model.starMaskSmallScale,
                        0, 15,
                        function (value) {
                           controller.starMaskSmallScaleSpinBoxUpdate(value);
                           }
               );
               this.starMaskSmallScaleSpinBox.toolTip = "<p>Small-scale to use with StarMask process.</p>";
//               this.starMaskSmallScalePane.addStretch();

            }

            {
               this.starMaskSmoothnessPane = this.addHorizontalSizer(this.smPane2);
               this.starMaskSmoothnessLabel = this.addLabel(
                     this.starMaskSmoothnessPane,
                     "Smoothness:",
                     "<p>Smoothness to user with StarMask process.</p>"
               );

               this.starMaskSmoothnessSpinBox = this.addSpinBox(
                     this.starMaskSmoothnessPane,
                        model.starMaskSmoothness,
                        0, 40,
                        function (value) {
                           controller.starMaskSmoothnessSpinBoxUpdate(value);
                           }
               );
               this.starMaskSmoothnessSpinBox.toolTip = "<p>Smoothness to user with StarMask process.</p>";
//               this.starMaskSmoothnessPane.addStretch();
            }
            this.smPane2.addStretch();
         }
      }
   }

   { // Large Stars Group
      this.largeStarsGroupBox = this.addGroupBox("Large Stars");

      {

         {
            this.useRangeSelectionsForLargeStarsPane = this.addPane(this.largeStarsGroupBox);

//            this.useRangeSelectionsForLargeStarsPane.addUnscaledSpacing(this.labelWidth);

            this.useRangeSelectionsForLargeStarsPane.addSpacing(
               this.useRangeSelectionsForLargeStarsPane.spacing
            );

            this.useRangeSelectionsForLargeStarsCheckBox = this.addCheckBox(
               this.useRangeSelectionsForLargeStarsPane,
               "Use range masks for large stars",
               model.useRangeSelectionsForLargeStars,
               "<p>Use (up to 3) successive range masks to isolate large stars.</p>",
               function(checked) {
                  controller.useRangeSelectionsForLargeStarsCheck(checked);
               }
            );

            this.useRangeSelectionsForLargeStarsPane.addStretch();
         }

         {
            this.previewLargeStarMaskButtonPane = this.addPane(this.largeStarsGroupBox);

            this.previewLargeStarMaskButton = this.addPushButton(
               this.previewLargeStarMaskButtonPane,
               "Preview",
               "<p>Preview range mask.</p>",
               function() {
                  controller.previewLargeStarRangeMask();
               }
            );

            this.closeLargeStarMaskPreviewButton = this.addPushButton(
               this.previewLargeStarMaskButtonPane,
               "Close Preview",
               "<p>Close the range mask preview.</p>",
               function() {
                  controller.closePreview();
               }
            );
         }

         {
            this.rangeSelectionsPane = this.addPane(this.largeStarsGroupBox);

            this.rangeSelectionsTreeBox = this.addTreeBox(
                  this.rangeSelectionsPane,
                     model.rangeSelectionColumnNames,
                     function (node, col) {
                        controller.rangeSelectionsTreeBoxNodeClicked(node, col);
                        }
            );

            for (var i = 0; i != model.totalRangeSelections; ++i) {

               var treeBoxNode = new TreeBoxNode(this.rangeSelectionsTreeBox);
               with (treeBoxNode) {
                  checked = model.rangeSelectionsUsed[i];
                  selected = false;
                  for (var j = 0; j != model.rangeSelectionColumnNames.length; ++j) {
                     setText(
                        j,
                        [
                           format("%d ", i + 1),
                           model.rangeSelectionLowerLimits[i].toPrecision(5),
                           model.rangeSelectionUpperLimits[i].toPrecision(5),
                           model.rangeSelectionFuzziness[i].toPrecision(5),
                           model.rangeSelectionSmoothness[i].toPrecision(5)
                        ][j]
                     );
                     this.rangeSelectionsTreeBox.adjustColumnWidthToContents(j);
                  }
               }
            }

            this.rangeSelectionsTreeBox.adjustToContents();
         }
         this.rangeSelectionsPane.addStretch();

         {
            this.rangeSelectionLowerLimitPane = this.addPane(this.largeStarsGroupBox);

            this.rangeSelectionLowerLimitNumericControl = this.addNumericControl(
                  this.rangeSelectionLowerLimitPane,
                     "Lower limit:",
                     0.0,
                     0.0, 1.0,
                     0, 100,
                     50,
                     10,
                     5,
                     function (value) {
                        controller.rangeSelectionLowerLimitNumericControlUpdate(value);
                        }
            );
            this.rangeSelectionLowerLimitNumericControl.toolTip = "<p>Range selection lower limit.</p>";
         }

         {
            this.rangeSelectionUpperLimitPane = this.addPane(this.largeStarsGroupBox);

            this.rangeSelectionUpperLimitNumericControl = this.addNumericControl(
                  this.rangeSelectionUpperLimitPane,
                     "Upper limit:",
                     1.0,
                     0.0, 1.0,
                     0, 100,
                     50,
                     10,
                     5,
                     function (value) {
                        controller.rangeSelectionUpperLimitNumericControlUpdate(value);
                        }
            );
            this.rangeSelectionUpperLimitNumericControl.toolTip = "<p>Range selection upper limit.</p>";

         }

         {
            this.rangeSelectionFuzzinessPane = this.addPane(this.largeStarsGroupBox);

            this.rangeSelectionFuzzinessNumericControl = this.addNumericControl(
                  this.rangeSelectionFuzzinessPane,
                     "Fuzziness:",
                     0.0,
                     0.0, 1.0,
                     0, 100,
                     50,
                     10,
                     5,
                     function (value) {
                        controller.rangeSelectionFuzzinessNumericControlUpdate(value);
                        }
            );
            this.rangeSelectionFuzzinessNumericControl.toolTip = "<p>Range selection fuzziness.</p>";

         }

         {
            this.rangeSelectionSmoothnessPane = this.addPane(this.largeStarsGroupBox);

            this.rangeSelectionSmoothnessNumericControl = this.addNumericControl(
                  this.rangeSelectionSmoothnessPane,
                     "Smoothness:",
                     0.0,
                     0.0, 100.0,
                     0, 100,
                     50,
                     10,
                     5,
                     function (value) {
                        controller.rangeSelectionSmoothnessNumericControlUpdate(value);
                        }
            );
            this.rangeSelectionSmoothnessNumericControl.toolTip = "<p>Range selection smoothness.</p>";

         }
      }
   }

   this.sizer.addStretch();

   {
      this.buttonPane = this.addPane(this);

      this.newInstanceButton = this.addToolButtonMousePress(
         this.buttonPane,
         ":/process-interface/new-instance.png",
         "<p>Create a new instance.</p>",
         function() {
            this.hasFocus = true;
            controller.newInstance();
            this.pushed = false;
            this.dialog.newInstance();
         }
      );

      this.browseDocumentationButton = this.addToolButton(
         this.buttonPane,
         ":/process-interface/browse-documentation.png",
         "<p>Open a browser to view documentation.</p>",
         function() {
            controller.browseDocumentation();
         }
      );

      this.resetButton = this.addToolButton(
         this.buttonPane,
         ":/images/icons/reset.png",
         "<p>Reset all parameters.</p>",
         function() {
            controller.reset();
         }
      );

      this.buttonPane.addStretch();

      this.makeMaskButton = this.addPushButton(
         this.buttonPane,
         "Create Mask",
         "<p>Create Mask.</p>",
         function() {
            controller.makeMask();
         }
      );

      this.dismissButton = this.addPushButton(
         this.buttonPane,
         "Dismiss",
         "<p>Dismiss the dialog.</p>",
         function() {
            controller.dismiss();
         }
      );
      this.dismissButton.defaultButton = true;
      this.dismissButton.hasFocus = true;

   }

   this.onClose = function() {
   }

   this.windowTitle = TITLE + " v" + VERSION;

   this.adjustToContents();
   this.setMinWidth(this.width + this.logicalPixelsToPhysical(20));
   this.setFixedHeight(this.height + this.logicalPixelsToPhysical(20));
}

MainView.prototype = new Dialog;
