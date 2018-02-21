#
#  Makefile
#
VERSION = 1.2.1
SOURCE_TARGET = src/scripts/DSOMask
DOC_TARGET = doc/scripts/DSOMask
RELEASE_TARGETS = $(SOURCE_TARGET) $(DOC_TARGET) install-how-to.txt LICENSE README.md

PI_DIR = /Applications/PixInsight

#
# library routines
#
release: tar zip

install: doc_install script_install

doc_install:
	cp -rvf $(DOC_TARGET)/* $(PI_DIR)/doc/scripts/DSOMask

script_install:
	cp -rvf $(SOURCE_TARGET)/* $(PI_DIR)/src/scripts/DSOMask

tar:
	tar cvzf ../../release/DSOMask/DSOMask.$(VERSION).tar.gz $(TARGETS)

zip:
	zip -r ../../release/DSOMask/DSOMask.$(VERSION).zip $(TARGETS)
