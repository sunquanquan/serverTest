@echo off
cd %cd%/protocol/protobuf
echo %cd%
protoc --js_out=import_style=commonjs,binary:../../serverJS/protocol/protobuf buftest.proto
cd ../..
pause