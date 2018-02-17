
function MainModel() {
   // Image view.
   this.imageViewFormat = "%s";
   this.imageView = null;
   this.rangeMaskPreview = null;

   this.defGrayPercent = 0.4;
   this.grayPercent = this.defGrayPercent;

   this.defProtectStars = true;
   this.protectStars = this.defProtectStars;

   this.defKeepMasksOpen = false;
   this.keepMasksOpen = this.defKeepMasksOpen;

   this.defUseClassicStarMask = false;
   this.useClassicStarMask = this.defUseClassicStarMask;

	this.defSMThreshold = 0.2;
	this.SMThreshold = this.defSMThreshold;

	this.defSMScale = 5;
	this.SMScale = this.defSMScale;

	this.defSMLargeScale = 0;
	this.SMLargeScale = this.defSMLargeScale;

	this.defSMSmallScale = 0;
	this.SMSmallScale = this.defSMSmallScale;

	this.defSMCompensation = 1;
	this.SMCompensation = this.defSMCompensation;

	this.defSMSmoothness = 8;
	this.SMSmoothness = this.defSMSmoothness;

   this.defUseHDRMForStarMask = true;
   this.useHDRMForStarMask = this.defUseHDRMForStarMask;

   this.defUseRSForBase = true;
   this.useRSForBase = this.defUseRSForBase;

   this.defRSForBaseLowerLimit = 0.0;
   this.RSForBaseLowerLimit = this.defRSForBaseLowerLimit;

   this.defRSForBaseUpperLimit = 1.0;
   this.RSForBaseUpperLimit = this.defRSForBaseUpperLimit;

   this.defRSForBaseFuzziness = 0.0;
   this.RSForBaseFuzziness = this.defRSForBaseFuzziness;

   this.defRSForBaseSmoothness = 0.0;
   this.RSForBaseSmoothness = this.defRSForBaseSmoothness;

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

      this.SMThreshold = this.defaultNumeric(
         Settings.read("SMThreshold", DataType_Real64),
         0.0,
         1.0,
         this.defSMThreshold
      );

      this.SMScale = this.defaultNumeric(
         Settings.read("SMScale", DataType_Real64),
         2,
         12,
         this.defSMScale
      );

      this.SMLargeScale = this.defaultNumeric(
         Settings.read("SMLargeScale", DataType_Real64),
         0,
         15,
         this.defSMLargeScale
      );

      this.SMSmallScale = this.defaultNumeric(
         Settings.read("SMSmallScale", DataType_Real64),
         0,
         15,
         this.defSMSmallScale
      );

      this.SMCompensation = this.defaultNumeric(
         Settings.read("SMCompensation", DataType_Real64),
         1,
         4,
         this.defSMCompensation
      );

      this.SMSmoothness = this.defaultNumeric(
         Settings.read("SMSmoothness", DataType_Real64),
         1,
         4,
         this.defSMSmoothness
      );

      this.useRangeSelectionsForLargeStars = this.defaultBoolean(
         Settings.read("useRangeSelectionsForLargeStars", DataType_Boolean),
         this.defUseRangeSelectionsForLargeStars
      );


      this.useRSForBase = this.defaultBoolean(
         Settings.read("useRSForBase", DataType_Boolean),
         this.defUseRSForBase
      );
      this.RSForBaseLowerLimit = this.defaultNumeric(
         Settings.read("RSForBaseLowerLimit", DataType_Real64),
         0.0,
         1.0,
         this.defRSForBaseLowerLimit
      );
      this.RSForBaseUpperLimit = this.defaultNumeric(
         Settings.read("RSForBaseUpperLimit", DataType_Real64),
         0.0,
         1.0,
         this.defRSForBaseUpperLimit
      );
      this.RSForBaseFuzziness = this.defaultNumeric(
         Settings.read("RSForBaseFuzziness", DataType_Real64),
         0.0,
         1.0,
         this.defRSForBaseFuzziness
      );
      this.RSForBaseSmoothness= this.defaultNumeric(
         Settings.read("RSForBaseSmoothness", DataType_Real64),
         0.0,
         100.0,
         this.defRSForBaseSmoothness
      );

      for (var i = 0; i < this.totalRangeSelections; i++) {
         this.rangeSelectionsUsed[i] = this.defaultBoolean(
            Settings.read("RSEnabled" + i, DataType_Boolean),
            this.defRangeSelectionsUsed[i]
         );
         this.rangeSelectionLowerLimits[i] = this.defaultNumeric(
            Settings.read("RSLowerLimit" + i, DataType_Real64),
            0.0,
            1.0,
            this.defRangeSelectionLowerLimits[i]
         );
         this.rangeSelectionUpperLimits[i] = this.defaultNumeric(
            Settings.read("RSUpperLimit" + i, DataType_Real64),
            0.0,
            1.0,
            this.defRangeSelectionUpperLimits[i]
         );
         this.rangeSelectionFuzziness[i] = this.defaultNumeric(
            Settings.read("RSFuzziness" + i, DataType_Real64),
            0.0,
            1.0,
            this.defRangeSelectionFuzziness[i]
         );
         this.rangeSelectionSmoothness[i] = this.defaultNumeric(
            Settings.read("RSSmoothness" + i, DataType_Real64),
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
         "SMThreshold",
         DataType_Real64,
         this.SMThreshold
      );

      Settings.write(
         "SMScale",
         DataType_Real64,
         this.SMScale
      );

      Settings.write(
         "SMLargeScale",
         DataType_Real64,
         this.SMLargeScale
      );

      Settings.write(
         "SMSmallScale",
         DataType_Real64,
         this.SMSmallScale
      );

      Settings.write(
         "SMCompensation",
         DataType_Real64,
         this.SMCompensation
      );

      Settings.write(
         "SMSmoothness",
         DataType_Real64,
         this.SMSmoothness
      );

      Settings.write(
         "useRSForBase",
         DataType_Boolean,
         this.useRSForBase
      );

      Settings.write("RSForBaseLowerLimit", DataType_Real64, this.RSForBaseLowerLimit);
      Settings.write("RSForBaseUpperLimit", DataType_Real64, this.RSForBaseUpperLimit);
      Settings.write("RSForBaseFuzziness", DataType_Real64, this.RSForBaseFuzziness);
      Settings.write("RSForBaseSmoothness", DataType_Real64, this.RSForBaseSmoothness);


      Settings.write(
         "useRangeSelectionsForLargeStars",
         DataType_Boolean,
         this.useRangeSelectionsForLargeStars
      );

      for (var i = 0; i < this.totalRangeSelections; i++) {
         Settings.write("RSEnabled" + i, DataType_Boolean, this.rangeSelectionsUsed[i]);
         Settings.write("RSLowerLimit" + i, DataType_Real64, this.rangeSelectionLowerLimits[i]);
         Settings.write("RSUpperLimit" + i, DataType_Real64, this.rangeSelectionUpperLimits[i]);
         Settings.write("RSFuzziness" + i, DataType_Real64, this.rangeSelectionFuzziness[i]);
         Settings.write("RSSmoothness" + i, DataType_Real64, this.rangeSelectionSmoothness[i]);
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

      if (Parameters.has("SMThreshold")) {
         this.SMThreshold = this.defaultNumeric(
            Parameters.getReal("SMThreshold"),
            0.0,
            1.0,
            this.defSMThreshold
         );
      }

      if (Parameters.has("SMScale")) {
         this.SMScale = this.defaultNumeric(
            Parameters.getReal("SMScale"),
            2,
            12,
            this.defSMScale
         );
      }

      if (Parameters.has("SMLargeScale")) {
         this.SMLargeScale = this.defaultNumeric(
            Parameters.getReal("SMLargeScale"),
            0,
            15,
            this.defSMLargeScale
         );
      }

      if (Parameters.has("SMSmallScale")) {
         this.SMLargerScale = this.defaultNumeric(
            Parameters.getReal("SMSmallScale"),
            0,
            15,
            this.defSMSmallScale
         );
      }

      if (Parameters.has("SMCompensation")) {
         this.SMCompensation = this.defaultNumeric(
            Parameters.getReal("SMCompensation"),
            1,
            4,
            this.defSMCompensation
         );
      }

      if (Parameters.has("SMSmoothness")) {
         this.SMSmoothness = this.defaultNumeric(
            Parameters.getReal("SMSmoothness"),
            1,
            4,
            this.defSMSmoothness
         );
      }

      if (Parameters.has("useRSForBase")) {
         this.useRSForBase = this.defaultBoolean(
            Parameters.getBoolean("useRSForBase"),
            this.defUseRSForBase
         );
      }

      if (Parameters.has("RSForBaseLowerLimit")) {
         this.RSForBaseLowerLimit = this.defaultNumeric(
            Parameters.getReal("RSForBaseLowerLimit"),
            0.0,
            1.0,
            this.defRSForBaseLowerLimit
         );
      }
      if (Parameters.has("RSForBaseUpperLimit")) {
         this.RSForBaseUpperLimits = this.defaultNumeric(
            Parameters.getReal("RSForBaseUpperLimit"),
            0.0,
            1.0,
            this.defRSForBaseUpperLimit
         );
      }
      if (Parameters.has("RSForBaseFuzziness")) {
         this.RSForBaseFuzziness = this.defaultNumeric(
            Parameters.getReal("RSForBaseFuzziness"),
            0.0,
            1.0,
            this.defRSForBaseFuzziness
         );
      }
      if (Parameters.has("RSForBaseSmoothness")) {
         this.RSForBaseSmoothness = this.defaultNumeric(
            Parameters.getReal("RSForBaseSmoothness"),
            0.0,
            100.0,
            this.defRSForBaseSmoothness
         );
      }

      if (Parameters.has("useRangeSelectionsForLargeStars")) {
         this.useRangeSelectionsForLargeStars = this.defaultBoolean(
            Parameters.getBoolean("useRangeSelectionsForLargeStars"),
            this.defUseRangeSelectionsForLargeStars
         );
      }

      for (var i = 0; i < this.totalRangeSelections; i++) {
         if (Parameters.has("RSEnabled" + i)) {
            this.rangeSelectionsUsed[i] = this.defaultBoolean(
               Parameters.getBoolean("RSEnabled" + i),
               this.defRangeSelectionsUsed[i]
            );
         }
         if (Parameters.has("RSLowerLimit" + i)) {
            this.rangeSelectionLowerLimits[i] = this.defaultNumeric(
               Parameters.getReal("RSLowerLimit" + i),
               0.0,
               1.0,
               this.defRangeSelectionLowerLimits[i]
            );
         }
         if (Parameters.has("RSUpperLimit" + i)) {
            this.rangeSelectionUpperLimits[i] = this.defaultNumeric(
               Parameters.getReal("RSUpperLimit" + i),
               0.0,
               1.0,
               this.defRangeSelectionUpperLimits[i]
            );
         }
         if (Parameters.has("RSFuzziness" + i)) {
            this.rangeSelectionFuzziness[i] = this.defaultNumeric(
               Parameters.getReal("RSFuzziness" + i),
               0.0,
               1.0,
               this.defRangeSelectionFuzziness[i]
            );
         }
         if (Parameters.has("RSSmoothness" + i)) {
            this.rangeSelectionSmoothness[i] = this.defaultNumeric(
               Parameters.getReal("RSSmoothness" + i),
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
      Parameters.set("SMThreshold", this.SMThreshold);
      Parameters.set("SMScale", this.SMScale);
      Parameters.set("SMLargeScale", this.SMLargeScale);
      Parameters.set("SMSmallScale", this.SMSmallScale);
      Parameters.set("SMCompensation", this.SMCompensation);
      Parameters.set("SMSmoothness", this.SMSmoothness);

      Parameters.set("useRSForBase", this.useRSForBase);
      Parameters.set("RSForBaseLowerLimit", this.RSForBaseLowerLimit);
      Parameters.set("RSForBaseUpperLimit", this.RSForBaseUpperLimit);
      Parameters.set("RSForBaseFuzziness", this.RSForBaseFuzziness);
      Parameters.set("RSForBaseSmoothness", this.RSForBaseSmoothness);

      Parameters.set("useRangeSelectionsForLargeStars", this.useRangeSelectionsForLargeStars);

      for (var i = 0; i < this.totalRangeSelections; i++) {
         Parameters.set("RSEnabled" + i, this.rangeSelectionsUsed[i]);
         Parameters.set("RSLowerLimit" + i, this.rangeSelectionLowerLimits[i]);
         Parameters.set("RSUpperLimit" + i, this.rangeSelectionUpperLimits[i]);
         Parameters.set("RSFuzziness" + i, this.rangeSelectionFuzziness[i]);
         Parameters.set("RSSmoothness" + i, this.rangeSelectionSmoothness[i]);
      }

   };

   // Clears the model.
   this.clear = function() {
      this.imageView = null;
   };
}
