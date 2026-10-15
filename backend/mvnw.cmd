@echo off
set "MVN_BIN=%~dp0mvn_dist\apache-maven-3.9.6\bin\mvn.cmd"
if exist "%MVN_BIN%" (
    "%MVN_BIN%" %*
) else (
    mvn %*
)
