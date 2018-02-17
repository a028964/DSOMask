#define TITLE "DSOMask"
#define VERSION "1.1"

#feature-id Utilities > DSOMask

#feature-info <b>DSO Mask Version 1.1</b><br/>\
   <br/>\
   Script for mask generation.<br/>\
   <br/>\
   Copyright &copy; 2018 Bradley Craig. All Rights Reserved.<br/>

#include <pjsr/DataType.jsh>
#include <pjsr/FontFamily.jsh>
#include <pjsr/FrameStyle.jsh>
#include <pjsr/SampleType.jsh>
#include <pjsr/Sizer.jsh>
#include <pjsr/StdButton.jsh>
#include <pjsr/StdIcon.jsh>
#include <pjsr/TextAlign.jsh>
#include <pjsr/UndoFlag.jsh>
#include <pjsr/NumericControl.jsh>
#include <pjsr/ColorSpace.jsh>

#include "Global.js"
#include "MainModel.js"
#include "MainViewController.js"
#include "MaskGenerator.js"

function main() {
   console.hide();

   var model = new MainModel();

   model.loadSettings();
   model.loadParameters();

   var controller = new MainController(model, Parameters.isViewTarget);

   var view = new MainView(model, controller);
   controller.setView(view)
   if (Parameters.isViewTarget) {
      controller.setImageView(Parameters.targetView);
   }
   else {
      controller.setImageView(ImageWindow.activeWindow.currentView);
   }

   console.abortEnabled = true;
   for (;!console.abortRequested;) {
      console.abortEnabled = true;
      controller.execute();
      if ((new MessageBox(
         "Do you really want to dismiss " + TITLE + "?",
         TITLE,
         StdIcon_Question,
         StdButton_No,
         StdButton_Yes
      )).execute() == StdButton_Yes) {
         console.abortEnabled = false;
         break;
      }
   }

   model.storeSettings();
   model.clear();
}

main();

gc();
