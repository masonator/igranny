init:
	drive init ./files

app:
	ifeq ($(UNAME_S),Darwin)
		bash -c "./node_modules/electron/dist/Electron.app/Contents/MacOS/Electron ./"
  endif
	ifeq ($(UNAME_S),Darwin)
		bash -c "./node_modules/electron/dist/Electron.app/Contents/MacOS/Electron ./"
	endif
