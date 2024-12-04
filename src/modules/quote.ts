import { ethers, Provider } from 'ethers'

import { computePoolAddress } from '@uniswap/v3-sdk'
import Quoter from '@uniswap/v3-periphery/artifacts/contracts/lens/Quoter.sol/Quoter.json'
import IUniswapV3PoolABI from '@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json'


import { type Token } from '@uniswap/sdk-core'
import { QUOTER_CONTRACT_ADDRESS, POOL_FACTORY_CONTRACT_ADDRESS } from './constants'
import { fromReadableAmount, toReadableAmount } from './utils'
import { SwapConfig } from './config'

export async function quote(
    inputAmout: number,
    token0: Token,
    token1: Token,
): Promise<string> {
    const quoterContract = new ethers.Contract(
        QUOTER_CONTRACT_ADDRESS,
        Quoter.abi,
        getProvider(),
    )

    const poolConstants = await getPoolConstants(token0, token1)

    const quotedAmountOut = await quoterContract
        .getFunction('quoteExactInputSingle')
        .staticCall(
            token0.address,
            token1.address,
            poolConstants.fee,
            fromReadableAmount(Number(inputAmout), token0.decimals).toString(),
            0,
        )

    return toReadableAmount(quotedAmountOut, token1.decimals)
}

async function getPoolConstants(
    tokenIn0: Token,
    tokenIn1: Token,
): Promise<{
    tokenOut0: Token
    tokenOut1: Token
    fee: number
}> {
    const currentPoolAddress = computePoolAddress({
        factoryAddress: POOL_FACTORY_CONTRACT_ADDRESS,
        tokenA: tokenIn0,
        tokenB: tokenIn1,
        fee: SwapConfig.tokens.poolFee,
    })

    const poolContract = new ethers.Contract(
        currentPoolAddress,
        IUniswapV3PoolABI.abi,
        getProvider(),
    )

    const [tokenOut0, tokenOut1, fee] = await Promise.all([
        poolContract.token0(),
        poolContract.token1(),
        poolContract.fee(),
    ])

    return {
        tokenOut0,
        tokenOut1,
        fee,
    }
}

export function getProvider(): Provider {
    return new ethers.JsonRpcProvider(SwapConfig.rpc.local)
}