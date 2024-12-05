import type { BigNumberish } from "ethers";

import { ethers } from "ethers"


export function fromReadableAmount(
    amount: number,
    decimals: number,
): BigNumberish {
    return ethers.parseUnits(amount.toString(), decimals)
}

export function toReadableAmount(rawAmount: number, decimals: number, sliceLen = 4): string {
    return ethers.formatUnits(rawAmount, decimals).slice(0, sliceLen)
}
