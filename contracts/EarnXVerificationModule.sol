// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {FunctionsClient} from "@chainlink/contracts/src/v0.8/functions/v1_0_0/FunctionsClient.sol";
import {FunctionsRequest} from "@chainlink/contracts/src/v0.8/functions/v1_0_0/libraries/FunctionsRequest.sol";

/**
 * @title EarnXVerificationFixed
 * @notice Stack-safe EarnX verification module
 */
contract EarnXVerificationModule is FunctionsClient {
    using FunctionsRequest for FunctionsRequest.Request;
    
    // ============ STATE VARIABLES ============
    uint64 public immutable i_functionsSubscriptionId;
    uint32 public gasLimit = 300000;
    bytes32 public donID = 0x66756e2d657468657265756d2d7365706f6c69612d3100000000000000000000;
    
    address public coreContract;
    bytes32 public s_lastRequestId;
    bytes public s_lastResponse;
    bytes public s_lastError;
    
    mapping(bytes32 => uint256) public functionsRequestToInvoice;
    mapping(uint256 => bool) public isVerified;
    mapping(uint256 => bool) public isValid;
    mapping(uint256 => uint256) public riskScore;
    mapping(uint256 => string) public creditRating;
    mapping(uint256 => string) public verificationDetails;
    mapping(uint256 => uint256) public verificationTimestamp;
    
    // ============ EVENTS ============
    event DocumentVerificationRequested(uint256 indexed invoiceId, bytes32 indexed requestId);
    event DocumentVerificationCompleted(uint256 indexed invoiceId, bool isValid, uint256 riskScore);
    event FunctionsResponse(bytes32 indexed requestId, bytes response, bytes err);
    
    // ============ MODIFIERS ============
    modifier onlyCoreContract() {
        require(msg.sender == coreContract, "Only core contract");
        _;
    }
    
    // ============ LIVE API VERIFICATION SOURCE ============
    string public constant VERIFICATION_SOURCE = 
        "const invoiceId = args[0];"
        "const documentHash = args[1];"
        "const commodity = args[2];"
        "const amount = args[3];"
        "const supplierCountry = args[4];"
        "const buyerCountry = args[5];"
        "const request = Functions.makeHttpRequest({"
        "url: 'https://earnx-verification-api.onrender.com/api/v1/verification/verify-minimal',"
        "method: 'POST',"
        "headers: {'Content-Type': 'application/json', 'X-API-Key': secrets.apiKey},"
        "data: {invoiceId, documentHash, commodity, amount: parseInt(amount), supplierCountry, buyerCountry}"
        "});"
        "const response = await request;"
        "if (response.error) throw Error('API Error');"
        "const result = response.data;"
        "return Functions.encodeString(`${result.isValid ? 1 : 0},${result.riskScore},${result.creditRating}`);";
    
    // ============ CONSTRUCTOR ============
    constructor(uint64 _functionsSubscriptionId) 
        FunctionsClient(0xb83E47C2bC239B3bf370bc41e1459A34b41238D0) {
        i_functionsSubscriptionId = _functionsSubscriptionId;
    }
    
    function setCoreContract(address _coreContract) external {
        require(coreContract == address(0), "Core contract already set");
        coreContract = _coreContract;
    }
    
    // ============ SIMPLIFIED VERIFICATION ============
    function startDocumentVerification(
        uint256 invoiceId,
        string memory documentHash,
        string memory commodity,
        uint256 amount,
        string memory supplierCountry,
        string memory buyerCountry,
        string memory exporterName,
        string memory buyerName
    ) external onlyCoreContract returns (bytes32) {
        
        FunctionsRequest.Request memory req;
        req.initializeRequestForInlineJavaScript(VERIFICATION_SOURCE);
        
        string[] memory args = new string[](6);
        args[0] = _toString(invoiceId);
        args[1] = documentHash;
        args[2] = commodity;
        args[3] = _toString(amount);
        args[4] = supplierCountry;
        args[5] = buyerCountry;
        req.setArgs(args);
        
        s_lastRequestId = _sendRequest(
            req.encodeCBOR(),
            i_functionsSubscriptionId,
            gasLimit,
            donID
        );
        
        functionsRequestToInvoice[s_lastRequestId] = invoiceId;
        
        emit DocumentVerificationRequested(invoiceId, s_lastRequestId);
        
        return s_lastRequestId;
    }
    
    // ============ TEST FUNCTION ============
    function testDirectRequest() external returns (bytes32) {
        FunctionsRequest.Request memory req;
        req.initializeRequestForInlineJavaScript(VERIFICATION_SOURCE);
        
        string[] memory args = new string[](1);
        args[0] = "999";
        req.setArgs(args);
        
        s_lastRequestId = _sendRequest(
            req.encodeCBOR(),
            i_functionsSubscriptionId,
            gasLimit,
            donID
        );
        
        functionsRequestToInvoice[s_lastRequestId] = 999;
        
        emit DocumentVerificationRequested(999, s_lastRequestId);
        
        return s_lastRequestId;
    }
    
    // ============ FULFILLMENT ============
    function fulfillRequest(
        bytes32 requestId,
        bytes memory response,
        bytes memory err
    ) internal override {
        s_lastResponse = response;
        s_lastError = err;
        
        emit FunctionsResponse(requestId, response, err);
        
        uint256 invoiceId = functionsRequestToInvoice[requestId];
        if (invoiceId == 0) return;
        
        isVerified[invoiceId] = true;
        verificationTimestamp[invoiceId] = block.timestamp;
        
        if (err.length == 0 && response.length > 0) {
            // Parse response
            string memory responseStr = string(response);
            
            if (_contains(bytes(responseStr), "\"isValid\":true")) {
                isValid[invoiceId] = true;
                riskScore[invoiceId] = 25;
                creditRating[invoiceId] = "A";
                verificationDetails[invoiceId] = "EarnX verification passed";
            } else {
                isValid[invoiceId] = false;
                riskScore[invoiceId] = 99;
                creditRating[invoiceId] = "ERROR";
                verificationDetails[invoiceId] = "EarnX verification failed";
            }
            
            emit DocumentVerificationCompleted(invoiceId, isValid[invoiceId], riskScore[invoiceId]);
            
            // Callback to core contract
            if (coreContract != address(0)) {
                try IIEarnXCore(coreContract).onDocumentVerificationComplete(
                    invoiceId, 
                    isValid[invoiceId], 
                    riskScore[invoiceId], 
                    creditRating[invoiceId]
                ) {
                    // Success
                } catch {
                    // Failed but continue
                }
            }
        } else {
            isValid[invoiceId] = false;
            riskScore[invoiceId] = 99;
            creditRating[invoiceId] = "ERROR";
            verificationDetails[invoiceId] = "Service error";
            
            emit DocumentVerificationCompleted(invoiceId, false, 99);
        }
    }
    
    // ============ HELPERS ============
    function _contains(bytes memory data, string memory target) internal pure returns (bool) {
        bytes memory targetBytes = bytes(target);
        if (data.length < targetBytes.length) return false;
        
        for (uint i = 0; i <= data.length - targetBytes.length; i++) {
            bool found = true;
            for (uint j = 0; j < targetBytes.length; j++) {
                if (data[i + j] != targetBytes[j]) {
                    found = false;
                    break;
                }
            }
            if (found) return true;
        }
        return false;
    }
    
    function _toString(uint256 value) internal pure returns (string memory) {
        if (value == 0) return "0";
        uint256 temp = value;
        uint256 digits;
        while (temp != 0) {
            digits++;
            temp /= 10;
        }
        bytes memory buffer = new bytes(digits);
        while (value != 0) {
            digits -= 1;
            buffer[digits] = bytes1(uint8(48 + uint256(value % 10)));
            value /= 10;
        }
        return string(buffer);
    }
    
    // ============ VIEW FUNCTIONS ============
    function getDocumentVerification(uint256 invoiceId) external view returns (
        bool verified,
        bool valid,
        string memory details,
        uint256 risk,
        string memory rating,
        uint256 timestamp
    ) {
        return (
            isVerified[invoiceId],
            isValid[invoiceId],
            verificationDetails[invoiceId],
            riskScore[invoiceId],
            creditRating[invoiceId],
            verificationTimestamp[invoiceId]
        );
    }
    
    function getLastFunctionsResponse() external view returns (
        bytes32 lastRequestId,
        bytes memory lastResponse,
        bytes memory lastError
    ) {
        return (s_lastRequestId, s_lastResponse, s_lastError);
    }
    
    function getFunctionsConfig() external view returns (
        address router,
        uint64 subscriptionId,
        uint32 gasLimitConfig,
        bytes32 donIdConfig
    ) {
        return (
            0xb83E47C2bC239B3bf370bc41e1459A34b41238D0,
            i_functionsSubscriptionId,
            gasLimit,
            donID
        );
    }
}

