function hexToBinary(hex) {
    return hex.split('').map(char => parseInt(char, 16).toString(2).padStart(4, '0')).join('');
}

function checkDigitCalculator(barcode) {
    let sumEven = 0;
    let sumOdd = 0;

    // Extract the last digit (check digit)
    const lastDigit = barcode.slice(-1);
    const codeArr = barcode.slice(0, -1).split('').reverse();

    for (let i = 0; i < codeArr.length; i++) {
        if (i % 2 === 0) {
            sumOdd += parseInt(codeArr[i]) * 3;
        } else {
            sumEven += parseInt(codeArr[i]);
        }
    }

    let checkDigit = (sumEven + sumOdd) % 10;
    checkDigit = checkDigit === 0 ? checkDigit : 10 - checkDigit;

    return checkDigit;
}


function epcDecoder(epcHex) {
    // Convert hex to binary
    //const epcBinary = '001100000011011000011111110000111101000001011010110001001001011101001000011101101110100001111100';
    const epcBinary = hexToBinary(epcHex);
    
    const header = epcBinary.slice(0, 8);              // Header (8 bits)
    const filter = epcBinary.slice(8, 11);             // Filter (3 bits)
    const partition = epcBinary.slice(11, 14);         // Partition (3 bits)
    const partitionDecimal = parseInt(partition, 2);
    let companyPrefixBinary = '';
    let indicatorItemReferenceBinary = '';
   
    if(partitionDecimal === 0){
        companyPrefixBinary = epcBinary.slice(14, 54); // GS1 Company Prefix (40 bits)
        indicatorItemReferenceBinary = epcBinary.slice(54, 58); // indicator/item reference (4 bits)
    }else if(partitionDecimal === 1){
        companyPrefixBinary = epcBinary.slice(14, 51); // GS1 Company Prefix (37 bits)
        indicatorItemReferenceBinary = epcBinary.slice(51, 58); // indicator/item reference (7 bits)
    }else if(partitionDecimal === 2){
        companyPrefixBinary = epcBinary.slice(14, 48); // GS1 Company Prefix (34 bits)
        indicatorItemReferenceBinary = epcBinary.slice(48, 58); // indicator/item reference (10 bits)
    }else if(partitionDecimal === 3){
        companyPrefixBinary = epcBinary.slice(14, 44); // GS1 Company Prefix (30 bits)
        indicatorItemReferenceBinary = epcBinary.slice(44, 58); // indicator/item reference (14 bits)
    }else if(partitionDecimal === 4){
        companyPrefixBinary = epcBinary.slice(14, 41); // GS1 Company Prefix (27 bits)
        indicatorItemReferenceBinary = epcBinary.slice(41, 58); // indicator/item reference (17 bits)
    }else if(partitionDecimal === 5){
        companyPrefixBinary = epcBinary.slice(14, 38); // GS1 Company Prefix (24 bits)
        indicatorItemReferenceBinary = epcBinary.slice(38, 58); // indicator/item reference (20 bits)
    }else if(partitionDecimal === 6){
        companyPrefixBinary = epcBinary.slice(14, 34); // GS1 Company Prefix (20 bits)
        indicatorItemReferenceBinary = epcBinary.slice(34, 58); // indicator/item reference (24 bits)
    }
    
    const serialNumberBinary = epcBinary.slice(58);    // Serial Number (38 bits)

    // Convert binary components to decimal
    const headerDecimal = parseInt(header, 2);
    const filterDecimal = parseInt(filter, 2);
    const companyPrefixDecimal = parseInt(companyPrefixBinary, 2);
    const itemReferenceDecimal = parseInt(indicatorItemReferenceBinary, 2);
    const serialNumberDecimal = parseInt(serialNumberBinary, 2);
    
    const temp_gtin = `${companyPrefixDecimal}${itemReferenceDecimal}`;
    const gtin_str = `${temp_gtin}0`;
    const chckval =  checkDigitCalculator(gtin_str);

    const gtin = `${temp_gtin}${chckval}`;

    // EPC Tag URI
    const epc_tag_uri = `urn:epc:tag:sgtin-96:${filterDecimal}.${companyPrefixDecimal}.0${itemReferenceDecimal}.${serialNumberDecimal}`;

    // EPC URI
    const epc_uri = `urn:epc:id:sgtin:${companyPrefixDecimal}.0${itemReferenceDecimal}.${serialNumberDecimal}`;

    // GS1 Digital Link URI
    const gs1_digilink_uri = `https://id.gs1.org/01/0${gtin}/21/${serialNumberDecimal}`;

    // Format GTIN as per urn:epc:tag:sgtin-96
    const gs1_element_string = `(01)0${gtin}(21)${serialNumberDecimal}`;
    
    return gs1_element_string;  // Return the full GTIN as per the urn format
}


// Example EPC in hexadecimal format
const epcHex = "30361FC3D05AC4974876E865";  // Replace with actual EPC value
const epc_decode = epcDecoder(epcHex);

console.log(epc_decode);