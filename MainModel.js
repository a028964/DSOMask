
function MainModel() {
  // Image view.
  this.imageViewFormat = "%s";
  this.imageView = null;
  this.maskPreview = null;

  this.defGrayPercent = 0.4;
  this.grayPercent = this.defGrayPercent;

  this.defProtectStars = true;
  this.protectStars = this.defProtectStars;

  this.defKeepMasksOpen = false;
  this.keepMasksOpen = this.defKeepMasksOpen;

  this.defUseClassicStarMask = false;
  this.useClassicStarMask = this.defUseClassicStarMask;

  this.defStarMaskThreshold = 0.2;
  this.StarMaskThreshold = this.defStarMaskThreshold;

  this.defStarMaskScale = 5;
  this.StarMaskScale = this.defStarMaskScale;

  this.defStarMaskLargeScale = 0;
  this.StarMaskLargeScale = this.defStarMaskLargeScale;

  this.defStarMaskSmallScale = 0;
  this.StarMaskSmallScale = this.defStarMaskSmallScale;

  this.defStarMaskCompensation = 1;
  this.StarMaskCompensation = this.defStarMaskCompensation;

  this.defStarMaskSmoothness = 8;
  this.StarMaskSmoothness = this.defStarMaskSmoothness;

  this.defUseHDRMForStarMask = true;
  this.useHDRMForStarMask = this.defUseHDRMForStarMask;

  this.defUseRangeSelectionForBase = true;
  this.UseRangeSelectionForBase = this.defUseRangeSelectionForBase;

  this.defRangeSelectionForBaseLowerLimit = 0.0;
  this.RangeSelectionForBaseLowerLimit = this.defRangeSelectionForBaseLowerLimit;

  this.defRangeSelectionForBaseUpperLimit = 1.0;
  this.RangeSelectionForBaseUpperLimit = this.defRangeSelectionForBaseUpperLimit;

  this.defRangeSelectionForBaseFuzziness = 0.0;
  this.RangeSelectionForBaseFuzziness = this.defRangeSelectionForBaseFuzziness;

  this.defRangeSelectionForBaseSmoothness = 0.0;
  this.RangeSelectionForBaseSmoothness = this.defRangeSelectionForBaseSmoothness;

  this.defUseRangeSelectionsForLargeStars = true;
  this.useRangeSelectionsForLargeStars = this.defUseRangeSelectionsForLargeStars;

  this.totalRangeSelections = 3;

  this.rangeSelectionColumnNames = new Array(
    "RS",
    "Lower Limit",
    "Upper Limit",
    "Fuzziness",
    "Smoothness"
  )

  this.defRangeSelectionsUsed = new Array(
    true,
    true,
    false
  );
  this.rangeSelectionsUsed = new Array(
    true,
    true,
    false
  );

  this.defRangeSelectionLowerLimits = new Array(
    0.8,
    0.15,
    0.06
  );
  this.rangeSelectionLowerLimits = new Array(
    0.8,
    0.15,
    0.06
  );

  this.defRangeSelectionUpperLimits = new Array(
    1.0,
    1.0,
    1.0
  );
  this.rangeSelectionUpperLimits = new Array(
    1.0,
    1.0,
    1.0
  );

  this.defRangeSelectionFuzziness = new Array(
    0.0,
    0.0,
    0.0
  );
  this.rangeSelectionFuzziness = new Array(
    0.0,
    0.0,
    0.0
  );

  this.defRangeSelectionSmoothness = new Array(
    8.0,
    8.0,
    12.0
  );

  this.rangeSelectionSmoothness = new Array(
    8.0,
    8.0,
    12.0
  );

   // Gives numeric if well defined and within range, otherwise a default.
   this.defaultNumeric = function(numeric, min, max, def) {
      return numeric != null &&
         !isNaN(numeric) &&
         numeric >= min && numeric <= max ? numeric : def;
   };

   // Gives boolean if well defined, otherwise a default.
   this.defaultBoolean = function(bool, def) {
      return bool != null && (bool == false || bool == true) ? bool : def;
   };

   // Gives string if well defined, otherwise a default.
   this.defaultString = function(str, def) {
      return str != null ? str : def;
   }

   this.defaultFloatArray = function(array, def) {
      return array != null ? arra : def;
   }

   // Loads core settings.
   this.loadSettings = function() {
      // this.defaultString(Settings.read("version", DataType_String8), "");

      this.grayPercent = this.defaultNumeric(
         Settings.read("grayPercent", DataType_Real64),
         0.0,
         1.0,
         this.defGrayPercent
      );

      this.protectStars = this.defaultBoolean(
         Settings.read("protectStars", DataType_Boolean),
         this.defProtectStars
      );

      this.keepMasksOpen = this.defaultBoolean(
         Settings.read("keepMasksOpen", DataType_Boolean),
         this.defKeepMasksOpen
      );

      this.useClassicStarMask = this.defaultBoolean(
         Settings.read("useClassicStarMask", DataType_Boolean),
         this.defUseClassicStarMask
      );

      this.useHDRMforStarMask = this.defaultBoolean(
         Settings.read("useHDRMForStarMask", DataType_Boolean),
         this.defUseHDRMForStarMask
      );

      this.StarMaskThreshold = this.defaultNumeric(
         Settings.read("starMaskThreshold", DataType_Real64),
         0.0,
         1.0,
         this.defStarMaskThreshold
      );

      this.StarMaskScale = this.defaultNumeric(
         Settings.read("starMaskScale", DataType_Real64),
         2,
         12,
         this.defStarMaskScale
      );

      this.StarMaskLargeScale = this.defaultNumeric(
         Settings.read("starMaskLargeScale", DataType_Real64),
         0,
         15,
         this.defStarMaskLargeScale
      );

      this.StarMaskSmallScale = this.defaultNumeric(
         Settings.read("starMaskSmallScale", DataType_Real64),
         0,
         15,
         this.defStarMaskSmallScale
      );

      this.StarMaskCompensation = this.defaultNumeric(
         Settings.read("starMaskCompensation", DataType_Real64),
         1,
         4,
         this.defStarMaskCompensation
      );

      this.StarMaskSmoothness = this.defaultNumeric(
         Settings.read("starMaskSmoothness", DataType_Real64),
         1,
         4,
         this.defStarMaskSmoothness
      );

      this.useRangeSelectionsForLargeStars = this.defaultBoolean(
         Settings.read("useRangeSelectionsForLargeStars", DataType_Boolean),
         this.defUseRangeSelectionsForLargeStars
      );


      this.UseRangeSelectionForBase = this.defaultBoolean(
         Settings.read("useRangeSelectionForBase", DataType_Boolean),
         this.defUseRangeSelectionForBase
      );
      this.RangeSelectionForBaseLowerLimit = this.defaultNumeric(
         Settings.read("rangeSelectionForBaseLowerLimit", DataType_Real64),
         0.0,
         1.0,
         this.defRangeSelectionForBaseLowerLimit
      );
      this.RangeSelectionForBaseUpperLimit = this.defaultNumeric(
         Settings.read("rangeSelectionForBaseUpperLimit", DataType_Real64),
         0.0,
         1.0,
         this.defRangeSelectionForBaseUpperLimit
      );
      this.RangeSelectionForBaseFuzziness = this.defaultNumeric(
         Settings.read("rangeSelectionForBaseFuzziness", DataType_Real64),
         0.0,
         1.0,
         this.defRangeSelectionForBaseFuzziness
      );
      this.RangeSelectionForBaseSmoothness= this.defaultNumeric(
         Settings.read("rangeSelectionForBaseSmoothness", DataType_Real64),
         0.0,
         100.0,
         this.defRangeSelectionForBaseSmoothness
      );

      for (var i = 0; i < this.totalRangeSelections; i++) {
         this.rangeSelectionsUsed[i] = this.defaultBoolean(
            Settings.read("rangeSelectionEnabled" + i, DataType_Boolean),
            this.defRangeSelectionsUsed[i]
         );
         this.rangeSelectionLowerLimits[i] = this.defaultNumeric(
            Settings.read("rangeSelectionLowerLimit" + i, DataType_Real64),
            0.0,
            1.0,
            this.defRangeSelectionLowerLimits[i]
         );
         this.rangeSelectionUpperLimits[i] = this.defaultNumeric(
            Settings.read("rangeSelectionUpperLimit" + i, DataType_Real64),
            0.0,
            1.0,
            this.defRangeSelectionUpperLimits[i]
         );
         this.rangeSelectionFuzziness[i] = this.defaultNumeric(
            Settings.read("rangeSelectionFuzziness" + i, DataType_Real64),
            0.0,
            1.0,
            this.defRangeSelectionFuzziness[i]
         );
         this.rangeSelectionSmoothness[i] = this.defaultNumeric(
            Settings.read("rangeSelectionSmoothness" + i, DataType_Real64),
            0.0,
            100.0,
            this.defRangeSelectionSmoothness[i]
         );
      }


   };

   // Stores core settings.
   this.storeSettings = function() {
      Settings.write("version", DataType_String8, VERSION);

      Settings.write(
         "grayPercent",
         DataType_Real64,
         this.grayPercent
      );

      Settings.write(
         "protectStars",
         DataType_Boolean,
         this.protectStars
      );

      Settings.write(
         "keepMasksOpen",
         DataType_Boolean,
         this.keepMasksOpen
      );

      Settings.write(
         "useClassicStarMask",
         DataType_Boolean,
         this.useClassicStarMask
      );

      Settings.write(
         "useHDRMForStarMask",
         DataType_Boolean,
         this.useHDRMForStarMask
      );

      Settings.write(
         "starMaskThreshold",
         DataType_Real64,
         this.StarMaskThreshold
      );

      Settings.write(
         "starMaskScale",
         DataType_Real64,
         this.StarMaskScale
      );

      Settings.write(
         "starMaskLargeScale",
         DataType_Real64,
         this.StarMaskLargeScale
      );

      Settings.write(
         "starMaskSmallScale",
         DataType_Real64,
         this.StarMaskSmallScale
      );

      Settings.write(
         "starMaskCompensation",
         DataType_Real64,
         this.StarMaskCompensation
      );

      Settings.write(
         "starMaskSmoothness",
         DataType_Real64,
         this.StarMaskSmoothness
      );

      Settings.write(
         "useRangeSelectionForBase",
         DataType_Boolean,
         this.UseRangeSelectionForBase
      );

      Settings.write("rangeSelectionForBaseLowerLimit", DataType_Real64, this.RangeSelectionForBaseLowerLimit);
      Settings.write("rangeSelectionForBaseUpperLimit", DataType_Real64, this.RangeSelectionForBaseUpperLimit);
      Settings.write("rangeSelectionForBaseFuzziness", DataType_Real64, this.RangeSelectionForBaseFuzziness);
      Settings.write("rangeSelectionForBaseSmoothness", DataType_Real64, this.RangeSelectionForBaseSmoothness);


      Settings.write(
         "useRangeSelectionsForLargeStars",
         DataType_Boolean,
         this.useRangeSelectionsForLargeStars
      );

      for (var i = 0; i < this.totalRangeSelections; i++) {
         Settings.write("rangeSelectionEnabled" + i, DataType_Boolean, this.rangeSelectionsUsed[i]);
         Settings.write("rangeSelectionLowerLimit" + i, DataType_Real64, this.rangeSelectionLowerLimits[i]);
         Settings.write("rangeSelectionUpperLimit" + i, DataType_Real64, this.rangeSelectionUpperLimits[i]);
         Settings.write("rangeSelectionFuzziness" + i, DataType_Real64, this.rangeSelectionFuzziness[i]);
         Settings.write("rangeSelectionSmoothness" + i, DataType_Real64, this.rangeSelectionSmoothness[i]);
      }

   };

   // Loads instance parameters.
   this.loadParameters = function() {

      if (Parameters.has("grayPercent")) {
         this.grayPercent = this.defaultNumeric(
            Parameters.getReal("grayPercent"),
            0.0,
            1.0,
            this.defGrayPercent
         );
      }

      if (Parameters.has("protectStars")) {
         this.protectStars = this.defaultBoolean(
            Parameters.getBoolean("protectStars"),
            this.defProtectStars
         );
      }

      if (Parameters.has("keepMasksOpen")) {
         this.keepMasksOpen = this.defaultBoolean(
            Parameters.getBoolean("keepMasksOpen"),
            this.defKeepMasksOpen
         );
      }

      if (Parameters.has("useClassicStarMask")) {
         this.useClassicStarMask = this.defaultBoolean(
            Parameters.getBoolean("useClassicStarMask"),
            this.defUseClassicStarMask
         );
      }

      if (Parameters.has("useHDRMForStarMask")) {
         this.useHDRMForStarMask = this.defaultBoolean(
            Parameters.getBoolean("useHDRMForStarMask"),
            this.defUseHDRMForStarMask
         );
      }

      if (Parameters.has("starMaskThreshold")) {
         this.StarMaskThreshold = this.defaultNumeric(
            Parameters.getReal("starMaskThreshold"),
            0.0,
            1.0,
            this.defStarMaskThreshold
         );
      }

      if (Parameters.has("starMaskScale")) {
         this.StarMaskScale = this.defaultNumeric(
            Parameters.getReal("starMaskScale"),
            2,
            12,
            this.defStarMaskScale
         );
      }

      if (Parameters.has("starMaskLargeScale")) {
         this.StarMaskLargeScale = this.defaultNumeric(
            Parameters.getReal("starMaskLargeScale"),
            0,
            15,
            this.defStarMaskLargeScale
         );
      }

      if (Parameters.has("starMaskSmallScale")) {
         this.SMLargerScale = this.defaultNumeric(
            Parameters.getReal("starMaskSmallScale"),
            0,
            15,
            this.defStarMaskSmallScale
         );
      }

      if (Parameters.has("starMaskCompensation")) {
         this.StarMaskCompensation = this.defaultNumeric(
            Parameters.getReal("starMaskCompensation"),
            1,
            4,
            this.defStarMaskCompensation
         );
      }

      if (Parameters.has("starMaskSmoothness")) {
         this.StarMaskSmoothness = this.defaultNumeric(
            Parameters.getReal("starMaskSmoothness"),
            1,
            4,
            this.defStarMaskSmoothness
         );
      }

      if (Parameters.has("useRangeSelectionForBase")) {
         this.UseRangeSelectionForBase = this.defaultBoolean(
            Parameters.getBoolean("useRangeSelectionForBase"),
            this.defUseRangeSelectionForBase
         );
      }

      if (Parameters.has("rangeSelectionForBaseLowerLimit")) {
         this.RangeSelectionForBaseLowerLimit = this.defaultNumeric(
            Parameters.getReal("rangeSelectionForBaseLowerLimit"),
            0.0,
            1.0,
            this.defRangeSelectionForBaseLowerLimit
         );
      }
      if (Parameters.has("rangeSelectionForBaseUpperLimit")) {
         this.RangeSelectionForBaseUpperLimits = this.defaultNumeric(
            Parameters.getReal("rangeSelectionForBaseUpperLimit"),
            0.0,
            1.0,
            this.defRangeSelectionForBaseUpperLimit
         );
      }
      if (Parameters.has("rangeSelectionForBaseFuzziness")) {
         this.RangeSelectionForBaseFuzziness = this.defaultNumeric(
            Parameters.getReal("rangeSelectionForBaseFuzziness"),
            0.0,
            1.0,
            this.defRangeSelectionForBaseFuzziness
         );
      }
      if (Parameters.has("rangeSelectionForBaseSmoothness")) {
         this.RangeSelectionForBaseSmoothness = this.defaultNumeric(
            Parameters.getReal("rangeSelectionForBaseSmoothness"),
            0.0,
            100.0,
            this.defRangeSelectionForBaseSmoothness
         );
      }

      if (Parameters.has("useRangeSelectionsForLargeStars")) {
         this.useRangeSelectionsForLargeStars = this.defaultBoolean(
            Parameters.getBoolean("useRangeSelectionsForLargeStars"),
            this.defUseRangeSelectionsForLargeStars
         );
      }

      for (var i = 0; i < this.totalRangeSelections; i++) {
         if (Parameters.has("rangeSelectionEnabled" + i)) {
            this.rangeSelectionsUsed[i] = this.defaultBoolean(
               Parameters.getBoolean("rangeSelectionEnabled" + i),
               this.defRangeSelectionsUsed[i]
            );
         }
         if (Parameters.has("rangeSelectionLowerLimit" + i)) {
            this.rangeSelectionLowerLimits[i] = this.defaultNumeric(
               Parameters.getReal("rangeSelectionLowerLimit" + i),
               0.0,
               1.0,
               this.defRangeSelectionLowerLimits[i]
            );
         }
         if (Parameters.has("rangeSelectionUpperLimit" + i)) {
            this.rangeSelectionUpperLimits[i] = this.defaultNumeric(
               Parameters.getReal("rangeSelectionUpperLimit" + i),
               0.0,
               1.0,
               this.defRangeSelectionUpperLimits[i]
            );
         }
         if (Parameters.has("rangeSelectionFuzziness" + i)) {
            this.rangeSelectionFuzziness[i] = this.defaultNumeric(
               Parameters.getReal("rangeSelectionFuzziness" + i),
               0.0,
               1.0,
               this.defRangeSelectionFuzziness[i]
            );
         }
         if (Parameters.has("rangeSelectionSmoothness" + i)) {
            this.rangeSelectionSmoothness[i] = this.defaultNumeric(
               Parameters.getReal("rangeSelectionSmoothness" + i),
               0.0,
               100.0,
               this.defRangeSelectionSmoothness[i]
            );
         }
      }

  };

   // Stores instance parameters.
   this.storeParameters = function() {
      Parameters.clear();

      Parameters.set("version", VERSION);

      Parameters.set("grayPercent",this.grayPercent);
      Parameters.set("protectStars",this.protectStars);
      Parameters.set("keepMasksOpen", this.keepMasksOpen);

      Parameters.set("useClassicStarMask", this.useClassicStarMask);
      Parameters.set("useHDRMForStarMask", this.useHDRMForStarMask);
      Parameters.set("starMaskThreshold", this.StarMaskThreshold);
      Parameters.set("starMaskScale", this.StarMaskScale);
      Parameters.set("starMaskLargeScale", this.StarMaskLargeScale);
      Parameters.set("starMaskSmallScale", this.StarMaskSmallScale);
      Parameters.set("starMaskCompensation", this.StarMaskCompensation);
      Parameters.set("starMaskSmoothness", this.StarMaskSmoothness);

      Parameters.set("useRangeSelectionForBase", this.UseRangeSelectionForBase);
      Parameters.set("rangeSelectionForBaseLowerLimit", this.RangeSelectionForBaseLowerLimit);
      Parameters.set("rangeSelectionForBaseUpperLimit", this.RangeSelectionForBaseUpperLimit);
      Parameters.set("rangeSelectionForBaseFuzziness", this.RangeSelectionForBaseFuzziness);
      Parameters.set("rangeSelectionForBaseSmoothness", this.RangeSelectionForBaseSmoothness);

      Parameters.set("useRangeSelectionsForLargeStars", this.useRangeSelectionsForLargeStars);

      for (var i = 0; i < this.totalRangeSelections; i++) {
         Parameters.set("rangeSelectionEnabled" + i, this.rangeSelectionsUsed[i]);
         Parameters.set("rangeSelectionLowerLimit" + i, this.rangeSelectionLowerLimits[i]);
         Parameters.set("rangeSelectionUpperLimit" + i, this.rangeSelectionUpperLimits[i]);
         Parameters.set("rangeSelectionFuzziness" + i, this.rangeSelectionFuzziness[i]);
         Parameters.set("rangeSelectionSmoothness" + i, this.rangeSelectionSmoothness[i]);
      }

   };

   // Clears the model.
   this.clear = function() {
      this.imageView = null;
   };
}