// Interface for core contract callback
interface IIEarnXCore {
    function onDocumentVerificationComplete(
        uint256 invoiceId,
        bool isValid,
        uint256 riskScore,
        string memory creditRating
    ) external;
}


// pragma solidity 0.8.19;

// import {FunctionsClient} from "@chainlink/contracts@1.4.0/src/v0.8/functions/v1_0_0/FunctionsClient.sol";
// import {FunctionsRequest} from "@chainlink/contracts@1.4.0/src/v0.8/functions/v1_0_0/libraries/FunctionsRequest.sol";

// // ============ INTERFACE FOR CORE CONTRACT ============
// interface IYieldXCore {
//     function onDocumentVerificationComplete(
//         uint256 invoiceId,
//         bool isValid,
//         uint256 riskScore,
//         string memory creditRating
//     ) external;
// }

// contract EarnXVerificationModule is FunctionsClient {
//     using FunctionsRequest for FunctionsRequest.Request;
    
//     // ============ STATE VARIABLES ============
//     uint64 public immutable i_functionsSubscriptionId;
//     uint32 public gasLimit = 300000;
//     bytes32 public donID = 0x66756e2d657468657265756d2d7365706f6c69612d3100000000000000000000;
    
//     address public owner;
//     address public coreContract;
//     bytes32 public s_lastRequestId;
//     bytes public s_lastResponse;
//     bytes public s_lastError;
    
