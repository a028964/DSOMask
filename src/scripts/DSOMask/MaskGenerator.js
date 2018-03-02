
function MaskGenerator(model, view) {


   // Utility function for creating a name that is unique.
   this.getNewName = function (name, suffix)
   {
      var newName = name + suffix;
      let n = 1;
      while (!ImageWindow.windowById(newName).isNull)
      {
         ++n;
         newName = name + suffix + n;
      }
      return newName;
   };

   this.getSourceView = function() {
      this.sourceView = new ImageWindow(model.imageView.image.width,
                                   model.imageView.image.height,
                                   model.imageView.image.numberOfChannels,
                                   model.imageView.window.bitsPerSample,
                                   model.imageView.window.isFloatSample,
                                   model.imageView.image.colorSpace != ColorSpace_Gray,
                                   this.getNewName("DSOM_SourceView",""));
      this.sourceView.mainView.beginProcess(UndoFlag_NoSwapFile);
      this.sourceView.mainView.image.apply( model.imageView.image );
      this.sourceView.mainView.endProcess();
      this.sourceView.zoomFactor=12;
      this.sourceView.fitWindow();
      this.sourceView.zoomToOptimalFit();

      if(this.sourceView.mainView.image.colorSpace != ColorSpace_Gray) {
         var toGray = new ConvertToGrayscale;
         this.sourceView.mainView.beginProcess(UndoFlag_NoSwapFile);
         toGray.executeOn(this.sourceView.mainView);
         this.sourceView.mainView.endProcess();
      }
   };

   this.previewBaseRangeMask = function() {
      var P = new RangeSelection;
      with (P)
      {
         lowRange = model.rangeSelectionForBaseLowerLimit;
         highRange = model.rangeSelectionForBaseUpperLimit;
         fuzziness = model.rangeSelectionForBaseFuzziness;
         smoothness = model.rangeSelectionForBaseSmoothness;
         screening = false;
         toLightness = true;
         invert = false;
      }
      P.executeOn(model.imageView,false);
      model.maskPreview = ImageWindow.activeWindow;
      model.maskPreview.mainView.id = this.getNewName("DSOM_DSO_Previev","");
      model.maskPreview.zoomFactor=12;
      model.maskPreview.fitWindow();
      model.maskPreview.zoomToOptimalFit();
      model.beingPreviewed = model.BASE;
      if ( model.applyMask ) {
        model.imageWindow.setMask(model.maskPreview);
        model.imageWindow.maskVisible = model.hideMask == true ? false : true;
        model.imageWindow.maskInverted = model.invertMask;
        model.imageWindow.bringToFront();
      }
      else {
        model.maskPreview.bringToFront();
      }
   }

   this.previewStarMask = function() {
      this.getSourceView();
      if ( model.useClassicStarMask )
      {
         this.createClassicStarMask();
      }
      else
      {
         this.createStarMask();
      }
      model.maskPreview  = new ImageWindow(this.starMaskView.mainView.image.width,
                                   this.starMaskView.mainView.image.height,
                                   this.starMaskView.mainView.image.numberOfChannels,
                                   this.starMaskView.mainView.window.bitsPerSample,
                                   this.starMaskView.mainView.window.isFloatSample,
                                   this.starMaskView.mainView.image.colorSpace != ColorSpace_Gray,
                                   this.getNewName("DSOM_STARS_Preview",""));
      model.maskPreview.mainView.beginProcess(UndoFlag_NoSwapFile);
      model.maskPreview.mainView.image.apply( this.starMaskView.mainView.image );
      model.maskPreview.mainView.endProcess();
      model.maskPreview.zoomFactor=12;
      model.maskPreview.fitWindow();
      model.maskPreview.zoomToOptimalFit();
      model.maskPreview.show();
      this.starMaskView.forceClose();
      this.sourceView.forceClose();
      model.beingPreviewed = model.STARS;
      if ( model.applyMask ) {
        model.imageWindow.setMask(model.maskPreview);
        model.imageWindow.maskVisible = model.hideMask == true ? false : true;
        model.imageWindow.maskInverted = model.invertMask;
        model.imageWindow.bringToFront();
      }
      else {
        model.maskPreview.bringToFront();
      }
   }

   this.previewLargeStarRangeMask = function() {
      for (var i = 0; i < model.totalRangeSelections; i++ ) {
         if ( model.rangeSelectionsUsed[i] ) {
            var P = new RangeSelection;
            with (P)
            {
               lowRange = model.rangeSelectionLowerLimits[i];
               highRange = model.rangeSelectionUpperLimits[i];
               fuzziness = model.rangeSelectionFuzziness[i];
               smoothness = model.rangeSelectionSmoothness[i];
               screening = false;
               toLightness = true;
               invert = false;
            }
            if ( model.maskPreview == null ) {
               P.executeOn(model.imageView,false);
            }
            else
            {
               P.executeOn(model.maskPreview.mainView,false);
               if ( ! model.keepMasksOpen ) {
                  model.maskPreview.forceClose();
               }
            }
            model.maskPreview = ImageWindow.activeWindow;
            model.maskPreview.mainView.id = this.getNewName("DSOM_LSTARS_Previev",i.toString());
            model.maskPreview.zoomFactor=12;
            model.maskPreview.fitWindow();
            model.maskPreview.zoomToOptimalFit();
            model.maskPreview.hide();
         }
      }
      model.maskPreview.show();
      model.beingPreviewed = model.LSTARS;
      if ( model.applyMask ) {
        model.imageWindow.setMask(model.maskPreview);
        model.imageWindow.maskVisible = model.hideMask == true ? false : true;
        model.imageWindow.maskInverted = model.invertMask;
        model.imageWindow.bringToFront();
      }
      else {
        model.maskPreview.bringToFront();
      }

   }

   this.createClassicStarMask = function() {
      this.starMaskView= new ImageWindow( this.sourceView.mainView.image.width,
                                    this.sourceView.mainView.image.height,
                                    this.sourceView.mainView.image.numberOfChannels,
                                    this.sourceView.mainView.window.bitsPerSample,
                                    this.sourceView.mainView.window.isFloatSample,
                                    this.sourceView.mainView.image.colorSpace != ColorSpace_Gray,
                                    this.getNewName("DSOM_STARS","") );
      this.starMaskView.mainView.beginProcess(UndoFlag_NoSwapFile);
      this.starMaskView.mainView.image.assign( this.sourceView.mainView.image );
      this.starMaskView.mainView.endProcess();
      this.starMaskView.zoomFactor=12;
      this.starMaskView.fitWindow();
      this.starMaskView.zoomToOptimalFit();

      this.auxMaskView= new ImageWindow( this.sourceView.mainView.image.width,
                                       this.sourceView.mainView.image.height,
                                       this.sourceView.mainView.image.numberOfChannels,
                                       this.sourceView.mainView.window.bitsPerSample,
                                       this.sourceView.mainView.window.isFloatSample,
                                       this.sourceView.mainView.image.colorSpace != ColorSpace_Gray,
                                       this.getNewName("DSOM_AuxMaskView","") );
      this.auxMaskView.mainView.beginProcess(UndoFlag_NoSwapFile);
      this.auxMaskView.mainView.image.assign( this.sourceView.mainView.image );
      this.auxMaskView.mainView.endProcess();
      this.auxMaskView.zoomFactor=12;
      this.auxMaskView.fitWindow();
      this.auxMaskView.zoomToOptimalFit();

      var hdrmt = new HDRMultiscaleTransform;
      with (hdrmt)
      {
         numberOfLayers = 2;
         numberOfIterations = 1;
         invertedIterations = true;
         overdrive = 0.000;
         medianTransform = false;
         scalingFunctionData = [
            0.003906,0.015625,0.023438,0.015625,0.003906,
            0.015625,0.0625,0.09375,0.0625,0.015625,
            0.023438,0.09375,0.140625,0.09375,0.023438,
            0.015625,0.0625,0.09375,0.0625,0.015625,
            0.003906,0.015625,0.023438,0.015625,0.003906
         ];
         scalingFunctionRowFilter = [
            0.0625,0.25,
            0.375,0.25,
            0.0625
         ];
         scalingFunctionColFilter = [
            0.0625,0.25,
            0.375,0.25,
            0.0625
         ];
         scalingFunctionName = "B3 Spline (5)";
         deringing = false;
         smallScaleDeringing = 0.000;
         largeScaleDeringing = 0.250;
         outputDeringingMaps = false;
         midtonesBalanceMode = HDRMultiscaleTransform.prototype.Automatic;
         midtonesBalance = 0.500000;
         toLightness = true;
         preserveHue = false;
         luminanceMask = false;
      }
      this.starMaskView.mainView.beginProcess(UndoFlag_NoSwapFile);
      hdrmt.executeOn(this.starMaskView.mainView);
      this.starMaskView.mainView.endProcess();

      var atwt = new ATrousWaveletTransform;
      with (atwt)
      {
         layers = [ // enabled, biasEnabled, bias, noiseReductionEnabled, noiseReductionThreshold, noiseReductionAmount, noiseReductionIterations
            [true, true, 0.000, false, 3.000, 0.50, 1],
            [true, true, 0.000, false, 3.000, 0.50, 1],
            [true, true, 0.000, false, 3.000, 0.50, 1],
            [true, true, 0.000, false, 3.000, 0.50, 1],
            [true, true, 0.000, false, 3.000, 0.50, 1],
            [true, true, 0.000, false, 3.000, 0.50, 1],
            [false, true, 0.000, false, 3.000, 0.50, 1],
            [false, true, 0.000, false, 3.000, 0.50, 1],
            [false, true, 0.000, false, 3.000, 0.50, 1]
         ];
         scaleDelta = 0;
         scalingFunctionData = [
            0.25,0.5,0.25,
            0.5,1,0.5,
            0.25,0.5,0.25
         ];
         scalingFunctionRowFilter = [
            0.5,
            1,
            0.5
         ];
         scalingFunctionColFilter = [
            0.5,
            1,
            0.5
         ];
         scalingFunctionNoiseSigma = [
            0.8003,0.2729,0.1198,
            0.0578,0.0287,0.0143,
            0.0072,0.0036,0.0019,
            0.001
         ];
         scalingFunctionName = "Linear Interpolation (3)";
         largeScaleFunction = ATrousWaveletTransform.prototype.NoFunction;
         curveBreakPoint = 0.75;
         noiseThresholding = false;
         noiseThresholdingAmount = 1.00;
         noiseThreshold = 3.00;
         softThresholding = true;
         useMultiresolutionSupport = false;
         deringing = false;
         deringingDark = 0.1000;
         deringingBright = 0.0000;
         outputDeringingMaps = false;
         lowRange = 0.0000;
         highRange = 0.0000;
         previewMode = ATrousWaveletTransform.prototype.Disabled;
         previewLayer = 0;
         toLuminance = true;
         toChrominance = true;
         linear = false;
      }
      this.starMaskView.mainView.beginProcess(UndoFlag_NoSwapFile);
      atwt.executeOn(this.starMaskView.mainView);
      this.starMaskView.mainView.endProcess();

      var curves = new CurvesTransformation;
      with (curves)
      {
         R = [ // x, y
            [0.00000, 0.00000],
            [1.00000, 1.00000]
         ];
         Rt = CurvesTransformation.prototype.AkimaSubsplines;
         G = [ // x, y
            [0.00000, 0.00000],
            [1.00000, 1.00000]
         ];
         Gt = CurvesTransformation.prototype.AkimaSubsplines;
         B = [ // x, y
            [0.00000, 0.00000],
            [1.00000, 1.00000]
         ];
         Bt = CurvesTransformation.prototype.AkimaSubsplines;
         K = [ // x, y
            [0.00000, 0.00000],
            [0.28293, 0.18780],
            [0.46098, 0.64146],
            [1.00000, 1.00000]
         ];
         Kt = CurvesTransformation.prototype.AkimaSubsplines;
         A = [ // x, y
            [0.00000, 0.00000],
            [1.00000, 1.00000]
         ];
         At = CurvesTransformation.prototype.AkimaSubsplines;
         L = [ // x, y
            [0.00000, 0.00000],
            [1.00000, 1.00000]
         ];
         Lt = CurvesTransformation.prototype.AkimaSubsplines;
         a = [ // x, y
            [0.00000, 0.00000],
            [1.00000, 1.00000]
         ];
         at = CurvesTransformation.prototype.AkimaSubsplines;
         b = [ // x, y
            [0.00000, 0.00000],
            [1.00000, 1.00000]
         ];
         bt = CurvesTransformation.prototype.AkimaSubsplines;
         c = [ // x, y
            [0.00000, 0.00000],
            [1.00000, 1.00000]
         ];
         ct = CurvesTransformation.prototype.AkimaSubsplines;
         H = [ // x, y
            [0.00000, 0.00000],
            [1.00000, 1.00000]
         ];
         Ht = CurvesTransformation.prototype.AkimaSubsplines;
         S = [ // x, y
            [0.00000, 0.00000],
            [1.00000, 1.00000]
         ];
         St = CurvesTransformation.prototype.AkimaSubsplines;
      }
      this.starMaskView.mainView.beginProcess(UndoFlag_NoSwapFile);
      curves.executeOn(this.starMaskView.mainView);
      this.starMaskView.mainView.endProcess();

      hdrmt = new HDRMultiscaleTransform;
      with (hdrmt)
      {
         numberOfLayers = 2;
         numberOfIterations = 1;
         invertedIterations = true;
         overdrive = 0.000;
         medianTransform = false;
         scalingFunctionData = [
            0.003906,0.015625,0.023438,0.015625,0.003906,
            0.015625,0.0625,0.09375,0.0625,0.015625,
            0.023438,0.09375,0.140625,0.09375,0.023438,
            0.015625,0.0625,0.09375,0.0625,0.015625,
            0.003906,0.015625,0.023438,0.015625,0.003906
         ];
         scalingFunctionRowFilter = [
            0.0625,0.25,
            0.375,0.25,
            0.0625
         ];
         scalingFunctionColFilter = [
            0.0625,0.25,
            0.375,0.25,
            0.0625
         ];
         scalingFunctionName = "B3 Spline (5)";
         deringing = false;
         smallScaleDeringing = 0.000;
         largeScaleDeringing = 0.250;
         outputDeringingMaps = false;
         midtonesBalanceMode = HDRMultiscaleTransform.prototype.Automatic;
         midtonesBalance = 0.500000;
         toLightness = true;
         preserveHue = false;
         luminanceMask = false;
      }
      this.auxMaskView.mainView.beginProcess(UndoFlag_NoSwapFile);
      hdrmt.executeOn(this.auxMaskView.mainView);
      this.auxMaskView.mainView.endProcess();

      atwt = new ATrousWaveletTransform;
      with (atwt)
      {
         layers = [ // enabled, biasEnabled, bias, noiseReductionEnabled, noiseReductionThreshold, noiseReductionAmount, noiseReductionIterations
            [true, true, 0.000, false, 3.000, 0.50, 1],
            [true, true, 0.000, false, 3.000, 0.50, 1],
            [true, true, 0.000, false, 3.000, 0.50, 1],
            [false, true, 0.000, false, 3.000, 0.50, 1],
            [false, true, 0.000, false, 3.000, 0.50, 1]
         ];
         scaleDelta = 0;
         scalingFunctionData = [
            0.25,0.5,0.25,
            0.5,1,0.5,
            0.25,0.5,0.25
         ];
         scalingFunctionRowFilter = [
            0.5,
            1,
            0.5
         ];
         scalingFunctionColFilter = [
            0.5,
            1,
            0.5
         ];
         scalingFunctionNoiseSigma = [
            0.8003,0.2729,0.1198,
            0.0578,0.0287,0.0143,
            0.0072,0.0036,0.0019,
            0.001
         ];
         scalingFunctionName = "Linear Interpolation (3)";
         largeScaleFunction = ATrousWaveletTransform.prototype.NoFunction;
         curveBreakPoint = 0.75;
         noiseThresholding = false;
         noiseThresholdingAmount = 1.00;
         noiseThreshold = 3.00;
         softThresholding = true;
         useMultiresolutionSupport = false;
         deringing = false;
         deringingDark = 0.1000;
         deringingBright = 0.0000;
         outputDeringingMaps = false;
         lowRange = 0.0000;
         highRange = 0.0000;
         previewMode = ATrousWaveletTransform.prototype.Disabled;
         previewLayer = 0;
         toLuminance = true;
         toChrominance = true;
         linear = false;
      }
      this.auxMaskView.mainView.beginProcess(UndoFlag_NoSwapFile);
      atwt.executeOn(this.auxMaskView.mainView);
      this.auxMaskView.mainView.endProcess();

      curves = new CurvesTransformation;
      with (curves)
      {
         R = [ // x, y
            [0.00000, 0.00000],
            [1.00000, 1.00000]
         ];
         Rt = CurvesTransformation.prototype.AkimaSubsplines;
         G = [ // x, y
            [0.00000, 0.00000],
            [1.00000, 1.00000]
         ];
         Gt = CurvesTransformation.prototype.AkimaSubsplines;
         B = [ // x, y
            [0.00000, 0.00000],
            [1.00000, 1.00000]
         ];
         Bt = CurvesTransformation.prototype.AkimaSubsplines;
         K = [ // x, y
            [0.00000, 0.00000],
            [0.37805, 0.65854],
            [1.00000, 1.00000]
         ];
         Kt = CurvesTransformation.prototype.AkimaSubsplines;
         A = [ // x, y
            [0.00000, 0.00000],
            [1.00000, 1.00000]
         ];
         At = CurvesTransformation.prototype.AkimaSubsplines;
         L = [ // x, y
            [0.00000, 0.00000],
            [1.00000, 1.00000]
         ];
         Lt = CurvesTransformation.prototype.AkimaSubsplines;
         a = [ // x, y
            [0.00000, 0.00000],
            [1.00000, 1.00000]
         ];
         at = CurvesTransformation.prototype.AkimaSubsplines;
         b = [ // x, y
            [0.00000, 0.00000],
            [1.00000, 1.00000]
         ];
         bt = CurvesTransformation.prototype.AkimaSubsplines;
         c = [ // x, y
            [0.00000, 0.00000],
            [1.00000, 1.00000]
         ];
         ct = CurvesTransformation.prototype.AkimaSubsplines;
         H = [ // x, y
            [0.00000, 0.00000],
            [1.00000, 1.00000]
         ];
         Ht = CurvesTransformation.prototype.AkimaSubsplines;
         S = [ // x, y
            [0.00000, 0.00000],
            [1.00000, 1.00000]
         ];
         St = CurvesTransformation.prototype.AkimaSubsplines;
      }
      this.auxMaskView.mainView.beginProcess(UndoFlag_NoSwapFile);
      curves.executeOn(this.auxMaskView.mainView);
      this.auxMaskView.mainView.endProcess();

      var ht = new HistogramTransformation;
      with (ht)
      {
         H = [ // c0, m, c1, r0, r1
            [0.00000000, 0.50000000, 1.00000000, 0.00000000, 1.00000000],
            [0.00000000, 0.50000000, 1.00000000, 0.00000000, 1.00000000],
            [0.00000000, 0.50000000, 1.00000000, 0.00000000, 1.00000000],
            [0.06329114, 0.50000000, 1.00000000, 0.00000000, 1.00000000],
            [0.00000000, 0.50000000, 1.00000000, 0.00000000, 1.00000000]
         ];
      }
      this.auxMaskView.mainView.beginProcess(UndoFlag_NoSwapFile);
      ht.executeOn(this.auxMaskView.mainView);
      this.auxMaskView.mainView.endProcess();

      var PM = new PixelMath;
      with (PM)
      {
         var exp = this.starMaskView.mainView.id + "*0.8+" + this.auxMaskView.mainView.id + "*0.8";
         expression = exp;
         expression1 = "";
         expression2 = "";
         expression3 = "";
         useSingleExpression = true;
         symbols = "";
         use64BitWorkingImage = false;
         rescale = false;
         rescaleLower = 0.0000000000;
         rescaleUpper = 1.0000000000;
         truncate = true;
         truncateLower = 0.0000000000;
         truncateUpper = 1.0000000000;
         createNewImage = false;
         newImageId = "";
         newImageWidth = 0;
         newImageHeight = 0;
         newImageAlpha = false;
         newImageColorSpace = PixelMath.prototype.SameAsTarget;
         newImageSampleFormat = PixelMath.prototype.SameAsTarget;
      }
      this.starMaskView.mainView.beginProcess(UndoFlag_NoSwapFile);
      PM.executeOn(this.starMaskView.mainView);
      this.starMaskView.mainView.endProcess();

      var wavelets = new ATrousWaveletTransform;
      with (wavelets)
      {
         layers = [ // enabled, biasEnabled, bias, noiseReductionEnabled, noiseReductionThreshold, noiseReductionAmount, noiseReductionIterations
            [false, true, 0.000, false, 3.000, 0.50, 1],
            [false, true, 0.000, false, 3.000, 0.50, 1],
            [true, true, 0.000, false, 3.000, 0.50, 1],
            [true, true, 0.000, false, 3.000, 0.50, 1],
            [true, true, 0.000, false, 3.000, 0.50, 1],
            [true, true, 0.000, false, 3.000, 0.50, 1],
            [true, true, 0.000, false, 3.000, 0.50, 1],
            [true, true, 0.000, false, 3.000, 0.50, 1],
            [true, true, 0.000, false, 3.000, 0.50, 1]
         ];
         scaleDelta = 0;
         scalingFunctionData = [
            0.25,0.5,0.25,
            0.5,1,0.5,
            0.25,0.5,0.25
         ];
         scalingFunctionRowFilter = [
            0.5,
            1,
            0.5
         ];
         scalingFunctionColFilter = [
            0.5,
            1,
            0.5
         ];
         scalingFunctionNoiseSigma = [
            0.8003,0.2729,0.1198,
            0.0578,0.0287,0.0143,
            0.0072,0.0036,0.0019,
            0.001
         ];
         scalingFunctionName = "Linear Interpolation (3)";
         largeScaleFunction = ATrousWaveletTransform.prototype.NoFunction;
         curveBreakPoint = 0.75;
         noiseThresholding = false;
         noiseThresholdingAmount = 1.00;
         noiseThreshold = 3.00;
         softThresholding = true;
         useMultiresolutionSupport = false;
         deringing = false;
         deringingDark = 0.1000;
         deringingBright = 0.0000;
         outputDeringingMaps = false;
         lowRange = 0.0000;
         highRange = 0.0000;
         previewMode = ATrousWaveletTransform.prototype.Disabled;
         previewLayer = 0;
         toLuminance = true;
         toChrominance = true;
         linear = false;
      }
      this.starMaskView.mainView.beginProcess(UndoFlag_NoSwapFile);
      wavelets.executeOn(this.starMaskView.mainView);
      this.starMaskView.mainView.endProcess();

      var wavelets = new ATrousWaveletTransform;
      with (wavelets)
      {
         layers = [ // enabled, biasEnabled, bias, noiseReductionEnabled, noiseReductionThreshold, noiseReductionAmount, noiseReductionIterations
            [true, true, 0.400, false, 3.000, 0.50, 1],
            [true, true, 0.000, false, 3.000, 0.50, 1],
            [true, true, 0.000, false, 3.000, 0.50, 1],
            [true, true, 0.000, false, 3.000, 0.50, 1],
            [true, true, 0.000, false, 3.000, 0.50, 1]
         ];
         scaleDelta = 0;
         scalingFunctionData = [
            0.25,0.5,0.25,
            0.5,1,0.5,
            0.25,0.5,0.25
         ];
         scalingFunctionRowFilter = [
            0.5,
            1,
            0.5
         ];
         scalingFunctionColFilter = [
            0.5,
            1,
            0.5
         ];
         scalingFunctionNoiseSigma = [
            0.8003,0.2729,0.1198,
            0.0578,0.0287,0.0143,
            0.0072,0.0036,0.0019,
            0.001
         ];
         scalingFunctionName = "Linear Interpolation (3)";
         largeScaleFunction = ATrousWaveletTransform.prototype.NoFunction;
         curveBreakPoint = 0.75;
         noiseThresholding = false;
         noiseThresholdingAmount = 1.00;
         noiseThreshold = 3.00;
         softThresholding = true;
         useMultiresolutionSupport = false;
         deringing = false;
         deringingDark = 0.1000;
         deringingBright = 0.0000;
         outputDeringingMaps = false;
         lowRange = 0.0000;
         highRange = 0.0000;
         previewMode = ATrousWaveletTransform.prototype.Disabled;
         previewLayer = 0;
         toLuminance = true;
         toChrominance = true;
         linear = false;
      }
      this.starMaskView.mainView.beginProcess(UndoFlag_NoSwapFile);
      wavelets.executeOn(this.starMaskView.mainView);
      this.starMaskView.mainView.endProcess();

      var MT = new MorphologicalTransformation;
      with (MT)
      {
         operator = MorphologicalTransformation.prototype.Dilation;
         interlacingDistance = 1;
         lowThreshold = 0.000000;
         highThreshold = 0.000000;
         numberOfIterations = 1;
         amount = 0.15;
         selectionPoint = 0.50;
         structureName = "";
         structureSize = 3;
         structureWayTable = [ // mask
            [[
               0x01,0x01,0x01,
               0x01,0x01,0x01,
               0x01,0x01,0x01
            ]]
         ];
      }
      this.starMaskView.mainView.beginProcess(UndoFlag_NoSwapFile);
      MT.executeOn(this.starMaskView.mainView);
      this.starMaskView.mainView.endProcess();

      this.starMaskView.mainView.beginProcess(UndoFlag_NoSwapFile);
      MT.executeOn(this.starMaskView.mainView);
      this.starMaskView.mainView.endProcess();

      var curves = new CurvesTransformation;
      with (curves)
      {
         R = [ // x, y
            [0.00000, 0.00000],
            [1.00000, 1.00000]
         ];
         Rt = CurvesTransformation.prototype.AkimaSubsplines;
         G = [ // x, y
            [0.00000, 0.00000],
            [1.00000, 1.00000]
         ];
         Gt = CurvesTransformation.prototype.AkimaSubsplines;
         B = [ // x, y
            [0.00000, 0.00000],
            [1.00000, 1.00000]
         ];
         Bt = CurvesTransformation.prototype.AkimaSubsplines;
         K = [ // x, y
            [0.00000, 0.00000],
            [0.37805, 0.65854],
            [1.00000, 1.00000]
         ];
         Kt = CurvesTransformation.prototype.AkimaSubsplines;
         L = [ // x, y
            [0.00000, 0.00000],
            [1.00000, 1.00000]
         ];
         Lt = CurvesTransformation.prototype.AkimaSubsplines;
         a = [ // x, y
            [0.00000, 0.00000],
            [1.00000, 1.00000]
         ];
         at = CurvesTransformation.prototype.AkimaSubsplines;
         b = [ // x, y
            [0.00000, 0.00000],
            [1.00000, 1.00000]
         ];
         bt = CurvesTransformation.prototype.AkimaSubsplines;
         c = [ // x, y
            [0.00000, 0.00000],
            [1.00000, 1.00000]
         ];
         ct = CurvesTransformation.prototype.AkimaSubsplines;
         H = [ // x, y
            [0.00000, 0.00000],
            [1.00000, 1.00000]
         ];
         Ht = CurvesTransformation.prototype.AkimaSubsplines;
         S = [ // x, y
            [0.00000, 0.00000],
            [1.00000, 1.00000]
         ];
         St = CurvesTransformation.prototype.AkimaSubsplines;
      }
      this.auxMaskView.mainView.beginProcess(UndoFlag_NoSwapFile);
      curves.executeOn(this.auxMaskView.mainView);
      this.auxMaskView.mainView.endProcess();

      var wavelets = new ATrousWaveletTransform;
      with (wavelets)
      {
         layers = [ // enabled, biasEnabled, bias, noiseReductionEnabled, noiseReductionThreshold, noiseReductionAmount, noiseReductionIterations
            [false, true, 0.000, false, 3.000, 0.50, 1],
            [true, true, 0.000, false, 3.000, 0.50, 1],
            [true, true, 0.000, false, 3.000, 0.50, 1],
            [true, true, 0.000, false, 3.000, 0.50, 1],
            [true, true, 0.000, false, 3.000, 0.50, 1]
         ];
         scaleDelta = 0;
         scalingFunctionData = [
            0.25,0.5,0.25,
            0.5,1,0.5,
            0.25,0.5,0.25
         ];
         scalingFunctionRowFilter = [
            0.5,
            1,
            0.5
         ];
         scalingFunctionColFilter = [
            0.5,
            1,
            0.5
         ];
         scalingFunctionNoiseSigma = [
            0.8003,0.2729,0.1198,
            0.0578,0.0287,0.0143,
            0.0072,0.0036,0.0019,
            0.001
         ];
         scalingFunctionName = "Linear Interpolation (3)";
         largeScaleFunction = ATrousWaveletTransform.prototype.NoFunction;
         curveBreakPoint = 0.75;
         noiseThresholding = false;
         noiseThresholdingAmount = 1.00;
         noiseThreshold = 3.00;
         softThresholding = true;
         useMultiresolutionSupport = false;
         deringing = false;
         deringingDark = 0.1000;
         deringingBright = 0.0000;
         outputDeringingMaps = false;
         lowRange = 0.0000;
         highRange = 0.0000;
         previewMode = ATrousWaveletTransform.prototype.Disabled;
         previewLayer = 0;
         toLuminance = true;
         toChrominance = true;
         linear = false;
      }
      this.auxMaskView.mainView.beginProcess(UndoFlag_NoSwapFile);
      wavelets.executeOn(this.auxMaskView.mainView);
      this.auxMaskView.mainView.endProcess();

      this.starMaskView.maskVisible = false;
      this.starMaskView.maskInverted = false;
      this.starMaskView.mask = this.auxMaskView;

      var curves = new CurvesTransformation;
      with (curves)
      {
         R = [ // x, y
            [0.00000, 0.00000],
            [1.00000, 1.00000]
         ];
         Rt = CurvesTransformation.prototype.AkimaSubsplines;
         G = [ // x, y
            [0.00000, 0.00000],
            [1.00000, 1.00000]
         ];
         Gt = CurvesTransformation.prototype.AkimaSubsplines;
         B = [ // x, y
            [0.00000, 0.00000],
            [1.00000, 1.00000]
         ];
         Bt = CurvesTransformation.prototype.AkimaSubsplines;
         K = [ // x, y
            [0.00000, 0.00000],
            [0.04878, 0.31220],
            [0.27073, 0.60732],
            [0.52927, 0.65854],
            [1.00000, 1.00000]
         ];
         Kt = CurvesTransformation.prototype.AkimaSubsplines;
         L = [ // x, y
            [0.00000, 0.00000],
            [1.00000, 1.00000]
         ];
         Lt = CurvesTransformation.prototype.AkimaSubsplines;
         a = [ // x, y
            [0.00000, 0.00000],
            [1.00000, 1.00000]
         ];
         at = CurvesTransformation.prototype.AkimaSubsplines;
         b = [ // x, y
            [0.00000, 0.00000],
            [1.00000, 1.00000]
         ];
         bt = CurvesTransformation.prototype.AkimaSubsplines;
         c = [ // x, y
            [0.00000, 0.00000],
            [1.00000, 1.00000]
         ];
         ct = CurvesTransformation.prototype.AkimaSubsplines;
         H = [ // x, y
            [0.00000, 0.00000],
            [1.00000, 1.00000]
         ];
         Ht = CurvesTransformation.prototype.AkimaSubsplines;
         S = [ // x, y
            [0.00000, 0.00000],
            [1.00000, 1.00000]
         ];
         St = CurvesTransformation.prototype.AkimaSubsplines;
      }
      this.starMaskView.mainView.beginProcess(UndoFlag_NoSwapFile);
      curves.executeOn(this.starMaskView.mainView);
      this.starMaskView.mainView.endProcess();
      this.starMaskView.removeMask();

      this.auxMaskView.forceClose();
   };

   this.createStarMask = function() {
      this.auxView= new ImageWindow( this.sourceView.mainView.image.width,
                                 this.sourceView.mainView.image.height,
                                 this.sourceView.mainView.image.numberOfChannels,
                                 this.sourceView.mainView.window.bitsPerSample,
                                 this.sourceView.mainView.window.isFloatSample,
                                 this.sourceView.mainView.image.colorSpace != ColorSpace_Gray,
                                 this.getNewName("DSOM_AuxView","") );
      this.auxView.mainView.beginProcess(UndoFlag_NoSwapFile);
      this.auxView.mainView.image.assign( this.sourceView.mainView.image );
      this.auxView.mainView.endProcess();
      this.auxView.zoomFactor=12;
      this.auxView.fitWindow();
      this.auxView.zoomToOptimalFit();

      if (model.useHDRMForStarMask)
      {
         // *****************************************
         // Dim Brighter Areas Of Image
         // *****************************************
         var hdrmt = new HDRMultiscaleTransform;
         with ( hdrmt ) {
            numberOfLayers = 3;
            numberOfIterations = 1;
            invertedIterations = true;
            overdrive = 0.000;
            medianTransform = false;
            scalingFunctionData = [
               0.003906,0.015625,0.023438,0.015625,0.003906,
               0.015625,0.0625,0.09375,0.0625,0.015625,
               0.023438,0.09375,0.140625,0.09375,0.023438,
               0.015625,0.0625,0.09375,0.0625,0.015625,
               0.003906,0.015625,0.023438,0.015625,0.003906
            ];
            scalingFunctionRowFilter = [
               0.0625,0.25,
               0.375,0.25,
               0.0625
            ];
            scalingFunctionColFilter = [
               0.0625,0.25,
               0.375,0.25,
               0.0625
            ];
            scalingFunctionName = "B3 Spline (5)";
            deringing = false;
            smallScaleDeringing = 0.000;
            largeScaleDeringing = 0.250;
            outputDeringingMaps = false;
            midtonesBalanceMode = HDRMultiscaleTransform.prototype.Automatic;
            midtonesBalance = 0.500000;
            toLightness = false;
            preserveHue = false;
            luminanceMask = false;
         }
         hdrmt.executeOn(this.auxView.mainView,false);
      }

      var starMask = new StarMask;
      with (starMask)
      {
         shadowsClipping = 0.00000;
         midtonesBalance = 0.50000;
         highlightsClipping = 1.00000;
         waveletLayers = 5;
         structureContours = false;
         noiseThreshold = model.starMaskThreshold;
         aggregateStructures = false;
         binarizeStructures = false;
         largeScaleGrowth = model.starMaskLargeScale;
         smallScaleGrowth = model.starMaskSmallScale;
         growthCompensation = model.starMaskCompensation;
         smoothness = model.starMaskSmoothness;
         invert = false;
         truncation = 1.00000;
         limit = 1.00000;
         mode = StarMask;
      }
      starMask.executeOn(this.auxView.mainView,false);

      this.starMaskView = ImageWindow.activeWindow;
      this.starMaskView.mainView.id = this.getNewName("DSOM_STAR","");
      this.starMaskView.hide();
      this.starMaskView.zoomFactor=12;
      this.starMaskView.fitWindow();
      this.starMaskView.zoomToOptimalFit();
      this.starMaskView.hide();

      this.auxView.forceClose();
   };

   this.createLargeStarMask = function() {

      var rangeView = null;

      for (var i = 0; i < model.totalRangeSelections; i++ ) {
         if ( model.rangeSelectionsUsed[i] ) {
            var P = new RangeSelection;
            with (P)
            {
               lowRange = model.rangeSelectionLowerLimits[i];
               highRange = model.rangeSelectionUpperLimits[i];
               fuzziness = model.rangeSelectionFuzziness[i];
               smoothness = model.rangeSelectionSmoothness[i];
               screening = false;
               toLightness = true;
               invert = false;
            }
            if ( rangeView == null ) {
               P.executeOn(this.sourceView.mainView,false);
            }
            else
            {
               P.executeOn(rangeView.mainView,false);
               if ( ! model.keepMasksOpen ) {
                  rangeView.forceClose();
               }
            }
            rangeView = ImageWindow.activeWindow;
            rangeView.mainView.id = this.getNewName("DSOM_LSTARS",i.toString());
            rangeView.hide();
            rangeView.zoomFactor=12;
            rangeView.fitWindow();
            rangeView.zoomToOptimalFit();
            rangeView.hide();
         }
      }

      this.largeStarMaskView = rangeView;
   };

   this.createRangeMask = function() {
      var P = new RangeSelection;
      with (P)
      {
         lowRange = model.rangeSelectionForBaseLowerLimit;
         highRange = model.rangeSelectionForBaseUpperLimit;
         fuzziness = model.rangeSelectionForBaseFuzziness;
         smoothness = model.rangeSelectionForBaseSmoothness;
         screening = false;
         toLightness = true;
         invert = false;
      }
      P.executeOn(this.sourceView.mainView,false);
      this.dsoMaskView = ImageWindow.activeWindow;
      this.dsoMaskView.hide();
      this.dsoMaskView.mainView.id = this.getNewName("DSOM_DSO","");
      this.dsoMaskView.zoomFactor=12;
      this.dsoMaskView.fitWindow();
      this.dsoMaskView.zoomToOptimalFit();
   }

   this.createDSOMask = function() {
      this.dsoMaskView = new ImageWindow( this.sourceView.mainView.image.width,
                                 this.sourceView.mainView.image.height,
                                 this.sourceView.mainView.image.numberOfChannels,
                                 this.sourceView.mainView.window.bitsPerSample,
                                 this.sourceView.mainView.window.isFloatSample,
                                 this.sourceView.mainView.image.colorSpace != ColorSpace_Gray,
                                 this.getNewName("DSOM_DSO","") );
      this.dsoMaskView.mainView.beginProcess(UndoFlag_NoSwapFile);
      this.dsoMaskView.mainView.image.assign( this.sourceView.mainView.image );
      this.dsoMaskView.mainView.endProcess();
      this.dsoMaskView.zoomFactor=12;
      this.dsoMaskView.fitWindow();
      this.dsoMaskView.zoomToOptimalFit();

      var n = new ImageWindow( this.sourceView.mainView.image.width,
                                 this.sourceView.mainView.image.height,
                                 this.sourceView.mainView.image.numberOfChannels,
                                 this.sourceView.mainView.window.bitsPerSample,
                                 this.sourceView.mainView.window.isFloatSample,
                                 this.sourceView.mainView.image.colorSpace != ColorSpace_Gray,
                                 this.getNewName("DSOM_n","") );
      n.mainView.beginProcess(UndoFlag_NoSwapFile);
      n.mainView.image.assign( this.sourceView.mainView.image );
      n.mainView.endProcess();
      n.zoomFactor=12;
      n.fitWindow();
      n.zoomToOptimalFit();

      var atwt = new ATrousWaveletTransform;
      with ( atwt )
      {
         layers = [ // enabled, biasEnabled, bias, noiseReductionEnabled, noiseReductionThreshold, noiseReductionAmount, noiseReductionIterations
            [false, true, 0.000, false, 3.000, 1.00, 1],
            [true, true, 0.000, false, 3.000, 1.00, 1],
            [true, true, 0.000, false, 3.000, 1.00, 1],
            [true, true, 0.000, false, 3.000, 1.00, 1],
            [true, true, 0.000, false, 3.000, 1.00, 1],
            [true, true, 0.000, false, 3.000, 1.00, 1],
            [false, true, 0.000, false, 3.000, 1.00, 1]
         ];
         scaleDelta = 0;
         scalingFunctionData = [
            0.25,0.5,0.25,
            0.5,1,0.5,
            0.25,0.5,0.25
         ];
         scalingFunctionRowFilter = [
            0.5,
            1,
            0.5
         ];
         scalingFunctionColFilter = [
            0.5,
            1,
            0.5
         ];
         scalingFunctionNoiseSigma = [
            0.8003,0.2729,0.1198,
            0.0578,0.0287,0.0143,
            0.0072,0.0036,0.0019,
            0.001
         ];
         scalingFunctionName = "Linear Interpolation (3)";
         largeScaleFunction = ATrousWaveletTransform.prototype.NoFunction;
         curveBreakPoint = 0.75;
         noiseThresholding = false;
         noiseThresholdingAmount = 1.00;
         noiseThreshold = 3.00;
         softThresholding = true;
         useMultiresolutionSupport = false;
         deringing = false;
         deringingDark = 0.1000;
         deringingBright = 0.0000;
         outputDeringingMaps = false;
         lowRange = 0.0000;
         highRange = 0.0000;
         previewMode = ATrousWaveletTransform.prototype.Disabled;
         previewLayer = 0;
         toLuminance = true;
         toChrominance = true;
         linear = false;
      }
      atwt.executeOn(n.mainView,false);

      var pm = new PixelMath;
      with (pm) {
         var exp = this.dsoMaskView.mainView.id + "-" + n.mainView.id;
         expression = exp;
         expression1 = "";
         expression2 = "";
         expression3 = "";
         useSingleExpression = true;
         symbols = "";
         generateOutput = true;
         singleThreaded = false;
         use64BitWorkingImage = false;
         rescale = false;
         rescaleLower = 0;
         rescaleUpper = 1;
         truncate = true;
         truncateLower = 0;
         truncateUpper = 1;
         createNewImage = false;
         showNewImage = true;
         newImageId = "";
         newImageWidth = 0;
         newImageHeight = 0;
         newImageAlpha = false;
         newImageColorSpace = PixelMath.prototype.SameAsTarget;
         newImageSampleFormat = PixelMath.prototype.SameAsTarget;
      }
      pm.executeOn(this.dsoMaskView.mainView, false);

      n.forceClose();
   };

   this.addLargeStarsToStarMask = function() {

      var P = new PixelMath;
      with (P)
      {
         var expression1 = this.starMaskView.mainView.id + "+" + this.largeStarMaskView.mainView.id;
         expression = expression1;
         expression1 = "";
         expression2 = "";
         expression3 = "";
         useSingleExpression = true;
         symbols = "";
         generateOutput = true;
         singleThreaded = false;
         use64BitWorkingImage = false;
         rescale = false;
         rescaleLower = 0;
         rescaleUpper = 1;
         truncate = true;
         truncateLower = 0;
         truncateUpper = 1;
         createNewImage = false;
         showNewImage = true;
         newImageId = "";
         newImageWidth = 0;
         newImageHeight = 0;
         newImageAlpha = false;
         newImageColorSpace = PixelMath.prototype.SameAsTarget;
         newImageSampleFormat = PixelMath.prototype.SameAsTarget;
      }
      P.executeOn(this.starMaskView.mainView,false);
   };

   this.assembleMask = function() {

      this.newMaskView = new ImageWindow( this.dsoMaskView.mainView.image.width,
                                 this.dsoMaskView.mainView.image.height,
                                 this.dsoMaskView.mainView.image.numberOfChannels,
                                 this.dsoMaskView.mainView.window.bitsPerSample,
                                 this.dsoMaskView.mainView.window.isFloatSample,
                                 this.dsoMaskView.mainView.image.colorSpace != ColorSpace_Gray,
                                 this.getNewName(model.imageView.id + "_mask","") );
      this.newMaskView.mainView.beginProcess(UndoFlag_NoSwapFile);
      this.newMaskView.mainView.image.assign( this.dsoMaskView.mainView.image );
      this.newMaskView.mainView.endProcess();

      if ( model.grayPercent > 0.0 ) {

         var pm = new PixelMath;
         with (pm) {
            expression = model.grayPercent.toString();
            expression1 = "";
            expression2 = "";
            expression3 = "";
            useSingleExpression = true;
            symbols = "";
            generateOutput = true;
            singleThreaded = false;
            use64BitWorkingImage = false;
            rescale = false;
            rescaleLower = 0;
            rescaleUpper = 1;
            truncate = true;
            truncateLower = 0;
            truncateUpper = 1;
            createNewImage = false;
            showNewImage = true;
            newImageId = (this.sourceView.mainView.id + "_mask");
            newImageWidth = 0;
            newImageHeight = 0;
            newImageAlpha = false;
            newImageColorSpace = PixelMath.prototype.SameAsTarget;
            newImageSampleFormat = PixelMath.prototype.SameAsTarget;
         }
         pm.executeOn(this.newMaskView.mainView, false);

         if ( model.protectStars && model.useRangeSelectionsForLargeStars ) {
           this.addLargeStarsToStarMask();
         }

         if ( model.protectStars ) {
            var P = new PixelMath;
            with (P)
            {
               var expression1 = "$T-" + this.starMaskView.mainView.id
               expression = expression1;
               expression1 = "";
               expression2 = "";
               expression3 = "";
               useSingleExpression = true;
               symbols = "";
               generateOutput = true;
               singleThreaded = false;
               use64BitWorkingImage = false;
               rescale = false;
               rescaleLower = 0;
               rescaleUpper = 1;
               truncate = true;
               truncateLower = 0;
               truncateUpper = 1;
               createNewImage = false;
               showNewImage = true;
               newImageId = "";
               newImageWidth = 0;
               newImageHeight = 0;
               newImageAlpha = false;
               newImageColorSpace = PixelMath.prototype.SameAsTarget;
               newImageSampleFormat = PixelMath.prototype.SameAsTarget;
            }
            P.executeOn(this.newMaskView.mainView,false);
         }
         else if ( model.useRangeSelectionsForLargeStars ) {
           var P = new PixelMath;
           with (P)
           {
              var expression1 = "$T-" + this.largeStarMaskView.mainView.id
              expression = expression1;
              expression1 = "";
              expression2 = "";
              expression3 = "";
              useSingleExpression = true;
              symbols = "";
              generateOutput = true;
              singleThreaded = false;
              use64BitWorkingImage = false;
              rescale = false;
              rescaleLower = 0;
              rescaleUpper = 1;
              truncate = true;
              truncateLower = 0;
              truncateUpper = 1;
              createNewImage = false;
              showNewImage = true;
              newImageId = "";
              newImageWidth = 0;
              newImageHeight = 0;
              newImageAlpha = false;
              newImageColorSpace = PixelMath.prototype.SameAsTarget;
              newImageSampleFormat = PixelMath.prototype.SameAsTarget;
           }
           P.executeOn(this.newMaskView.mainView,false);
         }

         var P = new PixelMath;
         with (P)
         {
            expression1 = "min($T," + this.dsoMaskView.mainView.id + ")"
            expression = expression1;
            expression1 = "";
            expression2 = "";
            expression3 = "";
            useSingleExpression = true;
            symbols = "";
            generateOutput = true;
            singleThreaded = false;
            use64BitWorkingImage = false;
            rescale = false;
            rescaleLower = 0;
            rescaleUpper = 1;
            truncate = true;
            truncateLower = 0;
            truncateUpper = 1;
            createNewImage = false;
            showNewImage = true;
            newImageId = "";
            newImageWidth = 0;
            newImageHeight = 0;
            newImageAlpha = false;
            newImageColorSpace = PixelMath.prototype.SameAsTarget;
            newImageSampleFormat = PixelMath.prototype.SameAsTarget;
         }
         P.executeOn(this.newMaskView.mainView,false)

      }
      else
      {
          if ( model.protectStars && model.useRangeSelectionsForLargeStars ) {
            this.addLargeStarsToStarMask();
          }
         if ( model.protectStars ) {
            var P = new PixelMath;
            with (P)
            {
               var expression1 = "$T-" + this.starMaskView.mainView.id
               expression = expression1;
               expression1 = "";
               expression2 = "";
               expression3 = "";
               useSingleExpression = true;
               symbols = "";
               generateOutput = true;
               singleThreaded = false;
               use64BitWorkingImage = false;
               rescale = false;
               rescaleLower = 0;
               rescaleUpper = 1;
               truncate = true;
               truncateLower = 0;
               truncateUpper = 1;
               createNewImage = false;
               showNewImage = true;
               newImageId = "";
               newImageWidth = 0;
               newImageHeight = 0;
               newImageAlpha = false;
               newImageColorSpace = PixelMath.prototype.SameAsTarget;
               newImageSampleFormat = PixelMath.prototype.SameAsTarget;
            }
            P.executeOn(this.newMaskView.mainView,false);
         }
         else if ( model.useRangeSelectionsForLargeStars ) {
           var P = new PixelMath;
           with (P)
           {
              var expression1 = "$T-" + this.largeStarMaskView.mainView.id
              expression = expression1;
              expression1 = "";
              expression2 = "";
              expression3 = "";
              useSingleExpression = true;
              symbols = "";
              generateOutput = true;
              singleThreaded = false;
              use64BitWorkingImage = false;
              rescale = false;
              rescaleLower = 0;
              rescaleUpper = 1;
              truncate = true;
              truncateLower = 0;
              truncateUpper = 1;
              createNewImage = false;
              showNewImage = true;
              newImageId = "";
              newImageWidth = 0;
              newImageHeight = 0;
              newImageAlpha = false;
              newImageColorSpace = PixelMath.prototype.SameAsTarget;
              newImageSampleFormat = PixelMath.prototype.SameAsTarget;
           }
           P.executeOn(this.newMaskView.mainView,false);
         }
       }
     };

   // Entry point for mask creation.
   this.createMask = function() {

      model.imageWindow.removeMask();

      this.getSourceView();

      if ( model.protectStars )
      {
         if ( model.useClassicStarMask )
         {
            this.createClassicStarMask();
         }
         else
         {
            this.createStarMask();
         }
      }
      if ( model.useRangeSelectionsForLargeStars ) {
         this.createLargeStarMask();
      }

      if ( model.useRangeSelectionForBase ) {
         this.createRangeMask();
      }
      else {
         this.createDSOMask();
      }

      this.assembleMask();

      this.newMaskView.zoomFactor=12;
      this.newMaskView.fitWindow();
      this.newMaskView.zoomToOptimalFit();

      this.newMaskView.show();

      model.dsoMaskView = this.newMaskView;

      if ( model.applyMask ) {
        model.imageWindow.setMask(model.dsoMaskView);
        model.imageWindow.maskVisible = model.hideMask == true ? false : true;
        model.imageWindow.maskInverted = model.invertMask;
        model.imageWindow.bringToFront();
      }

      this.sourceView.forceClose();

      if ( ! model.keepMasksOpen ) {
         if ( model.protectStars )
         {
            this.starMaskView.forceClose();
         }
         if ( model.useRangeSelectionsForLargeStars ) {
           this.largeStarMaskView.forceClose();
         }
         this.dsoMaskView.forceClose();
      }
   };
};
