#
#  Makefile
#
VERSION = 1.2.1

TARGETS = src/scripts/DSOMask doc/scripts/DSOMask install-how-to.txt LICENSE README.md
#
# library routines
#
all: tar zip

tar:
	tar cvzf ../../release/DSOMask/DSOMask.$(VERSION).tar.gz $(TARGETS)

zip:
	zip -r ../../release/DSOMask/DSOMask.$(VERSION).zip $(TARGETS)