//     mapping(bytes32 => uint256) public functionsRequestToInvoice;
//     mapping(uint256 => bool) public isVerified;
//     mapping(uint256 => bool) public isValid;
//     mapping(uint256 => uint256) public riskScore;
//     mapping(uint256 => string) public creditRating;
//     mapping(uint256 => string) public verificationDetails;
//     mapping(uint256 => uint256) public verificationTimestamp;
    
//     // ============ EVENTS ============
//     event DocumentVerificationRequested(uint256 indexed invoiceId, bytes32 indexed requestId);
//     event DocumentVerificationCompleted(uint256 indexed invoiceId, bool isValid, uint256 riskScore);
//     event FunctionsResponse(bytes32 indexed requestId, bytes response, bytes err);
//     event CoreContractUpdated(uint256 indexed invoiceId, bool isValid, uint256 riskScore);
    
//     modifier onlyOwner() {
//         require(msg.sender == owner, "Only owner");
//         _;
//     }
    
//     // ✅ REMOVED: No access restrictions - anyone can call verification
//     // modifier onlyAuthorized() - REMOVED for public access
    
//     // ============ FIXED SOURCE - HANDLE JSON RESPONSE ============
//     string source =
//         "const invoiceId = args[0];"
//         "const documentHash = args[1];"
//         "const apiResponse = await Functions.makeHttpRequest({"
//         "url: 'https://yieldx.onrender.com/api/v1/verification/verify-minimal',"
//         "method: 'POST',"
//         "headers: {'Content-Type': 'application/json'},"
//         "data: {"
//         "invoiceId: invoiceId,"
//         "documentHash: documentHash,"
//         "commodity: args[2] || 'Coffee',"
//         "amount: parseInt(args[3]) || 50000,"
//         "supplierCountry: args[4] || 'Kenya',"
//         "buyerCountry: args[5] || 'USA',"
//         "exporterName: args[6] || 'Test Exporter',"
//         "buyerName: args[7] || 'Test Buyer'"
//         "}"
//         "});"
//         "if (apiResponse.error) {"
//         "return Functions.encodeString('0,99,ERROR');"
//         "}"
//         "const { data } = apiResponse;"
//         "return Functions.encodeString(data.result);";
    
//     // ============ CONSTRUCTOR ============
//     constructor(uint64 _functionsSubscriptionId) 
//         FunctionsClient(0xb83E47C2bC239B3bf370bc41e1459A34b41238D0) {
//         i_functionsSubscriptionId = _functionsSubscriptionId;
//         owner = msg.sender;
//     }
    
//     // ✅ CORE CONTRACT SETTER
//     function setCoreContract(address _coreContract) external onlyOwner {
//         require(_coreContract != address(0), "Core contract cannot be zero address");
//         coreContract = _coreContract;
//     }
    
//     // ============ MAIN VERIFICATION FUNCTION - ✅ FIXED ============
//     function startDocumentVerification(
//         uint256 invoiceId,
//         string memory documentHash,
//         string memory commodity,
//         uint256 amount,
//         string memory supplierCountry,
//         string memory buyerCountry,
//         string memory exporterName,
//         string memory buyerName
//     ) external returns (bytes32) { // ✅ PUBLIC ACCESS - anyone can call
//         FunctionsRequest.Request memory req;
//         req.initializeRequestForInlineJavaScript(source);
        
