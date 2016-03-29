@echo off
echo.
echo Creating documentation....
echo.

SET WORK=MKDOC_TEMP
mkdir %WORK%
copy ..\cTable.ahk %WORK%

::path to the natural doc folder
SET NDPATH=d:\Usr\programme\NaturalDocs\

pushd %WORK%

::project root path
SET ROOT=%CD%

::documentation folder
SET DOC=_doc

mkdir "%ROOT%\%DOC%\_ndProj" 2>nul
pushd "%NDPATH%"
if exist "%ROOT%\images" SET IMG=-img "%ROOT%\images"

call NaturalDocs.exe -i "%ROOT%" -o HTML "%ROOT%\%DOC%" -p "%ROOT%\%DOC%\_ndProj" %IMG%

popd

if "%1" == "s" (
echo Merging html files ...
mkdocs
rmdir /Q /S _doc
echo Done.
echo.
)

popd

ECHO Publish documentation to gh-page branch ...
pushd ..
rmdir /S /Q gh-pages_NEW
MKDIR gh-pages_NEW
popd
pushd ..\gh-pages_NEW
xcopy /E /Y %ROOT%\%DOC% .
popd
rmdir /S /Q %WORK%
