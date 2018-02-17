
// Throws an error if assertion does not hold.
function assert(assertion, message) {
   if (!assertion) {
      throw new Error("Assertion failed: " + message);
   }
}

// Filters a view id to match ^[_a-zA-Z][_a-zA-Z0-9]*$ by replacing invalid
// characters by "_".
function filterViewId(viewId) {
   return viewId.trim() == "" ?
      "_" :
      viewId.trim().replace(/[^_a-zA-Z0-9]/g, '_').replace(/^[^_a-zA-Z]/, '_');
}

// Gives a unique view id with base id by appending a suffix.
function uniqueViewId(baseId) {
   var viewId = baseId.replace("->", "_");
   for (var i = 1; !View.viewById(viewId).isNull; ++i) {
      viewId = baseId.replace("->", "_") + format("_%d", i);
   }

   return viewId;
}

// Dynamic methods for core Control object.
if (!Control.prototype.logicalPixelsToPhysical) {
   Control.prototype.logicalPixelsToPhysical = function(s) {
      return Math.round(s);
   };
}

if (!Control.prototype.setScaledFixedSize) {
   Control.prototype.setScaledFixedSize = function(w, h) {
      this.setFixedSize(w, h);
   };
}

if (!Control.prototype.scaledResource) {
   Control.prototype.scaledResource = function(r) {
      return r;
   };
}

// Dynamic methods for core Sizer object.
if (!Sizer.prototype.addUnscaledSpacing) {
   Sizer.prototype.addUnscaledSpacing = function(s) {
      this.addSpacing(s);
   };
}
