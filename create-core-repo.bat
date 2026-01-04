@echo off
echo ========================================
echo Push-Up League Core Repository Setup
echo ========================================
echo.
echo This will open GitHub in your browser to create the PRIVATE repository.
echo.
echo IMPORTANT:
echo   - Repository name: Push_Up_League_Core
echo   - Visibility: PRIVATE (not public!)
echo   - Do NOT initialize with README
echo.
pause
echo Opening GitHub...
start https://github.com/new
echo.
echo After creating the repository, press any key to push the code...
pause
echo.
echo Pushing core module to GitHub...
cd "Push Up League Final\pushup-league-core"
git push -u origin main
echo.
echo Done! Core module pushed successfully.
echo.
pause
