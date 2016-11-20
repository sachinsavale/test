@echo off
setlocal

set CP=%AXIS_HOME%\lib\axis.jar;%CP%
set CP=%AXIS_HOME%\lib\jaxrpc.jar;%CP%
set CP=%AXIS_HOME%\lib\commons-logging-1.0.4.jar;%CP%
set CP=%AXIS_HOME%\lib\commons-discovery-0.2.jar;%CP%
set CP=%AXIS_HOME%\lib\wsdl4j-1.5.1.jar;%CP%
set CP=%AXIS_HOME%\lib\saaj.jar;%CP%
set CP=build;%CP%
set CP=build.generated;%CP%
set CP=.\;%CP%

ECHO Using Classpath:
ECHO %CP%

cd ..

java -cp "%CP%" com.netsuite.webservices.samples.NSClientERP

