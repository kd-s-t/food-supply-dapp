/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Inject, Injectable } from '@nestjs/common';
import { ethers } from 'ethers';
import SupplyChainABI from '../abis/SupplyChain.json';
import * as dotenv from 'dotenv';
import Redis from 'ioredis';

dotenv.config();

@Injectable()
export class SupplyService {
  private provider: ethers.JsonRpcProvider;
  private contract: ethers.Contract;

  constructor(@Inject('REDIS_CLIENT') private readonly cacheManager: Redis) {
    this.provider = new ethers.JsonRpcProvider(process.env.WEB3_PROVIDER);
    const contractAddress = process.env.CONTRACT_ADDRESS as string;

    this.contract = new ethers.Contract(
      contractAddress,
      SupplyChainABI.abi,
      this.provider,
    );
  }

  async getAllSupplies() {
    const cached = await this.cacheManager.get('supplies');
    if (cached) {
      console.log('Serving from cache');
      return JSON.parse(cached);
    }

    const supplies = await this.contract.getSupplies();
    const formatted = supplies.map((supply: any) => ({
      name: supply.name,
      description: supply.description,
      quantity: supply.quantity.toString(),
      provider: supply.provider,
      addedBy: supply.addedBy,
      state: supply.state.toString(),
    }));

    await this.cacheManager.set(
      'supplies',
      JSON.stringify(formatted),
      'EX',
      60,
    );
    return formatted;
  }

  async addSupply(
    name: string,
    description: string,
    quantity: number,
    provider: string,
    addedBy: string,
  ) {
    const signer = await this.provider.getSigner(0);
    const contractWithSigner = this.contract.connect(signer) as ethers.Contract;

    const tx = await contractWithSigner.addSupply(
      name,
      description,
      quantity,
      provider,
      addedBy,
    );

    await tx.wait();

    await this.cacheManager.del('supplies');

    return { success: true, txHash: tx.hash };
  }
}