//         // Use REAL form data instead of hardcoded test data
//         string[] memory args = new string[](8);
//         args[0] = _toString(invoiceId);        // Real invoice ID from form
//         args[1] = documentHash;                // Real document hash
//         args[2] = commodity;                   // Real commodity (Coffee, Tea, etc.)
//         args[3] = _toString(amount);           // Real amount from form
//         args[4] = supplierCountry;             // Real supplier country
//         args[5] = buyerCountry;                // Real buyer country  
//         args[6] = exporterName;                // Real exporter name
//         args[7] = buyerName;                   // Real buyer name
//         req.setArgs(args);
        
//         s_lastRequestId = _sendRequest(
//             req.encodeCBOR(),
//             i_functionsSubscriptionId,
//             gasLimit,
//             donID
//         );
        
//         functionsRequestToInvoice[s_lastRequestId] = invoiceId;
        
//         emit DocumentVerificationRequested(invoiceId, s_lastRequestId);
        
//         return s_lastRequestId;
//     }
    
//     // ============ HELPER FOR UINT TO STRING CONVERSION ============
//     function _toString(uint256 value) internal pure returns (string memory) {
//         if (value == 0) {
//             return "0";
//         }
//         uint256 temp = value;
//         uint256 digits;
//         while (temp != 0) {
//             digits++;
//             temp /= 10;
//         }
//         bytes memory buffer = new bytes(digits);
//         while (value != 0) {
//             digits -= 1;
//             buffer[digits] = bytes1(uint8(48 + uint256(value % 10)));
//             value /= 10;
//         }
//         return string(buffer);
//     }
    
//     // ============ TEST FUNCTIONS ============
//     function testDirectRequest() external returns (bytes32) {
//         FunctionsRequest.Request memory req;
//         req.initializeRequestForInlineJavaScript(source);
        
//         string[] memory args = new string[](8);
//         args[0] = "999";
//         args[1] = "test_hash_123";
//         args[2] = "Coffee";
//         args[3] = "50000";
//         args[4] = "Kenya";
//         args[5] = "USA";
//         args[6] = "Test Exporter";
//         args[7] = "Test Buyer";
//         req.setArgs(args);
        
//         s_lastRequestId = _sendRequest(
//             req.encodeCBOR(),
//             i_functionsSubscriptionId,
//             gasLimit,
//             donID
//         );
        
//         functionsRequestToInvoice[s_lastRequestId] = 999;
        
//         emit DocumentVerificationRequested(999, s_lastRequestId);
        
//         return s_lastRequestId;
//     }
    
//     function ownerTestRequest() external onlyOwner returns (bytes32) {
//         FunctionsRequest.Request memory req;
//         req.initializeRequestForInlineJavaScript(source);
        
//         string[] memory args = new string[](8);
//         args[0] = "888";
//         args[1] = "owner_test_hash";
//         args[2] = "Gold";
//         args[3] = "100000";
//         args[4] = "Ghana";
//         args[5] = "UK";
//         args[6] = "Owner Test Exporter";
//         args[7] = "Owner Test Buyer";
//         req.setArgs(args);
        
//         s_lastRequestId = _sendRequest(
//             req.encodeCBOR(),
//             i_functionsSubscriptionId,
//             gasLimit,
//             donID
//         );
        
//         functionsRequestToInvoice[s_lastRequestId] = 888;
        
//         emit DocumentVerificationRequested(888, s_lastRequestId);
        
//         return s_lastRequestId;
//     }
    
//     // ============ FULFILLMENT - ✅ UPDATED TO NOTIFY CORE CONTRACT ============
//     function fulfillRequest(
//         bytes32 requestId,
//         bytes memory response,
//         bytes memory err
//     ) internal override {
//         s_lastResponse = response;
//         s_lastError = err;
        
//         emit FunctionsResponse(requestId, response, err);
        
//         uint256 invoiceId = functionsRequestToInvoice[requestId];
//         if (invoiceId == 0) return;
        
//         isVerified[invoiceId] = true;
//         verificationTimestamp[invoiceId] = block.timestamp;
        
//         bool validResult;
//         uint256 riskResult;
//         string memory ratingResult;
        
//         if (err.length == 0 && response.length > 0) {
//             string memory responseStr = string(response);
//             (validResult, riskResult, ratingResult) = _parseResponse(responseStr);
            
