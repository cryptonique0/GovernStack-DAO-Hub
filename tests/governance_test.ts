import {
  Clarinet,
  Tx,
  Chain,
  Account,
  types
} from 'https://deno.land/x/clarinet@v1.0.0/index.ts';
import { assertEquals } from 'https://deno.land/std@0.90.0/testing/asserts.ts';

Clarinet.test({
  name: "Ensure that governance token can be transferred",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;
    const wallet1 = accounts.get('wallet_1')!;
    
    let block = chain.mineBlock([
      Tx.contractCall(
        'governance-token',
        'transfer',
        [
          types.uint(1000000),
          types.principal(deployer.address),
          types.principal(wallet1.address),
          types.none()
        ],
        deployer.address
      )
    ]);
    
    assertEquals(block.receipts.length, 1);
    assertEquals(block.receipts[0].result, '(ok true)');
  }
});

Clarinet.test({
  name: "Ensure that users can create proposals with sufficient tokens",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;
    
    let block = chain.mineBlock([
      Tx.contractCall(
        'governance-core',
        'create-proposal',
        [
          types.ascii("Test Proposal"),
          types.utf8("This is a test proposal"),
          types.principal(deployer.address),
          types.ascii("test-function"),
          types.list([])
        ],
        deployer.address
      )
    ]);
    
    assertEquals(block.receipts.length, 1);
    block.receipts[0].result.expectOk().expectUint(1);
  }
});

Clarinet.test({
  name: "Ensure that users can vote on active proposals",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;
    const wallet1 = accounts.get('wallet_1')!;
    
    // Create proposal
    let block = chain.mineBlock([
      Tx.contractCall(
        'governance-core',
        'create-proposal',
        [
          types.ascii("Test Proposal"),
          types.utf8("This is a test proposal"),
          types.principal(deployer.address),
          types.ascii("test-function"),
          types.list([])
        ],
        deployer.address
      )
    ]);
    
    // Vote on proposal
    block = chain.mineBlock([
      Tx.contractCall(
        'governance-core',
        'cast-vote',
        [
          types.uint(1),
          types.uint(1) // Vote for
        ],
        deployer.address
      )
    ]);
    
    assertEquals(block.receipts.length, 1);
    assertEquals(block.receipts[0].result, '(ok true)');
  }
});

Clarinet.test({
  name: "Ensure that staking works correctly",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;
    
    let block = chain.mineBlock([
      Tx.contractCall(
        'staking',
        'stake',
        [
          types.uint(1000000),
          types.uint(4320) // 1 month lock
        ],
        deployer.address
      )
    ]);
    
    assertEquals(block.receipts.length, 1);
    assertEquals(block.receipts[0].result, '(ok true)');
  }
});
