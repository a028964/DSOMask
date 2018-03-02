
function MainController(model, isViewTarget) {
   this.view = null;

   this.isViewTarget = isViewTarget;

   this.setView = function(view) {
      this.view = view;
   };

   this.setImageWindow = function(window) {
      if (window != null && window.mainView.isView) {
        model.imageWindow = window;
        model.imageView = window.currentView;
        this.view.imageViewList.currentView = model.imageView;
      }
      else {
        model.imageView = null;
        model.imageWindow = null;
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
      this.view.starMaskGroupBox.checkBox.checked = model.protectStars;

      model.applyMask = model.defApplyMask;
      this.view.applyMaskCheckBox.checked = model.applyMask;

      model.invertMask = model.defInvertMask;
      this.view.invertMaskCheckBox.checked = model.invertMask;

      model.hideMask = model.defHideMask;
      this.view.hideMaskCheckBox.checked = model.hideMask;

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

      model.useRangeSelectionForBase = model.defUseRangeSelectionForBase;
      this.view.rangeSelectionGroupBox.checkBox.checked = model.useRangeSelectionForBase;

      model.rangeSelectionForBaseLowerLimit = model.defRangeSelectionForBaseLowerLimit;
      this.view.rangeSelectionForBaseLowerLimitNumericControl.setValue(model.rangeSelectionForBaseLowerLimit);

      model.rangeSelectionForBaseUpperLimit = model.defRangeSelectionForBaseUpperLimit;
      this.view.rangeSelectionForBaseUpperLimitNumericControl.setValue(model.rangeSelectionForBaseUpperLimit);

      model.rangeSelectionForBaseFuzziness = model.defRangeSelectionForBaseFuzziness;
      this.view.rangeSelectionForBaseFuzzinessNumericControl.setValue(model.rangeSelectionForBaseFuzziness);

      model.rangeSelectionForBaseSmoothness = model.defRangeSelectionForBaseSmoothness;
      this.view.rangeSelectionForBaseSmoothnessNumericControl.setValue(model.rangeSelectionForBaseSmoothness);

      model.useRangeSelectionsForLargeStars = model.defUseRangeSelectionsForLargeStars;
      this.view.largeStarsGroupBox.checkBox.checked = model.useRangeSelectionsForLargeStars;

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
      this.view.starMaskGroupBox.checkBox.enabled = false;
      this.view.keepMasksOpenCheckBox.enabled = false;
      this.view.applyMaskCheckBox.enabled = false;
      this.view.invertMaskCheckBox.enabled = false;
      this.view.hideMaskCheckBox.enabled = false;

      this.view.useClassicStarMaskCheckBox.enabled = false;
      this.view.useHDRMCheckBox.enabled = false;
      this.view.previewStarMaskCheckBox.enabled = false;
      this.view.starMaskThresholdNumericControl.enabled = false;
      this.view.starMaskScaleSpinBox.enabled = false;
      this.view.starMaskLargeScaleSpinBox.enabled = false;
      this.view.starMaskSmallScaleSpinBox.enabled = false;
      this.view.starMaskCompensationSpinBox.enabled = false;
      this.view.starMaskSmoothnessSpinBox.enabled = false;

      this.view.newInstanceButton.enabled = false;
      this.view.browseDocumentationButton.enabled = false;
      this.view.resetButton.enabled = false;

      this.view.rangeSelectionGroupBox.checkBox.enabled = false;
      this.view.previewBaseRangeMaskCheckBox.enabled = false;
      this.view.rangeSelectionForBaseLowerLimitNumericControl.enabled = false;
      this.view.rangeSelectionForBaseUpperLimitNumericControl.enabled = false;
      this.view.rangeSelectionForBaseFuzzinessNumericControl.enabled = false;
      this.view.rangeSelectionForBaseSmoothnessNumericControl.enabled = false;

      this.view.largeStarsGroupBox.checkBox.enabled = false;
      this.view.previewLargeStarsMaskCheckBox.enabled = false;
      this.view.rangeSelectionLowerLimitNumericControl.enabled = false;
      this.view.rangeSelectionUpperLimitNumericControl.enabled = false;
      this.view.rangeSelectionFuzzinessNumericControl.enabled = false;
      this.view.rangeSelectionSmoothnessNumericControl.enabled = false;

      this.view.rangeSelectionsTreeBox.child(0).enabled = false;
      this.view.rangeSelectionsTreeBox.child(1).enabled = false;
      this.view.rangeSelectionsTreeBox.child(2).enabled = false;

      this.view.makeMaskButton.enabled = false;
      this.view.dismissButton.enabled = false;
   };

   this.enableControls = function() {
     if ( model.maskPreview != null )
     {
       this.view.applyMaskCheckBox.enabled = true;
       if (model.applyMask)
       {
         this.view.invertMaskCheckBox.enabled = true;
         this.view.hideMaskCheckBox.enabled = true;
       }
       else {
         this.view.invertMaskCheckBox.enabled = false;
         this.view.hideMaskCheckBox.enabled = false;
       }
       if (model.beingPreviewed == model.BASE ) {
         this.view.previewBaseRangeMaskCheckBox.enabled = true;
       }
       else if ( model.beingPreviewed == model.STARS ) {
         this.view.previewStarMaskCheckBox.enabled = true;
       }
       else if ( model.beingPreviewed == model.LSTARS ) {
         this.view.previewLargeStarsMaskCheckBox.enabled = true;
       }
     }
     else {
      this.view.imageViewList.enabled = true;

      this.view.grayPercentNumericControl.enabled = true;
      this.view.keepMasksOpenCheckBox.enabled = true;

      this.view.applyMaskCheckBox.enabled = true;
      if (model.applyMask)
      {
        this.view.invertMaskCheckBox.enabled = true;
        this.view.hideMaskCheckBox.enabled = true;
      }
      else {
        this.view.invertMaskCheckBox.enabled = false;
        this.view.hideMaskCheckBox.enabled = false;
      }

      this.view.starMaskGroupBox.checkBox.enabled = true;
      if ( model.protectStars )
      {
         this.view.useClassicStarMaskCheckBox.enabled = true;
         this.view.useHDRMCheckBox.enabled = true;
         if ( model.imageView != null )
         {
            this.view.previewStarMaskCheckBox.enabled = true;
         }
         else {
            this.view.previewStarMaskCheckBox.enabled = false;
         }

         if ( model.useClassicStarMask )
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

      }
      else
      {
         this.view.useClassicStarMaskCheckBox.enabled = false;
         this.view.useHDRMCheckBox.enabled = false;
         this.view.previewStarMaskCheckBox.enabled = false;

         this.view.starMaskThresholdNumericControl.enabled = false;
         this.view.starMaskScaleSpinBox.enabled = false;
         this.view.starMaskLargeScaleSpinBox.enabled = false;
         this.view.starMaskSmallScaleSpinBox.enabled = false;
         this.view.starMaskCompensationSpinBox.enabled = false;
         this.view.starMaskSmoothnessSpinBox.enabled = false;
      }

      this.view.rangeSelectionGroupBox.checkBox.enabled = true;
      if ( model.useRangeSelectionForBase ) {
         this.view.rangeSelectionForBaseLowerLimitNumericControl.enabled = true;
         this.view.rangeSelectionForBaseUpperLimitNumericControl.enabled = true;
         this.view.rangeSelectionForBaseFuzzinessNumericControl.enabled = true;
         this.view.rangeSelectionForBaseSmoothnessNumericControl.enabled = true;
         if ( model.imageView != null )
         {
            this.view.previewBaseRangeMaskCheckBox.enabled = true;
         }
         else {
            this.view.previewBaseRangeMaskCheckBox.enabled = false;
         }
      }
      else
      {
         this.view.rangeSelectionForBaseLowerLimitNumericControl.enabled = false;
         this.view.rangeSelectionForBaseUpperLimitNumericControl.enabled = false;
         this.view.rangeSelectionForBaseFuzzinessNumericControl.enabled = false;
         this.view.rangeSelectionForBaseSmoothnessNumericControl.enabled = false;
         this.view.previewBaseRangeMaskCheckBox.enabled = false;
      }

      this.view.largeStarsGroupBox.checkBox.enabled = true;
      if ( model.useRangeSelectionsForLargeStars )
      {

        this.view.rangeSelectionLowerLimitNumericControl.enabled = model.useRangeSelectionsForLargeStars;
        this.view.rangeSelectionUpperLimitNumericControl.enabled = model.useRangeSelectionsForLargeStars;
        this.view.rangeSelectionFuzzinessNumericControl.enabled = model.useRangeSelectionsForLargeStars;
        this.view.rangeSelectionSmoothnessNumericControl.enabled = model.useRangeSelectionsForLargeStars;

        this.view.rangeSelectionsTreeBox.child(0).enabled = model.useRangeSelectionsForLargeStars;
        this.view.rangeSelectionsTreeBox.child(1).enabled = model.useRangeSelectionsForLargeStars;
        this.view.rangeSelectionsTreeBox.child(2).enabled = model.useRangeSelectionsForLargeStars;

        if ( model.imageView != null )
        {
           this.view.previewLargeStarsMaskCheckBox.enabled = true;
        }
        else {
           this.view.previewLargeStarsMaskCheckBox.enabled = false;
        }
      }
      else
      {
        this.view.rangeSelectionLowerLimitNumericControl.enabled = false;
        this.view.rangeSelectionUpperLimitNumericControl.enabled = false;
        this.view.rangeSelectionFuzzinessNumericControl.enabled = false;
        this.view.rangeSelectionSmoothnessNumericControl.enabled = false;

        this.view.previewLargeStarsMaskCheckBox.enabled = false;

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
    }
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

   this.protectStarsCheck = function(bar) {
      model.protectStars = bar.isChecked();
      this.enableControls();
   };

   this.keepMasksOpenCheck = function(checked) {
      model.keepMasksOpen = checked;
      this.enableControls();
   };

   this.applyMaskCheck = function(checked) {
     model.applyMask = checked;
     if (checked)
     {
       if ( model.maskPreview != null )
       {
         model.imageWindow.setMask(model.maskPreview);
         model.imageWindow.maskVisible = model.hideMask == true ? false : true;
         model.imageWindow.maskInverted = model.invertMask;
         model.imageWindow.bringToFront();
       }
       else if ( model.dsoMaskView != null ) {
         model.imageWindow.setMask(model.dsoMaskView);
         model.imageWindow.maskVisible = model.hideMask == true ? false : true;
         model.imageWindow.maskInverted = model.invertMask;
         model.imageWindow.bringToFront();
       }
     }
     else {
        if ( model.maskPreview != null )
        {
          model.imageWindow.removeMask();
          model.maskPreview.bringToFront();
        }
        else if (model.dsoMaskView != null ){
          model.imageWindow.removeMask();
          model.dsoMaskView.bringToFront();
        }
     }
     this.enableControls();
   }

   this.invertMaskCheck = function(checked) {
     model.invertMask = checked;
     if ( model.imageWindow != null ) {
       model.imageWindow.maskInverted = model.invertMask;
     }
     this.enableControls();
   }

   this.hideMaskCheck = function(checked) {
     model.hideMask = checked;
     if (model.imageWindow != null) {
       model.imageWindow.maskVisible = model.hideMask == true ? false : true;
     }
     this.enableControls();
   }

   this.useClassicStarMaskCheck = function(checked) {
      model.useClassicStarMask = checked;
      this.enableControls();
   };

   this.useHDRMCheck = function(checked) {
      model.useHDRMForStarMask = checked;
      this.enableControls();
   };

   this.useRangeSelectionForBaseCheck = function(bar) {
      model.useRangeSelectionForBase = bar.isChecked();
      this.enableControls();
   };

   this.previewBaseRangeMaskCheck = function(checked) {
     if (checked) {
       this.previewBaseRangeMask();
     }
     else {
       this.closePreview();
     }
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

   this.previewStarMaskCheck = function(checked) {
     if (checked) {
       this.previewStarMask()
     }
     else {
       this.closePreview();
     }
   };

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

   this.useRangeSelectionsForLargeStarsCheck = function(bar) {
      model.useRangeSelectionsForLargeStars = bar.isChecked();
      this.enableControls();
   }

   this.previewLargeStarsMaskCheck = function(checked) {
     if (checked) {
       this.previewLargeStarRangeMask()
     }
     else {
       this.closePreview();
     }
   };

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
      this.enableControls();
   };

   this.previewStarMask = function() {
      this.disableControls();

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
      this.enableControls();
   };

   this.previewLargeStarRangeMask = function() {
      this.disableControls();

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
      this.enableControls();
   };

   this.closePreview = function() {
    this.disableControls();
    if ( model.maskPreview != null ) {
      model.imageWindow.removeMask();

      model.maskPreview.forceClose();
      model.maskPreview = null;
      model.beingPreviewed = model.NONE;
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
};

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

      return groupBox;
   };

   this.addSectionBar = function(title) {
     var sectionBar = new SectionBar(this, title);
     this.sizer.add(sectionBar);

     return sectionBar;
   };

   this.addSection = function(bar) {
     var section = new Control(bar);
     this.sizer.add(section);
     section.sizer = new VerticalSizer;
     section.sizer.margin = 6;
     section.sizer.spacing = 6;

     return section;
   }

   this.addHorizontalControlPane = function(control) {
      var sz = new HorizontalSizer;
      sz.spacing = 6;
      control.sizer.add(sz);

      return sz;
   };

   this.addHorizontalSizerPane = function(sizer) {
      var sz = new HorizontalSizer;
      sz.spacing = 6;
      sizer.add(sz);

      return sz;
   };

   this.addVerticalSizerPane = function(sizer) {
      var hz = new VerticalSizer;
      hz.spacing = 6;
      sizer.add(hz);

      return hz;
   };

   this.addViewList = function(pane, view, onViewSelected) {
      var viewList = new ViewList(pane.parentControl);
      pane.add(viewList);

      viewList.getAll();
      if (view != null && view.isView) {
         viewList.currentView = view;
      }
      viewList.onViewSelected = onViewSelected;

      return viewList;
   }

   this.addLabel = function(pane, text, toolTip) {
      var label = new Label(pane.parentControl);
      pane.add(label);

      label.setFixedWidth(this.labelWidth);
      label.text = text;
      label.toolTip = toolTip;
      label.textAlignment = TextAlign_Right | TextAlign_VertCenter;

      return label;
   };

   this.addPushButton = function(pane, text, toolTip, onClick) {
      var pushButton = new PushButton(pane.parentControl);
      pane.add(pushButton);

      pushButton.text = text;
      pushButton.toolTip = toolTip;
      pushButton.onClick = onClick;

      return pushButton;
   };

   this.addToolButtonMousePress = function(pane, icon, toolTip, onMousePress) {
      var toolButton = new ToolButton(pane.parentControl);
      pane.add(toolButton);

      toolButton.icon = this.scaledResource(icon);
      toolButton.setScaledFixedSize(20, 20);
      toolButton.toolTip = toolTip;
      toolButton.onMousePress = onMousePress;

      return toolButton;
   };

   this.addToolButton = function(pane, icon, toolTip, onClick) {
      var toolButton = new ToolButton(pane.parentControl);
      pane.add(toolButton);

      toolButton.icon = this.scaledResource(icon);
      toolButton.setScaledFixedSize(20, 20);
      toolButton.toolTip = toolTip.toString();
      toolButton.onClick = onClick;

      return toolButton;
   };

   this.addCheckBox = function(pane, text, checked, toolTip, onCheck) {
      var checkBox = new CheckBox(pane.parentControl);
      pane.add(checkBox);

      checkBox.text = text;
      checkBox.checked = checked;
      checkBox.onCheck = onCheck;
      checkBox.toolTip = toolTip;

      return checkBox;
   };

   this.addSectionCheckBox = function(bar, checked, toolTip, onCheck) {
      bar.checkBox.checked = checked;
      bar.onCheckSection = onCheck;
      bar.checkBox.toolTip = toolTip;
      bar.toolTip = toolTip;
   };

   this.addTreeBox = function(pane, columns, onClicked) {
      var treeBox = new TreeBox(pane.parentControl);
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
         treeBoxRows = 4;
         setMaxHeight(
            this.displayPixelRatio * treeBoxRows * (font.lineSpacing + 6) +
            borderWidth
         );
         onNodeClicked = onClicked;
         adjustToContents();
      }

      return treeBox;
   };

   this.addNumericControl = function(pane, text, val, rmin, rmax, srmin, srmax, width, step, prec, onUpdate) {
      var numericControl = new NumericControl (pane.parentControl);
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

   this.addSpinBox = function(pane, val, min, max, onUpdate) {
      var spinBox = new SpinBox(pane.parentControl);
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

   { // Image group
      this.imageGroupBox = this.addGroupBox("Image");

      {
         this.imageViewPane = this.addHorizontalControlPane(this.imageGroupBox);

         this.imageViewList = this.addViewList(
            this.imageViewPane,
            null,
            function(view) {
               controller.imageViewOnViewSelected(view);
            }
         );
         this.imageViewListNull = this.imageViewList.currentView;
      }
   }

   { // Settings Group
      this.settingsSection = this.addGroupBox("Settings");
      {

         {
            this.grayPercentPane = this.addHorizontalControlPane(this.settingsSection);

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
            this.keepMasksOpenPane = this.addHorizontalControlPane(this.settingsSection);

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

         {
           this.maskControlPane = this.addHorizontalControlPane(this.settingsSection);
           {
              this.applyMaskPane = this.addHorizontalSizerPane(this.maskControlPane);
              this.applyMaskPane.addUnscaledSpacing(this.labelWidth);

              this.applyMaskPane.addSpacing(
                 this.applyMaskPane.spacing
              );

              this.applyMaskCheckBox = this.addCheckBox(
                 this.applyMaskPane,
                 "Apply mask",
                 model.applyMask,
                 "<p>If checked, then DSO mask or " +
                 "(if preview) star masks, range masks, etc. will be applied " +
                 "to source view.</p>",
                 function(checked) {
                    controller.applyMaskCheck(checked);
                 }
               );
           }

           {
              this.invertMaskPane = this.addHorizontalSizerPane(this.maskControlPane);

              this.invertMaskPane.addSpacing(
                 this.invertMaskPane.spacing
              );

              this.invertMaskCheckBox = this.addCheckBox(
                 this.invertMaskPane,
                 "Invert mask",
                 model.invertMask,
                 "<p>If checked, then DSO mask or " +
                 "(if preview) star masks, range masks, etc. will be, if applied " +
                 "inverted in the source view.</p>",
                 function(checked) {
                    controller.invertMaskCheck(checked);
                 }
               );
           }

           {
              this.hideMaskPane = this.addHorizontalSizerPane(this.maskControlPane);

              this.hideMaskPane.addSpacing(
                 this.hideMaskPane.spacing
              );

              this.hideMaskCheckBox = this.addCheckBox(
                 this.hideMaskPane,
                 "Hide mask",
                 model.hideMask,
                 "<p>If checked, then DSO mask or " +
                 "(if preview) star masks, range masks, etc. will be, if applied " +
                 "hidden in the source view.</p>",
                 function(checked) {
                    controller.hideMaskCheck(checked);
                 }
               );
           }

           this.maskControlPane.addStretch();
         }
      }
   }

   { // Range Selection Group
      this.rangeSelectionGroupBox = this.addSectionBar("Base Image Range Selection");

      this.rangeSelectionGroupBox.enableCheckBox();
      this.addSectionCheckBox(
            this.rangeSelectionGroupBox,
            model.useRangeSelectionForBase,
            "<p>If checked, a range mask created from RangeSelection will " +
            "be used for the base image of the mask.</p>" +
            "<p>If not checked, then the base image for the mask " +
            "will be created from the source image after stars are " +
            "removed using ATrousWaveletTransform.</p>",
            function(bar) {
               controller.useRangeSelectionForBaseCheck(bar);
            }
      );

      {
        var section = this.addSection(this.rangeSelectionGroupBox);

        {
          this.previewBaseRangeMaskCheckPane = this.addHorizontalControlPane(section);

          this.previewBaseRangeMaskCheckPane.addStretch();

          this.previewBaseRangeMaskCheckBox = this.addCheckBox(
             this.previewBaseRangeMaskCheckPane,
             "Preview",
             false,
             "<p>Preview base range mask.</p>",
             function(checked) {
                controller.previewBaseRangeMaskCheck(checked);
             }
          );
        }

         {
            this.rangeSelectionForBaseLowerLimitPane = this.addHorizontalControlPane(section);

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
            this.rangeSelectionForBaseUpperLimitPane = this.addHorizontalControlPane(section);

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
            this.rangeSelectionForBaseFuzzinessPane = this.addHorizontalControlPane(section);

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
            this.rangeSelectionForBaseSmoothnessPane = this.addHorizontalControlPane(section);

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
      section.adjustToContents();
      this.rangeSelectionGroupBox.setSection(section);
   }

   { // Star Mask Group
      this.starMaskGroupBox = this.addSectionBar("Star Mask");

      this.starMaskGroupBox.enableCheckBox();
      this.addSectionCheckBox(
            this.starMaskGroupBox,
            model.protectStars,
            "<p>Add star protection to final mask.</p>",
            function(bar) {
               controller.protectStarsCheck(bar);
            }
      );

      {
        var section = this.addSection(this.starMaskGroupBox);

        {
          this.previewStarMaskCheckPane = this.addHorizontalControlPane(section);

          this.previewStarMaskCheckPane.addStretch();

          this.previewStarMaskCheckBox = this.addCheckBox(
             this.previewStarMaskCheckPane,
             "Preview",
             false,
             "<p>Preview star mask.</p>",
             function(checked) {
                controller.previewStarMaskCheck(checked);
             }
          );

        }

         {
            this.useClassicStarMaskPane = this.addHorizontalControlPane(section);

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
            this.useHDRMPane = this.addHorizontalControlPane(section);

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
            this.starMaskThresholdPane = this.addHorizontalControlPane(section);

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
            this.starMaskScalePane = this.addHorizontalControlPane(section);
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
            this.smPane1 = this.addHorizontalControlPane(section);
            {
               this.starMaskLargeScalePane = this.addHorizontalSizerPane(this.smPane1);
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
            }

            {
               this.starMaskCompensationPane = this.addHorizontalSizerPane(this.smPane1);
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
            }
            this.smPane1.addStretch();
         }

         {
            this.smPane2 = this.addHorizontalControlPane(section);
            {
               this.starMaskSmallScalePane = this.addHorizontalSizerPane(this.smPane2);
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
            }

            {
               this.starMaskSmoothnessPane = this.addHorizontalSizerPane(this.smPane2);
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
            }
            this.smPane2.addStretch();
         }
      }
      section.adjustToContents();
      this.starMaskGroupBox.setSection(section);
   }

   { // Large Stars Group
      this.largeStarsGroupBox = this.addSectionBar("Large Star Mask");

      this.largeStarsGroupBox.enableCheckBox();
      this.addSectionCheckBox(
            this.largeStarsGroupBox,
            model.useRangeSelectionsForLargeStars,
            "<p>Use (up to 3) successive range masks to isolate large stars.</p>",
            function(bar) {
               controller.useRangeSelectionsForLargeStarsCheck(bar);
            }
      );

      {
        var section = this.addSection(this.largeStarsGroupBox);

        {
          this.previewLargeStarsMaskCheckPane = this.addHorizontalControlPane(section);

          this.previewLargeStarsMaskCheckPane.addStretch();

          this.previewLargeStarsMaskCheckBox = this.addCheckBox(
             this.previewLargeStarsMaskCheckPane,
             "Preview",
             false,
             "<p>Preview large star mask.</p>",
             function(checked) {
                controller.previewLargeStarsMaskCheck(checked);
             }
          );
        }

         {
            this.rangeSelectionsPane = this.addHorizontalControlPane(section);

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

         {
            this.rangeSelectionLowerLimitPane = this.addHorizontalControlPane(section);

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
            this.rangeSelectionUpperLimitPane = this.addHorizontalControlPane(section);

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
            this.rangeSelectionFuzzinessPane = this.addHorizontalControlPane(section);

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
            this.rangeSelectionSmoothnessPane = this.addHorizontalControlPane(section);

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
      section.adjustToContents();
      this.largeStarsGroupBox.setSection(section);
   }

   this.sizer.addStretch();

   {  // Buttons
      this.buttonPane = this.addHorizontalControlPane(this);

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

   this.windowTitle = TITLE + " v" + VERSION;

   this.adjustToContents();
   this.setFixedWidth(this.width + this.logicalPixelsToPhysical(20));
   this.setFixedHeight(this.height + this.logicalPixelsToPhysical(20));
}

MainView.prototype = new Dialog;
