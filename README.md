EPC Encoder Decoder

This utility decodes a hexadecimal (hex) string into a GS1 element string, extracting the GTIN and serial number.

-> How to Run the File
=> Open the file directory in the command line.
Run the following command: node index.js

How to Generate the Executable (EXE) File and Run It
Open the file directory in the command line.

Use the following command to generate the EXE file: 
    pkg index.js --targets node18-win-x64 --output epc_en_dec.exe
    
To execute the EXE file, run the following command:
    epc_en_dec.exe    