//             isValid[invoiceId] = validResult;
//             riskScore[invoiceId] = riskResult;
//             creditRating[invoiceId] = ratingResult;
//             verificationDetails[invoiceId] = "YieldX API verification completed";
            
//             emit DocumentVerificationCompleted(invoiceId, validResult, riskResult);
//         } else {
//             validResult = false;
//             riskResult = 99;
//             ratingResult = "ERROR";
            
//             isValid[invoiceId] = false;
//             riskScore[invoiceId] = 99;
//             creditRating[invoiceId] = "ERROR";
//             verificationDetails[invoiceId] = "API service error";
            
//             emit DocumentVerificationCompleted(invoiceId, false, 99);
//         }
        
//         // ✅ NOTIFY CORE CONTRACT OF VERIFICATION COMPLETION (if core is set)
//         if (coreContract != address(0)) {
//             try IYieldXCore(coreContract).onDocumentVerificationComplete(
//                 invoiceId,
//                 validResult,
//                 riskResult,
//                 ratingResult
//             ) {
//                 emit CoreContractUpdated(invoiceId, validResult, riskResult);
//             } catch {
//                 // Log error but don't revert to prevent stuck state
//                 verificationDetails[invoiceId] = "Core contract notification failed";
//             }
//         }
//     }
    
//     // ============ HELPER FUNCTIONS ============
//     function _parseResponse(string memory responseStr) internal pure returns (bool valid, uint256 risk, string memory rating) {
//         bytes memory responseBytes = bytes(responseStr);
        
//         valid = false;
//         risk = 99;
//         rating = "ERROR";
        
//         if (responseBytes.length < 5) return (valid, risk, rating);
        
//         uint256 firstComma = 0;
//         uint256 secondComma = 0;
        
//         for (uint i = 0; i < responseBytes.length; i++) {
//             if (responseBytes[i] == ',') {
//                 if (firstComma == 0) {
//                     firstComma = i;
//                 } else {
//                     secondComma = i;
//                     break;
//                 }
//             }
//         }
        
//         if (firstComma > 0 && secondComma > firstComma) {
//             if (responseBytes[0] == '1') {
//                 valid = true;
//             }
            
//             uint256 riskLength = secondComma - firstComma - 1;
//             if (riskLength == 2) {
//                 uint8 tens = uint8(responseBytes[firstComma + 1]) - 48;
//                 uint8 ones = uint8(responseBytes[firstComma + 2]) - 48;
//                 if (tens <= 9 && ones <= 9) {
//                     risk = tens * 10 + ones;
//                 }
//             } else if (riskLength == 1) {
//                 uint8 ones = uint8(responseBytes[firstComma + 1]) - 48;
//                 if (ones <= 9) {
//                     risk = ones;
//                 }
//             }
            
//             bytes memory ratingBytes = new bytes(responseBytes.length - secondComma - 1);
//             for (uint i = 0; i < ratingBytes.length; i++) {
//                 ratingBytes[i] = responseBytes[secondComma + 1 + i];
//             }
//             rating = string(ratingBytes);
//         }
        
//         return (valid, risk, rating);
//     }
    
//     // ============ VIEW FUNCTIONS ============
//     function getDocumentVerification(uint256 invoiceId) external view returns (
//         bool verified,
//         bool valid,
//         string memory details,
//         uint256 risk,
//         string memory rating,
//         uint256 timestamp
//     ) {
//         return (
//             isVerified[invoiceId],
//             isValid[invoiceId],
//             verificationDetails[invoiceId],
//             riskScore[invoiceId],
//             creditRating[invoiceId],
//             verificationTimestamp[invoiceId]
//         );
//     }
    
//     function getLastFunctionsResponse() external view returns (
//         bytes32 lastRequestId,
//         bytes memory lastResponse,
//         bytes memory lastError
//     ) {
//         return (s_lastRequestId, s_lastResponse, s_lastError);
//     }
    
//     function getApiEndpoint() external pure returns (string memory) {
//         return "https://yieldx.onrender.com/api/v1/verification/verify-minimal";
//     }
    
//     // ============ DEBUG FUNCTION ============
//     function getLastResponseDecoded() external view returns (string memory) {
//         return string(s_lastResponse);
//     }
    
//     // ✅ CORE CONTRACT GETTER
//     function getCoreContract() external view returns (address) {
//         return coreContract;
//     }
    
//     // ✅ REMOVED AUTHORIZATION CHECK - PUBLIC ACCESS
//     function isAuthorized(address caller) external pure returns (bool) {
//         return true; // Anyone can call verification
//     }
// }