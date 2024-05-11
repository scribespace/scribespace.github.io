@echo off
setlocal

:: Set the root folder variable
set ROOT_FOLDER=.\libs\lexical

:: Iterate over directories in the root folder
for /d %%D in (%ROOT_FOLDER%\*) do npm install %%D\npm

npm install

endlocal
