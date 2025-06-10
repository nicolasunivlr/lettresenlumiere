@echo off
setlocal enabledelayedexpansion

REM Verifier si PHP est dans le PATH
where php >nul 2>nul
if %errorlevel% equ 0 (
    set "PHP_EXE=php"
    goto :execute
)

REM Chercher PHP dans WAMP
set "PHP_PATH=..\..\bin\php"
set "PHP_FOUND="

REM Chercher en priorité PHP 8.2.26 exactement
if exist "%PHP_PATH%\php8.2.26\php.exe" (
    set "PHP_FOUND=%PHP_PATH%\php8.2.26\php.exe"
    set "PHP_VER=8.2.26"
    goto :version_found
)

REM Chercher n'importe quelle version 8.2.x
for /d %%p in ("%PHP_PATH%\php8.2*") do (
    set "VERSION=%%~np"
    set "VERSION=!VERSION:~3!"
    set "PHP_FOUND=%%p\php.exe"
    set "PHP_VER=!VERSION!"
    goto :version_found
)

REM Copier le fichier d'alias pour le projet
copy lettresenlumiere.conf ..\..\alias\

:version_found
if "!PHP_FOUND!"=="" (
    echo PHP non trouve.
    goto :end
) else (
    set "PHP_EXE=!PHP_FOUND!"
    echo Version PHP selectionnee: !PHP_VER!
)

:execute
echo Execution avec !PHP_EXE!...
"!PHP_EXE!" ./script.php ./bdd.sql
echo Termine.
pause

:end
endlocal
