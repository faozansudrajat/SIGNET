import { ethers } from 'ethers';
import { BLOCKCHAIN_CONFIG, EIP712_DOMAIN, EIP712_TYPES } from '../config/blockchain';

/**
 * Encode registerContent function call
 */
export function encodeRegisterContent(pHash: string, title: string, description: string) {
    const iface = new ethers.Interface([
        'function registerContent(string _pHash, string _title, string _desc)'
    ]);

    return iface.encodeFunctionData('registerContent', [
        pHash,
        title,
        description
    ]);
}

/**
 * Encode addPublisher function call
 */
export function encodeAddPublisher(publisherAddress: string) {
    const iface = new ethers.Interface([
        'function addPublisher(address _clientWallet)'
    ]);

    return iface.encodeFunctionData('addPublisher', [publisherAddress]);
}

/**
 * Get nonce from backend
 */
export async function getNonce(userAddress: string) {
    const response = await fetch(
        `${BLOCKCHAIN_CONFIG.API_URL}/api/nonce/${userAddress}`
    );

    if (!response.ok) {
        throw new Error('Failed to fetch nonce');
    }

    const data = await response.json();
    return data.nonce;
}

/**
 * Build ForwardRequest struct for EIP-712
 */
export function buildForwardRequest(userAddress: string, encodedData: string, nonce: number) {
    return {
        from: userAddress,
        to: BLOCKCHAIN_CONFIG.REGISTRY_ADDRESS,
        value: 0,
        gas: 300000,
        nonce: nonce,
        data: encodedData
    };
}

/**
 * Sign ForwardRequest with EIP-712
 */
export async function signForwardRequest(signer: ethers.JsonRpcSigner, forwardRequest: any) {
    // Debug logging
    console.log('[signForwardRequest] Domain:', EIP712_DOMAIN);
    console.log('[signForwardRequest] Types:', EIP712_TYPES);
    console.log('[signForwardRequest] ForwardRequest:', forwardRequest);
    
    // Validate all required fields are present
    if (!EIP712_DOMAIN.verifyingContract) {
        throw new Error('EIP712_DOMAIN.verifyingContract is null/undefined. Check VITE_FORWARDER_ADDRESS in .env');
    }
    if (!forwardRequest.to) {
        throw new Error('ForwardRequest.to is null/undefined. Check VITE_REGISTRY_ADDRESS in .env');
    }
    
    const signature = await signer.signTypedData(
        EIP712_DOMAIN,
        EIP712_TYPES,
        forwardRequest
    );

    return signature;
}
