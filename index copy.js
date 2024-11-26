function hexToBinary(hex) {
    return hex.split('').map(char => parseInt(char, 16).toString(2).padStart(4, '0')).join('');
}

function epcToGs1(epcHex) {
    // Convert hex to binary
    const epcBinary = hexToBinary(epcHex);
    console.log("Binary EPC:", epcBinary);

    // Extract components based on SGTIN-96 format
    const header = epcBinary.slice(0, 8);              // Header (8 bits)
    const filter = epcBinary.slice(8, 11);             // Filter (3 bits)
    const partition = parseInt(epcBinary.slice(11, 14), 2); // Partition (3 bits)
    console.log(`Partition: ${partition}`);

    // Define the lengths based on partition value
    const companyPrefixBits = [40, 37, 34, 30, 27, 24, 20][partition];
    const itemReferenceBits = [4, 7, 10, 14, 17, 20, 24][partition];

    // Extract the binary segments for company prefix and item reference
    const companyPrefixBinary = epcBinary.slice(14, 14 + companyPrefixBits);
    const itemReferenceBinary = epcBinary.slice(14 + companyPrefixBits, 14 + companyPrefixBits + itemReferenceBits);
    const serialNumberBinary = epcBinary.slice(58); // Remaining bits for Serial Number

    // Convert binary components to decimal
    const companyPrefix = parseInt(companyPrefixBinary, 2);
    const itemReference = parseInt(itemReferenceBinary, 2);
    const serialNumber = parseInt(serialNumberBinary, 2);

    // Format GTIN and Serial Number as per GS1 standards
    // Ensure exact padding for both parts of GTIN
    const companyPrefixStr = companyPrefix.toString().padStart(Math.ceil(companyPrefixBits / 3.32), '0'); // Calculate exact length for company prefix
    const itemReferenceStr = itemReference.toString().padStart(Math.ceil(itemReferenceBits / 3.32), '0'); // Calculate exact length for item reference

    // Combine prefix and reference to form GTIN, ensuring exactly 14 digits
    const gtin14 = `${companyPrefixStr}${itemReferenceStr}`.padStart(14, '0');

    console.log("Company Prefix Binary:", companyPrefixBinary);
    console.log("Item Reference Binary:", itemReferenceBinary);
    console.log("Company Prefix (Decimal):", companyPrefixStr);
    console.log("Item Reference (Decimal):", itemReferenceStr);
    console.log("GTIN (final):", gtin14);

    return `GTIN: ${gtin14}, Serial Number: ${serialNumber}`;
}

// Example EPC in hexadecimal format
const epcHex = "30361FC3D02BE0574876E866";
const gs1Key = epcToGs1(epcHex);

console.log(gs1Key);